"""Bindet den Lernwelt-Look in die Apps ein (einmal ausführen, danach wiederholbar).

- ersetzt die Leiste #lw-bar durch die neue Leiste (Zurück, Fach, Heft)
- fügt nach dem Haupt-<style> der App lernwelt-app.css, lernwelt-app.js, die Schriften und <style id="lw-look"> ein
Die Regeln für jede App stehen in tools/looks/<app>.css.
"""
import re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
APPS = {'rechenheft': 'ma', 'terme': 'ma', 'englisch': 'en', 'bio-expedition': 'bio',
        'pflanzenzelle': 'bio', 'atlas': 'geo', 'noten': 'mu'}
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Atkinson+Hyperlegible:wght@400;700&display=swap">')
BACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>'
START, END = '<!--lw-look-->', '<!--/lw-look-->'

for app, cls in APPS.items():
    p = ROOT / f'{app}.html'
    s = p.read_text()
    m = re.search(r'<nav id="lw-bar".*?</nav>', s, re.S)
    label = re.sub(r'<[^>]+>', '', re.search(r'<span[^>]*>([^<]*)</span>\s*</nav>|<span class="lw-eyebrow">([^<]*)</span>', m.group(0)).group(0))
    fach, heft = [x.strip() for x in label.split('·', 1)] if '·' in label else (label, '')
    if 'lw-name' in m.group(0):
        fach = re.search(r'class="lw-eyebrow">([^<]*)<', m.group(0)).group(1)
        heft = re.search(r'class="lw-name">([^<]*)<', m.group(0)).group(1)
    bar = (f'<nav id="lw-bar" class="lw-bar lw-{cls}" aria-label="Lernwelt">'
           f'<a class="lw-back" href="index.html#heft-{app}" aria-label="Zurück zum Heft">{BACK}</a>'
           f'<span class="lw-t"><span class="lw-eyebrow">{fach}</span><span class="lw-name">{heft}</span></span></nav>')
    s = s[:m.start()] + bar + s[m.end():]
    look = (ROOT / 'tools' / 'looks' / f'{app}.css').read_text()
    if '@kit' in look:  # die App benutzt die gemeinsamen Übungs-Bausteine (.opt, .fb, .go …)
        look = (ROOT / 'tools' / 'looks' / '_kit.css').read_text() + look
    block = f'{START}<link rel="stylesheet" href="/lernwelt-app.css"><script src="/lernwelt-app.js"></script>{FONTS}<style id="lw-look">\n{look}</style>{END}'
    if START in s:
        s = re.sub(re.escape(START) + '.*?' + re.escape(END), lambda _: block, s, flags=re.S)
    else:
        styles = [mm for mm in re.finditer(r'<style[^>]*>.*?</style>', s, re.S)]
        big = max(styles, key=lambda mm: len(mm.group(0)))
        s = s[:big.end()] + block + s[big.end():]
    p.write_text(s)
    print(app, 'ok', fach, '|', heft)
