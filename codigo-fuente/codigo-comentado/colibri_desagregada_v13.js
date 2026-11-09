/* ==========================================================================
   LIBRES v13 · Colibrí animado del isologo y consulta desagregada
   - Colibrí en SVG (alas, cola y hojas animadas) en el héroe de la consulta,
     la portada y la administración. Sigue suavemente el puntero; al tocarlo
     suelta hojas y lleva a la consulta desagregada.
   - Consulta desagregada: por cada base procesada muestra qué se leyó, qué se
     publicó y con qué detalle; explorador con agrupación y desglose por sexo,
     ruta de procesamiento con las cifras de auditoría y matriz de
     desagregaciones (publicada / disponible en la fuente por procesar / no
     disponible). No cambia datos ni cálculos: lee los agregados ya existentes.
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window;
  function en() { try { if (typeof language === 'string') return language === 'en'; } catch (e) {} return (D.documentElement.lang || 'es').indexOf('en') === 0; }
  function T(es, e) { return en() ? e : es; }
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function NF(v, d) { return v == null || isNaN(v) ? '—' : Number(v).toLocaleString(en() ? 'en-US' : 'es-CO', { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: d || 0 }); }
  function DATA() { try { return V8_DATA; } catch (e) { return null; } }
  function GEOL() { try { return GEO; } catch (e) { return []; } }
  function dname(c) { var g = GEOL().find(function (x) { return x.code === c; }); return g ? g.name : c; }
  var reduced = W.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WOMEN = '#9E2C5A', MEN = '#1A82B9';

  /* ======================= Colibrí ======================= */
  var nB = 0, HALF = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 1.4a4.6 4.6 0 0 1 0 9.2z" fill="currentColor"/></svg>';
  function birdSVG() {
    var n = ++nB, leaves = [[52, 40, '#D33B78', -30, 1], [28, 92, '#2EDBBE', 20, .9], [62, 150, '#D33B78', -50, .8], [20, 132, '#B243EA', 10, .75], [100, 16, '#2EDBBE', 60, .7], [44, 190, '#F0B3CA', -20, .8], [108, 168, '#D089EC', 30, .6], [8, 52, '#B243EA', -70, .55]];
    return '<svg viewBox="0 0 300 260" role="img" aria-label="' + T('Colibrí de ¡LIBRES!', '¡LIBRES! hummingbird') + '"><defs>' +
      '<linearGradient id="lv13b' + n + '" x1="0.2" y1="0" x2="0.1" y2="1"><stop offset="0" stop-color="#1A82B9"/><stop offset=".6" stop-color="#1A9CC0"/><stop offset="1" stop-color="#2EDBBE"/></linearGradient>' +
      '<linearGradient id="lv13w' + n + '" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#B243EA"/><stop offset="1" stop-color="#D089EC"/></linearGradient>' +
      '<linearGradient id="lv13t' + n + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2EDBBE"/><stop offset="1" stop-color="#1A9CC0"/></linearGradient>' +
      '<radialGradient id="lv13h' + n + '"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '</defs><g class="bob"><circle cx="150" cy="118" r="128" fill="url(#lv13h' + n + ')"/>' +
      leaves.map(function (l) { return '<g transform="translate(' + l[0] + ',' + l[1] + ') rotate(' + l[3] + ') scale(' + l[4] + ')"><path class="leaf" fill="' + l[2] + '" d="M0,-11 C7,-5 7,5 0,11 C-7,5 -7,-5 0,-11Z"/></g>'; }).join('') +
      '<path class="w3" fill="#8E36CF" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" d="M170,112 C142,108 110,116 80,134 C114,142 146,132 170,112Z"/>' +
      '<path class="w2" fill="#B243EA" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" d="M170,108 C140,84 104,74 62,80 C90,106 128,118 170,108Z"/>' +
      '<g class="tail"><path fill="url(#lv13t' + n + ')" d="M162,192 C166,214 180,230 204,238 C180,244 154,236 144,214 C140,204 144,196 152,200Z"/></g>' +
      '<path fill="url(#lv13b' + n + ')" d="M182,72 C202,70 216,84 211,102 C204,130 186,162 164,196 L150,206 C132,190 130,160 141,132 C150,108 162,82 182,72Z"/>' +
      '<path class="w1" fill="url(#lv13w' + n + ')" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" d="M174,102 C158,64 128,38 82,28 C94,62 122,94 174,102Z"/>' +
      '<g class="head"><path fill="#1A82B9" d="M212,72 L284,58 L214,81Z"/><circle cx="196" cy="80" r="21" fill="#1A82B9"/><circle cx="203" cy="75" r="4.2" fill="#fff"/><circle cx="204" cy="75.5" r="2" fill="#0b2a3d"/></g>' +
      '</g></svg>';
  }
  function mountBird(host, opts) {
    if (!host || host.querySelector(':scope > .lv13bird')) return;
    opts = opts || {};
    var b = D.createElement('div'); b.className = 'lv13bird'; b.setAttribute('aria-hidden', opts.nav ? 'false' : 'true');
    if (opts.nav) { b.setAttribute('role', 'button'); b.tabIndex = 0; b.setAttribute('aria-label', T('Explorar la consulta desagregada', 'Explore the disaggregated data')); }
    b.innerHTML = '<div class="in" style="width:100%;height:100%;animation:' + (reduced ? 'none' : 'lv13in2 1.6s cubic-bezier(.2,.8,.2,1) both') + '">' + birdSVG() + '</div>' + (opts.bubble ? '<span class="bubble">' + opts.bubble + '</span>' : '');
    host.appendChild(b);
    if (!reduced) host.addEventListener('pointermove', function (e) {
      var r = host.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      b.style.setProperty('--px', (x * 26).toFixed(1) + 'px'); b.style.setProperty('--py', (y * 18).toFixed(1) + 'px');
      var br = b.getBoundingClientRect(); b.style.setProperty('--tilt', (e.clientY < br.top + br.height * .3 ? -8 : e.clientY > br.bottom ? 7 : 0) + 'deg');
    }, { passive: true });
    host.addEventListener('pointerleave', function () { b.style.setProperty('--px', '0px'); b.style.setProperty('--py', '0px'); b.style.setProperty('--tilt', '0deg'); });
    function act() {
      if (!reduced) {
        b.classList.remove('zoom'); void b.offsetWidth; b.classList.add('zoom'); setTimeout(function () { b.classList.remove('zoom'); }, 1150);
        var hr = host.getBoundingClientRect(), br = b.getBoundingClientRect(), cx = br.left - hr.left + br.width * .4, cy = br.top - hr.top + br.height * .4;
        ['#D33B78', '#2EDBBE', '#B243EA', '#F0B3CA', '#D089EC', '#1A82B9', '#F8C20A', '#D33B78', '#B243EA', '#2EDBBE'].forEach(function (c, i) {
          var s = D.createElement('i'); s.className = 'lv13spark'; s.style.left = cx + 'px'; s.style.top = cy + 'px'; s.style.background = c;
          var a = Math.PI * (0.55 + i / 9 * 0.95); s.style.setProperty('--dx', (Math.cos(a) * (90 + Math.random() * 90)).toFixed(0) + 'px'); s.style.setProperty('--dy', (Math.sin(a) * (60 + Math.random() * 80) + 40).toFixed(0) + 'px'); s.style.setProperty('--dr', (Math.random() * 540 - 270).toFixed(0) + 'deg');
          host.appendChild(s); setTimeout(function () { s.remove(); }, 1500);
        });
      }
      if (opts.nav) setTimeout(function () { var t = D.getElementById('lv13des'); if (t) scrollTo({ top: t.getBoundingClientRect().top + scrollY - 120, behavior: 'smooth' }); }, reduced ? 0 : 420);
    }
    b.addEventListener('click', act);
    b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
  }
  /* ===== Ilustración «Mujeres en todas sus diversidades» con el colibrí blanco detrás ===== */
  function whiteBird(cls) {
    var leaves = [[52, 40, -30, 1], [28, 92, 20, .9], [62, 150, -50, .8], [20, 132, 10, .75], [100, 16, 60, .7], [44, 190, -20, .8], [108, 168, 30, .6], [8, 52, -70, .55]];
    return '<svg class="' + cls + '" viewBox="0 0 300 260" aria-hidden="true"><g class="bob" fill="#fff">' +
      leaves.map(function (l) { return '<g transform="translate(' + l[0] + ',' + l[1] + ') rotate(' + l[2] + ') scale(' + l[3] + ')"><path class="leaf" d="M0,-11 C7,-5 7,5 0,11 C-7,5 -7,-5 0,-11Z"/></g>'; }).join('') +
      '<path class="w3" opacity=".55" d="M170,112 C142,108 110,116 80,134 C114,142 146,132 170,112Z"/><path class="w2" opacity=".75" d="M170,108 C140,84 104,74 62,80 C90,106 128,118 170,108Z"/>' +
      '<g class="tail"><path d="M162,192 C166,214 180,230 204,238 C180,244 154,236 144,214 C140,204 144,196 152,200Z"/></g>' +
      '<path d="M182,72 C202,70 216,84 211,102 C204,130 186,162 164,196 L150,206 C132,190 130,160 141,132 C150,108 162,82 182,72Z"/>' +
      '<path class="w1" opacity=".92" d="M174,102 C158,64 128,38 82,28 C94,62 122,94 174,102Z"/>' +
      '<g class="head"><path d="M212,72 L284,58 L214,81Z"/><circle cx="196" cy="80" r="21"/></g></g></svg>';
  }
  function woman(x, y, s, o) {
    // o: skin, hair, top, hairStyle, acc
    var h = '', S = o.skin, H = o.hair;
    if (o.st === 'afro') h += '<circle cx="0" cy="-128" r="47" fill="' + H + '"/><circle cx="-34" cy="-104" r="14" fill="' + H + '"/><circle cx="34" cy="-104" r="14" fill="' + H + '"/>';
    if (o.st === 'long') h += '<path fill="' + H + '" d="M-33,-128 C-38,-172 38,-172 33,-128 L40,-66 C20,-58 -20,-58 -40,-66Z"/>';
    if (o.st === 'braids') h += '<path fill="' + H + '" d="M-30,-126 C-32,-166 32,-166 30,-126Z"/><g fill="' + H + '"><ellipse cx="-30" cy="-92" rx="8" ry="11"/><ellipse cx="-31" cy="-72" rx="7.5" ry="10"/><ellipse cx="-32" cy="-53" rx="7" ry="9"/><ellipse cx="30" cy="-92" rx="8" ry="11"/><ellipse cx="31" cy="-72" rx="7.5" ry="10"/><ellipse cx="32" cy="-53" rx="7" ry="9"/></g>';
    if (o.st === 'bun') h += '<circle cx="0" cy="-168" r="17" fill="' + H + '"/>';
    var body = '<path fill="' + o.top + '" d="M-72,0 C-72,-52 -42,-80 0,-80 C42,-80 72,-52 72,0Z"/>' +
      (o.col ? '<path fill="' + o.col + '" d="M-20,-79 L0,-52 L20,-79 C14,-80 -14,-80 -20,-79Z"/>' : '') +
      '<rect x="-12" y="-100" width="24" height="28" rx="9" fill="' + S + '"/>' +
      '<ellipse cx="0" cy="-122" rx="27" ry="31" fill="' + S + '"/>';
    var front = '';
    if (o.st === 'long') front += '<path fill="' + H + '" d="M-29,-124 C-30,-160 30,-160 29,-124 C18,-140 -6,-146 -29,-124Z"/>';
    if (o.st === 'afro') front += '<path fill="' + H + '" d="M-27,-128 C-22,-150 22,-150 27,-128 C16,-138 -16,-138 -27,-128Z"/>';
    if (o.st === 'braids') front += '<path fill="' + H + '" d="M-28,-124 C-28,-158 28,-158 28,-124 C10,-142 -10,-142 -28,-124Z"/>';
    if (o.st === 'short') front += '<path fill="' + H + '" d="M-30,-118 C-36,-162 34,-168 31,-122 C22,-146 -4,-150 -30,-118Z"/>';
    if (o.st === 'bun') front += '<path fill="' + H + '" d="M-29,-122 C-30,-160 30,-160 29,-122 C16,-142 -16,-142 -29,-122Z"/>';
    if (o.ear) front += '<circle cx="-26" cy="-108" r="4.5" fill="' + o.ear + '"/><circle cx="26" cy="-108" r="4.5" fill="' + o.ear + '"/>';
    if (o.band) front += '<path fill="' + o.band + '" d="M-29,-136 C-12,-150 12,-150 29,-136 L28,-129 C10,-141 -10,-141 -28,-129Z"/>';
    return '<g class="wm" style="--d:' + o.d + 's" transform="translate(' + x + ',' + y + ') scale(' + s + ')"><g class="wmi">' + h + body + front + '</g></g>';
  }
  function womenArt() {
    if (W.LV15ART) return W.LV15ART('home');
    var back = woman(150, 236, .8, { st: 'long', skin: '#E8B896', hair: '#3B2416', top: '#F8C20A', col: '#E0A800', ear: '#B243EA', d: 0 }) +
      woman(372, 236, .8, { st: 'short', skin: '#C68E5C', hair: '#1E120D', top: '#2EDBBE', col: '#17A58C', ear: '#F8C20A', d: .8 });
    var front = woman(66, 300, .95, { st: 'afro', skin: '#6B4430', hair: '#1E120D', top: '#D33B78', col: '#9E2C5A', ear: '#F8C20A', d: .4 }) +
      woman(262, 300, 1.02, { st: 'braids', skin: '#A86F4A', hair: '#1E120D', top: '#1A82B9', col: '#F8C20A', band: '#D33B78', d: 1.2 }) +
      woman(456, 300, .95, { st: 'bun', skin: '#D9A07A', hair: '#E9E4EE', top: '#B243EA', col: '#D089EC', ear: '#2EDBBE', d: 1.6 });
    var deco = '<g class="wdeco"><circle cx="210" cy="64" r="7" fill="#F8C20A"/><circle cx="318" cy="44" r="5" fill="#2EDBBE"/><path fill="#F0B3CA" d="M246,30 c-6,-8 -18,-2 -12,8 l12,12 l12,-12 c6,-10 -6,-16 -12,-8z"/><path fill="#fff" opacity=".85" d="M486,92 l6,-14 l6,14 l14,6 l-14,6 l-6,14 l-6,-14 l-14,-6z"/><path fill="#fff" opacity=".7" d="M30,120 l4,-9 l4,9 l9,4 l-9,4 l-4,9 l-4,-9 l-9,-4z"/></g>';
    return '<svg class="lv14women" viewBox="0 0 520 300" role="img" aria-label="' + T('Ilustración: mujeres en todas sus diversidades', 'Illustration: women in all their diversity') + '">' + deco + back + front + '</svg>';
  }
  function mountArt(host, opts) {
    if (!host || host.querySelector(':scope > .lv14art')) return;
    opts = opts || {};
    var a = D.createElement('div'); a.className = 'lv14art' + (opts.cls ? ' ' + opts.cls : '');
    a.innerHTML = whiteBird('lv14wbird') + (opts.women === false ? '' : '<div class="lv14wrap">' + womenArt() + (opts.tag ? '<span class="lv14tag">' + opts.tag + '</span>' : '') + (W.LV15LIFE ? W.LV15LIFE() : '') + '</div>');
    if (opts.before) host.insertBefore(a, opts.before); else host.insertBefore(a, host.firstChild);
    if (!reduced) host.addEventListener('pointermove', function (e) {
      var r = host.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      a.style.setProperty('--px', (x * 22).toFixed(1) + 'px'); a.style.setProperty('--py', (y * 14).toFixed(1) + 'px');
    }, { passive: true });
    if (opts.nav) { var w = a.querySelector('.lv14wrap'); if (w) { w.setAttribute('role', 'button'); w.tabIndex = 0; w.setAttribute('aria-label', T('Ver la consulta desagregada', 'See the disaggregated data')); var go = function () { var t = D.getElementById('lv13des'); if (t) scrollTo({ top: t.getBoundingClientRect().top + scrollY - 120, behavior: 'smooth' }); }; w.addEventListener('click', go); w.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); } }
  }
  function birds() {
    var h = D.getElementById('lvHero'); if (h) mountArt(h, { nav: true, tag: T('Mujeres desde que nacen y en todas sus diversidades', 'Women from birth and in all their diversity') });
    var lh = D.querySelector('body > header.hero'); if (lh) mountArt(lh, { cls: 'land', tag: T('Mujeres desde que nacen y en todas sus diversidades', 'Women from birth and in all their diversity') });
    var ah = D.querySelector('.lv11adhero'); if (ah) mountArt(ah, { women: false, cls: 'adm' });
    var al = D.querySelector('.adminlogin aside'); if (al) mountArt(al, { women: false, cls: 'adm' });
  }


  /* ======================= Consulta desagregada ======================= */
  // Dimensiones de desagregación y cómo reconocerlas en los encabezados de cada fuente.
  var DIMS = [
    ['anio', 'Año', 'Year', /^año|año del hecho|^year/i],
    ['mes', 'Mes, día y hora', 'Month, day, time', /mes del hecho|d[ií]a del hecho|hora/i],
    ['dep', 'Departamento', 'Department', /departamento/i],
    ['mun', 'Municipio', 'Municipality', /municipio/i],
    ['zona', 'Zona urbana / rural', 'Urban / rural', /zona del hecho|área/i],
    ['sexo', 'Sexo', 'Sex', /^sexo$|sexo de la v/i],
    ['edad', 'Edad y curso de vida', 'Age and life course', /edad|ciclo vital/i],
    ['etnia', 'Pertenencia étnico-racial', 'Ethnic-racial identity', /étnica|pueblo ind|ancestro/i],
    ['disc', 'Discapacidad', 'Disability', /discapacidad/i],
    ['os', 'Orientación sexual', 'Sexual orientation', /orientación sexual/i],
    ['ig', 'Identidad de género', 'Gender identity', /identidad de género|transg/i],
    ['esc', 'Escolaridad', 'Education', /escolaridad/i],
    ['mig', 'País de nacimiento', 'Country of birth', /país de nacimiento/i],
    ['grp', 'Pertenencia grupal', 'Group membership', /pertenencia grupal/i],
    ['agr', 'Presunto agresor', 'Alleged aggressor', /agresor/i],
    ['esc2', 'Escenario y contexto', 'Setting and context', /escenario|contexto|circunstancia|actividad/i]
  ];
  var PUBLISHED = { pareja: ['anio', 'dep', 'sexo'], nofatal: ['anio', 'dep', 'sexo'], fatal: ['anio', 'dep', 'sexo'], enut: ['anio', 'dep', 'sexo'], pop: ['anio', 'dep', 'sexo'] };
  var PRIVATE = /^id$|d[ií]a del hecho|hora|localidad|código dane/i;
  var SITE_DS = { violencias: ['pareja', 'nofatal', 'fatal'], 'comite-1257': ['pareja', 'nofatal', 'fatal'], 'comite-1719': ['nofatal'], 'comites-tecnico-juridicos': ['nofatal'], 'salud-dsr': ['nofatal'], lgbtiq: ['nofatal', 'pareja', 'fatal'], etnico: ['pareja', 'nofatal', 'fatal', 'pop'], demografia: ['pop'], cuidados: ['enut'], autonomia: ['enut', 'pop'], educacion: ['pareja', 'nofatal'], rutas: ['pareja', 'nofatal'], 'casas-refugio': ['pareja'], 'pan-1325': ['fatal', 'nofatal'] };
  var SITE_DIM = { lgbtiq: ['os', 'ig'], etnico: ['etnia'], educacion: ['esc'], demografia: ['edad', 'zona'], 'salud-dsr': ['edad'], 'comite-1719': ['agr', 'esc2'], 'comites-tecnico-juridicos': ['agr'], 'pan-1325': ['esc2', 'agr'], violencias: ['agr', 'edad'], 'comite-1257': ['agr'], autonomia: ['zona'], cuidados: ['zona'], 'casas-refugio': ['agr'], rutas: ['mun'], participacion: ['dep'] };
  var SITE_CAT = { 'comite-1719': 'Presunto Delito Sexual', 'comites-tecnico-juridicos': 'Presunto Delito Sexual', 'salud-dsr': 'Presunto Delito Sexual', violencias: 'Violencia de Pareja', 'comite-1257': 'Violencia de Pareja' };

  function datasets() {
    var d = DATA(); if (!d || !d.sources) return [];
    var out = d.sources.map(function (s) {
      return { id: s.id, name: en() ? (s.en || s.name) : s.name, producer: s.producer, file: s.file, unit: s.unit, pct: s.measure === 'percent', periods: s.periods || [], pre: s.preliminary === true || s.preliminary === 'true', cut: s.cut, rows: s.rows || [], audit: s.audit || {}, headers: (s.audit && s.audit.headers) || [], method: s.method };
    });
    if (d.population && d.population.rows && d.population.rows.length) {
      var yrs = []; d.population.rows.forEach(function (r) { if (yrs.indexOf(r.year) < 0) yrs.push(r.year); });
      out.push({ id: 'pop', name: T('Población de mujeres (proyecciones)', 'Female population (projections)'), producer: 'DANE · Proyecciones de población departamental (PPED)', file: d.population.file, unit: T('Personas', 'People'), pct: false, periods: yrs.sort(), pre: false, cut: '', ctx: true,
        rows: d.population.rows.map(function (r) { return { year: r.year, dept: r.dept, sex: 'Mujer', category: T('Mujeres · total', 'Women · total'), count: r.women, suppressed: false }; }),
        audit: { aggregate_cells: d.population.rows.length }, headers: ['Departamento', 'Año', 'Área (cabecera, centros poblados y rural disperso)', 'Sexo', 'Edad simple'], method: d.population.method });
    }
    return out;
  }
  function dimState(ds, key) {
    if ((PUBLISHED[ds.id] || []).indexOf(key) > -1) return 'pub';
    var dim = DIMS.find(function (x) { return x[0] === key; });
    var has = ds.headers.some(function (h) { return dim[3].test(h) && !(key === 'mes' && false); });
    return has ? 'src' : 'no';
  }
  function curSite() { var b = D.querySelector('.lvLine.on'); if (b) return b.dataset.t; var m = /#libres\/([\w-]+)/.exec(location.hash); return m ? m[1] : ''; }
  function siteObj(id) { try { return id && W.LV11 && LV11.site(id); } catch (e) { return null; } }
  function siteName(s) { try { return LV11.siteName(s); } catch (e) { return s ? (en() ? s.en : s.es) : ''; } }

  var st = { ds: '', year: '', sex: '', cat: '', dep: '', by: 'dep', all: false, key: '', sel: '' };
  function resetFor(siteId, list) {
    var rel = SITE_DS[siteId] || [];
    var first = rel.find(function (id) { return list.some(function (d) { return d.id === id; }); }) || (list.find(function (d) { return d.id === 'pareja'; }) || list[0] || {}).id;
    st.ds = first; st.sel = ''; st.sex = ''; st.dep = ''; st.all = false; st.cat = ''; st.by = 'dep';
    var ds = list.find(function (d) { return d.id === first; });
    if (ds) {
      st.year = lastFull(ds);
      var want = SITE_CAT[siteId]; if (want) { var c = cats(ds).find(function (c) { return c.indexOf(want) > -1; }); if (c) st.cat = c; }
      if (!st.cat && ds.id === 'nofatal') { var c2 = cats(ds).find(function (c) { return /Pareja/.test(c); }); if (c2) st.cat = c2; }
      if (!st.cat && ds.id === 'fatal') { var c3 = cats(ds).find(function (c) { return /Homicid/.test(c); }); if (c3) st.cat = c3; }
    }
  }
  function lastFull(ds) { var p = ds.periods.slice(); if (ds.pre && p.length > 1) return p[p.length - 2]; return p[p.length - 1] || ''; }
  function cats(ds) { var c = []; ds.rows.forEach(function (r) { if (c.indexOf(r.category) < 0) c.push(r.category); }); return c; }
  function catLabel(c) { return String(c).replace(/^\d+\s+/, ''); }
  function filtered(ds, skip) {
    return ds.rows.filter(function (r) {
      return (skip === 'year' || !st.year || r.year === st.year) && (skip === 'sex' || !st.sex || r.sex === st.sex) && (skip === 'cat' || !st.cat || r.category === st.cat) && (skip === 'dep' || !st.dep || r.dept === st.dep);
    });
  }
  function groupKey(r) { return st.by === 'dep' ? r.dept : st.by === 'cat' ? r.category : st.by === 'anio' ? r.year : r.sex; }
  function groupLabel(k) { return st.by === 'dep' ? dname(k) : st.by === 'cat' ? catLabel(k) : st.by === 'sexo' ? (k === 'Mujer' ? T('Mujeres', 'Women') : k === 'Hombre' ? T('Hombres', 'Men') : k) : k; }
  function aggregate(ds) {
    var skip = st.by === 'anio' ? 'year' : st.by === 'cat' ? 'cat' : st.by === 'dep' ? 'dep' : st.by === 'sexo' ? 'sex' : '';
    var rows = filtered(ds, skip), G = {}, supp = 0;
    rows.forEach(function (r) {
      var k = groupKey(r); var g = G[k] || (G[k] = { k: k, m: 0, h: 0, o: 0, sm: 0, sh: 0, lo: null, hi: null, cve: null, pm: null, ph: null });
      if (r.suppressed || r.count == null) { supp++; if (r.sex === 'Mujer') g.sm++; else g.sh++; return; }
      if (ds.pct) { if (r.sex === 'Mujer') { g.pm = r.count; g.lo = r.lower; g.hi = r.upper; g.cve = r.cve; } else if (r.sex === 'Hombre') g.ph = r.count; return; }
      if (r.sex === 'Mujer') g.m += r.count; else if (r.sex === 'Hombre') g.h += r.count; else g.o += r.count;
    });
    var list = Object.keys(G).map(function (k) { var g = G[k]; g.t = g.m + g.h + g.o; return g; });
    if (st.by === 'anio') list.sort(function (a, b) { return a.k < b.k ? -1 : 1; });
    else if (ds.pct) list.sort(function (a, b) { return (b.pm || 0) - (a.pm || 0); });
    else list.sort(function (a, b) { return (st.sex === 'Hombre' ? b.h - a.h : st.sex === 'Mujer' ? b.m - a.m : b.t - a.t); });
    return { list: list, supp: supp, rows: rows };
  }

  function headHTML(list, site) {
    var reads = 0, cells = 0, prot = 0; list.forEach(function (d) { reads += +d.audit.input_records || 0; cells += +d.audit.aggregate_cells || 0; prot += +d.audit.suppressed_cells || 0; });
    var vars = 0; list.forEach(function (d) { vars += d.headers.length; });
    return '<div class="lv13head"><div><div class="eyebrow">' + T('Consulta desagregada', 'Disaggregated query') + (site ? ' · ' + E(siteName(site)) : '') + '</div>' +
      '<h2>' + T('Qué información procesamos y con qué detalle', 'What we process and in how much detail') + '</h2>' +
      '<p>' + T('Elige una base, agrupa por departamento, categoría, año o sexo y baja al detalle tocando una barra. Abajo ves cómo se procesó cada base y qué desagregaciones trae la fuente que todavía no se publican.', 'Pick a dataset, group by department, category, year or sex and drill down by tapping a bar. Below you can see how each dataset was processed and which breakdowns the source holds that are not yet published.') + '</p></div>' +
      '<div class="lv13sum"><div><b data-count>' + NF(reads) + '</b><span>' + T('registros leídos', 'records read') + '</span></div><div><b data-count>' + NF(cells) + '</b><span>' + T('celdas agregadas', 'aggregated cells') + '</span></div><div><b data-count>' + NF(prot) + '</b><span>' + T('celdas protegidas', 'protected cells') + '</span></div><div><b>' + NF(vars) + '</b><span>' + T('variables en las fuentes', 'source variables') + '</span></div></div></div>';
  }
  function tabsHTML(list, site) {
    var rel = SITE_DS[site && site.id] || [];
    return '<div class="lv13tabs" role="tablist" aria-label="' + T('Bases procesadas', 'Processed datasets') + '">' + list.map(function (d) {
      var stx = d.ctx ? T('Contexto', 'Context') : d.pct ? T('Estimación', 'Estimate') : d.pre ? T('Preliminar', 'Preliminary') : T('Procesada', 'Processed');
      return '<button type="button" role="tab" class="lv13tab' + (d.id === st.ds ? ' on' : '') + (rel.indexOf(d.id) > -1 ? ' rel' : '') + '" aria-selected="' + (d.id === st.ds) + '" data-ds="' + d.id + '"><small><span>' + E(d.periods[0] || '') + (d.periods.length > 1 ? '–' + E(d.periods[d.periods.length - 1]) : '') + '</span><span class="st' + (d.pre ? ' pre' : '') + '">' + stx + '</span></small><b>' + E(d.name) + '</b><span>' + E(String(d.producer).split('·')[0]) + ' · ' + NF(d.rows.length) + ' ' + T('celdas', 'cells') + '</span></button>';
    }).join('') + '</div>';
  }
  function ctlHTML(ds) {
    var yrs = ds.periods, cs = cats(ds), deps = []; ds.rows.forEach(function (r) { if (deps.indexOf(r.dept) < 0) deps.push(r.dept); });
    deps.sort(function (a, b) { return dname(a).localeCompare(dname(b)); });
    var sexes = []; ds.rows.forEach(function (r) { if (sexes.indexOf(r.sex) < 0) sexes.push(r.sex); });
    function sel(name, lab, opts, v, allLab) { return '<label>' + lab + '<select data-f="' + name + '"><option value="">' + allLab + '</option>' + opts.map(function (o) { return '<option value="' + E(o[0]) + '"' + (o[0] === v ? ' selected' : '') + '>' + E(o[1]) + '</option>'; }).join('') + '</select></label>'; }
    var h = '<div class="lv13ctl">' + sel('year', T('Periodo', 'Period'), yrs.map(function (y) { return [y, y + (ds.pre && y === yrs[yrs.length - 1] ? T(' (parcial)', ' (partial)') : '')]; }), st.year, ds.pct || ds.ctx ? T('Todos', 'All') : T('Todos los años', 'All years')) +
      (cs.length > 1 ? sel('cat', T('Categoría', 'Category'), cs.map(function (c) { return [c, catLabel(c)]; }), st.cat, T('Todas', 'All')) : '') +
      (sexes.length > 1 ? sel('sex', T('Sexo', 'Sex'), sexes.map(function (s) { return [s, s === 'Mujer' ? T('Mujeres', 'Women') : s === 'Hombre' ? T('Hombres', 'Men') : s]; }), st.sex, T('Mujeres y hombres', 'Women and men')) : '') +
      sel('dep', T('Departamento', 'Department'), deps.map(function (d) { return [d, dname(d)]; }), st.dep, T('Todo el país', 'Whole country')) + '</div>';
    var by = [['dep', T('Departamento', 'Department'), deps.length > 1 && !st.dep], ['cat', T('Categoría', 'Category'), cs.length > 1 && !st.cat], ['anio', T('Año', 'Year'), yrs.length > 1 && !ds.pct], ['sexo', T('Sexo', 'Sex'), sexes.length > 1 && !st.sex && !ds.pct]];
    if (!by.some(function (b) { return b[0] === st.by && b[2]; })) { var f = by.find(function (b) { return b[2]; }); st.by = f ? f[0] : 'dep'; }
    h += '<div class="lv13by"><span>' + T('Agrupar por', 'Group by') + '</span>' + by.map(function (b) { return '<button type="button" data-by="' + b[0] + '"' + (st.by === b[0] ? ' class="on"' : '') + (b[2] ? '' : ' disabled') + '>' + b[1] + '</button>'; }).join('') + '</div>';
    var cr = [];
    if (st.year && yrs.length > 1) cr.push(['year', st.year]); if (st.cat) cr.push(['cat', catLabel(st.cat)]); if (st.sex) cr.push(['sex', st.sex === 'Mujer' ? T('Mujeres', 'Women') : T('Hombres', 'Men')]); if (st.dep) cr.push(['dep', dname(st.dep)]);
    h += '<div class="lv13crumbs" aria-label="' + T('Filtros activos', 'Active filters') + '">' + cr.map(function (c) { return '<button type="button" data-clear="' + c[0] + '" title="' + T('Quitar filtro', 'Remove filter') + '">' + E(c[1]) + ' ×</button>'; }).join('') + '</div>';
    return h;
  }
  function explorerHTML(ds) {
    var A = aggregate(ds), L = A.list, h = '';
    var tm = 0, th = 0; L.forEach(function (g) { tm += g.m; th += g.h; });
    if (ds.pct) {
      var withM = L.filter(function (g) { return g.pm != null; }), top = withM[0], gaps = withM.filter(function (g) { return g.ph != null; }).map(function (g) { return g.pm - g.ph; }).sort(function (a, b) { return a - b; });
      var med = gaps.length ? gaps[Math.floor(gaps.length / 2)] : null, cmax = Math.max.apply(null, withM.map(function (g) { return g.cve || 0; }));
      h += '<div class="lv13kpis"><div><b>' + (top ? NF(top.pm, 1) + ' %' : '—') + '</b><span>' + T('mayor participación de mujeres', 'highest women’s participation') + (top ? ' · ' + E(groupLabel(top.k)) : '') + '</span></div><div><b>' + (med != null ? NF(med, 1) + ' pp' : '—') + '</b><span>' + T('brecha mediana mujeres − hombres entre departamentos', 'median women − men gap across departments') + '</span></div><div><b>' + NF(cmax, 1) + ' %</b><span>' + T('coeficiente de variación más alto (precisión de la estimación)', 'highest coefficient of variation (estimate precision)') + '</span></div></div>';
    } else {
      var tot = tm + th, ctxOnly = ds.ctx;
      h += '<div class="lv13kpis"><div><b data-count>' + NF(ctxOnly ? tm : tot) + '</b><span>' + (ctxOnly ? T('mujeres en la selección', 'women in the selection') : T('registros en la selección', 'records in the selection')) + '</span></div>' +
        (ctxOnly ? '<div><b>' + NF(L.length) + '</b><span>' + T('grupos en la vista', 'groups in view') + '</span></div>' : '<div><b>' + (tot ? NF(tm / tot * 100, 1) + ' %' : '—') + '</b><span>' + T('corresponden a mujeres', 'are women') + ' (' + NF(tm) + ')</span></div>') +
        '<div><b>' + NF(A.supp) + '</b><span>' + T('celdas de 1 a 4 registros omitidas por protección', 'cells of 1–4 records withheld for privacy') + '</span></div></div>';
    }
    var sexLeg = !ds.pct && !ds.ctx && !st.sex;
    h += '<div class="lv13legend">' + (ds.pct ? '<span><i style="background:' + WOMEN + '"></i>' + T('Mujeres', 'Women') + '</span><span><i style="background:' + MEN + '"></i>' + T('Hombres', 'Men') + '</span><span>' + T('Porcentaje de participación, población de 10 años y más', 'Participation rate, population aged 10+') + '</span>' : sexLeg ? '<span><i style="background:' + WOMEN + '"></i>' + T('Mujeres', 'Women') + '</span><span><i style="background:' + MEN + '"></i>' + T('Hombres', 'Men') + '</span>' : '<span>' + E(ds.unit || '') + '</span>') + '</div>';
    var max = 0; L.forEach(function (g) { max = Math.max(max, ds.pct ? Math.max(g.pm || 0, g.ph || 0) : (st.sex === 'Mujer' ? g.m : st.sex === 'Hombre' ? g.h : g.t)); });
    var show = st.all ? L : L.slice(0, 12);
    var canDrill = st.by === 'dep' || st.by === 'cat' || st.by === 'anio' || st.by === 'sexo';
    h += '<div class="lv13bars">' + show.map(function (g) {
      var lab = groupLabel(g.k), title;
      if (ds.pct) {
        title = lab + ': ' + T('mujeres', 'women') + ' ' + NF(g.pm, 1) + ' % (IC 95 % ' + NF(g.lo, 1) + '–' + NF(g.hi, 1) + ') · ' + T('hombres', 'men') + ' ' + NF(g.ph, 1) + ' %';
        return '<button type="button" class="lv13bar pct" data-k="' + E(g.k) + '" title="' + E(title) + '"><span class="l">' + E(lab) + '</span><span class="t"><em style="width:' + ((g.pm || 0) / max * 100) + '%;background:' + WOMEN + '"></em><em style="width:' + ((g.ph || 0) / max * 100) + '%;background:' + MEN + '"></em></span><span class="v">' + NF(g.pm, 1) + ' · ' + NF(g.ph, 1) + '</span></button>';
      }
      var v = st.sex === 'Mujer' ? g.m : st.sex === 'Hombre' ? g.h : g.t;
      title = lab + ': ' + NF(v) + (sexLeg && g.t ? ' · ' + T('mujeres', 'women') + ' ' + NF(g.m) + ' (' + NF(g.m / g.t * 100, 1) + ' %) · ' + T('hombres', 'men') + ' ' + NF(g.h) : '') + ((g.sm + g.sh) ? ' · ' + (g.sm + g.sh) + T(' celdas protegidas', ' protected cells') : '');
      var seg = sexLeg ? '<em style="width:' + (g.m / max * 100) + '%;background:' + WOMEN + '"></em><em style="width:' + (g.h / max * 100) + '%;background:' + MEN + '"></em>' : '<em style="width:' + (v / max * 100) + '%;background:' + (st.sex === 'Hombre' ? MEN : WOMEN) + '"></em>';
      return '<button type="button" class="lv13bar" data-k="' + E(g.k) + '" title="' + E(title) + '"' + (canDrill ? '' : ' disabled') + '><span class="l">' + E(lab) + '</span><span class="t">' + seg + '</span><span class="v">' + NF(v) + ((g.sm + g.sh) ? '*' : '') + '</span></button>';
    }).join('') + '</div>';
    if (L.length > 12) h += '<button type="button" class="lv13more" data-all="1">' + (st.all ? T('Ver solo los 12 primeros', 'Show top 12 only') : T('Ver los ' + L.length + ' grupos', 'Show all ' + L.length + ' groups')) + '</button>';
    if (!L.length) h += '<p class="lv13note">' + T('No hay celdas publicables con esta combinación de filtros.', 'No publishable cells for this filter combination.') + '</p>';
    // tabla
    h += '<details class="lv13det"><summary class="lv13more" style="display:inline-block">' + T('Ver la tabla de esta vista', 'See this view as a table') + '</summary><div class="lv13tblwrap"><table class="lv13tbl"><thead><tr><th>' + E({ dep: T('Departamento', 'Department'), cat: T('Categoría', 'Category'), anio: T('Año', 'Year'), sexo: T('Sexo', 'Sex') }[st.by]) + '</th>' +
      (ds.pct ? '<th class="r">' + T('Mujeres %', 'Women %') + '</th><th class="r">IC 95 %</th><th class="r">CVE %</th><th class="r">' + T('Hombres %', 'Men %') + '</th>' : '<th class="r">' + T('Mujeres', 'Women') + '</th>' + (ds.ctx ? '' : '<th class="r">' + T('Hombres', 'Men') + '</th><th class="r">Total</th><th class="r">% ' + T('mujeres', 'women') + '</th>')) + '</tr></thead><tbody>' +
      L.map(function (g) { return '<tr><td>' + E(groupLabel(g.k)) + '</td>' + (ds.pct ? '<td class="r">' + NF(g.pm, 1) + '</td><td class="r">' + NF(g.lo, 1) + '–' + NF(g.hi, 1) + '</td><td class="r">' + NF(g.cve, 1) + '</td><td class="r">' + NF(g.ph, 1) + '</td>' : '<td class="r">' + (g.sm ? '&lt;5' + (g.m ? ' + ' + NF(g.m) : '') : NF(g.m)) + '</td>' + (ds.ctx ? '' : '<td class="r">' + (g.sh ? '&lt;5' + (g.h ? ' + ' + NF(g.h) : '') : NF(g.h)) + '</td><td class="r">' + NF(g.t) + '</td><td class="r">' + (g.t ? NF(g.m / g.t * 100, 1) : '—') + '</td>')) + '</tr>'; }).join('') + '</tbody></table></div></details>';
    h += '<div class="lv13foot"><span>' + E(ds.producer) + ' · ' + T('corte', 'cut-off') + ' ' + E(ds.cut || '—') + (ds.pre ? ' · ' + T('preliminar', 'preliminary') : '') + (A.supp ? ' · * ' + T('incluye celdas protegidas no sumadas', 'includes withheld cells not added') : '') + '</span><button type="button" data-csv="1">' + T('Descargar esta vista (CSV)', 'Download this view (CSV)') + '</button></div>';
    return h;
  }
  /* ===== v14 · Ficha de detalle de cada grupo ===== */
  function rowsFor(ds, dim, k) {
    // filas con los filtros actuales, fijando el grupo seleccionado y liberando la dimensión indicada
    return ds.rows.filter(function (r) {
      var f = { year: st.year, sex: st.sex, cat: st.cat, dep: st.dep };
      if (st.by === 'dep') f.dep = k; if (st.by === 'cat') f.cat = k; if (st.by === 'anio') f.year = k; if (st.by === 'sexo') f.sex = k;
      if (dim) f[dim] = '';
      return (!f.year || r.year === f.year) && (!f.sex || r.sex === f.sex) && (!f.cat || r.category === f.cat) && (!f.dep || r.dept === f.dep);
    });
  }
  function sumBy(rows, key) { var G = {}; rows.forEach(function (r) { var k = key(r); var g = G[k] || (G[k] = { k: k, m: 0, h: 0, s: 0, pm: null, ph: null }); if (r.suppressed || r.count == null) { g.s++; return; } if (r.sex === 'Mujer') { g.m += r.count; g.pm = r.count; } else if (r.sex === 'Hombre') { g.h += r.count; g.ph = r.count; } }); return G; }
  function lineSVG(labels, series, fmt) {
    var W2 = 420, H2 = 150, L = 46, R = 12, Tp = 14, B = 26, all = [];
    series.forEach(function (s) { s.values.forEach(function (v) { if (v != null) all.push(v); }); });
    if (!all.length) return '';
    var mx = Math.max.apply(null, all), mn = 0; if (mx === mn) mx = mn + 1;
    var x = function (i) { return L + (labels.length === 1 ? (W2 - L - R) / 2 : i * (W2 - L - R) / (labels.length - 1)); }, y = function (v) { return Tp + (1 - (v - mn) / (mx - mn)) * (H2 - Tp - B); };
    var g = [0, .5, 1].map(function (t) { var v = mn + t * (mx - mn); return '<line x1="' + L + '" x2="' + (W2 - R) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#ebe2f1"/><text x="' + (L - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end" font-size="10" fill="#6f6f6e">' + fmt(v) + '</text>'; }).join('');
    var xl = labels.map(function (l, i) { return (labels.length > 8 && i % 2 && i !== labels.length - 1) ? '' : '<text x="' + x(i) + '" y="' + (H2 - 8) + '" text-anchor="middle" font-size="10" fill="#6f6f6e">' + E(l) + '</text>'; }).join('');
    var ln = series.map(function (s) {
      var pts = s.values.map(function (v, i) { return v == null ? null : [x(i), y(v), v, labels[i]]; }).filter(Boolean);
      return '<polyline fill="none" stroke="' + s.color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" points="' + pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' ') + '"/>' + pts.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.6" fill="#fff" stroke="' + s.color + '" stroke-width="2"><title>' + E(s.name + ' · ' + p[3] + ': ' + fmt(p[2])) + '</title></circle>'; }).join('');
    }).join('');
    return '<svg class="lv14line" viewBox="0 0 ' + W2 + ' ' + H2 + '" role="img" aria-label="' + E(series.map(function (s) { return s.name; }).join(', ')) + '">' + g + xl + ln + '</svg>';
  }
  function miniBars(items, color) {
    var mx = Math.max.apply(null, items.map(function (i) { return i.v; }).concat([1]));
    return '<div class="lv14mb">' + items.map(function (i) { return '<div title="' + E(i.l + ': ' + i.t) + '"><span>' + E(i.l) + '</span><i><em style="width:' + (i.v / mx * 100) + '%;background:' + (i.c || color) + '"></em></i><b>' + E(i.t) + '</b></div>'; }).join('') + '</div>';
  }
  function cvLabel(c) { return c == null ? '' : c <= 7 ? T('precisa', 'precise') : c < 15 ? T('aceptable', 'acceptable') : c <= 20 ? T('regular', 'fair') : T('poco precisa', 'low precision'); }
  function detailHTML(ds, k) {
    var A = aggregate(ds), L = A.list, g = L.find(function (x) { return String(x.k) === String(k); }); if (!g) return pipeHTML(ds);
    var rank = L.indexOf(g) + 1, lab = groupLabel(k), h = '<div class="lv13box lv14detail"><div class="lv14dh"><div><small>' + T('Ficha de detalle', 'Detail sheet') + ' · ' + E(ds.name) + '</small><h3>' + E(lab) + '</h3></div><button type="button" class="lv14x" data-unsel="1" aria-label="' + T('Cerrar ficha', 'Close sheet') + '">×</button></div>';
    var ctx = []; if (st.year && st.by !== 'anio') ctx.push(st.year); if (st.cat && st.by !== 'cat') ctx.push(catLabel(st.cat)); if (st.sex && st.by !== 'sexo') ctx.push(st.sex === 'Mujer' ? T('Mujeres', 'Women') : T('Hombres', 'Men')); if (st.dep && st.by !== 'dep') ctx.push(dname(st.dep));
    if (ctx.length) h += '<div class="lv14ctx">' + ctx.map(function (c) { return '<span>' + E(c) + '</span>'; }).join('') + '</div>';
    if (ds.pct) {
      var gap = g.pm != null && g.ph != null ? g.pm - g.ph : null;
      h += '<div class="lv13kpis"><div><b>' + NF(g.pm, 1) + ' %</b><span>' + T('mujeres que participan', 'women participating') + '</span></div><div><b>' + NF(g.ph, 1) + ' %</b><span>' + T('hombres que participan', 'men participating') + '</span></div><div><b>' + (gap != null ? (gap > 0 ? '+' : '') + NF(gap, 1) + ' pp' : '—') + '</b><span>' + T('brecha mujeres − hombres', 'women − men gap') + '</span></div></div>';
      h += '<ul class="lv14facts"><li><b>' + T('Intervalo de confianza 95 %', '95 % confidence interval') + '</b><span>' + NF(g.lo, 1) + ' – ' + NF(g.hi, 1) + ' %</span></li><li><b>' + T('Coeficiente de variación', 'Coefficient of variation') + '</b><span>' + NF(g.cve, 1) + ' % · ' + cvLabel(g.cve) + '</span></li><li><b>' + T('Posición entre ' + L.length, 'Rank among ' + L.length) + '</b><span>' + rank + '</span></li></ul>';
      var mean = 0, n = 0; L.forEach(function (x) { if (x.pm != null) { mean += x.pm; n++; } }); mean = n ? mean / n : null;
      h += miniBars([{ l: lab, v: g.pm || 0, t: NF(g.pm, 1) + ' %', c: WOMEN }, { l: T('Promedio simple de departamentos', 'Simple mean of departments'), v: mean || 0, t: NF(mean, 1) + ' %', c: '#B243EA' }, { l: T('Hombres en ' + lab, 'Men in ' + lab), v: g.ph || 0, t: NF(g.ph, 1) + ' %', c: MEN }]);
      h += '<p class="lv13note">' + T('El promedio simple sirve solo como referencia visual; no es el dato nacional publicado por el DANE.', 'The simple mean is only a visual reference, not DANE’s national figure.') + '</p>';
    } else {
      var v = st.sex === 'Mujer' ? g.m : st.sex === 'Hombre' ? g.h : g.t, tot = 0; L.forEach(function (x) { tot += st.sex === 'Mujer' ? x.m : st.sex === 'Hombre' ? x.h : x.t; });
      h += '<div class="lv13kpis"><div><b>' + NF(v) + '</b><span>' + (ds.ctx ? T('mujeres', 'women') : T('registros', 'records')) + '</span></div>' + (ds.ctx ? '' : '<div><b>' + (g.t ? NF(g.m / g.t * 100, 1) + ' %' : '—') + '</b><span>' + T('son mujeres', 'are women') + ' (' + NF(g.m) + ')</span></div>') + '<div><b>' + (tot ? NF(v / tot * 100, 1) + ' %' : '—') + '</b><span>' + T('del total de la vista', 'of the view total') + ' · ' + T('puesto', 'rank') + ' ' + rank + '/' + L.length + '</span></div></div>';
      // serie por año
      if (st.by !== 'anio' && ds.periods.length > 1) {
        var Y = sumBy(rowsFor(ds, 'year', k), function (r) { return r.year; });
        var ser = ds.ctx ? [{ name: T('Mujeres', 'Women'), color: WOMEN, values: ds.periods.map(function (y) { return Y[y] ? Y[y].m : null; }) }] : [{ name: T('Mujeres', 'Women'), color: WOMEN, values: ds.periods.map(function (y) { return Y[y] ? Y[y].m : null; }) }, { name: T('Hombres', 'Men'), color: MEN, values: ds.periods.map(function (y) { return Y[y] ? Y[y].h : null; }) }];
        h += '<h4>' + T('Evolución por año', 'Trend by year') + (ds.pre ? ' <small>' + T('(el último año es parcial)', '(last year is partial)') + '</small>' : '') + '</h4>' + lineSVG(ds.periods, ser, function (x) { return NF(x); });
      }
      // categorías
      if (st.by !== 'cat' && cats(ds).length > 1) {
        var C = sumBy(rowsFor(ds, 'cat', k), function (r) { return r.category; }), ci = Object.keys(C).map(function (c) { return { l: catLabel(c), v: C[c].m, t: NF(C[c].m) + (C[c].h ? ' · ' + NF(C[c].m / (C[c].m + C[c].h) * 100, 0) + ' %' : '') }; }).sort(function (a, b) { return b.v - a.v; });
        h += '<h4>' + T('Mujeres por categoría', 'Women by category') + ' <small>' + T('(registros · % mujeres)', '(records · % women)') + '</small></h4>' + miniBars(ci, WOMEN);
      }
      // departamentos
      if (st.by !== 'dep') {
        var Dp = sumBy(rowsFor(ds, 'dep', k), function (r) { return r.dept; }), di = Object.keys(Dp).map(function (d) { return { l: dname(d), v: Dp[d].m, t: NF(Dp[d].m) }; }).sort(function (a, b) { return b.v - a.v; }).slice(0, 8);
        if (di.length > 1) h += '<h4>' + T('Departamentos con más registros de mujeres', 'Departments with most records of women') + '</h4>' + miniBars(di, WOMEN);
      }
      // población de referencia
      var pop = (DATA() || {}).population;
      if (st.by === 'dep' && pop && !ds.ctx) { var py = pop.rows.filter(function (r) { return r.dept === k; }).sort(function (a, b) { return a.year < b.year ? 1 : -1; })[0]; if (py) h += '<p class="lv13note">' + T('Contexto: ', 'Context: ') + E(dname(k)) + T(' tiene ', ' has ') + NF(py.women) + T(' mujeres proyectadas en ', ' projected women in ') + E(py.year) + T(' (DANE). No se calcula tasa porque el lugar del hecho no siempre coincide con el de residencia.', ' (DANE). No rate is computed because place of occurrence may differ from residence.') + '</p>'; }
      if (g.sm + g.sh) h += '<p class="lv13note">' + (g.sm + g.sh) + T(' celdas de este grupo tienen entre 1 y 4 registros y no se suman, para proteger la identidad de las personas.', ' cells in this group have 1–4 records and are withheld to protect identities.') + '</p>';
    }
    var can = st.by !== 'sexo' || !ds.ctx;
    h += '<div class="lv14acts">' + (can ? '<button type="button" class="pri" data-drill="' + E(k) + '">' + T('Filtrar por ', 'Filter by ') + E(lab) + ' →</button>' : '') + '<button type="button" data-vars="' + ds.id + '">' + T('Ficha de la base', 'Dataset sheet') + '</button></div></div>';
    return h;
  }
  function pipeHTML(ds) {
    var a = ds.audit, steps = [];
    if (a.input_records != null) steps.push(['1', T('Registros leídos del archivo', 'Records read from file'), E(ds.file).slice(0, 90), NF(a.input_records), '']);
    if (a.duplicate_ids != null) steps.push(['2', T('Identificadores duplicados', 'Duplicate IDs'), T('Se revisa que cada registro aparezca una sola vez', 'Each record must appear once'), NF(a.duplicate_ids), a.duplicate_ids ? 'warn' : '']);
    if (a.invalid_department_records != null) steps.push(['3', T('Registros sin departamento válido', 'Records without a valid department'), T('No entran al mapa; se informan', 'Excluded from the map and reported'), NF(a.invalid_department_records), a.invalid_department_records ? 'warn' : '']);
    steps.push([String(steps.length + 1), T('Celdas agregadas', 'Aggregated cells'), T('Conteo por año, departamento, sexo y categoría; no se publican microdatos', 'Counts by year, department, sex and category; no microdata'), NF(a.aggregate_cells != null ? a.aggregate_cells : ds.rows.length), '']);
    if (a.suppressed_cells != null) steps.push([String(steps.length + 1), T('Celdas protegidas', 'Protected cells'), T('Celdas de 1 a 4 registros que no se muestran', 'Cells of 1–4 records not shown'), NF(a.suppressed_cells), 'prot']);
    steps.push([String(steps.length + 1), T('Celdas publicadas', 'Published cells'), T('Lo que ves en mapas, gráficas y descargas', 'What you see in maps, charts and downloads'), NF((a.aggregate_cells != null ? a.aggregate_cells : ds.rows.length) - (a.suppressed_cells || 0)), '']);
    return '<div class="lv13box"><h3><i>' + '⇣' + '</i>' + T('Cómo se procesó esta base', 'How this dataset was processed') + '</h3><p class="n">' + E(ds.method || '') + '</p><ol class="lv13pipe">' + steps.map(function (s) { return '<li class="' + s[4] + '"><i>' + s[0] + '</i><div><b>' + s[1] + '</b><span>' + s[2] + '</span></div><strong>' + s[3] + '</strong></li>'; }).join('') + '</ol>' +
      '<p class="lv13note"><button type="button" class="lv13more" data-vars="' + ds.id + '" style="padding:0">' + T('Ver las ' + ds.headers.length + ' variables de la fuente →', 'See the ' + ds.headers.length + ' source variables →') + '</button></p></div>';
  }
  /* ===== v15 · Niveles de detalle (reemplaza la matriz) ===== */
  var WHY = {
    mes: ['Mes del hecho', 'Ver en qué meses ocurren más hechos para planear la prevención. El día y la hora no se publican porque pueden identificar a una persona.', 'Month of the event'],
    mun: ['Municipio', 'Bajar del departamento al municipio, incluidos Puerto Tejada, Suárez, Corinto, Buenos Aires, Florida, Pradera y Jamundí.', 'Municipality'],
    zona: ['Zona urbana o rural', 'Comparar cabeceras con centros poblados y zonas rurales, donde viven muchas mujeres campesinas.', 'Urban or rural'],
    edad: ['Edad y curso de vida', 'Mujer es desde que nace: permite ver niñas en primera infancia e infancia, adolescentes, jóvenes, adultas y mujeres mayores por separado.', 'Age and life course'],
    etnia: ['Pertenencia étnico-racial', 'Ver la situación de mujeres indígenas, negras, afrodescendientes, raizales, palenqueras y Rrom.', 'Ethnic-racial identity'],
    disc: ['Discapacidad', 'Ver la situación de mujeres con discapacidad, que suelen enfrentar más barreras para denunciar.', 'Disability'],
    os: ['Orientación sexual', 'Ver violencias contra mujeres lesbianas y bisexuales.', 'Sexual orientation'],
    ig: ['Identidad de género', 'Ver violencias contra mujeres trans y personas con identidades de género diversas.', 'Gender identity'],
    esc: ['Escolaridad', 'Relacionar las violencias con el nivel educativo.', 'Education'],
    mig: ['País de nacimiento', 'Ver la situación de mujeres migrantes y refugiadas.', 'Country of birth'],
    grp: ['Pertenencia grupal', 'Identificar mujeres campesinas, desplazadas, defensoras de derechos humanos y otros grupos.', 'Group membership'],
    agr: ['Presunto agresor', 'Saber quién agrede: pareja, expareja, familiar, conocido o desconocido.', 'Alleged aggressor'],
    esc2: ['Lugar y contexto', 'Dónde y en qué contexto ocurre: vivienda, vía pública, trabajo, conflicto armado.', 'Place and context']
  };
  function previewFor(ds, dim) {
    var rows = ds.rows.filter(function (r) { return (dim === 'anio' || !st.year || r.year === st.year) && (dim === 'sexo' || !st.sex || r.sex === st.sex) && (dim === 'cat' || !st.cat || r.category === st.cat) && (dim === 'dep' || !st.dep || r.dept === st.dep); });
    if (dim === 'anio') {
      if (ds.periods.length < 2) return '<p class="lv15pv">' + T('Esta base tiene un solo periodo: ', 'Single period: ') + E(ds.periods[0] || '') + '</p>';
      var Y = sumBy(rows, function (r) { return r.year; });
      return lineSVG(ds.periods, [{ name: T('Mujeres', 'Women'), color: WOMEN, values: ds.periods.map(function (y) { return Y[y] ? (ds.pct ? null : Y[y].m) : null; }) }], function (x) { return NF(x); });
    }
    if (dim === 'dep') {
      var G = sumBy(rows, function (r) { return r.dept; }), it = Object.keys(G).map(function (k) { var g = G[k]; return { l: dname(k), v: ds.pct ? (g.pm || 0) : g.m, t: ds.pct ? NF(g.pm, 1) + ' %' : NF(g.m) }; }).sort(function (a, b) { return b.v - a.v; }).slice(0, 4);
      return miniBars(it, WOMEN);
    }
    if (dim === 'sexo') {
      if (ds.ctx) return '<p class="lv15pv">' + T('Esta base solo cuenta mujeres.', 'This dataset only counts women.') + '</p>';
      var m = 0, h = 0, pm = [], ph = []; rows.forEach(function (r) { if (r.suppressed || r.count == null) return; if (ds.pct) { (r.sex === 'Mujer' ? pm : ph).push(r.count); } else if (r.sex === 'Mujer') m += r.count; else if (r.sex === 'Hombre') h += r.count; });
      if (ds.pct) { var a = pm.reduce(function (x, y) { return x + y; }, 0) / (pm.length || 1), b = ph.reduce(function (x, y) { return x + y; }, 0) / (ph.length || 1); return miniBars([{ l: T('Mujeres', 'Women'), v: a, t: NF(a, 1) + ' %', c: WOMEN }, { l: T('Hombres', 'Men'), v: b, t: NF(b, 1) + ' %', c: MEN }]) + '<p class="lv15pv">' + T('Promedio simple de departamentos, solo como referencia.', 'Simple mean of departments, reference only.') + '</p>'; }
      var t = m + h; return '<div class="lv15split"><i style="width:' + (t ? m / t * 100 : 0) + '%;background:' + WOMEN + '"></i><i style="width:' + (t ? h / t * 100 : 0) + '%;background:' + MEN + '"></i></div><p class="lv15pv"><b style="color:' + WOMEN + '">' + (t ? NF(m / t * 100, 1) : '—') + ' % ' + T('mujeres', 'women') + '</b> · ' + NF(m) + T(' de ', ' of ') + NF(t) + T(' registros', ' records') + '</p>';
    }
    if (dim === 'cat') {
      if (cats(ds).length < 2) return '<p class="lv15pv">' + T('Esta base tiene una sola categoría: ', 'Single category: ') + E(catLabel(cats(ds)[0] || '')) + '</p>';
      var C = sumBy(rows, function (r) { return r.category; }); return miniBars(Object.keys(C).map(function (k) { return { l: catLabel(k), v: C[k].m, t: NF(C[k].m) }; }).sort(function (a, b) { return b.v - a.v; }).slice(0, 4), WOMEN);
    }
    return '';
  }
  function matrixHTML(list, site) {
    var ds = list.find(function (d) { return d.id === st.ds; }) || list[0], hl = SITE_DIM[site && site.id] || [];
    var pubs = [['anio', T('Año', 'Year'), T('Cómo cambian las cifras en el tiempo.', 'How figures change over time.'), 'trend'], ['dep', T('Departamento', 'Department'), T('Dónde se concentran los registros.', 'Where records concentrate.'), 'network'], ['sexo', T('Sexo', 'Sex'), T('Cuánto pesan las mujeres frente a los hombres.', 'Women’s share vs men.'), 'people'], ['cat', T('Categoría', 'Category'), T('Qué tipo de hecho se registró.', 'What type of event.'), 'chart']];
    var h = '<div class="lv15lv"><div class="lv15lvh"><div><small>' + T('Niveles de detalle', 'Levels of detail') + ' · ' + E(ds.name) + '</small><h3>' + T('¿Con cuánto detalle puedes consultar?', 'How much detail can you query?') + '</h3><p>' + T('Toca un nivel para explorarlo. Las vistas previas usan los filtros que tienes activos.', 'Tap a level to explore it. Previews use your active filters.') + '</p></div></div>';
    h += '<div class="lv15sec"><span class="lv15badge ok">✓ ' + T('Disponible ahora', 'Available now') + '</span><div class="lv15cards">' + pubs.map(function (p) {
      return '<button type="button" class="lv15card ok' + (st.by === p[0] ? ' on' : '') + '" data-by2="' + p[0] + '"><div class="lv15ch"><span>' + ico2(p[3]) + '</span><div><b>' + p[1] + '</b><small>' + p[2] + '</small></div></div><div class="lv15prev">' + previewFor(ds, p[0]) + '</div><em>' + T('Explorar por ', 'Explore by ') + p[1].toLowerCase() + ' →</em></button>';
    }).join('') + '</div></div>';
    var pend = DIMS.filter(function (d) { return ['anio', 'dep', 'sexo'].indexOf(d[0]) < 0; }).map(function (d) {
      var srcs = list.filter(function (x) { return dimState(x, d[0]) === 'src'; }).map(function (x) { return { n: x.name, v: x.headers.filter(function (hh) { return d[3].test(hh) && !PRIVATE.test(hh); }) }; }).filter(function (x) { return x.v.length; });
      return { d: d, srcs: srcs, hl: hl.indexOf(d[0]) > -1 };
    }).filter(function (x) { return x.srcs.length && WHY[x.d[0]]; }).sort(function (a, b) { return (b.hl - a.hl) || (a.d[0] === 'edad' ? -1 : b.d[0] === 'edad' ? 1 : 0); });
    h += '<div class="lv15sec"><span class="lv15badge soon">' + HALF + ' ' + T('Está en las fuentes · por procesar', 'In the sources · to be processed') + '</span><div class="lv15cards soon">' + pend.map(function (x) {
      var w = WHY[x.d[0]];
      return '<details class="lv15card soon' + (x.hl ? ' hl' : '') + '"><summary><div class="lv15ch"><span>' + HALF + '</span><div><b>' + E(en() ? w[2] : w[0]) + (x.hl ? ' <i>' + T('clave para esta línea', 'key for this line') + '</i>' : '') + '</b><small>' + E(w[1]) + '</small></div></div><em>' + x.srcs.length + ' ' + (x.srcs.length === 1 ? T('base la trae', 'dataset has it') : T('bases la traen', 'datasets have it')) + ' · ' + T('ver detalle', 'see detail') + '</em></summary><ul>' + x.srcs.map(function (s) { return '<li><b>' + E(s.n) + '</b><span>' + s.v.map(E).join(' · ') + '</span></li>'; }).join('') + '</ul><p>' + T('Se publicaría agregada, con supresión de celdas de 1 a 4 registros, tras aprobar la política de protección de datos.', 'Would be published in aggregate with 1–4 cell suppression, once the data protection policy is approved.') + '</p></details>';
    }).join('') + '</div></div>';
    h += '<p class="lv15priv">' + ico2('shield') + ' ' + T('Nunca se publican: número de identificación, día exacto, hora, localidad ni códigos que permitan ubicar a una persona.', 'Never published: ID numbers, exact day, time, locality or codes that could locate a person.') + '</p></div>';
    return h;
  }
  function ico2(n) { try { return LV11.icon(n, 18); } catch (e) { return ''; } }

  function fichaHTML(ds) {
    var deps = {}, C = {}, sup = 0; ds.rows.forEach(function (r) { deps[r.dept] = 1; if (r.suppressed || r.count == null) { sup++; return; } var c = C[r.category] || (C[r.category] = { m: 0, h: 0 }); if (ds.pct) return; if (r.sex === 'Mujer') c.m += r.count; else if (r.sex === 'Hombre') c.h += r.count; });
    var facts = [[T('Qué mide', 'What it measures'), ds.unit || ''], [T('Productora', 'Producer'), ds.producer], [T('Periodo', 'Period'), ds.periods.join(' · ')], [T('Fecha de corte', 'Cut-off'), ds.cut || '—'], [T('Estado', 'Status'), ds.ctx ? T('Contexto demográfico', 'Demographic context') : ds.pct ? T('Estimación publicada por la fuente', 'Estimate published by the source') : ds.pre ? T('Preliminar: puede cambiar', 'Preliminary: may change') : T('Definitiva según el archivo', 'Final per file')], [T('Cobertura', 'Coverage'), Object.keys(deps).length + ' ' + T('departamentos', 'departments')], [T('Celdas publicadas', 'Published cells'), NF(ds.rows.length - sup) + ' / ' + NF(ds.rows.length)], [T('Desagregación publicada', 'Published breakdown'), T('año · departamento · sexo', 'year · department · sex') + (cats(ds).length > 1 ? ' · ' + T('categoría', 'category') : '')]];
    var h = '<dl class="lv14facts2">' + facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + E(f[1]) + '</dd></div>'; }).join('') + '</dl>';
    if (!ds.pct && cats(ds).length > 1) {
      h += '<h3 class="lv14vh">' + T('Categorías incluidas (todos los años)', 'Categories included (all years)') + '</h3>' + miniBars(Object.keys(C).map(function (c) { var x = C[c]; return { l: catLabel(c), v: x.m, t: NF(x.m) + ' ' + T('mujeres', 'women') + (x.m + x.h ? ' · ' + NF(x.m / (x.m + x.h) * 100, 0) + ' %' : '') }; }).sort(function (a, b) { return b.v - a.v; }), WOMEN);
    }
    return h;
  }
  function varsDialog(id) {
    var ds = datasets().find(function (d) { return d.id === id; }); if (!ds) return;
    var pub = [], src = [], prv = [];
    ds.headers.forEach(function (h) {
      if (PRIVATE.test(h)) prv.push(h);
      else if (/participación \(%\)|^l\.[is]\.|^cve/i.test(h) || DIMS.some(function (d) { return (PUBLISHED[ds.id] || []).indexOf(d[0]) > -1 && d[3].test(h); })) pub.push(h);
      else src.push(h);
    });
    var d = D.getElementById('lv11Dialog');
    if (!d) { d = D.createElement('dialog'); d.id = 'lv11Dialog'; d.className = 'lv11dlg'; d.setAttribute('data-no-translate', ''); D.body.appendChild(d); d.addEventListener('click', function (e) { if (e.target === d) d.close(); }); }
    d.style.setProperty('--c', '#8E36CF'); d.style.setProperty('--ci', '#6E24A8');
    d.innerHTML = '<button class="lv11x" onclick="this.closest(\'dialog\').close()" aria-label="' + T('Cerrar', 'Close') + '">×</button><div class="lv11dbody"><div class="lv11dh"><div class="eyebrow">' + T('Ficha de la base', 'Dataset sheet') + '</div><h2>' + E(ds.name) + '</h2><p>' + E(ds.producer) + ' · ' + E(ds.file) + '</p></div>' +
      fichaHTML(ds) + '<h3 class="lv14vh">' + T('Variables de la fuente', 'Source variables') + '</h3><div class="lv13vars"><div class="pub"><h4><span class="lv13dot pub" style="width:20px;height:20px">✓</span>' + T('Publicadas', 'Published') + ' (' + pub.length + ')</h4><ul>' + pub.map(function (h) { return '<li>' + E(h) + '</li>'; }).join('') + '</ul></div>' +
      '<div><h4><span class="lv13dot src" style="width:20px;height:20px">' + HALF + '</span>' + T('Por procesar', 'To process') + ' (' + src.length + ')</h4><ul>' + src.map(function (h) { return '<li>' + E(h) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="prv"><h4><span class="lv13dot no" style="width:20px;height:20px">–</span>' + T('No se publican (identifican personas)', 'Never published (identifying)') + ' (' + prv.length + ')</h4><ul>' + prv.map(function (h) { return '<li>' + E(h) + '</li>'; }).join('') + '</ul></div></div>' +
      '<p class="lv13note">' + T('Unidad: ', 'Unit: ') + E(ds.unit || '') + '. ' + E(ds.method || '') + '</p></div>';
    if (!d.open) d.showModal(); d.scrollTop = 0;
  }
  function csv(ds) {
    var A = aggregate(ds), lines = [];
    var head = [st.by].concat(ds.pct ? ['mujeres_pct', 'ic_inf', 'ic_sup', 'cve', 'hombres_pct'] : ['mujeres', 'hombres', 'total', 'celdas_protegidas']);
    lines.push(head.join(','));
    A.list.forEach(function (g) { var lab = '"' + String(groupLabel(g.k)).replace(/"/g, '""') + '"'; lines.push([lab].concat(ds.pct ? [g.pm, g.lo, g.hi, g.cve, g.ph] : [g.m, g.h, g.t, g.sm + g.sh]).join(',')); });
    lines.push(''); lines.push('"Fuente: ' + String(ds.producer).replace(/"/g, '') + ' · corte ' + (ds.cut || '') + ' · filtros: ' + [st.year, st.cat && catLabel(st.cat), st.sex, st.dep && dname(st.dep)].filter(Boolean).join(' / ') + '"');
    var a = D.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' })); a.download = 'consulta_desagregada_' + ds.id + '_' + st.by + '.csv'; D.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  var host = null, renderKey = '';
  function render(force) {
    var list = datasets(); if (!list.length) return;
    var sid = curSite(), site = siteObj(sid);
    var content = D.querySelector('#libresRoot .v9content'); if (!content) return;
    if (!host) { host = D.createElement('section'); host.id = 'lv13des'; host.className = 'lv13des'; host.setAttribute('data-no-translate', ''); host.setAttribute('aria-label', T('Consulta desagregada', 'Disaggregated query')); wire(host); }
    // ubicación: dentro del micrositio antes del explorador; en el panorama general, después de las tarjetas
    var pano = content.querySelector(':scope > .lv11pano'), anchor;
    if (pano) { anchor = pano.querySelector('.lv11exph'); if (anchor) { if (host.nextSibling !== anchor || host.parentNode !== pano) pano.insertBefore(host, anchor); } else if (host.parentNode !== pano || host.nextSibling) pano.appendChild(host); }
    else { var cards = content.querySelector(':scope > .v9cards'); if (cards) { if (cards.nextSibling !== host) cards.parentNode.insertBefore(host, cards.nextSibling); } else if (host.parentNode !== content) content.appendChild(host); }
    var key = sid + '|' + (en() ? 'en' : 'es');
    if (key !== renderKey) { renderKey = key; resetFor(sid, list); force = true; }
    if (!force && host.firstChild) return;
    paint(list, site);
  }
  function paint(list, site) {
    list = list || datasets(); site = site || siteObj(curSite());
    var ds = list.find(function (d) { return d.id === st.ds; }) || list[0];
    var tabsScroll = host.querySelector('.lv13tabs'); tabsScroll = tabsScroll ? tabsScroll.scrollLeft : 0;
    host.style.setProperty('--c', '#8E36CF');
    host.innerHTML = headHTML(list, site) + tabsHTML(list, site) + '<div class="lv13grid"><div class="lv13box"><h3><i>⌕</i>' + T('Explora y desagrega', 'Explore and break down') + '</h3><p class="n">' + T('Toca una barra para abrir su ficha de detalle: evolución, categorías, territorios y protección de datos. Desde la ficha puedes filtrar y seguir bajando.', 'Tap a bar to open its detail sheet: trend, categories, territories and data protection. From there you can filter and keep drilling down.') + '</p>' + ctlHTML(ds) + '<div class="lv13out">' + explorerHTML(ds) + '</div></div>' + (st.sel != null && st.sel !== '' ? detailHTML(ds, st.sel) : pipeHTML(ds)) + '</div>' + matrixHTML(list, site);
    if (st.sel) { var sb = host.querySelector('.lv13bar[data-k="' + String(st.sel).replace(/"/g, '') + '"]'); if (sb) sb.classList.add('sel'); }
    var t = host.querySelector('.lv13tabs'); if (t) t.scrollLeft = tabsScroll;
  }
  function next(by, ds) {
    var order = ds.pct ? ['dep'] : ['dep', 'cat', 'anio', 'sexo'];
    var ok = function (b) { return (b === 'dep' && !st.dep) || (b === 'cat' && !st.cat && cats(ds).length > 1) || (b === 'anio' && ds.periods.length > 1) || (b === 'sexo' && !st.sex && !ds.ctx); };
    return order.filter(function (b) { return b !== by && ok(b); })[0] || by;
  }
  function wire(h) {
    h.addEventListener('click', function (e) {
      var t = e.target.closest('button'); if (!t || !h.contains(t)) return;
      var list = datasets(), ds = list.find(function (d) { return d.id === st.ds; }) || list[0];
      if (t.dataset.ds) { st.ds = t.dataset.ds; st.sel = ''; var nd = list.find(function (d) { return d.id === st.ds; }); st.year = lastFull(nd); st.cat = ''; st.sex = ''; st.dep = ''; st.all = false; st.by = 'dep'; if (nd.id === 'nofatal') { var c = cats(nd).find(function (c) { return /Pareja/.test(c); }); if (c) st.cat = c; } if (nd.id === 'fatal') { var c3 = cats(nd).find(function (c) { return /Homicid/.test(c); }); if (c3) st.cat = c3; } paint(list); return; }
      if (t.dataset.by) { st.by = t.dataset.by; st.all = false; st.sel = ''; paint(list); return; }
      if (t.dataset.clear) { st[t.dataset.clear] = ''; st.sel = ''; paint(list); return; }
      if (t.dataset.all) { st.all = !st.all; paint(list); return; }
      if (t.dataset.csv) { csv(ds); return; }
      if (t.dataset.vars) { varsDialog(t.dataset.vars); return; }
      if (t.dataset.unsel) { st.sel = ''; paint(list); return; }
      if (t.dataset.by2) { st.by = t.dataset.by2; st.sel = ''; st.all = false; if (st.by === 'dep') st.dep = ''; if (st.by === 'cat') st.cat = ''; if (st.by === 'sexo') st.sex = ''; if (st.by === 'anio' && ds.periods.length > 1) { } paint(list); var bx = h.querySelector('.lv13grid .lv13box'); if (bx) scrollTo({ top: bx.getBoundingClientRect().top + scrollY - 130, behavior: 'smooth' }); return; }
      if (t.classList.contains('lv13bar') && t.dataset.k != null) {
        st.sel = String(st.sel) === t.dataset.k ? '' : t.dataset.k; paint(list);
        var dt = h.querySelector('.lv14detail'); if (dt && innerWidth < 1181) scrollTo({ top: dt.getBoundingClientRect().top + scrollY - 130, behavior: 'smooth' });
        return;
      }
      if (t.dataset.drill != null) {
        var k = t.dataset.drill, by = st.by; st.sel = '';
        if (by === 'dep') st.dep = k; else if (by === 'cat') st.cat = k; else if (by === 'anio') st.year = k; else if (by === 'sexo') st.sex = k;
        st.by = next(by, ds); st.all = false; paint(list);
        var o = h.querySelector('.lv13box'); if (o && o.getBoundingClientRect().top < 80) scrollTo({ top: o.getBoundingClientRect().top + scrollY - 130, behavior: 'smooth' });
      }
    });
    h.addEventListener('change', function (e) { var s = e.target.closest('select[data-f]'); if (!s) return; st[s.dataset.f] = s.value; st.all = false; st.sel = ''; paint(); });
    // ayudas emergentes en la matriz
    var tip = D.createElement('div'); tip.className = 'lv13tip'; tip.setAttribute('role', 'tooltip'); D.body.appendChild(tip);
    function showTip(el) { tip.textContent = el.dataset.tip; var r = el.getBoundingClientRect(); tip.classList.add('on'); var w = tip.offsetWidth; tip.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + 'px'; tip.style.top = (r.top - tip.offsetHeight - 8 < 8 ? r.bottom + 8 : r.top - tip.offsetHeight - 8) + 'px'; }
    h.addEventListener('pointerover', function (e) { var d = e.target.closest('[data-tip]'); if (d) showTip(d); });
    h.addEventListener('pointerout', function (e) { if (e.target.closest('[data-tip]')) tip.classList.remove('on'); });
    h.addEventListener('focusin', function (e) { var d = e.target.closest('[data-tip]'); if (d) showTip(d); });
    h.addEventListener('focusout', function () { tip.classList.remove('on'); });
    addEventListener('scroll', function () { tip.classList.remove('on'); }, { passive: true });
  }

  function tick() { birds(); try { render(false); } catch (e) { if (W.console) console.warn('lv13', e); } }
  function init() {
    tick();
    var t; new MutationObserver(function (m) {
      if (m.every(function (x) { return host && (host.contains(x.target) || x.target === host); })) return;
      clearTimeout(t); t = setTimeout(tick, 90);
    }).observe(D.body, { childList: true, subtree: true });
    if (typeof W.setLanguage === 'function') { var sl = W.setLanguage; W.setLanguage = function () { var r = sl.apply(this, arguments); setTimeout(function () { renderKey = ''; D.querySelectorAll('.lv13bird,.lv14art').forEach(function (b) { b.remove(); }); tick(); }, 90); return r; }; }
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { setTimeout(init, 200); }); else setTimeout(init, 200);
  W.LV13 = { render: function () { renderKey = ''; render(true); }, vars: varsDialog, state: st };
})();
