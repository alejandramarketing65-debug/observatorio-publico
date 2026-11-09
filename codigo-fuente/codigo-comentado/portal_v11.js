/* ==========================================================================
   LIBRES v11 · Micrositios, indicadores con ventana de detalle, análisis,
   normativa y derechos, observatorios, rutas de atención, mapa revisado y
   gestor de contenidos en administración.
   Depende de: lv11_data.js (LV11_DEFAULTS) y de los globales de la maqueta
   (V8_DATA, GEO, all, go, v8* y v9*). No modifica los agregados originales.
   ========================================================================== */
(function () {
  'use strict';
  var D = document, R = D.documentElement, W = window;
  var DEF = W.LV11_DEFAULTS;
  if (!DEF) return;
  var KEY = 'OMD_PORTAL_V11';
  var ADMIN = R.dataset.perfil === 'admin' || /Administracion/i.test(location.pathname) || !!D.getElementById('roleGate');

  /* ---------------- utilidades ---------------- */
  /* globales léxicos de la maqueta (declarados con let/const: no están en window) */
  function sicon(n, sz) { return icon(n, sz); }
  function GEOx() { return typeof GEO !== 'undefined' ? GEO : []; }
  function V8D() { return typeof V8_DATA !== 'undefined' ? V8_DATA : null; }
  function ST() { return typeof v8State !== 'undefined' ? v8State : {}; }
  function SRCS() { return typeof v8Sources !== 'undefined' ? v8Sources : []; }
  function ISADM() { return typeof V8_ADMIN !== 'undefined' && V8_ADMIN; }
  function en() { try { if (typeof language === 'string') return language === 'en'; } catch (e) {} return (R.lang || 'es').indexOf('en') === 0; }
  function T(es, enx) { return en() && enx ? enx : es; }
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function N(v, d) { if (v == null || isNaN(v)) return '—'; return Number(v).toLocaleString(en() ? 'en-US' : 'es-CO', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  function P(v, d) { return N(v, d == null ? 1 : d) + ' %'; }
  function hm(s) { var p = s.split(':'); return (+p[0]) + (+p[1]) / 60; }
  function hmTxt(h) { var hh = Math.floor(h + 1e-9), mm = Math.round((h - hh) * 60); if (mm === 60) { hh++; mm = 0; } return hh + ' h ' + (mm < 10 ? '0' : '') + mm + ' min'; }
  function ink(hex, k) { k = k == null ? 0.3 : k; var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; function f(x) { return Math.round(x * (1 - k)); } return '#' + [f(r), f(g), f(b)].map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  function tint(hex, k) { var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; function f(x) { return Math.round(x + (255 - x) * k); } return '#' + [f(r), f(g), f(b)].map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  function deptName(c) { try { return W.v8Dept(c); } catch (e) { var g = GEOx().find(function (x) { return x.code === c; }); return g ? g.name : c; } }
  function uid() { return 'x' + Math.random().toString(36).slice(2, 8); }
  var WOMEN = '#9E2C5A', MEN = '#1A82B9', WIDE = false;

  /* ---------------- almacén (admin → público) ---------------- */
  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function readStore() { try { var s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function writeStore(s) { s.updated = new Date().toISOString(); try { localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch (e) { return false; } }
  var S;
  // v54 · acervo documental inicial (editable en administración)
  var DOCS0 = [
    { id: 'mec1710', t: 'Mecanismo articulador para el abordaje integral de las violencias por razones de sexo y género', tipo: 'Documento técnico', y: 2020, sites: ['violencias', 'rutas'], url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=154947', d: 'Decreto 1710 de 2020: instancia nacional y territorial que articula a los sectores.', pub: true },
    { id: 'res459', t: 'Protocolo y modelo de atención integral en salud para víctimas de violencia sexual', tipo: 'Protocolo', y: 2012, sites: ['salud-dsr', 'violencias', 'rutas'], url: '', d: 'Resolución 459 de 2012 del Ministerio de Salud: urgencia médica, profilaxis y salud mental.', pub: true },
    { id: 'forensis', t: 'Forensis · Datos para la vida', tipo: 'Informe', y: 2024, sites: ['violencias'], url: 'https://www.medicinalegal.gov.co/cifras-estadisticas/forensis', d: 'Publicación anual de Medicina Legal sobre lesiones fatales y no fatales.', pub: true },
    { id: 'enut', t: 'Encuesta Nacional de Uso del Tiempo (ENUT)', tipo: 'Base de datos', y: 2021, sites: ['cuidados'], url: 'https://www.dane.gov.co/index.php/estadisticas-por-tema/pobreza-y-condiciones-de-vida/encuesta-nacional-del-uso-del-tiempo-enut', d: 'DANE · trabajo no remunerado y uso del tiempo por sexo.', pub: true }
  ];
  function load() {
    var st = readStore() || {};
    S = {
      sites: st.sites || clone(DEF.sites),
      norms: st.norms || clone(DEF.norms),
      obs: st.obs || clone(DEF.obs),
      routes: st.routes || clone(DEF.routes),
      ind: st.ind || { published: DEF.publishedIndicators.slice(), site: {}, summary: {} },
      analyses: st.analyses || { hidden: [], text: {} },
      ovr: st.ovr || {}, docs: st.docs || clone(DOCS0), txt: st.txt || {},
      updated: st.updated || null
    };
    [S.sites, S.norms, S.obs, S.routes, S.docs].forEach(function (arr) { arr.forEach(function (x) { if (x.pub == null) x.pub = true; }); });
  }
  load();
  function persist() { var r = writeStore(S); if (typeof applyOvr === 'function') applyOvr(); return r; }
  function sites(all) { return S.sites.filter(function (s) { return all || s.pub; }); }
  function site(id) { return S.sites.find(function (s) { return s.id === id; }); }
  function sName(s) { return s ? T(s.es, s.en) : ''; }

  /* ---------------- catálogo de indicadores ---------------- */
  function catalog() { return (typeof all !== 'undefined' ? all : []).slice(); }
  var IND_SITE = { 'CON-03': 'comite-1719', 'AMP-V10': 'participacion', 'AMP-V09': 'violencias', 'VBG-07': 'rutas' };
  function indSite(x) { return S.ind.site[x.code] || IND_SITE[x.code] || DEF.themeToSite[x.theme] || 'demografia'; }
  function published() { var set = {}; S.ind.published.forEach(function (c) { set[c] = 1; }); return catalog().filter(function (x) { return set[x.code]; }); }

  /* ---------------- iconos ---------------- */
  var ICO = {
    shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    house: '<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>',
    spark: '<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    vote: '<path d="M4 12h16v8H4z"/><path d="M8 12V5h8v7"/><path d="M10 8.5l1.5 1.5L14 7.5"/>',
    book: '<path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3z"/><path d="M5 17a3 3 0 013-3h11"/>',
    network: '<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="18" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M12 7.2v4.3M10.5 12.5L6.6 16.3M13.5 12.5l3.9 3.8M7.2 18h9.6"/>',
    scale: '<path d="M12 4v16M7 20h10M5 7h14"/><path d="M5 7l-3 6a3 3 0 006 0z"/><path d="M19 7l-3 6a3 3 0 006 0z"/>',
    dove: '<path d="M3 15c5 1 8-2 10-7 1 3 4 4 8 4-2 5-6 8-11 8-3 0-5-2-7-5z"/><path d="M13 8c-1-2-3-3-5-3"/>',
    gavel: '<path d="M14 4l6 6M11 7l6 6M12.5 5.5l-5 5M4 20l7-7M3 21h9"/>',
    leaf: '<path d="M5 19C5 10 11 5 20 5c0 9-6 15-15 14z"/><path d="M5 19l8-8"/>',
    health: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    people: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-3.6 2.7-6 6-6s6 2.4 6 6"/><path d="M15.5 14.6c3 0 5.5 2 5.5 5.4"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a3 3 0 000-6h-4a3 3 0 010-6h6"/>',
    hands: '<path d="M7 12V6.5a1.5 1.5 0 013 0V11M10 11V4.5a1.5 1.5 0 013 0V11M13 11V6a1.5 1.5 0 013 0v7c0 4-3 7-6.5 7-2.5 0-4.5-1.5-5.5-3.5l-2-4A1.5 1.5 0 014.5 11L7 14"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'
  };
  function icon(k, sz) { return '<svg class="lvi" width="' + (sz || 20) + '" height="' + (sz || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICO[k] || ICO.spark) + '</svg>'; }

  /* ---------------- tooltip ---------------- */
  var tip;
  function showTip(e, html) { if (!tip) { tip = D.createElement('div'); tip.className = 'lv11tip'; tip.setAttribute('role', 'tooltip'); D.body.appendChild(tip); } tip.innerHTML = html; tip.style.display = 'block'; var x = e.clientX + 14, y = e.clientY + 14, w = tip.offsetWidth, h = tip.offsetHeight; if (x + w > innerWidth - 8) x = e.clientX - w - 14; if (y + h > innerHeight - 8) y = e.clientY - h - 14; tip.style.left = x + 'px'; tip.style.top = y + 'px'; }
  function hideTip() { if (tip) tip.style.display = 'none'; }
  D.addEventListener('mouseover', function (e) { var t = e.target.closest && e.target.closest('[data-tip]'); if (t) showTip(e, t.getAttribute('data-tip')); });
  D.addEventListener('mousemove', function (e) { var t = e.target.closest && e.target.closest('[data-tip]'); if (t) showTip(e, t.getAttribute('data-tip')); else hideTip(); });
  D.addEventListener('focusin', function (e) { var t = e.target.closest && e.target.closest('[data-tip]'); if (t) { var r = t.getBoundingClientRect(); showTip({ clientX: r.right, clientY: r.top }, t.getAttribute('data-tip')); } });
  D.addEventListener('focusout', hideTip);

  /* ---------------- gráficos SVG ---------------- */
  // Serie de líneas con área suave, puntos y tooltip por punto.
  function lineChart(o) {
    var small = W.innerWidth < 640, w = o.w || (small ? 380 : WIDE ? 1080 : 640), h = o.h || (small ? 260 : WIDE ? 300 : 250), pl = 46, pr = 18, pt = 26, pb = 34;
    var all = []; o.series.forEach(function (s) { s.values.forEach(function (v) { if (v != null) all.push(v); }); });
    var max = Math.max.apply(null, all) * 1.12, min = o.zero === false ? Math.min.apply(null, all) * 0.9 : 0;
    var n = o.labels.length, x = function (i) { return pl + (n > 1 ? i * (w - pl - pr) / (n - 1) : (w - pl - pr) / 2); }, y = function (v) { return pt + (1 - (v - min) / (max - min || 1)) * (h - pt - pb); };
    var g = '';
    for (var k = 0; k <= 3; k++) { var v = min + (max - min) * k / 3, Y = y(v); g += '<line x1="' + pl + '" x2="' + (w - pr) + '" y1="' + Y + '" y2="' + Y + '" class="lvgrid"/><text x="' + (pl - 8) + '" y="' + (Y + 4) + '" text-anchor="end" class="lvaxis">' + E(o.fmt ? o.fmt(v, true) : N(v)) + '</text>'; }
    var step = Math.ceil(n / 9);
    o.labels.forEach(function (l, i) { if (i % step === 0 || i === n - 1) g += '<text x="' + x(i) + '" y="' + (h - 10) + '" text-anchor="middle" class="lvaxis">' + E(l) + '</text>'; });
    var id = uid();
    o.series.forEach(function (s, si) {
      var pts = s.values.map(function (v, i) { return v == null ? null : [x(i), y(v)]; }).filter(Boolean);
      var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join('');
      if (o.area !== false && o.series.length === 1 && pts.length) g += '<defs><linearGradient id="' + id + si + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + s.color + '" stop-opacity=".28"/><stop offset="1" stop-color="' + s.color + '" stop-opacity="0"/></linearGradient></defs><path d="' + d + 'L' + pts[pts.length - 1][0] + ',' + y(min) + 'L' + pts[0][0] + ',' + y(min) + 'Z" fill="url(#' + id + si + ')"/>';
      g += '<path class="lvdraw" d="' + d + '" fill="none" stroke="' + s.color + '" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"' + (s.dash ? ' stroke-dasharray="5 4"' : '') + '/>';
      s.values.forEach(function (v, i) {
        if (v == null) return;
        var last = i === s.values.length - 1;
        g += '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="' + (last ? 5.5 : 3.6) + '" fill="' + (last ? s.color : '#fff') + '" stroke="' + s.color + '" stroke-width="2"' + (last ? ' class="lvpulse"' : '') + '/>';
        g += '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="13" fill="transparent" tabindex="0" data-tip="' + E('<b>' + o.labels[i] + '</b><br>' + (s.name ? s.name + ': ' : '') + (o.fmt ? o.fmt(v) : N(v))) + '"/>';
      });
      if (o.endLabels !== false) { var lp = pts[pts.length - 1]; if (lp) g += '<text x="' + Math.min(lp[0], w - pr - 2) + '" y="' + (lp[1] - 11) + '" text-anchor="end" class="lvval" fill="#3c3c3b">' + E(o.fmt ? o.fmt(s.values[s.values.length - 1]) : N(s.values[s.values.length - 1])) + '</text>'; }
    });
    var legend = o.series.length > 1 ? '<div class="lvlegend">' + o.series.map(function (s) { return '<span><i style="background:' + s.color + '"></i>' + E(s.name) + '</span>'; }).join('') + '</div>' : '';
    return legend + '<svg class="lvchart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + E(o.title || '') + '">' + g + '</svg>';
  }
  // Barras horizontales con etiqueta directa.
  function barsH(items, o) {
    o = o || {};
    var max = Math.max.apply(null, items.map(function (x) { return x.v; })) || 1;
    return '<div class="lvbars">' + items.map(function (x, i) {
      return '<div class="lvbar" tabindex="0" data-tip="' + E('<b>' + x.l + '</b><br>' + (x.t || N(x.v))) + '"' + (x.click ? ' onclick="' + x.click + '" role="button"' : '') + '><span class="lvbl">' + E(x.l) + '</span><span class="lvbt"><i style="--w:' + (x.v / max * 100).toFixed(1) + '%;background:' + (x.c || o.c || '#9E2C5A') + ';animation-delay:' + (i * 40) + 'ms"></i></span><b>' + E(x.t || N(x.v)) + '</b></div>';
    }).join('') + '</div>';
  }
  // Mancuerna mujeres-hombres (brecha).
  function dumbbell(items, o) {
    o = o || {};
    var lo = o.min != null ? o.min : Math.min.apply(null, items.map(function (x) { return Math.min(x.a, x.b); })), hi = o.max != null ? o.max : Math.max.apply(null, items.map(function (x) { return Math.max(x.a, x.b); }));
    var sc = function (v) { return ((v - lo) / (hi - lo || 1) * 100).toFixed(2); };
    var fmt = o.fmt || function (v) { return P(v); };
    return '<div class="lvlegend"><span><i style="background:' + WOMEN + '"></i>' + T('Mujeres', 'Women') + '</span><span><i style="background:' + MEN + '"></i>' + T('Hombres', 'Men') + '</span></div><div class="lvdumb">' + items.map(function (x) {
      var a = sc(x.a), b = sc(x.b), l = Math.min(a, b), r = Math.max(a, b);
      return '<div class="lvdrow" tabindex="0" data-tip="' + E('<b>' + x.l + '</b><br>' + T('Mujeres', 'Women') + ': ' + fmt(x.a) + '<br>' + T('Hombres', 'Men') + ': ' + fmt(x.b) + '<br>' + T('Brecha', 'Gap') + ': ' + N(Math.abs(x.a - x.b), 1) + (o.gapUnit || ' p.p.')) + '"><span class="lvbl">' + E(x.l) + '</span><span class="lvdtrack"><i class="lvdline" style="left:' + l + '%;width:' + (r - l) + '%"></i><i class="lvddot" style="left:' + b + '%;background:' + MEN + '"></i><i class="lvddot" style="left:' + a + '%;background:' + WOMEN + '"></i></span><b>' + N(Math.abs(x.a - x.b), 1) + (o.gapUnit || ' p.p.') + '</b></div>';
    }).join('') + '</div>';
  }
  // Barra de composición (100 %).
  function shareBar(items) {
    var tot = items.reduce(function (a, x) { return a + x.v; }, 0) || 1;
    return '<div class="lvshare">' + items.map(function (x) { return '<i tabindex="0" style="flex:' + x.v + ';background:' + x.c + '" data-tip="' + E('<b>' + x.l + '</b><br>' + N(x.v) + ' · ' + P(x.v / tot * 100)) + '"></i>'; }).join('') + '</div><div class="lvlegend">' + items.map(function (x) { return '<span><i style="background:' + x.c + '"></i>' + E(x.l) + ' · ' + P(x.v / tot * 100) + '</span>'; }).join('') + '</div>';
  }
  // Coropleta departamental reutilizable.
  function choropleth(values, o) {
    o = o || {};
    var col = o.color || '#9E2C5A', vals = Object.keys(values).map(function (k) { return values[k]; }).filter(function (v) { return v != null; }).sort(function (a, b) { return a - b; });
    var uniq = vals.filter(function (v, i) { return vals.indexOf(v) === i; }), breaks = uniq.length <= 5 ? uniq : quantiles(vals, 5).filter(function (v, i, a) { return a.indexOf(v) === i; }), ramp = [0.86, 0.66, 0.46, 0.24, 0].slice(5 - Math.max(1, breaks.length)).map(function (k) { return k ? tint(col, k) : ink(col, 0.12); });
    var cls = function (v) { if (v == null) return -1; for (var i = 0; i < breaks.length; i++) if (v <= breaks[i]) return i; return breaks.length - 1; };
    var fmt = o.fmt || N;
    var paths = GEOx().map(function (g) {
      var v = values[g.code], c = cls(v), sel = o.selected === g.code;
      return '<path d="' + g.path + '" fill="' + (c < 0 ? 'url(#lvMiss)' : ramp[c]) + '" class="lvdep' + (sel ? ' sel' : '') + (o.dim && !sel ? ' dim' : '') + '" tabindex="0" role="button" data-code="' + g.code + '" aria-label="' + E(g.name + ' · ' + (v == null ? T('sin dato', 'no data') : fmt(v))) + '" data-tip="' + E('<b>' + g.name + '</b><br>' + (v == null ? T('Sin dato o protegido', 'No data or protected') : fmt(v)) + (o.extra && o.extra[g.code] ? '<br>' + o.extra[g.code] : '')) + '"' + (o.click ? ' onclick="' + o.click + '(\'' + g.code + '\')"' : '') + '/>';
    }).join('');
    var legend = '<div class="lvmaplegend">' + ramp.map(function (r, i) { if (!vals.length) return ''; var a = i ? breaks[i - 1] : vals[0], b = breaks[i]; return '<span><i style="background:' + r + '"></i>' + (uniq.length <= 5 ? E(fmt(b, true)) : E(fmt(a, true)) + '–' + E(fmt(b, true))) + '</span>'; }).join('') + '<span><i class="miss"></i>' + T('Sin dato / protegido', 'No data / protected') + '</span></div>';
    return '<div class="lvmapwrap"><svg class="lvmap" viewBox="' + (o.viewBox || '0 0 470 480') + '" role="group" aria-label="' + E(o.title || T('Mapa de Colombia por departamento', 'Map of Colombia by department')) + '"><defs><pattern id="lvMiss" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#f1ebee"/><path d="M0 6L6 0" stroke="#e2d6dc" stroke-width="1"/></pattern></defs>' + paths + '</svg>' + legend + '</div>';
  }
  function quantiles(sorted, k) { if (!sorted.length) return []; var out = []; for (var i = 1; i <= k; i++) { out.push(sorted[Math.min(sorted.length - 1, Math.ceil(i * sorted.length / k) - 1)]); } return out; }

  /* ---------------- datos procesados (agregados v8 + boletines) ---------------- */
  function src(id) { return (SRCS().length ? SRCS() : ((V8D() || {}).sources || [])).find(function (s) { return s.id === id; }); }
  function sum(id, f) { var s = src(id); if (!s) return { v: 0, hidden: 0, n: 0 }; var v = 0, hd = 0, n = 0; s.rows.forEach(function (r) { if (!f(r)) return; n++; if (r.count == null) hd++; else v += r.count; }); return { v: v, hidden: hd, n: n }; }
  function ge(a) { return (a.hidden ? '≥ ' : '') + N(a.v); }
  var B = DEF.bulletins;
  function sexes(id) { var s = src(id); return s ? Array.from(new Set(s.rows.map(function (r) { return r.sex; }))) : []; }

  // Fichas con información procesada: devuelven KPIs, gráfico y notas.
  var IND = {
    'VBG-04': function () {
      var s = src('pareja'); if (!s) return null;
      var yrs = s.periods, share = yrs.map(function (y) { var m = sum('pareja', function (r) { return r.year === y && r.sex === 'Mujer'; }), t = sum('pareja', function (r) { return r.year === y; }); return t.v ? m.v / t.v * 100 : null; });
      var w24 = sum('pareja', function (r) { return r.year === yrs[yrs.length - 1] && r.sex === 'Mujer'; });
      return { kpis: [[P(share[share.length - 1]), T('de los registros de violencia de pareja son mujeres', 'of partner-violence records are women') + ' · ' + yrs[yrs.length - 1]], [ge(w24), T('lesiones a mujeres', 'injuries to women') + ' · ' + yrs[yrs.length - 1]], [P(Math.min.apply(null, share)) + ' – ' + P(Math.max.apply(null, share)), T('rango 2015–2024', 'range 2015–2024')]],
        chart: lineChart({ labels: yrs, series: [{ name: T('Participación de mujeres', 'Women’s share'), color: WOMEN, values: share }], fmt: function (v) { return P(v); }, zero: false, title: 'VBG-04' }),
        read: T('Ocho o nueve de cada diez registros de lesiones por violencia de pareja corresponden a mujeres en todo el periodo. Es la participación femenina en los registros, no una prevalencia poblacional.', 'Eight to nine out of ten partner-violence injury records involve women across the period. This is women’s share of records, not population prevalence.'),
        src: s.producer + ' · ' + s.file, panorama: 'pareja', map: deptMap('pareja', yrs[yrs.length - 1]) };
    },
    'VBG-01': function () { return sexualExams(false); },
    'AMP-V07': function () { return sexualExams(false); },
    'VBG-02': function () { return sexualExams(true); },
    'VBG-05': function () {
      var b = B.ins, last = b.M[b.M.length - 1], prev = b.M[b.M.length - 2];
      return { kpis: [[N(last), T('casos sospechosos en mujeres notificados en 2025', 'suspected cases in women notified in 2025')], [P(last / (last + b.H[b.H.length - 1]) * 100), T('del total notificado son mujeres', 'of all notified cases are women')], [(last >= prev ? '+' : '') + P((last - prev) / prev * 100), T('frente a 2024', 'vs 2024')]],
        chart: lineChart({ labels: b.years, series: [{ name: T('Mujeres', 'Women'), color: WOMEN, values: b.M }, { name: T('Hombres', 'Men'), color: MEN, values: b.H }], title: 'VBG-05' }),
        read: T('Las notificaciones crecen casi sin interrupción desde 2012; la caída de 2020 coincide con el año de restricciones por la pandemia. El aumento refleja también mejor captación y notificación, no solo más violencia.', 'Notifications have grown almost continuously since 2012; the 2020 dip coincides with pandemic restrictions. Growth also reflects better reporting, not only more violence.'),
        src: b.src, note: b.note };
    },
    'AMP-V06': function () {
      var r = B.ins.rates2025;
      return { kpis: [[N(r.M, 1), T('casos por 100.000 mujeres · 2025', 'cases per 100,000 women · 2025')], [N(r.H, 1), T('casos por 100.000 hombres', 'cases per 100,000 men')], [N(r.sexualM, 1), T('violencia sexual por 100.000 mujeres', 'sexual violence per 100,000 women')]],
        chart: barsH([{ l: T('Violencia física · mujeres', 'Physical · women'), v: r.fisicaM, t: N(r.fisicaM, 1), c: WOMEN }, { l: T('Violencia sexual · mujeres', 'Sexual · women'), v: r.sexualM, t: N(r.sexualM, 1), c: WOMEN }, { l: T('Total · mujeres', 'Total · women'), v: r.M, t: N(r.M, 1), c: WOMEN }, { l: T('Total · hombres', 'Total · men'), v: r.H, t: N(r.H, 1), c: MEN }]),
        read: T('La tasa de notificación en mujeres es tres veces la de hombres. Es una tasa de notificación del sistema de vigilancia, sujeta a subregistro y cambios en la captación.', 'The notification rate in women is three times that in men. It is a surveillance notification rate, subject to under-reporting.'),
        src: B.ins.src, note: B.ins.note };
    },
    'AMP-V01': function () {
      var s = src('fatal'); if (!s) return null;
      var a = sum('fatal', function (r) { return r.year === '2025' && r.sex === 'Mujer' && /Homicid/.test(r.category); });
      return { kpis: [[ge(a), T('presuntos homicidios de mujeres · 2025 (preliminar)', 'alleged homicides of women · 2025 (preliminary)')]],
        chart: null, map: deptMap('fatal', '2025', '1 Presuntos Homicidios'),
        read: T('La ficha pide una tasa por 100.000 mujeres. No se calcula hasta validar el denominador y la correspondencia entre lugar del hecho y residencia. Un homicidio de mujer no equivale a feminicidio.', 'The indicator requires a rate per 100,000 women; it is not computed until the denominator is validated. A homicide of a woman is not necessarily a femicide.'),
        src: s.producer + ' · ' + s.file, panorama: 'fatal' };
    },
    'CUI-01': function () {
      var h = B.enut.hours['Total nacional'];
      return { kpis: [[hmTxt(hm(h.M[2])), T('al día dedican las mujeres al trabajo no remunerado', 'per day women spend on unpaid work') + ' · 2024-2025'], [hmTxt(hm(h.H[2])), T('dedican los hombres', 'men spend')], [hmTxt(hm(B.enut.hours['Centros poblados y rural disperso'].M[2])), T('mujeres en zonas rurales', 'rural women')]],
        chart: lineChart({ labels: B.enut.periods, series: [{ name: T('Mujeres', 'Women'), color: WOMEN, values: h.M.map(hm) }, { name: T('Hombres', 'Men'), color: MEN, values: h.H.map(hm) }], fmt: function (v, ax) { return ax ? N(v, 0) + ' h' : hmTxt(v); }, title: 'CUI-01' }),
        read: T('Las mujeres que participan en trabajo no remunerado le dedican más del doble de tiempo que los hombres. La diferencia es mayor en zonas rurales.', 'Women who do unpaid work spend more than twice as much time on it as men, especially in rural areas.'),
        src: B.enut.src, note: B.enut.note, panorama: 'enut' };
    },
    'CUI-02': function () {
      var g = function (z) { var h = B.enut.hours[z]; return h.M.map(function (m, i) { return hm(m) - hm(h.H[i]); }); };
      var nat = g('Total nacional');
      return { kpis: [[hmTxt(nat[2]), T('más al día dedican las mujeres · 2024-2025', 'more per day spent by women · 2024-2025')], [hmTxt(g('Centros poblados y rural disperso')[2]), T('brecha en zonas rurales', 'rural gap')], [hmTxt(g('Cabeceras municipales')[2]), T('brecha en cabeceras', 'urban gap')]],
        chart: lineChart({ labels: B.enut.periods, series: Object.keys(B.enut.hours).map(function (z, i) { return { name: z, color: ['#9E2C5A', '#1A82B9', '#8A6400'][i], values: g(z) }; }), fmt: function (v, ax) { return ax ? N(v, 0) + ' h' : hmTxt(v); }, title: 'CUI-02' }),
        read: T('La brecha se amplió entre 2016-2017 y 2020-2021 y se redujo levemente en 2024-2025, sin volver al nivel inicial.', 'The gap widened from 2016-17 to 2020-21 and narrowed slightly in 2024-25 without returning to its initial level.'),
        src: B.enut.src, note: B.enut.note };
    },
    'CUI-04': function () {
      var p = B.enut.participation.tnr;
      return { kpis: [[P(p.M), T('de las mujeres participa en trabajo no remunerado', 'of women do unpaid work')], [P(p.H), T('de los hombres', 'of men')], [N(p.M - p.H, 1) + ' p.p.', T('brecha nacional', 'national gap')]],
        chart: dumbbell(B.enut.domestic.map(function (d) { return { l: d[0], a: d[2], b: d[1] }; }), { min: 0, max: 100 }),
        read: T('Las mujeres participan mucho más en suministro de alimentos, limpieza y cuidado físico de personas del hogar.', 'Women participate far more in food provision, cleaning and physical care of household members.'),
        src: B.enut.src, note: T('Incluye trabajo no remunerado y actividades conexas; población de 10 años y más.', 'Includes unpaid work and related activities; population aged 10+.'), panorama: 'enut', map: deptMap('enut', null) };
    },
    'ECO-01': function () { return geihRate(0); },
    'ECO-02': function () { return geihRate(1); },
    'ECO-03': function () {
      var g = B.geih;
      return { kpis: [[P(g.td.M[g.td.M.length - 1]), T('desocupación de mujeres · may–jul 2026', 'women’s unemployment · May–Jul 2026')], [P(g.td.H[g.td.H.length - 1]), T('de hombres', 'men’s')], [N(g.td.M[g.td.M.length - 1] - g.td.H[g.td.H.length - 1], 1) + ' p.p.', T('brecha', 'gap')]],
        chart: lineChart({ labels: g.years, series: [{ name: T('Mujeres', 'Women'), color: WOMEN, values: g.td.M }, { name: T('Hombres', 'Men'), color: MEN, values: g.td.H }], fmt: function (v) { return P(v); }, title: 'ECO-03' }),
        read: T('La desocupación de las mujeres es la más baja de la serie, pero sigue por encima de la de los hombres en todos los años.', 'Women’s unemployment is at its lowest in the series but remains above men’s every year.'),
        src: g.src, note: g.note };
    },
    'DEM-01': function () {
      var p = B.enut.population, z = Object.keys(p);
      var pp = V8D() && V8D().population ? V8D().population.rows : [];
      var y = '2025', w = pp.filter(function (r) { return r.year === y; }).reduce(function (a, r) { return a + r.women; }, 0);
      return { kpis: [[P(p['Total nacional'].M / (p['Total nacional'].M + p['Total nacional'].H) * 100), T('de la población son mujeres · sep 2024–ago 2025', 'of the population are women · Sep 2024–Aug 2025')], [N(w), T('mujeres proyectadas en 2025 (PPED, 33 territorios)', 'women projected for 2025 (33 territories)')]],
        chart: barsH(z.map(function (k) { return { l: k, v: p[k].M / (p[k].M + p[k].H) * 100, t: P(p[k].M / (p[k].M + p[k].H) * 100), c: '#9E2C5A' }; })),
        read: T('Las mujeres son mayoría en las cabeceras y minoría en centros poblados y rural disperso.', 'Women are the majority in urban areas and the minority in rural areas.'),
        src: B.enut.src + ' · DANE PPED', map: popMap(y) };
    }
  };
  function sexualExams(share) {
    var s = src('nofatal'); if (!s) return null;
    var cat = function (r) { return /Delito Sexual/.test(r.category); };
    var w25 = sum('nofatal', function (r) { return r.year === '2025' && r.sex === 'Mujer' && cat(r); }), t25 = sum('nofatal', function (r) { return r.year === '2025' && cat(r); });
    var w26 = sum('nofatal', function (r) { return r.year === '2026' && r.sex === 'Mujer' && cat(r); }), t26 = sum('nofatal', function (r) { return r.year === '2026' && cat(r); });
    var sh = w25.v / t25.v * 100;
    return { kpis: share ? [[P(sh), T('de los exámenes son a mujeres · 2025', 'of exams are of women · 2025')], [P(w26.v / t26.v * 100), T('enero–junio 2026 (preliminar)', 'Jan–Jun 2026 (preliminary)')]] : [[ge(w25), T('exámenes médico-legales a mujeres · 2025', 'forensic exams of women · 2025')], [ge(w26), T('enero–junio 2026 (preliminar)', 'Jan–Jun 2026 (preliminary)')], [P(sh), T('del total son mujeres', 'are women')]],
      chart: shareBar(sexes('nofatal').map(function (x) { return { l: x === 'Mujer' ? T('Mujeres', 'Women') : x === 'Hombre' ? T('Hombres', 'Men') : x, v: sum('nofatal', function (r) { return r.year === '2025' && r.sex === x && cat(r); }).v, c: x === 'Mujer' ? WOMEN : x === 'Hombre' ? MEN : '#757574' }; }).filter(function (x) { return x.v > 0; })),
      read: T('Medicina Legal registra «exámenes médico-legales por presunto delito sexual». No es el total de violencias sexuales: muchas no llegan a examen forense.', 'Forensic exams for alleged sexual offences are not the total of sexual violence; many cases never reach a forensic exam.'),
      src: s.producer + ' · ' + s.file, panorama: 'nofatal', map: deptMap('nofatal', '2025', '2 Exámenes Medicolegales por Presunto Delito Sexual') };
  }
  function geihRate(i) {
    var g = B.geih, r = g.rates[i];
    return { kpis: [[P(r[2]), T(r[0] + ' de mujeres · may–jul 2026', 'Women · May–Jul 2026')], [P(r[1]), T('hombres', 'men')], [N(Math.abs(r[1] - r[2]), 1) + ' p.p.', T('brecha', 'gap')]],
      chart: dumbbell(g.rates.map(function (x) { return { l: x[0], a: x[2], b: x[1] }; }), { min: 0, max: 100 }),
      read: T('La participación y la ocupación de las mujeres están más de 20 puntos por debajo de las de los hombres.', 'Women’s participation and employment rates are over 20 points below men’s.'),
      src: g.src, note: g.note };
  }
  function deptMap(id, year, category) {
    var s = src(id); if (!s) return null;
    var y = year || s.periods[s.periods.length - 1], vals = {};
    GEOx().forEach(function (g) {
      var rows = s.rows.filter(function (r) { return r.year === y && r.sex === 'Mujer' && r.dept === g.code && (!category || r.category === category); });
      if (!rows.length) return; var vis = rows.filter(function (r) { return r.count != null; });
      vals[g.code] = vis.length ? vis.reduce(function (a, r) { return a + r.count; }, 0) : null;
    });
    return { values: vals, fmt: s.measure === 'percent' ? function (v) { return P(v); } : function (v) { return N(v); }, label: T('Mujeres', 'Women') + ' · ' + y };
  }
  function popMap(y) {
    var rows = V8D() && V8D().population ? V8D().population.rows : [], vals = {};
    rows.forEach(function (r) { if (r.year === y) vals[r.dept] = r.women; });
    return { values: vals, fmt: function (v, ax) { return ax ? N(v / 1000) + ' mil' : N(v); }, label: T('Mujeres proyectadas', 'Projected women') + ' · ' + y };
  }

  /* ---------------- análisis (Datos y análisis) ---------------- */
  var AN = {
    'pareja-serie': function () {
      var s = src('pareja'); if (!s) return null; var yrs = s.periods;
      var M = yrs.map(function (y) { return sum('pareja', function (r) { return r.year === y && r.sex === 'Mujer'; }).v; });
      var i20 = yrs.indexOf('2020'), last = M[M.length - 1], prev = M[M.length - 2];
      return { head: N(last), sub: T('lesiones a mujeres en ' + yrs[yrs.length - 1], 'injuries to women in ' + yrs[yrs.length - 1]),
        chart: lineChart({ labels: yrs, series: [{ name: T('Mujeres', 'Women'), color: WOMEN, values: M }] }),
        read: [T('El registro más alto fue en ' + yrs[M.indexOf(Math.max.apply(null, M))] + ' (' + N(Math.max.apply(null, M)) + ').', 'The peak was in ' + yrs[M.indexOf(Math.max.apply(null, M))] + '.'),
          T('En 2020 cayó a ' + N(M[i20]) + ', año de restricciones por la pandemia; menos exámenes no significa menos violencia.', 'In 2020 it fell to ' + N(M[i20]) + ', a year of pandemic restrictions; fewer exams do not mean less violence.'),
          T('Entre ' + yrs[yrs.length - 2] + ' y ' + yrs[yrs.length - 1] + ' varió ' + P((last - prev) / prev * 100) + '.', 'Between ' + yrs[yrs.length - 2] + ' and ' + yrs[yrs.length - 1] + ' it changed ' + P((last - prev) / prev * 100) + '.')],
        src: s.producer, rows: [['Año', 'Mujeres']].concat(yrs.map(function (y, i) { return [y, M[i]]; })), ind: 'VBG-04', panorama: 'pareja' };
    },
    'nofatal-mujeres': function () {
      var s = src('nofatal'); if (!s) return null;
      var cats = Array.from(new Set(s.rows.map(function (r) { return r.category; })));
      var it = cats.map(function (c) { return { l: c.replace(/^\d+\s*/, ''), v: sum('nofatal', function (r) { return r.year === '2025' && r.sex === 'Mujer' && r.category === c; }).v }; }).sort(function (a, b) { return b.v - a.v; });
      var tot = it.reduce(function (a, x) { return a + x.v; }, 0);
      return { head: P(it[0].v / tot * 100), sub: T('de las lesiones no fatales examinadas en mujeres fueron por violencia de pareja (2025)', 'of non-fatal injuries examined in women were partner violence (2025)'),
        chart: barsH(it.map(function (x) { return { l: x.l, v: x.v, t: N(x.v) + ' · ' + P(x.v / tot * 100), c: /Pareja|Sexual|Interpersonal|Familiar|Intrafamiliar/i.test(x.l) ? WOMEN : '#cfc4c9' }; })),
        read: [T('La violencia de pareja es la primera causa de lesión no fatal examinada en mujeres, por encima de la violencia interpersonal y los eventos de transporte.', 'Partner violence is the leading cause of non-fatal injury examined in women.'),
          T('Las categorías de violencia aparecen en color; las accidentales, en gris.', 'Violence categories are coloured; accidental ones are grey.')],
        src: s.producer + ' · ' + T('preliminar', 'preliminary'), rows: [['Categoría', 'Mujeres 2025']].concat(it.map(function (x) { return [x.l, x.v]; })), ind: 'VBG-04', panorama: 'nofatal' };
    },
    'sexual-sexo': function () { var r = sexualExams(true); if (!r) return null; return { head: r.kpis[0][0], sub: r.kpis[0][1], chart: r.chart, read: [r.read], src: r.src, ind: 'VBG-02', panorama: 'nofatal', mapd: r.map }; },
    'fatal-manera': function () {
      var s = src('fatal'); if (!s) return null;
      var cats = Array.from(new Set(s.rows.map(function (r) { return r.category; })));
      var it = cats.map(function (c) { return { l: c.replace(/^\d+\s*/, ''), M: sum('fatal', function (r) { return r.year === '2025' && r.sex === 'Mujer' && r.category === c; }).v, H: sum('fatal', function (r) { return r.year === '2025' && r.sex === 'Hombre' && r.category === c; }).v }; });
      var hom = it.find(function (x) { return /Homicid/.test(x.l); });
      return { head: N(hom.M), sub: T('presuntos homicidios de mujeres en 2025 (preliminar)', 'alleged homicides of women in 2025 (preliminary)'),
        chart: barsH(it.map(function (x) { return { l: x.l, v: x.M, c: WOMEN, t: N(x.M) + ' · ' + T('mujeres por cada 100 hombres: ', 'women per 100 men: ') + N(x.M / x.H * 100) }; })),
        read: [T('Por cada 100 hombres muertos por presunto homicidio hubo ' + N(hom.M / hom.H * 100) + ' mujeres. La violencia letal golpea más a los hombres, pero las mujeres mueren más a menudo a manos de parejas o familiares.', 'For every 100 men killed by alleged homicide, ' + N(hom.M / hom.H * 100) + ' women were killed.'),
          T('Un homicidio de mujer no equivale a feminicidio: esa calificación depende de la investigación judicial.', 'A homicide of a woman is not necessarily a femicide.')],
        src: s.producer + ' · ' + T('preliminar', 'preliminary'), rows: [['Manera', 'Mujeres', 'Hombres']].concat(it.map(function (x) { return [x.l, x.M, x.H]; })), ind: 'AMP-V01', panorama: 'fatal' };
    },
    'ins-notificacion': function () { var r = IND['VBG-05'](); return { head: r.kpis[0][0], sub: r.kpis[0][1], chart: r.chart + '<h4>' + T('Por tipo de violencia, 2025 (ambos sexos)', 'By type of violence, 2025 (both sexes)') + '</h4>' + barsH(B.ins.types2025.map(function (t) { return { l: t[0], v: t[1], c: '#17A58C' }; })), read: [r.read, T('Tasa de notificación 2025: ' + N(B.ins.rates2025.M, 1) + ' casos por 100.000 mujeres frente a ' + N(B.ins.rates2025.H, 1) + ' por 100.000 hombres.', '2025 notification rate: ' + N(B.ins.rates2025.M, 1) + ' per 100,000 women vs ' + N(B.ins.rates2025.H, 1) + ' per 100,000 men.')], src: B.ins.src, note: B.ins.note, rows: [['Año', 'Mujeres', 'Hombres']].concat(B.ins.years.map(function (y, i) { return [y, B.ins.M[i], B.ins.H[i]]; })), ind: 'VBG-05' }; },
    'enut-horas': function () { var r = IND['CUI-01'](), g = IND['CUI-02'](); return { head: r.kpis[0][0], sub: r.kpis[0][1], chart: r.chart + '<h4>' + T('Brecha diaria por zona', 'Daily gap by area') + '</h4>' + g.chart, read: [r.read, g.read], src: r.src, note: r.note, rows: [['Zona', 'Periodo', 'Mujeres', 'Hombres']].concat([].concat.apply([], Object.keys(B.enut.hours).map(function (z) { return B.enut.periods.map(function (p, i) { return [z, p, B.enut.hours[z].M[i], B.enut.hours[z].H[i]]; }); }))), ind: 'CUI-01' }; },
    'enut-participacion': function () { var r = IND['CUI-04'](); return { head: r.kpis[0][0], sub: r.kpis[0][1], chart: r.chart, read: [r.read, T('En trabajo remunerado ocurre lo contrario: participa el ' + P(B.enut.participation.tr.H) + ' de los hombres y el ' + P(B.enut.participation.tr.M) + ' de las mujeres.', 'In paid work it is the reverse: ' + P(B.enut.participation.tr.H) + ' of men vs ' + P(B.enut.participation.tr.M) + ' of women.')], src: r.src, note: r.note, rows: [['Actividad', 'Hombres %', 'Mujeres %']].concat(B.enut.domestic), ind: 'CUI-04' }; },
    'enut-departamentos': function () {
      var s = src('enut'); if (!s) return null; var y = s.periods[s.periods.length - 1];
      var it = GEOx().map(function (g) { var m = s.rows.find(function (r) { return r.dept === g.code && r.sex === 'Mujer' && r.year === y; }), h = s.rows.find(function (r) { return r.dept === g.code && r.sex === 'Hombre' && r.year === y; }); return m && h && m.count != null && h.count != null ? { l: g.name, a: m.count, b: h.count } : null; }).filter(Boolean).sort(function (a, b) { return (b.a - b.b) - (a.a - a.b); });
      return { head: N(it[0].a - it[0].b, 1) + ' p.p.', sub: T('brecha más amplia: ', 'widest gap: ') + it[0].l,
        chart: dumbbell(it, { min: 40, max: 100 }),
        read: [T('En todos los departamentos con estimación, las mujeres participan más que los hombres en trabajo no remunerado. La brecha va de ' + N(it[it.length - 1].a - it[it.length - 1].b, 1) + ' a ' + N(it[0].a - it[0].b, 1) + ' puntos.', 'In every department with an estimate, women participate more than men. The gap ranges from ' + N(it[it.length - 1].a - it[it.length - 1].b, 1) + ' to ' + N(it[0].a - it[0].b, 1) + ' points.'),
          T('Son estimaciones con intervalo de confianza; diferencias pequeñas entre departamentos pueden no ser significativas.', 'Estimates have confidence intervals; small differences may not be significant.')],
        src: s.producer + ' · ' + s.file, rows: [['Departamento', 'Mujeres %', 'Hombres %']].concat(it.map(function (x) { return [x.l, x.a, x.b]; })), ind: 'CUI-04', panorama: 'enut' };
    },
    'geih-td': function () { var r = IND['ECO-03'](); return { head: r.kpis[0][0], sub: r.kpis[0][1], chart: r.chart, read: [r.read, T('En 2020 la desocupación de las mujeres llegó a ' + P(B.geih.td.M[1]) + '.', 'In 2020 women’s unemployment reached ' + P(B.geih.td.M[1]) + '.')], src: r.src, note: r.note, rows: [['Año', 'Mujeres %', 'Hombres %']].concat(B.geih.years.map(function (y, i) { return [y, B.geih.td.M[i], B.geih.td.H[i]]; })), ind: 'ECO-03' }; },
    'geih-brechas': function () { var g = B.geih; return { head: N(g.rates[0][1] - g.rates[0][2], 1) + ' p.p.', sub: T('brecha en participación laboral · may–jul 2026', 'labour participation gap · May–Jul 2026'), chart: dumbbell(g.rates.map(function (x) { return { l: x[0], a: x[2], b: x[1] }; }), { min: 0, max: 100 }) + '<h4>' + T('Desocupación por dominio geográfico', 'Unemployment by area') + '</h4>' + dumbbell(g.domains.map(function (x) { return { l: x[0], a: x[2], b: x[1] }; }), { min: 0, max: 14 }), read: [T('La mayor brecha de desocupación está en centros poblados y rural disperso: ' + N(g.domains[1][2] - g.domains[1][1], 1) + ' puntos.', 'The widest unemployment gap is in rural areas: ' + N(g.domains[1][2] - g.domains[1][1], 1) + ' points.')], src: g.src, note: g.note, rows: [['Indicador', 'Hombres %', 'Mujeres %']].concat(g.rates).concat(g.domains), ind: 'ECO-01' }; },
    'obs-red': function () {
      var all = S.obs.filter(function (o) { return o.pub; }), amb = {}, byDept = {};
      all.forEach(function (o) { amb[o.amb] = (amb[o.amb] || 0) + 1; if (o.dept) byDept[o.dept] = (byDept[o.dept] || 0) + 1; });
      var it = Object.keys(amb).map(function (k) { return { l: k, v: amb[k], c: AMBC[k] || '#1A82B9' }; }).sort(function (a, b) { return b.v - a.v; });
      return { head: N(all.length), sub: T('observatorios y sistemas de información en la red', 'observatories and information systems in the network'), chart: barsH(it), mapd: { values: byDept, fmt: function (v) { return N(v) + ' ' + (v === 1 ? T('observatorio', 'observatory') : T('observatorios', 'observatories')); }, label: T('Observatorios territoriales y académicos por departamento', 'Local and academic observatories by department') },
        read: [T('Bogotá, Antioquia y Valle del Cauca concentran los observatorios territoriales y académicos identificados.', 'Bogotá, Antioquia and Valle del Cauca host most local and academic observatories.'), T('La mayoría de departamentos aún no tiene un observatorio de mujeres identificado en el directorio.', 'Most departments still have no identified women’s observatory.')],
        src: T('Directorio del Observatorio (verificación inicial)', 'Observatory directory (initial check)'), rows: [['Observatorio', 'Ámbito', 'Departamento']].concat(all.map(function (o) { return [o.n, o.amb, o.dept ? deptName(o.dept) : '']; })) };
    },
    'poblacion-mujeres': function () { var m = popMap('2025'), vals = m.values, it = Object.keys(vals).map(function (k) { return { l: deptName(k), v: vals[k] }; }).sort(function (a, b) { return b.v - a.v; }); var tot = it.reduce(function (a, x) { return a + x.v; }, 0); return { head: N(tot), sub: T('mujeres proyectadas en 2025 (33 territorios)', 'women projected in 2025 (33 territories)'), chart: '', mapd: m, extra: barsH(it.slice(0, 8).map(function (x) { return { l: x.l, v: x.v, c: '#9E2C5A', t: N(x.v) + ' · ' + P(x.v / tot * 100) }; })), read: [T('Cinco territorios concentran cerca de la mitad de las mujeres del país: ' + it.slice(0, 5).map(function (x) { return x.l; }).join(', ') + '.', 'Five territories hold about half of the country’s women.'), T('Contexto demográfico: no se usa como denominador automático de tasas.', 'Demographic context only; not used as an automatic rate denominator.')], src: 'DANE · Proyecciones de población (PPED) 2018-2050', rows: [['Departamento', 'Mujeres 2025']].concat(it.map(function (x) { return [x.l, x.v]; })), ind: 'DEM-01' }; }
  };
  function analysisText(id, a) { var t = S.analyses.text[id] || {}; return { title: t.title || T(a.es, a.en), note: t.note || '' }; }

  /* ---------------- diálogo (sub-ventana) ---------------- */
  function dialog(html, color) {
    var d = D.getElementById('lv11Dialog');
    if (!d) { d = D.createElement('dialog'); d.id = 'lv11Dialog'; d.className = 'lv11dlg'; d.setAttribute('data-no-translate', ''); D.body.appendChild(d); d.addEventListener('click', function (e) { if (e.target === d) d.close(); }); }
    d.style.setProperty('--c', color || '#9E2C5A'); d.style.setProperty('--ci', ink(color || '#9E2C5A'));
    d.innerHTML = '<button class="lv11x" onclick="this.closest(\'dialog\').close()" aria-label="' + T('Cerrar', 'Close') + '">' + icon('close') + '</button>' + html;
    if (!d.open) d.showModal(); d.scrollTop = 0; animateIn(d);
  }
  function animateIn(root) { root.querySelectorAll('.lvbt i,.lvdraw').forEach(function (el) { el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); }); countUp(root); }
  function countUp(root) {
    if (W.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.querySelectorAll('[data-count]').forEach(function (el) {
      var txt = el.textContent, m = txt.match(/\d[\d.,]*/); if (!m) return;
      var chunk = m[0].replace(/[.,]$/, ''), dec = /,\d{1,2}$/.test(chunk) && !en() ? chunk.split(',')[1].length : (/\.\d{1,2}$/.test(chunk) && en() ? chunk.split('.')[1].length : 0);
      var num = parseFloat(en() ? chunk.replace(/,/g, '') : chunk.replace(/\./g, '').replace(',', '.')); if (!isFinite(num) || num < 2) return;
      var pre = txt.slice(0, m.index), post = txt.slice(m.index + chunk.length), t0 = null;
      (function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 900), e = 1 - Math.pow(1 - k, 3); el.textContent = k < 1 ? pre + N(num * e, dec) + post : txt; if (k < 1) requestAnimationFrame(step); })(performance.now());
    });
  }

  /* ---------------- ventana de indicador ---------------- */
  function openIndicator(code) {
    var x = catalog().find(function (i) { return i.code === code; }); if (!x) return;
    var st = site(indSite(x)) || { c: '#9E2C5A', es: x.theme }, c = st.c, f = IND[code], r = f ? f() : null;
    var summary = S.ind.summary[code];
    var h = '<div class="lv11dh" style="--c:' + c + '"><span class="lv11chip">' + icon(st.ico || 'chart', 16) + ' ' + E(sName(st)) + '</span><h2>' + E(x.name) + '</h2>' +
      '<p class="lv11status ' + (r ? 'ok' : '') + '">' + (r ? T('Con información procesada', 'Processed information available') : T('Ficha publicada · datos en preparación', 'Published specification · data in preparation')) + '</p></div>';
    if (summary) h += '<p class="lv11lead">' + E(summary) + '</p>';
    if (r) {
      h += '<div class="lv11kpis">' + r.kpis.map(function (k, i) { return '<div class="lv11kpi' + (i === 0 ? ' main' : '') + '"><b data-count>' + E(k[0]) + '</b><span>' + E(k[1]) + '</span></div>'; }).join('') + '</div>';
      var dyc = dynFor(code, c); if (r.chart || dyc) h += '<section class="lv11card lv11viz" style="--c:' + c + '"><h3>' + icon('chart', 18) + T('Cómo se ve', 'What it looks like') + '</h3>' + (dyc || r.chart) + '</section>';
      if (r.map) h += '<section class="lv11card"><h3>' + icon('network', 18) + T('Por departamento', 'By department') + ' · ' + E(r.map.label) + '</h3>' + choropleth(r.map.values, { color: c, fmt: r.map.fmt }) + '</section>';
      h += '<section class="lv11read"><h3>' + T('Lectura', 'Reading') + '</h3><p>' + E(r.read) + '</p>' + (r.note ? '<p class="lv11note">' + E(r.note) + '</p>' : '') + '<p class="lv11src">' + T('Fuente', 'Source') + ': ' + E(r.src) + '</p>' + (r.panorama ? '<button class="lv11btn" onclick="LV11.panorama(\'' + r.panorama + '\')">' + T('Explorar en el panorama interactivo', 'Explore in the interactive overview') + ' ' + icon('arrow', 16) + '</button>' : '') + '</section>';
    } else {
      h += '<section class="lv11card lv11pending"><h3>' + T('¿Qué falta para publicar datos?', 'What is needed to publish data?') + '</h3><p>' + E(x.note || T('Acceso a la fuente, validación del método y autorización institucional.', 'Source access, method validation and institutional approval.')) + '</p><p>' + T('Fuente prevista', 'Planned source') + ': <b>' + E(x.source || (x.sources || []).join(', ') || T('por definir', 'to be defined')) + '</b></p></section>';
    }
    h += '<section class="lv11card lv11ficha"><h3>' + icon('doc', 18) + T('Ficha del indicador', 'Indicator specification') + '</h3><dl>' +
      [[T('Fórmula', 'Formula'), x.formula], [T('Unidad', 'Unit'), x.unit], [T('Periodicidad', 'Frequency'), x.frequency], [T('Variables y desagregaciones', 'Variables and breakdowns'), x.variables], [T('Fuente', 'Source'), x.source || (x.sources || []).join(', ')], [T('Estado', 'Status'), x.status]].filter(function (p) { return p[1]; }).map(function (p) { return '<dt>' + E(p[0]) + '</dt><dd>' + E(p[1]) + '</dd>'; }).join('') + '</dl></section>';
    var rel = S.norms.filter(function (n) { return n.pub && n.sites.indexOf(st.id) > -1; }).slice(0, 6);
    if (rel.length) h += '<section class="lv11card"><h3>' + icon('scale', 18) + T('Normas relacionadas', 'Related laws') + '</h3><div class="lv11tags">' + rel.map(function (n) { return '<button onclick="LV11.openNorm(\'' + n.id + '\')">' + E(n.n) + '</button>'; }).join('') + '</div></section>';
    dialog('<div class="lv11dbody">' + h + '</div>', c);
  }

  function openAnalysis(id) {
    var a = DEF.analyses.find(function (z) { return z.id === id; }); if (!a || !AN[id]) return;
    var r = AN[id](); if (!r) return; var st = site(a.site) || {}, c = st.c || '#9E2C5A', tx = analysisText(id, a);
    var h = '<div class="lv11dh" style="--c:' + c + '"><span class="lv11chip">' + icon(st.ico || 'chart', 16) + ' ' + E(sName(st)) + '</span><h2>' + E(tx.title) + '</h2></div>' +
      '<div class="lv11hero"><b data-count>' + E(r.head) + '</b><span>' + E(r.sub) + '</span></div>' +
      (r.chart ? '<section class="lv11card">' + r.chart + '</section>' : '') +
      (r.mapd ? '<section class="lv11card"><h3>' + E(r.mapd.label) + '</h3>' + choropleth(r.mapd.values, { color: c, fmt: r.mapd.fmt }) + '</section>' : '') +
      (r.extra ? '<section class="lv11card">' + r.extra + '</section>' : '') +
      '<section class="lv11read"><h3>' + T('Qué nos dice', 'What it tells us') + '</h3><ul>' + r.read.map(function (t) { return '<li>' + E(t) + '</li>'; }).join('') + '</ul>' + (tx.note ? '<p>' + E(tx.note) + '</p>' : '') + (r.note ? '<p class="lv11note">' + E(r.note) + '</p>' : '') + '<p class="lv11src">' + T('Fuente', 'Source') + ': ' + E(r.src) + '</p>' +
      '<div class="lv11row">' + (r.rows ? '<button class="lv11btn ghost" onclick="LV11.csv(\'' + id + '\')">' + icon('download', 16) + ' CSV</button>' : '') + (r.ind ? '<button class="lv11btn ghost" onclick="LV11.openIndicator(\'' + r.ind + '\')">' + T('Ver ficha del indicador', 'View indicator') + '</button>' : '') + (r.panorama ? '<button class="lv11btn" onclick="LV11.panorama(\'' + r.panorama + '\')">' + T('Explorar en el panorama', 'Explore in overview') + ' ' + icon('arrow', 16) + '</button>' : '') + '</div></section>';
    dialog('<div class="lv11dbody">' + h + '</div>', c);
  }
  function csv(id) { var r = AN[id] && AN[id](); if (!r || !r.rows) return; var t = r.rows.map(function (row) { return row.map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(';'); }).join('\n'); var a = D.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + t], { type: 'text/csv' })); a.download = 'analisis_' + id + '.csv'; D.body.appendChild(a); a.click(); a.remove(); }

  function openNorm(id) {
    var n = S.norms.find(function (z) { return z.id === id; }); if (!n) return;
    var h = '<div class="lv11dh" style="--c:#9E2C5A"><span class="lv11chip">' + E(n.tipo) + ' · ' + E(n.y) + '</span><h2>' + E(n.n) + '</h2></div><p class="lv11lead">' + E(T(n.d, n.de)) + '</p>' +
      '<section class="lv11card"><h3>' + T('Derechos que protege', 'Rights protected') + '</h3><div class="lv11tags">' + (n.rights || []).map(function (r) { var x = DEF.rights.find(function (z) { return z.id === r; }); return x ? '<span>' + E(T(x.es, x.en)) + '</span>' : ''; }).join('') + '</div><h3 style="margin-top:16px">' + T('Micrositios', 'Microsites') + '</h3><div class="lv11tags">' + (n.sites || []).map(function (s) { var x = site(s); return x ? '<button style="--c:' + x.c + '" onclick="LV11.openSite(\'' + x.id + '\')">' + E(sName(x)) + '</button>' : ''; }).join('') + '</div></section>' +
      (n.url ? '<a class="lv11btn" href="' + E(n.url) + '" target="_blank" rel="noopener">' + T('Consultar texto oficial', 'Read official text') + ' ' + icon('ext', 16) + '</a>' : '') + '<p class="lv11note">' + T('Verifique vigencia y modificaciones antes de citar. Algunos enlaces llevan al buscador oficial SUIN-Juriscol.', 'Check validity and amendments before citing.') + '</p>';
    dialog('<div class="lv11dbody">' + h + '</div>', '#9E2C5A');
  }

  /* ---------------- secciones públicas ---------------- */
  // Devuelve el contenedor nuevo de la sección. El contenido anterior se conserva oculto
  // para que los scripts heredados (catálogo, publicaciones, idioma) sigan encontrando sus nodos.
  function sectionEl(id) {
    var s = D.getElementById(id);
    if (!s) { s = D.createElement('section'); s.id = id; s.className = 'page'; D.querySelector('main').appendChild(s); }
    s.classList.add('lv11page');
    var box = s.querySelector(':scope > .lv11content');
    if (!box) {
      var legacy = D.createElement('div'); legacy.className = 'lv11legacy'; legacy.hidden = true;
      while (s.firstChild) legacy.appendChild(s.firstChild);
      box = D.createElement('div'); box.className = 'lv11content'; box.setAttribute('data-no-translate', '');
      s.appendChild(box); s.appendChild(legacy);
    }
    return box;
  }
  function pageHead(eyebrow, title, lead) { return '<div class="lv11head"><div class="eyebrow">' + E(eyebrow) + '</div><h1>' + E(title) + '</h1><p class="muted">' + E(lead) + '</p></div>'; }

  var currentSite = null;
  function siteCounts(s) {
    return { ind: published().filter(function (x) { return indSite(x) === s.id; }).length, norms: S.norms.filter(function (n) { return n.pub && n.sites.indexOf(s.id) > -1; }).length, obs: S.obs.filter(function (o) { return o.pub && (s.link === 'red' || o.foc.indexOf(s.id) > -1); }).length, data: !!((s.kpis && s.kpis.length) || (s.analyses && s.analyses.length)) };
  }
  function renderSites() {
    var sec = sectionEl('micrositios');
    if (currentSite && site(currentSite)) { sec.innerHTML = siteView(site(currentSite)); animateIn(sec); return; }
    sec.innerHTML = pageHead(T('Micrositios temáticos', 'Thematic microsites'), T('Cada línea, un lugar para consultar.', 'Each line, a place to explore.'), T('Elige un tema: encontrarás sus cifras procesadas, indicadores, normas, observatorios e instancias de seguimiento.', 'Choose a topic to find its processed figures, indicators, laws, observatories and monitoring bodies.')) +
      '<div class="lv11tools"><label class="lv11search">' + icon('search', 18) + '<input id="lv11siteq" placeholder="' + T('Buscar un micrositio…', 'Find a microsite…') + '" oninput="LV11.filterSites(this.value)"></label><span class="lv11count">' + sites().length + ' ' + T('micrositios', 'microsites') + '</span></div>' +
      '<div class="lv11sites">' + sites().map(function (s, i) { var k = siteCounts(s); return '<button class="lv11site' + (s.rainbow ? ' rainbow' : '') + '" style="--c:' + s.c + ';--ci:' + ink(s.c) + ';animation-delay:' + (i * 35) + 'ms" data-q="' + E((s.es + ' ' + (s.en || '') + ' ' + s.d).toLowerCase()) + '" onclick="LV11.openSite(\'' + s.id + '\')"><span class="lv11sico">' + sicon(s.ico, 26) + '</span><b>' + E(sName(s)) + '</b><small>' + E(T(s.d, s.de)) + '</small><span class="lv11meta">' + (k.data ? '<em class="data">' + T('Con datos', 'With data') + '</em>' : '<em>' + T('En construcción', 'In progress') + '</em>') + '<i>' + k.ind + ' ' + T('ind.', 'ind.') + '</i><i>' + k.norms + ' ' + T('normas', 'laws') + '</i><i>' + k.obs + ' ' + T('obs.', 'obs.') + '</i></span><span class="lv11go">' + icon('arrow', 18) + '</span></button>'; }).join('') + '</div>';
    animateIn(sec);
  }
  function siteView(s) {
    var c = s.c, k = siteCounts(s), h = '<button class="lv11back" onclick="LV11.openSite(null)">' + icon('back', 18) + T('Todos los micrositios', 'All microsites') + '</button>';
    h += '<div class="lv11sitehero' + (s.rainbow ? ' rainbow' : '') + '" style="--c:' + c + ';--ci:' + ink(c) + '"><span class="lv11sico big">' + sicon(s.ico, 34) + '</span><div><div class="eyebrow">' + T('Micrositio', 'Microsite') + '</div><h1>' + E(sName(s)) + '</h1><p>' + E(T(s.d, s.de)) + '</p><div class="lv11meta light"><i>' + k.ind + ' ' + T('indicadores', 'indicators') + '</i><i>' + k.norms + ' ' + T('normas', 'laws') + '</i><i>' + k.obs + ' ' + T('observatorios y fuentes', 'observatories & sources') + '</i></div>' +
      ((s.panorama || s.topic) ? '<button class="lv11btn light" onclick="LV11.panorama(\'' + (s.panorama || '') + '\',\'' + (s.topic || '') + '\')">' + T('Explorar en el panorama interactivo', 'Explore in the interactive overview') + ' ' + icon('arrow', 16) + '</button>' : '') + '</div></div>';
    var kp = (s.kpis || []).map(function (code) { var f = IND[code], r = f && f(); var x = catalog().find(function (i) { return i.code === code; }); return r && x ? '<button class="lv11kpi tile" style="--c:' + c + '" onclick="LV11.openIndicator(\'' + code + '\')"><b data-count>' + E(r.kpis[0][0]) + '</b><span>' + E(plain(code, x.name, r.kpis[0][0]).t) + '</span><em>' + E(plain(code, x.name, r.kpis[0][0]).s || r.kpis[0][1]) + '</em></button>' : ''; }).join('');
    if (kp) h += '<div class="lv11kpis tiles">' + kp + '</div>';
    var ans = (s.analyses || []).filter(function (id) { return S.analyses.hidden.indexOf(id) < 0 && AN[id]; });
    if (ans.length) {
      WIDE = true; var first = AN[ans[0]](); WIDE = false; var a0 = DEF.analyses.find(function (z) { return z.id === ans[0]; });
      if (first) h += '<section class="lv11card wide"><div class="lv11cardhead"><h3>' + icon('chart', 18) + E(analysisText(ans[0], a0).title) + '</h3><button class="lv11btn ghost" onclick="LV11.openAnalysis(\'' + ans[0] + '\')">' + T('Ver análisis completo', 'Full analysis') + '</button></div><div class="lv11hero sm"><b data-count>' + E(first.head) + '</b><span>' + E(first.sub) + '</span></div>' + (first.chart || (first.mapd ? choropleth(first.mapd.values, { color: c, fmt: first.mapd.fmt }) : '')) + '<p class="lv11src">' + E(first.src) + '</p></section>';
      if (ans.length > 1) h += '<h2 class="lv11h2">' + T('Más análisis de esta línea', 'More analyses') + '</h2><div class="lv11grid3">' + ans.slice(1).map(function (id) { return analysisCard(id); }).join('') + '</div>';
    }
    if (s.info && s.info.length) h += '<h2 class="lv11h2">' + T('Lo que debes saber', 'What to know') + '</h2><div class="lv11info">' + s.info.map(function (p) { return '<div class="lv11infocard" style="--c:' + c + '"><b>' + E(p[0]) + '</b><p>' + E(p[1]) + '</p></div>'; }).join('') + '</div>';
    if (s.link === 'rutas') h += routesBlock();
    var inds = published().filter(function (x) { return indSite(x) === s.id; });
    if (inds.length) h += '<h2 class="lv11h2">' + T('Indicadores de la línea', 'Indicators') + '</h2>' + indTable(inds);
    var ns = S.norms.filter(function (n) { return n.pub && n.sites.indexOf(s.id) > -1; }).sort(function (a, b) { return b.y - a.y; });
    if (ns.length) h += '<h2 class="lv11h2">' + T('Normativa y derechos', 'Laws and rights') + '</h2><div class="lv11grid3">' + ns.map(normCard).join('') + '</div>';
    var os = S.obs.filter(function (o) { return o.pub && o.foc.indexOf(s.id) > -1; });
    if (s.link === 'red') os = S.obs.filter(function (o) { return o.pub; });
    if (os.length) h += '<h2 class="lv11h2">' + T('Observatorios y fuentes', 'Observatories and sources') + '</h2><div class="lv11grid3">' + os.map(obsCard).join('') + '</div>';
    if (['violencias', 'casas-refugio', 'lgbtiq', 'comite-1257', 'comite-1719', 'comites-tecnico-juridicos', 'salud-dsr'].indexOf(s.id) > -1) h += helpStrip();
    return h;
  }
  // Qué información podemos procesar: estado del acervo de la línea.
  var SRCNAME = {};
  function readiness(s) {
    (W.LV11_SOURCES || []).forEach(function (x) { SRCNAME[x.id] = x.name; });
    var list = catalog().filter(function (x) { return indSite(x) === s.id && !/Duplicada|Incompleta/.test(x.status || ''); });
    var done = list.filter(function (x) { return IND[x.code]; }), ficha = list.filter(function (x) { return !IND[x.code] && x.origin === 'Ficha adjunta'; }), rest = list.filter(function (x) { return !IND[x.code] && x.origin !== 'Ficha adjunta'; });
    var src = {}; list.forEach(function (x) { (x.sources || []).forEach(function (id) { src[id] = (src[id] || 0) + 1; }); });
    var srcIt = Object.keys(src).map(function (k) { return { l: SRCNAME[k] || k, v: src[k], c: s.c, t: src[k] + ' ' + T('indicadores', 'indicators') }; }).sort(function (a, b) { return b.v - a.v; }).slice(0, 7);
    var h = '<div class="lv11grid2 lv11ready"><section class="lv11card"><h3>' + icon('chart', 18) + T('Qué información podemos procesar', 'What information we can process') + '</h3><p class="lv11note">' + list.length + ' ' + T('entradas del catálogo pertenecen a esta línea.', 'catalogue entries belong to this line.') + '</p>' +
      barsH([{ l: T('Con datos procesados', 'Processed data'), v: done.length, c: '#22A37A', t: String(done.length) }, { l: T('Ficha lista · falta acceso a la fuente', 'Specification ready · source access pending'), v: ficha.length, c: s.c, t: String(ficha.length) }, { l: T('Propuesta o por operacionalizar', 'Proposed or to be operationalised'), v: rest.length, c: '#cfc4c9', t: String(rest.length) }]) + '</section>';
    h += '<section class="lv11card"><h3>' + icon('network', 18) + T('Fuentes que alimentan esta línea', 'Sources feeding this line') + '</h3>' + (srcIt.length ? barsH(srcIt) : '<p class="lv11note">' + T('Aún no hay fuentes asignadas en el catálogo.', 'No sources assigned yet.') + '</p>') + '</section></div>';
    return h;
  }
  /* v31: gráficas dinámicas para las tarjetas de análisis: el visitante cambia el tipo de gráfica */
  var DYN = {}, DCOL = ['#D33B78', '#1A82B9', '#8E36CF', '#17A58C', '#E0A800', '#EF6B4A', '#5B5BD6', '#9E2C5A', '#22A37A', '#c9bcd6'];
  function hnum(v) { if (typeof v === 'number') return v; var m = /^(\d+):(\d+)$/.exec(String(v)); if (m) return +m[1] + m[2] / 60; var n = parseFloat(String(v).replace(/\./g, '').replace(',', '.')); return isNaN(n) ? null : n; }
  function dshape(r) {
    if (!r || !r.rows || r.rows.length < 3) return null;
    var head = r.rows[0], body = r.rows.slice(1), num = [];
    if (head[1] === 'Periodo') { var z0 = body[0][0]; body = body.filter(function (x) { return x[0] === z0; }).map(function (x) { return x.slice(1); }); head = head.slice(1); }
    head.forEach(function (h, i) { if (i && body.every(function (x) { return hnum(x[i]) != null; })) num.push(i); });
    if (!num.length) return null;
    var lab = head.length > 2 && !num.length ? 0 : 0, ser = /^\d{4}/.test(String(body[0][0])) && /^\d{4}/.test(String(body[body.length - 1][0]));
    return { head: head, body: body, num: num.slice(0, 2), series: ser, isTime: num.some(function (i) { return /:/.test(String(body[0][i])); }) };
  }
  function dfmt(v, sh) { if (sh && sh.isTime) { var h = Math.floor(v), m = Math.round((v - h) * 60); return h + ' h ' + m + ' min'; } return Math.abs(v) < 100 && v % 1 ? N(v, 1) : N(v); }
  function dtypes(sh) { return sh.series ? [['line', T('Línea', 'Line')], ['col', T('Columnas', 'Columns')], ['area', T('Área', 'Area')]] : sh.num.length > 1 ? [['range', T('Brecha', 'Gap')], ['bars', T('Barras', 'Bars')], ['donut', T('Dona', 'Donut')]] : [['bars', T('Barras', 'Bars')], ['donut', T('Dona', 'Donut')], ['dots', T('Puntos', 'Dots')]]; }
  function dynSVG(id, c) {
    var r = AN[id] && AN[id](), sh = dshape(r); if (!sh) return null;
    var ty = DYN[id] || dtypes(sh)[0][0], b = sh.body, n0 = sh.num[0], n1 = sh.num[1], cols = [c, n1 ? '#1A82B9' : c], H = '';
    var lg = sh.num.map(function (i, k) { return '<span><i style="background:' + (k ? '#1A82B9' : c) + '"></i>' + E(sh.head[i]) + '</span>'; }).join('');
    if (sh.series) {
      var W0 = 560, H0 = 250, L = 46, R = 14, Tp = 16, B = 30, mx = Math.max.apply(null, b.map(function (x) { return Math.max(hnum(x[n0]), n1 ? hnum(x[n1]) : 0); })) * 1.12 || 1, nb = b.length;
      var X = function (i) { return L + (nb > 1 ? i / (nb - 1) : .5) * (W0 - L - R); }, Y = function (v) { return Tp + (1 - v / mx) * (H0 - Tp - B); };
      H += [0, .5, 1].map(function (f) { return '<line x1="' + L + '" x2="' + (W0 - R) + '" y1="' + Y(mx * f) + '" y2="' + Y(mx * f) + '" class="g"/><text class="ax" x="' + (L - 6) + '" y="' + (Y(mx * f) + 4) + '">' + dfmt(mx * f, sh) + '</text>'; }).join('');
      H += b.map(function (x, i) { return (i % Math.ceil(nb / 6) === 0 || i === nb - 1) ? '<text class="ax mid" x="' + X(i) + '" y="' + (H0 - 8) + '">' + E(String(x[0]).slice(0, 9)) + '</text>' : ''; }).join('');
      sh.num.forEach(function (ci, k) {
        var col = cols[k];
        if (ty === 'col') { var bw = (W0 - L - R) / nb / (sh.num.length + .6); H += b.map(function (x, i) { var v = hnum(x[ci]), xx = X(i) - bw * sh.num.length / 2 + k * bw; return '<rect class="cl" x="' + xx.toFixed(1) + '" y="' + Y(v).toFixed(1) + '" width="' + (bw - 2).toFixed(1) + '" height="' + (Y(0) - Y(v)).toFixed(1) + '" fill="' + col + '" style="--i:' + i + '" data-tt="' + E(x[0] + ' · ' + sh.head[ci] + '|' + dfmt(v, sh)) + '"/>'; }).join(''); }
        else { var d = b.map(function (x, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(hnum(x[ci])).toFixed(1); }).join(' ');
          if (ty === 'area') H += '<path class="ar2" d="' + d + ' L' + X(nb - 1) + ' ' + Y(0) + ' L' + X(0) + ' ' + Y(0) + 'Z" fill="' + col + '"/>';
          H += '<path class="ln2" d="' + d + '" stroke="' + col + '" pathLength="1"/>' + b.map(function (x, i) { return '<circle class="pt2" cx="' + X(i).toFixed(1) + '" cy="' + Y(hnum(x[ci])).toFixed(1) + '" r="4" stroke="' + col + '" style="--i:' + i + '"/>'; }).join(''); }
      });
      if (ty !== 'col') H += b.map(function (x, i) { var w = (W0 - L - R) / Math.max(1, nb - 1); return '<rect class="hz" x="' + (X(i) - w / 2).toFixed(1) + '" y="' + Tp + '" width="' + w.toFixed(1) + '" height="' + (H0 - Tp - B) + '" data-tt="' + E(x[0] + '|' + sh.num.map(function (ci) { return sh.head[ci] + ': ' + dfmt(hnum(x[ci]), sh); }).join(' · ')) + '"/>'; }).join('');
      if (ty !== 'col') { var mi = 0; b.forEach(function (x, i) { if (hnum(x[n0]) > hnum(b[mi][n0])) mi = i; }); H += '<g class="pk2"><circle cx="' + X(mi) + '" cy="' + Y(hnum(b[mi][n0])) + '" r="9" fill="' + c + '"/><text x="' + Math.min(W0 - 60, Math.max(70, X(mi))) + '" y="' + (Y(hnum(b[mi][n0])) - 13) + '" fill="' + c + '">' + T('Máximo', 'Peak') + ' ' + E(String(b[mi][0]).slice(0, 9)) + '</text></g>'; }
      return { types: dtypes(sh), ty: ty, html: '<svg viewBox="0 0 ' + W0 + ' ' + H0 + '" class="dyn">' + H + '</svg>' + (n1 ? '<div class="dlg">' + lg + '</div>' : '') };
    }
    var rows = b.slice().sort(function (p, q) { return hnum(q[n0]) - hnum(p[n0]); }).slice(0, 10), mx2 = Math.max.apply(null, rows.map(function (x) { return Math.max(hnum(x[n0]), n1 ? hnum(x[n1]) : 0); })) || 1;
    if (ty === 'donut' || ty === 'dots') {
      var tot = rows.reduce(function (s, x) { return s + hnum(x[n0]); }, 0) || 1;
      if (ty === 'dots') { var cells = [], acc = 0; rows.forEach(function (x, i) { var k = Math.round((acc + hnum(x[n0])) / tot * 100) - Math.round(acc / tot * 100); acc += hnum(x[n0]); for (var j = 0; j < k; j++) cells.push(i); });
        return { types: dtypes(sh), ty: ty, html: '<div class="dwaf"><div class="dd">' + cells.map(function (ci, i) { return '<i style="background:' + DCOL[ci % 10] + ';--i:' + i + '" data-tt="' + E(rows[ci][0] + '|' + N(hnum(rows[ci][n0]) / tot * 100, 1) + ' %') + '"></i>'; }).join('') + '</div><div class="dlg v">' + rows.map(function (x, i) { return '<span><i style="background:' + DCOL[i % 10] + '"></i>' + E(x[0]) + ' <b>' + N(hnum(x[n0]) / tot * 100, 1) + ' %</b></span>'; }).join('') + '</div></div><p class="dnote">' + T('Cada punto es el 1 % del total.', 'Each dot is 1% of the total.') + '</p>' }; }
      var a = 0, ci2 = 2 * Math.PI * 70;
      H = rows.map(function (x, i) { var f = hnum(x[n0]) / tot, s = '<circle class="dn" r="70" cx="110" cy="110" stroke="' + DCOL[i % 10] + '" stroke-dasharray="' + (f * ci2).toFixed(1) + ' ' + ci2.toFixed(1) + '" stroke-dashoffset="' + (-a * ci2).toFixed(1) + '" style="--i:' + i + '" data-tt="' + E(x[0] + '|' + dfmt(hnum(x[n0]), sh) + ' · ' + N(f * 100, 1) + ' %') + '"/>'; a += f; return s; }).join('');
      return { types: dtypes(sh), ty: ty, html: '<div class="ddon"><svg viewBox="0 0 220 220" class="dyn don">' + H + '<text x="110" y="106" class="dc1">' + dfmt(tot, sh) + '</text><text x="110" y="126" class="dc2">' + E(sh.head[n0]) + '</text></svg><div class="dlg v">' + rows.map(function (x, i) { return '<span><i style="background:' + DCOL[i % 10] + '"></i>' + E(x[0]) + ' <b>' + N(hnum(x[n0]) / tot * 100, 1) + ' %</b></span>'; }).join('') + '</div></div>' };
    }
    if (ty === 'range') {
      return { types: dtypes(sh), ty: ty, html: '<div class="drng">' + rows.map(function (x, i) { var v0 = hnum(x[n0]), v1 = hnum(x[n1]), lo = Math.min(v0, v1) / mx2 * 100, hi = Math.max(v0, v1) / mx2 * 100; return '<div class="rr" style="--i:' + i + '" data-tt="' + E(x[0] + '|' + sh.head[n0] + ': ' + dfmt(v0, sh) + ' · ' + sh.head[n1] + ': ' + dfmt(v1, sh)) + '"><span>' + E(x[0]) + '</span><i><em style="left:' + lo + '%;width:' + (hi - lo) + '%"></em><b style="left:' + (v0 / mx2 * 100) + '%;background:' + c + '"></b><b style="left:' + (v1 / mx2 * 100) + '%;background:#1A82B9"></b></i><small>' + T('brecha ', 'gap ') + dfmt(Math.abs(v0 - v1), sh) + '</small></div>'; }).join('') + '</div><div class="dlg">' + lg + '</div>' };
    }
    return { types: dtypes(sh), ty: ty, html: '<div class="dbar">' + rows.map(function (x, i) { return '<div class="br" style="--i:' + i + '"><span>' + E(x[0]) + '</span><i>' + sh.num.map(function (ci, k) { return '<em style="--w:' + (hnum(x[ci]) / mx2 * 100).toFixed(1) + '%;background:' + cols[k] + '" data-tt="' + E(x[0] + ' · ' + sh.head[ci] + '|' + dfmt(hnum(x[ci]), sh)) + '"></em>'; }).join('') + '</i><b>' + dfmt(hnum(x[n0]), sh) + '</b></div>'; }).join('') + '</div>' + (n1 ? '<div class="dlg">' + lg + '</div>' : '') };
  }
  var IND2AN = null;
  function dynFor(code, c) {
    if (S.ovr && S.ovr[code] && S.ovr[code].serie) return null;
    if (!IND2AN) { IND2AN = {}; DEF.analyses.forEach(function (a) { var r = null; try { r = AN[a.id] && AN[a.id](); } catch (e) {} if (r && r.ind && !IND2AN[r.ind] && dshape(r)) IND2AN[r.ind] = a.id; }); }
    var id = IND2AN[code]; return id ? dynBlock(id, c) : null;
  }
  function dynBlock(id, c) {
    var d = dynSVG(id, c); if (!d) return null;
    return '<div class="dynw" data-an="' + id + '"><div class="dsw" role="group" aria-label="' + T('Tipo de gráfica', 'Chart type') + '">' + d.types.map(function (t) { return '<button type="button"' + (t[0] === d.ty ? ' class="on"' : '') + ' onclick="LV11.dynSet(\'' + id + '\',\'' + t[0] + '\',this)">' + t[1] + '</button>'; }).join('') + '</div><div class="dbody">' + d.html + '</div></div>';
  }
  (function () {
    var tip = null;
    D.addEventListener('pointermove', function (e) {
      var t = e.target.closest && e.target.closest('[data-tt]');
      if (!tip) { tip = D.createElement('div'); tip.id = 'lv31tip'; D.body.appendChild(tip); }
      if (!t) { tip.classList.remove('on'); return; }
      var p = t.dataset.tt.split('|'); tip.innerHTML = '<b>' + E(p[0]) + '</b><span>' + E(p[1] || '') + '</span>';
      tip.style.left = Math.min(innerWidth - 240, e.clientX + 14) + 'px'; tip.style.top = (e.clientY + 16) + 'px'; tip.classList.add('on');
    }, { passive: true });
  })();
  function vizCard(id, c) {
    var a = DEF.analyses.find(function (z) { return z.id === id; }), r = AN[id] && AN[id](); if (!a || !r) return '';
    var dyn = dynBlock(id, c), body = dyn || r.chart || (r.mapd ? choropleth(r.mapd.values, { color: c, fmt: r.mapd.fmt }) : r.extra || '');
    if (!dyn && r.chart && r.mapd) body += choropleth(r.mapd.values, { color: c, fmt: r.mapd.fmt });
    return '<section class="lv11card lv11viz" style="--c:' + c + ';--ci:' + ink(c) + '"><div class="lv11cardhead"><h3>' + E(analysisText(id, a).title) + '</h3></div><div class="lv11hero sm"><b data-count>' + E(r.head) + '</b><span>' + E(r.sub) + '</span></div>' + body + '<p class="lv11vizread">' + E(r.read[0]) + '</p><p class="lv11src">' + E(r.src) + '</p><div class="lv11row"><button class="lv11btn ghost" onclick="LV11.openAnalysis(\'' + id + '\')">' + T('Ampliar', 'Expand') + '</button>' + (r.rows ? '<button class="lv11btn ghost" onclick="LV11.csv(\'' + id + '\')">' + icon('download', 16) + ' CSV</button>' : '') + (r.ind ? '<button class="lv11btn ghost" onclick="LV11.openIndicator(\'' + r.ind + '\')">' + T('Ficha', 'Indicator') + '</button>' : '') + '</div></section>';
  }
  // Vista del micrositio dentro del panorama: parte superior (acervo) y parte inferior (catálogo, normas, observatorios).
  function panoTop(s) {
    var c = s.c, k = siteCounts(s);
    var h = '<div class="lv11sitehero pano' + (s.rainbow ? ' rainbow' : '') + '" style="--c:' + c + ';--ci:' + ink(c) + '"><span class="lv11sico big">' + sicon(s.ico, 34) + '</span><div><h1>' + E(sName(s)) + '</h1><p>' + E(T(s.d, s.de)) + '</p><div class="lv11meta light"><i>' + k.ind + ' ' + (k.ind === 1 ? T('indicador', 'indicator') : T('indicadores', 'indicators')) + '</i><i>' + k.norms + ' ' + (k.norms === 1 ? T('norma', 'law') : T('normas', 'laws')) + '</i><i>' + k.obs + ' ' + T('observatorios y fuentes', 'observatories & sources') + '</i></div><button class="lv11btn light" onclick="LV11.openSite(null)">' + icon('back', 16) + ' ' + T('Volver al panorama general', 'Back to overview') + '</button></div></div>';
    var kp = (s.kpis || []).map(function (code) { var f = IND[code], r = f && f(); var x = catalog().find(function (i) { return i.code === code; }); return r && x ? '<button class="lv11kpi tile" style="--c:' + c + '" onclick="LV11.openIndicator(\'' + code + '\')"><b data-count>' + E(r.kpis[0][0]) + '</b><span>' + E(plain(code, x.name, r.kpis[0][0]).t) + '</span><em>' + E(plain(code, x.name, r.kpis[0][0]).s || r.kpis[0][1]) + '</em></button>' : ''; }).join('');
    if (kp) h += '<div class="lv11kpis tiles">' + kp + '</div>';
    var ans = (s.analyses || []).filter(function (id) { return S.analyses.hidden.indexOf(id) < 0 && AN[id]; });
    h += '<h2 class="lv11h2">' + T('Las cifras en gráficas', 'Processed data collection') + '</h2>';
    if (ans.length) h += '<p class="lv11note">' + T('Gráficas construidas con los datos y boletines que ya tiene el Observatorio. Toca un punto o una barra para ver el valor.', 'Charts built from the data and bulletins the Observatory already holds.') + '</p><div class="lv11gallery">' + ans.map(function (id) { return vizCard(id, c); }).join('') + '</div>';
    else h += '<div class="lv11card lv11pending"><h3>' + T('Todavía no hay datos procesados para esta línea', 'No processed data for this line yet') + '</h3><p>' + T('Abajo verás qué indicadores están listos para calcularse y qué fuentes se necesitan.', 'Below you can see which indicators are ready and which sources are needed.') + '</p></div>';
    h += readiness(s);
    if (s.panorama) h += '<h2 class="lv11h2 lv11exph">' + T('Explorador interactivo de datos', 'Interactive data explorer') + '</h2><p class="lv11note">' + T('Cambia indicador, periodo, territorio, sexo y categoría; el mapa, la serie y la tabla se actualizan juntos.', 'Change indicator, period, territory, sex and category; map, series and table update together.') + '</p>';
    return h;
  }
  // En el panorama solo queda la información procesada; lo demás vive en su sección.
  function panoBottom(s) {
    var k = siteCounts(s), b = [];
    if (k.ind) b.push(['indicadores', 'chart', k.ind + ' ' + (k.ind === 1 ? T('indicador de la línea', 'indicator') : T('indicadores de la línea', 'indicators')), T('Indicadores', 'Indicators')]);
    if (k.norms || (s.info && s.info.length)) b.push(['normativa', 'scale', (k.norms ? k.norms + ' ' + (k.norms === 1 ? T('norma', 'law') : T('normas', 'laws')) : T('Marco e instancia', 'Framework')), T('Normativa y derechos', 'Laws and rights')]);
    if (k.obs) b.push(['red', 'network', k.obs + ' ' + T('observatorios y fuentes', 'observatories and sources'), T('Observatorios', 'Observatories')]);
    if (['violencias', 'casas-refugio', 'lgbtiq', 'comite-1257', 'comite-1719', 'comites-tecnico-juridicos', 'salud-dsr', 'rutas'].indexOf(s.id) > -1) b.push(['rutas', 'phone', T('Líneas y pasos de atención', 'Helplines and steps'), T('Rutas de atención', 'Support')]);
    if (!b.length) return '';
    return '<h2 class="lv11h2">' + T('Más sobre esta línea', 'More on this line') + '</h2><div class="lv11more">' + b.map(function (x) { return '<button style="--c:' + s.c + '" onclick="LV11.goWith(\'' + x[0] + '\',\'' + s.id + '\')"><span>' + icon(x[1], 20) + '</span><b>' + E(x[2]) + '</b><small>' + T('Ver en', 'See in') + ' ' + E(x[3]) + ' →</small></button>'; }).join('') + '</div>';
  }
  function applySite(page, id) {
    if (page === 'indicadores') { indFilter.site = id || ''; renderIndicators(); }
    if (page === 'normativa') { nf.site = id || ''; renderNorms(); }
    if (page === 'red') { of.site = (id === 'red-observatorios' ? '' : id) || ''; of.tab = 'obs'; renderObs(); }
  }
  function siteFilterChip(id, page) { var x = id && site(id); return x ? '<div class="lv11filterchip" style="--c:' + x.c + '"><span>' + sicon(x.ico, 16) + ' ' + T('Mostrando la línea', 'Showing line') + ': <b>' + E(sName(x)) + '</b></span><button onclick="LV11.goWith(\'' + page + '\',\'\')">' + T('Ver todo', 'Show all') + ' ×</button></div>' : ''; }
  var skipAuto = false;
  var panoSite = null, panoCache = { key: '', top: null, bottom: null };
  function injectPano() {
    var content = D.querySelector('#libresRoot .v9content'); if (!content) return;
    var s = panoSite && site(panoSite);
    content.classList.toggle('lv11noexp', !!(s && !s.panorama));
    if (!s) return;
    var key = s.id + (en() ? 'en' : 'es') + (S.updated || '');
    if (panoCache.key !== key) {
      panoCache.key = key;
      panoCache.top = D.createElement('div'); panoCache.top.className = 'lv11pano'; panoCache.top.setAttribute('data-no-translate', ''); panoCache.top.innerHTML = panoTop(s);
      panoCache.bottom = D.createElement('div'); panoCache.bottom.className = 'lv11panob'; panoCache.bottom.setAttribute('data-no-translate', ''); panoCache.bottom.innerHTML = panoBottom(s);
      animateIn(panoCache.top);
    }
    content.insertBefore(panoCache.top, content.firstChild);
    content.appendChild(panoCache.bottom);
  }
  var SITE_LINEA = { violencias: 'violencias', 'casas-refugio': 'refugio', cuidados: 'cuidados', autonomia: 'autonomia', 'salud-dsr': 'salud' };
  function openSiteInline(id) {
    var s = id && site(id); panoSite = s ? s.id : null;
    var dl = D.getElementById('lv11Dialog'); if (dl && dl.open) dl.close();
    if (s) { R.style.setProperty('--lv-accent', s.c); R.style.setProperty('--lv-accent-ink', ink(s.c)); } else { R.style.removeProperty('--lv-accent'); R.style.removeProperty('--lv-accent-ink'); }
    if (typeof W.go === 'function') W.go('libres');
    R.dataset.linea = s ? (SITE_LINEA[s.id] || 'all') : 'all';
    D.querySelectorAll('.lvLine').forEach(function (b) { b.classList.toggle('on', !!s && b.dataset.t === s.id); });
    if (s && s.panorama && src(s.panorama) && ST().source !== s.panorama && typeof W.v9Change === 'function') W.v9Change('source', s.panorama); else if (typeof W.v8Render === 'function') W.v8Render();
    try { history.replaceState(null, '', '#libres' + (s ? '/' + s.id : '')); } catch (e) {}
    setTimeout(function () { var t = D.querySelector(s ? '.lv11pano' : '#libresRoot .v9cards'); if (t) scrollTo({ top: t.getBoundingClientRect().top + scrollY - 140, behavior: 'smooth' }); }, 60);
  }
  function helpStrip() { return '<div class="lv11help"><div><b>' + T('¿Necesitas orientación?', 'Need guidance?') + '</b><span>' + T('Línea 155 · Emergencias 123 · Fiscalía 122', 'Line 155 · Emergencies 123 · Prosecutors 122') + '</span></div><button class="lv11btn light" onclick="go(\'rutas\')">' + T('Ver rutas de atención', 'See support pathways') + ' ' + icon('arrow', 16) + '</button></div>'; }

  function indTable(list) {
    return '<div class="lv11table"><table><thead><tr><th>' + T('Indicador', 'Indicator') + '</th><th>' + T('Línea temática', 'Thematic line') + '</th><th aria-label="' + T('Abrir', 'Open') + '"></th></tr></thead><tbody>' + list.map(function (x) {
      var s = site(indSite(x)) || {}; var has = !!IND[x.code];
      return '<tr tabindex="0" role="button" onclick="LV11.openIndicator(\'' + x.code + '\')" onkeydown="if(event.key===\'Enter\')LV11.openIndicator(\'' + x.code + '\')"><td><b>' + E(x.name) + '</b>' + (has ? ' <em class="lv11has">' + T('Con datos', 'Data') + '</em>' : '') + '</td><td><span class="lv11dot" style="--c:' + (s.c || '#999') + '"></span>' + E(x.theme) + '</td><td class="lv11arrow">' + icon('arrow', 16) + '</td></tr>';
    }).join('') + '</tbody></table></div>';
  }
  var indFilter = { q: '', site: '', data: false };
  /* v28: lenguaje sencillo para cada indicador con datos (título claro + frase que explica la cifra) */
  function pnum(v) { var m = /(-?[\d.]*\d(?:,\d+)?)/.exec(String(v)); return m ? parseFloat(m[1].replace(/\./g, '').replace(',', '.')) : null; }
  function about(x) { var r = Math.round(x); return (r - x > 0.05 ? T('casi ', 'almost ') : '') + r; }
  function of100(v) { var n = pnum(v); return n == null ? '' : about(n); }
  function of10(v) { var n = pnum(v); return n == null ? '' : about(n / 10); }
  function PLAIN() { return {
    'VBG-04': [T('Víctimas de violencia de pareja que son mujeres', 'Partner violence victims who are women'), function (v) { return T('De cada 10 personas lesionadas por su pareja, ' + of10(v) + ' son mujeres.', 'Out of 10 people injured by a partner, ' + of10(v) + ' are women.'); }],
    'VBG-01': [T('Mujeres examinadas por violencia sexual', 'Women examined for sexual violence'), function () { return T('Exámenes que hizo Medicina Legal a mujeres por posible violencia sexual.', 'Forensic exams of women for possible sexual violence.'); }],
    'AMP-V07': [T('Mujeres examinadas por violencia sexual', 'Women examined for sexual violence'), function () { return T('Exámenes que hizo Medicina Legal a mujeres por posible violencia sexual.', 'Forensic exams of women for possible sexual violence.'); }],
    'VBG-02': [T('Víctimas de violencia sexual que son mujeres', 'Sexual violence victims who are women'), function (v) { return T('De cada 10 personas examinadas por violencia sexual, ' + of10(v) + ' son mujeres.', 'Out of 10 people examined for sexual violence, ' + of10(v) + ' are women.'); }],
    'VBG-05': [T('Mujeres atendidas en salud por violencia', 'Women treated in health services for violence'), function () { return T('Casos de violencia contra mujeres que reportaron hospitales y centros de salud.', 'Cases of violence against women reported by health services.'); }],
    'AMP-V06': [T('Violencia contra mujeres reportada en salud', 'Violence against women reported by health services'), function (v) { return T('Por cada 100.000 mujeres se reportaron ' + of100(v) + ' casos.', 'For every 100,000 women, ' + of100(v) + ' cases were reported.'); }],
    'AMP-V01': [T('Muertes violentas de mujeres', 'Violent deaths of women'), function () { return T('Mujeres asesinadas registradas en el año. La cifra aún puede cambiar.', 'Women killed in the year. The figure may still change.'); }],
    'ECO-01': [T('Mujeres que trabajan o buscan trabajo', 'Women working or looking for work'), function (v) { return T('De cada 100 mujeres en edad de trabajar, ' + of100(v) + ' trabajan o buscan empleo.', 'Out of 100 working-age women, ' + of100(v) + ' work or look for work.'); }],
    'ECO-02': [T('Mujeres con empleo', 'Women in employment'), function (v) { return T('De cada 100 mujeres en edad de trabajar, ' + of100(v) + ' tienen empleo.', 'Out of 100 working-age women, ' + of100(v) + ' have a job.'); }],
    'ECO-03': [T('Mujeres que buscan empleo y no lo encuentran', 'Women looking for work without finding it'), function (v) { return T('De cada 100 mujeres que quieren trabajar, ' + of100(v) + ' no consiguen empleo.', 'Out of 100 women who want to work, ' + of100(v) + ' cannot find a job.'); }],
    'CUI-01': [T('Horas al día en el hogar y el cuidado', 'Daily hours of housework and care'), function () { return T('Tiempo que las mujeres dedican cada día a cocinar, limpiar y cuidar, sin pago.', 'Time women spend each day cooking, cleaning and caring, unpaid.'); }],
    'CUI-02': [T('Tiempo extra que cuidan las mujeres', 'Extra time women spend caring'), function () { return T('Es cuánto tiempo más que los hombres dedican las mujeres cada día a estas tareas.', 'How much more time than men women spend on these tasks each day.'); }],
    'CUI-04': [T('Mujeres que hacen trabajo del hogar', 'Women doing housework'), function (v) { return T('De cada 10 mujeres, ' + of10(v) + ' hacen trabajo doméstico o de cuidado sin pago.', 'Out of 10 women, ' + of10(v) + ' do unpaid domestic or care work.'); }],
    'DEM-01': [T('Mujeres en la población', 'Women in the population'), function (v) { return T('De cada 100 personas en Colombia, ' + of100(v) + ' son mujeres.', 'Out of 100 people in Colombia, ' + of100(v) + ' are women.'); }]
  }; }
  function plain(code, name, v) { var p = PLAIN()[code]; return p ? { t: p[0], s: p[1](v) } : { t: name, s: '' }; }
  /* v25: catálogo dinámico de indicadores en tarjetas agrupadas por línea temática */
  var indVal = {};
  /* v54 · valores y gráficas editables: la administración puede corregir la cifra principal, el texto
     y la serie de cualquier indicador, o cargar datos para uno que aún no tiene. */
  var IND0 = null;
  function parseSerie(txt) { return String(txt || '').split(/\n/).map(function (l) { var m = l.split(/[;\t|]/); if (m.length < 2) return null; var v = parseFloat(String(m[1]).replace(/\./g, '').replace(',', '.')); return isNaN(v) ? null : [m[0].trim(), v]; }).filter(Boolean); }
  function ovrChart(o) {
    var sr = parseSerie(o.serie); if (!sr.length) return '';
    if (o.tipo === 'linea') return lineChart({ labels: sr.map(function (r) { return r[0]; }), series: [{ name: o.label || '', color: WOMEN, values: sr.map(function (r) { return r[1]; }) }], title: o.code });
    return barsH(sr.map(function (r) { return { l: r[0], v: r[1], c: WOMEN }; }));
  }
  function applyOvr() {
    if (!IND0) { IND0 = {}; Object.keys(IND).forEach(function (k) { IND0[k] = IND[k]; }); }
    Object.keys(IND).forEach(function (k) { if (!IND0[k]) delete IND[k]; else IND[k] = IND0[k]; });
    Object.keys(S.ovr || {}).forEach(function (code) {
      var o = S.ovr[code]; if (!o || (!o.v && !o.serie)) return; o.code = code;
      var base = IND0[code];
      IND[code] = function () {
        var r = null; try { r = base ? base() : null; } catch (e) { r = null; }
        r = r ? JSON.parse(JSON.stringify(r)) : { kpis: [['—', '']], read: '', src: '' };
        if (o.v) r.kpis[0] = [o.v, o.label || (r.kpis[0] && r.kpis[0][1]) || ''];
        if (o.read) r.read = o.read;
        if (o.src) r.src = o.src;
        var ch = ovrChart(o); if (ch) { r.chart = ch; r.ovrChart = true; }
        r.edited = true; return r;
      };
    });
    indVal = {}; IND2AN = null;
  }
  function indKpi(code) {
    if (code in indVal) return indVal[code];
    var r = null; try { r = IND[code] ? IND[code]() : null; } catch (e) { r = null; }
    return (indVal[code] = r && r.kpis && r.kpis[0] ? { v: r.kpis[0][0], l: r.kpis[0][1] } : null);
  }
  function pctOf(v) { var m = /^(-?[\d.]*\d(?:,\d+)?)\s*%$/.exec(String(v).trim()); return m ? parseFloat(m[1].replace(/\./g, '').replace(',', '.')) : null; }
  function indCard(x, c, i) {
    var k = IND[x.code] ? indKpi(x.code) : null, pc = k ? pctOf(k.v) : null;
    return '<button type="button" class="lv25card' + (k ? ' has' : '') + (pc != null ? ' pc' : '') + '" style="--c:' + c + ';--i:' + (i || 0) + (pc != null ? ';--p:' + Math.max(0, Math.min(100, pc)) : '') + '" onclick="LV11.openIndicator(\'' + x.code + '\')">' +
      '<span class="lv25tag">' + (k ? T('Dato disponible', 'Data available') : T('En preparación', 'In preparation')) + '</span><b>' + E(k ? plain(x.code, x.name, k.v).t : x.name) + '</b>' +
      (k ? (pc != null ? '<span class="lv25ring" aria-hidden="true"></span>' : '') + '<span class="lv25val"><em>' + E(k.v) + '</em><small>' + E(plain(x.code, x.name, k.v).s || k.l) + '</small></span>' : '') +
      '<i class="lv25go">' + icon('arrow', 16) + '</i></button>';
  }
  function renderIndicators() {
    var sec = sectionEl('indicadores');
    var q = indFilter.q.toLowerCase();
    var list = published().filter(function (x) { return (!q || (x.code + ' ' + x.name + ' ' + x.theme).toLowerCase().indexOf(q) > -1) && (!indFilter.site || indSite(x) === indFilter.site) && (!indFilter.data || IND[x.code]); });
    var withData = published().filter(function (x) { return IND[x.code]; }).length;
    var used = sites(true).filter(function (s) { return published().some(function (x) { return indSite(x) === s.id; }); });
    var groups = used.map(function (s) { return { s: s, l: list.filter(function (x) { return indSite(x) === s.id; }) }; }).filter(function (g) { return g.l.length; });
    groups.forEach(function (g) { g.l.sort(function (a, b) { return (IND[b.code] ? 1 : 0) - (IND[a.code] ? 1 : 0); }); });
    sec.innerHTML = pageHead(T('Indicadores', 'Indicators'), T('Un indicador, una definición clara.', 'One indicator, one clear definition.'), T('Toca una tarjeta para ver su ficha y sus datos.', 'Tap a card to see its specification and data.')) +
      '<div class="lv25bar"><div class="lv25nums"><span><b data-count>' + published().length + '</b>' + T('indicadores', 'indicators') + '</span><span><b data-count>' + withData + '</b>' + T('con datos', 'with data') + '</span><span><b data-count>' + used.length + '</b>' + T('líneas', 'lines') + '</span></div>' +
      '<label class="lv11search lv25q">' + icon('search', 18) + '<input value="' + E(indFilter.q) + '" placeholder="' + T('Buscar indicador…', 'Search indicator…') + '" oninput="LV11.indQ(this.value)"></label>' +
      '<button type="button" class="lv25sw' + (indFilter.data ? ' on' : '') + '" aria-pressed="' + !!indFilter.data + '" onclick="LV11.indData(' + !indFilter.data + ')"><i></i>' + T('Solo con datos', 'Only with data') + '</button></div>' +
      (function () { var fe = published().filter(function (x) { return IND[x.code] && indKpi(x.code); }); if (!fe.length || indFilter.q || indFilter.site) return ''; return '<section class="lv25feat" aria-label="' + T('Indicadores destacados', 'Featured indicators') + '"><div class="lv25fh"><b>' + T('Lo que ya muestran los datos', 'What the data already shows') + '</b><span><button type="button" class="lv25nav" aria-label="' + T('Anterior', 'Previous') + '" onclick="this.closest(\'.lv25feat\').querySelector(\'.lv25track\').scrollBy({left:-340,behavior:\'smooth\'})">‹</button><button type="button" class="lv25nav" aria-label="' + T('Siguiente', 'Next') + '" onclick="this.closest(\'.lv25feat\').querySelector(\'.lv25track\').scrollBy({left:340,behavior:\'smooth\'})">›</button></span></div><div class="lv25track">' + fe.map(function (x) { var st = site(indSite(x)) || { c: '#8E36CF' }, k = indKpi(x.code); return '<button type="button" class="lv25fc" style="--c:' + st.c + '" onclick="LV11.openIndicator(\'' + x.code + '\')"><small>' + E(sName(st)) + '</small><em>' + E(k.v) + '</em><b>' + E(plain(x.code, x.name, k.v).t) + '</b><span>' + E(plain(x.code, x.name, k.v).s || k.l) + '</span></button>'; }).join('') + '</div></section>'; })() +
      '<div class="lv25chips" role="group" aria-label="' + T('Línea temática', 'Thematic line') + '"><button type="button"' + (!indFilter.site ? ' class="on"' : '') + ' onclick="LV11.indSite(\'\')">' + T('Todas', 'All') + '</button>' +
      used.map(function (s) { var n = published().filter(function (x) { return indSite(x) === s.id; }).length; return '<button type="button" style="--c:' + s.c + '"' + (indFilter.site === s.id ? ' class="on"' : '') + ' onclick="LV11.indSite(\'' + (indFilter.site === s.id ? '' : s.id) + '\')">' + sicon(s.ico, 16) + E(sName(s)) + '<small>' + n + '</small></button>'; }).join('') + '</div>' +
      (function () { var wdOf = function (g) { return g.l.some(function (x) { return IND[x.code] && indKpi(x.code); }); }, full = groups.filter(wdOf), empty = groups.filter(function (g) { return !wdOf(g); }); groups = full; groups.empty = empty; return ''; })() +
      (groups.length ? groups.map(function (g) { return '<section class="lv25grp" style="--c:' + g.s.c + '"><h2><span>' + sicon(g.s.ico, 20) + '</span>' + E(sName(g.s)) + '<small>' + g.l.length + '</small></h2>' + (function () { var seen = {}, wd = g.l.filter(function (x) { if (!IND[x.code] || !indKpi(x.code)) return false; var k = plain(x.code, x.name, indKpi(x.code).v).t + '|' + indKpi(x.code).v; if (seen[k]) return false; seen[k] = 1; return true; }), pend = g.l.filter(function (x) { return !(IND[x.code] && indKpi(x.code)); });
        return (wd.length ? '<div class="lv25grid">' + wd.map(function (x, i) { return indCard(x, g.s.c, i); }).join('') + '</div>' : '') +
          (pend.length ? '<details class="lv30pend"><summary>' + T('En preparación', 'In preparation') + ' <small>' + pend.length + '</small></summary><ul>' + pend.map(function (x) { return '<li><button type="button" onclick="LV11.openIndicator(\'' + x.code + '\')">' + E(x.name) + '</button></li>'; }).join('') + '</ul></details>' : ''); })() + '</section>'; }).join('') : '<p class="lv11note">' + T('No hay indicadores con ese filtro.', 'No indicators match.') + '</p>') +
      (groups.empty && groups.empty.length ? '<section class="lv25grp lv40prep"><h2><span>' + icon('clock', 20) + '</span>' + T('Indicadores en preparación', 'Indicators in preparation') + '<small>' + groups.empty.reduce(function (n, g) { return n + g.l.length; }, 0) + '</small></h2><p class="lv40lead">' + T('Ya tienen ficha y fuente definida; sus datos se publicarán cuando se procesen.', 'They have a specification and source; data will be published once processed.') + '</p><div class="lv40pg">' + groups.empty.map(function (g) { return '<details><summary><span class="ic" style="--c:' + g.s.c + '">' + sicon(g.s.ico, 16) + '</span>' + E(sName(g.s)) + '<small>' + g.l.length + '</small></summary><ul>' + g.l.map(function (x) { return '<li><button type="button" onclick="LV11.openIndicator(\'' + x.code + '\')">' + E(x.name) + '</button></li>'; }).join('') + '</ul></details>'; }).join('') + '</div></section>' : '');
    countUp(sec);
  }

  function analysisCard(id) {
    var a = DEF.analyses.find(function (z) { return z.id === id; }), r = AN[id] && AN[id](); if (!a || !r) return '';
    var s = site(a.site) || {}, tx = analysisText(id, a);
    return '<button class="lv11an" style="--c:' + (s.c || '#9E2C5A') + ';--ci:' + ink(s.c || '#9E2C5A') + '" onclick="LV11.openAnalysis(\'' + id + '\')"><span class="lv11chip">' + icon(s.ico || 'chart', 14) + ' ' + E(sName(s)) + '</span><b class="lv11anh" data-count>' + E(r.head) + '</b><small>' + E(r.sub) + '</small><strong>' + E(tx.title) + '</strong><span class="lv11src">' + E(r.src) + '</span><span class="lv11go">' + icon('arrow', 18) + '</span></button>';
  }
  var anFilter = '';
  /* v29: Datos y análisis por categorías, con una tabla prioritaria arriba */
  var ANCATS = [
    ['vio', 'Violencias', 'Violence', '#D33B78', ['pareja-serie', 'nofatal-mujeres', 'sexual-sexo', 'fatal-manera', 'ins-notificacion']],
    ['eco', 'Trabajo e ingresos', 'Work and income', '#22A37A', ['geih-td', 'geih-brechas']],
    ['cui', 'Cuidados y tiempo', 'Care and time', '#E0A800', ['enut-horas', 'enut-participacion', 'enut-departamentos']],
    ['pob', 'Población y territorio', 'Population and territory', '#A05CC8', ['poblacion-mujeres', 'obs-red']]
  ];
  var anCat = 'vio', anSort = { c: 1, d: -1 }, anAll = false, anTab = null, anView = 'tabla', anSel = null;
  // DANE · GEIH departamental 2025 (Boletín técnico, gráfico 25): tasa de desocupación por sexo, 23 departamentos
  var GEIHD = [['Chocó', 20.4, 9.0], ['Córdoba', 17.2, 5.9], ['Caquetá', 17.2, 6.8], ['Sucre', 16.6, 6.7], ['Bolívar', 15.1, 6.0], ['Magdalena', 14.9, 6.3], ['Cesar', 14.4, 7.1], ['Cauca', 10.5, 4.1], ['La Guajira', 15.8, 9.7], ['Tolima', 14.4, 8.4], ['Atlántico', 11.5, 6.3], ['Nariño', 8.7, 3.7], ['Norte de Santander', 14.2, 9.5], ['Cundinamarca', 12.1, 7.7], ['Huila', 9.7, 5.4], ['Valle del Cauca', 11.8, 7.6], ['Antioquia', 9.6, 6.0], ['Santander', 12.1, 8.7], ['Caldas', 11.1, 7.8], ['Risaralda', 9.6, 6.6], ['Meta', 10.2, 7.8], ['Quindío', 11.2, 9.7], ['Boyacá', 9.8, 9.0]];
  function priTable(cat) {
    if (cat === 'eco') return { title: T('Desempleo de mujeres y hombres por departamento', 'Unemployment of women and men by department'), sub: T('Tasa de desocupación 2025 · DANE, GEIH departamental (23 departamentos)', 'Unemployment rate 2025 · DANE GEIH (23 departments)'), head: [T('Departamento', 'Department'), T('Mujeres %', 'Women %'), T('Hombres %', 'Men %'), T('Brecha (p.p.)', 'Gap (pp)')], rows: GEIHD.map(function (r) { return [r[0], r[1], r[2], Math.round((r[1] - r[2]) * 10) / 10]; }) };
    var t = null, TT = W.LV23_TERR;
    if (cat === 'vio' && TT && TT.K) {
      var K = TT.K, keys = [['PAR', T('Violencia de pareja', 'Partner violence')], ['SEX', T('Violencia sexual', 'Sexual violence')], ['NNA', T('Violencia contra niñas', 'Violence against girls')], ['HOM', T('Homicidios', 'Homicides')], ['SUI', T('Suicidios', 'Suicides')]];
      var deps = {}; keys.forEach(function (k) { Object.keys((K[k[0]] || {}).dep || {}).forEach(function (d) { deps[d] = 1; }); });
      t = { title: T('Violencias contra mujeres por departamento', 'Violence against women by department'), sub: T('Mujeres · 2025, cifras preliminares · Medicina Legal', 'Women · 2025, preliminary · Forensic institute'), head: [T('Departamento', 'Department')].concat(keys.map(function (k) { return k[1]; })),
        rows: Object.keys(deps).map(function (d) { return [deptName(d) || d].concat(keys.map(function (k) { var a = (K[k[0]].dep || {})[d]; return a ? a[0] : 0; })); }) };
    } else {
      var src = { eco: 'geih-brechas', cui: 'enut-departamentos', pob: 'poblacion-mujeres' }[cat], a = src && DEF.analyses.find(function (z) { return z.id === src; }), r = src && AN[src] && AN[src]();
      if (r && r.rows) { t = { title: T(a.es, a.en || a.es), sub: r.src || '', head: r.rows[0], rows: r.rows.slice(1) };
        if (cat === 'cui') { t.head = t.head.concat([T('Brecha (p.p.)', 'Gap (pp)')]); t.rows = t.rows.map(function (x) { return x.concat([Math.round((x[1] - x[2]) * 10) / 10]); }); } }
    }
    return t;
  }
  function tableHTML(t, c) {
    if (!t) return '';
    var rows = t.rows.slice().sort(function (a, b) { var x = a[anSort.c], y = b[anSort.c]; x = x < 0 ? 2 : x; y = y < 0 ? 2 : y; return typeof x === 'number' && typeof y === 'number' ? (x - y) * anSort.d : String(x).localeCompare(String(y)) * anSort.d; });
    anTab = { head: t.head, rows: rows, title: t.title };
    var cmax = t.head.map(function (h, i) { return Math.max.apply(null, rows.map(function (r) { return typeof r[i] === 'number' ? r[i] : 0; }).concat([1])); });
    var show = anAll ? rows : rows.slice(0, 10), col = anSort.c, mx = Math.max.apply(null, rows.map(function (r) { return typeof r[col] === 'number' ? r[col] : 0; }).concat([1]));
    var fmt = function (v) { return typeof v === 'number' ? (v < 0 ? '1–4' : v.toLocaleString(en() ? 'en-US' : 'es-CO')) : E(v); };
    return '<section class="lv29tbl" style="--c:' + c + '"><div class="h"><div><b>' + E(t.title) + '</b><small>' + E(t.sub) + '</small></div><span class="vw"><span class="seg">' + [['tabla', T('Tabla', 'Table')], ['calor', T('Mapa de calor', 'Heatmap')], ['barras', T('Barras', 'Bars')]].map(function (v) { return '<button type="button"' + (anView === v[0] ? ' class="on"' : '') + ' onclick="LV11.anViewSet(\'' + v[0] + '\')">' + v[1] + '</button>'; }).join('') + '</span><button type="button" onclick="LV11.anCsv()">' + icon('download', 15) + ' CSV</button></span></div>' +
      (anSel ? (function () { var r = rows.filter(function (x) { return x[0] === anSel; })[0]; if (!r) return ''; return '<div class="sum"><b>' + E(r[0]) + '</b>' + t.head.slice(1).map(function (h, j) { var i = j + 1, ord = rows.slice().sort(function (a, b) { return (b[i] || 0) - (a[i] || 0); }), p = ord.indexOf(r) + 1; return '<span><small>' + E(h) + '</small><em>' + fmt(r[i]) + '</em><i>' + T('puesto ', 'rank ') + p + '/' + rows.length + '</i></span>'; }).join('') + '<button type="button" onclick="LV11.anPick(\'\')" aria-label="' + T('Cerrar', 'Close') + '">×</button></div>'; })() : '<p class="hint">' + T('Toca una fila para ver su resumen · toca un título de columna para ordenar.', 'Tap a row for its summary · tap a column header to sort.') + '</p>') +
      (anView === 'barras' ? '<div class="bv">' + rows.slice(0, anAll ? rows.length : 15).map(function (r, ri) { var v = r[col]; return '<button type="button" class="' + (anSel === r[0] ? 'sel' : '') + '" style="--i:' + ri + '" onclick="LV11.anPick(\'' + E(String(r[0]).replace(/'/g, '')) + '\')"><span>' + E(r[0]) + '</span><i><em style="width:' + (typeof v === 'number' && v > 0 ? Math.max(2, v / mx * 100) : 0) + '%"></em></i><b>' + fmt(v) + '</b></button>'; }).join('') + '</div><div class="bvcols">' + t.head.slice(1).map(function (h, j) { return '<button type="button"' + (col === j + 1 ? ' class="on"' : '') + ' onclick="LV11.anSortBy(' + (j + 1) + ')">' + E(h) + '</button>'; }).join('') + '</div>' : '') +
      (anView === 'calor' ? heatMap(t, rows, col) : '') + (anView === 'barras' ? '<div class="w" hidden>' : '<div class="w">') + '<table><thead><tr>' + t.head.map(function (h, i) { return '<th' + (i ? ' class="n"' : '') + '><button type="button" onclick="LV11.anSortBy(' + i + ')"' + (i === col ? ' class="on"' : '') + '>' + E(h) + (i === col ? (anSort.d < 0 ? ' ↓' : ' ↑') : '') + '</button></th>'; }).join('') + '</tr></thead><tbody>' +
      show.map(function (r, ri) { return '<tr style="--i:' + ri + '"' + (anSel === r[0] ? ' class="sel"' : '') + ' onclick="LV11.anPick(\'' + E(String(r[0]).replace(/'/g, '')) + '\')">' + r.map(function (v, i) { var cm = cmax[i] || 1, a = typeof v === 'number' && v > 0 ? v / cm : 0; return i === 0 ? '<td><span class="rk">' + (ri + 1) + '</span>' + E(v) + '</td>' : '<td class="n' + (i === col ? ' on' : '') + '"' + (anView === 'calor' ? ' style="background:color-mix(in srgb,var(--c) ' + Math.round(6 + a * 70) + '%,#fff);color:' + (a > .55 ? '#fff' : 'inherit') + '"' : '') + '>' + (anView === 'tabla' && i === col && typeof v === 'number' && v > 0 ? '<i style="width:' + Math.max(3, v / mx * 100) + '%"></i>' : '') + '<span>' + fmt(v) + '</span></td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' +
      (rows.length > 10 ? '<button type="button" class="more" onclick="LV11.anAllT()">' + (anAll ? T('Ver menos', 'Show less') : T('Ver las ' + rows.length + ' filas', 'Show all ' + rows.length + ' rows')) + '</button>' : '') + '</section>';
  }
  function nrm(x) { return String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, ''); }
  function heatMap(t, rows, col) {
    var G = W.LV22_GEO; if (!G || !G.dep) return '';
    var byName = {}; Object.keys(G.dep).forEach(function (c) { byName[nrm(deptName(c))] = c; }); byName[nrm('Bogotá')] = '11'; byName[nrm('San Andrés')] = '88';
    var val = {}, hit = 0; rows.forEach(function (r) { var c = byName[nrm(r[0])] || byName[nrm(String(r[0]).split(',')[0])]; if (c && typeof r[col] === 'number') { val[c] = r; hit++; } });
    if (hit < 10) return '';
    var vs = Object.keys(val).map(function (c) { return Math.max(0, val[c][col]); }), mx = Math.max.apply(null, vs.concat([1])), mn = Math.min.apply(null, vs);
    var fmt = function (v) { return typeof v === 'number' ? (v < 0 ? '1–4' : v.toLocaleString(en() ? 'en-US' : 'es-CO')) : v; };
    var sel = anSel && rows.filter(function (r) { return r[0] === anSel; })[0];
    return '<div class="hm"><div class="hmm"><svg viewBox="20 10 380 470" role="img" aria-label="' + T('Mapa de calor por departamento', 'Heat map by department') + '">' + Object.keys(G.dep).map(function (c) { var r = val[c], v = r ? Math.max(0, r[col]) : null, a = v == null ? 0 : (v - mn) / ((mx - mn) || 1); return '<path d="' + G.dep[c] + '" style="fill:' + (v == null ? '#f1ecf5' : 'color-mix(in srgb,var(--c) ' + Math.round(10 + a * 85) + '%,#fff)') + '"' + (r ? ' data-tt="' + E(r[0] + '|' + t.head[col] + ': ' + fmt(r[col])) + '" onclick="LV11.anPick(\'' + E(String(r[0]).replace(/\'/g, '')) + '\')"' : '') + (sel && sel === r ? ' class="on"' : '') + '/>'; }).join('') + '</svg></div>' +
      '<div class="hml"><b>' + E(t.head[col]) + '</b><small>' + T('Se actualiza al instante cuando cambias la columna o eliges un departamento.', 'Updates instantly when you change column or pick a department.') + '</small><div class="sc"><i></i><span>' + fmt(mn) + '</span><span>' + fmt(mx) + '</span></div><div class="cols">' + t.head.slice(1).map(function (h, j) { return '<button type="button"' + (col === j + 1 ? ' class="on"' : '') + ' onclick="LV11.anSortBy(' + (j + 1) + ')">' + E(h) + '</button>'; }).join('') + '</div><ol>' + rows.slice(0, 5).map(function (r) { return '<li>' + E(r[0]) + ' <b>' + fmt(r[col]) + '</b></li>'; }).join('') + '</ol></div></div>';
  }
  function renderAnalyses() {
    var sec = sectionEl('publicaciones');
    if (anFilter) { var fc = ANCATS.filter(function (c) { return c[4].some(function (id) { var a = DEF.analyses.find(function (z) { return z.id === id; }); return a && a.site === anFilter; }); })[0]; if (fc) anCat = fc[0]; anFilter = ''; }
    var hidden = S.analyses.hidden, cat = ANCATS.filter(function (c) { return c[0] === anCat; })[0] || ANCATS[0];
    var ids = cat[4].filter(function (id) { return hidden.indexOf(id) < 0 && DEF.analyses.some(function (a) { return a.id === id; }); });
    sec.innerHTML = pageHead(T('Datos y análisis', 'Data and analysis'), T('Lo que dicen los datos que ya tenemos.', 'What the data we have says.'), T('Elige una categoría. Arriba verás la tabla más consultada; abajo, las gráficas.', 'Choose a category. The key table is on top; charts below.')) +
      '<div class="lv29cats" role="tablist">' + ANCATS.map(function (c) { var n = c[4].filter(function (id) { return hidden.indexOf(id) < 0; }).length; return '<button type="button" role="tab" aria-selected="' + (c[0] === cat[0]) + '" style="--c:' + c[3] + '"' + (c[0] === cat[0] ? ' class="on"' : '') + ' onclick="LV11.anCat(\'' + c[0] + '\')"><b>' + E(T(c[1], c[2])) + '</b><small>' + n + ' ' + T('análisis', 'analyses') + '</small></button>'; }).join('') + '</div>' +
      tableHTML(priTable(cat[0]), cat[3]) +
      '<h2 class="lv11h2">' + T('Gráficas', 'Charts') + '</h2><div class="lv11grid3">' + ids.map(analysisCard).join('') + '</div>' +
      '<p class="lv11note">' + T('Los registros no son personas únicas. Las celdas con 1 a 4 casos se protegen.', 'Records are not unique people. Cells with 1–4 cases are protected.') + '</p>';
    countUp(sec);
  }


  /* ---------------- normativa ---------------- */
  var nf = { q: '', tipo: '', right: '', site: '' };
  function normCard(n) { return '<button class="lv11norm" onclick="LV11.openNorm(\'' + n.id + '\')"><span class="lv11year">' + E(n.y) + '</span><em>' + E(n.tipo) + '</em><b>' + E(n.n) + '</b><small>' + E(T(n.d, n.de)) + '</small><span class="lv11dots">' + (n.sites || []).slice(0, 6).map(function (s) { var x = site(s); return x ? '<i style="background:' + x.c + '" title="' + E(sName(x)) + '"></i>' : ''; }).join('') + '</span></button>'; }
  var TIPOC = { 'Constitución': '#3c3c3b', 'Tratado internacional': '#1A82B9', 'Ley': '#9E2C5A', 'Decreto': '#22A37A', 'Sentencia': '#D33B78', 'Auto': '#9E2C5A', 'Resolución': '#8A6400', 'Política pública': '#5B5BD6' };
  /* v29: normas en cajas desplegables por grupo (líneas temáticas, comités, redes, rutas) */
  /* v30: normativa por tipo: se elige el tipo y de ahí se desprenden las normas */
  var TIPOD = { 'Constitución': ['La base de todos los derechos', 'The foundation of all rights'], 'Tratado internacional': ['Compromisos de Colombia ante el mundo', 'Colombia\'s international commitments'], 'Ley': ['Normas aprobadas por el Congreso', 'Acts passed by Congress'], 'Decreto': ['Cómo el Gobierno aplica las leyes', 'How the Government applies laws'], 'Sentencia': ['Decisiones de la Corte Constitucional', 'Constitutional Court decisions'], 'Auto': ['Órdenes de seguimiento de la Corte', 'Court follow-up orders'], 'Resolución': ['Reglas de entidades del Estado', 'Rules issued by agencies'], 'Política pública': ['Planes del Estado para las mujeres', 'Government plans for women'] };
  var TIPOI = { 'Constitución': 'book', 'Tratado internacional': 'network', 'Ley': 'scale', 'Decreto': 'doc', 'Sentencia': 'gavel', 'Auto': 'gavel', 'Resolución': 'doc', 'Política pública': 'people' };
  function typeTiles(all) {
    var cnt = {}; all.forEach(function (n) { cnt[n.tipo] = (cnt[n.tipo] || 0) + 1; });
    var ks = Object.keys(TIPOC).filter(function (k) { return cnt[k]; });
    return '<h2 class="lv11h2">' + T('Elige el tipo de norma', 'Choose the type of law') + '</h2><div class="lv30types"><button type="button" class="' + (!nf.tipo ? 'on' : '') + '" style="--c:#6E24A8" onclick="LV11.nf(\'tipo\',\'\')"><span class="ic">' + icon('spark', 22) + '</span><b>' + T('Todas', 'All') + '</b><small>' + T('Ver todas las normas', 'See all laws') + '</small><em>' + all.length + '</em></button>' +
      ks.map(function (k) { return '<button type="button" class="' + (nf.tipo === k ? 'on' : '') + '" style="--c:' + TIPOC[k] + '" onclick="LV11.nf(\'tipo\',\'' + (nf.tipo === k ? '' : k) + '\')"><span class="ic">' + icon(TIPOI[k] || 'doc', 22) + '</span><b>' + E(({ 'Constitución': T('Constitución', 'Constitution'), 'Tratado internacional': T('Tratados internacionales', 'International treaties'), 'Ley': T('Leyes', 'Laws'), 'Decreto': T('Decretos', 'Decrees'), 'Sentencia': T('Sentencias', 'Rulings'), 'Auto': T('Autos', 'Court orders'), 'Resolución': T('Resoluciones', 'Resolutions'), 'Política pública': T('Políticas públicas', 'Public policies') })[k] || k) + '</b><small>' + E(T((TIPOD[k] || ['', ''])[0], (TIPOD[k] || ['', ''])[1])) + '</small><em>' + cnt[k] + '</em></button>'; }).join('') + '</div>';
  }
  var normOpen = null;
  function normAcc(list) {
    var ks = Object.keys(TIPOC).filter(function (k) { return list.some(function (n) { return n.tipo === k; }); }), filt = !!(nf.q || nf.right || nf.site);
    if (!ks.length) return '<p class="lv11note">' + T('No hay normas con ese filtro.', 'No laws match.') + '</p>';
    return '<div class="lv31acc">' + ks.map(function (k, i) { var l = list.filter(function (n) { return n.tipo === k; }), open = filt || normOpen === k;
      return '<details data-k="' + E(k) + '" style="--c:' + TIPOC[k] + '"' + (open ? ' open' : '') + ' ontoggle="LV11.normTog(this)"><summary><span class="ic">' + icon(TIPOI[k] || 'doc', 22) + '</span><span class="tx"><b>' + E(({ 'Constitución': T('Constitución', 'Constitution'), 'Tratado internacional': T('Tratados internacionales', 'International treaties'), 'Ley': T('Leyes', 'Laws'), 'Decreto': T('Decretos', 'Decrees'), 'Sentencia': T('Sentencias', 'Rulings'), 'Auto': T('Autos', 'Court orders'), 'Resolución': T('Resoluciones', 'Resolutions'), 'Política pública': T('Políticas públicas', 'Public policies') })[k] || k) + '</b><small>' + E(T((TIPOD[k] || ['', ''])[0], (TIPOD[k] || ['', ''])[1])) + '</small></span><em>' + l.length + '</em><i class="pl" aria-hidden="true"></i></summary>' +
        '<ol>' + l.map(function (n) { return '<li><button type="button" onclick="LV11.openNorm(\'' + n.id + '\')"><span class="y">' + E(n.y) + '</span><span class="t"><b>' + E(n.n) + '</b><small>' + E(T(n.d, n.de)) + '</small></span><span class="go">' + icon('arrow', 16) + '</span></button></li>'; }).join('') + '</ol></details>'; }).join('') + '</div>';
  }
  function normList(list) {
    return '<div class="lv30nlist" id="lv11normlist">' + (list.length ? list.map(normCard).join('') : '<p class="lv11note">' + T('No hay normas con ese filtro.', 'No laws match.') + '</p>') + '</div>';
  }
  function normGroups(list, openAll) {
    var G = W.LV23_GROUPS || [['todas', 'Todas', 'All', sites().map(function (s) { return s.id; })]], used = {};
    var boxes = G.map(function (g, gi) { var l = list.filter(function (n) { return (n.sites || []).some(function (id) { return g[3].indexOf(id) > -1; }); }); l.forEach(function (n) { used[n.id] = 1; }); return [g, l, gi]; });
    var rest = list.filter(function (n) { return !used[n.id]; }); if (rest.length) boxes.push([['otras', 'Otras normas generales', 'Other general laws', []], rest, 9]);
    return '<div class="lv26acc" id="lv11normlist">' + boxes.filter(function (b) { return b[1].length; }).map(function (b) {
      var g = b[0], tipos = {}; b[1].forEach(function (n) { tipos[n.tipo] = (tipos[n.tipo] || 0) + 1; });
      return '<details' + (openAll || b[2] === 0 ? ' open' : '') + '><summary><span class="t">' + E(en() ? g[2] : g[1]) + '</span><span class="m">' + b[1].length + ' ' + T('normas', 'laws') + ' · ' + Object.keys(tipos).map(function (k) { return tipos[k] + ' ' + k.toLowerCase(); }).join(', ') + '</span><i aria-hidden="true">+</i></summary><div class="lv11grid3">' + b[1].map(normCard).join('') + '</div></details>';
    }).join('') + '</div>';
  }
  function renderNorms(target) {
    var sec = target || sectionEl('normativa');
    var list = S.norms.filter(function (n) { var q = nf.q.toLowerCase(); return n.pub && (!q || (n.n + ' ' + n.d).toLowerCase().indexOf(q) > -1) && (!nf.tipo || n.tipo === nf.tipo) && (!nf.right || (n.rights || []).indexOf(nf.right) > -1) && (!nf.site || (n.sites || []).indexOf(nf.site) > -1); }).sort(function (a, b) { return b.y - a.y; });
    var all = S.norms.filter(function (n) { return n.pub; }), y0 = Math.min.apply(null, all.map(function (n) { return n.y; })), y1 = Math.max.apply(null, all.map(function (n) { return n.y; }));
    var tl = '<div class="lv11timeline" aria-label="' + T('Línea de tiempo normativa', 'Legal timeline') + '"><div class="lv11tlbar"></div>' + all.map(function (n, i) { var pct = ((n.y - y0) / (y1 - y0 || 1) * 100); var stack = all.filter(function (m, j) { return j < i && m.y === n.y; }).length; return '<button class="lv11tldot' + (list.indexOf(n) < 0 ? ' off' : '') + '" style="left:' + pct + '%;bottom:' + (26 + stack * 24) + 'px;background:' + (TIPOC[n.tipo] || '#9E2C5A') + '" data-tip="' + E('<b>' + n.n + '</b><br>' + n.tipo) + '" onclick="LV11.openNorm(\'' + n.id + '\')" aria-label="' + E(n.n) + '"></button>'; }).join('') + [y0, 1991, 2000, 2008, 2015, y1].filter(function (v, i, a) { return a.indexOf(v) === i; }).map(function (y) { return '<span class="lv11tly" style="left:' + ((y - y0) / (y1 - y0 || 1) * 100) + '%">' + y + '</span>'; }).join('') + '</div><div class="lvlegend">' + Object.keys(TIPOC).map(function (k) { return '<span><i style="background:' + TIPOC[k] + '"></i>' + E(k) + '</span>'; }).join('') + '</div>';
    sec.innerHTML = (target ? '' : pageHead(T('Normativa y derechos', 'Laws and rights'), T('Los derechos de las mujeres, en la ley.', 'Women’s rights, in law.'), T('Constitución, tratados, leyes, decretos, sentencias y políticas que reconocen y protegen los derechos de las mujeres en todas sus diversidades.', 'Constitution, treaties, laws, decrees, rulings and policies protecting women’s rights in all their diversity.'))) +
      '<h2 class="lv11h2">' + T('Normas por tipo', 'Laws by type') + '</h2><p class="lv31lead">' + T('Toca un tipo para ver sus normas. Toca una norma para ver su ficha.', 'Tap a type to see its laws. Tap a law to see its details.') + '</p>' +
      '<div class="lv11tools"><label class="lv11search">' + icon('search', 18) + '<input value="' + E(nf.q) + '" placeholder="' + T('Buscar ley, número o tema…', 'Search law, number or topic…') + '" oninput="LV11.nf(\'q\',this.value,1)"></label><select onchange="LV11.nf(\'tipo\',this.value)"><option value="">' + T('Todos los tipos', 'All types') + '</option>' + Object.keys(TIPOC).map(function (k) { return '<option' + (nf.tipo === k ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select><select onchange="LV11.nf(\'site\',this.value)"><option value="">' + T('Todos los micrositios', 'All microsites') + '</option>' + sites().map(function (s) { return '<option value="' + s.id + '"' + (nf.site === s.id ? ' selected' : '') + '>' + E(sName(s)) + '</option>'; }).join('') + '</select></div><p class="lv11count">' + list.length + ' ' + T('normas', 'laws') + (nf.right ? ' · ' + E(T(DEF.rights.find(function (r) { return r.id === nf.right; }).es, DEF.rights.find(function (r) { return r.id === nf.right; }).en)) : '') + '</p>' +
      normAcc(list) + '<p class="lv11note">' + T('Base inicial verificada para consulta. Antes de la publicación oficial, cada ficha debe confirmar vigencia, modificaciones y responsable de actualización.', 'Initial base for consultation; confirm validity before official publication.') + '</p>' +
      '<h2 class="lv11h2">' + T('Línea de tiempo', 'Timeline') + '</h2>' + tl +
      '<h2 class="lv11h2">' + T('Derechos de las mujeres', 'Women’s rights') + '</h2><div class="lv11rights">' + DEF.rights.map(function (r, i) { var cnt = all.filter(function (n) { return (n.rights || []).indexOf(r.id) > -1; }).length; return '<button class="lv11right' + (nf.right === r.id ? ' on' : '') + '" style="--c:' + ['#D33B78', '#9E2C5A', '#5B5BD6', '#22A37A', '#17A58C', '#9E2C5A', '#B243EA', '#3A86C8'][i] + '" onclick="LV11.nf(\'right\',\'' + (nf.right === r.id ? '' : r.id) + '\')"><b>' + E(T(r.es, r.en)) + '</b><small>' + E(r.d) + '</small><em>' + cnt + ' ' + T('normas', 'laws') + '</em></button>'; }).join('') + '</div>';
    if (!target) { var hd2 = sec.querySelector('.lv11head'), xs = nf.site && site(nf.site); if (hd2) hd2.insertAdjacentHTML('afterend', siteFilterChip(nf.site, 'normativa') + (xs && xs.info && xs.info.length ? '<h2 class="lv11h2">' + T('Marco e instancia', 'Framework and body') + ' · ' + E(sName(xs)) + '</h2><div class="lv11info">' + xs.info.map(function (p) { return '<div class="lv11infocard" style="--c:' + xs.c + '"><b>' + E(p[0]) + '</b><p>' + E(p[1]) + '</p></div>'; }).join('') + '</div>' : '')); }
  }

  /* ---------------- observatorios ---------------- */
  var of = { amb: '', site: '', q: '', dept: '', tab: 'obs' };
  var AMBC = { 'Nacional': '#9E2C5A', 'Territorial': '#D33B78', 'Académico': '#2F6FDB', 'Sociedad civil': '#22A37A', 'Internacional': '#1A82B9' };
  function obsCard(o) { return '<div class="lv11obs" style="--c:' + (AMBC[o.amb] || '#9E2C5A') + '"><em>' + E(o.amb) + (o.dept ? ' · ' + E(deptName(o.dept)) : '') + '</em><b>' + E(o.n) + '</b><small>' + E(o.e) + '</small><p>' + E(o.d || '') + '</p>' + (o.url ? '<a href="' + E(o.url) + '" target="_blank" rel="noopener">' + T('Visitar', 'Visit') + ' ' + icon('ext', 14) + '</a>' : '<span class="lv11pend">' + T('Enlace por verificar', 'Link to be verified') + '</span>') + '</div>'; }
  function renderObs(target) {
    var sec = target || sectionEl('red');
    var all = S.obs.filter(function (o) { return o.pub; });
    var list = all.filter(function (o) { var q = of.q.toLowerCase(); return (!of.amb || o.amb === of.amb) && (!of.site || o.foc.indexOf(of.site) > -1) && (!of.dept || o.dept === of.dept) && (!q || (o.n + ' ' + o.e + ' ' + (o.d || '')).toLowerCase().indexOf(q) > -1); });
    var byDept = {}; all.forEach(function (o) { if (o.dept) byDept[o.dept] = (byDept[o.dept] || 0) + 1; });
    var extra = {}; Object.keys(byDept).forEach(function (k) { extra[k] = all.filter(function (o) { return o.dept === k; }).map(function (o) { return '· ' + E(o.n); }).join('<br>'); });
    var srcs = (W.LV11_SOURCES || []);
    sec.innerHTML = (target ? '' : pageHead(T('Red de observatorios', 'Observatory network'), T('Conectar observatorios, ampliar la mirada.', 'Connecting observatories, widening the view.'), T('Observatorios nacionales, territoriales, académicos, de sociedad civil e internacionales relacionados con las mujeres en todas sus diversidades. La inclusión no supone convenio ni intercambio de microdatos.', 'Observatories related to women in all their diversity. Inclusion implies no agreement or data exchange.'))) +
      '<div class="lv11tabs"><button class="' + (of.tab === 'obs' ? 'on' : '') + '" onclick="LV11.of(\'tab\',\'obs\')">' + T('Observatorios', 'Observatories') + ' (' + all.length + ')</button><button class="' + (of.tab === 'src' ? 'on' : '') + '" onclick="LV11.of(\'tab\',\'src\')">' + T('Fuentes oficiales de datos', 'Official data sources') + '</button></div>' +
      (of.tab === 'src' ? sourcesBlock() :
      '<div class="lv11stats">' + Object.keys(AMBC).map(function (k) { var n = all.filter(function (o) { return o.amb === k; }).length; return '<button class="' + (of.amb === k ? 'on' : '') + '" style="--c:' + AMBC[k] + '" onclick="LV11.of(\'amb\',\'' + (of.amb === k ? '' : k) + '\')"><b data-count>' + n + '</b><span>' + E(k) + '</span></button>'; }).join('') + '</div>' +
      '<div class="lv11obsgrid"><section class="lv11card"><h3>' + T('Observatorios territoriales y académicos', 'Local and academic observatories') + '</h3>' + choropleth(byDept, { color: '#D33B78', fmt: function (v) { return N(v) + ' ' + (v === 1 ? T('observatorio', 'observatory') : T('observatorios', 'observatories')); }, extra: extra, selected: of.dept, click: 'LV11.obsDept' }) + (of.dept ? '<button class="lv11btn ghost" onclick="LV11.of(\'dept\',\'\')">' + T('Quitar filtro de', 'Clear filter') + ' ' + E(deptName(of.dept)) + '</button>' : '<p class="lv11note">' + T('Toca un departamento para filtrar.', 'Tap a department to filter.') + '</p>') + '</section><div>' +
      '<div class="lv11tools"><label class="lv11search">' + icon('search', 18) + '<input value="' + E(of.q) + '" placeholder="' + T('Buscar observatorio o entidad…', 'Search…') + '" oninput="LV11.of(\'q\',this.value,1)"></label><select onchange="LV11.of(\'site\',this.value)"><option value="">' + T('Todos los enfoques', 'All topics') + '</option>' + sites().map(function (s) { return '<option value="' + s.id + '"' + (of.site === s.id ? ' selected' : '') + '>' + E(sName(s)) + '</option>'; }).join('') + '</select></div><p class="lv11count">' + list.length + ' ' + T('resultados', 'results') + '</p><div class="lv11grid2">' + list.map(obsCard).join('') + '</div></div></div>');
    if (!target) { var hd3 = sec.querySelector('.lv11head'); if (hd3) hd3.insertAdjacentHTML('afterend', siteFilterChip(of.site, 'red')); }
    countUp(sec);
  }
  function sourcesBlock() {
    var s = W.LV11_SOURCES || [];
    return '<p class="lv11note">' + T('Directorio inicial de fuentes de datos con enlaces de consulta, verificado al 26 de octubre de 2026.', 'Initial directory of data sources.') + '</p><div class="lv11grid3">' + s.map(function (x) { return '<div class="lv11obs" style="--c:' + (x.kind === 'Oficial' ? '#9E2C5A' : x.kind === 'Sociedad civil' ? '#22A37A' : '#1A82B9') + '"><em>' + E(x.kind) + ' · ' + E(x.scope) + '</em><b>' + E(x.name) + '</b><p>' + E(x.role) + '</p><a href="' + E(x.url) + '" target="_blank" rel="noopener">' + T('Consultar', 'Open') + ' ' + icon('ext', 14) + '</a></div>'; }).join('') + '</div>';
  }

  /* ---------------- rutas ---------------- */
  function routesBlock() {
    var rs = S.routes.filter(function (r) { return r.pub; });
    return '<div class="lv11lines">' + rs.map(function (r) { return '<a class="lv11line' + (r.urgent ? ' urgent' : '') + '" href="tel:' + E(String(r.num).replace(/\s/g, '')) + '"><span>' + icon('phone', 22) + '</span><b>' + E(r.num) + '</b><strong>' + E(r.n) + '</strong><small>' + E(r.for) + '</small><em>' + E(r.cov || '') + '</em></a>'; }).join('') + '</div>' +
      '<h2 class="lv11h2">' + T('Qué hacer, paso a paso', 'What to do, step by step') + '</h2><ol class="lv11steps">' + DEF.steps.map(function (s, i) { return '<li style="--c:' + s.c + '"><span>' + (i + 1) + '</span><div><b>' + E(s.t) + '</b><p>' + E(s.d) + '</p></div></li>'; }).join('') + '</ol>';
  }
  function renderRoutes() {
    var sec = sectionEl('rutas');
    sec.innerHTML = '<div class="lv11rhero"><div class="eyebrow">' + T('Rutas de atención', 'Support pathways') + '</div><h1>' + T('No estás sola. Hay a quién llamar.', 'You are not alone. There is someone to call.') + '</h1><p>' + T('Líneas y pasos para buscar atención. Este portal no recibe denuncias ni datos personales.', 'Lines and steps to get help. This portal does not receive reports or personal data.') + '</p></div>' + routesBlock() +
      '<h2 class="lv11h2">' + T('Normas que respaldan la atención', 'Laws backing these services') + '</h2><div class="lv11grid3">' + S.norms.filter(function (n) { return n.pub && n.sites.indexOf('rutas') > -1; }).map(normCard).join('') + '</div>' +
      '<p class="lv11note">' + T('Antes de habilitar canales por municipio se debe verificar entidad, horario, accesibilidad y vigencia. No se divulgan ubicaciones de casas refugio.', 'Local channels must be verified before publication. Shelter locations are never disclosed.') + '</p>';
  }

  /* ---------------- navegación pública ---------------- */
  var NAV = [['libres', 'Panorama', 'Overview'], ['indicadores', 'Indicadores', 'Indicators'], ['mapa', 'Indicadores en el mapa', 'Indicators on the map'], ['publicaciones', 'Datos y análisis', 'Data & analysis'], ['normativa', 'Normativa y derechos', 'Laws & rights'], ['red', 'Observatorios', 'Observatories'], ['rutas', 'Rutas de atención', 'Support'], ['conocimiento', 'Conocimiento', 'Knowledge'], ['asistente', 'Consulta metodológica', 'Methods']];
  function buildNav() {
    var nav = D.getElementById('navigation'); if (!nav) return;
    var cur = (D.querySelector('main .page.active') || {}).id || 'libres';
    nav.setAttribute('data-no-translate', '');
    nav.innerHTML = NAV.map(function (n) { return '<button data-page="' + n[0] + '" class="' + (cur === n[0] ? 'active' : '') + '" onclick="go(\'' + n[0] + '\')">' + T(n[1], n[2]) + '</button>'; }).join('');
  }

  /* ---------------- panorama: barra lateral, tarjetas, mapa, filtros ---------------- */
  var SITE_FOR_TOPIC = { violencias: 'violencias', refugio: 'casas-refugio', cuidados: 'cuidados', autonomia: 'autonomia', salud: 'salud-dsr' };
  function patchDashboard() {
    if (typeof W.v8Render !== 'function' || ISADM()) return;
    W.v9Side = function () {
      var cur = panoSite;
      return '<aside class="v9side lv11side" data-no-translate><h2>' + T('Temas', 'Topics') + '</h2><div class="lv11sidelist">' + (function () {
        var G = W.LV23_GROUPS, all = sites(), by = {}; all.forEach(function (s) { by[s.id] = s; });
        var btn = function (s) { return '<button class="' + (cur === s.id ? 'active' : '') + '" style="--c:' + s.c + '" onclick="LV11.openSite(\'' + s.id + '\')"><span>' + sicon(s.ico, 16) + '</span>' + E(sName(s)) + '</button>'; };
        if (!G) return all.map(btn).join('');
        return G.map(function (g) { var l = g[3].filter(function (id) { return by[id]; }); return l.length ? '<div class="lv26grp"><h3>' + E(en() ? g[2] : g[1]) + '</h3>' + l.map(function (id) { return btn(by[id]); }).join('') + '</div>' : ''; }).join('');
      })() + '</div><hr><button onclick="v8Docs()"><span>▤</span>' + T('Biblioteca de datos', 'Data library') + '</button><small>' + T('Cada cifra conserva su fuente. Cada vacío también cuenta.', 'Every figure keeps its source.') + '</small></aside>';
    };
    // Periodo por defecto: el último año completo cuando la fuente es preliminar.
    var _chg = W.v9Change;
    W.v9Change = function (field, value) {
      if (field === 'source') { var s = SRCS().find(function (x) { return x.id === value; }); var y = s.preliminary && s.periods.length > 1 ? s.periods[s.periods.length - 2] : s.periods[s.periods.length - 1]; W.v9CardOpen(value, y, value === 'enut' && ST().dept === '*' ? '11' : ST().dept); return; }
      return _chg.apply(this, arguments);
    };
    W.v9Cards = function () {
      return ['pareja', 'fatal', 'nofatal', 'enut'].map(function (id, i) {
        var s = SRCS().find(function (x) { return x.id === id; }); if (!s) return '';
        var full = s.periods.filter(function (y) { return !(s.preliminary && y === '2026'); });
        var year = id === ST().source && s.periods.indexOf(ST().year) > -1 ? ST().year : full[full.length - 1];
        var dept = id === 'enut' ? (ST().dept === '*' ? '11' : ST().dept) : ST().dept;
        var a = W.v9Sum(s, year, dept, 'Mujer'), val = W.v8Value(a, s);
        var title = [T('Lesiones por violencia de pareja', 'Partner violence injuries'), T('Muertes por causa externa', 'External-cause deaths'), T('Lesiones no fatales', 'Non-fatal injuries'), T('Trabajo no remunerado', 'Unpaid work')][i];
        var colors = ['#D33B78', '#7A2E8E', '#17A58C', '#E0A800'], c = colors[i];
        // serie para la mini-gráfica
        var ser = full.map(function (y) { return W.v9Sum(s, y, dept, 'Mujer').value; });
        var spark = '';
        if (ser.length > 1) { var mx = Math.max.apply(null, ser), mn = Math.min.apply(null, ser), rg = mx - mn || 1, pts = ser.map(function (v, k) { return [4 + k * 112 / (ser.length - 1), 40 - (v - mn) / rg * 30]; }); var d = pts.map(function (p, k) { return (k ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(''); spark = '<svg class="lv11spark" viewBox="0 0 120 46" aria-hidden="true"><defs><linearGradient id="lvsg' + i + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c + '" stop-opacity=".35"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></linearGradient></defs><path d="' + d + 'L116,46L4,46Z" fill="url(#lvsg' + i + ')"/><path class="lvdraw go" d="' + d + '" fill="none" stroke="' + c + '" stroke-width="2.2" stroke-linejoin="round"/><circle cx="' + pts[pts.length - 1][0] + '" cy="' + pts[pts.length - 1][1] + '" r="3.4" fill="' + c + '" class="lvpulse"/></svg>'; }
        // indicador secundario
        var chip = '', delta = '';
        if (id === 'enut') { var h = W.v9Sum(s, year, dept, 'Hombre'); chip = T('Hombres', 'Men') + ' ' + W.v8Value(h, s) + ' · ' + T('brecha', 'gap') + ' ' + N(a.value - h.value, 1) + ' p.p.'; }
        else {
          var tot = W.v9Sum(s, year, dept, 'Hombre').value + a.value; if (tot && a.visible) chip = P(a.value / tot * 100) + ' ' + T('son mujeres', 'are women');
          var yi = full.indexOf(year); if (yi > 0 && a.visible) { var pv = W.v9Sum(s, full[yi - 1], dept, 'Mujer').value; if (pv) { var dl = (a.value - pv) / pv * 100; delta = '<span class="lv11delta ' + (dl > 0 ? 'up' : 'down') + '">' + (dl > 0 ? '▲ ' : '▼ ') + N(Math.abs(dl), 1) + ' % ' + T('vs ', 'vs ') + full[yi - 1] + '</span>'; } }
          if (id === 'fatal') { var hm2 = W.v9Sum(s, year, dept, 'Mujer', '1 Presuntos Homicidios'); if (hm2.visible) chip = W.v8Value(hm2, s) + ' ' + T('presuntos homicidios', 'alleged homicides'); }
          if (id === 'nofatal') { var pj = W.v9Sum(s, year, dept, 'Mujer', '6 Lesiones no Fatales por Violencia de Pareja'); if (pj.visible) chip = W.v8Value(pj, s) + ' ' + T('por violencia de pareja', 'by partner violence'); }
        }
        return '<button class="v9card lv11card4 ' + (ST().source === id ? 'active' : '') + '" style="--c:' + c + ';--ci:' + ink(c) + '" onclick="v9CardOpen(\'' + id + '\',\'' + year + '\',\'' + dept + '\')" aria-label="' + E(title + ' · ' + val) + '"><span class="lv11cardtop"><b>' + E(title) + '</b>' + delta + '</span><strong data-v9-count="' + (a.visible ? a.value : '') + '" data-v9-prefix="' + (a.hidden ? '≥ ' : '') + '" data-v9-suffix="' + (id === 'enut' ? ' %' : '') + '">' + E(val) + '</strong><small>' + T('Mujeres', 'Women') + ' · ' + year + ' · ' + (dept === '*' ? T('Colombia', 'Colombia') : E(deptName(dept))) + '</small>' + spark + '<em class="lv11cardchip">' + E(chip) + '</em></button>';
      }).join('');
    };
    // Mapa: escala por clases con leyenda numérica, departamento seleccionado resaltado y acercamiento.
    var _map = W.v8DrawMap;
    W.v8DrawMap = function (data) {
      if (ST().mode === 'heat') return _map.apply(this, arguments);
      var el = D.getElementById('v8Map'); if (!el) return;
      var s = W.v8Source(), vals = {}; data.forEach(function (a) { vals[a.dept] = a.visible ? a.value : null; });
      var col = getComputedStyle(R).getPropertyValue('--lv-accent').trim() || '#9E2C5A'; if (!/^#[0-9a-f]{6}$/i.test(col)) col = '#9E2C5A';
      var sel = ST().dept !== '*' ? ST().dept : null;
      var html = choropleth(vals, { color: col, fmt: function (v, ax) { return s.measure === 'percent' ? P(v) : (ax ? N(v) : N(v) + ' ' + T('registros', 'records')); }, selected: sel, dim: !!sel, click: 'LV11.mapPick' });
      var tmp = D.createElement('div'); tmp.innerHTML = html;
      el.innerHTML = tmp.querySelector('svg').innerHTML; el.classList.add('lvmap');
      // leyenda numérica en lugar de la genérica
      var lg = el.closest('article') && el.closest('article').querySelector('.v9legend'); if (lg) { lg.outerHTML = tmp.querySelector('.lvmaplegend').outerHTML.replace('lvmaplegend', 'lvmaplegend v9legend'); }
      zoomTo(el, sel);
    };
    var _render = W.v8Render;
    W.v8Render = function () {
      var r = _render.apply(this, arguments);
      try { injectCategory(); } catch (e) {}
      try { injectPano(); } catch (e) { console.error(e); }
      return r;
    };
  }
  W.LV11_mapPick = null;
  function zoomTo(svg, code) {
    var target = [0, 0, 470, 480];
    if (code) { var p = svg.querySelector('path[data-code="' + code + '"]'); if (p) { var b = p.getBBox(), pad = Math.max(b.width, b.height) * 1.6 + 40, cx = b.x + b.width / 2, cy = b.y + b.height / 2; target = [cx - pad / 2 * 470 / 480, cy - pad / 2, pad * 470 / 480, pad]; } }
    var from = (svg.getAttribute('data-vb') || '0 0 470 480').split(' ').map(Number), t0 = null;
    if (W.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { svg.setAttribute('viewBox', target.join(' ')); svg.setAttribute('data-vb', target.join(' ')); return; }
    (function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 650), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; var v = from.map(function (f, i) { return f + (target[i] - f) * e; }); svg.setAttribute('viewBox', v.map(function (x) { return x.toFixed(1); }).join(' ')); if (k < 1) requestAnimationFrame(step); else svg.setAttribute('data-vb', target.join(' ')); })(performance.now());
  }
  function injectCategory() {
    var tb = D.querySelector('#libresRoot .v9toolbar'); if (!tb || tb.querySelector('.lv11cat')) return;
    var s = W.v8Source(), cats = W.v8Categories(s); if (cats.length < 2) return;
    var lab = D.createElement('label'); lab.className = 'lv11cat'; lab.setAttribute('data-no-translate', '');
    lab.innerHTML = T('CATEGORÍA', 'CATEGORY') + '<select onchange="v8Set(\'category\',this.value)"><option value="*">' + T('Todas las categorías', 'All categories') + '</option>' + cats.map(function (c) { return '<option value="' + E(c) + '"' + (ST().category === c ? ' selected' : '') + '>' + E(c.replace(/^\d+\s*/, '')) + '</option>'; }).join('') + '</select>';
    tb.appendChild(lab); tb.classList.add('has-cat');
    var p = D.querySelector('#libresRoot .v9contextbar p'); if (p && ST().category !== '*') p.textContent += ' · ' + ST().category.replace(/^\d+\s*/, '');
  }

  /* ---------------- administración: gestor de contenidos ---------------- */
  var adm = { tab: 'sites', q: '' };
  var SCHEMA = {
    sites: { title: T('Micrositios', 'Microsites'), cols: ['es', 'c', 'pub'], fields: [['id', 'Identificador (sin espacios)', 'text'], ['es', 'Nombre', 'text'], ['en', 'Nombre en inglés', 'text'], ['c', 'Color', 'color'], ['ico', 'Ícono', 'icon'], ['d', 'Descripción', 'area'], ['de', 'Descripción en inglés', 'area'], ['info', 'Contexto de la historia (una línea por paso: Título | Texto)', 'pairs'], ['pub', 'Publicado', 'check']] },
    norms: { title: T('Normativa', 'Laws'), cols: ['n', 'tipo', 'y', 'pub'], fields: [['id', 'Identificador', 'text'], ['tipo', 'Tipo', 'select:Constitución,Tratado internacional,Ley,Decreto,Sentencia,Auto,Resolución,Política pública'], ['n', 'Nombre', 'text'], ['y', 'Año', 'number'], ['d', 'Qué establece', 'area'], ['de', 'Qué establece (inglés)', 'area'], ['rights', 'Derechos', 'multi:rights'], ['sites', 'Micrositios', 'multi:sites'], ['url', 'Enlace oficial', 'text'], ['pub', 'Publicada', 'check']] },
    obs: { title: T('Observatorios', 'Observatories'), cols: ['n', 'amb', 'pub'], fields: [['id', 'Identificador', 'text'], ['n', 'Nombre', 'text'], ['e', 'Entidad', 'text'], ['amb', 'Ámbito', 'select:Nacional,Territorial,Académico,Sociedad civil,Internacional'], ['dept', 'Departamento (código DIVIPOLA, opcional)', 'dept'], ['foc', 'Enfoques (micrositios)', 'multi:sites'], ['url', 'Enlace', 'text'], ['d', 'Descripción', 'area'], ['pub', 'Publicado', 'check']] },
    docs: { title: T('Acervo documental', 'Document collection'), cols: ['t', 'tipo', 'y', 'pub'], fields: [['id', 'Identificador', 'text'], ['t', 'Título', 'text'], ['tipo', 'Tipo', 'select:Documento técnico,Guía,Protocolo,Informe,Boletín,Infografía,Base de datos,Herramienta'], ['y', 'Año', 'number'], ['sites', 'Temas relacionados', 'multi:sites'], ['url', 'Enlace al documento', 'text'], ['d', 'Descripción', 'area'], ['pub', 'Publicado', 'check']] },
    routes: { title: T('Rutas de atención', 'Support'), cols: ['n', 'num', 'pub'], fields: [['id', 'Identificador', 'text'], ['n', 'Nombre', 'text'], ['num', 'Número o contacto', 'text'], ['for', 'Para qué sirve', 'area'], ['cov', 'Cobertura y entidad', 'text'], ['urgent', 'Destacar como urgente', 'check'], ['pub', 'Publicada', 'check']] }
  };
  function admSection() {
    var sec = sectionEl('portal11');
    var tabs = [['sites', T('Temas y comités', 'Topics')], ['ind', T('Indicadores públicos', 'Public indicators')], ['vals', T('Valores y gráficas', 'Values and charts')], ['an', T('Análisis', 'Analyses')], ['docs', T('Acervo documental', 'Documents')], ['norms', T('Normativa y sentencias', 'Laws and rulings')], ['obs', T('Red de observatorios', 'Observatories')], ['routes', T('Líneas de atención', 'Helplines')], ['txt', T('Textos de páginas', 'Page texts')]];
    var h = '<div class="lv11adhero"><div class="eyebrow">' + T('Administración · contenidos del portal', 'Administration · portal content') + '</div><h1>' + T('Alimenta lo que ve la ciudadanía.', 'Feed what citizens see.') + '</h1><p>' + T('Temas, indicadores, valores y gráficas, análisis, acervo documental, normativa y sentencias, red de observatorios, líneas de atención y textos de cada página. Los cambios se guardan en este navegador y la consulta pública del mismo equipo los muestra al recargar; usa «Exportar JSON» para llevarlos al servidor.', 'Changes are saved in this browser and shown in the public site on reload.') + '</p><div class="lv11row"><a class="lv11btn light" href="Consulta_Publica_Observatorio.html#micrositios" target="_blank">' + T('Ver consulta pública', 'View public site') + ' ' + icon('ext', 16) + '</a><button class="lv11btn ghost light" onclick="LV11.adm.export()">' + icon('download', 16) + ' ' + T('Exportar JSON', 'Export JSON') + '</button><label class="lv11btn ghost light">' + T('Importar JSON', 'Import JSON') + '<input type="file" accept=".json" hidden onchange="LV11.adm.import(this.files[0])"></label><button class="lv11btn ghost light" onclick="LV11.adm.reset()">' + T('Restablecer valores iniciales', 'Reset defaults') + '</button></div><p class="lv11saved">' + (S.updated ? T('Último guardado: ', 'Last saved: ') + new Date(S.updated).toLocaleString(en() ? 'en-US' : 'es-CO') : T('Sin cambios guardados: se muestran los valores iniciales.', 'No saved changes: showing defaults.')) + '</p></div>' +
      '<div class="lv11tabs">' + tabs.map(function (t) { return '<button class="' + (adm.tab === t[0] ? 'on' : '') + '" onclick="LV11.adm.tab(\'' + t[0] + '\')">' + t[1] + '</button>'; }).join('') + '</div>';
    if (SCHEMA[adm.tab]) h += admTable(adm.tab);
    else if (adm.tab === 'ind') h += admInd();
    else if (adm.tab === 'vals') h += admVals();
    else if (adm.tab === 'txt') h += admTxt();
    else h += admAn();
    sec.innerHTML = h;
  }
  function admTable(k) {
    var sc = SCHEMA[k], list = S[k].filter(function (x) { var q = adm.q.toLowerCase(); return !q || JSON.stringify(x).toLowerCase().indexOf(q) > -1; });
    return '<div class="lv11tools"><label class="lv11search">' + icon('search', 18) + '<input value="' + E(adm.q) + '" placeholder="' + T('Buscar…', 'Search…') + '" oninput="LV11.adm.q(this.value)"></label><button class="lv11btn" onclick="LV11.adm.edit(\'' + k + '\',-1)">' + icon('plus', 16) + ' ' + T('Agregar', 'Add') + '</button></div><p class="lv11count">' + list.length + ' ' + T('registros', 'records') + '</p><div class="lv11table"><table><thead><tr>' + sc.cols.map(function (c) { var f = sc.fields.find(function (z) { return z[0] === c; }); return '<th>' + E(f ? f[1] : c) + '</th>'; }).join('') + '<th>' + T('Acciones', 'Actions') + '</th></tr></thead><tbody>' +
      list.map(function (x) { var i = S[k].indexOf(x); return '<tr>' + sc.cols.map(function (c) { var v = x[c]; if (c === 'pub') return '<td><label class="lv11switch"><input type="checkbox"' + (v ? ' checked' : '') + ' onchange="LV11.adm.toggle(\'' + k + '\',' + i + ',this.checked)"> ' + (v ? T('Sí', 'Yes') : T('No', 'No')) + '</label></td>'; if (c === 'c') return '<td><span class="lv11dot" style="--c:' + E(v) + '"></span>' + E(v) + '</td>'; return '<td>' + (c === 'es' || c === 'n' ? '<b>' + E(v) + '</b>' : E(v)) + '</td>'; }).join('') + '<td class="lv11acts"><button onclick="LV11.adm.edit(\'' + k + '\',' + i + ')" aria-label="' + T('Editar', 'Edit') + '">' + icon('edit', 16) + '</button><button onclick="LV11.adm.del(\'' + k + '\',' + i + ')" aria-label="' + T('Eliminar', 'Delete') + '">' + icon('trash', 16) + '</button></td></tr>'; }).join('') + '</tbody></table></div>';
  }
  function admInd() {
    var set = {}; S.ind.published.forEach(function (c) { set[c] = 1; });
    var list = catalog().filter(function (x) { var q = adm.q.toLowerCase(); return !q || (x.code + ' ' + x.name + ' ' + x.theme + ' ' + x.origin).toLowerCase().indexOf(q) > -1; });
    return '<p class="lv11note">' + T('Marca qué entradas del catálogo (194) ve el público, a qué micrositio pertenecen y un resumen opcional. Las que tienen información procesada muestran métricas en su ventana.', 'Choose which catalogue entries the public sees.') + '</p><div class="lv11tools"><label class="lv11search">' + icon('search', 18) + '<input value="' + E(adm.q) + '" placeholder="' + T('Buscar código, nombre u origen…', 'Search…') + '" oninput="LV11.adm.q(this.value)"></label><span class="lv11count">' + S.ind.published.length + ' ' + T('publicados', 'published') + '</span></div><div class="lv11table"><table><thead><tr><th>' + T('Publicar', 'Publish') + '</th><th>' + T('Código', 'Code') + '</th><th>' + T('Indicador', 'Indicator') + '</th><th>' + T('Origen', 'Origin') + '</th><th>' + T('Micrositio', 'Microsite') + '</th><th>' + T('Datos', 'Data') + '</th><th>' + T('Resumen público', 'Public summary') + '</th></tr></thead><tbody>' +
      list.map(function (x) { return '<tr><td><input type="checkbox" aria-label="' + T('Publicar', 'Publish') + ' ' + E(x.code) + '"' + (set[x.code] ? ' checked' : '') + ' onchange="LV11.adm.pubInd(\'' + x.code + '\',this.checked)"></td><td><b>' + E(x.code) + '</b></td><td>' + E(x.name) + '</td><td><small>' + E(x.origin) + '</small></td><td><select onchange="LV11.adm.indSite(\'' + x.code + '\',this.value)">' + sites(true).map(function (s) { return '<option value="' + s.id + '"' + (indSite(x) === s.id ? ' selected' : '') + '>' + E(s.es) + '</option>'; }).join('') + '</select></td><td>' + (IND[x.code] ? '<em class="lv11has">' + T('Procesados', 'Processed') + '</em>' : '—') + '</td><td><input value="' + E(S.ind.summary[x.code] || '') + '" placeholder="' + T('Opcional', 'Optional') + '" onchange="LV11.adm.indSum(\'' + x.code + '\',this.value)"></td></tr>'; }).join('') + '</tbody></table></div>';
  }
  function admVals() {
    var list = published().filter(function (x) { var q = adm.q.toLowerCase(); return !q || (x.code + ' ' + x.name).toLowerCase().indexOf(q) > -1; });
    return '<p class="lv11note">' + T('Corrige la cifra principal, el texto de lectura, la fuente o la serie de la gráfica de cada indicador publicado. También puedes cargar datos para un indicador que aún no los tiene. Lo editado se marca y prevalece sobre el cálculo automático.', 'Edit headline value, reading, source or chart series of any published indicator.') + '</p><div class="lv11tools"><label class="lv11search">' + icon('search', 18) + '<input value="' + E(adm.q) + '" placeholder="' + T('Buscar indicador…', 'Search…') + '" oninput="LV11.adm.q(this.value)"></label><span class="lv11count">' + Object.keys(S.ovr).length + ' ' + T('editados', 'edited') + '</span></div><div class="lv11table"><table><thead><tr><th>' + T('Código', 'Code') + '</th><th>' + T('Indicador', 'Indicator') + '</th><th>' + T('Cifra actual', 'Current value') + '</th><th>' + T('Estado', 'Status') + '</th><th></th></tr></thead><tbody>' +
      list.map(function (x) { var k = indKpi(x.code), o = S.ovr[x.code]; return '<tr><td><b>' + E(x.code) + '</b></td><td>' + E(x.name) + '</td><td><b class="lv54v">' + E(k ? k.v : '—') + '</b>' + (k && k.l ? '<br><small>' + E(k.l) + '</small>' : '') + '</td><td>' + (o ? '<em class="lv54ed">' + T('Editado', 'Edited') + '</em>' : (IND0 && IND0[x.code] ? '<em class="lv11has">' + T('Calculado', 'Computed') + '</em>' : '<em class="lv54pend">' + T('Sin datos', 'No data') + '</em>')) + '</td><td class="lv11acts"><button onclick="LV11.adm.vedit(\'' + x.code + '\')" aria-label="' + T('Editar valores', 'Edit values') + '">' + icon('edit', 16) + '</button></td></tr>'; }).join('') + '</tbody></table></div>';
  }
  function vEdit(code) {
    var x = catalog().find(function (i) { return i.code === code; }) || { name: code }, o = S.ovr[code] || {}, k = (function () { var b = IND0 && IND0[code], r = null; try { r = b ? b() : null; } catch (e) {} return r; })();
    var cur = k && k.kpis && k.kpis[0] ? k.kpis[0] : ['', ''];
    dialog('<div class="lv11dbody"><div class="lv11dh"><span class="lv11chip">' + E(code) + '</span><h2>' + E(x.name) + '</h2><p class="lv11status">' + (k ? T('Valor calculado: ', 'Computed value: ') + E(cur[0]) + ' · ' + E(cur[1]) : T('Este indicador aún no tiene datos: puedes cargarlos aquí.', 'No data yet: you can load it here.')) + '</p></div>' +
      '<form class="lv11form lv54f" onsubmit="event.preventDefault();LV11.adm.vsave(\'' + code + '\',this)">' +
      '<div class="lv54g"><label>' + T('Cifra principal', 'Headline value') + '<input name="v" value="' + E(o.v || '') + '" placeholder="' + E(cur[0] || 'ej. 45,2 %') + '"></label><label>' + T('Qué mide la cifra', 'Label') + '<input name="label" value="' + E(o.label || '') + '" placeholder="' + E(cur[1] || '') + '"></label></div>' +
      '<label>' + T('Lectura en lenguaje sencillo', 'Plain-language reading') + '<textarea name="read" rows="2" placeholder="' + E((k && k.read) || '') + '">' + E(o.read || '') + '</textarea></label>' +
      '<label>' + T('Fuente y fecha de corte', 'Source and cut-off') + '<input name="src" value="' + E(o.src || '') + '" placeholder="' + E((k && k.src) || '') + '"></label>' +
      '<div class="lv54g"><label>' + T('Serie de la gráfica (una línea por dato: Etiqueta ; Valor)', 'Chart series (Label ; Value per line)') + '<textarea name="serie" rows="7" placeholder="2021 ; 32,4&#10;2022 ; 35,1&#10;2023 ; 33,8" oninput="LV11.adm.vprev(this.form)">' + E(o.serie || '') + '</textarea></label><label>' + T('Tipo de gráfica', 'Chart type') + '<select name="tipo" onchange="LV11.adm.vprev(this.form)"><option value="barras"' + (o.tipo !== 'linea' ? ' selected' : '') + '>' + T('Barras', 'Bars') + '</option><option value="linea"' + (o.tipo === 'linea' ? ' selected' : '') + '>' + T('Línea en el tiempo', 'Line') + '</option></select><div class="lv54prev" id="lv54prev">' + ovrChart({ serie: o.serie, tipo: o.tipo, code: code }) + '</div></label></div>' +
      '<p class="lv11note">' + T('Deja un campo vacío para usar el valor calculado. Usa coma decimal (32,4).', 'Leave empty to use the computed value.') + '</p>' +
      '<div class="lv11row"><button class="lv11btn" type="submit">' + T('Guardar', 'Save') + '</button>' + (S.ovr[code] ? '<button class="lv11btn ghost" type="button" onclick="LV11.adm.vclear(\'' + code + '\')">' + T('Volver al valor calculado', 'Restore computed value') + '</button>' : '') + '<button class="lv11btn ghost" type="button" onclick="LV11.openIndicator(\'' + code + '\')">' + T('Vista previa', 'Preview') + '</button></div></form></div>', '#672e89');
  }
  // textos de páginas editables: [clave, etiqueta, texto por defecto]
  var TXT = [
    [T('Inicio', 'Home'), [['inicio.sub', 'Subtítulo de la portada', 'Mujeres, territorios y realidades'], ['inicio.k1', 'Cifra 1 · valor (vacío = automático)', ''], ['inicio.k1l', 'Cifra 1 · texto', 'indicadores en el observatorio'], ['inicio.k2', 'Cifra 2 · valor', '6'], ['inicio.k2l', 'Cifra 2 · texto', 'datos interseccionales: edad, etnia, discapacidad, orientación sexual, agresor y zona'], ['inicio.k3', 'Cifra 3 · valor', '1.122'], ['inicio.k3l', 'Cifra 3 · texto', 'datos territorializados: municipios con zona urbana y rural']]],
    [T('Sentencias', 'Rulings'), [['sent.h1', 'Título', 'Lo que han decidido los jueces'], ['sent.p', 'Introducción', 'Decisiones de la Corte Constitucional que protegen los derechos de las mujeres en todas sus diversidades.']]],
    [T('Rutas de atención', 'Support pathways'), [['rutas.alerta', 'Alerta de peligro inminente', 'Llama al 123 o busca un lugar seguro. Tu vida es lo primero.'], ['rutas.vsx', 'Alerta de violencia sexual', 'Es una urgencia médica. Ve a urgencias en las primeras 72 horas, aunque no hayas denunciado: hay anticoncepción de emergencia y profilaxis gratuitas.'], ['rutas.enc1', 'Encuadre 1', 'Ninguna violencia se justifica. Tienes derecho a una vida libre de violencias (Ley 1257 de 2008).'], ['rutas.enc2', 'Encuadre 2', 'Si estás en peligro, busca un lugar seguro y llama al 123.'], ['rutas.enc3', 'Encuadre 3', 'Salud, justicia o protección: la entidad a la que llegues debe atenderte y remitirte a las demás.'], ['rutas.enc4', 'Encuadre 4', 'A recibir información clara, a ir acompañada, a no ser confrontada con el agresor y a que se respete tu privacidad.'], ['rutas.salud', 'Sector salud', 'Urgencias, atención médica y psicológica, registro de lesiones. No necesitas denuncia para que te atiendan.'], ['rutas.justicia', 'Sector justicia', 'Denuncia, investigación y sanción. Fiscalía, Medicina Legal y Ministerio Público te acompañan.'], ['rutas.proteccion', 'Sector protección', 'Medidas para que el agresor no se acerque, desalojo, acogida en casa refugio y protección de niñas y niños.']]],
    [T('Colibrí flotante (todas las páginas)', 'Floating hummingbird'), [['colibri.frase', 'Frase del colibrí', 'No estás sola. Denuncia'], ['colibri.sub', 'Texto del botón (lleva a Rutas de atención)', 'Encuentra tu ruta de atención'], ['colibri.on', 'Mostrar el colibrí (escribe «no» para ocultarlo)', 'sí']]],
    [T('Red Nacional de Casas Refugio', 'Shelter network'), [['casas.p', 'Introducción', 'Lugares de acogida temporales, gratuitos y seguros para mujeres víctimas de violencia, sus hijas e hijos y personas a su cargo.'], ['casas.e1', 'Etapa 1 · Ingreso', 'La mujer pide una medida de protección o atención ante una Comisaría de Familia o un juzgado. La autoridad estudia el caso y decide si otorga la casa refugio. En casos de grave necesidad, la casa puede recibirla de forma temporal mientras se presenta ante la autoridad.'], ['casas.e2', 'Etapa 2 · Permanencia', 'Durante su estancia recibe alojamiento, alimentación y vestuario, junto con asesoría jurídica, acompañamiento psicosocial y orientación educativa u ocupacional, para ella, sus hijas e hijos y personas a cargo.'], ['casas.e3', 'Etapa 3 · Egreso', 'La salida se prepara con un plan para retomar su vida con autonomía: empleo o emprendimiento, estudio y redes de apoyo.'], ['casas.e4', 'Etapa 4 · Seguimiento', 'Después de salir, el equipo hace seguimiento para confirmar que ella y su familia siguen seguras y con acceso a sus derechos.']]]
  ];
  function admTxt() {
    return '<p class="lv11note">' + T('Edita los textos fijos de cada página. Deja un campo vacío para usar el texto original. Se aplica en español; la versión en inglés conserva su traducción.', 'Edit fixed page texts (Spanish). Empty = original.') + '</p>' + TXT.map(function (g) { return '<details class="lv54tx" open><summary>' + E(g[0]) + '</summary><div>' + g[1].map(function (f) { var v = S.txt[f[0]] || ''; return '<label>' + E(f[1]) + (f[2].length > 70 ? '<textarea rows="2" placeholder="' + E(f[2]) + '" onchange="LV11.adm.txt(\'' + f[0] + '\',this.value)">' + E(v) + '</textarea>' : '<input value="' + E(v) + '" placeholder="' + E(f[2]) + '" onchange="LV11.adm.txt(\'' + f[0] + '\',this.value)">') + '</label>'; }).join('') + '</div></details>'; }).join('');
  }
  function admAn() {
    return '<p class="lv11note">' + T('Los análisis se calculan con los datos cargados. Puedes ocultarlos o cambiar su título y agregar una nota de lectura.', 'Analyses are computed from loaded data; you can hide them or edit the title and note.') + '</p><div class="lv11table"><table><thead><tr><th>' + T('Visible', 'Visible') + '</th><th>' + T('Análisis', 'Analysis') + '</th><th>' + T('Micrositio', 'Microsite') + '</th><th>' + T('Título público', 'Public title') + '</th><th>' + T('Nota adicional', 'Extra note') + '</th><th></th></tr></thead><tbody>' +
      DEF.analyses.map(function (a) { var t = S.analyses.text[a.id] || {}; return '<tr><td><input type="checkbox"' + (S.analyses.hidden.indexOf(a.id) < 0 ? ' checked' : '') + ' onchange="LV11.adm.anVis(\'' + a.id + '\',this.checked)"></td><td><b>' + E(a.es) + '</b></td><td>' + E(sName(site(a.site))) + '</td><td><input value="' + E(t.title || '') + '" placeholder="' + E(a.es) + '" onchange="LV11.adm.anText(\'' + a.id + '\',\'title\',this.value)"></td><td><input value="' + E(t.note || '') + '" onchange="LV11.adm.anText(\'' + a.id + '\',\'note\',this.value)"></td><td><button class="lv11btn ghost" onclick="LV11.openAnalysis(\'' + a.id + '\')">' + T('Vista previa', 'Preview') + '</button></td></tr>'; }).join('') + '</tbody></table></div>';
  }
  function admEdit(k, i) {
    var sc = SCHEMA[k], x = i < 0 ? { pub: true } : S[k][i];
    var f = sc.fields.map(function (fd) {
      var key = fd[0], lab = fd[1], type = fd[2], v = x[key];
      if (type === 'check') return '<label class="lv11switch"><input type="checkbox" name="' + key + '"' + (v ? ' checked' : '') + '> ' + E(lab) + '</label>';
      if (type === 'area') return '<label>' + E(lab) + '<textarea name="' + key + '" rows="3">' + E(v || '') + '</textarea></label>';
      if (type === 'pairs') return '<label>' + E(lab) + '<textarea name="' + key + '" rows="5">' + E((v || []).map(function (q) { return q[0] + ' | ' + q[1]; }).join('\n')) + '</textarea></label>';
      if (type === 'color') return '<label>' + E(lab) + '<input type="color" name="' + key + '" value="' + E(v || '#9E2C5A') + '"></label>';
      if (type === 'icon') return '<label>' + E(lab) + '<select name="' + key + '">' + Object.keys(ICO).slice(0, 18).map(function (o) { return '<option' + (v === o ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></label>';
      if (type === 'dept') return '<label>' + E(lab) + '<select name="' + key + '"><option value="">' + T('Ninguno', 'None') + '</option>' + GEOx().map(function (g) { return '<option value="' + g.code + '"' + (v === g.code ? ' selected' : '') + '>' + E(g.name) + '</option>'; }).join('') + '</select></label>';
      if (type.indexOf('select:') === 0) return '<label>' + E(lab) + '<select name="' + key + '">' + type.slice(7).split(',').map(function (o) { return '<option' + (v === o ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></label>';
      if (type.indexOf('multi:') === 0) { var opts = type.slice(6) === 'rights' ? DEF.rights.map(function (r) { return [r.id, r.es]; }) : sites(true).map(function (s) { return [s.id, s.es]; }); return '<fieldset><legend>' + E(lab) + '</legend><div class="lv11multi">' + opts.map(function (o) { return '<label><input type="checkbox" name="' + key + '" value="' + o[0] + '"' + ((v || []).indexOf(o[0]) > -1 ? ' checked' : '') + '> ' + E(o[1]) + '</label>'; }).join('') + '</div></fieldset>'; }
      return '<label>' + E(lab) + '<input type="' + (type === 'number' ? 'number' : 'text') + '" name="' + key + '" value="' + E(v == null ? '' : v) + '"' + (key === 'id' && i >= 0 ? ' readonly' : '') + '></label>';
    }).join('');
    dialog('<div class="lv11dbody"><div class="lv11dh"><span class="lv11chip">' + E(sc.title) + '</span><h2>' + (i < 0 ? T('Agregar', 'Add') : T('Editar', 'Edit')) + '</h2></div><form class="lv11form" onsubmit="event.preventDefault();LV11.adm.save(\'' + k + '\',' + i + ',this)">' + f + '<div class="lv11row"><button class="lv11btn" type="submit">' + T('Guardar', 'Save') + '</button><button class="lv11btn ghost" type="button" onclick="this.closest(\'dialog\').close()">' + T('Cancelar', 'Cancel') + '</button></div></form></div>', '#3C3C3B');
  }
  function admSave(k, i, form) {
    var sc = SCHEMA[k], x = i < 0 ? {} : S[k][i];
    sc.fields.forEach(function (fd) {
      var key = fd[0], type = fd[2];
      if (type === 'check') x[key] = form.querySelector('[name="' + key + '"]').checked;
      else if (type === 'pairs') x[key] = form.querySelector('[name="' + key + '"]').value.split('\n').map(function (l) { var i2 = l.indexOf('|'); return i2 < 0 ? null : [l.slice(0, i2).trim(), l.slice(i2 + 1).trim()]; }).filter(function (q) { return q && q[0]; });
      else if (type.indexOf('multi:') === 0) x[key] = Array.from(form.querySelectorAll('[name="' + key + '"]:checked')).map(function (c) { return c.value; });
      else { var v = form.querySelector('[name="' + key + '"]').value.trim(); x[key] = type === 'number' ? Number(v) : v; }
    });
    if (!x.id) x.id = (x.es || x.n || x.t || 'item').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    if (k === 'sites') { x.themes = x.themes || []; x.analyses = x.analyses || []; x.ico = x.ico || 'spark'; }
    if (k === 'norms') { x.rights = x.rights || []; x.sites = x.sites || []; }
    if (k === 'docs') { x.sites = x.sites || []; if (!x.t) x.t = 'Documento'; if (!x.id || x.id === 'item') x.id = 'doc-' + uid().slice(1, 6); }
    if (k === 'obs') { x.foc = x.foc || []; if (!x.dept) delete x.dept; if (!x.url) x.url = null; }
    if (i < 0) { if (S[k].some(function (z) { return z.id === x.id; })) x.id += '-' + uid().slice(1, 4); S[k].push(x); }
    persist(); D.getElementById('lv11Dialog').close(); toast(T('Guardado. La consulta pública lo mostrará al recargar.', 'Saved. The public site will show it on reload.')); admSection();
  }
  function toast(t) { D.querySelectorAll('.lv11toast').forEach(function (o) { o.remove(); }); var el = D.createElement('div'); el.className = 'lv11toast'; el.textContent = t; D.body.appendChild(el); setTimeout(function () { el.classList.add('on'); }, 10); setTimeout(function () { el.classList.remove('on'); setTimeout(function () { el.remove(); }, 400); }, 3200); }
  var ADM = {
    tab: function (t) { adm.tab = t; adm.q = ''; admSection(); },
    q: function (v) { adm.q = v; clearTimeout(ADM._t); ADM._t = setTimeout(function () { var a = D.activeElement, pos = a && a.selectionStart; admSection(); var inp = D.querySelector('#portal11 .lv11search input'); if (inp) { inp.focus(); try { inp.setSelectionRange(pos, pos); } catch (e) {} } }, 250); },
    edit: admEdit, save: admSave,
    toggle: function (k, i, v) { S[k][i].pub = v; persist(); admSection(); },
    del: function (k, i) { if (!confirm(T('¿Eliminar este registro del portal?', 'Delete this record?'))) return; S[k].splice(i, 1); persist(); admSection(); },
    pubInd: function (c, v) { var p = S.ind.published, at = p.indexOf(c); if (v && at < 0) p.push(c); if (!v && at > -1) p.splice(at, 1); persist(); toast(T('Indicador ', 'Indicator ') + c + (v ? T(' publicado', ' published') : T(' retirado del portal', ' unpublished'))); },
    indSite: function (c, v) { S.ind.site[c] = v; persist(); },
    indSum: function (c, v) { if (v) S.ind.summary[c] = v; else delete S.ind.summary[c]; persist(); },
    vedit: vEdit,
    vprev: function (f) { var b = D.getElementById('lv54prev'); if (b) b.innerHTML = ovrChart({ serie: f.serie.value, tipo: f.tipo.value, code: 'prev' }); },
    vsave: function (code, f) { var o = {}; ['v', 'label', 'read', 'src', 'serie', 'tipo'].forEach(function (k) { var v = (f[k].value || '').trim(); if (v && !(k === 'tipo' && !f.serie.value.trim())) o[k] = v; }); if (Object.keys(o).length) S.ovr[code] = o; else delete S.ovr[code]; persist(); D.getElementById('lv11Dialog').close(); toast(T('Valores guardados. La consulta pública los mostrará al recargar.', 'Values saved.')); admSection(); },
    vclear: function (code) { delete S.ovr[code]; persist(); D.getElementById('lv11Dialog').close(); toast(T('Se restableció el valor calculado.', 'Computed value restored.')); admSection(); },
    txt: function (k, v) { v = (v || '').trim(); if (v) S.txt[k] = v; else delete S.txt[k]; persist(); toast(T('Texto guardado.', 'Text saved.')); },
    anVis: function (id, v) { var h = S.analyses.hidden, at = h.indexOf(id); if (!v && at < 0) h.push(id); if (v && at > -1) h.splice(at, 1); persist(); },
    anText: function (id, f, v) { S.analyses.text[id] = S.analyses.text[id] || {}; S.analyses.text[id][f] = v; persist(); },
    export: function () { var a = D.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' })); a.download = 'contenidos_portal_observatorio.json'; D.body.appendChild(a); a.click(); a.remove(); },
    import: function (file) { if (!file) return; var r = new FileReader(); r.onload = function () { try { var j = JSON.parse(r.result); ['sites', 'norms', 'obs', 'routes', 'ind', 'analyses', 'ovr', 'docs', 'txt'].forEach(function (k) { if (j[k]) S[k] = j[k]; }); applyOvr(); persist(); toast(T('Contenidos importados.', 'Content imported.')); admSection(); } catch (e) { toast(T('El archivo no es un JSON válido.', 'Invalid JSON file.')); } }; r.readAsText(file); },
    reset: function () { if (!confirm(T('¿Volver a los valores iniciales? Se perderán los cambios guardados en este navegador.', 'Reset to defaults?'))) return; try { localStorage.removeItem(KEY); } catch (e) {} load(); admSection(); toast(T('Valores iniciales restablecidos.', 'Defaults restored.')); }
  };

  /* ---------------- API pública y arranque ---------------- */
  var API = {
    openSite: function (id) { return openSiteInline(id); },
    siteInds: function (id) { return published().filter(function (x) { return indSite(x) === id; }).map(function (x) { return { code: x.code, name: x.name, formula: x.formula, unit: x.unit, frequency: x.frequency, variables: x.variables, source: x.source || (x.sources || []).join(', '), status: x.status, note: x.note, data: !!IND[x.code] }; }); },
    docs: function (id) { return S.docs.filter(function (d) { return d.pub && (!id || (d.sites || []).indexOf(id) > -1); }).sort(function (a, b) { return (b.y || 0) - (a.y || 0); }); },
    routes: function () { return S.routes.filter(function (r) { return r.pub; }); },
    txt: function (k, def) { return (!en() && S.txt && S.txt[k]) || def; },
    edited: function (code) { return !!(S.ovr && S.ovr[code]); },
    counts: function (id) { var x = site(id); return x ? siteCounts(x) : null; },
    obsFor: function (id) { var x = site(id); if (!x) return []; return S.obs.filter(function (o) { return o.pub && (x.link === 'red' || (o.foc || []).indexOf(x.id) > -1); }); },
    goWith: function (page, id) { applySite(page, id); skipAuto = true; W.go(page); skipAuto = false; scrollTo({ top: 0, behavior: 'smooth' }); },
    openSiteHub: function (id) { currentSite = id; renderSites(); if (typeof W.go === 'function') W.go('micrositios'); try { history.replaceState(null, '', '#micrositios' + (id ? '/' + id : '')); } catch (e) {} var s = site(id); if (s) R.style.setProperty('--lv-site', s.c); },
    filterSites: function (q) { q = q.toLowerCase(); D.querySelectorAll('.lv11site').forEach(function (b) { b.hidden = q && b.dataset.q.indexOf(q) < 0; }); },
    openIndicator: openIndicator, openAnalysis: openAnalysis, openNorm: openNorm, csv: csv,
    indQ: function (v) { indFilter.q = v; clearTimeout(API._t); API._t = setTimeout(function () { renderIndicators(); var i = D.querySelector('#indicadores .lv11search input'); if (i) { i.focus(); i.setSelectionRange(v.length, v.length); } }, 200); },
    indSite: function (v) { indFilter.site = v; renderIndicators(); },
    indData: function (v) { indFilter.data = v; renderIndicators(); },
    anSite: function (v) { anFilter = v; renderAnalyses(); },
    nf: function (k, v, keep) { nf[k] = v; if (keep) { clearTimeout(API._n); API._n = setTimeout(function () { renderNorms(normTarget()); var i = D.querySelector('#normativa .lv11search input'); if (i) { i.focus(); i.setSelectionRange(v.length, v.length); } }, 200); } else renderNorms(normTarget()); },
    of: function (k, v, keep) { of[k] = v; if (keep) { clearTimeout(API._o); API._o = setTimeout(function () { renderObs(obsTarget()); var i = D.querySelector('#red .lv11search input'); if (i) { i.focus(); i.setSelectionRange(v.length, v.length); } }, 200); } else renderObs(obsTarget()); },
    obsDept: function (c) { of.dept = of.dept === c ? '' : c; renderObs(obsTarget()); },
    mapPick: function (c) { W.v8Set('dept', ST().dept === c ? (W.v8Source().measure === 'percent' ? '11' : '*') : c); },
    panorama: function (source, topic) { var d = D.getElementById('lv11Dialog'); if (d && d.open) d.close(); if (topic && typeof W.v8Topic === 'function') W.v8Topic(topic); else if (typeof W.go === 'function') W.go('libres'); if (source && typeof W.v9Change === 'function') setTimeout(function () { W.v9Change('source', source); var t = D.querySelector('.v9contextbar'); if (t) scrollTo({ top: t.getBoundingClientRect().top + scrollY - 150, behavior: 'smooth' }); }, 80); },
    anCat: function (v) { anCat = v; anAll = false; anSort = { c: 1, d: -1 }; renderAnalyses(); }, anSortBy: function (i) { if (anSort.c === i) anSort.d = -anSort.d; else anSort = { c: i, d: i ? -1 : 1 }; renderAnalyses(); }, anAllT: function () { anAll = !anAll; renderAnalyses(); },
    anViewSet: function (v) { anView = v; renderAnalyses(); }, anPick: function (r) { anSel = anSel === r || !r ? null : r; renderAnalyses(); },
    anCsv: function () { if (!anTab) return; var t = [anTab.head].concat(anTab.rows).map(function (r) { return r.map(function (v) { return '"' + String(v < 0 ? '1-4' : v).replace(/"/g, '""') + '"'; }).join(','); }).join('\n'); var a = D.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + t], { type: 'text/csv;charset=utf-8' })); a.download = 'tabla_' + anCat + '.csv'; D.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 500); },
    kpi: function (c) { var k = IND[c] ? indKpi(c) : null; if (!k) return null; var x = catalog().find(function (i) { return i.code === c; }); var p = plain(c, x ? x.name : c, k.v); return { v: k.v, n: pnum(k.v), t: p.t, s: p.s, site: x ? indSite(x) : '' }; }, published: function () { return published().length; },
    dynSet: function (id, ty, btn) { DYN[id] = ty; var w = btn && btn.closest('.dynw'), card = w && w.closest('.lv11viz'), c = (card ? getComputedStyle(card).getPropertyValue('--c').trim() : '') || '#8E36CF', d = dynSVG(id, c); if (!w || !d) return; w.querySelector('.dbody').innerHTML = d.html; w.querySelectorAll('.dsw button').forEach(function (b) { b.classList.toggle('on', b === btn); }); },
    normTog: function (d) { if (d.open) { normOpen = d.dataset.k; d.parentNode.querySelectorAll('details[open]').forEach(function (o) { if (o !== d && !(nf.q || nf.right || nf.site)) o.open = false; }); } else if (normOpen === d.dataset.k) normOpen = null; },
    an: function (id) { try { return AN[id] ? AN[id]() : null; } catch (e) { return null; } }, deptName: function (c) { return deptName(c); },
    norms: function () { return S.norms.filter(function (n) { return n.pub; }); }, normCard: function (n) { return normCard(n); },
    sites: function () { return sites(); }, site: site, siteName: sName, render: renderAll, adm: ADM, icon: icon
  };
  W.LV11 = API;
  function normTarget() { return ADMIN ? D.querySelector('#normativa .lv11embed') : null; }
  function obsTarget() { return ADMIN ? D.querySelector('#red .lv11embed') : null; }

  function renderAll() {
    if (ADMIN) { renderAdmin(); return; }
    buildNav(); renderSites(); renderIndicators(); renderAnalyses(); renderNorms(); renderObs(); renderRoutes();
    if (typeof W.LV10_buildHero === 'function') try { W.LV10_buildHero(); } catch (e) {}
    W.help = function () { W.go('rutas'); };
    if (typeof W.v8Render === 'function') try { W.v8Render(); } catch (e) {}
  }
  function renderAdmin() {
    var nav = D.getElementById('navigation');
    if (nav && !nav.querySelector('[data-page="portal11"]')) { var b = D.createElement('button'); b.dataset.page = 'portal11'; b.setAttribute('data-no-translate', ''); b.onclick = function () { W.go('portal11'); }; var ref = nav.querySelector('[data-page="adminhome"]'); nav.insertBefore(b, ref ? ref.nextSibling : null); }
    var nb = nav && nav.querySelector('[data-page="portal11"]'); if (nb) nb.textContent = T('Contenidos del portal', 'Portal content');
    admSection();
    // Normativa y Fuentes en administración: misma vista pública, con acceso a edición.
    [['normativa', 'norms', renderNorms], ['red', 'obs', renderObs]].forEach(function (p) {
      if (!D.getElementById(p[0])) return; var sec = sectionEl(p[0]);
      sec.innerHTML = '<div class="lv11head"><div class="eyebrow">' + T('Administración', 'Administration') + '</div><h1>' + (p[0] === 'red' ? T('Observatorios y fuentes', 'Observatories and sources') : T('Normativa y derechos', 'Laws and rights')) + '</h1><p class="muted">' + T('Así lo ve el público. Para agregar o editar, usa «Contenidos del portal».', 'This is the public view. Use “Portal content” to edit.') + '</p><button class="lv11btn" onclick="LV11.adm.tab(\'' + p[1] + '\');go(\'portal11\')">' + icon('edit', 16) + ' ' + T('Editar en Contenidos del portal', 'Edit in Portal content') + '</button></div><div class="lv11embed"></div>';
      p[2](sec.querySelector('.lv11embed'));
    });
  }

  function init() {
    try { applyOvr(); } catch (e) {}
    // Corrección: el procesamiento v8 de PPED sumó también la fila «Total» del área (cabecera + rural + total),
    // lo que duplicaba la población de mujeres. Se divide entre dos solo si todos los valores son pares.
    var pr = V8D() && V8D().population && V8D().population.rows;
    if (pr && !V8D().population.lv11Fixed && pr.length && pr.every(function (r) { return r.women % 2 === 0; })) { pr.forEach(function (r) { r.women = r.women / 2; }); V8D().population.lv11Fixed = true; }
    if (!ADMIN) patchDashboard();
    if (!ADMIN && typeof W.go === 'function') { var _go = W.go; W.go = function (p) { if (!skipAuto && panoSite && ['indicadores', 'normativa', 'red'].indexOf(p) > -1) { var cur = p === 'indicadores' ? indFilter.site : p === 'normativa' ? nf.site : of.site; if (!cur) applySite(p, panoSite); } return _go.apply(this, arguments); }; }
    renderAll();
    if (typeof W.setLanguage === 'function') { var _sl = W.setLanguage; W.setLanguage = function () { var r = _sl.apply(this, arguments); setTimeout(renderAll, 30); return r; }; }
    // enlaces directos: #micrositios/violencias · ?sitio=violencias
    var m = location.hash.match(/^#(?:micrositios|libres)\/([\w-]+)/), q = new URLSearchParams(location.search).get('sitio');
    if (!ADMIN && (m || q)) setTimeout(function () { API.openSite((m && m[1]) || q); }, 120);
    else if (!ADMIN && location.hash === '#rutas') setTimeout(function () { W.go('rutas'); }, 120); else if (!ADMIN && location.hash === '#micrositios') setTimeout(function () { W.go('libres'); }, 120);
    W.addEventListener('storage', function (e) { if (e.key === KEY) { load(); renderAll(); } });
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { setTimeout(init, 60); }); else setTimeout(init, 60);
})();
