"""Erzeugt die Karte für nachbarn.html (Deutschland und seine 9 Nachbarländer) als SVG-Pfade.
Quelle: Natural Earth 1:50m Admin-0 Countries (gemeinfrei), z. B.
https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson
Aufruf: python3 tools/nachbarn_karte.py ne_50m_admin_0_countries.geojson > karte.json"""
import json, math, sys

LON0, LON1, LAT0, LAT1 = 2.0, 21.5, 45.4, 57.9
COS = math.cos(math.radians(51.5))
K = 400 / ((LON1 - LON0) * COS)
W, H = 400, round((LAT1 - LAT0) * K)
LAND = ['DEU', 'DNK', 'POL', 'CZE', 'AUT', 'CHE', 'FRA', 'LUX', 'BEL', 'NLD']
CTX = ['GBR', 'NOR', 'SWE', 'ITA', 'SVK', 'HUN', 'SVN', 'HRV', 'LIE', 'LTU', 'RUS', 'BLR', 'UKR', 'IRL', 'ESP', 'SMR', 'VAT', 'MCO', 'AND']
CAP = {'Berlin': (13.40, 52.52), 'Kopenhagen': (12.57, 55.68), 'Warschau': (21.01, 52.23), 'Prag': (14.42, 50.08), 'Wien': (16.37, 48.21),
       'Bern': (7.45, 46.95), 'Paris': (2.35, 48.86), 'Luxemburg': (6.13, 49.61), 'Brüssel': (4.35, 50.85), 'Amsterdam': (4.90, 52.37)}

def P(lon, lat):
    return ((lon - LON0) * COS * K, (LAT1 - lat) * K)

def clip(ring, m=12):
    """Sutherland-Hodgman an einem etwas größeren Rechteck als die Karte"""
    edges = [(lambda p: p[0] >= -m, lambda a, b: ix(a, b, 0, -m)), (lambda p: p[0] <= W + m, lambda a, b: ix(a, b, 0, W + m)),
             (lambda p: p[1] >= -m, lambda a, b: ix(a, b, 1, -m)), (lambda p: p[1] <= H + m, lambda a, b: ix(a, b, 1, H + m))]
    out = ring
    for inside, cut in edges:
        if not out: break
        inp, out = out, []
        prev = inp[-1]
        for cur in inp:
            if inside(cur):
                if not inside(prev): out.append(cut(prev, cur))
                out.append(cur)
            elif inside(prev):
                out.append(cut(prev, cur))
            prev = cur
    return out

def ix(a, b, k, v):
    t = (v - a[k]) / (b[k] - a[k])
    return (a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]))

def dp(pts, tol):
    if len(pts) < 3: return pts
    a, b = pts[0], pts[-1]
    dx, dy = b[0] - a[0], b[1] - a[1]
    L = math.hypot(dx, dy) or 1e-9
    best, idx = 0, 0
    for i in range(1, len(pts) - 1):
        d = abs(dy * (pts[i][0] - a[0]) - dx * (pts[i][1] - a[1])) / L
        if d > best: best, idx = d, i
    if best <= tol: return [a, b]
    return dp(pts[:idx + 1], tol)[:-1] + dp(pts[idx:], tol)

def area(r):
    return sum(r[i][0] * r[i - 1][1] - r[i - 1][0] * r[i][1] for i in range(len(r))) / 2

def path(geom, tol=0.45):
    polys = geom['coordinates'] if geom['type'] == 'MultiPolygon' else [geom['coordinates']]
    d, big = [], (0, None)
    for poly in polys:
        for j, ring in enumerate(poly):
            r = clip([P(*c[:2]) for c in ring])
            if len(r) < 3: continue
            # ganz außerhalb liegende Ringe (Rand des Clip-Rechtecks) weglassen
            if not any(0 < p[0] < W and 0 < p[1] < H for p in r): continue
            h = len(r) // 2
            r = dp(r[:h + 1], tol)[:-1] + dp(r[h:] + [r[0]], tol)[:-1]
            if len(r) < 3 or abs(area(r)) < 1.5: continue
            if j == 0 and abs(area(r)) > big[0]: big = (abs(area(r)), r)
            d.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in r) + 'Z')
    c = None
    if big[1]:
        r = big[1]; A = area(r)
        cx = sum((r[i - 1][0] + r[i][0]) * (r[i - 1][0] * r[i][1] - r[i][0] * r[i - 1][1]) for i in range(len(r))) / (6 * A)
        cy = sum((r[i - 1][1] + r[i][1]) * (r[i - 1][0] * r[i][1] - r[i][0] * r[i - 1][1]) for i in range(len(r))) / (6 * A)
        c = [round(-cx, 1), round(-cy, 1)]
    return ''.join(d), c

src = json.load(open(sys.argv[1], encoding='utf8'))
F = {f['properties']['ADM0_A3']: f for f in src['features']}
out = {'w': W, 'h': H, 'l': {}, 'ctx': '', 'cap': {k: [round(v, 1) for v in P(*ll)] for k, ll in CAP.items()}}
for a in LAND:
    d, c = path(F[a]['geometry'])
    out['l'][a] = {'d': d, 'c': c}
out['ctx'] = ''.join(path(F[a]['geometry'])[0] for a in CTX if a in F)
print(json.dumps(out, ensure_ascii=False, separators=(',', ':')))
