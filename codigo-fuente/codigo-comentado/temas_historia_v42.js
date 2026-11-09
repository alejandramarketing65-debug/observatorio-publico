/* v42 · Páginas de tema como en el diseño base «Cifras que cuentan»
   Cada línea temática se divide en hojas:
     Historia · Más cifras · De dónde salen los datos · Normas (n) · Observatorios (n)
   La hoja «Historia» es un relato por pasos: a la izquierda el texto («Paso 2 de 12»,
   la cifra, la frase en lenguaje sencillo y el botón Escuchar); a la derecha una tarjeta fija
   con la gráfica que cambia al bajar (pictograma de 100 personas, cifra grande o la gráfica
   del análisis). «Escuchar toda la historia» lee los pasos en voz alta y avanza sola.
   Usa los datos que ya calcula el portal (LV11.kpi, LV11.an, LV11.counts, LV11.norms, LV11.obsFor). */
(function () {
  var D = document, W = window, R = D.documentElement;
  // v49: se activa en la consulta pública con cualquier nombre de archivo (index.html en GitHub Pages); nunca en administración
  if (/Administracion/i.test(location.pathname) || D.documentElement.dataset.perfil === 'admin') return;
  function en() { return (R.lang || 'es').indexOf('en') === 0; }
  function T(es, e) { return en() ? e : es; }
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function siteOpen() { var m = /^#libres\/([\w-]+)/.exec(location.hash); var p = D.querySelector('main .page.active'); return m && p && p.id === 'libres' ? m[1] : null; }
  var ARR = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var BACK = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
  var SPK = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
  var STOP = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>';
  // colibrí sencillo (marca ¡LIBRES!) para las frases en lenguaje sencillo
  var BIRD = '<svg class="bird" viewBox="0 0 64 40" width="54" height="34" aria-hidden="true"><path d="M6 30c8-1 16-5 22-11 4-4 9-7 15-7l17-4-15 7c-2 5-6 10-13 13-8 3-17 3-26 2z" class="b1"/><path d="M28 19c-3-6-2-12 3-17-1 6 1 10 5 13z" class="b2"/><path d="M22 23c-4-4-6-9-4-14 1 5 4 8 8 10z" class="b3"/><circle cx="44" cy="13" r="1.6" class="b2"/></svg>';
  // persona para el pictograma
  function person(x, y, on, i) { return '<g transform="translate(' + x + ',' + y + ')" class="' + (on ? 'on' : 'off') + '" style="animation-delay:' + Math.min(900, (i || 0) * 7) + 'ms"><circle cx="7" cy="4" r="4"/><path d="M1 21v-6a6 6 0 0 1 12 0v6z"/></g>'; }

  // enlace directo a un tema (#libres/violencias): se recuerda al cargar para abrirlo cuando el portal esté listo
  var DEEP = (/^#libres\/([\w-]+)/.exec(W.LV44_HASH || location.hash) || [])[1] || null;
  var st = { sid: null, sheet: 'his', step: 0, steps: [], speaking: false, io: null };
  W.LV42 = st;

  /* ---------- pasos de la historia ---------- */
  function buildSteps(sid) {
    var s = W.LV11.sites().filter(function (x) { return x.id === sid; })[0]; if (!s) return [];
    var k = W.LV11.counts ? W.LV11.counts(sid) : { ind: 0, norms: 0, obs: 0, data: false };
    var steps = [{ kind: 'intro', eye: '', title: en() ? s.en : s.es, text: en() ? (s.de || s.d) : s.d, s: s, k: k }];
    (s.kpis || []).forEach(function (code) {
      var r = W.LV11.kpi(code); if (!r) return;
      steps.push({ kind: 'kpi', eye: T('Lo principal', 'Key figure'), v: r.v, n: r.n, title: r.t, text: r.s, code: code });
    });
    (s.analyses || []).forEach(function (id) {
      var a = W.LV11.an(id); if (!a || !a.chart) return;
      var eye = /lvshare|waffle/.test(a.chart) ? T('Quiénes', 'Who') : (/<path d="M/.test(a.chart) ? T('En el tiempo', 'Over time') : T('En detalle', 'In detail'));
      steps.push({ kind: 'an', eye: eye, v: a.head, title: a.sub, text: (a.read && a.read[0]) || '', src: a.src, chart: a.chart, id: id, ind: a.ind });
    });
    // v48 · contexto de la línea (por qué faltan cifras, qué se necesita, fuentes) y fichas de los indicadores sin datos
    (s.info || []).forEach(function (x, j) { steps.push({ kind: 'info', eye: j === 0 && !k.data ? T('Estado de la línea', 'Line status') : T('Contexto', 'Context'), title: x[0], text: x[1], n0: j }); });
    var kc = {}; steps.forEach(function (x) { if (x.code) kc[x.code] = 1; });
    (W.LV11.siteInds ? W.LV11.siteInds(sid) : []).filter(function (x) { return !kc[x.code] && !x.data; }).forEach(function (x) { steps.push({ kind: 'ficha', eye: T('Indicador en preparación', 'Indicator in preparation'), title: x.name, text: x.note || T('Para publicarlo se necesita acceso a la fuente, validar el método y la autorización institucional.', 'Publishing it needs source access, method validation and institutional approval.'), f: x, code: x.code }); });
    if (steps.length === 1) steps.push({ kind: 'prep', eye: T('En preparación', 'In preparation'), title: T('Esta línea todavía no tiene cifras publicadas', 'This line has no published figures yet'), text: T('Mientras se procesan los datos, puedes consultar sus normas y los observatorios que la siguen.', 'While data is processed, you can check its laws and the observatories that follow it.') });
    return steps;
  }
  function stepText(x, i, n) {
    var big = x.v ? '<span class="v">' + E(x.v) + '</span> ' : '';
    return '<article class="kst" data-i="' + i + '" id="lv42s' + i + '"><div class="kin">' +
      '<span class="kpg">' + T('Paso', 'Step') + ' ' + (i + 1) + ' ' + T('de', 'of') + ' ' + n + '</span>' +
      (x.eye ? '<p class="keye">' + E(x.eye) + '</p>' : '') +
      '<h3>' + big + E(x.title) + '</h3>' +
      (x.kind === 'intro' ? '<p class="klead">' + E(x.text) + '</p>' : (x.text ? '<div class="ksay">' + BIRD + '<p>' + E(x.text) + '</p></div>' : '')) +
      (x.src ? '<p class="ksrc">' + E(T('Fuente: ', 'Source: ') + x.src) + '</p>' : '') +
      '<div class="kacts"><button type="button" class="klis" data-say="' + i + '">' + SPK + T('Escuchar', 'Listen') + '</button>' +
      (x.code ? '<button type="button" class="klnk" data-ind="' + x.code + '">' + T('Ver ficha del indicador', 'See indicator sheet') + ' ' + ARR + '</button>' : '') +
      (x.id ? '<button type="button" class="klnk" data-an="' + x.id + '">' + T('Ampliar gráfica', 'Expand chart') + ' ' + ARR + '</button>' : '') + '</div>' +
      '<div class="kmini" aria-hidden="true"></div></div></article>';
  }
  function cardHTML(x) {
    if (x.kind === 'intro') {
      var ic = W.LV11.icon ? W.LV11.icon(x.s.ico, 40) : '';
      return '<div class="kcintro"><span class="kring"><span>' + ic + '</span></span><b>' + E(x.title) + '</b><div class="kcnt">' +
        '<span><b>' + x.k.ind + '</b> ' + T('indicadores', 'indicators') + '</span><span><b>' + x.k.norms + '</b> ' + T('normas', 'laws') + '</span><span><b>' + x.k.obs + '</b> ' + T('observatorios', 'observatories') + '</span></div>' +
        '<i class="kchip' + (x.k.data ? '' : ' kprep') + '">' + (x.k.data ? T('Con datos procesados', 'With processed data') : T('En preparación', 'In preparation')) + '</i></div>';
    }
    if (x.kind === 'info') { var IK = [['M12 8v5M12 16.5v.5', 'circle'], ['M5 12h14M12 5v14', 'plus'], ['M4 5h16v12H8l-4 4z', 'msg']][Math.min(2, x.n0 || 0)]; return '<div class="kcinfo"><span class="kring"><span><svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IK[1] === 'circle' ? '<circle cx="12" cy="12" r="9"/>' : '') + '<path d="' + IK[0] + '"/></svg></span></span><b>' + E(x.title) + '</b><p>' + E(x.text) + '</p></div>'; }
    if (x.kind === 'ficha') { var f = x.f, rows = [[T('Fórmula', 'Formula'), f.formula], [T('Unidad', 'Unit'), f.unit], [T('Periodicidad', 'Frequency'), f.frequency], [T('Variables y desagregaciones', 'Variables and breakdowns'), f.variables], [T('Fuente', 'Source'), f.source]].filter(function (r) { return r[1]; });
      return '<div class="kficha"><span class="kfbadge">' + T('Ficha del indicador', 'Indicator sheet') + '</span><b>' + E(f.name) + '</b><dl>' + rows.map(function (r) { return '<div><dt>' + E(r[0]) + '</dt><dd>' + E(r[1]) + '</dd></div>'; }).join('') + '</dl><p class="kneed"><em>' + T('Qué falta', 'What is missing') + '</em>' + E(x.text) + '</p></div>'; }
    if (x.kind === 'prep') return '<div class="kcintro"><span class="kring"><span>' + (W.LV41_ICON ? W.LV41_ICON('chart', 40) : '') + '</span></span><b>' + E(x.eye) + '</b><p>' + E(x.text) + '</p></div>';
    var head = '<div class="kch"><b>' + E(x.v) + '</b><span>' + E(x.title) + '</span></div>';
    if (x.kind === 'kpi') {
      var pct = /%/.test(x.v) && x.n >= 0 && x.n <= 100;
      if (pct) {
        var on = Math.round(x.n), g = '';
        for (var i = 0; i < 100; i++) { var r = Math.floor(i / 10), c = i % 10; g += person(c * 22, r * 27, i < on, i); }
        return head + '<svg class="kpicto" viewBox="0 0 218 268" role="img" aria-label="' + E(x.v + ' ' + x.title) + '">' + g + '</svg>' +
          '<div class="klg"><span><i class="a"></i>' + E(x.title) + '</span><span><i class="b"></i>' + T('El resto', 'The rest') + '</span></div>';
      }
      if (x.n >= 2000 && !/por cada|per 100/i.test(x.text + x.v)) {
        // pictograma de conteo: cada figura representa 1.000 (o 10.000) mujeres
        var unit = x.n > 240000 ? 10000 : 1000, cnt = Math.max(1, Math.round(x.n / unit)), cols = cnt > 100 ? 15 : 10, rows = Math.ceil(cnt / cols), g2 = '';
        for (var j = 0; j < cnt; j++) g2 += person((j % cols) * 22, Math.floor(j / cols) * 27, true, j);
        return head + '<svg class="kpicto cnt" viewBox="0 0 ' + (cols * 22 - 8) + ' ' + (rows * 27) + '" role="img" aria-label="' + E(x.v + ' ' + x.title) + '">' + g2 + '</svg>' +
          '<div class="klg"><span><i class="a"></i>' + T('Cada figura = ', 'Each figure = ') + unit.toLocaleString('es-CO') + T(' mujeres', ' women') + '</span></div>';
      }
      return '<div class="kcbig"><b data-to="' + E(x.v) + '">' + E(x.v) + '</b><span>' + E(x.title) + '</span><p>' + E(x.text) + '</p></div>';
    }
    return head + '<div class="kchart">' + x.chart + '</div>';
  }
  function countUp(el) {
    var t = el.dataset.to || el.textContent, m = /^([\d.]+)(,\d+)?(.*)$/.exec(t.trim()); if (!m || R.classList.contains('lv23calm')) return;
    var target = parseFloat(m[1].replace(/\./g, '') + (m[2] ? '.' + m[2].slice(1) : '')), dec = m[2] ? m[2].length - 1 : 0, t0 = performance.now();
    function f(now) { var p = Math.min(1, (now - t0) / 900), v = target * (1 - Math.pow(1 - p, 3)); el.textContent = v.toLocaleString('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + m[3]; if (p < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  function setStep(i, force) {
    if (!st.steps.length) return; i = Math.max(0, Math.min(st.steps.length - 1, i));
    if (i === st.step && !force) return; st.step = i;
    var card = D.querySelector('#lv42 .kcard .kbody'); if (!card) return;
    card.classList.remove('in'); card.innerHTML = cardHTML(st.steps[i]);
    void card.offsetWidth; card.classList.add('in');
    var b = card.querySelector('.kcbig b'); if (b) countUp(b);
    D.querySelectorAll('#lv42 .kdots button').forEach(function (d, j) { d.classList.toggle('on', j === i); d.setAttribute('aria-current', j === i ? 'step' : 'false'); });
    D.querySelectorAll('#lv42 .kst').forEach(function (s, j) { s.classList.toggle('on', j === i); });
  }
  /* ---------- hojas ---------- */
  function sheetsHTML(k) {
    var SH = [['his', T('Historia', 'Story')], ['exp', T('Más cifras', 'More figures')], ['fue', T('De dónde salen los datos', 'Where data comes from')], ['nor', T('Normas', 'Laws') + ' (' + k.norms + ')'], ['obs', T('Observatorios', 'Observatories') + ' (' + k.obs + ')'], ['doc', T('Documentos', 'Documents') + ' (' + (W.LV11.docs ? W.LV11.docs(st.sid).length : 0) + ')']];
    return '<div class="ksheets" role="tablist" aria-label="' + T('Hojas del tema', 'Topic sheets') + '"><button type="button" class="kall" data-all="1">' + (st.speaking ? STOP + T('Detener', 'Stop') : SPK + T('Escuchar toda la historia', 'Listen to the whole story')) + '</button>' +
      SH.map(function (x) { return '<button type="button" role="tab" data-sh="' + x[0] + '" aria-selected="' + (st.sheet === x[0]) + '"' + (st.sheet === x[0] ? ' class="on"' : '') + '>' + E(x[1]) + '</button>'; }).join('') + '</div>';
  }
  function normsHTML(sid) {
    var list = (W.LV11.norms() || []).filter(function (n) { return n.pub !== false && (n.sites || []).indexOf(sid) > -1; }).sort(function (a, b) { return b.y - a.y; });
    if (!list.length) return '<p class="kempty">' + T('Aún no hay normas asociadas a este tema.', 'No laws linked to this topic yet.') + '</p>';
    var by = {}; list.forEach(function (n) { (by[n.tipo] = by[n.tipo] || []).push(n); });
    return Object.keys(by).map(function (t) { return '<section class="kgrp"><h3>' + E(t) + ' <small>' + by[t].length + '</small></h3><div class="knl">' + by[t].map(function (n) { return '<button type="button" data-norm="' + n.id + '"><span class="ky">' + E(n.y) + '</span><span class="ktx"><b>' + E(n.n) + '</b><small>' + E(en() ? (n.de || n.d) : n.d) + '</small></span><i>' + ARR + '</i></button>'; }).join('') + '</div></section>'; }).join('');
  }
  function obsHTML(sid) {
    var list = W.LV11.obsFor ? W.LV11.obsFor(sid) : [];
    if (!list.length) return '<p class="kempty">' + T('Aún no hay observatorios asociados a este tema.', 'No observatories linked to this topic yet.') + '</p>';
    return '<div class="kol">' + list.map(function (o) { return '<a ' + (o.url ? 'href="' + E(o.url) + '" target="_blank" rel="noopener"' : 'href="#" data-red="1"') + '><em>' + E(o.amb || '') + '</em><b>' + E(o.n) + '</b><small>' + E(o.e || '') + '</small>' + (o.d ? '<p>' + E(o.d) + '</p>' : '') + '<i>' + T('Visitar', 'Visit') + ' ' + ARR + '</i></a>'; }).join('') + '</div>';
  }
  function storyHTML() {
    var n = st.steps.length;
    return '<div class="kstory"><div class="ksteps">' + st.steps.map(function (x, i) { return stepText(x, i, n); }).join('') +
      '<div class="kend"><button type="button" data-sh="exp">' + T('Busca más cifras', 'Find more figures') + ' ' + ARR + '</button><button type="button" data-sh="nor">' + T('Conoce sus normas', 'See its laws') + ' ' + ARR + '</button></div></div>' +
      '<div class="kcardw"><div class="kcard"><div class="kbody kin"></div><div class="kdots" role="group" aria-label="' + T('Pasos', 'Steps') + '">' + st.steps.map(function (x, i) { return '<button type="button" data-dot="' + i + '" aria-label="' + T('Paso', 'Step') + ' ' + (i + 1) + '"></button>'; }).join('') + '</div></div></div></div>';
  }
  function render() {
    var sid = siteOpen(), host = D.getElementById('lv42'), hd0 = D.querySelector('body > header');
    if (hd0) R.style.setProperty('--lv42top', (getComputedStyle(hd0).position === 'sticky' || getComputedStyle(hd0).position === 'fixed' ? Math.round(hd0.getBoundingClientRect().height) : 0) + 'px');
    R.classList.toggle('lv42', !!sid);
    if (!sid) { if (host) host.remove(); stopSpeak(); st.sid = null; R.classList.remove('lv42his', 'lv42own'); return; }
    var pano = D.querySelector('#libresRoot .lv11pano'); if (!pano || !W.LV11) return;
    var lang = en() ? 'en' : 'es';
    if (st.sid !== sid) { st.sid = sid; st.sheet = 'his'; st.step = 0; stopSpeak(); }
    if (host && host.dataset.sid === sid && host.dataset.lang === lang && host.parentNode === pano.parentNode) { applySheet(); return; }
    if (host) host.remove();
    st.steps = buildSteps(sid);
    var s = W.LV11.sites().filter(function (x) { return x.id === sid; })[0], k = W.LV11.counts(sid);
    var grp = W.LV23_GROUPOF ? W.LV23_GROUPOF(sid) : ['lineas', 'Líneas temáticas', 'Thematic lines'];
    host = D.createElement('section'); host.id = 'lv42'; host.dataset.sid = sid; host.dataset.lang = lang; host.setAttribute('data-no-translate', '');
    host.innerHTML = '<div class="khd"><span class="kglow" aria-hidden="true"></span><button type="button" class="kback" data-back="' + grp[0] + '">' + BACK + T(grp[0] === 'comites' ? 'Comités' : grp[0] === 'redes' ? 'Redes' : 'Ejes temáticos', grp[0] === 'comites' ? 'Committees' : grp[0] === 'redes' ? 'Networks' : 'Thematic axes') + '</button>' +
      '<h1>' + E(en() ? s.en : s.es) + '</h1><p>' + E(en() ? (s.de || s.d) : s.d) + '</p><i class="kchip' + (k.data ? '' : ' kprep') + '">' + (k.data ? T('Con datos procesados', 'With processed data') : T('En preparación', 'In preparation')) + '</i></div>' +
      '<div class="ksbar">' + sheetsHTML(k) + '</div><div class="pane" id="lv42pane"></div>';
    pano.parentNode.insertBefore(host, pano);
    wire(host); applySheet(true);
  }
  function applySheet(fresh) {
    var host = D.getElementById('lv42'), pane = D.getElementById('lv42pane'); if (!host || !pane) return;
    var sh = st.sheet, k = W.LV11.counts(st.sid);
    var sb = host.querySelector('.ksbar'), nh = sheetsHTML(k); if (sb.dataset.sig !== nh) { sb.dataset.sig = nh; sb.innerHTML = nh; }
    R.classList.toggle('lv42his', sh === 'his'); R.classList.toggle('lv42own', sh === 'his' || sh === 'nor' || sh === 'obs' || sh === 'doc');
    if (pane.dataset.sh !== sh || fresh) {
      pane.dataset.sh = sh;
      if (sh === 'his') { pane.innerHTML = storyHTML(); fillMini(); observe(); setStep(st.step, true); }
      else if (sh === 'nor') pane.innerHTML = '<div class="kown"><h2>' + T('Normas que protegen estos derechos', 'Laws that protect these rights') + '</h2>' + normsHTML(st.sid) + '</div>';
      else if (sh === 'doc') { var dl = W.LV11.docs ? W.LV11.docs(st.sid) : []; pane.innerHTML = '<div class="kown"><h2>' + T('Acervo documental del tema', 'Topic documents') + '</h2>' + (dl.length ? '<div class="kol">' + dl.map(function (d) { return '<a ' + (d.url ? 'href="' + E(d.url) + '" target="_blank" rel="noopener"' : '') + '><em>' + E(d.tipo || '') + (d.y ? ' · ' + d.y : '') + '</em><b>' + E(d.t) + '</b>' + (d.d ? '<p>' + E(d.d) + '</p>' : '') + (d.url ? '<i>' + T('Abrir documento', 'Open document') + ' ' + ARR + '</i>' : '') + '</a>'; }).join('') + '</div>' : '<p class="kempty">' + T('Aún no hay documentos asociados a este tema.', 'No documents yet.') + '</p>') + '</div>'; }
      else if (sh === 'obs') pane.innerHTML = '<div class="kown"><h2>' + T('Observatorios y fuentes que siguen este tema', 'Observatories and sources following this topic') + '</h2>' + obsHTML(st.sid) + '</div>';
      else pane.innerHTML = '';
    }
    // «Más cifras» y «De dónde salen los datos» usan las pestañas existentes del portal
    if (sh === 'exp' || sh === 'fue') { var tb = D.querySelector('#lv23tabs [data-t="' + sh + '"]'); if (tb && !tb.classList.contains('on')) tb.click(); }
  }
  // en celular cada paso lleva su propia gráfica debajo del texto (sin tarjeta fija encima)
  function fillMini() { if (!W.matchMedia('(max-width:860px)').matches) return; D.querySelectorAll('#lv42 .kst').forEach(function (el) { var m = el.querySelector('.kmini'), x = st.steps[+el.dataset.i]; if (m && x && !m.firstChild) m.innerHTML = '<div class="kcard kmc"><div class="kbody">' + cardHTML(x) + '</div></div>'; }); }
  function observe() {
    if (st.io) st.io.disconnect();
    if (!('IntersectionObserver' in W)) return;
    st.io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) setStep(+e.target.dataset.i); }); }, { rootMargin: '-45% 0px -45% 0px' });
    D.querySelectorAll('#lv42 .kst').forEach(function (s) { st.io.observe(s); });
  }
  function goStep(i) { var el = D.getElementById('lv42s' + i); if (!el) return; var y = el.getBoundingClientRect().top + scrollY - (innerHeight - el.offsetHeight) / 2; scrollTo({ top: Math.max(0, y), behavior: R.classList.contains('lv23calm') ? 'auto' : 'smooth' }); setStep(i); }
  /* ---------- lectura en voz alta ---------- */
  function sayText(x) { return [x.v ? x.v + ' ' : '', x.title, '. ', x.kind === 'intro' ? x.text : (x.text || '')].join(''); }
  function voice() { var vs = (W.speechSynthesis && speechSynthesis.getVoices()) || [], l = en() ? 'en' : 'es'; return vs.filter(function (v) { return v.lang === (l === 'es' ? 'es-CO' : 'en-US'); })[0] || vs.filter(function (v) { return v.lang.indexOf(l) === 0; })[0] || null; }
  function speak(txt, done) { if (!W.speechSynthesis) return; var u = new SpeechSynthesisUtterance(txt), v = voice(); u.lang = en() ? 'en-US' : 'es-CO'; if (v) u.voice = v; u.rate = 1; u.onend = done || null; speechSynthesis.speak(u); }
  function stopSpeak() { st.speaking = false; if (W.speechSynthesis) speechSynthesis.cancel(); D.querySelectorAll('#lv42 .klis.on').forEach(function (b) { b.classList.remove('on'); }); }
  function speakAll(i) { if (!st.speaking || i >= st.steps.length) { stopSpeak(); applySheet(); return; } goStep(i); speak(sayText(st.steps[i]), function () { if (st.speaking) setTimeout(function () { speakAll(i + 1); }, 350); }); }
  function wire(host) {
    host.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('[data-back]'))) { if (W.LV41_THEMES) W.LV41_THEMES(b.dataset.back); return; }
      if ((b = e.target.closest('[data-sh]'))) { stopSpeak(); st.sheet = b.dataset.sh; applySheet(); var t = host.querySelector('.ksbar').getBoundingClientRect().top + scrollY - 90; if (scrollY > t) scrollTo({ top: t, behavior: 'smooth' }); return; }
      if ((b = e.target.closest('[data-all]'))) { if (st.speaking) { stopSpeak(); applySheet(); return; } if (st.sheet !== 'his') { st.sheet = 'his'; applySheet(); } stopSpeak(); st.speaking = true; applySheet(); speakAll(0); return; }
      if ((b = e.target.closest('[data-say]'))) { var on = b.classList.contains('on'); stopSpeak(); if (!on) { b.classList.add('on'); speak(sayText(st.steps[+b.dataset.say]), function () { b.classList.remove('on'); }); } return; }
      if ((b = e.target.closest('[data-dot]'))) { goStep(+b.dataset.dot); return; }
      if ((b = e.target.closest('[data-ind]'))) { W.LV11.openIndicator(b.dataset.ind); return; }
      if ((b = e.target.closest('[data-an]'))) { W.LV11.openAnalysis(b.dataset.an); return; }
      if ((b = e.target.closest('[data-norm]'))) { W.LV11.openNorm(b.dataset.norm); return; }
      if ((b = e.target.closest('[data-red]'))) { e.preventDefault(); W.go('red'); }
    });
    host.addEventListener('keydown', function (e) { if (!e.target.closest('.kdots')) return; if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goStep(st.step + 1); } if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goStep(st.step - 1); } });
  }
  function tick() { clearTimeout(tick.t); tick.t = setTimeout(render, 60); }
  function init() {
    if (!W.LV11 || !W.LV11.kpi) return setTimeout(init, 300);
    addEventListener('hashchange', tick);
    new MutationObserver(tick).observe(D.querySelector('main'), { attributes: true, subtree: true, attributeFilter: ['class'] });
    var rt = D.getElementById('libresRoot'); if (rt) new MutationObserver(function () { var h = D.getElementById('lv42'), p = D.querySelector('#libresRoot .lv11pano'); if (siteOpen() && (!h || (p && h.nextElementSibling !== p))) tick(); }).observe(rt, { childList: true, subtree: true });
    new MutationObserver(tick).observe(R, { attributes: true, attributeFilter: ['lang'] });
    render(); setTimeout(render, 600);
    if (DEEP) (function open(n) { if (siteOpen() === DEEP) return; if (W.LV11.sites().some(function (x) { return x.id === DEEP; })) { try { W.LV11.openSite(DEEP); } catch (e) {} } if (n < 20) setTimeout(function () { open(n + 1); }, 150); })(0);
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { setTimeout(init, 500); }); else setTimeout(init, 500);
})();
