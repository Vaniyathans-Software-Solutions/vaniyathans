/** Generate static dictionaries with IndicTrans2 ONNX; see app/i18n/README.md. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runtime = process.env.INDICTRANS_RUNTIME;
const modelDir = process.env.INDICTRANS_MODEL;
if (!runtime || !modelDir) throw new Error('Set INDICTRANS_RUNTIME and INDICTRANS_MODEL to the local runtime and model directories.');
const require = createRequire(path.join(runtime, 'package.json'));
const ort = require('onnxruntime-node');
const { PreTrainedTokenizer } = require('@huggingface/transformers');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const srcData = read(path.join(modelDir, 'tokenizer_src.json'));
const tokenizerMeta = read(path.join(modelDir, 'tokenizer_meta.json'));
const src = new PreTrainedTokenizer(srcData, {});
const tgtData = read(path.join(modelDir, 'tokenizer_tgt.json'));
const tgt = new PreTrainedTokenizer(tgtData, {});
const tags = Object.fromEntries(srcData.added_tokens.map(({ content, id }) => [content, id]));
const options = { executionProviders: ['cpu'], intraOpNumThreads: 4, interOpNumThreads: 1 };
const enc = await ort.InferenceSession.create(path.join(modelDir, 'encoder_model.onnx'), options);
const dec = await ort.InferenceSession.create(path.join(modelDir, 'decoder_model.onnx'), options);
const past = await ort.InferenceSession.create(path.join(modelDir, 'decoder_with_past_model.onnx'), options);
const layers = (dec.outputNames.length - 1) / 4;
const targets = { hi: 'hin_Deva', ml: 'mal_Mlym', ta: 'tam_Taml', bn: 'ben_Beng', te: 'tel_Telu', mr: 'mar_Deva', ur: 'urd_Arab', gu: 'guj_Gujr', kn: 'kan_Knda', or: 'ory_Orya', pa: 'pan_Guru', as: 'asm_Beng', mai: 'mai_Deva', sat: 'sat_Olck', ks: 'kas_Arab', ne: 'npi_Deva', sd: 'snd_Arab', kok: 'gom_Deva', doi: 'doi_Deva', mni: 'mni_Mtei', brx: 'brx_Deva', sa: 'san_Deva' };
const scriptStarts = { ml: 0xd00, ta: 0xb80, bn: 0x980, as: 0x980, te: 0xc00, gu: 0xa80, kn: 0xc80, or: 0xb00, pa: 0xa00 };
const nativeScripts = { ml: 'Malayalam', ta: 'Tamil', bn: 'Bengali', as: 'Bengali', te: 'Telugu', gu: 'Gujarati', kn: 'Kannada', or: 'Oriya', pa: 'Gurmukhi', sat: 'Ol_Chiki', mni: 'Meetei_Mayek', ur: 'Arabic', ks: 'Arabic', sd: 'Arabic' };
const otherScripts = script => new RegExp(`[^\\p{Script=${script}}\\p{Script=Latin}\\p{Script=Common}\\p{Script=Inherited}]`, 'u');
const candidates = new Map();
function tokenCandidates(locale) {
  // IndicTrans2 unifies most scripts into Devanagari internally. Restrict
  // decoding to that script (or Arabic/Ol Chiki/Meetei) before transliteration.
  const script = ['sat', 'mni', 'ur', 'ks', 'sd'].includes(locale) ? nativeScripts[locale] : 'Devanagari';
  if (!candidates.has(script)) {
    const foreign = otherScripts(script);
    candidates.set(script, Object.entries(tgtData.model.vocab)
      .filter(([token, id]) => id < tokenizerMeta.tgt_dict_size && !foreign.test(token))
      .map(([, id]) => id));
  }
  return candidates.get(script);
}
function tamilOffset(offset, locale) {
  if (locale !== 'ta') return offset;
  if (offset >= 0x15 && offset <= 0x28 && offset !== 0x1c && ![0, 4].includes((offset - 0x15) % 5)) return 0x15 + 5 * Math.floor((offset - 0x15) / 5);
  if ([0x2b, 0x2c, 0x2d].includes(offset)) return 0x2a;
  return offset === 0x36 ? 0x37 : offset;
}
function nativeScript(text, locale) {
  const start = scriptStarts[locale];
  let value = start ? text.replace(/[\u0900-\u0963\u0966-\u096f]/g, c => String.fromCodePoint(tamilOffset(c.codePointAt(0) - 0x900, locale) + start)) : text;
  if (locale === 'as') value = value.replace(/র/g, 'ৰ');
  if (locale === 'mni') value = value.replace(/\s*\uABED\s*/g, '\uABED');
  return value;
}
const tensor = (values, dims) => new ort.Tensor('int64', BigInt64Array.from(values.map(BigInt)), dims);
async function translateBatch(texts, locale) {
  const allowedTokens = tokenCandidates(locale);
  const sequences = texts.map(text => [tags.eng_Latn, tags[targets[locale]], ...Array.from(src(' ' + text).input_ids.data, Number)]
    .map(id => id < tokenizerMeta.src_dict_size ? id : tokenizerMeta.unk_id));
  const width = Math.max(...sequences.map(x => x.length));
  const ids = sequences.flatMap(x => [...x, ...Array(width - x.length).fill(1)]);
  const mask = tensor(sequences.flatMap(x => [...x.map(() => 1), ...Array(width - x.length).fill(0)]), [texts.length, width]);
  const hidden = (await enc.run({ input_ids: tensor(ids, [texts.length, width]), attention_mask: mask })).last_hidden_state;
  let next = Array(texts.length).fill(2), previous;
  const outputs = texts.map(() => []), done = texts.map(() => false);
  for (let step = 0; step < 256; step++) {
    const feed = { input_ids: tensor(next, [texts.length, 1]), encoder_attention_mask: mask };
    if (step === 0) feed.encoder_hidden_states = hidden;
    else for (let layer = 0; layer < layers; layer++) for (const side of ['decoder', 'encoder']) for (const kind of ['key', 'value']) {
      feed[`past_key_values.${layer}.${side}.${kind}`] = previous[`present.${layer}.${side}.${kind}`];
    }
    const result = await (step === 0 ? dec : past).run(feed);
    const { data, dims } = result.logits;
    const vocab = dims[2];
    next = texts.map((_, row) => {
      // Prevent greedy decoding from looping on short UI labels and names.
      const tokens = outputs[row];
      const banned = new Set();
      if (tokens.length >= 2) {
        for (let i = 0; i < tokens.length - 2; i++) {
          if (tokens[i] === tokens.at(-2) && tokens[i + 1] === tokens.at(-1)) banned.add(tokens[i + 2]);
        }
      }
      let best = 0, score = -Infinity;
      for (const id of banned) data[row * vocab + id] = -Infinity;
      for (const id of allowedTokens) if (data[row * vocab + id] > score) { score = data[row * vocab + id]; best = id; }
      if (!done[row]) outputs[row].push(best);
      if (best === 2) done[row] = true;
      return done[row] ? 2 : best;
    });
    previous = result;
    if (done.every(Boolean)) break;
  }
  if (!done.every(Boolean)) throw new Error(`${locale}: generation exceeded token limit: ${texts.filter((_, i) => !done[i]).join('; ')}`);
  return outputs.map(ids => nativeScript(tgt.decode(ids, { skip_special_tokens: true }), locale).trim());
}
function normalizeDigits(text) {
  return text.replace(/\p{Nd}/gu, c => {
    const code = c.codePointAt(0);
    for (const zero of [0x660, 0x6f0, 0x966, 0x9e6, 0xa66, 0xae6, 0xb66, 0xbe6, 0xc66, 0xce6, 0xd66, 0x1c50, 0xabf0]) if (code >= zero && code < zero + 10) return String(code - zero);
    return c;
  });
}
const source = read(path.join(root, 'app/i18n/dictionaries/en.json'));
const protectedPattern = /\{\w+\}|Vaniyathans|VSS(?:-\d+)?|Google|LinkedIn|GitHub|WhatsApp/g;
const args = process.argv.slice(2);
const refreshTerms = args.includes('--refresh-terms');
const refreshInvalid = args.includes('--refresh-invalid');
const requested = args.filter(arg => !['--refresh-terms', '--refresh-invalid'].includes(arg));
if (requested[0] === '--smoke') {
  for (const locale of requested.length > 1 ? requested.slice(1) : Object.keys(targets)) console.log(locale, await translateBatch(['Build Your Brand.', 'Sign in', 'Create 900001 account'], locale));
} else for (const locale of requested.length ? requested : Object.keys(targets)) {
  if (!targets[locale]) throw new Error(`Unsupported generation target: ${locale}`);
  const file = path.join(root, `app/i18n/dictionaries/${locale}.json`);
  const dictionary = fs.existsSync(file) ? read(file) : {};
  const missing = Object.keys(source).filter(key => !dictionary[key] ||
    (refreshTerms && /Vaniyathans|VSS|Google|LinkedIn|GitHub|WhatsApp/.test(source[key])) ||
    (refreshInvalid && otherScripts(nativeScripts[locale] ?? 'Devanagari').test(dictionary[key])));
  for (let i = 0; i < missing.length; i += 8) {
    const keys = missing.slice(i, i + 8);
    const placeholders = keys.map(key => source[key].match(protectedPattern) || []);
    const texts = keys.map((key) => { let n = 0; return source[key].replace(protectedPattern, () => String(900001 + n++)); });
    const values = await translateBatch(texts, locale);
    for (let row = 0; row < keys.length; row++) {
      let value = values[row];
      if (placeholders[row].length) {
        value = normalizeDigits(value);
        placeholders[row].forEach((token, n) => { value = value.replaceAll(String(900001 + n), token); });
        if (JSON.stringify((value.match(protectedPattern) || []).sort()) !== JSON.stringify([...placeholders[row]].sort())) {
          const pieces = source[keys[row]].split(/(\{\w+\}|Vaniyathans|VSS(?:-\d+)?|Google|LinkedIn|GitHub|WhatsApp)/g);
          value = '';
          for (const piece of pieces) value += /^(?:\{\w+\}|Vaniyathans|VSS(?:-\d+)?|Google|LinkedIn|GitHub|WhatsApp)$/.test(piece) || !/\p{L}/u.test(piece) ? piece : (piece.startsWith(' ') ? ' ' : '') + (await translateBatch([piece.trim()], locale))[0] + (piece.endsWith(' ') ? ' ' : '');
        }
      }
      if (!value.trim() || /90000\d/.test(value)) throw new Error(`${locale}: invalid output for ${keys[row]}`);
      dictionary[keys[row]] = value;
    }
    fs.writeFileSync(file + '.tmp', JSON.stringify(dictionary, null, 2) + '\n');
    fs.renameSync(file + '.tmp', file);
    console.log(`${locale}: ${Object.keys(dictionary).length}/${Object.keys(source).length}${refreshTerms || refreshInvalid ? `; refreshed ${Math.min(i + 8, missing.length)}/${missing.length}` : ''}`);
  }
}
