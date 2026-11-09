"""Acuarelas entregadas por el equipo (dos láminas con tres grupos cada una).
- Grupos completos -> encabezados de sección (fondo blanco a transparente, borde orgánico).
- Retratos individuales -> micrositios, administración y otras zonas (círculo con borde difuminado)."""
from PIL import Image, ImageFilter, ImageDraw
import numpy as np, pathlib
B = pathlib.Path(__file__).parent; SRC = B / 'assets' / 'acuarelas'; OUT = B / 'wc2'
L = {'A': Image.open(SRC / 'lamina_A.png').convert('RGB'), 'B': Image.open(SRC / 'lamina_B.png').convert('RGB')}
def to_alpha(im):
    a = np.asarray(im).astype(float); al = np.clip((np.max((255 - a) / 255, axis=2) - .04) / .96, 0, 1)
    sf = np.where(al > 0, al, 1)[..., None]; rgb = np.clip(255 - (255 - a) / sf, 0, 255)
    return np.dstack([rgb, al * 255])
def ellipse_mask(w, h, cx, cy, rx, ry, feather=26):
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=255)
    return np.asarray(m.filter(ImageFilter.GaussianBlur(feather))).astype(float) / 255
CUTS = {'normativa': [(380, 400, 560, 620)]}
GROUPS = {  # lámina, caja, elipse (cx, cy, rx, ry) en coordenadas de la lámina
  'normativa':     ('A', (400, 0, 1150, 610), (774, 292, 360, 296)),
  'indicadores':   ('A', (0, 395, 700, 1024), (347, 712, 352, 318)),
  'publicaciones': ('A', (860, 395, 1536, 1024), (1215, 718, 325, 305)),
  'desagregada':   ('B', (360, 0, 1160, 585), (757, 290, 395, 290)),
  'rutas':         ('B', (0, 430, 690, 1024), (338, 728, 342, 292)),
  'conocimiento':  ('B', (840, 440, 1536, 1024), (1190, 735, 350, 292)),
}
PORTRAITS = {  # lámina, cx, cy, r
  'violencias': ('A', 1280, 720, 112), 'casas-refugio': ('B', 210, 800, 118), 'lgbtiq': ('A', 900, 455, 112), 'autonomia': ('B', 1110, 575, 108),
  'participacion': ('A', 535, 625, 118), 'educacion': ('B', 310, 690, 104), 'red-observatorios': ('A', 1210, 925, 92), 'comite-1257': ('A', 700, 105, 100),
  'comite-1719': ('A', 1095, 565, 118), 'comites-tecnico-juridicos': ('A', 1170, 745, 108), 'pan-1325': ('B', 895, 262, 96), 'salud-dsr': ('A', 365, 565, 112),
  'cuidados': ('B', 440, 785, 110), 'demografia': ('B', 720, 375, 118), 'rutas': ('A', 530, 850, 125), 'etnico': ('B', 585, 655, 122),
  # otras zonas
  'asistente': ('A', 120, 700, 115), 'admin': ('A', 215, 552, 108), 'login': ('B', 1350, 585, 112), 'faq': ('B', 1210, 760, 100), 'ruta-guia': ('B', 1080, 845, 122),
}
def build():
    OUT.mkdir(exist_ok=True); res = {}
    for k, (s, box, (cx, cy, rx, ry)) in GROUPS.items():
        im = L[s]; arr = to_alpha(im); w, h = im.size
        mm = Image.new('L', (w, h), 0); dr = ImageDraw.Draw(mm); dr.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=255)
        for (x0, y0, x1, y1) in CUTS.get(k, []): dr.ellipse((x0 - 60, y0, x1 + 60, y1 + 200), fill=0)
        m = np.asarray(mm.filter(ImageFilter.GaussianBlur(22))).astype(float) / 255; arr[..., 3] *= m
        o = Image.fromarray(arr.astype(np.uint8), 'RGBA').crop(box); o = o.crop(o.getbbox()); o.thumbnail((640, 640), Image.LANCZOS)
        p = OUT / ('g_' + k + '.webp'); o.save(p, 'WEBP', quality=84, method=6); res['g_' + k] = p
    for k, (s, cx, cy, r) in PORTRAITS.items():
        im = L[s].crop((cx - r, cy - r, cx + r, cy + r)).convert('RGBA'); n = 2 * r
        m = Image.new('L', (n, n), 0); ImageDraw.Draw(m).ellipse((10, 10, n - 10, n - 10), fill=255); m = m.filter(ImageFilter.GaussianBlur(7))
        im.putalpha(m); im = im.resize((220, 220), Image.LANCZOS)
        p = OUT / ('p_' + k + '.webp'); im.save(p, 'WEBP', quality=84, method=6); res['p_' + k] = p
    return res
if __name__ == '__main__':
    r = build(); import os; print(len(r), sum(os.path.getsize(v) for v in r.values()))
