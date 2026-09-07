const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const messages = require('../app/i18n/dictionaries/en.json');
function loadModule(file, requireModule) {
  const compiled = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const context = { exports: {}, require: requireModule };
  vm.runInNewContext(compiled, context);
  return context.exports;
}
const languages = loadModule('app/i18n/languages.ts');
const { translator, localizePath, isLocale } = loadModule('app/i18n/shared.ts', () => languages);
const dictionaries = Object.fromEntries(languages.locales.map(locale => {
  const file = path.join(root, `app/i18n/dictionaries/${locale}.json`);
  return [locale, fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {}];
}));
const { getDictionary, getTranslator } = loadModule('app/i18n/dictionaries.server.ts', id => {
  if (id === 'react') return { cache: fn => fn };
  if (id === './shared') return { translator };
  return require(path.join(root, 'app/i18n', id));
});

test('every advertised locale loads its available dictionary without missing-module errors', async () => {
  for (const locale of languages.locales) {
    const dictionary = await getDictionary(locale);
    // Also catches newly generated dictionaries that have not been registered.
    assert.equal(JSON.stringify(dictionary), JSON.stringify(dictionaries[locale] ?? {}), locale);
    const t = await getTranslator(locale);
    assert.equal(t('Sign in'), dictionary['Sign in'] ?? 'Sign in', locale);
    assert.equal(t('Untranslated {name}', { name: 'example' }), 'Untranslated example', locale);
  }
});

test('locale links preserve destinations and never duplicate language prefixes', () => {
  for (const locale of languages.locales.filter(locale => locale !== 'en')) {
    assert.equal(localizePath('/', locale), `/${locale}`);
    assert.equal(localizePath('/signup/client?created=1#form', locale), `/${locale}/signup/client?created=1#form`);
    assert.equal(localizePath('/ml/workspace', locale), `/${locale}/workspace`);
    assert.equal(localizePath(`/${locale}`, 'en'), '/');
    assert.equal(localizePath(`/${locale}?created=1`, 'en'), '/?created=1');
    for (const external of ['https://example.com', '//example.com', 'mailto:hello@example.com', '#journey']) assert.equal(localizePath(external, locale), external);
  }
  assert.equal(isLocale('de'), false);
  assert.equal(isLocale('ml'), true);
});

test('every supported language has complete messages and matching placeholders', () => {
  assert.equal(languages.locales.length, 23);
  for (const [locale, dictionary] of Object.entries(dictionaries)) {
    assert.deepEqual(Object.keys(dictionary).sort(), Object.keys(messages).sort(), `${locale}: coverage`);
    for (const [key, value] of Object.entries(dictionary)) {
      assert.ok(Object.hasOwn(messages, key), `${locale}: unknown message: ${key}`);
      assert.ok(typeof value === 'string' && value.trim(), `${locale}: ${key}`);
      assert.deepEqual((value.match(/\{\w+\}/g) || []).sort(), (key.match(/\{\w+\}/g) || []).sort(), `${locale}: placeholders: ${key}`);
      assert.doesNotMatch(value, /ZXQ|90000\d|\[\d{4}\]|<unk>|\uFFFD/i, `${locale}: translation artifact: ${key}`);
    }
    if (locale !== 'en') assert.notEqual(dictionary['Sign in'], 'Sign in', `${locale}: untranslated interface`);
    assert.equal(languages.languageDirection(locale), ['ur', 'ks', 'sd'].includes(locale) ? 'rtl' : 'ltr');
  }
  assert.equal(translator('en')('Sign in'), 'Sign in');
  assert.equal(translator('hi', dictionaries.hi)('Create {type} account', { type: 'क्लाइंट' }), 'क्लाइंट खाता बनाएँ');
});

test('core interface labels use the intended native script for each locale', () => {
  const scripts = {
    hi: 'Devanagari', mr: 'Devanagari', mai: 'Devanagari', ne: 'Devanagari',
    kok: 'Devanagari', doi: 'Devanagari', brx: 'Devanagari', sa: 'Devanagari',
    bn: 'Bengali', as: 'Bengali', te: 'Telugu', ta: 'Tamil', ml: 'Malayalam',
    gu: 'Gujarati', kn: 'Kannada', or: 'Oriya', pa: 'Gurmukhi',
    sat: 'Ol_Chiki', mni: 'Meetei_Mayek', ur: 'Arabic', ks: 'Arabic', sd: 'Arabic',
  };
  for (const [locale, script] of Object.entries(scripts)) {
    for (const key of ['Language', 'Sign in', 'Build Your Brand.', 'Create {type} account']) {
      assert.match(dictionaries[locale][key], new RegExp(`\\p{Script=${script}}`, 'u'), `${locale}: ${key}`);
    }
  }
});

test('English dictionary supplies copy and missing messages still interpolate safely', () => {
  assert.equal(translator('en', { Greeting: 'Hello {name}' })('Greeting', { name: 'Anand' }), 'Hello Anand');
  assert.equal(translator('bn', {})('Create {type} account', { type: 'client' }), 'Create client account');
});

test('visible labels and validation errors have translations; brand names and data stay literal', () => {
  const literal = new Set(['5D', 'WhatsApp', 'mail@vaniyathans.com ↗', 'support@vaniyathans.com', 'you@company.com', 'you@example.com', '₹1L–₹5L', '₹5L–₹15L', '₹15L–₹50L', '₹50L+', 'https://linkedin.com/in/your-profile', 'V', 'AK', 'MS', 'RV', 'NJ', 'Anand K.', 'Maya S.', 'Rahul V.', 'Nina J.', 'Priya S.']);
  for (const file of ['LandingPage.tsx', 'SiteHeader.tsx', 'HeroCarousel.tsx', 'PitchNavigation.tsx', 'signup/AccountChoice.tsx', 'signup/SignupFlow.tsx', 'signin/SigninForm.tsx', 'workspace/page.tsx']) {
    const source = ts.createSourceFile(file, fs.readFileSync(path.join(root, 'app', file), 'utf8'), ts.ScriptTarget.Latest, true);
    const visit = node => {
      if (ts.isCallExpression(node) && ['t', 'setError'].includes(node.expression.getText(source)) && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
        const key = node.arguments[0].text.replace(/\s+/g, ' ').trim();
        assert.ok(!key || messages[key] || literal.has(key), `${file}: missing ${key}`);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
});
