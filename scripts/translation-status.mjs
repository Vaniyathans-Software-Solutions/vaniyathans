import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(
  fs.readFileSync(path.join(root, 'app/i18n/languages.ts'), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText, context);
const { locales, languageEnglishNames } = context.exports;
const messages = Object.keys(JSON.parse(fs.readFileSync(path.join(root, 'app/i18n/dictionaries/en.json'), 'utf8')));
const rows = locales.map(locale => {
  const file = path.join(root, `app/i18n/dictionaries/${locale}.json`);
  const exists = fs.existsSync(file);
  const dictionary = exists ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  const translated = messages.filter(key =>
    typeof dictionary[key] === 'string' && dictionary[key].trim(),
  ).length;
  return {
    Locale: locale,
    Language: languageEnglishNames[locale],
    Entries: `${translated}/${messages.length}`,
    Missing: messages.length - translated,
    Status: locale === 'en' ? 'Source' : !exists ? 'Missing dictionary' :
      translated === messages.length ? 'Complete coverage' : 'Partial',
  };
});
console.table(rows);
console.log('Coverage counts populated messages, not linguistic quality. Missing messages use English.');
if (process.argv.includes('--strict') && rows.some(row => row.Missing > 0)) process.exitCode = 1;
