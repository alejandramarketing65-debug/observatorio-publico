/* ==========================================================================
   LIBRES v17 · Ilustraciones interactivas por sección
   - Inicio: solo la acuarela de mujeres y el mundo (sin colibrí), con
     inclinación 3D al mover el puntero y gotas de color al tocarla.
   - Observatorios: acuarela de mujeres alrededor del planeta.
   - Demás secciones: escenas propias armadas con figuras Humaaans (Pablo
     Stanley, CC0, sin rasgos faciales) en la paleta ¡LIBRES!, con objetos
     pintados y acabado de acuarela. Cada sección es distinta.
   Interacción: las figuras se mueven con el puntero a distinta profundidad,
   muestran qué representan al pasar o enfocar, y al tocarlas sueltan gotas
   de acuarela y llevan al contenido de la sección.
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window, S = W.LV17_SCENES || {};
  function en() { try { if (typeof language === 'string') return language === 'en'; } catch (e) {} return (D.documentElement.lang || 'es').indexOf('en') === 0; }
  function T(es, e) { return en() ? e : es; }
  var reduced = W.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COL = ['#D33B78', '#B243EA', '#F8C20A', '#2EDBBE', '#1A82B9', '#F0B3CA', '#EF6B4A'];

  function defs() {
    if (D.getElementById('lv17defs')) return;
    var s = D.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.id = 'lv17defs'; s.setAttribute('width', '0'); s.setAttribute('height', '0'); s.setAttribute('aria-hidden', 'true'); s.style.position = 'absolute';
    s.innerHTML = '<filter id="lv17wc" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="9" result="g"/><feColorMatrix in="g" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -0.9 0.95" result="gm"/><feComposite in="d" in2="gm" operator="in" result="t"/><feMerge><feMergeNode in="d"/><feMergeNode in="t"/></feMerge></filter>' +
      '<filter id="lv17blot" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="60" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation="3"/></filter>';
    D.body.appendChild(s);
  }
  function scene(kind) {
    defs();
    var wc = W.LV18_IMG && W.LV18_IMG(kind);
    if (wc) return '<div class="lv17card photo wc" data-k="' + kind + '"><span class="blob"></span><div class="tilt"><img src="' + wc.src + '" alt="' + wc.alt + '" draggable="false"></div></div>';
    if (kind === 'red' && W.LV17_GLOBE) return '<div class="lv17card photo" data-k="red"><span class="blob"></span><div class="tilt"><img src="' + W.LV17_GLOBE + '" alt="' + T('Ilustración en acuarela: mujeres diversas tomadas de la mano alrededor del planeta', 'Watercolour illustration: diverse women holding hands around the planet') + '" draggable="false"></div></div>';
    if (!S[kind]) return '';
    return '<div class="lv17card" data-k="' + kind + '"><span class="blob"></span><span class="sp s1"></span><span class="sp s2"></span>' + S[kind] + '<span class="lv17tip" role="status" aria-live="polite"></span></div>';
  }
  W.LV17_SCENE = scene;

  var prevArt = W.LV15ART;
  W.LV15ART = function (kind) {
    defs();
    if (kind === 'home' && W.LV16_HOME) return '<div class="lv17home"><span class="halo"></span><div class="tilt"><img src="' + W.LV16_HOME + '" alt="' + T('Ilustración en acuarela: mujeres diversas alrededor del mundo, rodeadas de flores', 'Watercolour illustration: diverse women around the world, surrounded by flowers') + '" draggable="false"></div></div>';
    var s = scene(kind); if (s) return s;
    return prevArt ? prevArt(kind) : '';
  };

  function drops(host, x, y) {
    if (reduced) return;
    for (var i = 0; i < 12; i++) {
      var s = D.createElement('i'); s.className = 'lv17drop'; s.style.background = COL[i % COL.length];
      var a = Math.random() * Math.PI * 2, r = 50 + Math.random() * 110, sz = 10 + Math.random() * 18;
      s.style.width = s.style.height = sz + 'px'; s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.setProperty('--dx', (Math.cos(a) * r).toFixed(0) + 'px'); s.style.setProperty('--dy', (Math.sin(a) * r - 20).toFixed(0) + 'px');
      host.appendChild(s); setTimeout(function (el) { return function () { el.remove(); }; }(s), 1400);
    }
  }
  function wire(host) {
    if (!host || host.dataset.lv17) return; host.dataset.lv17 = '1';
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    // accesibilidad: figuras enfocables con nombre
    host.querySelectorAll('.hf').forEach(function (g) { g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', T(g.dataset.label, g.dataset.label)); });
    host.addEventListener('pointermove', function (e) {
      if (reduced) return;
      var r = host.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      host.querySelectorAll('.hf').forEach(function (g) { var z = parseFloat(g.style.getPropertyValue('--z')) || 1; g.style.setProperty('--px', (x * 22 * z).toFixed(1) + 'px'); g.style.setProperty('--py', (y * 14 * z).toFixed(1) + 'px'); });
      host.querySelectorAll('.tilt').forEach(function (t) { var hr = t.getBoundingClientRect(), tx = (e.clientX - hr.left) / hr.width - .5, ty = (e.clientY - hr.top) / hr.height - .5; t.style.transform = (Math.abs(tx) < .8 && Math.abs(ty) < .8) ? 'perspective(900px) rotateY(' + (tx * 12).toFixed(1) + 'deg) rotateX(' + (-ty * 10).toFixed(1) + 'deg) scale(1.03)' : ''; });
    }, { passive: true });
    host.addEventListener('pointerleave', function () { host.querySelectorAll('.hf').forEach(function (g) { g.style.setProperty('--px', '0px'); g.style.setProperty('--py', '0px'); }); host.querySelectorAll('.tilt').forEach(function (t) { t.style.transform = ''; }); hideTip(host); });
    function showTip(g) { var tip = host.querySelector('.lv17tip'); if (!tip) return; var card = tip.parentNode.getBoundingClientRect(), b = g.getBoundingClientRect(); tip.textContent = g.dataset.label; tip.style.left = Math.max(8, Math.min(card.width - 8, b.left - card.left + b.width / 2)) + 'px'; tip.style.top = Math.max(0, b.top - card.top - 6) + 'px'; tip.classList.add('on'); }
    host.addEventListener('pointerover', function (e) { var g = e.target.closest && e.target.closest('.hf'); if (g) showTip(g); });
    host.addEventListener('focusin', function (e) { var g = e.target.closest && e.target.closest('.hf'); if (g) showTip(g); });
    host.addEventListener('pointerout', function (e) { if (e.target.closest && e.target.closest('.hf') && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.hf'))) hideTip(host); });
    function act(el) {
      var hr = host.getBoundingClientRect(), br = el.getBoundingClientRect();
      drops(host, br.left - hr.left + br.width / 2, br.top - hr.top + br.height / 3);
      el.classList.remove('pop'); void el.getBoundingClientRect(); el.classList.add('pop');
      var band = host.closest('.lv15band') || (host.classList.contains('lv15band') ? host : null), next = band ? band.nextElementSibling : null;
      if (host.id === 'lvHero') next = D.getElementById('lv13des');
      if (next) setTimeout(function () { scrollTo({ top: next.getBoundingClientRect().top + scrollY - 130, behavior: 'smooth' }); }, reduced ? 0 : 500);
    }
    host.addEventListener('click', function (e) { var el = e.target.closest && e.target.closest('.hf, .tilt'); if (el && host.contains(el)) act(el); });
    host.addEventListener('keydown', function (e) { var el = e.target.closest && e.target.closest('.hf'); if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(el); } });
  }
  function hideTip(host) { var t = host.querySelector('.lv17tip'); if (t) t.classList.remove('on'); }
  function swap(sel, kind) { D.querySelectorAll(sel).forEach(function (el) { if (el.dataset.lv17k === kind) return; el.dataset.lv17k = kind; el.innerHTML = scene(kind); }); }
  function tick() {
    try {
      swap('.lv16adm:not(.login)', 'admin'); swap('.lv16adm.login', 'login'); swap('.lv16des', 'desagregada');
      D.querySelectorAll('.lv15band, #lvHero, body > header.hero, .lv11adhero, .adminlogin aside, #lv13des .lv13head').forEach(function (h) { if (h.querySelector('.lv17card, .lv17home')) wire(h); });
    } catch (e) { if (W.console) console.warn('lv17', e); }
  }
  function init() { tick(); var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(tick, 120); }).observe(D.body, { childList: true, subtree: true }); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { setTimeout(init, 180); }); else setTimeout(init, 180);
})();
