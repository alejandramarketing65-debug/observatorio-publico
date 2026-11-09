/* ==========================================================================
   LIBRES v29 · Visualizaciones interactivas (referencia de patrones tipo Flourish)
   - Indicadores: pestañas «Catálogo», «Compara territorios» (barras que se
     reordenan con animación al cambiar de tema o de zona) y «Cómo procesamos
     los datos» (recorrido por pasos con contadores y embudo animado).
   - Indicadores en el mapa: tarjetas de exploración rápida que encienden la
     capa, el nivel y la zona en el visor con un solo toque.
   Datos: agregados de Medicina Legal 2025 (preliminar) por departamento y
   zona (LV23_TERR); celdas de 1 a 4 se muestran como «1–4».
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window;
  function en() { try { if (typeof language === 'string') return language === 'en'; } catch (e) {} return (D.documentElement.lang || 'es').indexOf('en') === 0; }
  function T(es, e) { return en() ? e : es; }
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function N(v) { return Number(v).toLocaleString(en() ? 'en-US' : 'es-CO'); }
  var reduced = W.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function calm() { return reduced || D.documentElement.classList.contains('lv23calm'); }

  var THEMES = [
    ['PAR', 'Violencia de pareja', 'Partner violence', '#D33B78'],
    ['SEX', 'Violencia sexual', 'Sexual violence', '#8E36CF'],
    ['NNA', 'Violencia contra niñas', 'Violence against girls', '#EF6B4A'],
    ['FAM', 'Violencia de otros familiares', 'Violence by other relatives', '#1A82B9'],
    ['MAY', 'Violencia contra mujeres mayores', 'Violence against older women', '#17A58C'],
    ['HOM', 'Homicidios de mujeres', 'Homicides of women', '#9E2C5A']
  ];
  var st = { tab: 'cat', th: 'PAR', zona: 'T', n: 12 };
  function dname(c) { return (W.LV11 && W.LV11.deptName && W.LV11.deptName(c)) || c; }
  function rows() {
    var K = W.LV23_TERR && W.LV23_TERR.K && W.LV23_TERR.K[st.th]; if (!K) return [];
    var x = K.x, idx = { T: 0, U: 1, R: 2 }[st.zona] * (x ? 2 : 1);
    return Object.keys(K.dep).map(function (d) { var v = K.dep[d][idx]; return { d: d, n: dname(d), v: v }; }).filter(function (r) { return r.v !== 0; }).sort(function (a, b) { return (b.v < 0 ? 2 : b.v) - (a.v < 0 ? 2 : a.v); });
  }
  function compareHTML() {
    var th = THEMES.filter(function (t) { return t[0] === st.th; })[0];
    return '<div class="l30cmp" style="--c:' + th[3] + '"><div class="l30ctl"><div class="l30chips">' + THEMES.map(function (t) { return '<button type="button" data-th="' + t[0] + '" style="--c:' + t[3] + '"' + (t[0] === st.th ? ' class="on"' : '') + '>' + T(t[1], t[2]) + '</button>'; }).join('') + '</div>' +
      '<div class="l30seg" role="group" aria-label="' + T('Zona', 'Area') + '">' + [['T', 'Todo el territorio', 'All'], ['U', 'Urbano', 'Urban'], ['R', 'Rural', 'Rural']].map(function (z) { return '<button type="button" data-z="' + z[0] + '"' + (z[0] === st.zona ? ' class="on"' : '') + '>' + T(z[1], z[2]) + '</button>'; }).join('') + '</div></div>' +
      '<div class="l30race" id="l30race" aria-live="polite"></div><div class="l30foot"><button type="button" data-more="1">' + T('Ver todos los departamentos', 'Show all departments') + '</button><small>' + T('Mujeres · 2025, cifras preliminares · Medicina Legal. «1–4»: dato protegido.', 'Women · 2025, preliminary · Forensic institute. «1–4»: protected cell.') + '</small></div></div>';
  }
  function race(first) {
    var box = D.getElementById('l30race'); if (!box) return;
    var rs = rows(), top = rs.slice(0, st.n), mx = Math.max.apply(null, top.map(function (r) { return r.v; }).concat([1])), H = 38;
    box.style.height = (top.length * H + 8) + 'px';
    var seen = {};
    top.forEach(function (r, i) {
      seen[r.d] = 1;
      var el = box.querySelector('[data-d="' + r.d + '"]');
      if (!el) { el = D.createElement('div'); el.className = 'bar'; el.dataset.d = r.d; el.innerHTML = '<span class="nm"></span><span class="tr"><i></i></span><b></b>'; el.style.transform = 'translateY(' + (top.length * H) + 'px)'; el.style.opacity = '0'; box.appendChild(el); }
      el.querySelector('.nm').textContent = (i + 1) + '. ' + r.n;
      requestAnimationFrame(function () { el.style.opacity = '1'; el.style.transform = 'translateY(' + (i * H) + 'px)'; el.querySelector('i').style.width = (r.v < 0 ? 1 : Math.max(1.5, r.v / mx * 100)) + '%'; });
      countTo(el.querySelector('b'), r.v);
    });
    [].forEach.call(box.querySelectorAll('.bar'), function (el) { if (!seen[el.dataset.d]) { el.style.opacity = '0'; setTimeout(function () { if (el.style.opacity === '0') el.remove(); }, 500); } });
    var mb = D.querySelector('.l30foot [data-more]'); if (mb) mb.textContent = st.n < rs.length ? T('Ver los ' + rs.length + ' departamentos', 'Show all ' + rs.length + ' departments') : T('Ver solo los 12 primeros', 'Show top 12 only');
  }
  function countTo(el, v) {
    if (v < 0) { el.textContent = '1–4'; return; }
    var from = parseInt(String(el.dataset.v || 0), 10) || 0; el.dataset.v = v;
    if (calm() || from === v) { el.textContent = N(v); return; }
    var t0 = performance.now(), dur = 700;
    (function step(t) { var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = N(Math.round(from + (v - from) * e)); if (k < 1) requestAnimationFrame(step); })(t0);
  }
  // recorrido del procesamiento (ejemplo real: base de lesiones por violencia de pareja)
  var STEPS = [
    [438786, 'Registros recibidos', 'Records received', 'Medicina Legal entrega el archivo con cada caso atendido.', 'The forensic institute delivers the file with each case.', '#8E36CF'],
    [438717, 'Registros revisados', 'Records checked', 'Se descartan duplicados y los 69 casos sin departamento válido.', 'Duplicates and the 69 cases without a valid department are set aside.', '#5B5BD6'],
    [657, 'Grupos de conteo', 'Count groups', 'Se cuentan los casos por año, departamento y sexo. Nunca se publica un caso suelto.', 'Cases are counted by year, department and sex. No single case is published.', '#1A82B9'],
    [23, 'Grupos protegidos', 'Protected groups', 'Los grupos con 1 a 4 casos se ocultan para que nadie pueda ser identificada.', 'Groups with 1 to 4 cases are hidden so no one can be identified.', '#E0A800'],
    [634, 'Cifras publicadas', 'Figures published', 'Son las que ves en el mapa, las gráficas y las descargas.', 'These are the figures on the map, charts and downloads.', '#17A58C']
  ];
  function processHTML() {
    return '<div class="l30proc"><p class="l30lead">' + T('Así pasa un archivo de datos a las cifras que ves. Ejemplo: lesiones por violencia de pareja.', 'How a data file becomes the figures you see. Example: partner violence injuries.') + '</p><ol class="l30flow">' +
      STEPS.map(function (s, i) { var h = Math.max(8, Math.log10(s[0] + 1) / Math.log10(STEPS[0][0] + 1) * 100); return '<li style="--c:' + s[5] + ';--h:' + h.toFixed(1) + '%;--i:' + i + '"><div class="col"><span class="fill"></span></div><b data-n="' + s[0] + '">0</b><em>' + T(s[1], s[2]) + '</em><small>' + T(s[3], s[4]) + '</small></li>'; }).join('') +
      '</ol><div class="l30safe"><b>' + T('Lo que nunca se publica', 'What is never published') + '</b><span>' + T('Nombres, documentos, día u hora exactos, dirección ni ningún dato que permita ubicar a una mujer.', 'Names, IDs, exact day or time, address or anything that could locate a woman.') + '</span></div></div>';
  }
  function playProcess() {
    var box = D.querySelector('.l30proc'); if (!box || box.dataset.played) return; box.dataset.played = 1;
    box.classList.add('go'); box.querySelectorAll('[data-n]').forEach(function (b, i) { setTimeout(function () { countTo(b, +b.dataset.n); }, calm() ? 0 : i * 260); });
  }

  /* ---------- v30: más tipos de gráfica (patrones tipo Flourish) ---------- */
  var KEYS = [['PAR', 'Pareja', 'Partner', '#D33B78'], ['SEX', 'Sexual', 'Sexual', '#8E36CF'], ['NNA', 'Niñas', 'Girls', '#EF6B4A'], ['FAM', 'Otros familiares', 'Other relatives', '#1A82B9'], ['MAY', 'Mujeres mayores', 'Older women', '#17A58C'], ['HOM', 'Homicidios', 'Homicides', '#9E2C5A'], ['SUI', 'Suicidios', 'Suicides', '#5B5BD6']];
  function natZones(k) { var K = W.LV23_TERR && W.LV23_TERR.K[k]; if (!K) return null; var x = K.x, o = { U: 0, R: 0, S: 0 }; Object.keys(K.dep).forEach(function (d) { var a = K.dep[d]; o.U += Math.max(0, a[x ? 2 : 1]); o.R += Math.max(0, a[x ? 4 : 2]); o.S += Math.max(0, a[x ? 6 : 3]); }); return o; }
  function arc(cx, cy, r0, r1, a0, a1) { var la = a1 - a0 > Math.PI ? 1 : 0, p = function (r, a) { return (cx + r * Math.sin(a)).toFixed(2) + ' ' + (cy - r * Math.cos(a)).toFixed(2); }; return 'M' + p(r1, a0) + 'A' + r1 + ' ' + r1 + ' 0 ' + la + ' 1 ' + p(r1, a1) + 'L' + p(r0, a1) + 'A' + r0 + ' ' + r0 + ' 0 ' + la + ' 0 ' + p(r0, a0) + 'Z'; }
  function sunHTML() {
    var data = KEYS.map(function (k) { var z = natZones(k[0]); return z ? { k: k, z: z, t: z.U + z.R + z.S } : null; }).filter(Boolean), tot = data.reduce(function (s, d) { return s + d.t; }, 0), a = 0, h = '';
    data.forEach(function (d, i) {
      var a1 = a + d.t / tot * Math.PI * 2, mid = (a + a1) / 2;
      h += '<path class="s1" d="' + arc(200, 200, 72, 140, a, a1 - .004) + '" fill="' + d.k[3] + '" data-tip="' + E(T(d.k[1], d.k[2]) + '|' + N(d.t) + '|' + (d.t / tot * 100).toFixed(1)) + '" style="--i:' + i + '"/>';
      if (a1 - a > .22) h += '<text class="sl" x="' + (200 + 106 * Math.sin(mid)).toFixed(1) + '" y="' + (200 - 106 * Math.cos(mid) + 4).toFixed(1) + '">' + E(T(d.k[1], d.k[2])) + '</text>';
      var b = a; [['U', T('urbano', 'urban'), .92], ['R', T('rural', 'rural'), .62], ['S', T('sin dato', 'no data'), .3]].forEach(function (z) { var v = d.z[z[0]]; if (!v) return; var b1 = b + v / tot * Math.PI * 2; h += '<path class="s2" d="' + arc(200, 200, 144, 196, b, b1 - .003) + '" fill="' + d.k[3] + '" fill-opacity="' + z[2] + '" data-tip="' + E(T(d.k[1], d.k[2]) + ' · ' + z[1] + '|' + N(v) + '|' + (v / d.t * 100).toFixed(1) + ' % ' + T('de este tipo', 'of this type')) + '"/>'; if (b1 - b > .2) { var m = (b + b1) / 2; h += '<text class="sz" x="' + (200 + 170 * Math.sin(m)).toFixed(1) + '" y="' + (200 - 170 * Math.cos(m) + 4).toFixed(1) + '">' + z[1] + '</text>'; } b = b1; });
      a = a1;
    });
    return '<div class="l30box l30sun"><div class="l30txt"><h3>' + T('¿Qué violencias y dónde ocurren?', 'Which violence and where?') + '</h3><p>' + T('Anillo interior: tipo de violencia. Anillo exterior: si pasó en zona urbana o rural. Pasa el puntero o toca para ver el número.', 'Inner ring: type of violence. Outer ring: urban or rural. Hover or tap for the number.') + '</p><div class="l30lg">' + data.map(function (d) { return '<span><i style="background:' + d.k[3] + '"></i>' + T(d.k[1], d.k[2]) + ' · ' + N(d.t) + '</span>'; }).join('') + '</div><small>' + T('Mujeres · 2025, cifras preliminares · Medicina Legal', 'Women · 2025, preliminary · Forensic institute') + '</small></div>' +
      '<div class="l30svgw"><svg viewBox="0 0 400 400" class="sun" role="img" aria-label="' + T('Gráfico de sol de tipos de violencia y zona', 'Sunburst of violence types and area') + '">' + h + '<circle cx="200" cy="200" r="68" fill="#fff"/><text class="c1" x="200" y="194">' + N(tot) + '</text><text class="c2" x="200" y="216">' + T('casos de mujeres', 'cases of women') + '</text></svg></div></div>';
  }
  function perfAgg(key, dim) {
    var P = W.LV23_TERR && W.LV23_TERR.perf; if (!P) return [];
    var src = P.p[key] && P.p[key].d, acc = {};
    Object.keys(src || {}).forEach(function (d) { (src[d][dim] || []).forEach(function (r) { if (r[1] > 0) acc[r[0]] = (acc[r[0]] || 0) + r[1]; }); });
    var rows = Object.keys(acc).map(function (i) { return [P.lab[i], acc[i]]; }).sort(function (a, b) { return b[1] - a[1]; });
    var top = rows.slice(0, 5), rest = rows.slice(5).reduce(function (s, r) { return s + r[1]; }, 0); if (rest) top.push([T('Otros', 'Others'), rest]); return top;
  }
  var wst = { key: 'PAR', dim: 'cv' };
  var WCOL = ['#D33B78', '#8E36CF', '#1A82B9', '#17A58C', '#E0A800', '#c9bcd6'];
  function waffleHTML() {
    var rows = perfAgg(wst.key, wst.dim), tot = rows.reduce(function (s, r) { return s + r[1]; }, 0) || 1, n = 200, cells = [], acc = 0;
    rows.forEach(function (r, i) { var c = Math.round((acc + r[1]) / tot * n) - Math.round(acc / tot * n); acc += r[1]; for (var j = 0; j < c; j++) cells.push(i); });
    var dims = [['cv', 'Edad', 'Age'], ['ag', 'Presunto agresor', 'Aggressor'], ['es', 'Lugar del hecho', 'Place'], ['et', 'Pertenencia étnica', 'Ethnicity'], ['di', 'Discapacidad', 'Disability'], ['os', 'Orientación sexual', 'Sexual orientation']];
    return '<div class="l30box l30waf"><div class="l30txt"><h3>' + T('¿Quiénes son las víctimas?', 'Who are the victims?') + '</h3><p>' + T('Cada punto es el 0,5 % de las mujeres atendidas en 2024. Elige el tipo de violencia y la característica.', 'Each dot is 0.5% of women attended in 2024. Choose violence type and characteristic.') + '</p>' +
      '<div class="l30seg">' + [['PAR', 'Violencia de pareja', 'Partner violence'], ['SEX', 'Violencia sexual', 'Sexual violence']].map(function (k) { return '<button type="button" data-wk="' + k[0] + '"' + (wst.key === k[0] ? ' class="on"' : '') + '>' + T(k[1], k[2]) + '</button>'; }).join('') + '</div>' +
      '<div class="l30dims">' + dims.map(function (d) { return '<button type="button" data-wd="' + d[0] + '"' + (wst.dim === d[0] ? ' class="on"' : '') + '>' + T(d[1], d[2]) + '</button>'; }).join('') + '</div>' +
      '<div class="l30lg v">' + rows.map(function (r, i) { return '<span data-wi="' + i + '"><i style="background:' + WCOL[i] + '"></i><em>' + E(r[0]) + '</em><b>' + (r[1] / tot * 100).toFixed(1).replace('.', ',') + ' %</b></span>'; }).join('') + '</div></div>' +
      '<div class="l30dots">' + cells.map(function (c, i) { return '<i data-wi="' + c + '" style="background:' + WCOL[c] + ';--i:' + i + '"></i>'; }).join('') + '</div></div>';
  }
  var lst = 'pareja';
  function lineHTML() {
    var A = W.LV11 && W.LV11.an, src = lst === 'pareja' ? A && A('pareja-serie') : A && A('ins-notificacion'); if (!src || !src.rows) return '';
    var pts = src.rows.slice(1).map(function (r) { return [+String(r[0]).slice(0, 4), +r[1]]; }), x0 = pts[0][0], x1 = pts[pts.length - 1][0], ymax = Math.max.apply(null, pts.map(function (p) { return p[1]; })) * 1.15;
    var W0 = 760, H0 = 300, L = 54, R = 20, Tp = 30, B = 34, X = function (x) { return L + (x - x0) / (x1 - x0) * (W0 - L - R); }, Y = function (y) { return Tp + (1 - y / ymax) * (H0 - Tp - B); };
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1); }).join(' '), area = d + ' L' + X(x1) + ' ' + Y(0) + ' L' + X(x0) + ' ' + Y(0) + 'Z';
    var ann = x0 <= 2020 && x1 >= 2020 ? '<rect x="' + (X(2020) - 14) + '" y="' + Tp + '" width="28" height="' + (H0 - Tp - B) + '" class="band"/><text class="ann" x="' + X(2020) + '" y="' + (Tp - 8) + '">' + T('Pandemia 2020', 'Pandemic 2020') + '</text>' : '';
    var mx = pts.reduce(function (m, p) { return p[1] > m[1] ? p : m; }, pts[0]);
    var grid = [0, .25, .5, .75, 1].map(function (f) { var v = ymax * f; return '<line x1="' + L + '" x2="' + (W0 - R) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" class="g"/><text class="ax" x="' + (L - 8) + '" y="' + (Y(v) + 4) + '">' + N(Math.round(v / 1000)) + ' mil</text>'; }).join('');
    return '<div class="l30box l30line"><div class="l30top"><div><h3>' + (lst === 'pareja' ? T('Lesiones por violencia de pareja contra mujeres', 'Partner violence injuries to women') : T('Violencias de género contra mujeres notificadas en salud', 'Gender violence against women notified by health services')) + '</h3><p>' + T('Pasa el puntero por la línea para ver cada año.', 'Hover the line to see each year.') + '</p></div><div class="l30seg"><button type="button" data-ls="pareja"' + (lst === 'pareja' ? ' class="on"' : '') + '>' + T('Medicina Legal', 'Forensic') + '</button><button type="button" data-ls="salud"' + (lst === 'salud' ? ' class="on"' : '') + '>' + T('Sector salud', 'Health') + '</button></div></div>' +
      '<svg viewBox="0 0 ' + W0 + ' ' + H0 + '" class="ln" data-x0="' + x0 + '" data-pts="' + E(JSON.stringify(pts)) + '">' + grid + ann + '<path class="ar" d="' + area + '"/><path class="lp" d="' + d + '" pathLength="1"/>' + pts.map(function (p) { return '<circle cx="' + X(p[0]).toFixed(1) + '" cy="' + Y(p[1]).toFixed(1) + '" r="4" class="pt"/>'; }).join('') +
      '<text class="ax" x="' + X(x0) + '" y="' + (H0 - 10) + '" text-anchor="start">' + x0 + '</text><text class="ax" x="' + X(x1) + '" y="' + (H0 - 10) + '" text-anchor="end">' + x1 + '</text>' +
      '<g class="pk"><circle cx="' + X(mx[0]) + '" cy="' + Y(mx[1]) + '" r="7"/><text x="' + X(mx[0]) + '" y="' + (Y(mx[1]) - 14) + '">' + T('Máximo', 'Peak') + ' ' + mx[0] + ': ' + N(mx[1]) + '</text></g>' +
      '<g class="hv" style="display:none"><line y1="' + Tp + '" y2="' + (H0 - B) + '"/><circle r="6"/><rect rx="8" width="120" height="44"/><text class="t1"></text><text class="t2"></text></g><rect class="ov" x="' + L + '" y="' + Tp + '" width="' + (W0 - L - R) + '" height="' + (H0 - Tp - B) + '" data-l="' + L + '" data-w="' + (W0 - L - R) + '" data-ymax="' + ymax + '" data-tp="' + Tp + '" data-ih="' + (H0 - Tp - B) + '"/></svg><small>' + E(src.src || '') + '</small></div>';
  }
  var bth = 'ALL';
  function bubData() {
    var K = W.LV23_TERR && W.LV23_TERR.K, acc = {}; if (!K) return [];
    (bth === 'ALL' ? ['PAR', 'SEX', 'NNA', 'FAM', 'MAY', 'HOM'] : [bth]).forEach(function (k) { var Q = K[k]; Object.keys(Q.dep).forEach(function (d) { acc[d] = (acc[d] || 0) + Math.max(0, Q.dep[d][0]); }); });
    return Object.keys(acc).map(function (d) { return { d: d, n: dname(d), v: acc[d] }; }).filter(function (x) { return x.v > 0; }).sort(function (a, b) { return b.v - a.v; });
  }
  function pack(items, W0, H0) {
    var mx = items[0] ? items[0].v : 1, placed = [], k = Math.min(W0, H0) * .2;
    items.forEach(function (it) { it.r = Math.max(9, Math.sqrt(it.v / mx) * k); });
    items.forEach(function (it, i) {
      if (!i) { it.x = W0 / 2; it.y = H0 / 2; placed.push(it); return; }
      for (var t = 0; t < 6000; t += 1) { var a = t * .21, rr = 2 + t * .35, x = W0 / 2 + rr * Math.cos(a) * 1.35, y = H0 / 2 + rr * Math.sin(a); if (x - it.r < 2 || x + it.r > W0 - 2 || y - it.r < 2 || y + it.r > H0 - 2) continue; if (placed.every(function (p) { var dx = p.x - x, dy = p.y - y; return dx * dx + dy * dy >= Math.pow(p.r + it.r + 2, 2); })) { it.x = x; it.y = y; placed.push(it); return; } }
    });
    return placed;
  }
  function bubHTML() {
    var it = pack(bubData(), 760, 460), mx = it[0] ? it[0].v : 1, th = KEYS.filter(function (k) { return k[0] === bth; })[0], col = th ? th[3] : '#8E36CF';
    return '<div class="l30box l30bub"><div class="l30top"><div><h3>' + T('¿Dónde se concentran los casos?', 'Where are cases concentrated?') + '</h3><p>' + T('Cada burbuja es un departamento; el tamaño es el número de casos de mujeres en 2025.', 'Each bubble is a department; size is the number of cases of women in 2025.') + '</p></div><div class="l30chips">' + [['ALL', 'Todas', 'All', '#8E36CF']].concat(KEYS.slice(0, 6)).map(function (k) { return '<button type="button" data-bt="' + k[0] + '" style="--c:' + k[3] + '"' + (bth === k[0] ? ' class="on"' : '') + '>' + T(k[1], k[2]) + '</button>'; }).join('') + '</div></div>' +
      '<svg viewBox="0 0 760 460" class="bb">' + it.map(function (b, i) { return '<g transform="translate(' + b.x.toFixed(1) + ' ' + b.y.toFixed(1) + ')"><g class="b" style="--i:' + i + '" data-tip="' + E(b.n + '|' + N(b.v)) + '"><circle r="' + b.r.toFixed(1) + '" fill="' + col + '" fill-opacity="' + (.35 + .65 * b.v / mx).toFixed(2) + '"/>' + (b.r > 30 ? '<text y="-2">' + E(b.n.length > 12 ? b.n.slice(0, 11) + '…' : b.n) + '</text><text y="14" class="v">' + N(b.v) + '</text>' : '') + '</g></g>'; }).join('') + '</svg><small>' + T('Mujeres · 2025, cifras preliminares · Medicina Legal', 'Women · 2025, preliminary') + '</small></div>';
  }
  function gaugeHTML() {
    var K = W.LV11 && W.LV11.kpi; if (!K) return '';
    var g = ['VBG-04', 'VBG-02', 'CUI-04', 'ECO-01', 'ECO-02', 'ECO-03', 'DEM-01'].map(function (c) { var k = K(c); return k && k.n != null ? [c, k] : null; }).filter(Boolean);
    var cols = ['#D33B78', '#8E36CF', '#E0A800', '#22A37A', '#17A58C', '#EF6B4A', '#5B5BD6'];
    return '<div class="l30box l30gau"><div class="l30top"><div><h3>' + T('Las cifras de un vistazo', 'Figures at a glance') + '</h3><p>' + T('Cada medidor va de 0 a 100 %.', 'Each gauge goes from 0 to 100%.') + '</p></div></div><div class="gg">' + g.map(function (x, i) { var p = Math.max(0, Math.min(100, x[1].n)), a = -Math.PI / 2 + p / 100 * Math.PI; return '<div class="gc" style="--c:' + cols[i] + ';--p:' + p + ';--i:' + i + '"><svg viewBox="0 0 200 118"><path d="' + arc(100, 104, 64, 90, -Math.PI / 2, Math.PI / 2) + '" class="bg"/><path d="' + arc(100, 104, 64, 90, -Math.PI / 2, a) + '" class="fg"/><line x1="100" y1="104" x2="' + (100 + 82 * Math.sin(a)).toFixed(1) + '" y2="' + (104 - 82 * Math.cos(a)).toFixed(1) + '" class="nd"/><circle cx="100" cy="104" r="7" class="hub"/></svg><b>' + E(x[1].v) + '</b><em>' + E(x[1].t) + '</em><small>' + E(x[1].s) + '</small></div>'; }).join('') + '</div></div>';
  }
  function wireViz(box) {
    var tip = D.getElementById('l30tip'); if (!tip) { tip = D.createElement('div'); tip.id = 'l30tip'; D.body.appendChild(tip); }
    box.addEventListener('pointermove', function (e) {
      var t = e.target.closest('[data-tip]');
      if (t) { var p = t.dataset.tip.split('|'); tip.innerHTML = '<b>' + E(p[0]) + '</b><span>' + E(p[1]) + (p[2] ? ' · ' + E(p[2]) + (/%/.test(p[2]) ? '' : ' %') : '') + '</span>'; tip.style.left = Math.min(innerWidth - 220, e.clientX + 14) + 'px'; tip.style.top = (e.clientY + 14) + 'px'; tip.classList.add('on'); }
      else tip.classList.remove('on');
      var ov = e.target.closest('rect.ov');
      var svg = box.querySelector('svg.ln'); if (!svg) return; var hv = svg.querySelector('.hv');
      if (!ov) { hv.style.display = 'none'; return; }
      var pts = JSON.parse(svg.dataset.pts), r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal, sx = (e.clientX - r.left) / r.width * vb.width, L = +ov.dataset.l, Wd = +ov.dataset.w, ym = +ov.dataset.ymax, tp = +ov.dataset.tp, ih = +ov.dataset.ih;
      var x0 = pts[0][0], x1 = pts[pts.length - 1][0], yr = Math.round(x0 + (sx - L) / Wd * (x1 - x0)), p = pts.filter(function (q) { return q[0] === yr; })[0]; if (!p) return;
      var X = L + (p[0] - x0) / (x1 - x0) * Wd, Y = tp + (1 - p[1] / ym) * ih;
      hv.style.display = ''; hv.querySelector('line').setAttribute('x1', X); hv.querySelector('line').setAttribute('x2', X); hv.querySelector('circle').setAttribute('cx', X); hv.querySelector('circle').setAttribute('cy', Y);
      var bx = X > vb.width - 150 ? X - 132 : X + 12; hv.querySelector('rect').setAttribute('x', bx); hv.querySelector('rect').setAttribute('y', Y - 52);
      var t1 = hv.querySelector('.t1'), t2 = hv.querySelector('.t2'); t1.setAttribute('x', bx + 12); t1.setAttribute('y', Y - 33); t1.textContent = p[0]; t2.setAttribute('x', bx + 12); t2.setAttribute('y', Y - 15); t2.textContent = N(p[1]) + ' ' + T('casos', 'cases');
    });
    box.addEventListener('pointerleave', function () { tip.classList.remove('on'); });
    box.addEventListener('pointerover', function (e) { var w = e.target.closest('[data-wi]'); box.querySelectorAll('.l30dots i').forEach(function (i) { i.classList.toggle('dim', !!w && i.dataset.wi !== w.dataset.wi); }); });
  }
  function mountInd() {
    var sec = D.getElementById('indicadores'); if (!sec) return;
    var head = sec.querySelector('.lv11head'); if (!head) return;
    var box = D.getElementById('lv30');
    if (box && box.previousElementSibling === head && box.dataset.lang === (en() ? 'en' : 'es')) { if (W.LV30_TAB) { st.tab = W.LV30_TAB; W.LV30_TAB = null; paint(box); } sec.classList.toggle('l30alt', st.tab !== 'cat'); return; }
    if (box) box.remove();
    box = D.createElement('div'); box.id = 'lv30'; box.dataset.lang = en() ? 'en' : 'es'; box.setAttribute('data-no-translate', '');
    box.addEventListener('click', function (e) {
      var v = e.target.closest('[data-wk],[data-wd],[data-ls],[data-bt]');
      if (v) { if (v.dataset.wk) wst.key = v.dataset.wk; if (v.dataset.wd) wst.dim = v.dataset.wd; if (v.dataset.ls) lst = v.dataset.ls; if (v.dataset.bt) bth = v.dataset.bt; paint(box); return; }
      var b = e.target.closest('[data-tab],[data-th],[data-z],[data-more]'); if (!b) return;
      if (b.dataset.tab) { st.tab = b.dataset.tab; paint(box); return; }
      if (b.dataset.th) { st.th = b.dataset.th; box.querySelectorAll('[data-th]').forEach(function (x) { x.classList.toggle('on', x === b); }); var th = THEMES.filter(function (t) { return t[0] === st.th; })[0]; box.querySelector('.l30cmp').style.setProperty('--c', th[3]); race(); return; }
      if (b.dataset.z) { st.zona = b.dataset.z; box.querySelectorAll('[data-z]').forEach(function (x) { x.classList.toggle('on', x === b); }); race(); return; }
      if (b.dataset.more) { st.n = st.n > 12 ? 12 : 40; race(); }
    });
    head.parentNode.insertBefore(box, head.nextSibling); wireViz(box);
    if (W.LV30_TAB) { st.tab = W.LV30_TAB; W.LV30_TAB = null; }
    paint(box);
  }
  function paint(box) {
    var sec = D.getElementById('indicadores');
    box.innerHTML = '<div class="l30tabs" role="tablist">' + [['cat', 'Todos', 'All'], ['med', 'De un vistazo', 'At a glance'], ['cmp', 'Compara territorios', 'Compare territories'], ['burb', 'Dónde se concentran', 'Where cases are'], ['sun', 'Tipos y zonas', 'Types and areas'], ['quien', 'Quiénes son', 'Who they are'], ['tiempo', 'En el tiempo', 'Over time'], ['proc', 'Cómo procesamos', 'How we process']].map(function (t) { return '<button type="button" role="tab" data-tab="' + t[0] + '" aria-selected="' + (t[0] === st.tab) + '"' + (t[0] === st.tab ? ' class="on"' : '') + '>' + T(t[1], t[2]) + '</button>'; }).join('') + '</div>' +
      ({ cmp: compareHTML, proc: processHTML, sun: sunHTML, quien: waffleHTML, tiempo: lineHTML, burb: bubHTML, med: gaugeHTML }[st.tab] || function () { return ''; })();
    sec.classList.toggle('l30alt', st.tab !== 'cat');
    if (st.tab === 'cmp') race(true);
    if (st.tab === 'proc') setTimeout(playProcess, 120);
  }

  /* ---------- Indicadores en el mapa: exploración rápida ---------- */
  var QUICK = [
    ['X-PAR', 'mun', 'T', 'Violencia de pareja en cada municipio', 'Partner violence in each municipality', '#D33B78'],
    ['VBG-01', 'mun', 'R', 'Violencia sexual en zonas rurales', 'Sexual violence in rural areas', '#8E36CF'],
    ['AMP-V01', 'dep', 'T', 'Homicidios de mujeres por departamento', 'Homicides of women by department', '#9E2C5A'],
    ['CUI-04', 'dep', 'T', 'Quién hace el trabajo del hogar', 'Who does the housework', '#E0A800']
  ];
  function viewer() { var h = D.getElementById('lv20host'); return h && h.shadowRoot; }
  function applyQuick(q) {
    var r = viewer(); if (!r) return;
    var lvl = r.querySelector('button[data-lvl="dep"]'); if (lvl && !lvl.classList.contains('on')) lvl.click();
    r.querySelectorAll('#capasb input[type=checkbox]:checked').forEach(function (i) { if (i.dataset.l !== q[0]) i.click(); });
    setTimeout(function () {
      r = viewer(); var inp = r.querySelector('#capasb input[data-l="' + q[0] + '"]'); if (inp && !inp.checked) inp.click();
      setTimeout(function () {
        r = viewer(); if (q[1] === 'mun') { var b = r.querySelector('button[data-lvl="mun"]'); if (b) b.click(); }
        setTimeout(function () { r = viewer(); var z = r.getElementById('zsel'); if (z && z.value !== q[2]) { z.value = q[2]; z.dispatchEvent(new Event('change')); } var host = D.getElementById('lv20host'); if (host) scrollTo({ top: host.getBoundingClientRect().top + scrollY - 140, behavior: 'smooth' }); }, 120);
      }, 120);
    }, 120);
  }
  function mountMap() {
    var sec = D.getElementById('mapa'), host = D.getElementById('lv20host'); if (!sec || !host) return;
    var q = D.getElementById('lv30q'); if (q && q.nextElementSibling === host) return;
    if (!q) {
      q = D.createElement('div'); q.id = 'lv30q'; q.setAttribute('data-no-translate', '');
      q.innerHTML = '<b class="t">' + T('Empieza con una pregunta', 'Start with a question') + '</b><div class="g">' + QUICK.map(function (x, i) { return '<button type="button" data-q="' + i + '" style="--c:' + x[5] + '"><span class="ic">' + (i + 1) + '</span><span>' + T(x[3], x[4]) + '</span></button>'; }).join('') + '</div>';
      q.addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (!b) return; q.querySelectorAll('[data-q]').forEach(function (x) { x.classList.toggle('on', x === b); }); applyQuick(QUICK[+b.dataset.q]); });
    }
    host.parentNode.insertBefore(q, host);
  }
  function tick() { try { mountInd(); mountMap(); } catch (e) { if (W.console) console.warn('lv25', e); } }
  function init() { tick(); var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(tick, 150); }).observe(D.querySelector('main') || D.body, { childList: true, subtree: true }); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { setTimeout(init, 600); }); else setTimeout(init, 600);
})();
