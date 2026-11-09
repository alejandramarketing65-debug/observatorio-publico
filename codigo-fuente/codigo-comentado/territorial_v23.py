"""Decodifica los agregados territoriales 2025 (municipio x zona) y los perfiles
(ciclo vital, etnia, agresor, escenario, discapacidad, orientación sexual) y
produce build/territorial_v22.json con la estructura que lee el visor (lv21.js):

  LV22_DATA[capa]["2025"] = {
      "mun":  {cod5: {"m": mujeres, "h": hombres, "prot": 0/1}},
      "dep":  {cod2: {"m","h","prot"}},                 # suma municipal
      "zona": {"dep": {cod2: {"U": {...}, "R": {...}, "S": {...}}},
               "mun": {cod5: {"U": {...}, "R": {...}, "S": {...}}}}}
  LV22_DATA["_perf"] = {"PAR"|"SEX": {"d": {cod2: {dim: [[etiqueta, n, prot]...]}},
                                      "l": {cod5: {dim: [...]}}}}

Fuente: datos.gov.co (Medicina Legal). Consultas SoQL agregadas (count por
código DANE del municipio, zona del hecho y sexo): 79dd-d24f lesiones no
fatales 2025 (preliminar), 2kpj-cktv lesiones fatales 2025 (preliminar);
perfiles: 9fs6-37ea pareja y hyqu-diue delito sexual (histórico 2015-2024).
Protección de celdas pequeñas: valores de 1 a 4 no se publican (prot=1).
"""
import json, re, unicodedata
from pathlib import Path

H = Path(__file__).resolve().parent
RAW = (H / 'mun2025.txt').read_text().strip()
PERF = json.loads((H / 'perfiles_raw.json').read_text())
YEAR = '2025'
LAYERS = {'PAR': ['X-PAR', 'VBG-04'], 'SEX': ['VBG-01', 'AMP-V07', 'VBG-02'],
          'NNA': ['X-NNA'], 'FAM': ['X-FAM'], 'MAY': ['X-MAY'],
          'HOM': ['AMP-V01'], 'SUI': ['X-SUI']}
SHARE = {'VBG-04', 'VBG-02'}


def b36(s):
    return int(s, 36) if s else 0


def protect(o, share):
    """Aplica la regla 1-4 a una celda {m,h}."""
    m, h = o['m'], o['h']
    small = lambda x: 0 < x < 5
    if share:
        if small(m) or small(h):
            return {'m': None, 'h': None, 'prot': 1}
        return {'m': m, 'h': h, 'prot': 0}
    if small(m):
        return {'m': None, 'h': 0, 'prot': 1}
    return {'m': m, 'h': 0, 'prot': 0}


def decode():
    TD, totals = {}, {}
    for line in RAW.split('\n'):
        key, body = line.split('#', 1)
        sexed = key in ('PAR', 'SEX')
        mun = {}
        for ent in body.split(';'):
            c, vals = ent.split(':', 1)
            v = [b36(x) for x in vals.split(',')]
            v += [0] * (6 - len(v))
            if sexed:
                z = {'U': {'m': v[0], 'h': v[1]}, 'R': {'m': v[2], 'h': v[3]}, 'S': {'m': v[4], 'h': v[5]}}
            else:
                z = {'U': {'m': v[0], 'h': 0}, 'R': {'m': v[1], 'h': 0}, 'S': {'m': v[2], 'h': 0}}
            mun[c.zfill(5)] = z
        totals[key] = sum(z[k]['m'] for z in mun.values() for k in 'URS')
        for L in LAYERS[key]:
            share = L in SHARE
            out = {'mun': {}, 'dep': {}, 'zona': {'dep': {}, 'mun': {}}}
            dep, depz = {}, {}
            for c, z in mun.items():
                if c == '00999':
                    continue  # municipio sin información
                d = c[:2]
                t = {'m': sum(z[k]['m'] for k in 'URS'), 'h': sum(z[k]['h'] for k in 'URS')}
                out['mun'][c] = protect(t, share)
                out['zona']['mun'][c] = {k: protect(z[k], share) for k in 'UR'}
                a = dep.setdefault(d, {'m': 0, 'h': 0})
                a['m'] += t['m']; a['h'] += t['h']
                dz = depz.setdefault(d, {k: {'m': 0, 'h': 0} for k in 'URS'})
                for k in 'URS':
                    dz[k]['m'] += z[k]['m']; dz[k]['h'] += z[k]['h']
            out['dep'] = {d: protect(o, share) for d, o in dep.items()}
            out['zona']['dep'] = {d: {k: protect(o[k], share) for k in 'URS'} for d, o in depz.items()}
            TD[L] = {YEAR: out}
    return TD, totals


def norm_label(s):
    s = re.sub(r'\s+', ' ', s.replace(' - ', '-').replace('- ', '-')).strip()
    s = re.sub(r'\s*\(\s*a\s*\)', '(a)', s)
    s = s.replace('Ex-', 'Ex ').replace('ningun ', 'ningún ').replace('almacen)', 'almacén)')
    s = s.replace('Siquica', 'Psicosocial').replace('Discapacidad Múltiple', 'Discapacidad múltiple')
    s = s[0].upper() + s[1:]
    for a, b in [('Ex Novio(a)', 'Ex novio(a)'), ('Ex compañero(a) permanente', 'Excompañero(a) permanente'),
                 ('Ex novio(a)', 'Exnovio(a)'), ('Ex esposo(a)', 'Exesposo(a)'), ('Ex amante', 'Examante'),
                 ('Mental', 'Psicosocial (mental)'), ('Psicosocial', 'Psicosocial (mental)')]:
        if s == a:
            s = b
    s = s.replace('Psicosocial (mental) (mental)', 'Psicosocial (mental)')
    s = s.replace('Establecimiento comercial (tienda, centro comercial, almacén, plaza de mercado)',
                  'Establecimiento comercial (tienda, centro comercial, almacén)')
    return s


OTRO = {'cv': 'Otro', 'et': 'Sin pertenencia étnica reportada', 'ag': 'Otros agresores', 'es': 'Otros escenarios',
        'di': 'Sin discapacidad reportada', 'os': 'Otra / no reportada'}


def perfiles():
    lab = [norm_label(x) for x in PERF['lab']]
    out = {}
    for k, raw in PERF['res'].items():
        key, dim, lvl = k.split('.')
        dst = out.setdefault(key, {'d': {}, 'l': {}})[lvl]
        for blk in raw.split('|'):
            code, items = blk.split('=', 1)
            code = code.zfill(2 if lvl == 'd' else 5)
            if code in ('999', '00999'):
                continue
            acc = {}
            for it in items.split(','):
                i, n = it.split('.')
                name = OTRO[dim] if i == 'o' else 'Sin información' if i == 's' else lab[int(i)]
                a = acc.setdefault(name, [0, 0])
                if n == 'p':
                    a[1] = 1
                else:
                    a[0] += int(n, 36)
            rows = sorted(([n, v[0], v[1]] for n, v in acc.items()), key=lambda r: -r[1])
            dst.setdefault(code, {})[dim] = rows
    return out


def compact():
    """Formato compacto para publicar (sin conteos de 1 a 4: se reemplazan por -1).
    K[clave] = {"L": capas, "x": 1 si trae hombres, "mun": {cod5: [T.., U.., R..]}, "dep": {cod2: [T.., U.., R.., S..]}}
    con x=1 cada bloque es (mujeres, hombres); con x=0 solo mujeres."""
    def sup(v):
        return -1 if 0 < v < 5 else v
    K = {}
    for line in RAW.split('\n'):
        key, body = line.split('#', 1)
        x = 1 if key in ('PAR', 'SEX') else 0
        mun, dep = {}, {}
        for ent in body.split(';'):
            c, vals = ent.split(':', 1)
            v = [b36(q) for q in vals.split(',')]; v += [0] * (6 - len(v))
            if not x:
                v = [v[0], 0, v[1], 0, v[2], 0]
            c = c.zfill(5)
            if c == '00999':
                continue
            T = [v[0] + v[2] + v[4], v[1] + v[3] + v[5]]
            arr = T + v[:4]
            mun[c] = [sup(a) for a in (arr if x else arr[0::2])]
            d = dep.setdefault(c[:2], [0] * 8)
            for i, a in enumerate(T + v):
                d[i] += a
        K[key] = {'L': LAYERS[key], 'x': x, 'mun': mun,
                  'dep': {d: [sup(a) for a in (v if x else v[0::2])] for d, v in dep.items()}}
    return K


def perf_compact(P):
    labs, idx = [], {}
    def li(n):
        if n not in idx:
            idx[n] = len(labs); labs.append(n)
        return idx[n]
    out = {}
    for key, lv in P.items():
        out[key] = {l: {c: {dim: [[li(r[0]), -1 if r[2] and not r[1] else r[1], r[2]] for r in rows] for dim, rows in dims.items()} for c, dims in codes.items()} for l, codes in lv.items()}
    return {'lab': labs, 'p': out}


if __name__ == '__main__':
    import sys
    if '--compact' in sys.argv:
        _, tot = decode()
        C = {'K': compact(), 'perf': perf_compact(perfiles()), 'year': YEAR, 'tot': tot,
             'note': 'Medicina Legal vía datos.gov.co. 2025 preliminar (79dd-d24f, 2kpj-cktv). Perfiles: departamentos 2024 y municipios ¡LIBRES! 2021-2024 (9fs6-37ea, hyqu-diue). Celdas de 1 a 4 protegidas.'}
        p = H.parent / 'territorial_v23.json'
        p.write_text(json.dumps(C, ensure_ascii=False, separators=(',', ':')))
        print(p, p.stat().st_size)
        sys.exit()
    TD, tot = decode()
    TD['_perf'] = perfiles()
    TD['_meta'] = {'year': YEAR, 'totals_mujeres': tot,
                   'note': 'Medicina Legal vía datos.gov.co. 2025 preliminar (79dd-d24f, 2kpj-cktv). Perfiles: departamentos 2024, municipios ¡LIBRES! 2021-2024 (9fs6-37ea, hyqu-diue). Celdas de 1 a 4 protegidas.'}
    p = H.parent / 'territorial_v22.json'
    p.write_text(json.dumps(TD, ensure_ascii=False, separators=(',', ':')))
    print(p, p.stat().st_size, tot)
    for L in ('X-PAR', 'VBG-01', 'AMP-V01'):
        print(L, len(TD[L][YEAR]['mun']), 'municipios', {c: TD[L][YEAR]['mun'].get(c) for c in ['19573', '76364', '19110']})
