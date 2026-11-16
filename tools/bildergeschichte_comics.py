"""Zeichnet die Comic-Bilder für das Heft Bildergeschichte (bilder/bg/<geschichte>-<n>.svg).
Einmal ausführen: python3 tools/bildergeschichte_comics.py
Alle Figuren aus denselben Bausteinen, damit die Bilder einheitlich aussehen."""
import pathlib
OUT = pathlib.Path(__file__).resolve().parent.parent / 'bilder' / 'bg'
O = '#2B2B33'; SK = '#F6CBA4'; WH = '#FFF7EC'
SW = 'stroke="%s" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"' % O
F = 'font-family="Fredoka,Trebuchet MS,system-ui,sans-serif" font-weight="700"'

def person(cx, fy, expr='happy', arms='down', look=0, jacket='#F2B632', pants='#3B5BA9', hair='#7A4A26',
           style='boy', scale=1.0, scarf='#E0463A', hat=None):
    s = [f'<g transform="translate({cx} {fy}) scale({scale}) translate({-cx} {-fy})">']
    hip = fy - 58; sh = fy - 112; hy = fy - 142
    if style == 'girl' or style == 'mom':
        # Rock / Kleid-Saum
        s.append(f'<path d="M{cx-12} {hip} L{cx-15} {fy-6} M{cx+12} {hip} L{cx+15} {fy-6}" stroke="{pants}" stroke-width="13" stroke-linecap="round"/>')
    else:
        s.append(f'<path d="M{cx-12} {hip} L{cx-16} {fy-6} M{cx+12} {hip} L{cx+16} {fy-6}" stroke="{pants}" stroke-width="16" stroke-linecap="round"/>')
    s.append(f'<ellipse cx="{cx-20}" cy="{fy-2}" rx="13" ry="6" fill="#33343C"/><ellipse cx="{cx+20}" cy="{fy-2}" rx="13" ry="6" fill="#33343C"/>')
    # Rücken-Haare (Zopf) hinter dem Körper
    if style == 'girl':
        s.append(f'<path d="M{cx+18-look} {hy-6} q34 10 26 56 q-14 -8 -20 -30 z" fill="{hair}" {SW}/>')
    if style == 'mom':
        s.append(f'<circle cx="{cx+look}" cy="{hy-34}" r="13" fill="{hair}" {SW}/>')
    # Körper
    if style in ('girl', 'mom'):
        s.append(f'<path d="M{cx-23} {sh} Q{cx} {sh-8} {cx+23} {sh} L{cx+32} {hip+10} L{cx-32} {hip+10} Z" fill="{jacket}" {SW}/>')
    else:
        s.append(f'<path d="M{cx-25} {sh} Q{cx} {sh-8} {cx+25} {sh} L{cx+22} {hip+4} L{cx-22} {hip+4} Z" fill="{jacket}" {SW}/>')
        s.append(f'<path d="M{cx} {sh} V{hip+4}" stroke="{O}" stroke-width="2"/>')
    if scarf:
        s.append(f'<path d="M{cx-14} {sh-2} L{cx} {sh+10} L{cx+14} {sh-2}" fill="{scarf}" {SW}/>')
    L = (cx-22, sh+8); R = (cx+22, sh+8)
    A = {'down': [(cx-34, sh+50), (cx+34, sh+50)],
         'up': [(cx-34, sh+48), (cx+44, sh-30)],
         'shock': [(cx-14, hy+10), (cx+14, hy+10)],
         'pull': [(cx+8, sh+30), (cx+24, sh+22)],
         'cheer': [(cx-48, sh-40), (cx+48, sh-40)],
         'point': [(cx-34, sh+50), (cx+62, sh+4)],
         'pointl': [(cx-62, sh+4), (cx+34, sh+50)],
         'offer': [(cx-34, sh+50), (cx+54, sh+20)],
         'offerl': [(cx-54, sh+20), (cx+34, sh+50)],
         'feed': [(cx-34, sh+50), (cx+50, sh-6)],
         'hold': [(cx-20, sh+34), (cx+20, sh+34)],
         'holdr': [(cx+30, sh+30), (cx+52, sh+24)],
         'phone': [(cx-34, sh+50), (cx+20, hy+6)],
         'hips': [(cx-30, hip-4), (cx+30, hip-4)],
         'roll': [(cx+44, sh+40), (cx+56, sh+34)],
         'rolll': [(cx-56, sh+34), (cx-44, sh+40)]}[arms]
    for (sx, sy), (ex, ey) in ((L, A[0]), (R, A[1])):
        mx = (sx+ex)/2 + (-8 if ex < cx else 8); my = (sy+ey)/2
        s.append(f'<path d="M{sx} {sy} Q{mx} {my} {ex} {ey}" fill="none" stroke="{O}" stroke-width="15" stroke-linecap="round"/>')
        s.append(f'<path d="M{sx} {sy} Q{mx} {my} {ex} {ey}" fill="none" stroke="{jacket}" stroke-width="10" stroke-linecap="round"/>')
        s.append(f'<circle cx="{ex}" cy="{ey}" r="7" fill="{SK}" {SW}/>')
    hx = cx + look
    s.append(f'<circle cx="{hx}" cy="{hy}" r="28" fill="{SK}" {SW}/>')
    s.append(f'<circle cx="{hx-27}" cy="{hy+3}" r="6" fill="{SK}" {SW}/><circle cx="{hx+27}" cy="{hy+3}" r="6" fill="{SK}" {SW}/>')
    if style == 'boy':
        s.append(f'<path d="M{hx-29} {hy-4} Q{hx-30} {hy-34} {hx} {hy-32} Q{hx+30} {hy-34} {hx+29} {hy-4} Q{hx+18} {hy-20} {hx+4} {hy-16} Q{hx-6} {hy-24} {hx-14} {hy-14} Q{hx-22} {hy-18} {hx-29} {hy-4} Z" fill="{hair}" {SW}/>')
    else:
        s.append(f'<path d="M{hx-31} {hy+14} Q{hx-36} {hy-36} {hx} {hy-33} Q{hx+36} {hy-36} {hx+31} {hy+14} Q{hx+26} {hy-14} {hx+8} {hy-18} Q{hx-12} {hy-6} {hx-24} {hy-14} Q{hx-28} {hy} {hx-31} {hy+14} Z" fill="{hair}" {SW}/>')
    if hat == 'beanie':
        s.append(f'<path d="M{hx-30} {hy-10} Q{hx} {hy-58} {hx+30} {hy-10} Z" fill="{scarf or "#E0463A"}" {SW}/><rect x="{hx-32}" y="{hy-16}" width="64" height="11" rx="5" fill="#fff" {SW}/><circle cx="{hx}" cy="{hy-37}" r="7" fill="#fff" {SW}/>')
    s.append(f'<circle cx="{hx-12}" cy="{hy+12}" r="5" fill="#F29C8A" opacity=".6"/><circle cx="{hx+12}" cy="{hy+12}" r="5" fill="#F29C8A" opacity=".6"/>')
    ex1, ex2, ey = hx-10, hx+10, hy+2
    if expr in ('happy', 'talk'):
        s.append(f'<circle cx="{ex1}" cy="{ey}" r="3.5" fill="{O}"/><circle cx="{ex2}" cy="{ey}" r="3.5" fill="{O}"/>')
        if expr == 'happy':
            s.append(f'<path d="M{hx-9} {hy+13} Q{hx} {hy+22} {hx+9} {hy+13}" fill="none" {SW}/>')
        else:
            s.append(f'<path d="M{hx-7} {hy+13} Q{hx} {hy+24} {hx+7} {hy+13} Z" fill="#7A2B2B" {SW}/>')
    elif expr in ('shock', 'surprised'):
        s.append(f'<circle cx="{ex1}" cy="{ey}" r="6" fill="#fff" {SW}/><circle cx="{ex2}" cy="{ey}" r="6" fill="#fff" {SW}/><circle cx="{ex1}" cy="{ey-1}" r="2.5" fill="{O}"/><circle cx="{ex2}" cy="{ey-1}" r="2.5" fill="{O}"/>')
        s.append(f'<path d="M{ex1-6} {ey-12} L{ex1+5} {ey-14} M{ex2-5} {ey-14} L{ex2+6} {ey-12}" {SW}/>')
        s.append(f'<ellipse cx="{hx}" cy="{hy+17}" rx="5" ry="7" fill="#7A2B2B" {SW}/>')
        if expr == 'shock':
            s.append(f'<path d="M{hx+34} {hy-20} q4 8 0 12 q-4 -4 0 -12z" fill="#8FD3F5" {SW}/>')
    elif expr == 'sad':
        s.append(f'<circle cx="{ex1}" cy="{ey-4}" r="3.5" fill="{O}"/><circle cx="{ex2}" cy="{ey-4}" r="3.5" fill="{O}"/>')
        s.append(f'<path d="M{ex1-6} {ey-10} L{ex1+5} {ey-14} M{ex2-5} {ey-14} L{ex2+6} {ey-10}" {SW}/>')
        s.append(f'<path d="M{hx-8} {hy+17} Q{hx} {hy+11} {hx+8} {hy+17}" fill="none" {SW}/>')
        s.append(f'<path d="M{ex2+2} {ey+3} q4 8 0 11 q-4 -3 0 -11z" fill="#8FD3F5" stroke="#4A9CC8" stroke-width="1.5"/>')
    elif expr == 'angry':
        s.append(f'<circle cx="{ex1}" cy="{ey+1}" r="3.5" fill="{O}"/><circle cx="{ex2}" cy="{ey+1}" r="3.5" fill="{O}"/>')
        s.append(f'<path d="M{ex1-7} {ey-10} L{ex1+5} {ey-5} M{ex2-5} {ey-5} L{ex2+7} {ey-10}" {SW}/>')
        s.append(f'<path d="M{hx-8} {hy+17} Q{hx} {hy+11} {hx+8} {hy+17}" fill="none" {SW}/>')
        s.append(f'<path d="M{hx-36} {hy-26} l-8 -8 M{hx-30} {hy-32} l-4 -10" stroke="#E0463A" stroke-width="3" stroke-linecap="round"/>')
    elif expr == 'joy':
        s.append(f'<path d="M{ex1-5} {ey} Q{ex1} {ey-6} {ex1+5} {ey} M{ex2-5} {ey} Q{ex2} {ey-6} {ex2+5} {ey}" fill="none" {SW}/>')
        s.append(f'<path d="M{hx-11} {hy+10} Q{hx} {hy+30} {hx+11} {hy+10} Z" fill="#7A2B2B" {SW}/>')
    elif expr == 'eat':
        s.append(f'<circle cx="{ex1}" cy="{ey}" r="3.5" fill="{O}"/><circle cx="{ex2}" cy="{ey}" r="3.5" fill="{O}"/>')
        s.append(f'<ellipse cx="{hx+4}" cy="{hy+15}" rx="7" ry="5" fill="#7A2B2B" {SW}/>')
    s.append('</g>')
    return ''.join(s)

def dog(x, y, pose='stand', flip=False, col='#C98B4F', dark='#7A4A26'):
    t = f'translate({x} {y})' + (' scale(-1 1)' if flip else '')
    s = [f'<g transform="{t}">']
    if pose == 'jump': s.append('<g transform="rotate(-18)">')
    if pose == 'pull': s.append('<g transform="rotate(-12)">')
    if pose == 'sit':
        s.append(f'<ellipse cx="-14" cy="-28" rx="26" ry="22" fill="{col}" {SW}/>')
        s.append(f'<path d="M-36 -14 q-18 -10 -16 -30" fill="none" stroke="{O}" stroke-width="9" stroke-linecap="round"/><path d="M-36 -14 q-18 -10 -16 -30" fill="none" stroke="{col}" stroke-width="5" stroke-linecap="round"/>')
        s.append(f'<path d="M4 -40 L8 0 M16 -38 L18 0" stroke="{O}" stroke-width="9" stroke-linecap="round"/><path d="M4 -40 L8 0 M16 -38 L18 0" stroke="{col}" stroke-width="5" stroke-linecap="round"/>')
        s.append(f'<ellipse cx="2" cy="-46" rx="16" ry="12" fill="{WH}" {SW}/>')
        hx, hy = 10, -66
    else:
        for lx in (-22, -10, 14, 26):
            s.append(f'<path d="M{lx} -24 L{lx} 0" stroke="{O}" stroke-width="9" stroke-linecap="round"/><path d="M{lx} -24 L{lx} 0" stroke="{col}" stroke-width="5" stroke-linecap="round"/>')
        s.append(f'<path d="M-30 -36 q-20 -16 -12 -38" fill="none" stroke="{O}" stroke-width="9" stroke-linecap="round"/><path d="M-30 -36 q-20 -16 -12 -38" fill="none" stroke="{col}" stroke-width="5" stroke-linecap="round"/>')
        s.append(f'<ellipse cx="0" cy="-34" rx="36" ry="17" fill="{col}" {SW}/>')
        s.append(f'<ellipse cx="2" cy="-26" rx="22" ry="7" fill="{WH}"/>')
        s.append(f'<ellipse cx="-10" cy="-40" rx="10" ry="7" fill="{dark}"/>')
        hx, hy = 36, -52
    s.append(f'<ellipse cx="{hx}" cy="{hy}" rx="17" ry="15" fill="{col}" {SW}/>')
    s.append(f'<ellipse cx="{hx+16}" cy="{hy+5}" rx="11" ry="8" fill="{WH}" {SW}/>')
    s.append(f'<circle cx="{hx+25}" cy="{hy+2}" r="4" fill="{O}"/><circle cx="{hx+6}" cy="{hy-4}" r="3" fill="{O}"/>')
    s.append(f'<path d="M{hx-8} {hy-10} q-10 6 -6 24 q8 -4 10 -18z" fill="{dark}" {SW}/>')
    if pose in ('stand', 'jump'):
        s.append(f'<path d="M{hx+12} {hy+12} q8 8 16 0" fill="#E8605A" {SW}/>')
    if pose in ('jump', 'pull'): s.append('</g>')
    s.append('</g>')
    return ''.join(s)

def cat(x, y, pose='sit', flip=False, wet=False, col='#8E96A3'):
    t = f'translate({x} {y})' + (' scale(-1 1)' if flip else '')
    s = [f'<g transform="{t}">']
    eye = lambda ex, ey: (f'<path d="M{ex-4} {ey} h8" {SW}/>' if pose == 'sit' else f'<circle cx="{ex}" cy="{ey}" r="3.2" fill="{O}"/>')
    if pose in ('sit', 'sulk'):
        s.append(f'<path d="M-24 -4 q-26 0 -22 -26" fill="none" stroke="{O}" stroke-width="10" stroke-linecap="round"/><path d="M-24 -4 q-26 0 -22 -26" fill="none" stroke="{col}" stroke-width="6" stroke-linecap="round"/>')
        s.append(f'<path d="M-24 0 Q-30 -46 0 -50 Q30 -46 24 0 Z" fill="{col}" {SW}/>')
        hx, hy = 0, -62
    else:  # creep / paw
        s.append(f'<path d="M-40 -30 q-24 -20 -10 -44" fill="none" stroke="{O}" stroke-width="10" stroke-linecap="round"/><path d="M-40 -30 q-24 -20 -10 -44" fill="none" stroke="{col}" stroke-width="6" stroke-linecap="round"/>')
        for lx in (-28, -16, 16, 28):
            s.append(f'<path d="M{lx} -16 L{lx} 0" stroke="{O}" stroke-width="9" stroke-linecap="round"/><path d="M{lx} -16 L{lx} 0" stroke="{col}" stroke-width="5" stroke-linecap="round"/>')
        s.append(f'<ellipse cx="0" cy="-24" rx="40" ry="14" fill="{col}" {SW}/>')
        hx, hy = 40, -36
        if pose == 'paw':
            s.append(f'<path d="M30 -24 Q54 -40 66 -58" fill="none" stroke="{O}" stroke-width="11" stroke-linecap="round"/><path d="M30 -24 Q54 -40 66 -58" fill="none" stroke="{col}" stroke-width="6" stroke-linecap="round"/>')
            hx, hy = 34, -44
    s.append(f'<path d="M{hx-16} {hy-6} L{hx-14} {hy-26} L{hx-4} {hy-14} Z M{hx+16} {hy-6} L{hx+14} {hy-26} L{hx+4} {hy-14} Z" fill="{col}" {SW}/>')
    s.append(f'<circle cx="{hx}" cy="{hy}" r="17" fill="{col}" {SW}/>')
    s.append(eye(hx-7, hy-2) + eye(hx+7, hy-2))
    s.append(f'<path d="M{hx-2} {hy+5} h4 l-2 3z" fill="#E8605A" stroke="{O}" stroke-width="1.5"/>')
    s.append(f'<path d="M{hx-6} {hy+8} q6 5 12 0" fill="none" stroke="{O}" stroke-width="2" {"transform=\"rotate(180 %d %d)\"" % (hx, hy+10) if pose=="sulk" else ""}/>')
    s.append(f'<path d="M{hx-10} {hy+5} l-14 -3 M{hx-10} {hy+8} l-14 3 M{hx+10} {hy+5} l14 -3 M{hx+10} {hy+8} l14 3" stroke="{O}" stroke-width="1.5"/>')
    if wet:
        for dx, dy in ((-30, -70), (26, -78), (-6, -92), (34, -40)):
            s.append(f'<path d="M{dx} {dy} q4 8 0 11 q-4 -3 0 -11z" fill="#8FD3F5" stroke="#4A9CC8" stroke-width="1.5"/>')
    s.append('</g>')
    return ''.join(s)

def crow(x, y, food=False, fly=False):
    s = [f'<g transform="translate({x} {y})">']
    s.append(f'<ellipse cx="0" cy="-16" rx="20" ry="13" fill="#2F3340" {SW}/>')
    if fly:
        s.append(f'<path d="M-6 -22 Q-20 -50 -38 -40 Q-22 -32 -10 -16 Z M6 -22 Q20 -52 36 -44 Q22 -32 8 -16 Z" fill="#2F3340" {SW}/>')
    else:
        s.append(f'<path d="M-20 -14 l-16 6 l14 0 z" fill="#2F3340" {SW}/><path d="M-4 -2 v8 M6 -2 v8" stroke="#E8A33A" stroke-width="3"/>')
    s.append(f'<circle cx="18" cy="-30" r="10" fill="#2F3340" {SW}/><circle cx="21" cy="-32" r="2.5" fill="#fff"/>')
    s.append(f'<path d="M27 -31 l12 4 l-12 3 z" fill="#E8A33A" {SW}/>')
    if food:
        s.append(sandwich(44, -26, .7))
    s.append('</g>')
    return ''.join(s)

def sandwich(x, y, sc=1.0):
    return (f'<g transform="translate({x} {y}) scale({sc})"><path d="M-16 6 Q-18 -10 0 -12 Q18 -10 16 6 Z" fill="#E9C27B" {SW}/>'
            f'<path d="M-15 1 h30" stroke="#5BB368" stroke-width="4"/><path d="M-15 5 h30" stroke="#E8605A" stroke-width="3"/></g>')

def kite(x, y, rot=0, sc=1, torn=False, tail=True):
    s = [f'<g transform="translate({x} {y}) rotate({rot}) scale({sc})">']
    s.append(f'<path d="M0 -40 L28 0 L0 46 L-28 0 Z" fill="#E8553A" {SW}/>')
    s.append('<path d="M0 -40 L28 0 L0 0 Z M0 0 L-28 0 L0 46 Z" fill="#F7C548"/>')
    s.append(f'<path d="M0 -40 L28 0 L0 46 L-28 0 Z" fill="none" {SW}/><path d="M0 -40 V46 M-28 0 H28" stroke="{O}" stroke-width="2"/>')
    if torn: s.append(f'<path d="M8 -18 l6 8 l-6 4 l7 7" fill="none" stroke="{O}" stroke-width="2.5"/>')
    if tail:
        s.append(f'<path d="M0 46 q-14 18 0 32 q14 16 -2 34" fill="none" stroke="{O}" stroke-width="2"/>')
        for ty in (62, 84, 104):
            s.append(f'<path d="M-8 {ty-5} L0 {ty} L-8 {ty+5} Z M8 {ty-5} L0 {ty} L8 {ty+5} Z" fill="#4BA3E3" stroke="{O}" stroke-width="1.5"/>')
    s.append('</g>'); return ''.join(s)

def tree(x, base, snow=False):
    s = [f'<path d="M{x-20} {base} Q{x-12} {base-80} {x-16} {base-140} L{x+16} {base-140} Q{x+12} {base-80} {x+22} {base} Z" fill="#8B5A2B" {SW}/>']
    s.append(f'<path d="M{x-4} {base-20} q4 -20 0 -40 M{x+8} {base-60} q-4 -16 2 -30" fill="none" stroke="#5E3A17" stroke-width="2.5"/>')
    s.append(f'<path d="M{x+10} {base-110} L{x+50} {base-150} M{x-10} {base-118} L{x-48} {base-160}" stroke="#8B5A2B" stroke-width="10" stroke-linecap="round"/>')
    for cx, cy, r, c in [(-60, -170, 48, '#3F8F4E'), (60, -175, 50, '#3F8F4E'), (0, -215, 60, '#4FA35C'), (-30, -150, 40, '#4FA35C'), (36, -148, 40, '#4FA35C'), (0, -170, 50, '#5BB368')]:
        s.append(f'<circle cx="{x+cx}" cy="{base+cy}" r="{r}" fill="{c}" {SW}/>')
    for lx, ly in [(-40, -200), (20, -235), (50, -160), (-20, -165), (-70, -175)]:
        s.append(f'<path d="M{x+lx} {base+ly} q6 -6 12 0" fill="none" stroke="#2F6E3B" stroke-width="2.5"/>')
    return ''.join(s)

def bare_tree(x, base):
    return (f'<path d="M{x-14} {base} Q{x-8} {base-70} {x-10} {base-120} L{x+10} {base-120} Q{x+8} {base-70} {x+16} {base} Z" fill="#7A5230" {SW}/>'
            f'<path d="M{x} {base-110} L{x-40} {base-160} M{x} {base-100} L{x+44} {base-150} M{x-20} {base-135} L{x-30} {base-175} M{x+22} {base-125} L{x+36} {base-175}" stroke="#7A5230" stroke-width="7" stroke-linecap="round"/>'
            f'<path d="M{x-46} {base-162} q6 -6 12 0 M{x+38} {base-152} q6 -6 12 0" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none"/>')

def sky(c='#CDEBFA', clouds=True):
    s = [f'<rect width="400" height="300" fill="{c}"/>']
    if clouds:
        s.append('<g fill="#fff" stroke="#B6D8EA" stroke-width="2"><ellipse cx="70" cy="50" rx="34" ry="14"/><ellipse cx="96" cy="42" rx="24" ry="14"/><ellipse cx="300" cy="34" rx="30" ry="11"/></g>')
    return ''.join(s)

def meadow(gust=False):
    s = [sky()]
    s.append('<path d="M0 220 Q120 200 240 214 T400 206 V300 H0Z" fill="#9BD08A"/><path d="M0 238 Q140 222 400 232 V300 H0Z" fill="#86C274"/>')
    for gx, gy in [(30, 262), (120, 250), (200, 276), (330, 258), (370, 284), (80, 288)]:
        s.append(f'<path d="M{gx} {gy} l3 -8 l3 8 l3 -6 l2 6" fill="none" stroke="#5E9E4F" stroke-width="2"/>')
    w = 4 if gust else 2
    for wx, wy, l in ([(20, 90, 70), (40, 120, 90), (10, 150, 60)] if gust else [(150, 70, 50), (170, 92, 36)]):
        s.append(f'<path d="M{wx} {wy} q{l/2} -10 {l} 0" fill="none" stroke="#7FB3D0" stroke-width="{w}" stroke-linecap="round"/>')
    return ''.join(s)

def house(x, y):
    return (f'<g><rect x="{x}" y="{y}" width="56" height="40" fill="#F4E3C3" stroke="#8a7a66" stroke-width="2"/><path d="M{x-6} {y} L{x+28} {y-26} L{x+62} {y} Z" fill="#C85A47" stroke="#8a7a66" stroke-width="2"/>'
            f'<rect x="{x+8}" y="{y+10}" width="12" height="12" fill="#9AD0EC" stroke="#8a7a66" stroke-width="1.5"/><rect x="{x+34}" y="{y+16}" width="12" height="24" fill="#8B5A2B"/></g>')

def schoolyard():
    s = [sky()]
    s.append('<rect x="0" y="96" width="400" height="120" fill="#D9826A"/>')
    for wx in range(18, 400, 64):
        for wy in (112, 158):
            s.append(f'<rect x="{wx}" y="{wy}" width="36" height="30" fill="#BFE3F5" stroke="#8C4A3A" stroke-width="3"/><path d="M{wx+18} {wy} v30" stroke="#8C4A3A" stroke-width="2"/>')
    s.append('<rect x="0" y="92" width="400" height="8" fill="#8C4A3A"/>')
    s.append('<rect x="0" y="214" width="400" height="86" fill="#C9C2B8"/><path d="M0 214 H400" stroke="#9E978C" stroke-width="3"/>')
    for gx in range(0, 400, 50):
        s.append(f'<path d="M{gx} 230 l30 70" stroke="#B5AEA4" stroke-width="2"/>')
    return ''.join(s)

def bench(x, y, box=None):
    s = [f'<rect x="{x}" y="{y-34}" width="120" height="10" rx="3" fill="#B07A45" {SW}/>',
         f'<rect x="{x}" y="{y-20}" width="120" height="10" rx="3" fill="#B07A45" {SW}/>',
         f'<path d="M{x+10} {y-10} V{y} M{x+110} {y-10} V{y}" stroke="{O}" stroke-width="6" stroke-linecap="round"/>']
    if box == 'full':
        s.append(f'<rect x="{x+70}" y="{y-50}" width="38" height="18" rx="4" fill="#6CC3E8" {SW}/>' + sandwich(x+89, y-52, .9))
    elif box == 'empty':
        s.append(f'<rect x="{x+70}" y="{y-50}" width="38" height="18" rx="4" fill="#6CC3E8" {SW}/>')
    return ''.join(s)

def snowland(sun=False):
    s = [sky('#FFE9A8' if sun else '#DCE6EF', clouds=not sun)]
    if sun:
        s.append(f'<circle cx="340" cy="56" r="30" fill="#FFC93C" {SW}/>')
        for i in range(8):
            import math
            a = i*math.pi/4
            s.append(f'<path d="M{340+40*math.cos(a):.0f} {56+40*math.sin(a):.0f} L{340+52*math.cos(a):.0f} {56+52*math.sin(a):.0f}" stroke="#E8A33A" stroke-width="4" stroke-linecap="round"/>')
    s.append('<path d="M0 214 Q120 196 240 210 T400 202 V300 H0Z" fill="#FFFFFF" stroke="#C9D6E3" stroke-width="2"/>')
    if sun:
        s.append('<path d="M0 250 Q100 240 220 254 T400 246 V300 H0Z" fill="#8FC77E"/>')
    else:
        for fx, fy in [(40, 40), (120, 80), (200, 30), (260, 90), (340, 60), (90, 140), (300, 150), (180, 130)]:
            s.append(f'<circle cx="{fx}" cy="{fy}" r="4" fill="#fff" stroke="#C9D6E3" stroke-width="1.5"/>')
    return ''.join(s)

def snowman(x, base, dressed=True, sc=1.0):
    s = [f'<g transform="translate({x} {base}) scale({sc})">']
    s.append(f'<circle cx="0" cy="-42" r="42" fill="#fff" {SW}/><circle cx="0" cy="-110" r="30" fill="#fff" {SW}/>')
    if dressed:
        s.append(f'<circle cx="0" cy="-160" r="22" fill="#fff" {SW}/>')
        s.append(f'<circle cx="-8" cy="-166" r="3" fill="{O}"/><circle cx="8" cy="-166" r="3" fill="{O}"/><path d="M0 -160 l22 4 l-22 4 z" fill="#F28A2E" {SW}/>')
        s.append(f'<rect x="-22" y="-208" width="44" height="30" fill="#33343C" {SW}/><rect x="-30" y="-182" width="60" height="8" fill="#33343C" {SW}/>')
        s.append(f'<path d="M-24 -140 Q0 -128 24 -140 L22 -132 Q0 -120 -22 -132 Z" fill="#E0463A" {SW}/><path d="M14 -134 l6 30 l10 -4 l-8 -28" fill="#E0463A" {SW}/>')
        for by in (-120, -100, -56, -34):
            s.append(f'<circle cx="0" cy="{by}" r="3.5" fill="{O}"/>')
    s.append('</g>')
    return ''.join(s)

def room(wall='#F3E1C6', floor='#C99A6B'):
    return (f'<rect width="400" height="300" fill="{wall}"/><rect y="226" width="400" height="74" fill="{floor}"/><path d="M0 226 H400" stroke="#8A6440" stroke-width="3"/>'
            f'<g stroke="#E6CFAE" stroke-width="3">' + ''.join(f'<path d="M{x} 0 V226"/>' for x in range(30, 400, 60)) + '</g>')

def window(x, y, w=90, h=70):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#BFE3F5" {SW}/><path d="M{x+w/2} {y} v{h} M{x} {y+h/2} h{w}" stroke="{O}" stroke-width="3"/>'
            f'<path d="M{x-8} {y-6} h{w+16}" stroke="#B85C8C" stroke-width="8" stroke-linecap="round"/>')

def table(x, y, w=150):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="12" rx="3" fill="#A0693A" {SW}/>'
            f'<path d="M{x+12} {y+12} V{y+70} M{x+w-12} {y+12} V{y+70}" stroke="{O}" stroke-width="9" stroke-linecap="round"/><path d="M{x+12} {y+12} V{y+70} M{x+w-12} {y+12} V{y+70}" stroke="#A0693A" stroke-width="5" stroke-linecap="round"/>')

def bowl(x, y, tip=0, fish=True, water=True):
    s = [f'<g transform="translate({x} {y}) rotate({tip})">']
    if water:
        s.append('<path d="M-30 -30 Q-40 0 0 4 Q40 0 30 -30 Z" fill="#9AD7F2" opacity=".85"/>')
    s.append(f'<path d="M-24 -50 Q-48 -20 -28 0 Q0 10 28 0 Q48 -20 24 -50" fill="none" {SW}/><path d="M-26 -52 h52" stroke="{O}" stroke-width="3"/>')
    if fish:
        s.append(goldfish(4, -18))
    s.append('</g>')
    return ''.join(s)

def goldfish(x, y, rot=0, sc=1):
    return (f'<g transform="translate({x} {y}) rotate({rot}) scale({sc})"><ellipse cx="0" cy="0" rx="11" ry="7" fill="#F28A2E" {SW}/>'
            f'<path d="M-10 0 l-10 -7 v14 z" fill="#F28A2E" {SW}/><circle cx="5" cy="-2" r="1.8" fill="{O}"/></g>')

def sofa(x, y):
    return (f'<rect x="{x}" y="{y-60}" width="130" height="40" rx="12" fill="#5B8DBE" {SW}/><rect x="{x-6}" y="{y-28}" width="142" height="30" rx="10" fill="#6C9DCC" {SW}/>'
            f'<path d="M{x+6} {y+2} v10 M{x+124} {y+2} v10" stroke="{O}" stroke-width="5" stroke-linecap="round"/>')

def door(x, y, open_=False):
    s = f'<rect x="{x}" y="{y}" width="64" height="146" fill="#E8D2B0" {SW}/>'
    if open_:
        s += f'<path d="M{x} {y} L{x+30} {y+12} V{y+138} L{x} {y+146} Z" fill="#B98552" {SW}/>'
    else:
        s += f'<rect x="{x+4}" y="{y+4}" width="56" height="138" fill="#B98552" {SW}/><circle cx="{x+50}" cy="{y+78}" r="4" fill="#F7C548" {SW}/>'
    return s

def kitchen():
    return (room('#E4F1EC', '#D7CDBF') + f'<rect x="20" y="140" width="150" height="86" fill="#F8F8F8" {SW}/><rect x="20" y="132" width="150" height="10" fill="#B8C4C9" {SW}/>'
            + ''.join(f'<rect x="{x}" y="152" width="64" height="62" rx="4" fill="#fff" stroke="#B8C4C9" stroke-width="2"/>' for x in (30, 98)))

def freezer(x, y, open_=True, inside=None):
    s = [f'<rect x="{x}" y="{y}" width="90" height="170" rx="8" fill="#F4F6F8" {SW}/><path d="M{x} {y+70} h90" stroke="{O}" stroke-width="3"/>']
    if open_:
        s.append(f'<rect x="{x+8}" y="{y+78}" width="74" height="84" fill="#CFEAF7" {SW}/><path d="M{x+8} {y+120} h74" stroke="#9CC9DE" stroke-width="3"/>')
        s.append(f'<path d="M{x+90} {y+72} L{x+130} {y+86} V{y+174} L{x+90} {y+170} Z" fill="#E3E8EC" {SW}/>')
        if inside: s.append(inside)
    s.append('</g>' if False else '')
    return ''.join(s)

def num(n):
    return (f'<circle cx="24" cy="24" r="15" fill="#fff" {SW}/><text x="24" y="30" text-anchor="middle" {F} font-size="17" fill="{O}">{n}</text>')

def bubble(x, y, w, text, tail=(20, 24), size=17):
    tx, ty = tail
    return (f'<path d="M{x} {y} h{w} a12 12 0 0 1 12 12 v18 a12 12 0 0 1 -12 12 h-{w/2-6} l{tx} {ty} l-{tx+16} -{ty} h-{w/2-10} a12 12 0 0 1 -12 -12 v-18 a12 12 0 0 1 12 -12z" fill="#fff" {SW}/>'
            f'<text x="{x+w/2}" y="{y+28}" text-anchor="middle" {F} font-size="{size}" fill="{O}">{text}</text>')

def word(x, y, t, size=15, rot=0):
    return f'<text x="{x}" y="{y}" {F} font-size="{size}" fill="{O}" transform="rotate({rot} {x} {y})">{t}</text>'

def lines(*segs, w=2.5):
    return ''.join(f'<path d="{d}" stroke="{O}" stroke-width="{w}" stroke-linecap="round" fill="none"/>' for d in segs)

P = {}
# ---------- Drachen ----------
p = meadow() + house(18, 176) + kite(310, 56, -12, .9) + f'<path d="M306 98 Q250 120 194 138" fill="none" stroke="{O}" stroke-width="1.5"/>'
p += person(150, 262, 'happy', 'up', 4) + dog(232, 264, 'jump') + lines('M290 214 l10 -6', 'M292 226 l12 0')
P['drachen-1'] = p
p = meadow(True) + tree(300, 262) + kite(318, 76, 30, .85) + lines('M250 70 l14 6', 'M246 92 l16 2', 'M254 112 l12 -4', w=3)
p += f'<path d="M300 110 Q200 170 126 140" fill="none" stroke="{O}" stroke-width="1.5"/>'
for lx, ly, r in [(120, 70, 20), (170, 100, -30), (90, 130, 50)]:
    p += f'<path d="M{lx} {ly} q8 -10 16 0 q-8 10 -16 0z" fill="#5BB368" stroke="{O}" stroke-width="1.5" transform="rotate({r} {lx} {ly})"/>'
p += person(110, 268, 'shock', 'shock', -4) + dog(190, 268, 'stand')
P['drachen-2'] = p
p = meadow() + tree(270, 262) + kite(272, 62, 8, .8, torn=True, tail=False) + f'<path d="M272 92 L176 140" fill="none" stroke="{O}" stroke-width="2"/>'
p += person(150, 262, 'sad', 'pull', 6) + dog(70, 262, 'sit') + word(96, 168, '?', 30) + word(150, 52, 'ratsch!', 16)
P['drachen-3'] = p
p = meadow() + tree(320, 262) + kite(222, 196, -60, .75) + lines('M196 150 l-8 -16', 'M214 146 l-2 -18', 'M232 152 l6 -16')
p += dog(96, 264, 'pull') + f'<path d="M160 214 Q190 200 206 206" fill="none" stroke="{O}" stroke-width="2"/>'
p += person(300, 262, 'joy', 'cheer', -6) + lines('M262 100 l-12 -8', 'M266 84 l-10 -14', 'M338 100 l12 -8', 'M334 84 l10 -14')
p += bubble(150, 40, 80, 'Fips, zieh!')
P['drachen-4'] = p

# ---------- Pausenbrot ----------
LENA = dict(style='girl', jacket='#9B6BDF', pants='#2F3E66', hair='#E0A24A', scarf=None)
PAUL = dict(style='boy', jacket='#4CAF6E', pants='#4A4A55', hair='#2B2B33', scarf='#F2B632')
p = schoolyard() + bench(140, 262, 'full') + person(100, 268, 'talk', 'offer', 4, **LENA) + person(320, 268, 'happy', 'down', -4, **PAUL)
p += crow(250, 98) + word(232, 70, '?', 18)
P['brot-1'] = p
p = schoolyard() + bench(140, 262, 'empty') + crow(236, 214, food=True)
p += person(80, 268, 'talk', 'pointl', -6, **LENA) + person(340, 268, 'happy', 'pointl', -6, **PAUL)
p += f'<circle cx="40" cy="72" r="13" fill="#fff" {SW}/><path d="M40 66 l6 4 l-2 7 h-8 l-2 -7 z" fill="{O}"/>' + lines('M62 64 l10 -4', 'M62 76 l12 0') + word(170, 170, 'schnapp!', 16)
P['brot-2'] = p
p = schoolyard() + bench(-70, 262, 'empty') + person(140, 268, 'angry', 'point', 6, **LENA) + person(290, 268, 'surprised', 'hold', -6, **PAUL)
p += sandwich(290, 192, .9) + bubble(60, 40, 120, 'Mein Brot!?', tail=(20, 26))
P['brot-3'] = p
p = schoolyard() + f'<path d="M260 96 L400 70" stroke="#7A5230" stroke-width="10" stroke-linecap="round"/>' + crow(330, 84, food=True)
p += person(110, 268, 'joy', 'offer', 10, **LENA) + person(220, 268, 'joy', 'offerl', 6, **PAUL) + sandwich(170, 168, .8)
p += lines('M300 120 l-8 10', 'M318 126 l-2 12', 'M336 120 l6 10')
P['brot-4'] = p

# ---------- Schneemann ----------
MIA = dict(style='girl', jacket='#E0463A', pants='#2F3E66', hair='#7A4A26', scarf='#F7C548', hat='beanie')
TOM = dict(style='boy', jacket='#3C7DD9', pants='#33343C', hair='#E0A24A', scarf='#4CAF6E', hat='beanie')
p = snowland() + house(300, 170) + bare_tree(250, 220) + snowman(200, 262, dressed=False, sc=.9)
p += f'<circle cx="300" cy="248" r="22" fill="#fff" {SW}/>' + person(90, 270, 'happy', 'roll', 6, **MIA) + person(350, 270, 'happy', 'rolll', -6, **TOM)
P['schnee-1'] = p
p = snowland() + house(20, 170) + snowman(200, 262, dressed=True, sc=.9) + person(90, 270, 'joy', 'cheer', 0, **MIA) + person(320, 270, 'joy', 'cheer', 0, **TOM)
P['schnee-2'] = p
p = snowland(sun=True) + f'<ellipse cx="200" cy="262" rx="70" ry="12" fill="#9AD7F2" {SW}/><ellipse cx="200" cy="250" rx="34" ry="18" fill="#fff" {SW}/>'
p += f'<rect x="180" y="226" width="40" height="22" fill="#33343C" {SW}/><rect x="172" y="244" width="56" height="7" fill="#33343C" {SW}/>'
p += f'<path d="M226 258 l26 4 l-26 4 z" fill="#F28A2E" {SW}/><path d="M140 262 q20 -10 40 0" stroke="#E0463A" stroke-width="7" fill="none" stroke-linecap="round"/>'
p += person(80, 270, 'sad', 'down', 6, **MIA) + person(320, 270, 'sad', 'down', -6, **TOM) + word(176, 196, 'tropf', 14) + word(212, 210, 'tropf', 12)
P['schnee-3'] = p
MOM = dict(style='mom', jacket='#4CAF6E', pants='#4CAF6E', hair='#5A3A22', scarf=None)
mini = snowman(0, 0, dressed=True, sc=.28)
p = kitchen() + freezer(180, 56, inside=f'<g transform="translate(225 160)">{mini}</g>')
p += person(90, 276, 'surprised', 'hips', 10, scale=1.15, **MOM)
p += person(354, 276, 'joy', 'cheer', -6, scale=.8, **dict(MIA, hat=None)) + bubble(20, 30, 130, 'Was ist DAS?', tail=(30, 22), size=16)
p += f'<rect x="214" y="92" width="44" height="24" fill="#FFF59D" stroke="{O}" stroke-width="2" transform="rotate(-6 236 104)"/>' + word(217, 108, 'Winter!', 10, -6)
P['schnee-4'] = p

# ---------- Katze ----------
EMMA = dict(style='girl', jacket='#E86FA6', pants='#33343C', hair='#2B2B33', scarf=None)
p = room() + window(250, 50) + sofa(250, 226) + cat(300, 166, 'sit') + table(40, 156, 160) + bowl(150, 156)
p += person(70, 270, 'happy', 'feed', 4, **EMMA) + f'<circle cx="126" cy="96" r="2" fill="#C98B4F"/><circle cx="132" cy="104" r="2" fill="#C98B4F"/>'
P['katze-1'] = p
p = room() + window(130, 50) + door(316, 80, open_=True) + person(350, 270, 'talk', 'phone', 6, **EMMA) + bubble(220, 26, 110, 'Hallo, Oma?', tail=(40, 20), size=15)
p += table(40, 156, 160) + bowl(150, 156) + cat(80, 156, 'creep')
P['katze-2'] = p
p = room() + window(250, 50) + table(40, 156, 160) + bowl(176, 150, tip=38) + cat(90, 156, 'paw')
p += f'<path d="M190 150 q30 -10 50 20 q10 30 -4 60" fill="none" stroke="#4A9CC8" stroke-width="4" stroke-linecap="round"/>'
for dx, dy in ((220, 120), (240, 140), (250, 176), (206, 104)):
    p += f'<path d="M{dx} {dy} q5 9 0 13 q-5 -4 0 -13z" fill="#8FD3F5" stroke="#4A9CC8" stroke-width="1.5"/>'
p += goldfish(260, 112, -30, 1.2) + word(280, 230, 'PLATSCH!', 22, -8)
P['katze-3'] = p
p = room() + window(250, 50) + table(30, 156, 150) + bowl(110, 156, fish=False, water=False)
p += f'<ellipse cx="200" cy="262" rx="70" ry="10" fill="#9AD7F2" {SW}/>' + cat(200, 262, 'sulk', wet=True)
p += person(320, 270, 'joy', 'holdr', -4, **EMMA)
p += f'<path d="M362 152 v28 q0 8 -8 8 h-20 q-8 0 -8 -8 v-28 z" fill="#9AD7F2" fill-opacity=".8" {SW}/>' + goldfish(344, 172, 0, .7)
P['katze-4'] = p

OUT.mkdir(parents=True, exist_ok=True)
for k, p in P.items():
    n = k.split('-')[1]
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><clipPath id="c"><rect width="400" height="300" rx="14"/></clipPath></defs>'
           f'<g clip-path="url(#c)">{p}{num(n)}</g><rect x="1.5" y="1.5" width="397" height="297" rx="13" fill="none" stroke="{O}" stroke-width="3"/></svg>')
    (OUT / f'{k}.svg').write_text(svg)
print(len(P), 'Bilder')
