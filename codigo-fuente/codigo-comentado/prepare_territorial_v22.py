"""Agregados territoriales (departamento, municipio y zona urbana/rural) para el visor geográfico.

Entrada: los CSV originales de Medicina Legal que ya usa el Observatorio
  - Lesiones_por_Violencia_de_Pareja_en_Colombia_-_Histórico_*.csv
  - Lesiones_no_fatales_de_causa_externa_-_Información_preliminar_-_*.csv
  - Lesiones_fatales_de_causa_externa_-_Información_preliminar_-_*.csv
Salida: territorial_v22.json con la estructura que lee el visor (window.LV22_DATA):
  { capa: { año: { mun: {cod: {m, h, prot}}, zona: { dep: {cod: {U:{m,h}, R:{m,h}}}, mun: {cod: {U:{...}, R:{...}}} } } } }

Reglas: conteo de filas (no personas únicas); celdas de 1 a 4 registros se omiten (m/h = null y prot = 1);
no se publican día, hora, localidad ni identificadores. Zona: «Cabecera municipal» = U; «Centro poblado» y
«Parte rural (vereda y campo)» o «Rural disperso» = R; otros valores (sin información) se excluyen de la zona.

Uso: python3 prepare_territorial.py carpeta_con_los_csv  >  territorial_v22.json
"""
import csv, json, re, sys, glob, unicodedata
from collections import defaultdict

LAYERS = {  # capa del visor: (patrón de archivo, filtro de categoría o None)
    'X-PAR': ('Violencia_de_Pareja', None),
    'VBG-01': ('no_fatales', r'Presunto Delito Sexual'), 'AMP-V07': ('no_fatales', r'Presunto Delito Sexual'), 'VBG-02': ('no_fatales', r'Presunto Delito Sexual'),
    'X-NNA': ('no_fatales', r'Niños, Niñas y Adolescentes'), 'X-MAY': ('no_fatales', r'Adulto Mayor'), 'X-FAM': ('no_fatales', r'otros Familiares'),
    'AMP-V01': ('_fatales_de', r'Homicid'), 'X-SUI': ('_fatales_de', r'Suicid'),
}
def norm(s): return unicodedata.normalize('NFD', s or '').encode('ascii', 'ignore').decode().lower().strip()
def col(h, *keys):
    for i, x in enumerate(h):
        if all(k in norm(x) for k in keys): return i
    return None
def zona(v):
    v = norm(v)
    if 'cabecera' in v or 'urbana' in v: return 'U'
    if 'rural' in v or 'centro poblado' in v or 'vereda' in v: return 'R'
    return None
def sexo(v):
    v = norm(v)
    return 'm' if v.startswith('muj') else 'h' if v.startswith('hom') else None
def run(folder):
    out = {}
    for layer, (pat, catre) in LAYERS.items():
        files = [f for f in glob.glob(folder + '/*.csv') if pat.lower() in f.lower() and ('no_fatales' not in f.lower() or pat == 'no_fatales')]
        if not files: continue
        C = defaultdict(lambda: defaultdict(int))
        for f in files:
            with open(f, encoding='utf-8-sig', newline='') as fh:
                r = csv.reader(fh); h = next(r)
                iy, isx, imun, iz = col(h, 'ano del hecho'), col(h, 'sexo de la v'), col(h, 'codigo dane municipio'), col(h, 'zona del hecho')
                icat = col(h, 'categoria') if catre else None
                for row in r:
                    if catre and icat is not None and not re.search(catre, row[icat] or '', re.I): continue
                    s = sexo(row[isx]); m = re.sub(r'\D', '', row[imun] or '').zfill(5)
                    if not s or len(m) != 5 or m == '00000': continue
                    y = row[iy][:4]; z = zona(row[iz]) if iz is not None else None
                    C[(y, m, 'T')][s] += 1
                    if z: C[(y, m, z)][s] += 1
        res = {}
        for (y, m, z), d in C.items():
            cell = {k: (v if v >= 5 else None) for k, v in d.items()}
            cell.setdefault('m', 0); cell.setdefault('h', 0)
            if any(v is None for v in cell.values()): cell['prot'] = 1
            Y = res.setdefault(y, {'mun': {}, 'zona': {'dep': {}, 'mun': {}}})
            if z == 'T': Y['mun'][m] = cell
            else:
                Y['zona']['mun'].setdefault(m, {})[z] = cell
                dz = Y['zona']['dep'].setdefault(m[:2], {}).setdefault(z, {'m': 0, 'h': 0})
                for k in ('m', 'h'): dz[k] += d.get(k, 0)
        out[layer] = res
    return out
if __name__ == '__main__':
    json.dump(run(sys.argv[1] if len(sys.argv) > 1 else '.'), sys.stdout, ensure_ascii=False)
