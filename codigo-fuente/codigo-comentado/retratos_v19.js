/* ==========================================================================
   LIBRES v19 · Retratos en acuarela por micrositio
   Retratos individuales recortados de las láminas en acuarela del equipo:
   aparecen en la cinta de micrositios del inicio, en las tarjetas y la barra
   lateral de micrositios, en el encabezado de cada micrositio y en
   «Encuentra tu ruta» y preguntas frecuentes.
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window, P = W.LV19_POR || {};
  function idFrom(el) { var m = /openSite\('([\w-]+)'\)/.exec(el.getAttribute('onclick') || ''); return el.dataset.t || (m && m[1]) || ''; }
  function pimg(id, cls) { return P[id] ? '<img class="' + cls + '" src="' + P[id] + '" alt="" draggable="false">' : ''; }
  function curSite() { var b = D.querySelector('.lvLine.on'); if (b) return b.dataset.t; var a = D.querySelector('.lv11sidelist button.active'); if (a) return idFrom(a); var m = /#libres\/([\w-]+)/.exec(location.hash); return m ? m[1] : ''; }
  function tick() {
    try {
      // cinta del inicio
      D.querySelectorAll('.lvLine[data-t]').forEach(function (b) { var id = b.dataset.t; if (!P[id] || b.querySelector('.lv19p')) return; var em = b.querySelector('em'); if (em) { em.innerHTML = pimg(id, 'lv19p'); em.classList.add('lv19em'); } });
      // barra lateral y tarjetas de micrositios
      D.querySelectorAll('.lv11site').forEach(function (b) { var id = idFrom(b); if (!P[id] || b.querySelector('.lv19p')) return; var sp = b.querySelector('span, .lv11sico'); if (sp) { sp.innerHTML = pimg(id, 'lv19p'); sp.classList.add('lv19em'); } });
      // encabezado del micrositio
      D.querySelectorAll('.lv11sitehero').forEach(function (h) {
        var id = curSite(); if (!P[id]) return; var have = h.querySelector('.lv19hero');
        if (have && have.dataset.id === id) return; if (have) have.remove();
        var d = D.createElement('div'); d.className = 'lv19hero'; d.dataset.id = id; d.innerHTML = '<span class="halo"></span>' + pimg(id, 'lv19big'); h.appendChild(d);
        var ico = h.querySelector('.lv11sico.big'); if (ico) ico.classList.add('lv19hide');
      });
      // rutas y preguntas frecuentes
      [['.lv14rhead', 'ruta-guia'], ['.lv14fhead', 'faq']].forEach(function (x) { var h = D.querySelector(x[0]); if (h && P[x[1]] && !h.querySelector('.lv19side')) { var d = D.createElement('div'); d.className = 'lv19side'; d.innerHTML = pimg(x[1], 'lv19big'); h.appendChild(d); } });
    } catch (e) { if (W.console) console.warn('lv19', e); }
  }
  function init() { tick(); var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(tick, 100); }).observe(D.body, { childList: true, subtree: true }); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { setTimeout(init, 250); }); else setTimeout(init, 250);
})();
