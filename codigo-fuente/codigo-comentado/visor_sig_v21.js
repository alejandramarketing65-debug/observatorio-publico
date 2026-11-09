/* ==========================================================================
   LIBRES v21 · Visor geográfico (tipo SIG) de «Indicadores en el mapa»
   - El mapa ocupa el tablero; capas, filtros, leyenda y detalle flotan
     dentro del mapa (no van aparte).
   - Capas: se pueden encender varios indicadores. La primera capa colorea los
     departamentos (relleno), la segunda se dibuja con círculos proporcionales
     y las demás entran al análisis de relaciones.
   - Relaciones: dispersión entre dos capas, correlación de Pearson y de
     Spearman por departamento, y matriz de correlaciones de las capas activas.
   - Tabla de atributos por departamento, ordenable y descargable.
   - Zoom y desplazamiento del mapa; opción referencial por 100.000 mujeres.
   La integración definitiva con el SIG institucional se hace en desarrollo;
   esta maqueta muestra el comportamiento esperado con los datos procesados.
   ========================================================================== */
(function () {
  'use strict';
  var W = window;
  var CSS = [
    ':host{--mag:#D33B78;--vino:#9E2C5A;--mor:#B243EA;--morm:#8E36CF;--mord:#6E24A8;--ink:#3c3c3b;--ink2:#575756;--muted:#6f6f6e;--line:#ebe2f1;--line2:#dccbe9;--lila:#F4E8FC;--leaf:4px 18px 4px 18px;display:block;max-width:100%;font-family:"Nunito Sans",system-ui,sans-serif;color:var(--ink)}',
    '*{box-sizing:border-box}button,input,select{font:inherit}',
    '.gis{position:relative;border-radius:8px 32px 8px 32px;overflow:hidden;background:radial-gradient(900px 600px at 70% 30%,#ffffff,#f4eef8 70%,#efe6f5);border:1px solid var(--line);height:min(82vh,820px);min-height:620px;box-shadow:0 30px 60px -44px #3b0f5c}',
    '.gis:fullscreen{height:100vh;border-radius:0}',
    '.stagemap{position:absolute;inset:0}',
    'svg.map{width:100%;height:100%;display:block;cursor:grab;touch-action:none}',
    'svg.map.drag{cursor:grabbing}',
    'svg.map path{stroke:#fff;stroke-width:.7;vector-effect:non-scaling-stroke;transition:fill .45s,opacity .2s;outline:none;cursor:pointer}',
    'svg.map path:hover,svg.map path:focus-visible{stroke:#2a1240;stroke-width:1.6}',
    'svg.map path.sel{stroke:#2a1240;stroke-width:2.6}',
    'svg.map.dim path:not(.sel){opacity:.6}',
    'svg.map circle.bub{fill:#2EDBBE;fill-opacity:.72;stroke:#0b5c4d;stroke-width:1;vector-effect:non-scaling-stroke;pointer-events:none;transition:r .45s}',
    'svg.map circle.bub.sel{fill:#F8C20A;stroke:#5b4500}',
    /* paneles flotantes */
    '.fl{position:absolute;z-index:2;background:#ffffffeb;backdrop-filter:blur(10px);border:1px solid #ffffff;box-shadow:0 18px 40px -22px #3b0f5c99;border-radius:6px 22px 6px 22px}',
    '.fh{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-bottom:1px solid var(--line);cursor:pointer;user-select:none}',
    '.fh b{font:900 13px "Nunito Sans",sans-serif;letter-spacing:.3px;display:flex;align-items:center;gap:7px}',
    '.fh b i{width:22px;height:22px;border-radius:3px 9px 3px 9px;background:linear-gradient(135deg,var(--morm),var(--mord));color:#fff;display:grid;place-items:center;font-style:normal;font-size:12px}',
    '.fh small{font-size:11px;color:var(--muted)}',
    '.fh .tg{border:0;background:var(--lila);color:var(--mord);border-radius:999px;width:24px;height:24px;font-weight:900;cursor:pointer}',
    '.fl.min .fb{display:none}',
    /* capas */
    '.capas{left:14px;top:14px;width:300px;max-height:calc(100% - 250px);display:flex;flex-direction:column}',
    '.capas .fb{overflow:auto;padding:8px 10px 10px}',
    '.capas input[type=search]{width:100%;border:1.5px solid var(--line2);border-radius:999px;padding:7px 12px;font-size:12.5px;outline:none;margin-bottom:6px}',
    '.grp{font:900 10px "Nunito Sans",sans-serif;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin:10px 4px 4px;display:flex;align-items:center;gap:6px}',
    '.grp i{width:8px;height:8px;border-radius:50%}',
    '.ly{display:grid;grid-template-columns:20px minmax(0,1fr);gap:6px;align-items:start;padding:7px 8px;border-radius:3px 12px 3px 12px;cursor:pointer;border:1.5px solid transparent}',
    '.ly:hover{background:#faf6fd}',
    '.ly.on{background:#fff;border-color:var(--line2);box-shadow:0 8px 18px -14px #3b0f5c}',
    '.ly input{margin:2px 0 0;width:16px;height:16px;accent-color:var(--morm)}',
    '.ly b{font:800 12.5px/1.3 "Nunito Sans",sans-serif;display:block}',
    '.ly .meta{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;align-items:center}',
    '.role{font:900 9.5px "Nunito Sans",sans-serif;letter-spacing:.5px;text-transform:uppercase;border-radius:2px 8px 2px 8px;padding:2px 7px;color:#fff}',
    '.role.r0{background:linear-gradient(135deg,var(--mag),var(--mord))}.role.r1{background:#17A58C}.role.r2{background:#8a8a89}',
    '.ly select{font-size:11.5px;border:1px solid var(--line2);border-radius:6px;padding:1px 4px;background:#fff}',
    '.ly .code{font-size:10.5px;color:var(--muted);font-weight:700}',
    '.sw{border:0;background:none;color:var(--mord);font:800 11px "Nunito Sans",sans-serif;cursor:pointer;padding:0;text-decoration:underline}',
    '.more{font-size:12px;margin:10px 4px 0;color:var(--ink2)}',
    '.more button{border:0;background:none;color:var(--mord);font-weight:800;cursor:pointer;padding:0;text-decoration:underline}',
    /* barra de herramientas */
    '.tools{left:50%;transform:translateX(-50%);top:14px;display:flex;align-items:center;gap:6px;padding:6px;border-radius:24px;max-width:calc(100% - 700px);flex-wrap:wrap;justify-content:center}',
    '.tools select{border:1.5px solid var(--line2);border-radius:999px;padding:6px 10px;font-size:12.5px;max-width:190px;background:#fff}',
    '.tb{border:0;background:#fff;border:1.5px solid var(--line2);border-radius:999px;min-width:32px;height:32px;padding:0 10px;font:800 12.5px "Nunito Sans",sans-serif;color:var(--ink2);cursor:pointer;display:inline-flex;align-items:center;gap:5px;white-space:nowrap}',
    '.tb:hover{border-color:var(--morm);color:var(--mord)}',
    '.tb.on{background:linear-gradient(135deg,var(--morm),var(--mord));color:#fff;border-color:transparent}',
    /* leyenda */
    '.legend{left:14px;bottom:14px;width:300px;padding:10px 12px;font-size:11.5px;display:grid;grid-template-columns:1fr 1fr;gap:6px 12px;max-height:222px;overflow:auto}',
    '.legend b{display:block;font:900 10px "Nunito Sans",sans-serif;letter-spacing:.8px;text-transform:uppercase;color:var(--muted);margin-bottom:4px;max-width:200px}',
    '.legend .row{display:flex;align-items:center;gap:6px;margin:2px 0}',
    '.legend i{width:18px;height:11px;border-radius:2px 6px 2px 6px;display:inline-block}',
    '.legend .h{background:repeating-linear-gradient(135deg,#f1eef3 0 3px,#c9c2cf 3px 4px)}',
    '.legend .c{border-radius:50%;background:#2EDBBE;opacity:.8;border:1px solid #0b5c4d;display:inline-block}',
    /* panel derecho */
    '.info{right:14px;top:14px;width:360px;max-height:calc(100% - 28px);display:flex;flex-direction:column}',
    '.tabs{display:flex;gap:4px;padding:8px 10px 0}',
    '.tabs button{flex:1;border:0;border-radius:3px 12px 0 0;padding:8px 6px;background:#f4eff8;font:800 12px "Nunito Sans",sans-serif;color:var(--ink2);cursor:pointer}',
    '.tabs button.on{background:#fff;color:var(--mord);box-shadow:0 -2px 0 var(--morm) inset}',
    '.info .fb{overflow:auto;padding:12px 14px 14px;background:#fff}',
    '.ttl{font:900 18px/1.2 "Nunito Sans",sans-serif;margin:0 0 2px}',
    '.sub{font-size:12px;color:var(--muted);margin:0 0 10px}',
    '.kv{border:1px solid var(--line);border-radius:3px 14px 3px 14px;padding:9px 11px;margin-bottom:8px;border-left:4px solid var(--c,#8e36cf)}',
    '.kv small{display:flex;justify-content:space-between;gap:6px;font:800 10.5px "Nunito Sans",sans-serif;color:var(--muted);text-transform:uppercase;letter-spacing:.5px}',
    '.kv b{display:block;font:900 20px/1.15 "Nunito Sans",sans-serif;margin:3px 0 2px}',
    '.kv span{font-size:11.5px;color:var(--ink2)}',
    '.bars{display:flex;flex-direction:column;gap:4px;margin:6px 0 4px}',
    '.bars div{display:grid;grid-template-columns:minmax(70px,40%) minmax(0,1fr) auto;gap:6px;align-items:center;font-size:11.5px;cursor:pointer}',
    '.bars span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:700;color:var(--ink2)}',
    '.bars i{height:9px;background:#f1ebf5;border-radius:2px 6px 2px 6px;overflow:hidden;display:block}',
    '.bars em{display:block;height:100%}',
    '.bars b{font-weight:800;font-variant-numeric:tabular-nums}',
    'h4{font:900 12.5px "Nunito Sans",sans-serif;margin:12px 0 4px}',
    '.note{font-size:11.5px;color:var(--muted);line-height:1.45;margin:8px 0 0}',
    '.answer{font-size:13px;line-height:1.5;background:#faf6fd;border-radius:3px 12px 3px 12px;padding:9px 11px;margin-bottom:10px;border-left:4px solid var(--morm)}',
    '.scatter{width:100%;height:auto;display:block;background:#fcfaff;border-radius:6px}',
    '.scatter circle{fill:var(--morm);fill-opacity:.7;stroke:#fff;cursor:pointer}',
    '.scatter circle.sel{fill:#F8C20A;stroke:#5b4500;stroke-width:2}',
    '.stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin:8px 0}',
    '.stats div{background:#faf6fd;border-radius:3px 10px 3px 10px;padding:7px 8px;text-align:center}',
    '.stats b{display:block;font:900 17px "Nunito Sans",sans-serif;color:var(--mord)}',
    '.stats span{font-size:10.5px;color:var(--ink2)}',
    '.mx{width:100%;border-collapse:separate;border-spacing:3px;font-size:11px;margin-top:4px}',
    '.mx th{font-weight:800;color:var(--ink2);text-align:left;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.mx td{text-align:center;border-radius:4px;padding:6px 2px;font-weight:900}',
    '.axsel{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px}',
    '.axsel label{font:800 10px "Nunito Sans",sans-serif;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}',
    '.axsel select{font-size:12px;border:1.5px solid var(--line2);border-radius:6px;padding:4px;width:100%}',
    '.facts{list-style:none;margin:0;padding:0;font-size:11.5px}.facts li{display:flex;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px dashed var(--line2)}.facts li span{color:var(--muted)}.facts li b{text-align:right}',
    /* tabla de atributos */
    '.tabla{position:absolute;left:0;right:0;bottom:0;z-index:3;background:#fff;border-top:1px solid var(--line);max-height:46%;display:none;flex-direction:column;box-shadow:0 -18px 30px -24px #3b0f5c}',
    '.tabla.on{display:flex}',
    '.tabla .th{display:flex;justify-content:space-between;align-items:center;padding:8px 14px;border-bottom:1px solid var(--line)}',
    '.tabla .th b{font:900 13px "Nunito Sans",sans-serif}',
    '.tabla .tw{overflow:auto}',
    '.tabla table{width:100%;border-collapse:collapse;font-size:12px}',
    '.tabla th{position:sticky;top:0;background:#faf6fd;text-align:left;padding:7px 10px;font-weight:800;cursor:pointer;white-space:nowrap}',
    '.tabla td{padding:6px 10px;border-top:1px solid var(--line);font-variant-numeric:tabular-nums}',
    '.tabla td.r,.tabla th.r{text-align:right}',
    '.tabla tr.sel td{background:#fff6d9}',
    '.tabla tbody tr{cursor:pointer}.tabla tbody tr:hover td{background:#faf6fd}',
    '.seg{display:inline-flex;gap:0}.seg .tb{border-radius:0}.seg .tb:first-child{border-radius:999px 0 0 999px}.seg .tb:last-child{border-radius:0 999px 999px 0;margin-left:-1.5px}',
    '#tools select#zsel{max-width:230px}',
    'svg.map.mlvl #deps{display:none}#depb{display:none}svg.map.mlvl #depb{display:inline}#depb path{fill:none;stroke:#6E24A8;stroke-width:1.4;vector-effect:non-scaling-stroke;pointer-events:none}',
    '#muns path{stroke:#fff;stroke-width:.6;vector-effect:non-scaling-stroke;cursor:pointer;transition:fill .4s}#muns path:hover{stroke:#2a1240;stroke-width:1.4}#muns path.out{opacity:.55}#muns path.sel{stroke:#2a1240;stroke-width:2.4}#muns path.lb{stroke:#F8C20A;stroke-width:1.8}',
    '.zb{margin:6px 0 2px}.zb>small,.pd>small{display:block;font-size:11.5px;font-weight:800;color:var(--muted);margin:6px 0 2px}',
    '.pd .bars div{grid-template-columns:minmax(0,1fr) auto;row-gap:1px}.pd .bars span{grid-column:1/-1;white-space:normal;font-weight:600}.zb .bars div{grid-template-columns:minmax(90px,46%) minmax(0,1fr) auto}',
    'details.perf{border:1px solid #eadff2;border-radius:6px 16px 6px 16px;padding:6px 10px;margin:6px 0;background:#fcf9fe}details.perf summary{cursor:pointer;display:flex;flex-direction:column;gap:1px;list-style:none}details.perf summary::-webkit-details-marker{display:none}details.perf summary b{color:#6E24A8;font-size:13px}details.perf summary b:before{content:"▸ ";}details.perf[open] summary b:before{content:"▾ "}details.perf summary small{color:var(--muted);font-size:11.5px}',
    '.crumb{display:flex;flex-wrap:wrap;gap:4px;align-items:center;font-size:12px;margin:0 0 6px}.crumb a{color:var(--mord);font-weight:800;text-decoration:none}.crumb span{color:var(--muted)}',
    '.lbb{display:inline-block;font:900 9.5px "Nunito Sans",sans-serif;letter-spacing:.5px;text-transform:uppercase;background:#fff3c4;color:#6b5000;border-radius:2px 8px 2px 8px;padding:2px 7px;margin-left:6px;vertical-align:2px}',
    '.zone{border:1px dashed var(--line2);border-radius:3px 14px 3px 14px;padding:9px 11px;margin:8px 0;font-size:12px;background:#fcfaff}.zone b{font-size:12.5px}',
    '.mlist{display:flex;flex-direction:column;gap:2px;max-height:220px;overflow:auto;margin-top:4px}.mlist button{display:flex;justify-content:space-between;gap:8px;border:0;background:none;text-align:left;padding:5px 6px;border-radius:6px;cursor:pointer;font-size:12px;color:var(--ink)}.mlist button:hover{background:#faf6fd}.mlist small{color:var(--muted)}',
    '.tip{position:fixed;z-index:60;pointer-events:none;background:#2a1240;color:#fff;border-radius:3px 12px 3px 12px;padding:8px 11px;font-size:12px;line-height:1.45;box-shadow:0 14px 30px -12px #000a;opacity:0;transition:opacity .12s;max-width:280px}',
    '.tip.on{opacity:1}.tip b{font-size:13px}',
    '.badge{display:inline-block;font:900 9.5px "Nunito Sans",sans-serif;letter-spacing:.6px;text-transform:uppercase;background:#fff3c4;color:#6b5000;border-radius:2px 8px 2px 8px;padding:2px 7px;margin-left:4px}',
    '@media(max-width:1180px){.tools{left:auto;right:14px;transform:none;top:auto;bottom:14px;max-width:none}.info{width:320px;max-height:calc(100% - 90px)}.capas{width:270px}.legend{width:270px}}',
    '@media(max-width:900px){.gis{height:auto;min-height:0;display:flex;flex-direction:column;overflow:visible;border-radius:8px 24px 8px 24px}.stagemap{position:relative;height:440px;order:2}.fl{position:relative;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;width:auto!important;max-width:none!important;max-height:none!important;margin:8px}.capas{order:1}.capas .fb{max-height:300px}.tools{order:3;flex-wrap:wrap;border-radius:6px 22px 6px 22px}.legend{order:4}.info{order:5}.tabla{position:relative;order:6;max-height:420px}}',
    '@media(prefers-reduced-motion:reduce){*{transition:none!important}}'
  ].join('\n');

  W.LV21_MOUNT = function (root, D, NAT, CFG) {
    function E(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function N(v, d) { return v == null || isNaN(v) ? '—' : Number(v).toLocaleString('es-CO', { maximumFractionDigits: d || 0, minimumFractionDigits: d || 0 }); }
    var GEO = D.geo.map(function (g) { return { code: g.code, name: g.name, path: g.path }; }), NAME = {}; GEO.forEach(function (g) { NAME[g.code] = g.name; });
    var SRC = {}; D.sources.forEach(function (s) { SRC[s.id] = s; });
    var SITE = {}; D.sites.forEach(function (s) { SITE[s.id] = s; });
    function tcol(t) { var s = SITE[D.t2s[t]]; return s ? s.c : '#8E36CF'; }
    var PAL = ['#F6E3EF', '#E7B3D2', '#CF7DB6', '#A54A98', '#6E24A8'];
    var MAPS = {
      'VBG-04': { src: 'pareja', kind: 'share', unit: '% de los registros de violencia de pareja que son mujeres' },
      'VBG-01': { src: 'nofatal', cat: /Presunto Delito Sexual/, kind: 'count', unit: 'exámenes por presunto delito sexual a mujeres' },
      'AMP-V07': { src: 'nofatal', cat: /Presunto Delito Sexual/, kind: 'count', unit: 'exámenes por presunto delito sexual a mujeres' },
      'VBG-02': { src: 'nofatal', cat: /Presunto Delito Sexual/, kind: 'share', unit: '% de los exámenes por delito sexual que son a mujeres' },
      'AMP-V01': { src: 'fatal', cat: /Homicid/, kind: 'count', unit: 'presuntos homicidios de mujeres', note: 'Conteo hasta validar el denominador. Un homicidio de una mujer no equivale a feminicidio.' },
      'CUI-04': { src: 'enut', kind: 'pct', unit: '% de mujeres que participan en trabajo no remunerado' },
      'CUI-02': { src: 'enut', kind: 'gap', unit: 'puntos de diferencia mujeres − hombres en trabajo no remunerado' },
      'X-PAR': { src: 'pareja', kind: 'count', unit: 'lesiones por violencia de pareja a mujeres', name: 'Lesiones por violencia de pareja contra mujeres', theme: 'Vida libre de violencias', source: 'Medicina Legal' },
      'X-NNA': { src: 'nofatal', cat: /Niños, Niñas y Adolescentes/, kind: 'count', unit: 'lesiones por violencia intrafamiliar a niñas y adolescentes', name: 'Violencia intrafamiliar contra niñas y adolescentes', theme: 'Vida libre de violencias', source: 'Medicina Legal' },
      'X-MAY': { src: 'nofatal', cat: /Adulto Mayor/, kind: 'count', unit: 'lesiones por violencia intrafamiliar a mujeres mayores', name: 'Violencia intrafamiliar contra mujeres mayores', theme: 'Vida libre de violencias', source: 'Medicina Legal' },
      'X-FAM': { src: 'nofatal', cat: /otros Familiares/, kind: 'count', unit: 'lesiones por violencia de otros familiares a mujeres', name: 'Violencia entre otros familiares contra mujeres', theme: 'Vida libre de violencias', source: 'Medicina Legal' },
      'X-SUI': { src: 'fatal', cat: /Suicid/, kind: 'count', unit: 'suicidios de mujeres', name: 'Suicidios de mujeres', theme: 'Salud y derechos sexuales', source: 'Medicina Legal', note: 'Tema sensible. Si necesitas ayuda: Línea 106 o 123.' },
      'X-POB': { kind: 'pop', unit: 'mujeres (proyección DANE)', name: 'Población de mujeres', theme: 'Demografía y diversidades', source: 'DANE · proyecciones' }
    };
    Object.keys(MAPS).forEach(function (k) { MAPS[k].code = k; });
    /* datos territoriales v23: municipio × zona (Medicina Legal 2025, preliminar) y perfiles.
       Formato compacto publicado sin celdas de 1 a 4 (llegan como -1 = protegido). */
    var TT = W.LV23_TERR || null, TD = W.LV22_DATA || {}, PERF = TT ? TT.perf : null;
    if (TT) Object.keys(TT.K).forEach(function (key) {
      var K = TT.K[key], x = K.x;
      K.L.forEach(function (code) {
        var share = (MAPS[code] || {}).kind === 'share';
        function cell(m, h) { if (share) return (m < 0 || h < 0) ? { m: null, h: null, prot: 1 } : { m: m, h: h, prot: 0 }; return m < 0 ? { m: null, h: 0, prot: 1 } : { m: m, h: x ? h : 0, prot: 0 }; }
        function blk(a, i) { return x ? cell(a[2 * i], a[2 * i + 1]) : cell(a[i], 0); }
        var o = { mun: {}, dep: {}, zona: { mun: {}, dep: {} } };
        Object.keys(K.mun).forEach(function (c) { var a = K.mun[c]; o.mun[c] = blk(a, 0); o.zona.mun[c] = { U: blk(a, 1), R: blk(a, 2) }; });
        Object.keys(K.dep).forEach(function (d) { var a = K.dep[d]; o.dep[d] = blk(a, 0); o.zona.dep[d] = { U: blk(a, 1), R: blk(a, 2), S: blk(a, 3) }; });
        (TD[code] = TD[code] || {})[TT.year] = o;
      });
    });
    function tdYears(code) { return TD[code] ? Object.keys(TD[code]).filter(function (y) { return /^\d/.test(y); }).sort() : []; }
    var CAT = {}; D.cat.forEach(function (x) { CAT[x.code] = x; });
    var LAYERS = Object.keys(MAPS).filter(function (k) { return CFG.hidden.indexOf(k) < 0 && (k.indexOf('X-') === 0 || CAT[k]); }).map(function (k) { var c = CAT[k] || {}, m = MAPS[k]; return { code: k, name: m.name || c.name, theme: m.theme || c.theme, source: m.source || c.source, formula: c.formula, status: c.status || 'Análisis del Observatorio', m: m }; });
    var NOMAP = D.cat.filter(function (x) { return !MAPS[x.code]; });
    function periods(m) { if (m.kind === 'pop') { var y = {}; D.pop.rows.forEach(function (r) { y[r.year] = 1; }); return Object.keys(y).sort(); } var p = SRC[m.src].periods.slice(); tdYears(m.code).forEach(function (y) { if (p.indexOf(y) < 0) p.push(y); }); return p.sort(); }
    function defYear(m) { var p = m.src ? SRC[m.src].periods.slice() : periods(m), s = SRC[m.src]; if (s && String(s.preliminary) === 'true' && p.length > 1) return p[p.length - 2]; if (m.kind === 'pop') return p.indexOf('2025') > -1 ? '2025' : p[p.length - 1]; return p[p.length - 1]; }
    function popW(d, y) { var rows = D.pop.rows.filter(function (r) { return r.dept === d; }); if (!rows.length) return null; var ex = rows.find(function (r) { return r.year === y; }); if (ex) return ex.women; rows.sort(function (a, b) { return Math.abs(+a.year - +y) - Math.abs(+b.year - +y); }); return rows[0].women; }
    var cache = {};
    function values(L, y) {
      var key = L.code + '|' + y + '|' + st.rate; if (cache[key]) return cache[key];
      var m = L.m, out = {};
      if (m.kind === 'pop') { D.pop.rows.forEach(function (r) { if (r.year === y) out[r.dept] = { v: r.women }; }); return (cache[key] = out); }
      SRC[m.src].rows.forEach(function (r) {
        if (r.year !== y || (m.cat && !m.cat.test(r.category))) return;
        var o = out[r.dept] || (out[r.dept] = { m: 0, h: 0, pm: null, ph: null, prot: 0, lo: null, hi: null });
        if (r.suppressed || r.count == null) { o.prot++; return; }
        if (m.kind === 'pct' || m.kind === 'gap') { if (r.sex === 'Mujer') { o.pm = r.count; o.lo = r.lower; o.hi = r.upper; } else if (r.sex === 'Hombre') o.ph = r.count; return; }
        if (r.sex === 'Mujer') o.m += r.count; else if (r.sex === 'Hombre') o.h += r.count;
      });
      var tdy = TD[L.code] && TD[L.code][y];
      if (!Object.keys(out).length && tdy && tdy.dep) Object.keys(tdy.dep).forEach(function (d) { var q = tdy.dep[d]; out[d] = { m: q.m || 0, h: q.h || 0, pm: null, ph: null, prot: q.prot ? 1 : 0, lo: null, hi: null, td: 1 }; });
      Object.keys(out).forEach(function (k) {
        var o = out[k];
        if (m.kind === 'count') { o.v = o.m || (o.prot ? null : 0); if (st.rate && o.v != null) { var p = popW(k, y.slice(0, 4)); o.raw = o.v; o.v = p ? o.v / p * 1e5 : null; } }
        if (m.kind === 'share') o.v = (o.m + o.h) ? o.m / (o.m + o.h) * 100 : null;
        if (m.kind === 'pct') o.v = o.pm;
        if (m.kind === 'gap') o.v = (o.pm != null && o.ph != null) ? o.pm - o.ph : null;
      });
      return (cache[key] = out);
    }
    function isRate(L) { return st.rate && L.m.kind === 'count'; }
    function unit(L) { return isRate(L) ? L.m.unit + ' por 100.000 mujeres (referencial)' : L.m.unit; }
    function fmt(L, v) { if (v == null) return '—'; var k = L.m.kind; if (k === 'share' || k === 'pct') return N(v, 1) + ' %'; if (k === 'gap') return (v > 0 ? '+' : '') + N(v, 1) + ' pp'; if (isRate(L)) return N(v, 1); return N(v); }
    function national(L, y, V) {
      var m = L.m;
      if (m.kind === 'pct') return NAT.M; if (m.kind === 'gap') return NAT.M - NAT.H;
      if (m.kind === 'share') { var a = 0, t = 0; Object.keys(V).forEach(function (k) { a += V[k].m; t += V[k].m + V[k].h; }); return t ? a / t * 100 : null; }
      if (isRate(L)) { var s = 0, p = 0; Object.keys(V).forEach(function (k) { if (V[k].raw != null) { s += V[k].raw; p += popW(k, y.slice(0, 4)) || 0; } }); return p ? s / p * 1e5 : null; }
      var t2 = 0; Object.keys(V).forEach(function (k) { t2 += V[k].v || 0; }); return t2;
    }
    function breaks(vals) { var a = vals.filter(function (v) { return v != null; }).sort(function (x, y) { return x - y; }); if (!a.length) return []; var b = []; for (var i = 1; i < 5; i++) b.push(a[Math.min(a.length - 1, Math.floor(a.length * i / 5))]); return b; }
    function cls(v, b) { if (v == null) return -1; var i = 0; while (i < b.length && v >= b[i]) i++; return i; }
    function byCode(c) { return LAYERS.find(function (l) { return l.code === c; }); }

    /* ---------- estado ---------- */
    var first = byCode(CFG.def) || LAYERS[0];
    var st = { act: [], year: {}, dep: null, rate: false, tab: 'det', ax: [0, 1], q: '', table: false, sort: { k: 'name', d: 1 }, vb: null, nomap: false, lvl: 'dep', zona: 'T', mun: null };
    function homeVB() { var g = root.getElementById && root.getElementById('gis'), w = g ? g.clientWidth : 1200; if (w < 900) return [0, 0, 410, 490]; var h = g.clientHeight || 700, free = w - 320 - 380, k = Math.min(free / 430, (h - 30) / 500), vw = w / k, vh = h / k; return [205 - vw / 2 + (320 - 380) / 2 / k, 245 - vh / 2, vw, vh]; }
    function activate(c) { var L = byCode(c); if (!L) return; if (st.act.indexOf(c) < 0) { st.act.push(c); if (st.act.length > 4) st.act.shift(); } if (!st.year[c]) st.year[c] = defYear(L.m); }
    if (first) activate(first.code);
    if (CFG.hidden.indexOf('X-POB') < 0 && (!first || first.code !== 'X-POB')) activate('X-POB');
    function act() { return st.act.map(byCode).filter(Boolean); }

    /* ---------- estructura ---------- */
    root.innerHTML = '<style>' + CSS + '</style><div class="gis" id="gis"><div class="stagemap"><svg class="map" id="map" viewBox="0 0 410 490" role="group" aria-label="Mapa de Colombia por departamento"><defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#f1eef3"/><path d="M0 6L6 0" stroke="#c9c2cf" stroke-width="1.2"/></pattern></defs><g id="muns"></g><g id="deps"></g><g id="depb"></g><g id="bubs"></g></svg></div>' +
      '<section class="fl capas" id="capas"><div class="fh" data-min="capas"><b><i>≡</i>Capas</b><small>Enciende hasta 4</small><button class="tg" aria-label="Contraer">–</button></div><div class="fb" id="capasb"></div></section>' +
      '<div class="fl tools" id="tools"></div>' +
      '<div class="fl legend" id="legend"></div>' +
      '<section class="fl info" id="info"><div class="fh" data-min="info"><b><i>i</i>Datos procesados</b><button class="tg" aria-label="Contraer">–</button></div><div class="tabs" id="tabs"></div><div class="fb" id="infob" aria-live="polite"></div></section>' +
      '<section class="tabla" id="tabla"></section></div><div class="tip" id="tip" role="tooltip"></div>';
    var $ = function (id) { return root.getElementById(id); };
    var svg = $('map');
    var TG = W.LV22_GEO || null, BUL = (W.LV11_DEFAULTS || {}).bulletins || {};
    var LIBRES = { '19110': 1, '19212': 1, '19573': 1, '19780': 1, '76275': 1, '76563': 1, '76364': 1 };
    var MUN = {}, MUNS = TG ? TG.mun.map(function (m) { var o = { c: m[0], d: m[1], n: m[2], p: m[3] }; MUN[o.c] = o; return o; }) : [];
    if (TG) GEO.forEach(function (g) { if (TG.dep[g.code]) g.path = TG.dep[g.code]; });
    function zl() { return { T: 'Total', U: 'Cabecera (urbana)', R: 'Centros poblados y rural disperso' }[st.zona]; }
    // valores territoriales procesados (municipio y zona). Estructura: LV22_DATA[capa][año] = { mun: {cod: {m,h,prot}}, zona: {dep: {cod: {U:{m,h},R:{m,h}}}, mun: {...}} }
    function tdat(L, y) { var t = TD[L.code] || (L.m.src && TD['src:' + L.m.src + ':' + (L.m.cat ? L.m.cat.source : '')]); return t && t[y] ? t[y] : null; }
    function v2(L, o) { if (!o) return null; if (L.m.kind === 'count' || L.m.kind === 'pop') return o.m != null ? o.m : null; if (L.m.kind === 'share') return (o.m + o.h) ? o.m / (o.m + o.h) * 100 : null; return o.v != null ? o.v : null; }
    function munValues(L, y) { var t = tdat(L, y), out = {}; if (!t) return out; var src = st.zona === 'T' ? t.mun : (t.zona && t.zona.mun); if (!src) return out; Object.keys(src).forEach(function (k) { var o = st.zona === 'T' ? src[k] : src[k][st.zona]; var v = v2(L, o); out[k] = { v: v, prot: o && o.prot }; }); if (L.m.kind === 'count') MUNS.forEach(function (m) { if (!out[m.c]) out[m.c] = { v: 0, zero: 1 }; }); return out; }
    function syncY() { if (st.lvl !== 'mun' && st.zona === 'T') return; if (!act().some(function (L) { return tdYears(L.code).length; }) && byCode('X-PAR')) activate('X-PAR'); act().forEach(function (L) { var ys = tdYears(L.code); if (ys.length && !tdat(L, st.year[L.code])) st.year[L.code] = ys[ys.length - 1]; }); renderCapas(); }
    function prelim(L, y) { var s = L.m.src && SRC[L.m.src]; return (s && s.periods.indexOf(y) < 0 && tdYears(L.code).indexOf(y) > -1) || (s && String(s.preliminary) === 'true' && y === s.periods[0]); }
    /* reparto por zona del hecho y perfiles de las víctimas */
    function zoneOf(L, code, isMun) { var t = tdat(L, st.year[L.code]); if (!t || !t.zona) return null; return (isMun ? t.zona.mun : t.zona.dep)[code] || null; }
    function zoneBlock(A, code, isMun) {
      var h = '';
      A.forEach(function (L) { if (L.m.kind !== 'count') return; var z = zoneOf(L, code, isMun); if (!z && !(isMun && tdat(L, st.year[L.code]))) return; z = z || { U: { m: 0 }, R: { m: 0 } };
        var it = [['Cabecera (urbana)', z.U, '#8E36CF'], ['Centros poblados y rural disperso', z.R, '#17A58C']].concat(z.S && (z.S.m || z.S.prot) ? [['Zona sin información', z.S, '#bdb6c4']] : []);
        var tot = it.reduce(function (s, r) { return s + (r[1].m || 0); }, 0);
        h += '<div class="zb"><small>' + E(L.name) + ' · ' + E(st.year[L.code]) + (prelim(L, st.year[L.code]) ? ' (preliminar)' : '') + '</small>' + bars(it.map(function (r) { return { l: r[0], v: r[1].m || 0, t: r[1].prot ? '1–4 · protegido' : N(r[1].m || 0) + (tot ? ' · ' + N((r[1].m || 0) / tot * 100, 0) + ' %' : ''), c: r[2] }; }), Math.max(1, it.reduce(function (s, r) { return Math.max(s, r[1].m || 0); }, 0)), '#8E36CF') + '</div>'; });
      return h ? '<h4>Urbano y rural · zona del hecho</h4>' + h : '';
    }
    var PKEY = { 'X-PAR': 'PAR', 'VBG-04': 'PAR', 'VBG-01': 'SEX', 'AMP-V07': 'SEX', 'VBG-02': 'SEX' };
    var PDIM = [['cv', 'Curso de vida'], ['et', 'Pertenencia étnica'], ['ag', 'Presunto agresor'], ['es', 'Escenario del hecho'], ['di', 'Discapacidad'], ['os', 'Orientación sexual']];
    function perfBlock(A, code, isMun) {
      if (!PERF) return '';
      var keys = []; A.forEach(function (L) { var k = PKEY[L.code]; if (k && keys.indexOf(k) < 0) keys.push(k); });
      if (!keys.length) return '';
      var h = '';
      keys.forEach(function (k) {
        var lv = isMun ? 'l' : 'd', P = PERF.p[k] && PERF.p[k][lv] && PERF.p[k][lv][code], own = !!P, dep = isMun && MUN[code] ? MUN[code].d : code;
        if (!P && isMun) { P = PERF.p[k].d[dep]; lv = 'd'; }
        if (!P) return;
        var ttl = k === 'PAR' ? 'Violencia de pareja contra mujeres' : 'Presunto delito sexual contra mujeres';
        h += '<details class="perf"' + (h ? '' : ' open') + '><summary><b>Perfil · ' + ttl + '</b><small>' + (lv === 'l' ? E(MUN[code].n) + ' · 2021–2024 sumados' : E(NAME[dep]) + ' · 2024') + '</small></summary>';
        if (isMun && !own) h += '<p class="note">El perfil municipal se publica para los 7 municipios ¡LIBRES!; aquí se muestra el del departamento.</p>';
        PDIM.forEach(function (dm) { var rows = P[dm[0]]; if (!rows || !rows.length) return; var tot = rows.reduce(function (s, r) { return s + Math.max(0, r[1]); }, 0);
          h += '<div class="pd"><small>' + dm[1] + '</small>' + bars(rows.slice(0, 6).map(function (r) { return { l: PERF.lab[r[0]], v: Math.max(0, r[1]), t: r[1] < 0 ? '1–4 · protegido' : (r[2] ? '≥ ' : '') + N(r[1]) + (tot ? ' · ' + N(r[1] / tot * 100, 0) + ' %' : ''), c: k === 'PAR' ? '#A54A98' : '#1A82B9' }; }), rows.reduce(function (s, r) { return Math.max(s, r[1]); }, 1), '#A54A98') + '</div>'; });
        h += '<p class="note">Medicina Legal · ' + (k === 'PAR' ? 'violencia de pareja' : 'exámenes por presunto delito sexual') + ', solo mujeres. «≥» suma categorías equivalentes con alguna celda protegida.</p></details>';
      });
      return h ? '<h4>¿Quiénes y dónde? · perfil de las víctimas</h4>' + h : '';
    }
    function munRank(L, c) { var MV = munValues(L, st.year[L.code]), d = MUN[c].d, ks = Object.keys(MV).filter(function (k) { return MUN[k] && MUN[k].d === d && MV[k].v != null; }).sort(function (a, b) { return MV[b].v - MV[a].v; }); return { pos: ks.indexOf(c) + 1, n: ks.length, top: ks }; }
    function zoneDep(L, y) { var t = tdat(L, y); if (!t || !t.zona || !t.zona.dep || st.zona === 'T') return null; var out = {}; Object.keys(t.zona.dep).forEach(function (k) { out[k] = { v: v2(L, t.zona.dep[k][st.zona]) }; }); return out; }
    function hasMun(L) { var t = tdat(L, st.year[L.code]); return !!(t && t.mun); }
    function hasZone(L) { var t = tdat(L, st.year[L.code]); return !!(t && t.zona); }
    $('deps').innerHTML = GEO.map(function (g) { return '<path d="' + g.path + '" data-d="' + g.code + '" tabindex="0" role="button" aria-label="' + E(g.name) + '"></path>'; }).join('');
    var CENT = {}; svg.setAttribute('preserveAspectRatio', 'xMidYMid meet'); GEO.forEach(function (g) { var n = (g.path.match(/-?\d+(\.\d+)?/g) || []).map(Number), x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (var i = 0; i + 1 < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]); } CENT[g.code] = [(x0 + x1) / 2, (y0 + y1) / 2]; });
    CENT['25'] = CENT['25'] && CENT['11'] ? [CENT['25'][0] - 6, CENT['25'][1] + 6] : CENT['25'];

    /* ---------- capas ---------- */
    function renderCapas() {
      var q = st.q.toLowerCase(), groups = {};
      LAYERS.forEach(function (L) { if (q && (L.code + ' ' + L.name).toLowerCase().indexOf(q) < 0) return; (groups[L.theme] = groups[L.theme] || []).push(L); });
      var roleName = ['Relleno', 'Círculos', 'Análisis', 'Análisis'];
      var h = '<input type="search" id="lq" placeholder="Buscar capa…" value="' + E(st.q) + '" aria-label="Buscar capa">';
      Object.keys(groups).forEach(function (t) {
        h += '<div class="grp"><i style="background:' + tcol(t) + '"></i>' + E(t) + '</div>' + groups[t].map(function (L) {
          var i = st.act.indexOf(L.code), on = i > -1, ps = periods(L.m);
          return '<label class="ly' + (on ? ' on' : '') + '"><input type="checkbox" data-l="' + L.code + '"' + (on ? ' checked' : '') + '><span><b>' + E(L.name) + '</b><span class="meta">' +
            (on ? '<span class="role r' + Math.min(i, 2) + '">' + roleName[i] + '</span>' + (ps.length > 1 ? '<select data-y="' + L.code + '" aria-label="Periodo">' + ps.map(function (y) { return '<option' + (y === st.year[L.code] ? ' selected' : '') + '>' + y + '</option>'; }).join('') + '</select>' : '<span class="code">' + E(ps[0]) + '</span>') + (i > 0 ? ' <button class="sw" data-up="' + L.code + '" type="button">Subir</button>' : '') : '') + '</span></span></label>';
        }).join('');
      });
      h += '<p class="more">' + NOMAP.length + ' indicadores del catálogo aún no tienen datos por departamento. <button type="button" id="nomapb">Ver fichas</button></p>';
      $('capasb').innerHTML = h;
      var lq = $('lq'); lq.oninput = function () { st.q = this.value; var pos = this.selectionStart; renderCapas(); var n = $('lq'); n.focus(); n.setSelectionRange(pos, pos); };
    }
    /* ---------- herramientas ---------- */
    function renderTools() {
      $('tools').innerHTML = '<select id="dsel" aria-label="Ir a departamento"><option value="">Ir a departamento…</option>' + GEO.slice().sort(function (a, b) { return a.name.localeCompare(b.name); }).map(function (g) { return '<option value="' + g.code + '"' + (st.dep === g.code ? ' selected' : '') + '>' + E(g.name) + '</option>'; }).join('') + '</select>' +
        (st.lvl === 'mun' && st.dep && TG ? '<select id="msel" aria-label="Ir a municipio"><option value="">Ir a municipio…</option>' + MUNS.filter(function (m) { return m.d === st.dep; }).sort(function (a, b) { return a.n.localeCompare(b.n); }).map(function (m) { return '<option value="' + m.c + '"' + (st.mun === m.c ? ' selected' : '') + '>' + E(m.n) + '</option>'; }).join('') + '</select>' : '') +
        '<span class="seg" role="group" aria-label="Nivel territorial"><button class="tb' + (st.lvl === 'dep' ? ' on' : '') + '" data-lvl="dep">Departamento</button><button class="tb' + (st.lvl === 'mun' ? ' on' : '') + '" data-lvl="mun">Municipio</button></span>' +
        '<select id="zsel" aria-label="Zona"><option value="T"' + (st.zona === 'T' ? ' selected' : '') + '>Zona: total</option><option value="U"' + (st.zona === 'U' ? ' selected' : '') + '>Cabecera (urbana)</option><option value="R"' + (st.zona === 'R' ? ' selected' : '') + '>Rural (centros poblados y disperso)</option></select>' +
        '<button class="tb" data-z="in" title="Acercar" aria-label="Acercar">＋</button><button class="tb" data-z="out" title="Alejar" aria-label="Alejar">－</button><button class="tb" data-z="reset" title="Ver todo el país">⤢ País</button>' +
        '<button class="tb' + (st.rate ? ' on' : '') + '" id="rate" title="Divide los conteos por la población de mujeres del departamento (referencial)">Por 100.000 mujeres</button>' +
        '<button class="tb' + (st.table ? ' on' : '') + '" id="tbl">▦ Tabla</button><button class="tb" id="fs" title="Pantalla completa">⛶</button>';
      $('dsel').onchange = function () { pick(this.value || null, true); };
      if ($('msel')) $('msel').onchange = function () { if (this.value) pickMun(this.value, true); };
      $('zsel').onchange = function () { st.zona = this.value; syncY(); renderMap(); renderInfo(); renderTable(); };
    }
    /* ---------- mapa ---------- */
    function ensureMuns() { if (!TG || $('muns').firstChild) return; $('muns').innerHTML = MUNS.map(function (m) { return '<path d="' + m.p + '" data-m="' + m.c + '" data-dd="' + m.d + '" tabindex="-1" aria-label="' + E(m.n) + '"' + (LIBRES[m.c] ? ' class="lb"' : '') + '></path>'; }).join(''); $('depb').innerHTML = GEO.map(function (g) { return '<path d="' + g.path + '"></path>'; }).join(''); }
    function renderMap() {
      var A = act(), L0 = A[0], L1 = A[1], mun = st.lvl === 'mun' && TG;
      if (mun) { var Am = A.filter(hasMun); if (Am.length && Am[0] !== L0) { L0 = Am[0]; L1 = A.filter(function (x) { return x !== L0; })[0]; } }
      svg.classList.toggle('mlvl', !!mun);
      if (mun) {
        ensureMuns(); var MV = L0 ? munValues(L0, st.year[L0.code]) : {}, mb = breaks(Object.keys(MV).map(function (k) { return MV[k].v; }).filter(function (v) { return !(L0 && L0.m.kind === 'count' && v === 0); }));
        root.querySelectorAll('#muns path').forEach(function (p) { var c = p.dataset.m, o = MV[c], k = o ? cls(o.v, mb) : -1, inDep = !st.dep || p.dataset.dd === st.dep; var hasD = Object.keys(MV).length > 0; p.setAttribute('fill', st.mun === c ? '#B243EA' : k < 0 ? (hasD && o ? 'url(#hatch)' : (inDep ? (LIBRES[c] ? '#FFF1BF' : '#E9D9F4') : '#F6F1F9')) : PAL[k]); p.classList.toggle('sel', st.mun === c); p.classList.toggle('out', !inDep); });
        $('bubs').innerHTML = '';
        var lgm = '<div style="grid-column:1/-1"><b>Municipios · ' + (L0 ? E(L0.name) + ' · ' + E(st.year[L0.code]) : 'sin capa') + ' · ' + E(zl()) + '</b>' + (Object.keys(MV).length ? (function () { var mx = Math.max.apply(null, Object.keys(MV).map(function (k) { return MV[k].v || 0; }).concat([0])), ed = [0].concat(mb, [mx]); return PAL.map(function (c, i) { return '<div class="row"><i style="background:' + c + '"></i>' + fmt(L0, ed[i]) + ' – ' + fmt(L0, ed[i + 1]) + '</div>'; }).join('') + '<div class="row"><i class="h"></i>1–4 casos (protegido)</div>'; })() : '<div class="row"><i class="h"></i>Dato municipal por procesar en esta capa</div>') + '<div class="row"><i style="background:#fff;border:2px solid #F8C20A"></i>Territorios ¡LIBRES!</div><div class="row"><i style="background:#fff;border:2px solid #6E24A8"></i>Límite departamental</div></div>';
        $('legend').innerHTML = lgm; if (st.vb) svg.setAttribute('viewBox', st.vb.join(' ')); return;
      }
      var V0 = L0 ? (zoneDep(L0, st.year[L0.code]) || values(L0, st.year[L0.code])) : {}, b0 = breaks(Object.keys(V0).map(function (k) { return V0[k].v; }));
      root.querySelectorAll('#deps path').forEach(function (p) {
        var d = p.dataset.d, o = V0[d], k = L0 && o ? cls(o.v, b0) : -1;
        p.setAttribute('fill', !L0 ? '#ece6f0' : (k < 0 ? 'url(#hatch)' : PAL[k]));
        p.classList.toggle('sel', st.dep === d);
      });
      svg.classList.toggle('dim', !!st.dep);
      var bh = '';
      if (L1) { var V1 = values(L1, st.year[L1.code]), mx = 0; Object.keys(V1).forEach(function (k) { if (V1[k].v != null) mx = Math.max(mx, Math.abs(V1[k].v)); });
        Object.keys(V1).forEach(function (k) { var o = V1[k], c = CENT[k]; if (!c || o.v == null || !mx) return; var r = 2 + 16 * Math.sqrt(Math.abs(o.v) / mx); bh += '<circle class="bub' + (st.dep === k ? ' sel' : '') + '" cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="' + r.toFixed(1) + '"></circle>'; }); }
      $('bubs').innerHTML = bh;
      // leyenda
      var lg = '';
      if (L0) { var a = Object.keys(V0).map(function (k) { return V0[k].v; }).filter(function (v) { return v != null; }).sort(function (x, y) { return x - y; }), ed = [a[0]].concat(b0).concat([a[a.length - 1]]);
        lg += '<div><b>Relleno · ' + E(unit(L0)) + ' · ' + E(st.year[L0.code]) + '</b>' + PAL.map(function (c, i) { return '<div class="row"><i style="background:' + c + '"></i>' + fmt(L0, ed[i]) + ' – ' + fmt(L0, ed[i + 1]) + '</div>'; }).join('') + '<div class="row"><i class="h"></i>Sin dato o protegido</div></div>'; }
      if (L1) { var V1b = values(L1, st.year[L1.code]), vs = Object.keys(V1b).map(function (k) { return V1b[k].v; }).filter(function (v) { return v != null; }), mx2 = Math.max.apply(null, vs.map(Math.abs)), mn2 = Math.min.apply(null, vs);
        lg += '<div><b>Círculos · ' + E(unit(L1)) + ' · ' + E(st.year[L1.code]) + '</b><div class="row"><i class="c" style="width:8px;height:8px"></i>' + fmt(L1, mn2) + '</div><div class="row"><i class="c" style="width:22px;height:22px"></i>' + fmt(L1, mx2) + '</div></div>'; }
      if (!L0) lg = '<div><b>Enciende una capa para colorear el mapa</b></div>';
      if (L0 && st.zona !== 'T' && !hasZone(L0)) lg += '<div style="grid-column:1/-1" class="row"><i class="h"></i>' + E(zl()) + ': por procesar en esta capa; se muestra el total.</div>';
      $('legend').innerHTML = lg;
      if (st.vb) svg.setAttribute('viewBox', st.vb.join(' '));
    }
    /* ---------- panel de datos ---------- */
    function bars(items, max, color) { return '<div class="bars">' + items.map(function (i) { return '<div data-d="' + (i.k || '') + '" title="' + E(i.l + ': ' + i.t) + '"><span>' + E(i.l) + '</span><i><em style="width:' + (max ? Math.max(1, Math.abs(i.v) / max * 100) : 0) + '%;background:' + (i.c || color) + '"></em></i><b>' + E(i.t) + '</b></div>'; }).join('') + '</div>'; }
    function pearson(x, y) { var n = x.length; if (n < 3) return null; var mx = 0, my = 0; for (var i = 0; i < n; i++) { mx += x[i]; my += y[i]; } mx /= n; my /= n; var sxy = 0, sxx = 0, syy = 0; for (i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) * (x[i] - mx); syy += (y[i] - my) * (y[i] - my); } return sxx && syy ? sxy / Math.sqrt(sxx * syy) : null; }
    function ranks(a) { var idx = a.map(function (v, i) { return [v, i]; }).sort(function (p, q) { return p[0] - q[0]; }), r = new Array(a.length); for (var i = 0; i < idx.length;) { var j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++; for (var k = i; k <= j; k++) r[idx[k][1]] = (i + j) / 2 + 1; i = j + 1; } return r; }
    function pairs(La, Lb) { var Va = values(La, st.year[La.code]), Vb = values(Lb, st.year[Lb.code]), out = []; Object.keys(Va).forEach(function (k) { if (Va[k].v != null && Vb[k] && Vb[k].v != null) out.push({ k: k, x: Va[k].v, y: Vb[k].v }); }); return out; }
    function strength(r) { var a = Math.abs(r); return (a < .3 ? 'débil' : a < .6 ? 'moderada' : 'fuerte') + (r >= 0 ? ' y positiva' : ' y negativa'); }
    function mxColor(r) { if (r == null) return '#f1eef3'; var a = Math.min(1, Math.abs(r)); return r >= 0 ? 'rgba(142,54,207,' + (0.12 + a * .78).toFixed(2) + ')' : 'rgba(26,130,185,' + (0.12 + a * .78).toFixed(2) + ')'; }
    function renderTabs() { $('tabs').innerHTML = [['det', 'Detalle'], ['rel', 'Relaciones'], ['fic', 'Fichas']].map(function (t) { return '<button data-tab="' + t[0] + '"' + (st.tab === t[0] ? ' class="on"' : '') + '>' + t[1] + '</button>'; }).join(''); }
    function crumb() { var h = '<div class="crumb"><a href="#" data-goto="co">Colombia</a>'; if (st.dep) h += '<span>›</span><a href="#" data-goto="dep">' + E(NAME[st.dep]) + '</a>'; if (st.mun && MUN[st.mun]) h += '<span>›</span><b>' + E(MUN[st.mun].n) + '</b>'; h += '<span>·</span><span>' + E(zl()) + '</span></div>'; return h; }
    function hm(t) { var p = String(t || '').split(':'); return p.length > 1 ? (+p[0] * 60 + +p[1]) / 60 : null; }
    function zoneRef() {
      var e = BUL.enut, g = BUL.geih, h = '<div class="zone"><b>Urbano y rural · referencia nacional (DANE)</b>';
      if (e && e.hours) { var c = e.hours['Cabeceras municipales'], r = e.hours['Centros poblados y rural disperso']; if (c && r) h += bars([{ l: 'Mujeres · cabeceras', v: hm(c.M[c.M.length - 1]), t: c.M[c.M.length - 1] + ' h/día', c: '#9E2C5A' }, { l: 'Mujeres · rural', v: hm(r.M[r.M.length - 1]), t: r.M[r.M.length - 1] + ' h/día', c: '#9E2C5A' }, { l: 'Hombres · cabeceras', v: hm(c.H[c.H.length - 1]), t: c.H[c.H.length - 1] + ' h/día', c: '#1A82B9' }, { l: 'Hombres · rural', v: hm(r.H[r.H.length - 1]), t: r.H[r.H.length - 1] + ' h/día', c: '#1A82B9' }], 9, '#9E2C5A') + '<p class="note" style="margin-top:2px">Tiempo diario en trabajo no remunerado · ENUT 2024-2025.' + (e.participation && e.participation.ruralTnrM ? ' En zona rural participa el ' + N(e.participation.ruralTnrM, 1) + ' % de las mujeres.' : '') + '</p>'; }
      if (g && g.domains) { var dm = g.domains.filter(function (x) { return /rural|cabeceras/i.test(x[0]); }); if (dm.length) h += bars(dm.map(function (x) { return { l: x[0], v: x[2], t: N(x[2], 1) + ' %', c: '#9E2C5A' }; }), 14, '#9E2C5A') + '<p class="note" style="margin-top:2px">Desempleo de las mujeres por dominio · GEIH mayo–julio 2026.</p>'; }
      return h + '<p class="note">Las capas de Medicina Legal usan la «zona del hecho»: cabecera = urbana; centro poblado y rural disperso = rural (2025, preliminar). Población, ENUT y GEIH solo tienen el dominio nacional o departamental.</p></div>';
    }
    function munDetail(A) {
      var m = MUN[st.mun], h = '<p class="ttl">' + E(m.n) + (LIBRES[m.c] ? '<span class="lbb">Territorio ¡LIBRES!</span>' : '') + '</p><p class="sub">Municipio de ' + E(NAME[m.d]) + ' · código DANE ' + E(m.c) + '</p>';
      A.forEach(function (L, i) {
        var MV = munValues(L, st.year[L.code]), o = MV[m.c], dv = values(L, st.year[L.code])[m.d];
        h += '<div class="kv" style="--c:' + (i === 0 ? '#8E36CF' : i === 1 ? '#17A58C' : '#8a8a89') + '"><small><span>' + E(L.name) + '</span><span>' + E(st.year[L.code]) + '</span></small>' + (hasMun(L) ? (function () { var rk = munRank(L, m.c); return '<b>' + (o && o.prot ? '1–4' : fmt(L, o ? o.v : null)) + '</b><span>' + E(L.m.unit) + ' · ' + E(zl()) + (o && o.prot ? ' · celda protegida (menos de 5 registros)' : '') + (prelim(L, st.year[L.code]) ? ' · preliminar' : '') + '</span>' + (rk.pos && o && o.v ? '<br><span>Puesto ' + rk.pos + ' de ' + rk.n + ' municipios de ' + E(NAME[m.d]) + '</span>' : ''); })() : tdYears(L.code).length ? '<b style="font-size:14px;color:#8a8a89">Dato municipal disponible para ' + tdYears(L.code).join(', ') + '</b><span><button class="sw" type="button" data-ty="' + L.code + '">Cambiar a ' + tdYears(L.code).slice(-1)[0] + '</button></span>' : '<b style="font-size:14px;color:#8a8a89">Por procesar a nivel municipal</b><span>La fuente trae ' + (L.m.src === 'enut' ? 'solo dominios departamentales (la ENUT no es representativa por municipio)' : L.m.kind === 'pop' ? 'proyecciones municipales por área (PPED municipal), aún no cargadas' : 'el código DANE del municipio y la zona del hecho') + '.</span>') + '<br><span>' + E(NAME[m.d]) + ': ' + fmt(L, dv ? dv.v : null) + ' (departamento)</span></div>';
      });
      return h + zoneBlock(A, m.c, true) + perfBlock(A, m.c, true) + zoneRef();
    }
    function munList(d) { var ms = MUNS.filter(function (m) { return m.d === d; }).sort(function (a, b) { return (LIBRES[b.c] || 0) - (LIBRES[a.c] || 0) || a.n.localeCompare(b.n); }); return '<h4>Municipios de ' + E(NAME[d]) + ' (' + ms.length + ') <button class="sw" type="button" data-lvl="mun">Ver en el mapa</button></h4><div class="mlist">' + ms.map(function (m) { return '<button type="button" data-mun="' + m.c + '"><span>' + E(m.n) + (LIBRES[m.c] ? '<span class="lbb">¡LIBRES!</span>' : '') + '</span><small>' + m.c + ' ›</small></button>'; }).join('') + '</div>'; }
    function renderInfo() {
      renderTabs(); var A = act(), h = '';
      if (st.tab === 'det') {
        h += crumb();
        if (!A.length) h += '<p class="sub">Enciende una o más capas en el panel de la izquierda.</p>';
        else if (st.mun && MUN[st.mun]) { h += munDetail(A); }
        else if (!st.dep) {
          var L0 = A[0], V0 = values(L0, st.year[L0.code]), n0 = national(L0, st.year[L0.code], V0), rk = Object.keys(V0).filter(function (k) { return V0[k].v != null; }).sort(function (a, b) { return V0[b].v - V0[a].v; });
          h += '<p class="ttl">Colombia</p><p class="sub">Toca un departamento en el mapa para ver su detalle.</p>';
          h += '<div class="answer"><b>' + fmt(L0, n0) + '</b> ' + E(unit(L0)) + ' en el país (' + E(st.year[L0.code]) + ').' + (rk.length ? ' Mayor valor: <b>' + E(NAME[rk[0]]) + '</b> (' + fmt(L0, V0[rk[0]].v) + '); menor: <b>' + E(NAME[rk[rk.length - 1]]) + '</b> (' + fmt(L0, V0[rk[rk.length - 1]].v) + ').' : '') + '</div>';
          A.forEach(function (L, i) { var V = values(L, st.year[L.code]), n = national(L, st.year[L.code], V); h += '<div class="kv" style="--c:' + (i === 0 ? '#8E36CF' : i === 1 ? '#17A58C' : '#8a8a89') + '"><small><span>' + E(L.name) + '</span><span>' + E(st.year[L.code]) + '</span></small><b>' + fmt(L, n) + '</b><span>' + E(unit(L)) + (L.m.kind === 'pct' || L.m.kind === 'gap' ? ' · ' + E(NAT.src) : '') + '</span></div>'; });
          h += '<h4>Ranking · ' + E(L0.name) + '</h4>' + bars(rk.slice(0, 8).map(function (k) { return { k: k, l: NAME[k], v: V0[k].v, t: fmt(L0, V0[k].v) }; }), rk.length ? Math.abs(V0[rk[0]].v) : 0, '#B243EA');
        } else {
          var d = st.dep; h += '<p class="ttl">' + E(NAME[d]) + '</p><p class="sub">' + (popW(d, '2025') ? N(popW(d, '2025')) + ' mujeres proyectadas en 2025 (DANE)' : '') + ' · <a href="#" data-clear="1" style="color:#6E24A8;font-weight:800">Ver Colombia</a></p>';
          A.forEach(function (L, i) {
            var V = values(L, st.year[L.code]), o = V[d] || {}, rk = Object.keys(V).filter(function (k) { return V[k].v != null; }).sort(function (a, b) { return V[b].v - V[a].v; }), pos = rk.indexOf(d) + 1, n = national(L, st.year[L.code], V);
            h += '<div class="kv" style="--c:' + (i === 0 ? '#8E36CF' : i === 1 ? '#17A58C' : '#8a8a89') + '"><small><span>' + E(L.name) + '</span><span>' + E(st.year[L.code]) + '</span></small><b>' + fmt(L, o.v) + '</b><span>' + E(unit(L)) + '</span><br><span>Puesto ' + (pos ? pos + ' de ' + rk.length : '—') + ' · Colombia: ' + fmt(L, (L.m.kind === 'count' && !isRate(L)) || L.m.kind === 'pop' ? n / Math.max(1, rk.length) : n) + ((L.m.kind === 'count' && !isRate(L)) || L.m.kind === 'pop' ? ' (promedio por depto.)' : '') + '</span>' + (o.prot ? '<br><span>' + o.prot + ' celda(s) protegidas</span>' : '') + (L.m.kind === 'pct' && o.lo != null ? '<br><span>IC 95 %: ' + N(o.lo, 1) + '–' + N(o.hi, 1) + ' · hombres ' + N(o.ph, 1) + ' %</span>' : '') + '</div>';
          });
          h += zoneBlock(A, d, false);
          var Lm = A.filter(hasMun)[0]; if (Lm && TG) { var rkm = Object.keys(munValues(Lm, st.year[Lm.code])).filter(function (k) { return MUN[k] && MUN[k].d === d; }), MVm = munValues(Lm, st.year[Lm.code]); rkm = rkm.filter(function (k) { return MVm[k].v; }).sort(function (a, b) { return MVm[b].v - MVm[a].v; }); if (rkm.length) h += '<h4>Municipios con más casos · ' + E(Lm.name) + ' · ' + E(st.year[Lm.code]) + '</h4>' + bars(rkm.slice(0, 8).map(function (k) { return { k: '', l: MUN[k].n + (LIBRES[k] ? ' ★' : ''), v: MVm[k].v, t: fmt(Lm, MVm[k].v) }; }), MVm[rkm[0]].v, '#8E36CF') + '<p class="note">' + E(zl()) + '. ★ territorio ¡LIBRES! Toca un municipio de la lista de abajo para su detalle.</p>'; }
          h += perfBlock(A, d, false);
          if (st.zona !== 'T' || st.lvl === 'mun') h += zoneRef();
          if (TG) h += munList(d);
          var L0b = A[0]; if (L0b && L0b.m.src && (L0b.m.src === 'nofatal' || L0b.m.src === 'fatal')) { var C = {}; SRC[L0b.m.src].rows.forEach(function (r) { if (r.year === st.year[L0b.code] && r.dept === d && r.sex === 'Mujer' && !r.suppressed && r.count != null) C[r.category] = (C[r.category] || 0) + r.count; }); var it = Object.keys(C).map(function (k) { return { l: k.replace(/^\d+\s+/, ''), v: C[k], t: N(C[k]), c: L0b.m.cat && L0b.m.cat.test(k) ? '#B243EA' : '#ddd0e8' }; }).sort(function (a, b) { return b.v - a.v; }); h += '<h4>Mujeres por tipo de hecho · ' + E(st.year[L0b.code]) + '</h4>' + bars(it, it.length ? it[0].v : 0, '#ddd0e8'); }
          if (L0b && periods(L0b.m).length > 2) { var ps = periods(L0b.m), ser = ps.map(function (y) { var w = values(L0b, y)[d]; return w ? w.v : null; }), mxs = Math.max.apply(null, ser.filter(function (v) { return v != null; }).concat([1])); h += '<h4>Evolución · ' + E(L0b.name) + '</h4>' + bars(ps.map(function (y, i) { return { l: y, v: ser[i] || 0, t: fmt(L0b, ser[i]) }; }), mxs, '#CF7DB6'); }
        }
        A.forEach(function (L) { if (L.m.note) h += '<p class="note">' + E(L.m.note) + '</p>'; });
        if (st.rate) h += '<p class="note">«Por 100.000 mujeres» es referencial: el lugar del hecho no siempre coincide con el de residencia de la víctima.</p>';
      }
      if (st.tab === 'rel') {
        if (A.length < 2) h = '<p class="ttl">Relaciones entre capas</p><p class="sub">Enciende al menos dos capas para ver si se mueven juntas entre departamentos.</p><div class="answer">Ejemplo: enciende «Lesiones por violencia de pareja contra mujeres» y «Población de mujeres», o activa «Por 100.000 mujeres» para comparar sin el efecto del tamaño de la población.</div>';
        else {
          if (st.ax[0] >= A.length) st.ax[0] = 0; if (st.ax[1] >= A.length || st.ax[1] === st.ax[0]) st.ax[1] = st.ax[0] === 0 ? 1 : 0;
          var X = A[st.ax[0]], Y = A[st.ax[1]], P = pairs(X, Y), r = pearson(P.map(function (p) { return p.x; }), P.map(function (p) { return p.y; })), rs = P.length > 2 ? pearson(ranks(P.map(function (p) { return p.x; })), ranks(P.map(function (p) { return p.y; }))) : null;
          h += '<p class="ttl">Relaciones entre capas</p><div class="axsel"><label>Eje X<select data-ax="0">' + A.map(function (L, i) { return '<option value="' + i + '"' + (i === st.ax[0] ? ' selected' : '') + '>' + E(L.name) + '</option>'; }).join('') + '</select></label><label>Eje Y<select data-ax="1">' + A.map(function (L, i) { return '<option value="' + i + '"' + (i === st.ax[1] ? ' selected' : '') + '>' + E(L.name) + '</option>'; }).join('') + '</select></label></div>';
          // dispersión
          var Wd = 330, Hd = 230, l = 44, rr = 10, t = 10, bb = 30;
          if (P.length) { var xs = P.map(function (p) { return p.x; }), ys = P.map(function (p) { return p.y; }), x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys); if (x1 === x0) x1 = x0 + 1; if (y1 === y0) y1 = y0 + 1;
            var sx = function (v) { return l + (v - x0) / (x1 - x0) * (Wd - l - rr); }, sy = function (v) { return t + (1 - (v - y0) / (y1 - y0)) * (Hd - t - bb); };
            var mxv = xs.reduce(function (a, b) { return a + b; }, 0) / xs.length, myv = ys.reduce(function (a, b) { return a + b; }, 0) / ys.length, num = 0, den = 0; P.forEach(function (p) { num += (p.x - mxv) * (p.y - myv); den += (p.x - mxv) * (p.x - mxv); }); var sl = den ? num / den : 0, ic = myv - sl * mxv;
            h += '<svg class="scatter" viewBox="0 0 ' + Wd + ' ' + Hd + '" role="img" aria-label="Dispersión por departamento">' +
              [0, .5, 1].map(function (f) { var vy = y0 + f * (y1 - y0), vx = x0 + f * (x1 - x0); return '<line x1="' + l + '" x2="' + (Wd - rr) + '" y1="' + sy(vy) + '" y2="' + sy(vy) + '" stroke="#ebe2f1"/><text x="' + (l - 4) + '" y="' + (sy(vy) + 3) + '" font-size="9" text-anchor="end" fill="#6f6f6e">' + fmt(Y, vy) + '</text><text x="' + sx(vx) + '" y="' + (Hd - 16) + '" font-size="9" text-anchor="middle" fill="#6f6f6e">' + fmt(X, vx) + '</text>'; }).join('') +
              '<line x1="' + sx(x0) + '" y1="' + sy(sl * x0 + ic) + '" x2="' + sx(x1) + '" y2="' + sy(sl * x1 + ic) + '" stroke="#D33B78" stroke-width="2" stroke-dasharray="5 4"/>' +
              P.map(function (p) { return '<circle data-d="' + p.k + '" cx="' + sx(p.x).toFixed(1) + '" cy="' + sy(p.y).toFixed(1) + '" r="5"' + (st.dep === p.k ? ' class="sel"' : '') + '><title>' + E(NAME[p.k] + ': ' + fmt(X, p.x) + ' · ' + fmt(Y, p.y)) + '</title></circle>'; }).join('') +
              '<text x="' + (Wd - rr) + '" y="' + (Hd - 3) + '" font-size="9" text-anchor="end" fill="#3c3c3b" font-weight="800">X: ' + E(X.name.slice(0, 48)) + '</text></svg>'; }
          h += '<div class="stats"><div><b>' + (r == null ? '—' : N(r, 2)) + '</b><span>Pearson (r)</span></div><div><b>' + (rs == null ? '—' : N(rs, 2)) + '</b><span>Spearman (ρ)</span></div><div><b>' + P.length + '</b><span>departamentos</span></div></div>';
          if (r != null) h += '<div class="answer">Entre departamentos, la relación es <b>' + strength(r) + '</b> (r = ' + N(r, 2) + '). ' + (Math.abs(r) >= .6 && X.m.kind === 'count' && Y.m.kind === 'count' && !st.rate ? 'Ojo: dos conteos suelen crecer juntos por el tamaño de la población; prueba «Por 100.000 mujeres». ' : '') + 'Una correlación no prueba que una cosa cause la otra.</div>';
          if (A.length > 2) { h += '<h4>Matriz de correlaciones (Pearson)</h4><table class="mx"><tr><th></th>' + A.map(function (L, i) { return '<th title="' + E(L.name) + '">C' + (i + 1) + '</th>'; }).join('') + '</tr>' + A.map(function (La, i) { return '<tr><th title="' + E(La.name) + '">C' + (i + 1) + ' ' + E(La.name.slice(0, 18)) + '…</th>' + A.map(function (Lb, j) { var rv = i === j ? 1 : (function () { var Q = pairs(La, Lb); return pearson(Q.map(function (q) { return q.x; }), Q.map(function (q) { return q.y; })); })(); return '<td style="background:' + mxColor(rv) + ';color:' + (rv != null && Math.abs(rv) > .5 ? '#fff' : '#3c3c3b') + '">' + (rv == null ? '—' : N(rv, 2)) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table><p class="note">Morado: se mueven en la misma dirección. Azul: en dirección contraria. Cada capa usa el periodo elegido en el panel de capas.</p>'; }
        }
      }
      if (st.tab === 'fic') {
        h += '<p class="ttl">Fichas de las capas</p>' + A.map(function (L) { return '<h4>' + E(L.name) + '</h4><ul class="facts">' + [['Tipo', L.code.indexOf('X-') === 0 ? 'Análisis del Observatorio' : 'Indicador del catálogo'], ['Fórmula', L.formula], ['Unidad', unit(L)], ['Fuente', L.m.src ? SRC[L.m.src].producer : 'DANE · PPED'], ['Archivo', L.m.src ? SRC[L.m.src].file : D.pop.file], ['Corte', L.m.src ? SRC[L.m.src].cut + (String(SRC[L.m.src].preliminary) === 'true' ? ' · preliminar' : '') : ''], ['Estado', L.status]].filter(function (r) { return r[1]; }).map(function (r) { return '<li><span>' + r[0] + '</span><b>' + E(r[1]) + '</b></li>'; }).join('') + '</ul>'; }).join('');
        if (st.nomap || !A.length) h += '<h4>Indicadores sin datos por departamento (' + NOMAP.length + ')</h4><ul class="facts">' + NOMAP.map(function (x) { return '<li><b>' + E(x.name) + '<br><small style="font-weight:600;color:#6f6f6e">Fuente: ' + E(x.source || 'por definir') + '</small></b></li>'; }).join('') + '</ul>';
        else h += '<p class="note"><a href="#" data-nomap="1" style="color:#6E24A8;font-weight:800">Ver los ' + NOMAP.length + ' indicadores que aún no tienen datos por departamento</a></p>';
      }
      $('infob').innerHTML = h;
    }
    /* ---------- tabla de atributos ---------- */
    function renderTable() {
      var t = $('tabla'); t.classList.toggle('on', st.table); if (!st.table) return;
      if (st.lvl === 'mun' && TG) {
        var A2 = act(), ms = MUNS.filter(function (m) { return !st.dep || m.d === st.dep; }).sort(function (a, b) { return a.d.localeCompare(b.d) || a.n.localeCompare(b.n); });
        t.innerHTML = '<div class="th"><b>Tabla de atributos · ' + ms.length + ' municipios' + (st.dep ? ' de ' + E(NAME[st.dep]) : '') + ' · ' + E(zl()) + '</b><span><button class="tb" id="tclose">Cerrar</button></span></div><div class="tw"><table><thead><tr><th>Municipio</th><th>Departamento</th><th>Código</th>' + A2.map(function (L) { return '<th class="r">' + E(L.name.slice(0, 34)) + ' · ' + E(st.year[L.code]) + '</th>'; }).join('') + '</tr></thead><tbody>' + ms.map(function (m) { return '<tr data-mun="' + m.c + '"' + (st.mun === m.c ? ' class="sel"' : '') + '><td>' + E(m.n) + (LIBRES[m.c] ? '<span class="lbb">¡LIBRES!</span>' : '') + '</td><td>' + E(NAME[m.d]) + '</td><td>' + m.c + '</td>' + A2.map(function (L) { var o = munValues(L, st.year[L.code])[m.c]; return '<td class="r">' + (hasMun(L) ? (o && o.prot ? '1–4' : fmt(L, o ? o.v : null)) : '<small style="color:#8a8a89">por procesar</small>') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
        $('tclose').onclick = function () { st.table = false; renderTools(); renderTable(); }; return;
      }
      var A = act(), rows = GEO.map(function (g) { var r = { k: g.code, name: g.name }; A.forEach(function (L, i) { var o = values(L, st.year[L.code])[g.code]; r['c' + i] = o ? o.v : null; }); r.pop = popW(g.code, '2025'); return r; });
      var s = st.sort; rows.sort(function (a, b) { var x = a[s.k], y = b[s.k]; if (s.k === 'name') return x.localeCompare(y) * s.d; if (x == null) return 1; if (y == null) return -1; return (x - y) * s.d; });
      t.innerHTML = '<div class="th"><b>Tabla de atributos · ' + GEO.length + ' departamentos</b><span><button class="tb" id="csv">Descargar CSV</button> <button class="tb" id="tclose">Cerrar</button></span></div><div class="tw"><table><thead><tr><th data-s="name">Departamento</th>' + A.map(function (L, i) { return '<th class="r" data-s="c' + i + '" title="' + E(unit(L)) + '">' + E(L.name.slice(0, 34)) + ' · ' + E(st.year[L.code]) + '</th>'; }).join('') + '<th class="r" data-s="pop">Mujeres 2025</th></tr></thead><tbody>' +
        rows.map(function (r) { return '<tr data-d="' + r.k + '"' + (st.dep === r.k ? ' class="sel"' : '') + '><td>' + E(r.name) + '</td>' + A.map(function (L, i) { return '<td class="r">' + fmt(L, r['c' + i]) + '</td>'; }).join('') + '<td class="r">' + N(r.pop) + '</td></tr>'; }).join('') + '</tbody></table></div>';
      $('csv').onclick = function () { var lines = [['departamento'].concat(A.map(function (L) { return '"' + L.name + ' ' + st.year[L.code] + (isRate(L) ? ' por 100.000 mujeres' : '') + '"'; })).concat(['mujeres_2025']).join(',')]; rows.forEach(function (r) { lines.push(['"' + r.name + '"'].concat(A.map(function (L, i) { return r['c' + i] == null ? '' : (+r['c' + i]).toFixed(2); })).concat([r.pop || '']).join(',')); }); var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' })); a.download = 'observatorio_capas_departamentos.csv'; document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 300); };
      $('tclose').onclick = function () { st.table = false; renderTools(); renderTable(); };
    }
    function all() { if (!st.vb) st.vb = homeVB(); renderCapas(); renderTools(); renderMap(); renderInfo(); renderTable(); }
    function zoomDep(d, c) { var p = root.querySelector('#deps path[data-d="' + d + '"]'); if (!p) return; var b = p.getBBox(), g = $('gis'), w = g.clientWidth || 1200, h = g.clientHeight || 700, free = w < 900 ? w : w - 320 - 380; var top = w < 900 ? 10 : 90, s2 = Math.max(b.width * w / Math.max(free, 200), b.height * w / Math.max(h - top - 20, 200)) * 1.12 + 2, k = s2 / w, vh = h * k; var cx = b.x + b.width / 2 + (w < 900 ? 0 : (380 - 320) / 2 * k); st.vb = [cx - s2 / 2, b.y + b.height / 2 - vh / 2 - top / 2 * k, s2, vh]; }
    W.LV21_PICKMUN = function (c) { pickMun(c, true); };
    function pickMun(c, zoom) { var m = MUN[c]; if (!m) return; st.lvl = 'mun'; st.mun = c; st.dep = m.d; syncY(); if (zoom) { ensureMuns(); zoomDep(m.d, c); } renderTools(); renderMap(); renderInfo(); renderTable(); }
    function pick(d, zoom) { if (st.lvl === 'mun' && st.mun && MUN[st.mun] && MUN[st.mun].d !== d) st.mun = null; if (zoom && d && st.lvl === 'mun') { st.dep = d; zoomDep(d); renderTools(); renderMap(); renderInfo(); renderTable(); return; } st.dep = d; if (zoom && d) { var p = root.querySelector('#deps path[data-d="' + d + '"]'), b = p.getBBox(), s = Math.max(b.width, b.height) * 2.6 + 40; st.vb = [b.x + b.width / 2 - s / 2, b.y + b.height / 2 - s / 2, s, s * 490 / 410]; } renderTools(); renderMap(); renderInfo(); renderTable(); }

    /* ---------- eventos ---------- */
    root.getElementById('gis').addEventListener('change', function (e) {
      var t = e.target;
      if (t.dataset.l) { if (t.checked) activate(t.dataset.l); else st.act.splice(st.act.indexOf(t.dataset.l), 1); cache = {}; all(); }
      else if (t.dataset.y) { st.year[t.dataset.y] = t.value; renderCapas(); renderMap(); renderInfo(); renderTable(); }
      else if (t.dataset.ax) { st.ax[+t.dataset.ax] = +t.value; renderInfo(); }
    });
    root.getElementById('gis').addEventListener('click', function (e) {
      var t = e.target, b = t.closest('button, a, [data-d], [data-mun]');
      var fh = t.closest('.fh'); if (fh && fh.dataset.min) { var pn = $(fh.dataset.min); pn.classList.toggle('min'); var tg = fh.querySelector('.tg'); if (tg) tg.textContent = pn.classList.contains('min') ? '+' : '–'; return; }
      if (!b) return;
      if (b.dataset.up) { e.preventDefault(); var i = st.act.indexOf(b.dataset.up); st.act.splice(i, 1); st.act.splice(i - 1, 0, b.dataset.up); all(); return; }
      if (b.dataset.tab) { st.tab = b.dataset.tab; renderInfo(); return; }
      if (b.dataset.ty) { var ys = tdYears(b.dataset.ty); if (ys.length) st.year[b.dataset.ty] = ys[ys.length - 1]; all(); return; }
      if (b.dataset.lvl) { st.lvl = b.dataset.lvl; if (st.lvl === 'dep') st.mun = null; if (st.lvl === 'mun' && !TG) st.lvl = 'dep'; syncY(); if (st.lvl === 'mun' && st.dep) zoomDep(st.dep); renderTools(); renderMap(); renderInfo(); renderTable(); return; }
      if (b.dataset.mun) { e.preventDefault(); pickMun(b.dataset.mun, true); return; }
      if (b.dataset.goto) { e.preventDefault(); if (b.dataset.goto === 'co') { st.mun = null; st.lvl = 'dep'; st.vb = homeVB(); pick(null); } else { st.mun = null; pick(st.dep, true); } return; }
      if (b.dataset.z) { var vb = st.vb.slice(); if (b.dataset.z === 'reset') st.vb = homeVB(); else { var f = b.dataset.z === 'in' ? .75 : 1 / .75, cx = vb[0] + vb[2] / 2, cy = vb[1] + vb[3] / 2; vb[2] *= f; vb[3] *= f; vb[0] = cx - vb[2] / 2; vb[1] = cy - vb[3] / 2; st.vb = vb; } renderMap(); return; }
      if (b.id === 'rate') { st.rate = !st.rate; cache = {}; all(); return; }
      if (b.id === 'tbl') { st.table = !st.table; renderTools(); renderTable(); return; }
      if (b.id === 'fs') { var g = $('gis'); if (document.fullscreenElement) document.exitFullscreen(); else if (g.requestFullscreen) g.requestFullscreen(); return; }
      if (b.id === 'nomapb' || b.dataset.nomap) { e.preventDefault(); st.nomap = true; st.tab = 'fic'; var inf = $('info'); inf.classList.remove('min'); renderInfo(); return; }
      if (b.dataset.clear) { e.preventDefault(); pick(null); return; }
      if (b.dataset.s) { st.sort = { k: b.dataset.s, d: st.sort.k === b.dataset.s ? -st.sort.d : (b.dataset.s === 'name' ? 1 : -1) }; renderTable(); return; }
      if (b.dataset.d && !b.closest('svg.map')) { pick(b.dataset.d, true); return; }
    });
    // mapa: hover, clic, arrastre y rueda
    var tip = $('tip'), drag = null, moved = false;
    svg.addEventListener('pointermove', function (e) {
      if (drag) { var r = svg.getBoundingClientRect(), k = st.vb[2] / r.width, dx = (e.clientX - drag.x) * k, dy = (e.clientY - drag.y) * k; if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 3) moved = true; st.vb[0] = drag.vb[0] - dx; st.vb[1] = drag.vb[1] - dy; svg.setAttribute('viewBox', st.vb.join(' ')); tip.classList.remove('on'); return; }
      var mp = e.target.closest && e.target.closest('#muns path'); if (mp) { var m = MUN[mp.dataset.m], A0 = act(); tip.innerHTML = '<b>' + E(m.n) + '</b> · ' + E(NAME[m.d]) + (LIBRES[m.c] ? '<br>Territorio ¡LIBRES!' : '') + A0.map(function (L) { var o = munValues(L, st.year[L.code])[m.c]; return '<br>' + E(L.name.slice(0, 40)) + ': <b>' + (hasMun(L) ? (o && o.prot ? '1–4' : fmt(L, o ? o.v : null)) : 'por procesar') + '</b>'; }).join('') + '<br><small>Toca para ver el detalle</small>'; tip.classList.add('on'); var w0 = tip.offsetWidth; tip.style.left = Math.min(innerWidth - w0 - 8, e.clientX + 14) + 'px'; tip.style.top = (e.clientY + 16) + 'px'; return; }
      var p = e.target.closest && e.target.closest('#deps path'); if (!p) { tip.classList.remove('on'); return; }
      var d = p.dataset.d, A = act();
      tip.innerHTML = '<b>' + E(NAME[d]) + '</b>' + (A.length ? A.map(function (L, i) { var o = values(L, st.year[L.code])[d]; return '<br>' + ['■', '●', '·', '·'][i] + ' ' + E(L.name.slice(0, 40)) + ': <b>' + fmt(L, o ? o.v : null) + '</b>'; }).join('') : '') + '<br><small>Toca para ver el detalle</small>';
      tip.classList.add('on'); var w = tip.offsetWidth; tip.style.left = Math.min(innerWidth - w - 8, e.clientX + 14) + 'px'; tip.style.top = (e.clientY + 16) + 'px';
    });
    svg.addEventListener('pointerleave', function () { tip.classList.remove('on'); });
    svg.addEventListener('pointerdown', function (e) { if (e.button !== 0) return; drag = { x: e.clientX, y: e.clientY, vb: st.vb.slice() }; moved = false; svg.classList.add('drag'); });
    root.addEventListener('pointerup', function () { if (drag) { drag = null; svg.classList.remove('drag'); } });
    svg.addEventListener('click', function (e) { if (moved) { moved = false; return; } var mp = e.target.closest('#muns path'); if (mp) { if (st.mun === mp.dataset.m) { st.mun = null; renderMap(); renderInfo(); renderTable(); } else pickMun(mp.dataset.m); return; } var p = e.target.closest('#deps path'); if (p) pick(st.dep === p.dataset.d ? null : p.dataset.d); });
    svg.addEventListener('keydown', function (e) { var p = e.target.closest('#deps path'); if (p && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(p.dataset.d); } });
    svg.addEventListener('wheel', function (e) { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); var r = svg.getBoundingClientRect(), f = e.deltaY < 0 ? .85 : 1 / .85, px = st.vb[0] + (e.clientX - r.left) / r.width * st.vb[2], py = st.vb[1] + (e.clientY - r.top) / r.height * st.vb[3]; st.vb = [px - (px - st.vb[0]) * f, py - (py - st.vb[1]) * f, st.vb[2] * f, st.vb[3] * f]; svg.setAttribute('viewBox', st.vb.join(' ')); }, { passive: false });
    var userZoom = false; svg.addEventListener('pointerdown', function () { userZoom = true; }); root.getElementById('tools').addEventListener('click', function (e) { if (e.target.closest('[data-z]')) userZoom = e.target.closest('[data-z]').dataset.z !== 'reset'; });
    if (W.ResizeObserver) new ResizeObserver(function () { if (!userZoom && !st.dep) { st.vb = homeVB(); svg.setAttribute('viewBox', st.vb.join(' ')); } }).observe(root.getElementById('gis'));
    all();
    return { activate: function (c) { activate(c); cache = {}; all(); }, pick: pick, state: st };
  };
  W.LV21_CSS = CSS;
})();
