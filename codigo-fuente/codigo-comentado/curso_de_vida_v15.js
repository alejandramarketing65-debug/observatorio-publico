/* ==========================================================================
   LIBRES v15 · Mujeres en todo el curso de vida
   Ilustración original (sin fotos ni personajes existentes): niña, adolescente,
   joven, adulta con su bebé y mujer mayor, con diversidad étnico-racial, de
   identidad de género y de capacidades. Se usa en el inicio y, en versión
   compacta, en el encabezado de cada sección junto al colibrí blanco de fondo.
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window;
  function en() { try { if (typeof language === 'string') return language === 'en'; } catch (e) {} return (D.documentElement.lang || 'es').indexOf('en') === 0; }
  function T(es, e) { return en() ? e : es; }
  var INK = '#2a1a22';

  function face(o) {
    var f = '<g class="face"><path d="M-13,-121 q4.5,-4.5 9,0" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/><path d="M4,-121 q4.5,-4.5 9,0" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M-6,-107 q6,5.5 12,0" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/><circle cx="-15" cy="-111" r="4.5" fill="#ff7aa8" opacity=".35"/><circle cx="15" cy="-111" r="4.5" fill="#ff7aa8" opacity=".35"/></g>';
    if (o.glasses) f += '<g fill="none" stroke="' + INK + '" stroke-width="2"><circle cx="-9" cy="-121" r="7.5"/><circle cx="9" cy="-121" r="7.5"/><path d="M-1.5,-121 h3"/></g>';
    return f;
  }
  // Figura de busto: x, y (base), escala y opciones
  function fig(x, y, s, o) {
    var S = o.skin, H = o.hair, b = '', back = '', front = '';
    // cabello detrás
    if (o.st === 'long') back += '<path fill="' + H + '" d="M-32,-128 C-37,-172 37,-172 32,-128 L38,-60 C18,-50 -18,-50 -38,-60Z"/>';
    if (o.st === 'afro') back += '<circle cx="0" cy="-130" r="44" fill="' + H + '"/>';
    if (o.st === 'pigtails') back += '<circle cx="-36" cy="-140" r="15" fill="' + H + '"/><circle cx="36" cy="-140" r="15" fill="' + H + '"/>';
    if (o.st === 'braids') back += '<path fill="' + H + '" d="M-30,-126 C-32,-166 32,-166 30,-126Z"/>' + [-30, 30].map(function (bx) { return [-94, -76, -58].map(function (by, i) { return '<ellipse cx="' + (bx + (bx < 0 ? -i : i)) + '" cy="' + by + '" rx="' + (8 - i * .5) + '" ry="10" fill="' + H + '"/>'; }).join('') + '<circle cx="' + (bx + (bx < 0 ? -2 : 2)) + '" cy="-44" r="4" fill="#F8C20A"/>'; }).join('');
    if (o.st === 'bun') back += '<circle cx="0" cy="-166" r="16" fill="' + H + '"/>';
    if (o.st === 'pony') back += '<path fill="' + H + '" d="M22,-150 C52,-150 54,-104 40,-80 C46,-110 34,-130 20,-136Z"/>';
    // silla de ruedas detrás
    if (o.wheel) back += '<g class="wheel" transform="scale(-1,1)"><circle cx="-52" cy="-18" r="42" fill="none" stroke="#3C3C3B" stroke-width="7"/><circle cx="-52" cy="-18" r="5" fill="#3C3C3B"/><g stroke="#3C3C3B" stroke-width="2.4">' + [0, 45, 90, 135].map(function (a) { return '<line x1="-52" y1="-18" x2="' + (-52 + 38 * Math.cos(a * Math.PI / 180)) + '" y2="' + (-18 + 38 * Math.sin(a * Math.PI / 180)) + '"/><line x1="-52" y1="-18" x2="' + (-52 - 38 * Math.cos(a * Math.PI / 180)) + '" y2="' + (-18 - 38 * Math.sin(a * Math.PI / 180)) + '"/>'; }).join('') + '</g><path d="M58,-70 L70,-70 L70,-6" fill="none" stroke="#3C3C3B" stroke-width="6" stroke-linecap="round"/></g>';
    // cuerpo
    b += '<path fill="' + o.top + '" d="M-70,0 C-70,-52 -42,-80 0,-80 C42,-80 70,-52 70,0Z"/>';
    if (o.col) b += '<path fill="' + o.col + '" d="M-19,-79 L0,-55 L19,-79 C12,-80 -12,-80 -19,-79Z"/>';
    if (o.stripe) b += '<path fill="' + o.stripe + '" d="M-60,-30 C-30,-40 30,-40 60,-30 L64,-18 C30,-28 -30,-28 -64,-18Z" opacity=".9"/>';
    b += '<rect x="-12" y="-100" width="24" height="28" rx="9" fill="' + S + '"/><ellipse cx="0" cy="-122" rx="27" ry="31" fill="' + S + '"/>';
    // cabello delante
    if (o.st === 'long') front += '<path fill="' + H + '" d="M-29,-124 C-31,-160 31,-160 29,-124 C16,-142 -6,-147 -29,-124Z"/>';
    if (o.st === 'afro') front += '<path fill="' + H + '" d="M-27,-130 C-22,-152 22,-152 27,-130 C16,-140 -16,-140 -27,-130Z"/>';
    if (o.st === 'pigtails' || o.st === 'pony') front += '<path fill="' + H + '" d="M-29,-124 C-29,-160 29,-160 29,-124 C14,-140 -10,-146 -29,-124Z"/>';
    if (o.st === 'braids') front += '<path fill="' + H + '" d="M-28,-124 C-28,-158 28,-158 28,-124 C10,-142 -10,-142 -28,-124Z"/>';
    if (o.st === 'short') front += '<path fill="' + H + '" d="M-31,-116 C-37,-164 35,-170 31,-120 C22,-146 -4,-150 -31,-116Z"/>';
    if (o.st === 'bun') front += '<path fill="' + H + '" d="M-29,-122 C-30,-160 30,-160 29,-122 C16,-142 -16,-142 -29,-122Z"/>';
    if (o.wrap) front += '<path fill="' + o.wrap + '" d="M-31,-128 C-34,-176 34,-176 31,-128 C14,-144 -14,-144 -31,-128Z"/><path fill="' + o.wrap + '" d="M-6,-166 C-22,-190 6,-196 4,-170 C14,-192 30,-176 8,-162Z"/>' + [[-14, -150], [0, -156], [14, -150], [-6, -140], [8, -140]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.6" fill="#fff" opacity=".8"/>'; }).join('');
    if (o.band) front += '<path fill="' + o.band + '" d="M-29,-136 C-12,-150 12,-150 29,-136 L28,-129 C10,-141 -10,-141 -28,-129Z"/>';
    if (o.ear) front += '<circle cx="-27" cy="-108" r="4.5" fill="' + o.ear + '"/><circle cx="27" cy="-108" r="4.5" fill="' + o.ear + '"/>';
    if (o.beads) front += '<g>' + Array.apply(null, Array(13)).map(function (_, i) { var a = Math.PI * (0.15 + i * 0.0545), c = ['#D33B78', '#F8C20A', '#2EDBBE', '#1A82B9', '#B243EA'][i % 5]; return '<circle cx="' + (Math.cos(a) * 30).toFixed(1) + '" cy="' + (-80 + Math.sin(a) * 18).toFixed(1) + '" r="4" fill="' + c + '"/>'; }).join('') + '</g>';
    if (o.mochila) front += '<path d="M-40,-70 L36,-6" stroke="' + o.mochila + '" stroke-width="10" stroke-linecap="round"/><path d="M-40,-70 L36,-6" stroke="#fff" stroke-width="2" stroke-dasharray="4 5" opacity=".8"/>';
    if (o.pin) front += '<g transform="translate(30,-44)"><rect x="-9" y="-9" width="18" height="18" rx="5" fill="#fff"/><rect x="-6" y="-6" width="12" height="3" fill="#5BCEFA"/><rect x="-6" y="-3" width="12" height="2.5" fill="#F5A9B8"/><rect x="-6" y="-.5" width="12" height="2" fill="#fff"/><rect x="-6" y="1.5" width="12" height="2.5" fill="#F5A9B8"/><rect x="-6" y="4" width="12" height="2.5" fill="#5BCEFA"/></g>';
    if (o.baby) front += '<g class="baby"><ellipse cx="14" cy="-36" rx="30" ry="20" fill="#F0B3CA"/><path d="M-14,-40 q10,8 30,4" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/><circle cx="30" cy="-50" r="12" fill="' + o.baby + '"/><path d="M24,-60 q6,-6 12,0" fill="none" stroke="#3B2416" stroke-width="2.4" stroke-linecap="round"/><path d="M26,-50 q2,-2 4,0 M32,-50 q2,-2 4,0" fill="none" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="round"/><path d="M-44,-30 C-30,-14 10,-12 40,-30" fill="none" stroke="' + S + '" stroke-width="12" stroke-linecap="round"/></g>';
    return '<g class="wm" style="--d:' + (o.d || 0) + '" transform="translate(' + x + ',' + y + ') scale(' + s + ')"><g class="wmi">' + back + b + front + face(o) + '</g></g>';
  }
  var P = {
    nina: function (x, y, s, d) { return fig(x, y, s, { st: 'pigtails', skin: '#6B4430', hair: '#1E120D', top: '#F8C20A', col: '#E0A800', ear: '#D33B78', d: d }); },
    adole: function (x, y, s, d) { return fig(x, y, s, { st: 'long', skin: '#B57A52', hair: '#1E120D', top: '#2EDBBE', col: '#17A58C', beads: 1, mochila: '#D33B78', d: d }); },
    joven: function (x, y, s, d) { return fig(x, y, s, { st: 'short', skin: '#E8B896', hair: '#5A3420', top: '#1A82B9', col: '#F0B3CA', ear: '#F8C20A', wheel: 1, d: d }); },
    trans: function (x, y, s, d) { return fig(x, y, s, { st: 'braids', skin: '#C68E5C', hair: '#2B1810', top: '#B243EA', col: '#D089EC', band: '#F8C20A', pin: 1, ear: '#2EDBBE', d: d }); },
    madre: function (x, y, s, d) { return fig(x, y, s, { st: 'afro', skin: '#5A3A2A', hair: '#1E120D', top: '#D33B78', col: '#9E2C5A', wrap: '#F8C20A', ear: '#2EDBBE', baby: '#6B4430', d: d }); },
    mayor: function (x, y, s, d) { return fig(x, y, s, { st: 'bun', skin: '#D9A07A', hair: '#ECE7F0', top: '#8E36CF', col: '#D089EC', glasses: 1, ear: '#F8C20A', d: d }); },
    rural: function (x, y, s, d) { return fig(x, y, s, { st: 'pony', skin: '#A86F4A', hair: '#2B1810', top: '#22A37A', col: '#F8C20A', stripe: '#F8C20A', ear: '#D33B78', d: d }); }
  };
  function deco(kind) {
    var d = '<g class="wdeco"><circle cx="40" cy="70" r="6" fill="#F8C20A"/><circle cx="520" cy="56" r="5" fill="#2EDBBE"/><path fill="#F0B3CA" d="M286,22 c-6,-8 -18,-2 -12,8 l12,12 l12,-12 c6,-10 -6,-16 -12,-8z"/><path fill="#fff" d="M500,120 l6,-14 l6,14 l14,6 l-14,6 l-6,14 l-6,-14 l-14,-6z"/><path fill="#fff" opacity=".8" d="M70,140 l4,-9 l4,9 l9,4 l-9,4 l-4,9 l-4,-9 l-9,-4z"/></g>';
    var k = { indicadores: '<g class="wdeco" fill="#fff" opacity=".9"><rect x="430" y="40" width="12" height="40" rx="3"/><rect x="448" y="26" width="12" height="54" rx="3"/><rect x="466" y="50" width="12" height="30" rx="3"/></g>',
      normativa: '<g class="wdeco" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M460,30 v56 M436,40 h48 M436,40 l-12,26 h24z M484,40 l-12,26 h24z"/></g>',
      red: '<g class="wdeco" stroke="#fff" stroke-width="3" opacity=".9"><line x1="430" y1="40" x2="480" y2="70"/><line x1="480" y1="70" x2="520" y2="34"/><circle cx="430" cy="40" r="7" fill="#fff"/><circle cx="480" cy="70" r="7" fill="#fff"/><circle cx="520" cy="34" r="7" fill="#fff"/></g>',
      rutas: '<g class="wdeco"><path fill="#fff" d="M470,36 c-8,-11 -26,-3 -17,11 l17,17 l17,-17 c9,-14 -9,-22 -17,-11z"/></g>',
      publicaciones: '<g class="wdeco" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"><circle cx="462" cy="52" r="18"/><path d="M475,65 l16,16"/></g>',
      conocimiento: '<g class="wdeco" fill="#fff"><path d="M430,40 q30,-10 40,6 v40 q-10,-16 -40,-6z" opacity=".9"/><path d="M510,40 q-30,-10 -40,6 v40 q10,-16 40,-6z" opacity=".7"/></g>',
      asistente: '<g class="wdeco"><rect x="430" y="24" width="70" height="46" rx="12" fill="#fff"/><path d="M450,70 l-6,14 l18,-14z" fill="#fff"/><text x="465" y="58" text-anchor="middle" font-size="30" font-weight="900" fill="#8E36CF" font-family="Nunito Sans,sans-serif">?</text></g>' }[kind] || '';
    return d + k;
  }
  // Composición: inicio con todo el curso de vida; secciones con grupos distintos
  var SETS = {
    home: [['rural', 214, 262, .72], ['trans', 352, 262, .72], ['nina', 62, 320, .6], ['adole', 150, 320, .8], ['madre', 282, 320, .98], ['mayor', 400, 320, .84], ['joven', 478, 320, .8]],
    indicadores: [['adole', 120, 300, .8], ['madre', 260, 300, .9], ['mayor', 390, 300, .82]],
    publicaciones: [['joven', 120, 300, .82], ['trans', 250, 300, .86], ['nina', 360, 300, .62]],
    normativa: [['mayor', 120, 300, .82], ['madre', 250, 300, .9], ['adole', 375, 300, .8]],
    red: [['rural', 120, 300, .82], ['trans', 250, 300, .86], ['madre', 380, 300, .86]],
    rutas: [['madre', 130, 300, .9], ['nina', 245, 300, .64], ['joven', 360, 300, .84]],
    conocimiento: [['adole', 120, 300, .8], ['mayor', 250, 300, .86], ['rural', 375, 300, .8]],
    asistente: [['nina', 110, 300, .64], ['trans', 230, 300, .86], ['mayor', 360, 300, .84]]
  };
  function art(kind) {
    var set = SETS[kind] || SETS.home, home = kind === 'home';
    var figs = set.map(function (f, i) { return P[f[0]](f[1], f[2], f[3], i * .35); });
    // en el inicio la fila de atrás va primero
        var vb = home ? '0 60 560 260' : '0 0 560 300';
    return '<svg class="lv14women' + (home ? '' : ' sm') + '" viewBox="' + vb + '" role="img" aria-label="' + T('Ilustración: niñas, adolescentes, jóvenes, adultas y mujeres mayores en todas sus diversidades', 'Illustration: girls, adolescents, young, adult and older women in all their diversity') + '">' + deco(home ? '' : kind) + figs.join('') + '</svg>';
  }
  W.LV15ART = art;
  W.LV15LIFE = function () {
    return '<div class="lv15life">' + [[T('Niñas', 'Girls'), '#F8C20A'], [T('Adolescentes', 'Adolescents'), '#2EDBBE'], [T('Jóvenes', 'Young women'), '#1A82B9'], [T('Adultas', 'Adults'), '#D33B78'], [T('Mayores', 'Older women'), '#B243EA']].map(function (x, i) { return '<span style="--c:' + x[1] + '">' + x[0] + '</span>' + (i < 4 ? '<i>›</i>' : ''); }).join('') + '</div>';
  };

  /* ---------------- Encabezados de sección ---------------- */
  var BIRD = function () { var leaves = [[52, 40, -30, 1], [28, 92, 20, .9], [62, 150, -50, .8], [20, 132, 10, .75], [100, 16, 60, .7], [44, 190, -20, .8]]; return '<svg class="lv14wbird" viewBox="0 0 300 260" aria-hidden="true"><g class="bob" fill="#fff">' + leaves.map(function (l) { return '<g transform="translate(' + l[0] + ',' + l[1] + ') rotate(' + l[2] + ') scale(' + l[3] + ')"><path class="leaf" d="M0,-11 C7,-5 7,5 0,11 C-7,5 -7,-5 0,-11Z"/></g>'; }).join('') + '<path class="w3" opacity=".55" d="M170,112 C142,108 110,116 80,134 C114,142 146,132 170,112Z"/><path class="w2" opacity=".75" d="M170,108 C140,84 104,74 62,80 C90,106 128,118 170,108Z"/><g class="tail"><path d="M162,192 C166,214 180,230 204,238 C180,244 154,236 144,214 C140,204 144,196 152,200Z"/></g><path d="M182,72 C202,70 216,84 211,102 C204,130 186,162 164,196 L150,206 C132,190 130,160 141,132 C150,108 162,82 182,72Z"/><path class="w1" opacity=".92" d="M174,102 C158,64 128,38 82,28 C94,62 122,94 174,102Z"/><g class="head"><path d="M212,72 L284,58 L214,81Z"/><circle cx="196" cy="80" r="21"/></g></g></svg>'; };
  var PAGES = ['indicadores', 'mapa', 'publicaciones', 'normativa', 'red', 'rutas', 'conocimiento', 'asistente'];
  function band(sec) {
    var id = sec.id, box = sec.querySelector(':scope > .lv11content') || sec;
    var head = box.querySelector(':scope > .lv11head, :scope > .lv11rhero');
    if (!head) {
      // páginas heredadas: agrupar eyebrow + h1 + primer párrafo
      if (sec.querySelector(':scope > .lv15band')) return;
      var eb = sec.querySelector(':scope > .eyebrow'), h1 = sec.querySelector(':scope > h1'); if (!eb || !h1) return;
      head = D.createElement('div'); head.className = 'lv15legacyhead';
      sec.insertBefore(head, eb); head.appendChild(eb); head.appendChild(h1);
      var p = head.nextElementSibling; if (p && p.tagName === 'P') head.appendChild(p);
    }
    if (head.classList.contains('lv15band') && head.querySelector('.lv15art')) return;
    head.classList.add('lv15band');
    var a = D.createElement('div'); a.className = 'lv15art'; a.setAttribute('aria-hidden', 'false');
    a.innerHTML = BIRD() + '<div class="lv15fig">' + W.LV15ART(id) + '</div>';
    head.appendChild(a);
  }
  function tick() { PAGES.forEach(function (id) { var s = D.getElementById(id); if (s) try { band(s); } catch (e) { if (W.console) console.warn('lv15', e); } }); }
  function init() {
    tick();
    var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(tick, 150); }).observe(D.querySelector('main') || D.body, { childList: true, subtree: true });
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { setTimeout(init, 300); }); else setTimeout(init, 300);
})();
