# Translation status

Run `npm run i18n:status` to see dictionary coverage for every advertised locale.
Run `npm run i18n:status -- --strict` to fail when any locale has missing messages.
Run `node --test tests/i18n.test.cjs` to check loading, message validity,
interpolation, and localized links.

`dictionaries/en.json` is the canonical source dictionary. Each of the 23
supported locales has its own JSON file with the same 470 English message keys.
Edit English copy in `en.json`, then update the corresponding translations.
`messages.json` is the earlier seed catalog and is no longer used by generation,
coverage checks, or the site runtime.

Hindi, Malayalam, and Tamil retain their existing translations. Bengali retains
its eight existing entries; its remaining entries and the other 18 dictionaries
were generated from English using the local IndicTrans2 ONNX model. These are
machine translation drafts. Complete key coverage does not certify linguistic
accuracy: a speaker of each language should review the copy, especially short
UI labels, brand names, technical terms, and phrases split across elements.

Routes remain available for every locale. Missing message keys still fall back
to their English source key. The selected locale, document direction, and
localized links are preserved. Urdu, Kashmiri, and Sindhi use right-to-left text.

To add translations, create `dictionaries/<locale>.json` with English message
keys from `dictionaries/en.json`, then add an explicit import to `dictionaryLoaders`
in `dictionaries.server.ts`. Preserve placeholders such as `{name}` exactly.
The loading test detects dictionaries that exist but are not registered.

`scripts/translate-site.py` can generate drafts through Google Translate.
`scripts/translate-site-local.mjs` can generate drafts with a local IndicTrans2
ONNX model, using `INDICTRANS_RUNTIME` and `INDICTRANS_MODEL` for the runtime
and model directories. Both scripts preserve existing entries. Generated copy
needs language review before being considered finished.

Example local generation (supply your own runtime and model paths):

```sh
INDICTRANS_RUNTIME=/path/to/runtime INDICTRANS_MODEL=/path/to/model node scripts/translate-site-local.mjs bn sa
```

The local runtime needs `onnxruntime-node` and `@huggingface/transformers`. The
model directory needs the encoder, decoder, decoder-with-past ONNX models and
their external data, plus `tokenizer_src.json`, `tokenizer_tgt.json`, and
`tokenizer_meta.json`. Generation resumes at missing entries; do not run two
generators against the same locale at once. Runtime pages read static JSON and
do not call a translation service or model.

## Fonts

Audiowide supports Latin and Latin Extended, with one regular 400 weight. It
does **not** include the Indian scripts used here. Adding a `next/font` subset
or applying CSS cannot add missing glyphs.

The site already self-hosts these locale fonts, selected in `locale.css`:

| Languages | Font |
| --- | --- |
| English | Audiowide |
| Hindi, Marathi, Maithili, Nepali, Konkani, Dogri, Bodo, Sanskrit | Noto Sans Devanagari |
| Bengali, Assamese | Noto Sans Bengali |
| Telugu | Noto Sans Telugu |
| Tamil | Noto Sans Tamil |
| Malayalam | Noto Sans Malayalam |
| Gujarati | Noto Sans Gujarati |
| Kannada | Noto Sans Kannada |
| Odia | Noto Sans Oriya |
| Punjabi | Noto Sans Gurmukhi |
| Santali | Noto Sans Ol Chiki |
| Manipuri | Noto Sans Meetei Mayek |
| Urdu, Kashmiri, Sindhi | Noto Naskh Arabic |

Recommended: retain Audiowide for English and Latin branding, and use these Noto
families for native text. For a more uniform design, use Noto Sans for English
as well, alongside the script-specific Noto families. A matching custom display
font collection is another option, but requires specialist type design for
each script. Browser/system fallbacks are a last resort because appearance and
script coverage vary between devices.

Font files and licenses are in `public/fonts`. Loading is demand-driven through
CSS font faces. Preserve natural script spacing and sufficient line height;
test mobile wrapping and Arabic shaping with native-language reviewers.

Sources: [Audiowide metadata](https://github.com/google/fonts/blob/main/ofl/audiowide/METADATA.pb),
[Noto fonts](https://fonts.google.com/noto),
[Noto Naskh Arabic language coverage](https://github.com/google/fonts/blob/main/ofl/notonaskharabic/METADATA.pb),
[IndicTrans2 supported languages](https://github.com/AI4Bharat/IndicTrans2#indictrans2).
