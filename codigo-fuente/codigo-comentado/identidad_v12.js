/* ==========================================================================
   LIBRES v12 · pie de página de cooperación e interacción adicional
   (barra de progreso, volver arriba, aparición al desplazarse, foco que sigue
   el puntero y flechas en la cinta de micrositios).
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window, L = W.LV12_LOGOS || {};
  function en() { try { if (typeof language === 'string') return language === 'en'; } catch (e) {} return (D.documentElement.lang || 'es').indexOf('en') === 0; }
  function T(es, e) { return en() ? e : es; }

  function footerHTML() {
    var logos = [['gobierno', 'Gobierno de Colombia', ''], ['ue', 'Unión Europea', ''], ['aecid', 'AECID Colombia · Cooperación Española', 'wide'], ['france', 'France · Expertise France, Groupe AFD', ''], ['alemana', 'Cooperación Alemana · implementado por GIZ', 'wide']];
    return '<div class="lv12band"></div><div class="lv12wrap"><div class="lv12top"><img src="' + (L.libres || '') + '" alt="¡LIBRES!"><div><span class="lv12eyebrow">' + T('Proyecto de cooperación', 'Cooperation project') + '</span>' +
      '<h2>' + T('Observatorio de Mujeres en todas sus diversidades', 'Observatory of Women in all their diversity') + '</h2>' +
      '<p>' + T('El Observatorio Colombiano de Mujeres en todas sus diversidades hace parte del proyecto ¡LIBRES! financiado por la Delegación de La Unión Europea en Colombia y la Agencia Española de Cooperación Internacional para el Desarrollo (AECID), la ejecución del Gobierno de Colombia y Expertise France y el apoyo técnico de la Cooperación Alemana para el Desarrollo GIZ.', 'The Colombian Observatory of Women in all their diversity is part of the ¡LIBRES! project, funded by the Delegation of the European Union in Colombia and the Spanish Agency for International Development Cooperation (AECID), implemented by the Government of Colombia and Expertise France, with technical support from German Development Cooperation GIZ.') + '</p><p>' + T('El Proyecto ¡LIBRES! tiene el objetivo de fortalecer la prevención de violencias basadas en género, protección y atención de las niñas, mujeres y personas LGBTIQ+, en siete municipios priorizados: Buenos Aires, Corinto, Puerto Tejada y Suárez en el departamento del Cauca; y Florida, Jamundí y Pradera en el departamento de Valle del Cauca.', 'The ¡LIBRES! Project aims to strengthen the prevention of gender-based violence and the protection and care of girls, women and LGBTIQ+ people in seven priority municipalities: Buenos Aires, Corinto, Puerto Tejada and Suárez in the department of Cauca; and Florida, Jamundí and Pradera in the department of Valle del Cauca.') + '</p>' +
      '</div></div>' +
      (L.franja ? '<div class="lv32franja"><img src="' + L.franja + '" alt="Gobierno de Colombia, Unión Europea, AECID Colombia, Cooperación Española, Expertise France, Cooperación Alemana (GIZ) y ¡LIBRES!" loading="lazy"></div>' : '') + '<div class="lv12logos"><small>' + T('Con el apoyo de', 'With the support of') + '</small><div class="lv12row">' + logos.map(function (x) { return L[x[0]] ? '<img class="' + x[2] + '" src="' + L[x[0]] + '" alt="' + x[1] + '" loading="lazy">' : ''; }).join('') + '</div></div>' +
      '<div class="lv12bottom"><span>' + T('Observatorio de Mujeres en todas sus diversidades · versión 12 · borrador analítico con insumos recibidos', 'Observatory of Women in all their diversity · version 12 · analytical draft') + '</span><a href="Detalle_tecnico_y_trazabilidad.html">' + T('Detalle técnico y trazabilidad →', 'Technical detail and provenance →') + '</a></div></div>';
  }
  function renderFooter() {
    var f = D.querySelector('body > footer') || D.querySelector('footer');
    if (!f) { f = D.createElement('footer'); D.body.appendChild(f); }
    f.className = 'lv12foot'; f.setAttribute('data-no-translate', ''); f.setAttribute('aria-label', T('Proyecto de cooperación', 'Cooperation project'));
    f.innerHTML = footerHTML();
  }

  /* barra de progreso y volver arriba */
  var bar, top;
  function scrollUI() {
    var h = D.documentElement, max = h.scrollHeight - innerHeight, p = max > 0 ? scrollY / max * 100 : 0;
    if (bar) bar.style.width = p + '%';
    if (top) top.classList.toggle('on', scrollY > 700);
  }
  /* aparición al desplazarse */
  var io = 'IntersectionObserver' in W ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('lv12in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -40px 0px', threshold: 0.06 }) : null;
  var SEL = '.lv11viz,.lv11site,.lv11an,.lv11norm,.lv11obs,.lv11right,.lv11line,.lv11steps li,.lv11more button,.lv11infocard,.v9panel,.lv11card,.line,.profile,.fig';
  var seen = new WeakSet();
  function reveal(root) {
    if (!io || (W.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    (root || D).querySelectorAll(SEL).forEach(function (el) {
      if (seen.has(el) || el.closest('dialog')) return; seen.add(el);
      var r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) return; // ya visible: no animar
      el.classList.add('lv12rv'); io.observe(el);
    });
    (root || D).querySelectorAll('.lv11viz,.lv11site,.lv11an,.v9card,.lv11more button,.lv11norm,.lv11kpi.tile,.line').forEach(function (el) { el.classList.add('lv12spot'); });
  }
  /* foco que sigue el puntero */
  D.addEventListener('pointermove', function (e) { var el = e.target.closest && e.target.closest('.lv12spot'); if (!el) return; var r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px'); }, { passive: true });
  /* flechas en la cinta de micrositios */
  function stripArrows() {
    var s = D.querySelector('.lvLines.scroll'); if (!s || s.parentNode.classList.contains('lv12strip')) return;
    var w = D.createElement('div'); w.className = 'lv12strip'; s.parentNode.insertBefore(w, s); w.appendChild(s);
    ['l', 'r'].forEach(function (k) { var b = D.createElement('button'); b.type = 'button'; b.className = 'lv12arrow ' + k; b.setAttribute('aria-label', k === 'l' ? T('Anterior', 'Previous') : T('Siguiente', 'Next')); b.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="' + (k === 'l' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6') + '"/></svg>'; b.onclick = function () { s.scrollBy({ left: (k === 'l' ? -1 : 1) * s.clientWidth * 0.8, behavior: 'smooth' }); }; w.appendChild(b); });
    function upd() { var l = w.querySelector('.l'), r = w.querySelector('.r'); l.hidden = s.scrollLeft < 8; r.hidden = s.scrollLeft + s.clientWidth > s.scrollWidth - 8; }
    s.addEventListener('scroll', upd, { passive: true }); setTimeout(upd, 50);
  }

  function init() {
    renderFooter();
    bar = D.createElement('div'); bar.id = 'lv12progress'; bar.setAttribute('aria-hidden', 'true'); D.body.appendChild(bar);
    top = D.createElement('button'); top.id = 'lv12top'; top.type = 'button'; top.setAttribute('aria-label', T('Volver arriba', 'Back to top')); top.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>'; top.onclick = function () { scrollTo({ top: 0, behavior: 'smooth' }); }; D.body.appendChild(top);
    addEventListener('scroll', scrollUI, { passive: true }); scrollUI();
    reveal(); stripArrows();
    var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(function () { reveal(); stripArrows(); }, 80); }).observe(D.querySelector('main') || D.body, { childList: true, subtree: true });
    if (typeof W.setLanguage === 'function') { var sl = W.setLanguage; W.setLanguage = function () { var r = sl.apply(this, arguments); setTimeout(function () { renderFooter(); }, 60); return r; }; }
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { setTimeout(init, 120); }); else setTimeout(init, 120);
  W.LV12 = { footer: renderFooter, reveal: reveal };
})();
