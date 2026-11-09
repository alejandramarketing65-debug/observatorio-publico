"""v34 · Paleta oficial ¡LIBRES! en todo el proyecto.

Paleta entregada: morado #672e89, violeta #a844e2, turquesa #35cbce y sus tonos claros.
Se aplica sobre los HTML ya construidos: cada color saturado se lleva al tono de la
paleta más cercano en luminosidad (morados, rosados, rojos, amarillos y cafés → familia
morado/violeta; azules y verdes → turquesa). Grises y neutros se conservan.
También elimina los degradados sobre tipografía (texto siempre en color sólido).
"""
import re, colorsys, sys
from pathlib import Path

VIOLET = ['#672e89', '#a844e2', '#c17bed', '#d4a2f2', '#eedcfa']
TURQ = ['#35cbce', '#72dbdd', '#9fe6e7', '#d7f5f5']
MUTED = ['#966fa9', '#b399c5', '#e2d5e6']


def hx(c):
    c = c.lstrip('#'); return tuple(int(c[i:i + 2], 16) / 255 for i in (0, 2, 4))


def lum(c):
    r, g, b = hx(c); return colorsys.rgb_to_hls(r, g, b)[1]


def nearest(ramp, l):
    return min(ramp, key=lambda c: abs(lum(c) - l))


KEEP = {c.lower() for c in VIOLET + TURQ + MUTED}


def map_rgb(r, g, b):
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    if s < .28 or l < .06:
        return None
    if l > .94:  # fondos casi blancos: blanco (no se inventan tonos fuera de la paleta)
        return '#ffffff'
    hd = h * 360
    if 160 <= hd < 250:
        return nearest(TURQ, l)
    if 38 <= hd < 160:  # amarillos y verdes → turquesa
        return nearest(TURQ, l)
    if s < .45 and l > .45:  # violetas apagados
        return nearest(MUTED + VIOLET[-2:], l)
    return nearest(VIOLET, l)


# v38 · énfasis invertido: el aguamarina pasa a ser el color protagonista y el morado
# se reserva para textos y detalles (el morado oscuro #672e89 se mantiene para legibilidad).
SWAP = {'#a844e2': '#35cbce', '#c17bed': '#72dbdd', '#d4a2f2': '#9fe6e7', '#eedcfa': '#d7f5f5',
        '#35cbce': '#a844e2', '#72dbdd': '#c17bed', '#9fe6e7': '#d4a2f2', '#d7f5f5': '#eedcfa',
        '#966fa9': '#72dbdd', '#b399c5': '#9fe6e7', '#e2d5e6': '#d7f5f5'}


def swap(c):
    return SWAP.get(c.lower(), c) if c else c


def sub_hex(m):
    c = m.group(0).lower()
    n = c if c in KEEP else map_rgb(*hx(c))
    return swap(n) if n else m.group(0)


def sub_rgba(m):
    r, g, b = (int(m.group(i)) / 255 for i in (2, 3, 4))
    n = map_rgb(r, g, b)
    if not n:
        return m.group(0)
    n = swap(n)
    R, G, B = (int(round(v * 255)) for v in hx(n))
    return '%s(%d,%d,%d%s' % (m.group('f'), R, G, B, m.group('rest'))


NOGRAD = ('<style id="lv34-solid">'
          '.lvHero h1 em,#lv23home .xhero h1 em,.lvsolid{background:none!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;-webkit-text-fill-color:currentColor!important}'
          '#lv23home .xhero h1 em{color:#35cbce!important}'
          '.lv22aqua{}'
          '.lvHero h1 em{color:#d4a2f2!important}'
          ':root{--lb-morado:#672e89;--lb-violeta:#a844e2;--lb-turquesa:#35cbce}'
          '</style>')



# v44 · pantalla de carga: mientras las capas del portal terminan de montarse no se ve el diseño
# anterior; se muestra un aviso limpio y, cuando la versión actual está lista, aparece de una vez.
LOAD_HEAD = ('<script>window.LV44_HASH=location.hash;</script><style id="lv44-load">html:not(.lv44ok) body>*:not(#lv44load){visibility:hidden!important}'
             '#lv44load{position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:#fff;font-family:Nunito,system-ui,sans-serif;transition:opacity .35s ease}'
             'html.lv44ok #lv44load{opacity:0;pointer-events:none}'
             '#lv44load b{font-size:clamp(22px,3vw,30px);font-weight:800;color:#672e89;text-align:center;line-height:1.15}'
             '#lv44load b span{display:block;font-size:.62em;font-weight:700;color:#1f8e91;margin-top:6px}'
             '#lv44load i{display:block;width:200px;height:5px;border-radius:9px;background:#e2d5e6;overflow:hidden;position:relative}'
             '#lv44load i:after{content:"";position:absolute;inset:0;width:40%;border-radius:9px;background:#35cbce;animation:lv44 1s ease-in-out infinite}'
             '@keyframes lv44{0%{transform:translateX(-100%)}100%{transform:translateX(260%)}}'
             '@media (prefers-reduced-motion:reduce){#lv44load i:after{animation:none;width:100%}}</style>')
LOAD_BODY = '<div id="lv44load" role="status" aria-live="polite"><b>Observatorio de Mujeres<span>en todas sus diversidades</span></b><i></i></div>'
LOAD_READY = ('<script id="lv44-ready">(function(){var D=document,R=D.documentElement,t0=Date.now();'
              'var H0=window.LV44_HASH||location.hash;function ok(){var h=location.hash||"#libres",site=/^#libres\/[\w-]+/.test(H0)||/^#libres\/[\w-]+/.test(h),home=h==="#libres"||h==="#";'
              'if(!D.getElementById("lv23top")||!D.querySelector("#navigation .nav41more"))return false;'
              'if(site)return !!D.getElementById("lv42");if(home)return !!D.querySelector("#lv23home .x41hero");return Date.now()-t0>250}'
              'function go(){if(ok()||Date.now()-t0>6000){scrollTo(0,0);R.classList.add("lv44ok");setTimeout(function(){var l=D.getElementById("lv44load");if(l)l.remove()},500);return}setTimeout(go,40)}'
              'if(D.readyState==="loading")D.addEventListener("DOMContentLoaded",go);else go()})();</script>')

LV54JS = '<script id="lv54-adm">(function(){var D=document;function go(){var n=D.getElementById(\'navigation\');if(!n)return setTimeout(go,300);var o=[\'adminhome\',\'datahome\',\'gestion\',\'portal11\',\'trazabilidad\'];o.forEach(function(k){var b=n.querySelector(\'button[data-page="\'+k+\'"]\');if(b)n.appendChild(b);});var a=n.querySelector(\'.lv54pub\');if(!a){a=D.createElement(\'a\');a.className=\'lv54pub\';a.href=\'Consulta_Publica_Observatorio.html\';a.target=\'_blank\';a.rel=\'noopener\';n.appendChild(a);}a.textContent=(D.documentElement.lang||\'es\').indexOf(\'en\')===0?\'View public site ↗\':\'Ver consulta pública ↗\';var m=n.querySelector(\'.nav41more\');if(m)m.remove();}if(D.readyState===\'loading\')D.addEventListener(\'DOMContentLoaded\',function(){setTimeout(go,900)});else setTimeout(go,900);new MutationObserver(function(){clearTimeout(go.t);go.t=setTimeout(go,200)}).observe(D.documentElement,{attributes:true,attributeFilter:[\'lang\']});})();</script>'

LV55 = '<script id="lv55-prev">(function(){var D=document,W=window;function wrap(){if(typeof W.v6Preview!==\'function\'||W.v6Preview.lv55)return setTimeout(wrap,400);var o=W.v6Preview;W.v6Preview=function(){o.apply(this,arguments);var pv=D.getElementById(\'v6LivePreview\');if(!pv)return;var code=\'\';try{code=(W.getIntake&&W.getIntake().code)||\'\';}catch(e){}var has=W.LV11&&W.LV11.kpi&&code?W.LV11.kpi(code):null;var src=\'Consulta_Publica_Observatorio.html#ind/\'+encodeURIComponent(code);var box=D.createElement(\'section\');box.className=\'lv55pub\';box.innerHTML=\'<div class="hd"><b>Así se ve en la consulta pública</b><span>\'+(has?\'Con datos publicados: \'+has.v:\'Ficha publicada · datos en preparación\')+\'</span><a href="\'+src+\'" target="_blank" rel="noopener">Abrir en pestaña nueva ↗</a></div><iframe title="Vista de la consulta pública" src="\'+src+\'" loading="lazy"></iframe><p>Esta vista usa los valores guardados en este navegador (incluidos los editados en «Contenidos del portal › Valores y gráficas»). Recarga para ver cambios recientes.</p>\';var old=pv.querySelector(\'.lv55pub\');if(old)old.remove();pv.appendChild(box);};W.v6Preview.lv55=1;}wrap();})();</script><style id="lv55-css">#v6PreviewDrawer.v6drawer{width:min(980px,96vw)!important;max-width:none!important}.lv55pub{margin-top:18px;border:1px solid #e2d5e6;border-radius:18px;overflow:hidden;background:#fff}.lv55pub .hd{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;background:#672e89;color:#fff;padding:12px 14px}.lv55pub .hd b{font:800 15px var(--lv-display)}.lv55pub .hd span{font:600 12.5px var(--lv-display);background:rgba(255,255,255,.15);border-radius:999px;padding:3px 10px}.lv55pub .hd a{margin-left:auto;color:#fff;background:#35cbce;color:#672e89;border-radius:999px;padding:6px 12px;font:800 12.5px var(--lv-display);text-decoration:none}.lv55pub iframe{display:block;width:100%;height:640px;border:0;background:#fff}.lv55pub p{margin:0;padding:10px 14px;font:500 12.5px var(--lv-display);color:#575756;background:#f8f6fa}</style>'

HEX = re.compile(r'#[0-9a-fA-F]{6}\b')
RGBA = re.compile(r'(?P<f>rgba?)\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?P<rest>\s*[,)])')


def recolor(path):
    s = path.read_text()
    # no tocar imágenes embebidas (base64 no contiene '#', pero sí '(' en data URIs no aplica)
    s = HEX.sub(sub_hex, s)
    s = RGBA.sub(sub_rgba, s)
    def solid(m):
        r = m.group(0)
        r = re.sub(r'background:linear-gradient\([^{}]*?\)(?=;|})', 'background:none', r)
        r = r.replace('-webkit-background-clip:text', '-webkit-background-clip:border-box').replace('background-clip:text', 'background-clip:border-box').replace('color:transparent', 'color:inherit')
        return r
    s = re.sub(r'\{[^{}]*background-clip:text[^{}]*\}', solid, s)
    extra = NOGRAD + '<style id="lv38-sistema">' + (Path(__file__).parent / 'lv38.css').read_text() + '</style><style id="lv41-base">' + (Path(__file__).parent / 'lv41.css').read_text() + '</style><style id="lv42-temas">' + (Path(__file__).parent / 'lv42.css').read_text() + '</style><style id="lv50-rutas">' + (Path(__file__).parent / 'lv50.css').read_text() + '</style>' + '<style id="lv56-colibri">' + (Path(__file__).parent / 'lv56.css').read_text() + '</style>'
    # se agrega al final del documento para que tenga prioridad sobre todas las capas
    s = s.replace('</body>', extra + '</body>', 1) if '</body>' in s else s + extra
    s = s.replace('versión v9 · actualización: 27 de octubre de 2026', 'versión v57 · actualización: 9 de noviembre de 2026')
    if 'Administracion' in path.name and 'lv54-adm' not in s:
        s = s.replace('</body>', '<style id="lv54-admin">' + (Path(__file__).parent / 'lv54.css').read_text() + '</style>' + LV54JS + LV55 + '</body>', 1)
    if 'Administracion' not in path.name and 'id="libres"' in s and 'lv44-load' not in s:
        # ajustes hechos en la versión publicada (GitHub, 6-9 nov): consulta limpia, menú en inglés, logo en la carga, texto justificado
        s = s.replace('<head>', '<head>' + LOAD_HEAD + (Path(__file__).parent / 'gh_ajustes_head.html').read_text(), 1)
        mlogo = re.search(r'<img class="brandLogo" src="([^"]+)"', s)
        body = LOAD_BODY.replace('aria-live="polite">', 'aria-live="polite">' + ('<img class="lv44logo" src="' + mlogo.group(1) + '" alt="">' if mlogo else ''), 1)
        s = re.sub(r'(<body[^>]*>)', lambda m: m.group(1) + body, s, count=1)
        s = s.replace('</body>', (Path(__file__).parent / 'gh_ajustes_end.html').read_text() + '</body>', 1)
        s = s.replace('</body>', LOAD_READY + '</body>', 1)
        # colibrí v56: sin recolorear (usa la paleta oficial tal cual)
        s = s.replace('</body>', '<script id="lv56-js">' + (Path(__file__).parent / 'lv56.js').read_text() + '</script></body>', 1)
    path.write_text(s)


if __name__ == '__main__':
    for p in sys.argv[1:]:
        recolor(Path(p)); print('recolor', p)
