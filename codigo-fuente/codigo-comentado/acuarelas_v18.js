/* ==========================================================================
   LIBRES v18 · Ilustraciones en acuarela en todas las secciones
   - Cada sección muestra una viñeta en acuarela distinta, del mismo estilo de
     la imagen principal (recortes de las ilustraciones entregadas por el equipo).
   - Administración › «Ilustraciones del portal»: el equipo puede subir una
     imagen propia para cada sección; se guarda en este navegador (clave
     OMD_ILUSTRACIONES) y la consulta pública la usa al recargar.
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window, DEF = W.LV18_WC || {}, KEY = 'OMD_ILUSTRACIONES';
  function en() { try { if (typeof language === 'string') return language === 'en'; } catch (e) {} return (D.documentElement.lang || 'es').indexOf('en') === 0; }
  function T(es, e) { return en() ? e : es; }
  var SLOTS = [['home', 'Inicio (imagen principal)'], ['indicadores', 'Indicadores'], ['mapa', 'Indicadores en el mapa'], ['publicaciones', 'Datos y análisis'], ['normativa', 'Normativa y derechos'], ['red', 'Observatorios'], ['rutas', 'Rutas de atención'], ['conocimiento', 'Conocimiento'], ['asistente', 'Consulta metodológica'], ['desagregada', 'Consulta desagregada'], ['admin', 'Administración'], ['login', 'Ingreso a administración']];
  function saved() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  var OWN = saved();
  if (OWN.home) W.LV16_HOME = OWN.home;
  if (OWN.red) W.LV17_GLOBE = OWN.red;
  W.LV18_IMG = function (kind) {
    var src = OWN[kind] || DEF[kind]; if (!src || kind === 'red' || kind === 'home') return null;
    return { src: src, alt: T('Ilustración en acuarela de mujeres diversas', 'Watercolour illustration of diverse women') };
  };

  /* ---------- Administración: cambiar ilustraciones ---------- */
  function compress(file, cb) {
    var r = new FileReader(); r.onload = function () { var im = new Image(); im.onload = function () { var m = 640, s = Math.min(1, m / Math.max(im.width, im.height)), c = D.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); var out = c.toDataURL('image/webp', .86); if (out.indexOf('data:image/webp') !== 0) out = c.toDataURL('image/png'); cb(out); }; im.src = r.result; }; r.readAsDataURL(file);
  }
  function current(k) { return OWN[k] || (k === 'home' ? W.LV16_HOME : k === 'red' ? W.LV17_GLOBE : DEF[k]) || ''; }
  function panel() {
    var hero = D.querySelector('.lv11adhero'); if (!hero || D.getElementById('lv18adm')) return;
    var s = D.createElement('section'); s.id = 'lv18adm'; s.className = 'lv18adm'; s.setAttribute('data-no-translate', '');
    s.innerHTML = '<div class="lv18h"><div><small>' + T('Identidad visual', 'Visual identity') + '</small><h2>' + T('Fotografías del portal', 'Portal photographs') + '</h2><p>' + T('Carga la fotografía real de cada sección (horizontal, mínimo 1600 px). Usa solo fotos propias o con licencia y con consentimiento informado de las personas que aparecen; nunca fotos de víctimas.', 'Change each section’s watercolour illustration. Use properly licensed images, ideally on white or transparent background.') + '</p></div></div><div class="lv18grid">' +
      SLOTS.map(function (x) { return '<div class="lv18slot" data-k="' + x[0] + '"><div class="pv"><img alt="" src="' + current(x[0]) + '"></div><b>' + x[1] + '</b><span class="st">' + (OWN[x[0]] ? T('Imagen propia', 'Custom image') : T('Imagen inicial', 'Default image')) + '</span><div class="ac"><label class="lv11btn">' + T('Cambiar', 'Change') + '<input type="file" accept="image/*" hidden></label>' + (OWN[x[0]] ? '<button type="button" class="lv11btn ghost" data-reset="1">' + T('Restablecer', 'Reset') + '</button>' : '') + '</div></div>'; }).join('') + '</div>';
    hero.parentNode.insertBefore(s, hero.nextSibling);
    s.addEventListener('change', function (e) {
      var inp = e.target; if (!inp.files || !inp.files[0]) return; var k = inp.closest('.lv18slot').dataset.k;
      compress(inp.files[0], function (data) { OWN[k] = data; try { localStorage.setItem(KEY, JSON.stringify(OWN)); } catch (x) { alert(T('No hay espacio suficiente en este navegador para guardar la imagen.', 'Not enough browser storage.')); delete OWN[k]; } s.remove(); panel(); });
    });
    s.addEventListener('click', function (e) { var b = e.target.closest('[data-reset]'); if (!b) return; var k = b.closest('.lv18slot').dataset.k; delete OWN[k]; try { localStorage.setItem(KEY, JSON.stringify(OWN)); } catch (x) {} s.remove(); panel(); });
  }
  function init() { panel(); var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(panel, 200); }).observe(D.body, { childList: true, subtree: true }); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { setTimeout(init, 400); }); else setTimeout(init, 400);
})();
