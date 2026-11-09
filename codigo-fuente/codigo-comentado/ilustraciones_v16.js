/* ==========================================================================
   LIBRES v16 · Ilustraciones por sección
   - Inicio: ilustración en acuarela entregada por el equipo (mujeres y mundo).
   - Cada sección tiene una ilustración distinta, de la colección libre unDraw
     (licencia MIT), recoloreada con la paleta ¡LIBRES!. Las figuras no tienen
     rostro y varía el tono de piel entre secciones.
   - Fondo tipo acuarela (mancha blanca con borde orgánico y salpicaduras de color).
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window, I = W.LV16_ILL || {};
  function en() { try { if (typeof language === 'string') return language === 'en'; } catch (e) {} return (D.documentElement.lang || 'es').indexOf('en') === 0; }
  function T(es, e) { return en() ? e : es; }
  var ACC = { indicadores: ['#F8C20A', '#D33B78'], publicaciones: ['#2EDBBE', '#1A82B9'], normativa: ['#D33B78', '#F8C20A'], red: ['#2EDBBE', '#B243EA'], rutas: ['#D33B78', '#F0B3CA'], conocimiento: ['#F8C20A', '#1A82B9'], asistente: ['#2EDBBE', '#D33B78'], admin: ['#F8C20A', '#B243EA'], login: ['#D33B78', '#2EDBBE'], desagregada: ['#F8C20A', '#D33B78'] };
  function defs() {
    if (D.getElementById('lv16defs')) return;
    var s = D.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.id = 'lv16defs'; s.setAttribute('width', '0'); s.setAttribute('height', '0'); s.setAttribute('aria-hidden', 'true'); s.style.position = 'absolute';
    s.innerHTML = '<filter id="lv16wc" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G"/></filter>' +
      '<filter id="lv16wc2" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="18" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation="1.2"/></filter>';
    D.body.appendChild(s);
  }
  function leaves(c1, c2) {
    var L = [[6, 18, -30, c1], [88, 8, 40, c2], [94, 70, -60, c1], [2, 74, 20, c2], [50, 2, 80, '#2EDBBE']];
    return L.map(function (l, i) { return '<i class="lf" style="left:' + l[0] + '%;top:' + l[1] + '%;--r:' + l[2] + 'deg;--d:' + (i * .7) + 's;background:' + l[3] + '"></i>'; }).join('');
  }
  function card(kind) {
    if (W.LV17_SCENE && W.LV17_SCENE(kind)) return W.LV17_SCENE(kind);
    var a = ACC[kind] || ['#F8C20A', '#D33B78'];
    return '<div class="lv16card" style="--a1:' + a[0] + ';--a2:' + a[1] + '"><span class="blob"></span><span class="sp s1"></span><span class="sp s2"></span><span class="sp s3"></span>' + leaves(a[0], a[1]) + '<div class="ill">' + (I[kind] || '') + '</div></div>';
  }
  var prev = W.LV15ART;
  W.LV15ART = function (kind) {
    defs();
    if (kind === 'home' && W.LV16_HOME) return '<div class="lv16home"><span class="halo"></span><span class="sp s1"></span><span class="sp s2"></span><img src="' + W.LV16_HOME + '" alt="' + T('Ilustración en acuarela: mujeres diversas alrededor del mundo, rodeadas de flores', 'Watercolour illustration: diverse women around the world, surrounded by flowers') + '"></div>';
    if (I[kind]) return card(kind);
    return prev ? prev(kind) : '';
  };
  W.LV16 = { card: card };

  // Administración: ilustraciones propias
  function admin() {
    var ah = D.querySelector('.lv11adhero'); if (ah && !ah.querySelector('.lv16adm')) { defs(); var d = D.createElement('div'); d.className = 'lv16adm'; d.innerHTML = card('admin'); ah.appendChild(d); }
    var al = D.querySelector('.adminlogin aside'); if (al && !al.querySelector('.lv16adm')) { defs(); var e = D.createElement('div'); e.className = 'lv16adm login'; e.innerHTML = card('login'); al.appendChild(e); }
  }
  // Consulta desagregada: ilustración en su encabezado
  function des() { var h = D.querySelector('#lv13des .lv13head'); if (h && !h.querySelector('.lv16des')) { defs(); var d = D.createElement('div'); d.className = 'lv16des'; d.innerHTML = card('desagregada'); h.appendChild(d); } }
  // Inicio en escritorio: las cifras pasan a la columna izquierda para dar espacio a la ilustración
  function stats() {
    var h = D.getElementById('lvHero'); if (!h) return;
    var side = h.querySelector('.lvSide'), left = h.querySelector('.lvHeroGrid > div:first-child'); if (!side || !left) return;
    if (side.parentNode !== left) { side.classList.add('lv16stats'); left.appendChild(side); }
  }
  function tick() { try { admin(); des(); stats(); } catch (e) { if (W.console) console.warn('lv16', e); } }
  function init() { tick(); var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(tick, 120); }).observe(D.body, { childList: true, subtree: true }); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { setTimeout(init, 150); }); else setTimeout(init, 150);
})();
