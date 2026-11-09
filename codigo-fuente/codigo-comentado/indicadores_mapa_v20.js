/* ==========================================================================
   LIBRES v20 · Indicadores en el mapa
   Pestaña de la consulta pública: tarjetas de indicadores, mapa de Colombia
   coloreado según la tarjeta elegida, respuesta en una frase y panel lateral
   con los datos procesados por departamento. Usa los agregados ya cargados
   (V8_DATA, GEO, catálogo) y se dibuja en un Shadow DOM para no chocar con
   los estilos heredados. Administración › «Indicadores en el mapa» decide qué
   indicadores se muestran y cuál abre primero (clave OMD_MAPA).
   ========================================================================== */
(function () {
  'use strict';
  var Dc = document, W = window, KEY = 'OMD_MAPA';
  var CSS = "\n:host{--mag:#D33B78;--vino:#9E2C5A;--rosa:#F0B3CA;--ama:#F8C20A;--gris:#3C3C3B;--mor:#B243EA;--morm:#8E36CF;--mord:#6E24A8;--azul:#1A82B9;--tur:#2EDBBE;\n  --ink:#3c3c3b;--ink2:#575756;--muted:#6f6f6e;--bg:#f8f5fb;--line:#ebe2f1;--line2:#dccbe9;--lila:#F4E8FC;\n  --spectrum:linear-gradient(90deg,#d33b78 0%,#b243ea 22%,#1a82b9 44%,#2edbbe 64%,#f8c20a 82%,#f0b3ca 100%);--leaf:4px 18px 4px 18px}\n*{box-sizing:border-box}\n.mroot{display:block;max-width:100%;overflow-x:clip;font-family:'Nunito Sans',system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;background:var(--bg);color:var(--ink)}\nbutton{font:inherit}\n\n\n\n\n\n\n\n\n\n\n\n\n.hero{position:relative;overflow:hidden;color:#fff;border-radius:12px 40px 12px 40px;padding:28px 32px;background:radial-gradient(700px 300px at 92% -10%,#d089ec55,transparent 60%),linear-gradient(125deg,#d33b78 0%,#b13a98 40%,#8e36cf 74%,#6e24a8 100%)}\n.hero:before{content:'';position:absolute;left:0;right:0;top:0;height:5px;background:var(--spectrum)}\n.hero .eb{display:inline-block;font:900 11px 'Nunito Sans',system-ui,sans-serif;letter-spacing:1.8px;text-transform:uppercase;background:#ffffff26;padding:5px 11px;border-radius:3px 12px 3px 12px}\n.hero h1{font:900 clamp(26px,3vw,40px)/1.1 'Nunito Sans',system-ui,sans-serif;margin:12px 0 8px;letter-spacing:-.02em}\n.hero p{margin:0;max-width:820px;color:#fbeaf6;font-size:15px;line-height:1.55}\n.hero .steps{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}\n.hero .steps span{background:#ffffff1c;border:1px solid #ffffff38;border-radius:3px 14px 3px 14px;padding:8px 12px;font-size:13px;font-weight:700}\n.hero .steps b{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#fff;color:var(--mord);margin-right:6px;font-size:12px}\n\n/* tarjetas */\n.bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:20px 0 10px}\n.bar h2{font:900 20px 'Nunito Sans',system-ui,sans-serif;margin:0 12px 0 0}\n.search{display:flex;align-items:center;gap:6px;background:#fff;border:1.5px solid var(--line2);border-radius:999px;padding:4px 12px;flex:0 1 300px}\n.search input{border:0;outline:none;font:600 13.5px 'Nunito Sans',system-ui,sans-serif;padding:6px 0;width:100%;background:none}\n.chips{display:flex;gap:6px;flex-wrap:wrap}\n.chip{border:1.5px solid var(--line2);background:#fff;color:var(--ink2);border-radius:999px;padding:6px 12px;font:800 12.5px 'Nunito Sans',system-ui,sans-serif;cursor:pointer;display:inline-flex;align-items:center;gap:6px}\n.chip i{width:9px;height:9px;border-radius:50%;background:var(--c,#8e36cf)}\n.chip.on{background:var(--c,#8e36cf);border-color:transparent;color:#fff}\n.chip.on i{background:#fff}\n.tog{margin-left:auto;display:flex;align-items:center;gap:8px;font:800 12.5px 'Nunito Sans',system-ui,sans-serif;color:var(--ink2);cursor:pointer}\n.tog input{accent-color:var(--morm);width:16px;height:16px}\n.cards{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(230px,250px);gap:12px;overflow-x:auto;padding:4px 2px 14px;scroll-snap-type:x mandatory;scrollbar-width:thin}\n.card{scroll-snap-align:start;text-align:left;cursor:pointer;background:#fff;border:1.5px solid var(--line);border-radius:8px 26px 8px 26px;padding:14px 14px 12px;display:flex;flex-direction:column;gap:6px;position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s,border-color .2s;min-height:178px}\n.card:before{content:'';position:absolute;left:0;right:0;top:0;height:4px;background:var(--c)}\n.card:hover{transform:translateY(-3px);box-shadow:0 18px 32px -22px var(--c)}\n.card.on{border-color:var(--c);box-shadow:0 20px 36px -22px var(--c);background:linear-gradient(180deg,#fff,color-mix(in srgb,var(--c) 7%,#fff))}\n.card .row{display:flex;justify-content:space-between;align-items:center;gap:6px}\n.card small{white-space:nowrap;font:900 10.5px 'Nunito Sans',system-ui,sans-serif;letter-spacing:1px;color:var(--muted)}\n.card .bd{white-space:nowrap;flex:0 0 auto;font:900 9.5px 'Nunito Sans',system-ui,sans-serif;letter-spacing:.6px;text-transform:uppercase;border-radius:2px 8px 2px 8px;padding:3px 7px}\n.bd.mp{background:var(--c);color:#fff}\n.bd.no{background:#f1eef3;color:#8a8a89}\n.card b{font:900 14.5px/1.25 'Nunito Sans',system-ui,sans-serif;color:var(--ink)}\n.card .th{font-size:11.5px;color:var(--ink2);display:flex;align-items:center;gap:5px}\n.card .th i{width:8px;height:8px;border-radius:50%;background:var(--c)}\n.card .val{margin-top:auto;font:900 24px/1 'Nunito Sans',system-ui,sans-serif;color:color-mix(in srgb,var(--c) 75%,#000)}\n.card .val span{display:block;font:700 11px 'Nunito Sans',system-ui,sans-serif;color:var(--muted);margin-top:4px}\n.card .mini{display:flex;align-items:flex-end;gap:2px;height:24px;margin-top:auto}\n.card .mini i{flex:1;background:color-mix(in srgb,var(--c) 55%,#fff);border-radius:2px 2px 0 0}\n.card.nod .val{color:#a7a7a6;font-size:13px;font-weight:800}\n.empty{padding:20px;color:var(--muted)}\n\n/* área principal */\n.stage{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(320px,.75fr);gap:16px;align-items:start}\n.panel{background:#fff;border:1px solid var(--line);border-radius:8px 30px 8px 30px;padding:18px 20px}\n.mh{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:flex-start}\n.mh small{font:900 10.5px 'Nunito Sans',system-ui,sans-serif;letter-spacing:1.3px;text-transform:uppercase;color:var(--c,#8e36cf)}\n.mh h3{font:900 21px/1.2 'Nunito Sans',system-ui,sans-serif;margin:4px 0 2px}\n.mh p{margin:0;font-size:13px;color:var(--muted)}\n.ctl{display:flex;gap:8px;flex-wrap:wrap;align-items:center}\n.ctl label{display:flex;flex-direction:column;gap:3px;font:800 10px 'Nunito Sans',system-ui,sans-serif;letter-spacing:.8px;text-transform:uppercase;color:var(--muted)}\n.ctl select{font:700 13px 'Nunito Sans',system-ui,sans-serif;border:1.5px solid var(--line2);border-radius:3px 12px 3px 12px;padding:7px 10px;background:#fff;color:var(--ink)}\n.years{display:flex;gap:4px;flex-wrap:wrap}\n.years button{border:1.5px solid var(--line2);background:#fff;border-radius:999px;padding:5px 10px;font:800 12px 'Nunito Sans',system-ui,sans-serif;cursor:pointer;color:var(--ink2)}\n.years button.on{background:var(--c);color:#fff;border-color:transparent}\n.mapbox{position:relative;margin-top:10px;display:grid;grid-template-columns:minmax(0,1fr) 150px;gap:12px;align-items:end}\n.map{width:100%;height:auto;max-height:600px;display:block;margin:0 auto}\n.map path{stroke:#fff;stroke-width:.7;cursor:pointer;transition:fill .5s,opacity .2s;outline:none}\n.map path:hover,.map path:focus-visible{stroke:#2a1240;stroke-width:1.6}\n.map path.sel{stroke:#2a1240;stroke-width:2.4}\n.map.dim path:not(.sel){opacity:.55}\n.map .nod{fill:url(#hatch)}\n.leg{display:flex;flex-direction:column;gap:5px;font-size:12px;color:var(--ink2)}\n.leg b{font:900 11px 'Nunito Sans',system-ui,sans-serif;letter-spacing:.8px;text-transform:uppercase;color:var(--muted);margin-bottom:2px}\n.leg span{display:flex;align-items:center;gap:7px;cursor:default}\n.leg i{width:22px;height:14px;border-radius:2px 7px 2px 7px;flex:0 0 22px}\n.leg .h{background:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Crect width='6' height='6' fill='%23f1eef3'/%3E%3Cpath d='M0 6L6 0' stroke='%23c9c2cf' stroke-width='1.2'/%3E%3C/svg%3E\")}\n.tip{position:fixed;z-index:60;pointer-events:none;background:#2a1240;color:#fff;border-radius:3px 12px 3px 12px;padding:8px 12px;font-size:12.5px;line-height:1.4;box-shadow:0 14px 30px -12px #000a;opacity:0;transition:opacity .12s;max-width:260px}\n.tip.on{opacity:1}\n.tip b{font:900 13.5px 'Nunito Sans',system-ui,sans-serif;display:block}\n.answer{margin-top:12px;border-radius:4px 18px 4px 18px;padding:12px 14px;background:color-mix(in srgb,var(--c) 8%,#fff);border-left:4px solid var(--c);font-size:14px;line-height:1.55}\n.answer b{color:color-mix(in srgb,var(--c) 70%,#000)}\n.nomap{display:grid;place-items:center;text-align:center;min-height:320px;color:var(--muted);font-size:14px;padding:20px}\n\n/* panel lateral */\n.side{position:sticky;top:150px;max-height:calc(100vh - 110px);overflow:auto}\n.sh{margin:-18px -20px 14px;padding:16px 20px;border-radius:8px 30px 0 0;color:#fff;background:linear-gradient(130deg,color-mix(in srgb,var(--c) 70%,#2a1240),var(--c))}\n.sh small{font:900 10.5px 'Nunito Sans',system-ui,sans-serif;letter-spacing:1.3px;text-transform:uppercase;opacity:.9}\n.sh h3{font:900 21px/1.15 'Nunito Sans',system-ui,sans-serif;margin:4px 0 0}\n.sh .x{float:right;border:0;background:#ffffff2e;color:#fff;border-radius:3px 10px 3px 10px;padding:4px 9px;cursor:pointer;font-weight:800;font-size:12px}\n.kp{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}\n.kp div{background:#faf6fd;border:1px solid var(--line);border-radius:3px 14px 3px 14px;padding:10px 12px}\n.kp b{display:block;font:900 22px/1.1 'Nunito Sans',system-ui,sans-serif;color:color-mix(in srgb,var(--c) 70%,#000)}\n.kp span{font-size:11.5px;color:var(--ink2);line-height:1.35;display:block;margin-top:3px}\n.side h4{font:900 13.5px 'Nunito Sans',system-ui,sans-serif;margin:14px 0 6px}\n.side h4 small{font-weight:600;color:var(--muted)}\n.bars{display:flex;flex-direction:column;gap:5px}\n.bars>div{display:grid;grid-template-columns:minmax(80px,42%) minmax(0,1fr) auto;gap:8px;align-items:center;font-size:12px;cursor:default}\n.bars>div.me{font-weight:900}\n.bars>div.me span{color:color-mix(in srgb,var(--c) 70%,#000)}\n.bars span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--ink2);font-weight:700}\n.bars i{height:10px;border-radius:2px 7px 2px 7px;background:#f1ebf5;overflow:hidden;display:block}\n.bars em{display:block;height:100%}\n.bars b{font:800 12px 'Nunito Sans',system-ui,sans-serif;font-variant-numeric:tabular-nums}\n.bars>div[data-d]{cursor:pointer}\n.bars>div[data-d]:hover span{text-decoration:underline}\n.line{width:100%;height:auto;display:block}\n.facts{list-style:none;margin:0;padding:0;font-size:12.5px}\n.facts li{display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px dashed var(--line2)}\n.facts li span{color:var(--muted)}\n.facts li b{text-align:right;font-weight:800}\n.note{font-size:12px;color:var(--muted);line-height:1.5;margin:10px 0 0}\n.leg2{display:flex;gap:12px;font-size:11.5px;color:var(--ink2);margin-bottom:6px}\n.leg2 i{display:inline-block;width:10px;height:10px;border-radius:2px 5px 2px 5px;margin-right:4px;vertical-align:-1px}\n.deplist{margin-top:10px}\n@media(max-width:1100px){.stage{grid-template-columns:1fr}.side{position:static;max-height:none}}\n.stage>*{min-width:0}:host{display:block;max-width:100%}@media(max-width:620px){.panel{padding:14px}.sh{margin:-14px -14px 12px;padding:14px}.kp{grid-template-columns:1fr 1fr}.bars>div{grid-template-columns:minmax(70px,38%) minmax(0,1fr) auto}.hero{padding:22px 18px}.mapbox{grid-template-columns:1fr}.leg{flex-direction:row;flex-wrap:wrap}.tog{margin-left:0}.kp b{font-size:19px}}\n@media(prefers-reduced-motion:reduce){*{transition:none!important}}\n";
  var BODY = "<div class=\"bar\"><h2>Indicadores</h2><label class=\"search\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#8e36cf\" stroke-width=\"2.4\" stroke-linecap=\"round\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg><input id=\"q\" type=\"search\" placeholder=\"Buscar indicador o código\" aria-label=\"Buscar indicador\"></label>\n<label class=\"tog\"><input type=\"checkbox\" id=\"onlymap\" checked> Solo con datos en el mapa</label></div>\n<div class=\"chips\" id=\"chips\"></div>\n<div class=\"cards\" id=\"cards\" role=\"listbox\" aria-label=\"Indicadores\"></div>\n\n<div class=\"stage\">\n  <section class=\"panel\" id=\"mappanel\" aria-live=\"polite\"></section>\n  <aside class=\"panel side\" id=\"side\" aria-live=\"polite\"></aside>\n</div>\n";
  function ADM() { return Dc.documentElement.dataset.perfil === 'admin' || /Administracion/i.test(location.pathname) || !!Dc.getElementById('roleGate'); }
  /* ---------- Administración: qué indicadores se muestran en el mapa ---------- */
  var MAPLIST = [['VBG-04', 'Proporción de lesiones a mujeres por violencia de pareja'], ['VBG-01', 'Lesiones no fatales por delitos sexuales a mujeres'], ['VBG-02', 'Proporción de lesiones por delitos sexuales a mujeres'], ['AMP-V07', 'Exámenes por presunto delito sexual en mujeres'], ['AMP-V01', 'Presuntos homicidios de mujeres'], ['CUI-04', 'Participación de mujeres en trabajo no remunerado'], ['CUI-02', 'Brecha de participación en trabajo no remunerado'], ['X-PAR', 'Lesiones por violencia de pareja contra mujeres'], ['X-NNA', 'Violencia intrafamiliar contra niñas y adolescentes'], ['X-MAY', 'Violencia intrafamiliar contra mujeres mayores'], ['X-FAM', 'Violencia entre otros familiares contra mujeres'], ['X-SUI', 'Suicidios de mujeres'], ['X-POB', 'Población de mujeres']];
  function admPanel() {
    if (!ADM()) return; var hero = Dc.querySelector('.lv11adhero'); if (!hero || Dc.getElementById('lv20adm')) return;
    var c = cfg(), s = Dc.createElement('section'); s.id = 'lv20adm'; s.className = 'lv18adm'; s.setAttribute('data-no-translate', '');
    s.innerHTML = '<div class="lv18h"><div><small>Consulta pública</small><h2>Indicadores en el mapa</h2><p>Elige qué indicadores con datos por departamento aparecen en la pestaña «Indicadores en el mapa» y cuál se enciende primero como relleno del mapa (la población de mujeres se enciende como segunda capa si está visible). Los indicadores del catálogo sin datos territoriales se muestran siempre como «Sin mapa aún». Se guarda en este navegador (clave OMD_MAPA) y la consulta pública lo usa al recargar.</p></div></div>' +
      '<div class="lv20tbl"><div class="lv20r lv20hd"><span>Indicador</span><span>Mostrar</span><span>Capa inicial</span></div>' + MAPLIST.map(function (x) { var on = c.hidden.indexOf(x[0]) < 0; return '<label class="lv20r"><span><b>' + (x[0].indexOf('X-') === 0 ? 'Análisis' : x[0]) + '</b> ' + x[1] + '</span><span><input type="checkbox" data-show="' + x[0] + '"' + (on ? ' checked' : '') + '></span><span><input type="radio" name="lv20def" data-def="' + x[0] + '"' + (c.def === x[0] ? ' checked' : '') + (on ? '' : ' disabled') + '></span></label>'; }).join('') + '</div>' +
      '<div class="lv20act"><a class="lv11btn" href="Consulta_Publica_Observatorio.html#mapa" target="_blank" rel="noopener">Ver en la consulta pública ↗</a><button type="button" class="lv11btn ghost" data-reset="1">Restablecer</button><span class="lv20ok" aria-live="polite"></span></div>';
    var after = Dc.getElementById('lv18adm') || hero; after.parentNode.insertBefore(s, after.nextSibling);
    function save(c2) { try { localStorage.setItem(KEY, JSON.stringify(c2)); } catch (e) {} var ok = s.querySelector('.lv20ok'); ok.textContent = 'Guardado. La consulta pública lo mostrará al recargar.'; setTimeout(function () { ok.textContent = ''; }, 2500); }
    s.addEventListener('change', function (e) {
      var t = e.target, c2 = cfg();
      if (t.dataset.show) { var i = c2.hidden.indexOf(t.dataset.show); if (t.checked && i > -1) c2.hidden.splice(i, 1); if (!t.checked && i < 0) c2.hidden.push(t.dataset.show); var r = s.querySelector('[data-def="' + t.dataset.show + '"]'); r.disabled = !t.checked; if (!t.checked && c2.def === t.dataset.show) { var f = MAPLIST.find(function (x) { return c2.hidden.indexOf(x[0]) < 0; }); c2.def = f ? f[0] : ''; var rr = f && s.querySelector('[data-def="' + f[0] + '"]'); if (rr) rr.checked = true; } }
      if (t.dataset.def) c2.def = t.dataset.def;
      save(c2);
    });
    s.addEventListener('click', function (e) { if (e.target.closest('[data-reset]')) { try { localStorage.removeItem(KEY); } catch (x) {} s.remove(); admPanel(); } });
  }
  function cfg() { try { var c = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; return { hidden: c.hidden || [], def: c.def || 'X-PAR' }; } catch (e) { return { hidden: [], def: 'X-PAR' }; } }
  function getData() {
    var g = []; try { g = GEO; } catch (e) {}
    var V = null; try { V = V8_DATA; } catch (e) {}
    var cat = []; try { cat = all; } catch (e) {}
    var DEF = W.LV11_DEFAULTS || {};
    if (!g.length || !V || !cat.length) return null;
    var pub = DEF.publishedIndicators || [];
    try { var st = JSON.parse(localStorage.getItem('OMD_PORTAL_V11') || 'null'); if (st && st.ind && st.ind.published) pub = st.ind.published; } catch (e) {}
    return { geo: g, sources: V.sources, pop: V.population, cat: cat.filter(function (x) { return pub.indexOf(x.code) > -1; }), pub: pub, sites: DEF.sites || [], t2s: DEF.themeToSite || {} };
  }
  function nat() { try { var p = W.LV11_DEFAULTS.bulletins.enut.participation.tnr; return { M: p.M, H: p.H, src: 'DANE · ENUT 2024-2025, total nacional' }; } catch (e) { return { M: 89.8, H: 65.2, src: 'DANE · ENUT 2024-2025, total nacional' }; } }
  function mount(root, DATA, NAT) {

'use strict';
var D=DATA,doc=root;
function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function N(v,d){return v==null||isNaN(v)?'—':Number(v).toLocaleString('es-CO',{maximumFractionDigits:d||0,minimumFractionDigits:d||0})}
var GEO=D.geo,NAME={};GEO.forEach(function(g){NAME[g.code]=g.name});
var SRC={};D.sources.forEach(function(s){SRC[s.id]=s});
var SITE={};D.sites.forEach(function(s){SITE[s.id]=s});
function themeColor(t){var s=SITE[D.t2s[t]];return s?s.c:'#8E36CF'}
var WOMEN='#9E2C5A',MEN='#1A82B9';
var PAL=['#F6E3EF','#E7B3D2','#CF7DB6','#A54A98','#6E24A8'];

/* ---------- Definición de indicadores con datos por departamento ---------- */
// kind: count (mujeres), share (% mujeres en los registros), pct (estimación %), gap (pp mujeres−hombres), pop
var MAPS={
 'VBG-04':{src:'pareja',kind:'share',q:'¿Qué proporción de los registros de violencia de pareja corresponde a mujeres?',unit:'% de los registros'},
 'VBG-01':{src:'nofatal',cat:/Presunto Delito Sexual/,kind:'count',q:'¿Cuántos exámenes medicolegales por presunto delito sexual se hicieron a mujeres?',unit:'exámenes a mujeres'},
 'AMP-V07':{src:'nofatal',cat:/Presunto Delito Sexual/,kind:'count',q:'¿Dónde se registran más exámenes por presunto delito sexual en mujeres?',unit:'exámenes a mujeres'},
 'VBG-02':{src:'nofatal',cat:/Presunto Delito Sexual/,kind:'share',q:'¿Qué proporción de los exámenes por presunto delito sexual corresponde a mujeres?',unit:'% de los exámenes'},
 'AMP-V01':{src:'fatal',cat:/Homicid/,kind:'count',q:'¿Cuántos presuntos homicidios de mujeres registra Medicina Legal?',unit:'presuntos homicidios de mujeres',note:'La ficha pide una tasa por 100.000 mujeres; aquí se muestra el conteo hasta validar el denominador. Un homicidio de una mujer no equivale a feminicidio.'},
 'CUI-04':{src:'enut',kind:'pct',q:'¿Qué porcentaje de mujeres participa en trabajo no remunerado?',unit:'de las mujeres de 10 años y más participa',leg:'% de mujeres que participan',nat:NAT},
 'CUI-02':{src:'enut',kind:'gap',q:'¿Cuántos puntos más participan las mujeres que los hombres en trabajo no remunerado?',unit:'de diferencia entre mujeres y hombres',leg:'Brecha mujeres − hombres (pp)',nat:NAT},
 'X-PAR':{src:'pareja',kind:'count',q:'¿Cuántas lesiones por violencia de pareja contra mujeres se registraron?',unit:'lesiones a mujeres',extra:{name:'Lesiones por violencia de pareja contra mujeres',theme:'Vida libre de violencias',formula:'Conteo de registros de lesiones por violencia de pareja con víctima mujer, por departamento del hecho.',source:'Medicina Legal · Lesiones por violencia de pareja (histórico)'}},
 'X-NNA':{src:'nofatal',cat:/Niños, Niñas y Adolescentes/,kind:'count',q:'¿Cuántas niñas y adolescentes sufrieron lesiones por violencia intrafamiliar?',unit:'lesiones a niñas y adolescentes',extra:{name:'Violencia intrafamiliar contra niñas y adolescentes',theme:'Vida libre de violencias',formula:'Lesiones no fatales por violencia intrafamiliar contra niñas, niños y adolescentes, con víctima mujer.',source:'Medicina Legal · Lesiones no fatales'}},
 'X-MAY':{src:'nofatal',cat:/Adulto Mayor/,kind:'count',q:'¿Cuántas mujeres mayores sufrieron lesiones por violencia intrafamiliar?',unit:'lesiones a mujeres mayores',extra:{name:'Violencia intrafamiliar contra mujeres mayores',theme:'Vida libre de violencias',formula:'Lesiones no fatales por violencia intrafamiliar contra el adulto mayor, con víctima mujer.',source:'Medicina Legal · Lesiones no fatales'}},
 'X-FAM':{src:'nofatal',cat:/otros Familiares/,kind:'count',q:'¿Cuántas mujeres sufrieron lesiones por violencia de otros familiares?',unit:'lesiones a mujeres',extra:{name:'Violencia entre otros familiares contra mujeres',theme:'Vida libre de violencias',formula:'Lesiones no fatales por violencia entre otros familiares, con víctima mujer.',source:'Medicina Legal · Lesiones no fatales'}},
 'X-SUI':{src:'fatal',cat:/Suicid/,kind:'count',q:'¿Cuántos suicidios de mujeres registra Medicina Legal?',unit:'suicidios de mujeres',extra:{name:'Suicidios de mujeres',theme:'Salud y derechos sexuales',formula:'Conteo de muertes por suicidio con víctima mujer, por departamento del hecho.',source:'Medicina Legal · Lesiones fatales'},note:'Tema sensible. Si tú o alguien cercano lo necesita, busca ayuda: Línea 106 o 123.'},
 'X-POB':{kind:'pop',q:'¿Cuántas mujeres viven en cada departamento?',unit:'mujeres (proyección)',extra:{name:'Población de mujeres',theme:'Demografía y diversidades',formula:'Proyección de población de mujeres por departamento (cabecera, centros poblados y rural disperso).',source:'DANE · Proyecciones de población departamental'}}
};
var CFG=cfg();var CAT={};D.cat.forEach(function(x){CAT[x.code]=x});
var PUB=D.pub.slice();
// lista final de tarjetas: indicadores publicados + análisis derivados
var LIST=PUB.map(function(c){return CAT[c]}).filter(Boolean).map(function(x){return Object.assign({},x,{map:MAPS[x.code]||null})});
Object.keys(MAPS).forEach(function(k){if(k.indexOf('X-')===0){var m=MAPS[k];LIST.push(Object.assign({code:k,status:'Análisis',unit:m.unit,periodicity:k==='X-POB'?'Anual':'Según fuente',disaggregation:'Departamento, año y sexo'},m.extra,{map:m}))}});
LIST=LIST.filter(function(x){return CFG.hidden.indexOf(x.code)<0});
// ordenar: primero con mapa
LIST.sort(function(a,b){return (b.map?1:0)-(a.map?1:0)});

/* ---------- Cálculo ---------- */
function periods(m){if(m.kind==='pop'){var y={};D.pop.rows.forEach(function(r){y[r.year]=1});return Object.keys(y).sort()}return SRC[m.src].periods.slice()}
function defYear(m){var p=periods(m),s=SRC[m.src];if(s&&String(s.preliminary)==='true'&&p.length>1)return p[p.length-2];if(m.kind==='pop')return p.indexOf('2025')>-1?'2025':p[p.length-1];return p[p.length-1]}
function rowsOf(m,y){if(m.kind==='pop')return [];return SRC[m.src].rows.filter(function(r){return r.year===y&&(!m.cat||m.cat.test(r.category))})}
function values(m,y){
  var out={};
  if(m.kind==='pop'){D.pop.rows.forEach(function(r){if(r.year===y)out[r.dept]={v:r.women}});return out}
  rowsOf(m,y).forEach(function(r){var o=out[r.dept]||(out[r.dept]={m:0,h:0,pm:0,ph:0,lo:null,hi:null,cve:null,prot:0});
    if(r.suppressed||r.count==null){o.prot++;return}
    if(m.kind==='pct'||m.kind==='gap'){if(r.sex==='Mujer'){o.pm=r.count;o.lo=r.lower;o.hi=r.upper;o.cve=r.cve}else if(r.sex==='Hombre')o.ph=r.count;return}
    if(r.sex==='Mujer')o.m+=r.count;else if(r.sex==='Hombre')o.h+=r.count});
  Object.keys(out).forEach(function(k){var o=out[k];
    if(m.kind==='count')o.v=o.m||(o.prot?null:0);
    if(m.kind==='share')o.v=(o.m+o.h)?o.m/(o.m+o.h)*100:null;
    if(m.kind==='pct')o.v=o.pm;
    if(m.kind==='gap')o.v=(o.pm!=null&&o.ph!=null)?o.pm-o.ph:null});
  return out}
function fmt(m,v){if(v==null)return '—';if(m.kind==='share'||m.kind==='pct')return N(v,1)+' %';if(m.kind==='gap')return (v>0?'+':'')+N(v,1)+' pp';return N(v)}
function breaks(vals){var a=vals.filter(function(v){return v!=null}).sort(function(x,y){return x-y});if(!a.length)return[];var b=[];for(var i=1;i<5;i++)b.push(a[Math.min(a.length-1,Math.floor(a.length*i/5))]);return b}
function cls(v,b){if(v==null)return -1;var i=0;while(i<b.length&&v>=b[i])i++;return i}
function national(m,y,V){
  if(m.kind==='pct'||m.kind==='gap'){return m.nat?(m.kind==='pct'?m.nat.M:m.nat.M-m.nat.H):null}
  if(m.kind==='share'){var a=0,t=0;Object.keys(V).forEach(function(k){a+=V[k].m;t+=V[k].m+V[k].h});return t?a/t*100:null}
  var s=0;Object.keys(V).forEach(function(k){s+=V[k].v||0});return s}

/* ---------- Estado ---------- */
var st={ind:null,year:null,dep:null,theme:'',q:'',only:true};

/* ---------- Tarjetas ---------- */
function themes(){var t={};LIST.forEach(function(x){t[x.theme]=1});return Object.keys(t)}
function renderChips(){var h='<button class="chip'+(st.theme?'':' on')+'" data-t="" style="--c:#8E36CF"><i></i>Todas las líneas</button>'+themes().map(function(t){return '<button class="chip'+(st.theme===t?' on':'')+'" data-t="'+E(t)+'" style="--c:'+themeColor(t)+'"><i></i>'+E(t)+'</button>'}).join('');doc.getElementById('chips').innerHTML=h}
function cardVal(x){var m=x.map;if(!m)return '<div class="val">Ficha sin datos territoriales<span>'+E(x.source||'Fuente por definir')+'</span></div>';var y=defYear(m),V=values(m,y),n=national(m,y,V);
  var vs=Object.keys(V).map(function(k){return V[k].v}).filter(function(v){return v!=null}).sort(function(a,b){return b-a}).slice(0,12),mx=vs[0]||1;
  return '<div class="mini" aria-hidden="true">'+vs.map(function(v){return '<i style="height:'+Math.max(8,v/mx*100)+'%"></i>'}).join('')+'</div><div class="val">'+fmt(m,n)+'<span>'+(m.kind==='pct'||m.kind==='gap'?'Total nacional':'Colombia')+' · '+E(y)+'</span></div>'}
function renderCards(){
  var q=st.q.toLowerCase(),L=LIST.filter(function(x){return(!st.theme||x.theme===st.theme)&&(!st.only||x.map)&&(!q||(x.code+' '+x.name).toLowerCase().indexOf(q)>-1)});
  doc.getElementById('cards').innerHTML=L.length?L.map(function(x){var c=themeColor(x.theme);return '<button class="card'+(x.map?'':' nod')+(st.ind===x.code?' on':'')+'" role="option" aria-selected="'+(st.ind===x.code)+'" data-c="'+E(x.code)+'" style="--c:'+c+'"><div class="row"><small>'+(x.code.indexOf('X-')===0?'ANÁLISIS':'INDICADOR')+'</small><span class="bd '+(x.map?'mp':'no')+'">'+(x.map?'Con mapa':'Sin mapa aún')+'</span></div><b>'+E(x.name)+'</b><span class="th"><i></i>'+E(x.theme)+'</span>'+cardVal(x)+'</button>'}).join(''):'<div class="empty">No hay indicadores con ese filtro.</div>';
  var on=doc.querySelector('.card.on');if(on)on.scrollIntoView({block:'nearest',inline:'nearest'})}

/* ---------- Mapa ---------- */
function cur(){return LIST.find(function(x){return x.code===st.ind})}
function renderMap(){
  var x=cur(),el=doc.getElementById('mappanel'),c=themeColor(x.theme);el.style.setProperty('--c',c);doc.getElementById('side').style.setProperty('--c',c);
  if(!x.map){el.innerHTML='<div class="mh"><div><small>'+E(x.theme)+'</small><h3>'+E(x.name)+'</h3><p>'+E(x.unit||'')+'</p></div></div>'+mapSVG({},[],null,true)+'<div class="answer">Este indicador todavía no tiene datos por departamento. En el panel lateral está su ficha y lo que falta para mapearlo.</div>';wireMap(null);return}
  var m=x.map,ps=periods(m),V=values(m,st.year),vals=Object.keys(V).map(function(k){return V[k].v}),b=breaks(vals),n=national(m,st.year,V);
  var rank=Object.keys(V).filter(function(k){return V[k].v!=null}).sort(function(a,z){return V[z].v-V[a].v});
  var top=rank[0],low=rank[rank.length-1],src=m.src?SRC[m.src]:null;
  var ans='<b>'+fmt(m,n)+'</b> '+E(m.unit)+' en Colombia ('+E(st.year)+(m.kind==='pct'||m.kind==='gap'?', total nacional':'')+'). '+(top?'El valor más alto está en <b>'+E(NAME[top])+'</b> ('+fmt(m,V[top].v)+') y el más bajo en <b>'+E(NAME[low])+'</b> ('+fmt(m,V[low].v)+').':'');
  if(src&&String(src.preliminary)==='true'&&st.year===ps[ps.length-1])ans+=' <i>Año parcial y preliminar.</i>';
  el.innerHTML='<div class="mh"><div><small>'+E(x.theme)+'</small><h3>'+E(x.name)+'</h3><p>'+E(m.q)+'</p></div><div class="ctl">'+(ps.length>1?'<div><span style="font:800 10px Nunito Sans,sans-serif;letter-spacing:.8px;text-transform:uppercase;color:#6f6f6e">Periodo</span><div class="years">'+ps.map(function(y){return '<button data-y="'+y+'"'+(y===st.year?' class="on"':'')+'>'+y+(src&&String(src.preliminary)==='true'&&y===ps[ps.length-1]?'*':'')+'</button>'}).join('')+'</div></div>':'<span class="years"><button class="on">'+E(st.year)+'</button></span>')+
    '<label>Departamento<select id="dsel"><option value="">Todo el país</option>'+GEO.slice().sort(function(a,z){return a.name.localeCompare(z.name)}).map(function(g){return '<option value="'+g.code+'"'+(st.dep===g.code?' selected':'')+'>'+E(g.name)+'</option>'}).join('')+'</select></label></div></div>'+
    '<div class="answer">'+ans+'</div>'+mapSVG(V,b,m)+(m.note?'<p class="note">'+E(m.note)+'</p>':'');
  wireMap(V,m)}
function mapSVG(V,b,m,none){
  var paths=GEO.map(function(g){var o=V[g.code],k=o?cls(o.v,b):-1,fill=none?'#ece6f0':(k<0?'url(#hatch)':PAL[k]);
    return '<path d="'+g.path+'" fill="'+fill+'" data-d="'+g.code+'" tabindex="0" role="button" aria-label="'+E(g.name)+(o&&m?': '+fmt(m,o.v):'')+'"'+(st.dep===g.code&&!none?' class="sel"':'')+'></path>'}).join('');
  var leg='';if(!none&&m){var mn=[],a=Object.keys(V).map(function(k){return V[k].v}).filter(function(v){return v!=null}).sort(function(x,y){return x-y});
    var edges=[a[0]].concat(b).concat([a[a.length-1]]);leg='<div class="leg"><b>'+E(m.leg||m.unit)+'</b>'+PAL.map(function(c,i){return '<span><i style="background:'+c+'"></i>'+fmt(m,edges[i])+' – '+fmt(m,edges[i+1])+'</span>'}).join('')+'<span><i class="h"></i>Sin dato o celdas protegidas</span></div>'}
  return '<div class="mapbox"><svg class="map'+(st.dep?' dim':'')+'" viewBox="0 0 410 490" role="group" aria-label="Mapa de Colombia por departamento"><defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#f1eef3"/><path d="M0 6L6 0" stroke="#c9c2cf" stroke-width="1.2"/></pattern></defs>'+paths+'</svg>'+leg+'</div>'}
function wireMap(V,m){
  var svg=doc.querySelector('svg.map'),tip=doc.getElementById('tip');
  svg.addEventListener('pointermove',function(e){var p=e.target.closest('path');if(!p){tip.classList.remove('on');return}var d=p.dataset.d,o=V&&V[d];tip.innerHTML='<b>'+E(NAME[d])+'</b>'+(m?(o?fmt(m,o.v)+' '+E(m.unit)+(o.prot?'<br><small>Incluye celdas protegidas (1 a 4 registros)</small>':''):'Sin dato'):'Sin datos territoriales')+'<br><small>Toca para ver el detalle</small>';tip.classList.add('on');var w=tip.offsetWidth;tip.style.left=Math.min(innerWidth-w-8,e.clientX+14)+'px';tip.style.top=(e.clientY+16)+'px'});
  svg.addEventListener('pointerleave',function(){tip.classList.remove('on')});
  svg.addEventListener('click',function(e){var p=e.target.closest('path');if(p)pick(st.dep===p.dataset.d?null:p.dataset.d)});
  svg.addEventListener('keydown',function(e){var p=e.target.closest('path');if(p&&(e.key==='Enter'||e.key===' ')){e.preventDefault();pick(p.dataset.d)}});
  var ds=doc.getElementById('dsel');if(ds)ds.onchange=function(){pick(this.value||null)};
  doc.querySelectorAll('.years button[data-y]').forEach(function(bt){bt.onclick=function(){st.year=bt.dataset.y;renderAll()}})}
function pick(d){st.dep=d;renderMap();renderSide()}

/* ---------- Panel lateral ---------- */
function bars(items,max,color,meKey){return '<div class="bars">'+items.map(function(i){return '<div'+(i.k?' data-d="'+i.k+'"':'')+(i.k&&i.k===meKey?' class="me"':'')+' title="'+E(i.l+': '+i.t)+'"><span>'+E(i.l)+'</span><i><em style="width:'+(max?Math.max(1,i.v/max*100):0)+'%;background:'+(i.c||color)+'"></em></i><b>'+E(i.t)+'</b></div>'}).join('')+'</div>'}
function line(labels,series,f){var W=360,H=130,L=50,R=10,T=10,B=24,all=[];series.forEach(function(s){s.v.forEach(function(v){if(v!=null)all.push(v)})});if(!all.length)return '';var mx=Math.max.apply(null,all),mn=Math.min(0,Math.min.apply(null,all));if(mx===mn)mx=mn+1;
  var x=function(i){return L+(labels.length===1?(W-L-R)/2:i*(W-L-R)/(labels.length-1))},y=function(v){return T+(1-(v-mn)/(mx-mn))*(H-T-B)};
  var g=[mn,(mn+mx)/2,mx].map(function(v){return '<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y(v)+'" y2="'+y(v)+'" stroke="#ebe2f1"/><text x="'+(L-6)+'" y="'+(y(v)+4)+'" text-anchor="end" font-size="10" fill="#6f6f6e">'+f(v)+'</text>'}).join('');
  var xl=labels.map(function(l,i){return (labels.length>6&&i%2&&i!==labels.length-1)?'':'<text x="'+x(i)+'" y="'+(H-6)+'" text-anchor="middle" font-size="10" fill="#6f6f6e">'+E(l)+'</text>'}).join('');
  return '<svg class="line" viewBox="0 0 '+W+' '+H+'" role="img">'+g+xl+series.map(function(s){var p=s.v.map(function(v,i){return v==null?null:[x(i),y(v),v,labels[i]]}).filter(Boolean);return '<polyline fill="none" stroke="'+s.c+'" stroke-width="2.6" stroke-linejoin="round" points="'+p.map(function(q){return q[0]+','+q[1]}).join(' ')+'"/>'+p.map(function(q){return '<circle cx="'+q[0]+'" cy="'+q[1]+'" r="3.4" fill="#fff" stroke="'+s.c+'" stroke-width="2"><title>'+E(s.n+' · '+q[3]+': '+f(q[2]))+'</title></circle>'}).join('')}).join('')+'</svg>'}
function ficha(x){return '<h4>Ficha del indicador</h4><ul class="facts">'+[['Fórmula',x.formula],['Unidad',x.unit],['Fuente',x.source],['Desagregación',x.disaggregation],['Periodicidad',x.periodicity],['Estado',x.status]].filter(function(r){return r[1]}).map(function(r){return '<li><span>'+r[0]+'</span><b>'+E(r[1])+'</b></li>'}).join('')+'</ul>'}
function renderSide(){
  var x=cur(),el=doc.getElementById('side');
  if(!x.map){el.innerHTML='<div class="sh"><small>Ficha</small><h3>'+E(x.name)+'</h3></div><div class="answer" style="margin-top:0">Para verlo en el mapa se necesita la fuente <b>'+E(x.source||'por definir')+'</b> con desagregación por departamento, año y sexo, y su procesamiento con protección de celdas pequeñas.</div>'+ficha(x);return}
  var m=x.map,V=values(m,st.year),n=national(m,st.year,V),src=m.src?SRC[m.src]:null;
  var rk=Object.keys(V).filter(function(k){return V[k].v!=null}).sort(function(a,z){return V[z].v-V[a].v}),mx=rk.length?V[rk[0]].v:0;
  if(!st.dep){
    var h='<div class="sh"><small>Datos procesados · '+E(st.year)+'</small><h3>Colombia</h3></div><div class="kp"><div><b>'+fmt(m,n)+'</b><span>'+E(m.unit)+(m.kind==='pct'||m.kind==='gap'?' · '+E(m.nat.src):' · suma de departamentos')+'</span></div><div><b>'+rk.length+'</b><span>departamentos con dato publicable</span></div></div>';
    if(m.kind==='pct'||m.kind==='gap')h+='<div class="kp"><div><b style="color:'+WOMEN+'">'+N(m.nat.M,1)+' %</b><span>mujeres · nacional</span></div><div><b style="color:'+MEN+'">'+N(m.nat.H,1)+' %</b><span>hombres · nacional</span></div></div>';
    h+='<h4>Ranking por departamento <small>(toca uno)</small></h4>'+bars(rk.slice(0,10).map(function(k){return{k:k,l:NAME[k],v:Math.max(0,V[k].v),t:fmt(m,V[k].v)}}),Math.max(0,mx),themeColor(x.theme));
    if(rk.length>10)h+='<p class="note">… y '+(rk.length-10)+' departamentos más. Usa el mapa o la lista para verlos.</p>';
    var ps=periods(m);if(ps.length>1&&m.kind!=='pop'){var ser=ps.map(function(y){return national(m,y,values(m,y))});h+='<h4>Evolución nacional</h4>'+line(ps,[{n:x.name,c:themeColor(x.theme),v:ser}],function(v){return fmt(m,v)})}
    el.innerHTML=h+meta(m,src)+ficha(x);wireSide();return}
  var d=st.dep,o=V[d]||{},pos=rk.indexOf(d)+1,h='<div class="sh"><button class="x" data-close="1">Ver Colombia ✕</button><small>Datos procesados · '+E(st.year)+'</small><h3>'+E(NAME[d])+'</h3></div>';
  h+='<div class="kp"><div><b>'+fmt(m,o.v)+'</b><span>'+E(m.unit)+'</span></div><div><b>'+(pos?pos+' / '+rk.length:'—')+'</b><span>puesto entre departamentos</span></div></div>';
  if(m.kind==='count'&&n)h+='<div class="kp"><div><b>'+N((o.v||0)/n*100,1)+' %</b><span>del total del país</span></div><div><b>'+((o.m+o.h)?N(o.m/(o.m+o.h)*100,1)+' %':'—')+'</b><span>de los registros son mujeres</span></div></div>';
  if(m.kind==='share')h+='<div class="kp"><div><b>'+N(o.m)+'</b><span>registros de mujeres</span></div><div><b>'+N(o.h)+'</b><span>registros de hombres</span></div></div>';
  if(m.kind==='pct'||m.kind==='gap')h+='<div class="kp"><div><b style="color:'+WOMEN+'">'+N(o.pm,1)+' %</b><span>mujeres · IC 95 % '+N(o.lo,1)+'–'+N(o.hi,1)+'</span></div><div><b style="color:'+MEN+'">'+N(o.ph,1)+' %</b><span>hombres</span></div></div>';
  if(o.prot)h+='<p class="note">'+o.prot+' celda(s) de 1 a 4 registros no se muestran para proteger la identidad de las personas.</p>';
  // comparación
  h+='<h4>Comparación</h4>'+bars([{l:NAME[d],v:Math.max(0,o.v||0),t:fmt(m,o.v),c:themeColor(x.theme)},{l:'Colombia'+(m.kind==='count'||m.kind==='pop'?' (promedio por depto.)':''),v:Math.max(0,m.kind==='count'||m.kind==='pop'?n/rk.length:n),t:fmt(m,m.kind==='count'||m.kind==='pop'?n/rk.length:n),c:'#8E36CF'}],Math.max(o.v||0,m.kind==='count'||m.kind==='pop'?n/rk.length:n),'#8E36CF');
  // serie
  var ps=periods(m);if(ps.length>1){var sm=ps.map(function(y){var w=values(m,y)[d];return w?w.v:null});var ser=[{n:NAME[d],c:themeColor(x.theme),v:sm}];
    if(m.kind==='count'&&m.src){ser=[{n:'Mujeres',c:WOMEN,v:ps.map(function(y){var w=values(m,y)[d];return w?w.m:null})},{n:'Hombres',c:MEN,v:ps.map(function(y){var w=values(m,y)[d];return w?w.h:null})}]}
    h+='<h4>Evolución en '+E(NAME[d])+'</h4>'+(ser.length>1?'<div class="leg2"><span><i style="background:'+WOMEN+'"></i>Mujeres</span><span><i style="background:'+MEN+'"></i>Hombres</span></div>':'')+line(ps,ser,function(v){return m.kind==='count'?N(v):fmt(m,v)})}
  // categorías del departamento
  if(m.src==='nofatal'||m.src==='fatal'){var C={};SRC[m.src].rows.forEach(function(r){if(r.year===st.year&&r.dept===d&&r.sex==='Mujer'&&!r.suppressed&&r.count!=null)C[r.category]=(C[r.category]||0)+r.count});var it=Object.keys(C).map(function(k){return{l:k.replace(/^\d+\s+/,''),v:C[k],t:N(C[k]),c:m.cat.test(k)?themeColor(x.theme):'#d9c9e6'}}).sort(function(a,z){return z.v-a.v});
    h+='<h4>Mujeres por tipo de hecho en '+E(NAME[d])+' <small>('+E(st.year)+')</small></h4>'+bars(it,it.length?it[0].v:0,'#d9c9e6')}
  // población
  var py=D.pop.rows.filter(function(r){return r.dept===d&&r.year===(st.year.length===4?st.year:'2025')})[0]||D.pop.rows.filter(function(r){return r.dept===d})[0];
  if(py&&m.kind!=='pop')h+='<p class="note">Contexto: '+E(NAME[d])+' tiene '+N(py.women)+' mujeres proyectadas en '+E(py.year)+' (DANE). No se calcula tasa porque el lugar del hecho no siempre es el de residencia.</p>';
  el.innerHTML=h+meta(m,src)+ficha(x);wireSide()}
function meta(m,src){if(m.kind==='pop')return '<h4>Fuente</h4><ul class="facts"><li><span>Productora</span><b>DANE · PPED</b></li><li><span>Archivo</span><b>'+E(D.pop.file)+'</b></li></ul>';
  return '<h4>Fuente y procesamiento</h4><ul class="facts"><li><span>Productora</span><b>'+E(src.producer)+'</b></li><li><span>Archivo</span><b>'+E(src.file)+'</b></li><li><span>Corte</span><b>'+E(src.cut)+(String(src.preliminary)==='true'?' · preliminar':'')+'</b></li><li><span>Unidad</span><b>'+E(src.unit)+'</b></li></ul><p class="note">'+E(src.method)+'</p>'}
function wireSide(){var s=doc.getElementById('side');s.querySelectorAll('[data-d]').forEach(function(r){r.onclick=function(){pick(r.dataset.d)}});var c=s.querySelector('[data-close]');if(c)c.onclick=function(){pick(null)}}

/* ---------- Eventos ---------- */
function select(code){var x=LIST.find(function(i){return i.code===code});st.ind=code;st.year=x.map?defYear(x.map):null;renderAll();
  doc.getElementById('mappanel').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}
function renderAll(){renderCards();renderMap();renderSide()}
doc.getElementById('cards').addEventListener('click',function(e){var c=e.target.closest('.card');if(c)select(c.dataset.c)});
doc.getElementById('chips').addEventListener('click',function(e){var c=e.target.closest('.chip');if(!c)return;st.theme=c.dataset.t;renderChips();renderCards()});
doc.getElementById('q').addEventListener('input',function(){st.q=this.value;renderCards()});
doc.getElementById('onlymap').addEventListener('change',function(){st.only=this.checked;renderCards()});
renderChips();var first=LIST.find(function(x){return x.code===CFG.def&&x.map})||LIST.find(function(x){return x.map})||LIST[0];if(first){st.ind=first.code;st.year=first.map?defYear(first.map):null;renderAll()}

  }
  function build() {
    if (ADM()) return true; if (Dc.getElementById('mapa')) return true;
    var main = Dc.querySelector('main'); if (!main) return false;
    var data = getData(); if (!data) return false;
    var sec = Dc.createElement('section'); sec.id = 'mapa'; sec.className = 'page lv11page'; sec.setAttribute('data-no-translate', '');
    sec.innerHTML = '<div class="lv11content"><div class="lv11head"><div class="eyebrow">Indicadores en el mapa</div><h1>Visor geográfico de indicadores.</h1><p>Enciende una o varias capas: la primera colorea los departamentos y la segunda se dibuja con círculos. Los filtros, la leyenda y los datos procesados están dentro del mapa. En «Relaciones» ves si dos indicadores se mueven juntos entre departamentos.</p></div><div id="lv20host"></div></div>';
    var ind = Dc.getElementById('indicadores'); if (ind && ind.parentNode === main) main.insertBefore(sec, ind.nextSibling); else main.appendChild(sec);
    var host = sec.querySelector('#lv20host'), root = host.attachShadow({ mode: 'open' });
    if (W.LV21_MOUNT) W.LV21_MOUNT(root, data, nat(), cfg()); else { root.innerHTML = '<style>' + CSS + '</style><div class="mroot">' + BODY + '</div>'; mount(root, data, nat()); }
    return true;
  }
  function init() { admPanel(); new MutationObserver(function () { admPanel(); }).observe(Dc.body, { childList: true, subtree: true }); if (build()) return; var n = 0, t = setInterval(function () { if (build() || ++n > 40) clearInterval(t); }, 250); }
  if (Dc.readyState === 'loading') Dc.addEventListener('DOMContentLoaded', function () { setTimeout(init, 300); }); else setTimeout(init, 300);
})();
