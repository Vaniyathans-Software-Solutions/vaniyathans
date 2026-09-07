"""Download open-source Noto fonts and licenses for the supported scripts."""
import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FAMILIES = ['Noto Sans Bengali', 'Noto Sans Telugu', 'Noto Sans Gujarati', 'Noto Sans Kannada',
            'Noto Sans Oriya', 'Noto Sans Gurmukhi', 'Noto Sans Ol Chiki', 'Noto Sans Meetei Mayek', 'Noto Naskh Arabic']

def fetch(url):
    with urllib.request.urlopen(url, timeout=60) as response:
        return response.read()

css = []
for family in FAMILIES:
    slug = family.lower().replace(' ', '')
    stem = family.lower().replace(' ', '-')
    entries = json.loads(fetch(f'https://api.github.com/repos/google/fonts/contents/ofl/{slug}'))
    font = next(entry for entry in entries if entry['name'].endswith('.ttf'))
    license_file = next(entry for entry in entries if entry['name'] == 'OFL.txt')
    (ROOT / f'public/fonts/{stem}.ttf').write_bytes(fetch(font['download_url']))
    (ROOT / f'public/fonts/{stem}-LICENSE.txt').write_bytes(fetch(license_file['download_url']))
    css.append(f"@font-face {{ font-family: '{family}'; font-style: normal; font-weight: 100 900; font-display: swap; src: url('/fonts/{stem}.ttf') format('truetype'); }}")
    print(family, 'downloaded', flush=True)
(ROOT / 'app/i18n/additional-fonts.css').write_text('\n'.join(css) + '\n')
