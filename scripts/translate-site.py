"""Prepare static translation dictionaries from public English UI copy.

No visitor input or account data is sent. The deployed website does not call
this service. Existing translations are retained; output needs editorial review.
"""
import concurrent.futures
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'app/i18n/dictionaries'
OUT.mkdir(exist_ok=True)
SOURCE = json.loads((OUT / 'en.json').read_text())
TARGETS = {'hi': 'hi', 'ml': 'ml', 'ta': 'ta', 'bn': 'bn', 'te': 'te', 'mr': 'mr', 'ur': 'ur', 'gu': 'gu', 'kn': 'kn',
           'or': 'or', 'pa': 'pa', 'as': 'as', 'mai': 'mai', 'sat': 'sat', 'ne': 'ne',
           'sd': 'sd', 'kok': 'gom', 'doi': 'doi', 'mni': 'mni-Mtei', 'sa': 'sa'}


def request_translation(text, target):
    url = 'https://translate.googleapis.com/translate_a/single?' + urllib.parse.urlencode(
        {'client': 'gtx', 'sl': 'en', 'tl': target, 'dt': 't', 'q': text})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(url, timeout=35) as response:
                data = json.load(response)
            return ''.join(part[0] or '' for part in data[0])
        except Exception:
            if attempt == 3:
                raise
            time.sleep(2 ** attempt)


def translate(locale, target):
    file = OUT / f'{locale}.json'
    results = json.loads(file.read_text()) if file.exists() else {}
    missing = [(index, key) for index, key in enumerate(SOURCE) if key not in results]
    batches, batch, length = [], [], 0
    for index, key in missing:
        if length + len(key) > 1300 and batch:
            batches.append(batch)
            batch, length = [], 0
        batch.append((index, key))
        length += len(key) + 10
    if batch:
        batches.append(batch)
    for batch in batches:
        placeholders = {}

        def protect(match):
            token = f'ZXQ{len(placeholders)}ZXQ'
            placeholders[token] = match[0]
            return token

        prepared = '\n'.join(f'[{index:04d}] ' + re.sub(r'\{\w+\}', protect, SOURCE[key]) for index, key in batch)
        translated = request_translation(prepared, target)
        chunks = re.split(r'\[\s*(\d{4})\s*\]', translated)
        rows = {int(chunks[i]): chunks[i + 1].strip() for i in range(1, len(chunks) - 1, 2)}
        for index, key in batch:
            value = rows.get(index, '')
            for token, original in placeholders.items():
                value = re.sub(re.escape(token), lambda _: original, value, flags=re.I)
            if not value or sorted(re.findall(r'\{\w+\}', key)) != sorted(re.findall(r'\{\w+\}', value)):
                # Retry separately; keep placeholders out of translated text entirely.
                pieces = re.split(r'(\{\w+\})', SOURCE[key])
                value = ''.join(piece if re.fullmatch(r'\{\w+\}', piece) else
                                (' ' if piece.startswith(' ') else '') + request_translation(piece.strip(), target).strip() +
                                (' ' if piece.endswith(' ') else '') if piece.strip() else piece for piece in pieces)
            if not value.strip():
                raise ValueError(f'Empty translation: {locale} {key}')
            results[key] = value.strip()
        file.write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n')
        print(f'{locale}: {len(results)}/{len(SOURCE)}', flush=True)
        time.sleep(.5)
    return locale


if __name__ == '__main__':
    requested = sys.argv[1:] or list(TARGETS)
    unknown = set(requested) - TARGETS.keys()
    if unknown:
        raise SystemExit('Use the local IndicTrans2 generator for: ' + ', '.join(sorted(unknown)))
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        tasks = {pool.submit(translate, locale, TARGETS[locale]): locale for locale in requested}
        failures = []
        for task in concurrent.futures.as_completed(tasks):
            try:
                print('Completed', task.result(), flush=True)
            except Exception as error:
                failures.append(tasks[task])
                print('FAILED', tasks[task], str(error), flush=True)
        if failures:
            raise SystemExit('Incomplete languages: ' + ', '.join(failures))
