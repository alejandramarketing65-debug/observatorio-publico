/* ==========================================================================
   LIBRES v24 · Inicio limpio, accesibilidad, ruta de navegación y fotografías
   - Barra superior: logos de cooperación + herramientas de accesibilidad
     (saltar al contenido, tamaño de texto, alto contraste, subrayar enlaces).
   - Ruta de navegación (migas de pan) en todas las páginas: Inicio › sección.
   - Página de inicio nueva: foto principal, buscador, ruta por pasos,
     cifras clave, subpáginas en tarjetas con foto, líneas temáticas,
     territorios ¡LIBRES! y franja de orientación.
   - Fotografías reales: cada espacio lee primero la imagen cargada en
     Administración (misma memoria que v18) y luego fotos/<archivo>.jpg junto
     al HTML; si no existe, muestra un marco que indica qué foto va ahí.
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window, R = D.documentElement;
  function en() { try { if (typeof language === 'string') return language === 'en'; } catch (e) {} return (R.lang || 'es').indexOf('en') === 0; }
  function T(es, e) { return en() ? e : es; }
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function N(v) { return Number(v).toLocaleString(en() ? 'en-US' : 'es-CO'); }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
  var CONSULTA = !!D.getElementById('libres') && !!D.getElementById('navigation') && !/Administracion/i.test(location.pathname) && !D.getElementById('roleGate');

  /* ---------------- Fotografías ---------------- */
  // clave interna (igual a Administración › Fotografías) → archivo en la carpeta fotos/
  var PH = {
    home: ['inicio', 'Mujeres diversas de los territorios ¡LIBRES!', 'Retrato grupal de mujeres diversas (edades, etnias, rural y urbana) en Cauca o Valle'],
    indicadores: ['indicadores', 'Lideresa revisando información', 'Mujer o colectiva revisando cifras, cuadernos o carteleras'],
    mapa: ['mapa', 'Mujeres en su territorio', 'Mujeres rurales en el paisaje del norte del Cauca'],
    publicaciones: ['datos', 'Taller de análisis de datos', 'Grupo de mujeres analizando información en un taller'],
    normativa: ['normativa', 'Mujeres ejerciendo sus derechos', 'Espacio de participación, cabildo o mesa de mujeres'],
    red: ['observatorios', 'Encuentro de organizaciones', 'Encuentro de organizaciones y observatorios de mujeres'],
    rutas: ['rutas', 'Acompañamiento a mujeres', 'Profesional acompañando a una mujer (sin rostros identificables)'],
    conocimiento: ['conocimiento', 'Mujeres aprendiendo juntas', 'Formación, escuela o círculo de saberes'],
    asistente: ['consulta', 'Orientación y conversación', 'Conversación de orientación entre mujeres'],
    territorios: ['territorios', 'Territorios ¡LIBRES!', 'Paisaje o plaza de uno de los 7 municipios ¡LIBRES!'],
    temas: ['temas', 'Mujeres en todas sus diversidades', 'Mujeres jóvenes, mayores, indígenas, afro, LBT, campesinas']
  };
  // Fotos temporales de uso libre (licencia Unsplash), enlazadas desde images.unsplash.com.
  // Se reemplazan con fotos propias: Administración o carpeta fotos/ tienen prioridad.
  var UNS = {
    home: ['photo-1529333166437-7750a6dd5a70', 'Simon Maage'], indicadores: ['photo-1569012871812-f38ee64cd54c', 'Kelly Sikkema'], mapa: ['photo-1588497502684-f47b2437367f', 'Berend Leupen'],
    publicaciones: ['photo-1554902843-260acd0993f8', 'CoWomen'], normativa: ['photo-1633354582314-9a15261c9287', 'Gayatri Malhotra'], red: ['photo-1531058020387-3be344556be6', 'Jakob Dalbjörn'],
    rutas: ['photo-1522543558187-768b6df7c25c', 'Vonecia Carswell'], conocimiento: ['photo-1522202176988-66273c2fd55f', 'Brooke Cagle'], asistente: ['photo-1573497620053-ea5300f94f21', 'Christina @ wocintechchat.com'],
    territorios: ['photo-1642044538550-eb8fa33889c8', 'Juan Camilo Guarin P'],
    'linea-violencias': ['photo-1582213782179-e0d53f98f2ca', 'Hannah Busing'], 'linea-casas-refugio': ['photo-1656577796467-e049bfc98376', 'Jametlene Reskp'], 'linea-lgbtiq': ['photo-1573339584805-6ed85958b6e8', 'Margaux Bellott'],
    'linea-autonomia': ['photo-1590650153855-d9e808231d41', 'LinkedIn Sales Solutions'], 'linea-participacion': ['photo-1573164574572-cb89e39749b4', 'Christina @ wocintechchat.com'], 'linea-educacion': ['photo-1514369118554-e20d93546b30', 'Kyle Gregory Devaras'],
    'linea-red-observatorios': ['photo-1561489404-42f13a2f09a2', 'Evangeline Shaw'], 'linea-comite-1257': ['photo-1589829545856-d10d557cf95f', 'Tingey Injury Law Firm'], 'linea-comite-1719': ['photo-1488942446680-85dd7de440ef', 'Vlad Tchompalov'],
    'linea-comites-tecnico-juridicos': ['photo-1505664194779-8beaceb93744', 'Giammarco Boscaro'], 'linea-pan-1325': ['photo-1491439833076-514a03b24a15', 'Priscilla Du Preez'], 'linea-salud-dsr': ['photo-1631217868264-e5b90bb7e133', 'National Cancer Institute'],
    'linea-cuidados': ['photo-1543333995-a78aea2eee50', 'Dominik Lange'], 'linea-demografia': ['photo-1607748862156-7c548e7e98f4', 'Joel Muniz'], 'linea-rutas': ['photo-1604881991720-f91add269bed', 'Priscilla Du Preez'],
    'linea-etnico': ['photo-1724521260101-c13e61992638', 'Daniel Tischer']
  };
  function uns(k, w) { var u = UNS[k]; return u ? 'https://images.unsplash.com/' + u[0] + '?w=' + (w || 1400) + '&q=70&auto=format&fit=crop' : ''; }
  function own() { try { return JSON.parse(ls('OMD_ILUSTRACIONES') || '{}') || {}; } catch (e) { return {}; } }
  var CAM = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.6"/></svg>';
  function photo(k, cls) {
    var p = PH[k] || PH.temas;
    if (/^linea-/.test(k)) { var sn = siteName(k.slice(6)); p = [k, sn, T('Foto de la línea: ', 'Photo for: ') + sn]; }
    var src = own()[k] || ('fotos/' + p[0] + '.jpg');
    return '<figure class="lv23ph ' + (cls || '') + '" data-k="' + k + '"><div class="ph0" aria-hidden="true"><i></i><i></i><span class="cam">' + CAM + '</span><b>' + T('Espacio para fotografía', 'Photo placeholder') + '</b><small>' + E(p[2]) + '</small><code>fotos/' + p[0] + '.jpg</code></div>' +
      '<img src="' + src + '" data-alt="' + (own()[k] ? '' : uns(k)) + '" alt="' + E(p[1]) + '" loading="lazy" decoding="async" onload="this.parentNode.classList.add(\'ok\')" onerror="if(this.dataset.alt){this.src=this.dataset.alt;this.dataset.alt=\'\';var c=this.parentNode.querySelector(\'.cr\');if(c)c.hidden=false}else this.remove()">' +
      (UNS[k] ? '<span class="cr" hidden>Foto: ' + E(UNS[k][1]) + ' · Unsplash</span>' : '') + '</figure>';
  }
  W.LV23_PHOTO = photo;
  // las bandas de sección usan foto en lugar de ilustración
  var prevArt = W.LV15ART, BANDPAGES = ['indicadores', 'mapa', 'publicaciones', 'normativa', 'red', 'rutas', 'conocimiento', 'asistente'];
  W.LV15ART = function (kind) { if (BANDPAGES.indexOf(kind) > -1) return photo(kind, 'xband'); return prevArt ? prevArt(kind) : ''; };

  /* ---------------- Barra superior: logos + accesibilidad ---------------- */
  var A11Y_KEY = 'OMD_ACCESIBILIDAD', a11y = (function () { try { return JSON.parse(ls(A11Y_KEY) || '{}') || {}; } catch (e) { return {}; } })();
  function applyA11y() {
    var z = a11y.z || 1; D.body.style.zoom = z === 1 ? '' : z;
    R.classList.toggle('lv23hc', !!a11y.hc); R.classList.toggle('lv23ul', !!a11y.ul); R.classList.toggle('lv23calm', !!a11y.calm);
    D.querySelectorAll('#lv23a11y [data-a]').forEach(function (b) { var k = b.dataset.a; if (k === 'hc' || k === 'ul' || k === 'calm') b.setAttribute('aria-pressed', a11y[k] ? 'true' : 'false'); });
    var zl = D.getElementById('lv23z'); if (zl) zl.textContent = Math.round((a11y.z || 1) * 100) + ' %';
    ls(A11Y_KEY, JSON.stringify(a11y));
  }
  function topBar() {
    if (D.getElementById('lv23top')) return;
    var L = W.LV12_LOGOS || {}, hd = D.querySelector('body > header'); if (!hd) return;
    var logos = [['gobierno', 'Gobierno de Colombia'], ['ue', 'Unión Europea'], ['aecid', 'AECID · Cooperación Española'], ['france', 'Expertise France, Groupe AFD'], ['alemana', 'Cooperación Alemana · GIZ']];
    var main = D.querySelector('main'); if (main && !main.id) main.id = 'contenido';
    var t = D.createElement('div'); t.id = 'lv23top'; t.setAttribute('data-no-translate', '');
    t.innerHTML = '<a class="skip" href="#' + (main ? main.id : 'contenido') + '">' + T('Saltar al contenido principal', 'Skip to main content') + '</a>' +
      '<div class="in"><div class="coop" role="group" aria-label="' + T('Proyecto ¡LIBRES! con el apoyo de', '¡LIBRES! project supported by') + '">' + ((L.franja || L.coop) ? '<img class="franja" src="' + (L.franja || L.coop) + '" alt="Gobierno de Colombia, Unión Europea, AECID Colombia, Cooperación Española, Expertise France, Cooperación Alemana (GIZ) y ¡LIBRES!">' : logos.map(function (x) { return L[x[0]] ? '<img class="' + x[0] + '" src="' + L[x[0]] + '" alt="' + x[1] + '">' : ''; }).join('')) + '</div>' +
      '</div>';
    hd.parentNode.insertBefore(t, hd);
    // herramientas de accesibilidad: botón flotante discreto (abajo a la izquierda)
    var old = D.getElementById('lv23a11y'); if (old) old.remove();
    var f = D.createElement('div'); f.id = 'lv23a11y'; f.setAttribute('data-no-translate', '');
    f.innerHTML = '<button type="button" class="tg" aria-expanded="false" aria-controls="lv23a11yp" title="' + T('Opciones de lectura', 'Reading options') + '"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="4.5" r="1.8" fill="currentColor"/><path d="M5 8.5l7 1.5 7-1.5M12 10v5M9 21l3-6 3 6"/></svg><span class="sr">' + T('Opciones de lectura', 'Reading options') + '</span></button>' +
      '<div class="tools" id="lv23a11yp" role="toolbar" hidden aria-label="' + T('Opciones de lectura', 'Reading options') + '">' +
      '<button type="button" data-a="zm" aria-label="' + T('Reducir tamaño del texto', 'Smaller text') + '">A−</button><span id="lv23z" aria-live="polite">100 %</span><button type="button" data-a="zp" aria-label="' + T('Aumentar tamaño del texto', 'Larger text') + '">A+</button>' +
      '<button type="button" data-a="hc" aria-pressed="false" title="' + T('Alto contraste', 'High contrast') + '"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg><span>' + T('Contraste', 'Contrast') + '</span></button>' +
      '<button type="button" data-a="ul" aria-pressed="false" title="' + T('Subrayar enlaces', 'Underline links') + '"><u>S</u><span>' + T('Enlaces', 'Links') + '</span></button>' +
      '<button type="button" data-a="calm" aria-pressed="false" title="' + T('Detener animaciones', 'Stop animations') + '"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg><span>' + T('Animación', 'Motion') + '</span></button>' +
      '<button type="button" data-a="rs" title="' + T('Restablecer', 'Reset') + '">' + T('Restablecer', 'Reset') + '</button></div>';
    D.body.appendChild(f);
    f.addEventListener('click', function (e) {
      var tg = e.target.closest('.tg'); if (tg) { var p = f.querySelector('.tools'), o = p.hidden; p.hidden = !o; tg.setAttribute('aria-expanded', String(o)); return; }
      var b = e.target.closest('[data-a]'); if (!b) return; var k = b.dataset.a;
      if (k === 'zp') a11y.z = Math.min(1.4, Math.round(((a11y.z || 1) + .1) * 10) / 10);
      else if (k === 'zm') a11y.z = Math.max(.9, Math.round(((a11y.z || 1) - .1) * 10) / 10);
      else if (k === 'rs') a11y = {};
      else a11y[k] = !a11y[k];
      applyA11y();
    });
    applyA11y();
  }

  /* ---------------- Ruta de navegación (migas de pan) ---------------- */
  var full = false; // true = el visitante pidió ver el panorama de cifras completo
  function activePage() { var p = D.querySelector('main .page.active'); return p ? p.id : 'libres'; }
  function siteOpen() { var m = /^#libres\/([\w-]+)/.exec(location.hash); return m ? m[1] : null; }
  function navLabel(id) { var b = [].filter.call(D.querySelectorAll('#navigation button'), function (x) { return (x.getAttribute('onclick') || '').indexOf("'" + id + "'") > -1; })[0]; return b ? b.textContent.trim() : null; }
  function siteName(id) { var s = W.LV11 && W.LV11.sites().filter(function (x) { return x.id === id; })[0]; return s ? (en() ? s.en : s.es) : id; }
  function crumbs() {
    var p = activePage(), sid = p === 'libres' ? siteOpen() : null, items = [[T('Inicio', 'Home'), 'home']];
    if (p === 'libres') { if (sid) items.push([T('Líneas temáticas', 'Thematic lines'), 'themes'], [siteName(sid)]); else if (full) items.push([T('Panorama de cifras', 'Data overview')]); }
    else if (p === 'micrositios') items.push([T('Líneas temáticas', 'Thematic lines')]);
    else { var sec = D.getElementById(p), h = sec && sec.querySelector('h1'); items.push([navLabel(p) || (h ? h.textContent.trim() : p)]); }
    return items;
  }
  function renderCrumb() {
    if (!CONSULTA) return;
    var nav = D.getElementById('navigation'), c = D.getElementById('lv23crumb');
    if (!c) { c = D.createElement('nav'); c.id = 'lv23crumb'; c.setAttribute('aria-label', T('Ruta de navegación', 'Breadcrumb')); c.setAttribute('data-no-translate', ''); var main = D.querySelector('main'); main.parentNode.insertBefore(c, main); }
    var it = crumbs(), home = it.length === 1;
    c.hidden = home;
    c.innerHTML = '<ol>' + it.map(function (x, i) { var last = i === it.length - 1; return '<li' + (last ? ' aria-current="page"' : '') + '>' + (last ? '<span>' + E(x[0]) + '</span>' : '<a href="#" data-cr="' + x[1] + '">' + E(x[0]) + '</a>') + '</li>'; }).join('') + '</ol>';
    if (nav) { var b0 = nav.querySelector('button'); if (b0 && /Panorama|Overview/i.test(b0.textContent)) b0.lastChild.nodeType === 3 ? (b0.lastChild.textContent = T('Inicio', 'Home')) : (b0.textContent = T('Inicio', 'Home')); }
  }
  function goHome() { full = false; if (siteOpen() && W.LV11) W.LV11.openSite(null); else if (typeof W.go === 'function') W.go('libres'); update(); scrollTo({ top: 0, behavior: 'smooth' }); }
  function goThemes(g) { if (g) { curGroup = g; var s0 = D.getElementById('lv23home'); if (s0) s0.dataset.lang = ''; } goHome(); setTimeout(function () { var t = D.getElementById('lv23themes'); if (t) scrollTo({ top: t.getBoundingClientRect().top + scrollY - 150, behavior: 'smooth' }); }, 120); }

  /* ---------------- Página de inicio ---------------- */
  var SUB = [
    ['indicadores', 'Indicadores', 'Indicators', 'Fichas con fórmula, fuente y periodicidad de cada indicador.', 'Each indicator with formula, source and frequency.', '#8E36CF'],
    ['mapa', 'Indicadores en el mapa', 'Indicators on the map', 'Departamento, municipio y zona urbana o rural.', 'Department, municipality and urban or rural area.', '#17A58C'],
    ['publicaciones', 'Datos y análisis', 'Data and analysis', 'Consultas desagregadas, gráficas y descargas.', 'Disaggregated queries, charts and downloads.', '#1A82B9'],
    ['normativa', 'Normativa y derechos', 'Laws and rights', 'Leyes, sentencias y políticas que protegen a las mujeres.', 'Laws, rulings and policies that protect women.', '#9E2C5A'],
    ['rutas', 'Rutas de atención', 'Support pathways', 'Dónde pedir ayuda y qué pasa en cada paso.', 'Where to get help and what happens at each step.', '#E0315B'],
    ['red', 'Observatorios', 'Observatories', 'Red nacional de observatorios y fuentes.', 'National network of observatories and sources.', '#5B5BD6'],
    ['conocimiento', 'Conocimiento', 'Knowledge', 'Documentos, glosario y aprendizajes.', 'Documents, glossary and learning.', '#22A37A'],
    ['asistente', 'Consulta metodológica', 'Methodology', 'Cómo se procesan los datos y preguntas frecuentes.', 'How data is processed and FAQs.', '#E0A800']
  ];
  var ROUTE = [
    ['indicadores', 'Consulta las cifras', 'Check the figures', 'Indicadores por tema, año y sexo', 'Indicators by theme, year and sex'],
    ['mapa', 'Ubica tu territorio', 'Find your territory', 'Departamento, municipio, urbano o rural', 'Department, municipality, urban or rural'],
    ['publicaciones', 'Analiza y descarga', 'Analyse and download', 'Cruces, gráficas y tablas abiertas', 'Cross-tabs, charts and open tables'],
    ['normativa', 'Conoce tus derechos', 'Know your rights', 'Normas y políticas vigentes', 'Laws and policies in force'],
    ['rutas', 'Encuentra atención', 'Find support', 'Líneas, entidades y pasos a seguir', 'Hotlines, agencies and next steps']
  ];
  var LIBRES = [['19573', 'Puerto Tejada', 'Cauca'], ['19780', 'Suárez', 'Cauca'], ['19212', 'Corinto', 'Cauca'], ['19110', 'Buenos Aires', 'Cauca'], ['76275', 'Florida', 'Valle del Cauca'], ['76563', 'Pradera', 'Valle del Cauca'], ['76364', 'Jamundí', 'Valle del Cauca']];
  function X(k, d) { return W.LV11 && W.LV11.txt ? W.LV11.txt(k, d) : d; }
  var ARR = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  function kpis() {
    var t = (W.LV23_TERR || {}).tot || {}, nS = W.LV11 ? W.LV11.sites().length : 16;
    return [
      [t.PAR ? N(t.PAR) : '—', T('lesiones por violencia de pareja contra mujeres', 'intimate partner violence injuries to women'), T('Medicina Legal · 2025 preliminar', 'Forensic institute · 2025 preliminary'), 'mapa', '#D33B78'],
      [t.SEX ? N(t.SEX) : '—', T('exámenes por presunto delito sexual a mujeres', 'forensic exams for alleged sexual offences against women'), T('Medicina Legal · 2025 preliminar', 'Forensic institute · 2025 preliminary'), 'mapa', '#8E36CF'],
      ['1.122', T('municipios con datos por zona urbana y rural', 'municipalities with urban and rural data'), T('MGN DANE · 7 territorios ¡LIBRES!', 'DANE geoframe · 7 ¡LIBRES! territories'), 'mapa', '#17A58C'],
      [String(nS), T('líneas temáticas con sus indicadores', 'thematic lines with their indicators'), T('8 derechos · 37 normas · 32 observatorios', '8 rights · 37 laws · 32 observatories'), 'themes', '#1A82B9']
    ];
  }
  // grupos de micrositios: líneas temáticas, comités, redes y rutas de atención
  var GROUPS = [
    ['lineas', 'Líneas temáticas', 'Thematic lines', ['violencias', 'lgbtiq', 'autonomia', 'participacion', 'educacion', 'salud-dsr', 'cuidados', 'demografia', 'etnico', 'pan-1325']],
    ['comites', 'Comités', 'Committees', ['comite-1257', 'comite-1719', 'comites-tecnico-juridicos']],
    ['redes', 'Redes', 'Networks', ['casas-refugio', 'red-observatorios']],
    ['rutas', 'Rutas de atención', 'Support pathways', ['rutas']]
  ];
  W.LV23_GROUPS = GROUPS;
  function groupOf(id) { for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i][3].indexOf(id) > -1) return GROUPS[i]; return GROUPS[0]; }
  W.LV23_GROUPOF = groupOf;
  W.LV41_THEMES = function (g) { goThemes(g); };
  var curGroup = 'lineas';
  var GDESC = { lineas: ['Violencias, trabajo, cuidados, salud, educación y más', 'Violence, work, care, health, education and more'], comites: ['Seguimiento a las leyes que protegen a las mujeres', 'Monitoring the laws that protect women'], redes: ['Casas refugio y red de observatorios', 'Shelters and the observatory network'], rutas: ['Dónde pedir ayuda y qué pasa en cada paso', 'Where to get help and what happens next'] };
  var GCOL = { lineas: '#8E36CF', comites: '#9E2C5A', redes: '#1A82B9', rutas: '#D33B78' }, GICO = { lineas: 'spark', comites: 'scale', redes: 'network', rutas: 'route' };
  function themesHTML() {
    var sites = W.LV11 ? W.LV11.sites() : [], ic = W.LV11 && W.LV11.icon, by = {}; sites.forEach(function (s) { by[s.id] = s; });
    var known = {}; GROUPS.forEach(function (g) { g[3].forEach(function (id) { known[id] = 1; }); });
    sites.forEach(function (s) { if (!known[s.id]) GROUPS[0][3].push(s.id); });
    var g = GROUPS.filter(function (x) { return x[0] === curGroup; })[0] || GROUPS[0];
    // v43 · selector en píldoras + tarjetas limpias con cifras y estado de cada tema
    var cnt = function (id) { return W.LV11 && W.LV11.counts ? W.LV11.counts(id) || {} : {}; };
    var ids = g[3].filter(function (id) { return by[id]; }).sort(function (a, b) { return (cnt(b).data ? 1 : 0) - (cnt(a).data ? 1 : 0); });
    return '<div class="x43seg" role="tablist" aria-label="' + T('Elige el grupo', 'Choose the group') + '">' + GROUPS.map(function (x) { var n = x[3].filter(function (id) { return by[id]; }).length, on = x[0] === g[0]; return '<button type="button" role="tab" data-grp="' + x[0] + '" aria-selected="' + on + '"' + (on ? ' class="on"' : '') + '>' + (ic ? ic(GICO[x[0]], 18) : '') + '<span>' + T(x[1], x[2]) + '</span><i>' + n + '</i></button>'; }).join('') + '</div>' +
      '<p class="x43desc">' + T(GDESC[g[0]][0], GDESC[g[0]][1]) + '</p>' +
      '<div class="x43grid" role="tabpanel">' + ids.map(function (id, i) { var s = by[id], k = cnt(id), dat = !!k.data; return '<button type="button" data-site="' + s.id + '" class="' + (dat ? 'dat' : 'prep') + '" style="--d:' + (i * 35) + 'ms"><span class="ic">' + (ic ? ic(s.ico, 24) : '') + '</span><b>' + E(en() ? s.en : s.es) + '</b>' +
        '<span class="mt">' + (k.ind ? '<span><em>' + k.ind + '</em> ' + (k.ind === 1 ? T('indicador', 'indicator') : T('indicadores', 'indicators')) + '</span>' : '') + (k.norms ? '<span><em>' + k.norms + '</em> ' + (k.norms === 1 ? T('norma', 'law') : T('normas', 'laws')) + '</span>' : '') + '</span>' +
        '<span class="ft"><i class="st">' + (dat ? T('Con datos', 'With data') : T('En preparación', 'In preparation')) + '</i><i class="go">' + ARR + '</i></span></button>'; }).join('') + '</div>';
  }
  /* v41 · inicio organizado según el diseño base: portada morada, proyecto, qué encontrarás, cómo navegar y temas */
  var I41 = {
    grid: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
    chart: '<path d="M5 20V12M10 20V7M15 20v-5M20 20H3"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    scale: '<path d="M12 4v16M7 20h10M5 8h14M5 8l-2.5 6a2.5 2.5 0 0 0 5 0zM19 8l-2.5 6a2.5 2.5 0 0 0 5 0zM12 4l-7 4M12 4l7 4"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    heat: '<rect x="3" y="3" width="5" height="5" rx="1"/><rect x="9.5" y="3" width="5" height="5" rx="1" fill="currentColor" opacity=".35"/><rect x="16" y="3" width="5" height="5" rx="1" fill="currentColor"/><rect x="3" y="9.5" width="5" height="5" rx="1" fill="currentColor" opacity=".35"/><rect x="9.5" y="9.5" width="5" height="5" rx="1" fill="currentColor"/><rect x="16" y="9.5" width="5" height="5" rx="1"/><rect x="3" y="16" width="5" height="5" rx="1" fill="currentColor"/><rect x="9.5" y="16" width="5" height="5" rx="1"/><rect x="16" y="16" width="5" height="5" rx="1" fill="currentColor" opacity=".35"/>',
    gavel: '<path d="M14 4l6 6M11.5 6.5l6 6M13 5l-6 6 6 6 6-6zM9.5 13.5L3 20"/>',
    nav: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'
  };
  function i41(k, sz) { return '<svg viewBox="0 0 24 24" width="' + (sz || 24) + '" height="' + (sz || 24) + '" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I41[k] + '</svg>'; }
  W.LV41_ICON = i41;
  var STEPS = [
    ['grid', 'themes', 'Elige el tema de tu interés', 'Choose your topic', 'Ejes temáticos: violencias, trabajo, cuidados, salud, educación y más.', 'Topics: violence, work, care, health, education and more.', 'Elegir mi tema', 'Choose my topic'],
    ['chart', 'indicadores', 'Consulta las cifras', 'Check the figures', '39 indicadores con fuente, fórmula y periodicidad, explicados en lenguaje sencillo.', '39 indicators with source, formula and frequency, in plain language.', 'Ver indicadores', 'See indicators'],
    ['pin', 'mapa', 'Ubica tu territorio', 'Find your territory', 'Departamento, municipio y zona urbana o rural en el mapa.', 'Department, municipality and urban or rural area on the map.', 'Abrir el mapa', 'Open the map'],
    ['down', 'publicaciones', 'Analiza y descarga', 'Analyse and download', 'Tablas, mapas de calor y gráficas que puedes ordenar y descargar.', 'Tables, heat maps and charts you can sort and download.', 'Ir a datos y análisis', 'Go to data and analysis'],
    ['scale', 'normativa', 'Conoce tus derechos', 'Know your rights', 'Leyes, sentencias y políticas que protegen a las mujeres.', 'Laws, rulings and policies that protect women.', 'Ver normativa', 'See laws'],
    ['heart', 'rutas', 'Encuentra atención', 'Find support', 'Dónde pedir ayuda en tu municipio y qué pasa en cada paso.', 'Where to get help in your municipality and what happens next.', 'Ver rutas de atención', 'See support pathways']
  ], curStep = 0;
  function stepPanel() { var s = STEPS[curStep]; return '<div class="x41sp" role="tabpanel" id="x41sp" aria-live="polite"><div><b>' + T(s[2], s[3]) + '</b><p>' + T(s[4], s[5]) + '</p></div><button type="button" data-go="' + s[1] + '">' + T(s[6], s[7]) + ' ' + ARR + '</button></div>'; }
  function stepsHTML() {
    return '<ol class="x41steps" role="tablist" aria-label="' + T('Pasos para navegar', 'Steps to browse') + '">' + STEPS.map(function (s, i) { var on = i === curStep; return '<li><button type="button" role="tab" data-step="' + i + '" aria-selected="' + on + '" aria-controls="x41sp"' + (on ? ' class="on"' : '') + '><span class="c">' + i41(s[0], 26) + '<i>' + (i + 1) + '</i></span><b>' + T(s[2], s[3]) + '</b></button></li>'; }).join('') + '</ol>' + stepPanel();
  }
  function homeHTML() {
    var L = W.LV12_LOGOS || {}, np = W.LV11 && W.LV11.published ? W.LV11.published() : 39;
    // 1. portada morada: nombre del observatorio, buscador, accesos y cifras
    var h = '<div class="x41hero"><span class="glow" aria-hidden="true"></span><div class="in">' +
      '<h1>' + T('Observatorio<br>de Mujeres <em>en todas sus diversidades</em>', 'Observatory<br>of Women <em>in all their diversity</em>') + '</h1>' +
      '<p class="xsub2">' + X('inicio.sub', T('Mujeres, territorios y realidades', 'Women, territories and realities')) + '</p>' +
      '<form class="xsx" role="search"><label class="sr" for="lv23q">' + T('Buscar en el observatorio', 'Search the observatory') + '</label><input id="lv23q" type="search" autocomplete="off" placeholder="' + T('Buscar en el observatorio', 'Search the observatory') + '"><button type="submit">' + T('Buscar', 'Search') + '</button></form>' +
      '<div class="xcta"><button type="button" data-go="mapa">' + T('Explorar el mapa', 'Explore the map') + '</button><button type="button" data-go="indicadores">' + T('Ver indicadores', 'See indicators') + '</button></div>' +
      '<div class="x41k" role="group" aria-label="' + T('El observatorio en cifras', 'The observatory in figures') + '">' +
      [[X('inicio.k1', String(np)), X('inicio.k1l', T('indicadores en el observatorio', 'indicators in the observatory')), 'indicadores', ''], [X('inicio.k2', '6'), X('inicio.k2l', T('datos interseccionales: edad, etnia, discapacidad, orientación sexual, agresor y zona', 'intersectional data: age, ethnicity, disability, sexual orientation, aggressor and area')), 'indicadores', 'quien'], [X('inicio.k3', '1.122'), X('inicio.k3l', T('datos territorializados: municipios con zona urbana y rural', 'territorial data: municipalities with urban and rural areas')), 'mapa', '']].map(function (x) { return '<button type="button" data-go="' + x[2] + '"' + (x[3] ? ' data-vt="' + x[3] + '"' : '') + '><b>' + x[0] + '</b><span>' + x[1] + '</span></button>'; }).join('') + '</div></div>' +
      '<svg class="wave" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true"><path d="M0 92C180 40 330 40 520 84s360 70 560 26 300-60 360-48" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/><path d="M0 128c200-40 380-46 600-12s420 40 600 0 200-34 240-30" fill="none" stroke="rgba(114,219,221,.45)" stroke-width="2"/></svg></div>';
    // 2. proyecto de cooperación
    var coopH = '<section class="x41coop" aria-labelledby="x41cp"><div class="lg">' + (L.libres ? '<img src="' + L.libres + '" alt="¡LIBRES!">' : '') + '</div><div class="tx"><span class="chip">' + T('Proyecto de cooperación', 'Cooperation project') + '</span>' +
      '<h2 id="x41cp">' + T('Observatorio de Mujeres<br>en todas sus diversidades', 'Observatory of Women<br>in all their diversity') + '</h2>' +
      '<p>El Observatorio Colombiano de Mujeres en todas sus diversidades hace parte del proyecto ¡LIBRES! financiado por la Delegación de La Unión Europea en Colombia y la Agencia Española de Cooperación Internacional para el Desarrollo (AECID), la ejecución del Gobierno de Colombia y Expertise France y el apoyo técnico de la Cooperación Alemana para el Desarrollo GIZ.</p>' +
      '<p>El Proyecto ¡LIBRES! tiene el objetivo de fortalecer la prevención de violencias basadas en género, protección y atención de las niñas, mujeres y personas LGBTIQ+, en siete municipios priorizados: Buenos Aires, Corinto, Puerto Tejada y Suárez en el departamento del Cauca; y Florida, Jamundí y Pradera en el departamento de Valle del Cauca.</p>' + '</div></section>';
    // 3. lo que encontrarás aquí
    var F = [['chart', 'indicadores', 'Indicadores', 'Indicators', 'con fuente, fórmula y periodicidad', 'with source, formula and frequency'], ['pin', 'mapa', 'Mapas', 'Maps', 'por departamento, municipio y zona', 'by department, municipality and area'], ['heat', 'publicaciones', 'Mapas de calor', 'Heat maps', 'cruces y tablas para analizar y descargar', 'cross-tabs and tables to analyse and download'], ['scale', 'normativa', 'Normas y derechos', 'Laws and rights', 'leyes y políticas vigentes', 'laws and policies in force'], ['gavel', 'sentencias', 'Sentencias', 'Court rulings', 'lo que ha decidido la Corte Constitucional', 'what the Constitutional Court has decided'], ['nav', 'rutas', 'Rutas de atención', 'Support pathways', 'con geoposicionamiento por municipio', 'geolocated by municipality']];
    h += '<section class="x41find" aria-labelledby="x41fd"><div class="hd"><h2 id="x41fd">' + T('Lo que encontrarás aquí', 'What you will find here') + '</h2><p>' + T('Cifras, análisis, normas y rutas de atención sobre las violencias y los derechos de las mujeres en todas sus diversidades, con una mirada puesta en el territorio.', 'Figures, analysis, laws and support pathways on violence and the rights of women in all their diversity, with a territorial focus.') + '</p></div>' +
      '<div class="g">' + F.map(function (f) { return '<button type="button" data-go="' + f[1] + '"><span class="ic">' + i41(f[0], 22) + '</span><span class="t"><b>' + T(f[2], f[3]) + '</b><small>' + T(f[4], f[5]) + '</small></span><i>' + ARR + '</i></button>'; }).join('') + '</div></section>';
    // 4. cómo navegar: seis pasos con panel
    h += '<section class="x41nav" aria-labelledby="x41nv"><h2 id="x41nv">' + T('Cómo navegar en el observatorio', 'How to browse the observatory') + '</h2><p class="lead">' + T('Seis pasos para llegar a lo que buscas. Toca un círculo.', 'Six steps to find what you need. Tap a circle.') + '</p><div id="x41st">' + stepsHTML() + '</div></section>';
    // 5. temas divididos en cuatro grupos
    h += '<section class="x43themes" id="lv23themes" aria-labelledby="lv23th"><h2 id="lv23th">' + T('Elige el tema de tu interés', 'Choose your topic') + '</h2><div id="lv23tw">' + themesHTML() + '</div></section>';
    h += (typeof coopH === 'string' ? coopH : '');
    return h;
  }
  function mountHome() {
    var lib = D.getElementById('libres'); if (!lib) return;
    var s = D.getElementById('lv23home'), lang = en() ? 'en' : 'es';
    if (s && s.dataset.lang === lang) return;
    if (!s) { s = D.createElement('section'); s.id = 'lv23home'; s.setAttribute('data-no-translate', ''); s.setAttribute('aria-label', T('Inicio', 'Home')); lib.insertBefore(s, lib.firstChild); wireHome(s); }
    s.dataset.lang = lang; s.innerHTML = homeHTML();
  }
  function search(q) {
    var f = D.querySelector('#lvHero form.lvSearchBox'), i = f && f.querySelector('input');
    full = true; update();
    if (i) { i.value = q; setTimeout(function () { if (f.requestSubmit) f.requestSubmit(); else f.dispatchEvent(new Event('submit', { cancelable: true })); setTimeout(update, 400); }, 30); }
  }
  function wireHome(s) {
    s.addEventListener('submit', function (e) { e.preventDefault(); var q = (s.querySelector('#lv23q') || {}).value; if (q && q.trim()) search(q.trim()); });
    s.addEventListener('click', function (e) {
      var sb = e.target.closest('[data-step]'); if (sb) { curStep = +sb.dataset.step; var st = D.getElementById('x41st'); if (st) { st.innerHTML = stepsHTML(); var nb2 = st.querySelector('[data-step="' + curStep + '"]'); if (nb2) nb2.focus(); } return; }
      var gb = e.target.closest('[data-grp]'); if (gb) { curGroup = gb.dataset.grp; var tw = D.getElementById('lv23tw'); if (tw) tw.innerHTML = themesHTML(); var nb = tw && tw.querySelector('[data-grp="' + curGroup + '"]'); if (nb) nb.focus(); return; }
      var b = e.target.closest('[data-go],[data-site],[data-mun],[data-q],[data-full]'); if (!b) return; e.preventDefault();
      if (b.dataset.q) return search(b.dataset.q);
      if (b.dataset.full) { full = true; update(); var t = D.getElementById('libresRoot'); setTimeout(function () { scrollTo({ top: (t ? t.getBoundingClientRect().top + scrollY - 140 : 0), behavior: 'smooth' }); }, 60); return; }
      if (b.dataset.site === 'casas-refugio') { W.go('casas'); scrollTo(0, 0); return; }
      if (b.dataset.site === 'red-observatorios') { W.go('red'); scrollTo(0, 0); return; }
      if (b.dataset.site) { full = false; W.LV11.openSite(b.dataset.site); return; }
      if (b.dataset.go === 'themes') return goThemes();
      if (b.dataset.mun) { W.go('mapa'); setTimeout(function () { var h = D.getElementById('lv20host'), r = h && h.shadowRoot, sel = r && r.querySelector('.mlist button[data-mun="' + b.dataset.mun + '"]'); if (W.LV21_PICKMUN) W.LV21_PICKMUN(b.dataset.mun); else if (sel) sel.click(); }, 700); return; }
      if (b.dataset.vt) W.LV30_TAB = b.dataset.vt;
      W.go(b.dataset.go);
    });
  }

  /* ---------------- Estado de la página ---------------- */
  /* ---------------- Subpáginas de línea temática: pestañas ---------------- */
  var TABS = [['res', 'Lo más importante', 'Key points'], ['exp', 'Busca más cifras', 'Find more figures'], ['fue', 'De dónde salen los datos', 'Where the data comes from'], ['mas', 'Normas, rutas y más', 'Laws, pathways and more']], curTab = 'res';
  function siteTabs() {
    var sid = activePage() === 'libres' ? siteOpen() : null; R.classList.toggle('lv23site', !!sid);
    if (!sid) { D.querySelectorAll('.l23off').forEach(function (el) { el.classList.remove('l23off'); }); var ob = D.getElementById('lv23tabs'); if (ob) ob.remove(); return; }
    var pano = D.querySelector('#libresRoot .lv11pano'), content = pano && pano.parentNode; if (!pano) return;
    if (!pano.querySelector('#lv13des') && W.LV13 && siteTabs.r13 !== sid) { siteTabs.r13 = sid; try { W.LV13.render(); } catch (e) {} }
    var hero = pano.querySelector('.lv11sitehero');
    if (hero && hero.dataset.lv23 !== sid) { hero.dataset.lv23 = sid; var old = hero.querySelector('.lv23ph'); if (old) old.remove(); hero.insertAdjacentHTML('beforeend', photo('linea-' + sid, 'xsite')); }
    var t = 'res';
    [].forEach.call(pano.children, function (el) {
      if (el.classList.contains('lv11sitehero') || el.id === 'lv23tabs' || el.id === 'lv23lay') { delete el.dataset.l23tab; delete el.dataset.l23lay; el.classList.remove('l23off', 'l23lhide'); return; }
      if (el.classList.contains('lv11grid2') || el.id === 'lv13des') t = 'fue';
      if (el.id === 'lv13des') { el.dataset.l23tab = 'fue'; return; }
      if (el.classList.contains('lv11exph')) t = 'exp';
      el.dataset.l23tab = t;
    });
    var after = false;
    [].forEach.call(content.children, function (el) { if (el === pano) { after = true; return; } if (el.id === 'lv42') { delete el.dataset.l23tab; el.classList.remove('l23off'); return; } if (!after) return; el.dataset.l23tab = el.classList.contains('lv11panob') ? 'mas' : 'exp'; });
    var bar = D.getElementById('lv23tabs');
    if (!bar) { bar = D.createElement('nav'); bar.id = 'lv23tabs'; bar.setAttribute('aria-label', T('Secciones de la línea', 'Line sections')); bar.setAttribute('data-no-translate', ''); bar.addEventListener('pointerdown', function (e) { if (e.button === 0) e.preventDefault(); }); bar.addEventListener('click', function (e) { var b = e.target.closest('[data-t]'); if (!b) return; curTab = b.dataset.t; siteTabs(); var top = bar.getBoundingClientRect().top + scrollY - 140; if (scrollY > top) scrollTo({ top: top, behavior: 'smooth' }); }); }
    if (hero && bar.previousElementSibling !== hero) hero.parentNode.insertBefore(bar, hero.nextSibling);
    var have = {}; D.querySelectorAll('#libresRoot [data-l23tab]').forEach(function (el) { have[el.dataset.l23tab] = 1; });
    if (!have[curTab]) curTab = 'res';
    var bh = TABS.filter(function (x) { return have[x[0]]; }).map(function (x) { return '<button type="button" data-t="' + x[0] + '"' + (x[0] === curTab ? ' class="on" aria-current="true"' : '') + '>' + T(x[1], x[2]) + '</button>'; }).join('');
    if (bar.dataset.sig !== bh) { bar.dataset.sig = bh; bar.innerHTML = bh; }
    var hd = D.querySelector('body > header'); if (hd) bar.style.top = (Math.round(hd.getBoundingClientRect().height) + 8) + 'px';
    var on = bar.querySelector('.on'); if (on && (on.offsetLeft < bar.scrollLeft || on.offsetLeft + on.offsetWidth > bar.scrollLeft + bar.clientWidth)) bar.scrollLeft = on.offsetLeft - 12;
    D.querySelectorAll('#libresRoot [data-l23tab]').forEach(function (el) { el.classList.toggle('l23off', el.dataset.l23tab !== curTab); });
    layers(pano, content);
  }
  /* v36 · cada pestaña se divide en capas: se ve una capa a la vez y una gráfica a la vez */
  var LAY = {
    res: [['cif', 'Las cifras clave', 'Key figures', 'Los números más importantes de esta línea, explicados en una frase.', 'The most important numbers, explained in one sentence.'], ['gra', 'Las gráficas', 'Charts', 'Elige una gráfica para verla en grande y cambiar su tipo.', 'Pick a chart to see it large and change its type.']],
    fue: [['pro', 'Qué datos hay', 'What data exists', 'Qué información se puede procesar y de qué fuentes viene.', 'Which information can be processed and its sources.'], ['des', 'Consulta por grupos', 'Query by groups', 'Cruza las cifras por edad, sexo, territorio y más.', 'Cross figures by age, sex, territory and more.']]
  }, curLay = {}, curViz = {};
  function layers(pano, content) {
    var list = LAY[curTab], box = D.getElementById('lv23lay');
    D.querySelectorAll('#libresRoot [data-l23lay]').forEach(function (el) { el.classList.remove('l23lhide'); });
    if (!list) { if (box) box.hidden = true; return; }
    var els = [].filter.call(D.querySelectorAll('#libresRoot [data-l23tab="' + curTab + '"]'), function (el) { return !el.classList.contains('l23off') && !el.classList.contains('l23next'); });
    els.forEach(function (el) {
      var k = curTab === 'res' ? (el.classList.contains('lv11kpis') ? 'cif' : 'gra') : (el.id === 'lv13des' ? 'des' : 'pro');
      el.dataset.l23lay = k;
    });
    var have = list.filter(function (l) { return els.some(function (el) { return el.dataset.l23lay === l[0]; }); });
    if (have.length < 2) { if (box) box.hidden = true; return; }
    var cur = curLay[curTab] && have.some(function (l) { return l[0] === curLay[curTab]; }) ? curLay[curTab] : have[0][0], idx = have.map(function (l) { return l[0]; }).indexOf(cur);
    if (!box) { box = D.createElement('div'); box.id = 'lv23lay'; box.setAttribute('data-no-translate', ''); box.addEventListener('click', function (e) { var b = e.target.closest('[data-lay]'); if (!b) return; curLay[curTab] = b.dataset.lay; siteTabs(); var bar = D.getElementById('lv23tabs'); if (bar) { var top = bar.getBoundingClientRect().top + scrollY - 140; if (scrollY > top) scrollTo({ top: top, behavior: 'smooth' }); } }); }
    var bar = D.getElementById('lv23tabs'); if (bar && box.previousElementSibling !== bar) bar.parentNode.insertBefore(box, bar.nextSibling);
    box.hidden = false;
    var h = '<div class="ly">' + have.map(function (l, i) { return '<button type="button" data-lay="' + l[0] + '"' + (l[0] === cur ? ' class="on" aria-current="step"' : '') + '><span class="n">' + (i + 1) + '</span><span class="tx"><b>' + T(l[1], l[2]) + '</b><small>' + T(l[3], l[4]) + '</small></span></button>'; }).join('<i class="sep" aria-hidden="true"></i>') + '</div>';
    if (box.dataset.sig !== h) { box.dataset.sig = h; box.innerHTML = h; }
    els.forEach(function (el) { el.classList.toggle('l23lhide', el.dataset.l23lay !== cur); });
    // botón «siguiente capa» al final de la capa visible
    D.querySelectorAll('.l23next').forEach(function (b) { b.remove(); });
    var vis = els.filter(function (el) { return el.dataset.l23lay === cur; }), last = vis[vis.length - 1];
    if (last && idx < have.length - 1) { var nb = D.createElement('button'); nb.type = 'button'; nb.className = 'l23next'; nb.dataset.l23tab = curTab; nb.innerHTML = '<span>' + T('Siguiente', 'Next') + '</span><b>' + T(have[idx + 1][1], have[idx + 1][2]) + ' →</b>'; nb.onclick = function () { curLay[curTab] = have[idx + 1][0]; siteTabs(); var bb = D.getElementById('lv23tabs'); if (bb) scrollTo({ top: bb.getBoundingClientRect().top + scrollY - 140, behavior: 'smooth' }); }; last.parentNode.insertBefore(nb, last.nextSibling); }
    // galería: una gráfica a la vez, con selector
    var gal = pano.querySelector('.lv11gallery');
    if (gal && cur === 'gra') {
      var vz = [].filter.call(gal.children, function (c) { return c.classList.contains('lv11viz'); }), sid = siteOpen();
      var sel = Math.min(curViz[sid] || 0, vz.length - 1);
      vz.forEach(function (c, i) { c.classList.toggle('l23vhide', i !== sel); c.classList.remove('l23more'); });
      var mb = gal.querySelector('.l23morebtn'); if (mb) mb.remove();
      var ch = gal.previousElementSibling && gal.previousElementSibling.classList.contains('l23vsel') ? gal.previousElementSibling : null;
      var hh = vz.map(function (c, i) { var t = c.querySelector('h3'), hd = c.querySelector('.lv11hero b'); return '<button type="button" data-v="' + i + '"' + (i === sel ? ' class="on"' : '') + '><b>' + (hd ? hd.textContent : '') + '</b><span>' + (t ? t.textContent : '') + '</span></button>'; }).join('');
      if (!ch) { ch = D.createElement('div'); ch.className = 'l23vsel'; ch.dataset.l23tab = 'res'; ch.dataset.l23lay = 'gra'; ch.addEventListener('click', function (e) { var b = e.target.closest('[data-v]'); if (!b) return; curViz[siteOpen()] = +b.dataset.v; siteTabs(); }); gal.parentNode.insertBefore(ch, gal); }
      if (ch.dataset.sig !== hh) { ch.dataset.sig = hh; ch.innerHTML = hh; }
      ch.classList.remove('l23off', 'l23lhide');
    }
  }
  // consulta metodológica: texto corto y solo 6 preguntas a la vista
  function cleanFaq() {
    var sec = D.getElementById('asistente'); if (!sec) return;
    var lead = sec.querySelector('.lv15legacyhead p.muted'); if (lead && !lead.dataset.l23) { lead.dataset.l23 = 1; lead.textContent = T('Respuestas cortas sobre cómo se producen y se leen las cifras.', 'Short answers on how figures are produced and read.'); }
    var list = sec.querySelector('.lv14flist'); if (!list) return;
    var q = [].filter.call(list.querySelectorAll('.lv14q'), function (x) { return !x.hidden && x.style.display !== 'none'; }), open = list.dataset.open, inp = sec.querySelector('.lv14fsearch input');
    var filtering = (inp && inp.value) || (sec.querySelector('.lv14fcats .on') && sec.querySelector('.lv14fcats button') !== sec.querySelector('.lv14fcats .on'));
    list.querySelectorAll('.lv14q').forEach(function (x) { x.classList.remove('l23hide'); });
    if (!open && !filtering) q.forEach(function (x, i) { if (i > 5) x.classList.add('l23hide'); });
    var b = sec.querySelector('.l23faqmore');
    if (!open && !filtering && q.length > 6) { if (!b) { b = D.createElement('button'); b.type = 'button'; b.className = 'l23faqmore'; b.onclick = function () { list.dataset.open = 1; cleanFaq(); }; list.parentNode.insertBefore(b, list.nextSibling); } b.textContent = T('Ver las ' + q.length + ' preguntas', 'See all ' + q.length + ' questions'); }
    else if (b) b.remove();
  }
  /* ---------------- Página «Sentencias» ---------------- */
  var senF = 'todas', senQ = '';
  /* v46 · Sentencias: línea de tiempo interactiva + filtros por tipo y derecho + ficha de la decisión */
  var senSel = null, senR = 'todos';
  var RIGHTS = { vida: ['Vida libre de violencias', 'Life free from violence'], justicia: ['Acceso a la justicia', 'Access to justice'], dsr: ['Derechos sexuales y reproductivos', 'Sexual and reproductive rights'], trabajo: ['Trabajo y autonomía', 'Work and autonomy'], paz: ['Paz y conflicto armado', 'Peace and armed conflict'], diversidad: ['Diversidad', 'Diversity'] };
  function rl(k) { return RIGHTS[k] ? T(RIGHTS[k][0], RIGHTS[k][1]) : k; }
  function code(n) { return n.n.replace(/^Sentencia /, '').replace(/ · .*$/, '').replace(/ de (\d{4})$/, ''); }
  function renderSentencias() {
    var sec = D.getElementById('sentencias'); if (!sec || !W.LV11 || !W.LV11.norms) return;
    var all = W.LV11.norms().filter(function (n) { return n.tipo === 'Sentencia' || n.tipo === 'Auto'; }).sort(function (a, b) { return a.y - b.y; });
    if (!all.length) return;
    var match = function (n) { return (senF === 'todas' || n.tipo === senF) && (senR === 'todos' || (n.rights || []).indexOf(senR) > -1) && (!senQ || (n.n + ' ' + n.d + ' ' + (n.rights || []).map(rl).join(' ')).toLowerCase().indexOf(senQ.toLowerCase()) > -1); };
    var list = all.filter(match); if (!senSel || !list.some(function (n) { return n.id === senSel; })) senSel = list.length ? list[list.length - 1].id : null;
    var sel = all.filter(function (n) { return n.id === senSel; })[0];
    var y0 = Math.min.apply(null, all.map(function (n) { return n.y; })) - 1, y1 = Math.max.apply(null, all.map(function (n) { return n.y; })) + 1, pos = function (y) { return ((y - y0) / (y1 - y0) * 100).toFixed(2) + '%'; };
    var rights = {}; all.forEach(function (n) { (n.rights || []).forEach(function (r) { rights[r] = (rights[r] || 0) + 1; }); });
    var nS = all.filter(function (n) { return n.tipo === 'Sentencia'; }).length, nA = all.length - nS;
    var sites = {}; (W.LV11.sites() || []).forEach(function (x) { sites[x.id] = x; });
    // marcas de año (cada 4 años) y puntos; los del mismo año se apilan
    var ticks = ''; for (var y = Math.ceil(y0 / 4) * 4; y <= y1; y += 4) ticks += '<span class="tk" style="left:' + pos(y) + '">' + y + '</span>';
    var stack = {}, dots = all.map(function (n) { var k = stack[n.y] = (stack[n.y] || 0) + 1, on = match(n); return '<button type="button" class="dt' + (n.id === senSel ? ' sel' : '') + (on ? '' : ' off') + (n.tipo === 'Auto' ? ' auto' : '') + '" data-sen="' + n.id + '" style="left:' + pos(n.y) + ';--k:' + (k - 1) + '" aria-pressed="' + (n.id === senSel) + '" aria-label="' + E(n.n) + '"><i></i><b>' + E(code(n)) + '</b></button>'; }).join('');
    var h = '<div class="s46">' +
      '<div class="s46hd"><span class="glow" aria-hidden="true"></span><span class="chip">' + T('Sentencias', 'Court rulings') + '</span><h1>' + X('sent.h1', T('Lo que han decidido los jueces', 'What the courts have decided')) + '</h1><p>' + X('sent.p', T('Decisiones de la Corte Constitucional que protegen los derechos de las mujeres en todas sus diversidades.', 'Constitutional Court decisions protecting the rights of women in all their diversity.')) + '</p>' +
      '<div class="kp"><span><b>' + nS + '</b> ' + T('sentencias', 'rulings') + '</span><span><b>' + nA + '</b> ' + (nA === 1 ? T('auto de seguimiento', 'follow-up order') : T('autos de seguimiento', 'follow-up orders')) + '</span><span><b>' + (y0 + 1) + '–' + (y1 - 1) + '</b> ' + T('años de decisiones', 'years of decisions') + '</span></div></div>' +
      '<div class="s46tl" role="group" aria-label="' + T('Línea de tiempo de las decisiones', 'Timeline of decisions') + '"><div class="ax"></div>' + ticks + dots + '</div>' +
      '<div class="s46f"><div class="seg">' + [['todas', 'Todas', 'All'], ['Sentencia', 'Sentencias', 'Rulings'], ['Auto', 'Autos', 'Orders']].map(function (x) { return '<button type="button" data-sf="' + x[0] + '"' + (senF === x[0] ? ' class="on"' : '') + '>' + T(x[1], x[2]) + '</button>'; }).join('') + '</div>' +
      '<div class="rg"><button type="button" data-sr="todos"' + (senR === 'todos' ? ' class="on"' : '') + '>' + T('Todos los derechos', 'All rights') + '</button>' + Object.keys(rights).map(function (r) { return '<button type="button" data-sr="' + r + '"' + (senR === r ? ' class="on"' : '') + '>' + E(rl(r)) + ' <small>' + rights[r] + '</small></button>'; }).join('') + '</div>' +
      '<label class="q"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="lv26sq" value="' + E(senQ) + '" placeholder="' + T('Buscar por número o tema…', 'Search by number or topic…') + '" aria-label="' + T('Buscar sentencia', 'Search ruling') + '"></label></div>' +
      '<div class="s46b"><ol class="ls">' + list.slice().reverse().map(function (n, i) { return '<li style="--i:' + i + '"><button type="button" data-sen="' + n.id + '"' + (n.id === senSel ? ' class="sel" aria-current="true"' : '') + '><span class="y">' + n.y + '</span><span class="tx"><em>' + (n.tipo === 'Auto' ? T('Auto de seguimiento', 'Follow-up order') : T('Sentencia', 'Ruling')) + '</em><b>' + E(code(n)) + '</b><small>' + E(en() ? (n.de || n.d) : n.d) + '</small></span><i>' + ARR + '</i></button></li>'; }).join('') + (list.length ? '' : '<li class="no">' + T('No hay decisiones con ese filtro.', 'No decisions match.') + '</li>') + '</ol>' +
      (sel ? '<div class="dt46" aria-live="polite"><div class="top"><span class="ty' + (sel.tipo === 'Auto' ? ' auto' : '') + '">' + (sel.tipo === 'Auto' ? T('Auto de seguimiento', 'Follow-up order') : T('Sentencia', 'Ruling')) + '</span><span class="yr">' + sel.y + '</span></div>' +
        '<h2>' + E(sel.n.replace(/ · .*$/, '')) + '</h2><p class="lab">' + T('¿Qué decidió?', 'What did it decide?') + '</p><p class="dec">' + E(en() ? (sel.de || sel.d) : sel.d) + '</p>' +
        ((sel.rights || []).length ? '<p class="lab">' + T('Derechos que protege', 'Rights it protects') + '</p><div class="rt">' + sel.rights.map(function (r) { return '<span>' + E(rl(r)) + '</span>'; }).join('') + '</div>' : '') +
        ((sel.sites || []).filter(function (x) { return sites[x]; }).length ? '<p class="lab">' + T('Temas del observatorio relacionados', 'Related observatory topics') + '</p><div class="st">' + sel.sites.filter(function (x) { return sites[x]; }).map(function (x) { return '<button type="button" data-ssite="' + x + '">' + E(en() ? sites[x].en : sites[x].es) + ' ' + ARR + '</button>'; }).join('') + '</div>' : '') +
        '<div class="ac">' + (sel.url ? '<a href="' + E(sel.url) + '" target="_blank" rel="noopener">' + T('Leer la decisión completa', 'Read the full decision') + ' ' + ARR + '</a>' : '') + '<button type="button" data-norm="' + sel.id + '">' + T('Ver ficha', 'See record') + '</button></div></div>' : '') + '</div></div>';
    sec.innerHTML = h;
  }
  /* v47 · Red Nacional de Casas Refugio (Ley 2215 de 2022). No se publican direcciones ni ubicaciones. */
  var casStep = 0;
  var CAS_ST = [
    ['Ingreso', 'Entry', 'La mujer pide una medida de protección o atención ante una Comisaría de Familia o un juzgado. La autoridad estudia el caso y decide si otorga la casa refugio. En casos de grave necesidad, la casa puede recibirla de forma temporal mientras se presenta ante la autoridad.', 'The woman requests a protection or support measure from a Family Commissioner or a court, which decides whether to grant the shelter. In urgent cases the shelter can take her in temporarily while she reports to the authority.'],
    ['Permanencia', 'Stay', 'Durante su estancia recibe alojamiento, alimentación y vestuario, junto con asesoría jurídica, acompañamiento psicosocial y orientación educativa u ocupacional, para ella, sus hijas e hijos y personas a cargo.', 'During her stay she receives housing, food and clothing, plus legal advice, psychosocial support and educational or job guidance, for her, her children and dependants.'],
    ['Egreso', 'Exit', 'La salida se prepara con un plan para retomar su vida con autonomía: empleo o emprendimiento, estudio y redes de apoyo.', 'Leaving is prepared with a plan to regain autonomy: employment or business, education and support networks.'],
    ['Seguimiento', 'Follow-up', 'Después de salir, el equipo hace seguimiento para confirmar que ella y su familia siguen seguras y con acceso a sus derechos.', 'After leaving, the team follows up to make sure she and her family remain safe and have access to their rights.']
  ];
  var CAS_SV = [['home', 'Alojamiento seguro y gratuito', 'Safe, free housing'], ['food', 'Alimentación y vestuario', 'Food and clothing'], ['law', 'Asesoría jurídica', 'Legal advice'], ['mind', 'Acompañamiento psicosocial', 'Psychosocial support'], ['book', 'Orientación educativa', 'Educational guidance'], ['work', 'Empleabilidad y emprendimiento', 'Employment and business']];
  var CAS_IC = { home: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>', food: '<path d="M7 3v8a2 2 0 0 0 4 0V3M9 11v10M16 3c-2 2-2 6 0 8v10"/>', law: '<path d="M12 4v16M7 20h10M5 8h14M5 8l-2.5 6a2.5 2.5 0 0 0 5 0zM19 8l-2.5 6a2.5 2.5 0 0 0 5 0z"/>', mind: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>', book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 5v16"/>', work: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>' };
  function cic(k) { return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + CAS_IC[k] + '</svg>'; }
  function casStepHTML() { return '<ol class="c47st" role="tablist">' + CAS_ST.map(function (x, i) { return '<li><button type="button" role="tab" data-cst="' + i + '" aria-selected="' + (i === casStep) + '"' + (i === casStep ? ' class="on"' : '') + '><i>' + (i + 1) + '</i><b>' + T(x[0], x[1]) + '</b></button></li>'; }).join('') + '</ol><div class="c47sp" role="tabpanel"><b>' + (casStep + 1) + '. ' + T(CAS_ST[casStep][0], CAS_ST[casStep][1]) + '</b><p>' + X('casas.e' + (casStep + 1), T(CAS_ST[casStep][2], CAS_ST[casStep][3])) + '</p></div>'; }
  function renderCasas() {
    var sec = D.getElementById('casas'); if (!sec || !W.LV11) return;
    var norms = (W.LV11.norms() || []).filter(function (n) { return n.pub !== false && (n.sites || []).indexOf('casas-refugio') > -1; }).sort(function (a, b) { return b.y - a.y; });
    sec.innerHTML = '<div class="c47">' +
      '<div class="c47hd"><span class="glow" aria-hidden="true"></span><span class="chip">' + T('Red Nacional', 'National Network') + '</span><h1>' + T('Red Nacional de Casas Refugio', 'National Shelter Network') + '</h1><p>' + X('casas.p', T('Lugares de acogida temporales, gratuitos y seguros para mujeres víctimas de violencia, sus hijas e hijos y personas a su cargo.', 'Temporary, free and safe shelters for women victims of violence, their children and dependants.')) + '</p>' +
      '<div class="kp"><span>' + T('Ley 2215 de 2022', 'Law 2215 of 2022') + '</span><span>' + T('Ley 1257 de 2008 · medidas de atención', 'Law 1257 of 2008 · support measures') + '</span><span class="pv">' + T('Por seguridad no se publican direcciones ni ubicaciones', 'For safety, addresses and locations are never published') + '</span></div></div>' +
      '<section class="c47b"><h2>' + T('¿Quiénes pueden llegar a una casa refugio?', 'Who can stay in a shelter?') + '</h2><div class="who">' +
      [['Mujeres víctimas de violencia', 'Women victims of violence', 'en todas sus formas, sin importar su condición personal, social o económica', 'in all its forms, regardless of personal, social or economic status'], ['Sus hijas e hijos', 'Their children', 'que la acompañan durante la medida', 'who stay with her during the measure'], ['Personas a su cargo', 'Her dependants', 'que dependen de ella y también están en riesgo', 'who depend on her and are also at risk'], ['Rutas especiales', 'Special pathways', 'para defensoras de derechos humanos, mujeres en reintegración y mujeres de comunidades étnicas', 'for human rights defenders, women in reintegration and women from ethnic communities']].map(function (x) { return '<div><b>' + T(x[0], x[1]) + '</b><small>' + T(x[2], x[3]) + '</small></div>'; }).join('') + '</div></section>' +
      '<section class="c47b"><h2>' + T('¿Cómo funciona?', 'How does it work?') + '</h2><p class="lead">' + T('El proceso tiene cuatro etapas. Toca cada una.', 'The process has four stages. Tap each one.') + '</p><div id="c47steps">' + casStepHTML() + '</div></section>' +
      '<section class="c47b"><h2>' + T('¿Qué ofrece una casa refugio?', 'What does a shelter offer?') + '</h2><div class="sv">' + CAS_SV.map(function (x) { return '<div><span>' + cic(x[0]) + '</span><b>' + T(x[1], x[2]) + '</b></div>'; }).join('') + '</div></section>' +
      '<section class="c47b c47help"><div><h2>' + T('¿Necesitas ayuda ahora?', 'Need help now?') + '</h2><p>' + T('Acude a la Comisaría de Familia de tu municipio o comunícate con estas líneas gratuitas:', 'Go to the Family Commissioner in your municipality or call these free lines:') + '</p><div class="ln"><a href="tel:155"><b>155</b><small>' + T('Orientación a mujeres', 'Guidance for women') + '</small></a><a href="tel:123"><b>123</b><small>' + T('Emergencias', 'Emergencies') + '</small></a><a href="tel:122"><b>122</b><small>' + T('Fiscalía', 'Attorney General') + '</small></a></div></div><button type="button" data-go="rutas">' + T('Ver rutas de atención de mi municipio', 'See support pathways in my municipality') + ' ' + ARR + '</button></section>' +
      (norms.length ? '<section class="c47b"><h2>' + T('Normas que la regulan', 'Laws that regulate it') + '</h2><div class="nl">' + norms.map(function (n) { return '<button type="button" data-norm="' + n.id + '"><span class="y">' + n.y + '</span><span class="tx"><em>' + E(n.tipo) + '</em><b>' + E(n.n.replace(/ · .*$/, '')) + '</b><small>' + E(en() ? (n.de || n.d) : n.d) + '</small></span><i>' + ARR + '</i></button>'; }).join('') + '</div></section>' : '') +
      '<p class="c47src">' + T('Fuente: Ley 2215 de 2022 y Ley 1257 de 2008. Información general; la medida la decide la autoridad competente en cada caso.', 'Source: Law 2215 of 2022 and Law 1257 of 2008. General information; the competent authority decides each case.') + '</p></div>';
  }
  function setupPages() {
    var main = D.querySelector('main'), nav = D.getElementById('navigation'); if (!main || !nav) return;
    if (!D.getElementById('sentencias')) {
      var s = D.createElement('section'); s.id = 'sentencias'; s.className = 'page'; s.setAttribute('data-no-translate', ''); main.appendChild(s);
      s.addEventListener('click', function (e) { var f = e.target.closest('[data-sf]'); if (f) { senF = f.dataset.sf; renderSentencias(); return; }
        var rr = e.target.closest('[data-sr]'); if (rr) { senR = rr.dataset.sr; renderSentencias(); return; }
        var sn = e.target.closest('[data-sen]'); if (sn) { senSel = sn.dataset.sen; renderSentencias(); var d = D.querySelector('#sentencias .dt46'); if (d && innerWidth < 900) d.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
        var ss = e.target.closest('[data-ssite]'); if (ss) { var id = ss.dataset.ssite; W.go('libres'); setTimeout(function () { W.LV11.openSite(id); }, 80); return; } var n = e.target.closest('[data-norm]'); if (n && W.LV11.openNorm) W.LV11.openNorm(n.dataset.norm); });
      s.addEventListener('input', function (e) { if (e.target.id === 'lv26sq') { senQ = e.target.value; clearTimeout(setupPages.t); setupPages.t = setTimeout(function () { renderSentencias(); var i = D.getElementById('lv26sq'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 250); } });
    }
    if (!D.getElementById('casas')) {
      var cs = D.createElement('section'); cs.id = 'casas'; cs.className = 'page'; cs.setAttribute('data-no-translate', ''); main.appendChild(cs);
      cs.addEventListener('click', function (e) { var b = e.target.closest('[data-cst]'); if (b) { casStep = +b.dataset.cst; var w = D.getElementById('c47steps'); if (w) { w.innerHTML = casStepHTML(); var f = w.querySelector('[data-cst="' + casStep + '"]'); if (f) f.focus(); } return; } var n = e.target.closest('[data-norm]'); if (n && W.LV11.openNorm) { W.LV11.openNorm(n.dataset.norm); return; } var g = e.target.closest('[data-go]'); if (g) W.go(g.dataset.go); });
    }
    if (!nav.querySelector('[data-page="casas"]')) {
      var cb = D.createElement('button'); cb.type = 'button'; cb.dataset.page = 'casas'; cb.setAttribute('onclick', "go('casas')"); cb.textContent = T('Red Nacional de Casas Refugio', 'National Shelter Network'); nav.appendChild(cb);
    }
    if (!nav.querySelector('[data-l26="sentencias"]')) {
      var nb = [].filter.call(nav.querySelectorAll('button'), function (b) { return (b.getAttribute('onclick') || '').indexOf("'normativa'") > -1; })[0];
      if (nb) { var c = nb.cloneNode(true); c.setAttribute('onclick', "go('sentencias')"); c.dataset.l26 = 'sentencias'; c.dataset.page = 'sentencias'; c.classList.remove('active'); var tn = [].filter.call(c.childNodes, function (x) { return x.nodeType === 3 && x.textContent.trim(); })[0]; if (tn) tn.textContent = T('Sentencias', 'Rulings'); else c.textContent = T('Sentencias', 'Rulings'); nb.parentNode.insertBefore(c, nb.nextSibling); }
    }
  }
  /* v41 · menú en una sola fila, como el diseño base: Inicio, Temas, Comités, Indicadores, Mapa, Datos y análisis, Normativa, Sentencias, Rutas de atención y «Más» */
  function nav41() {
    var nav = D.getElementById('navigation'); if (!nav) return;
    var lang = en() ? 'en' : 'es'; if (nav.dataset.v41 === lang && nav.querySelector('.nav41more')) return; nav.dataset.v41 = lang;
    var by = function (id) { return nav.querySelector('button[data-page="' + id + '"]'); };
    var LBL = { libres: ['Inicio', 'Home'], indicadores: ['Indicadores', 'Indicators'], mapa: ['Mapa', 'Map'], publicaciones: ['Datos y análisis', 'Data and analysis'], normativa: ['Normativa', 'Laws'], sentencias: ['Sentencias', 'Rulings'], rutas: ['Rutas de atención', 'Support pathways'], red: ['Red Nacional de Observatorios', 'National Observatory Network'], casas: ['Red Nacional de Casas Refugio', 'National Shelter Network'], asistente: ['Consulta metodológica', 'Methodology'], conocimiento: ['Conocimiento', 'Knowledge'] };
    Object.keys(LBL).forEach(function (k) { var b = by(k); if (b) b.textContent = T(LBL[k][0], LBL[k][1]); });
    // accesos a los grupos de temas del inicio
    [].forEach(function (x) {
      var b = nav.querySelector('[data-v41="' + x[0] + '"]');
      if (!b) { b = D.createElement('button'); b.type = 'button'; b.dataset.v41 = x[0]; b.addEventListener('click', function () { W.LV41_THEMES(x[1]); }); nav.appendChild(b); }
      b.textContent = T(x[2], x[3]);
    });
    var old41 = nav.querySelector('[data-v41="comites"]'); if (old41) old41.remove();
    var order = [by('libres'), by('indicadores'), by('mapa'), by('publicaciones'), by('normativa'), by('sentencias'), by('rutas')];
    order.forEach(function (b) { if (b) nav.appendChild(b); });
    var more = nav.querySelector('.nav41more');
    if (!more) {
      more = D.createElement('div'); more.className = 'nav41more';
      more.innerHTML = '<button type="button" class="mt" aria-expanded="false" aria-haspopup="true"></button><div class="menu" hidden></div>';
      more.querySelector('.mt').addEventListener('click', function (e) { e.stopPropagation(); var m = more.querySelector('.menu'), o = m.hidden; m.hidden = !o; this.setAttribute('aria-expanded', String(o)); });
      more.querySelector('.menu').addEventListener('click', function () { var m = more.querySelector('.menu'); m.hidden = true; more.querySelector('.mt').setAttribute('aria-expanded', 'false'); });
      D.addEventListener('click', function (e) { if (!more.contains(e.target)) { more.querySelector('.menu').hidden = true; more.querySelector('.mt').setAttribute('aria-expanded', 'false'); } });
    }
    more.querySelector('.mt').innerHTML = T('Redes y más', 'Networks & more') + ' <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
    var DESC = { casas: ['Qué son, quién puede acceder y cómo se activan', 'What they are, who can access them and how'], red: ['Observatorios y fuentes de datos del país', 'Observatories and data sources across the country'], asistente: ['Cómo se calculan y de dónde salen las cifras', 'How figures are calculated and where they come from'] };
    ['casas', 'red', 'asistente', 'conocimiento'].forEach(function (k) { var b = by(k); if (b) { b.dataset.desc = DESC[k] ? T(DESC[k][0], DESC[k][1]) : ''; b.dataset.k = k; b.setAttribute('role', 'menuitem'); more.querySelector('.menu').appendChild(b); } });
    more.querySelector('.menu').setAttribute('role', 'menu');
    if (!more.dataset.kb) { more.dataset.kb = 1; more.addEventListener('keydown', function (e) { var m = more.querySelector('.menu'), its = [].slice.call(m.querySelectorAll('button')).filter(function (x) { return x.offsetParent; }), i = its.indexOf(D.activeElement); if (e.key === 'Escape') { m.hidden = true; more.querySelector('.mt').setAttribute('aria-expanded', 'false'); more.querySelector('.mt').focus(); } else if (e.key === 'ArrowDown') { e.preventDefault(); if (m.hidden) more.querySelector('.mt').click(); (its[i + 1] || its[0]).focus(); } else if (e.key === 'ArrowUp' && i > -1) { e.preventDefault(); (its[i - 1] || its[its.length - 1]).focus(); } }); }
    nav.appendChild(more);
    // idioma: se lleva a la franja de logos
    var tabs = D.querySelector('body > header .actions .tabs'), top = D.querySelector('#lv23top .in');
    if (tabs && top && tabs.parentNode !== top) { tabs.classList.add('lang41'); top.appendChild(tabs); }
  }
  /* v46 · indicador aguamarina que se desliza bajo la sección activa (y sigue al mouse) */
  function navInd() {
    var nav = D.getElementById('navigation'); if (!nav) return;
    var ind = nav.querySelector('.nav46ind'); if (!ind) { ind = D.createElement('span'); ind.className = 'nav46ind'; ind.setAttribute('aria-hidden', 'true'); nav.appendChild(ind);
      nav.addEventListener('mouseover', function (e) { var b = e.target.closest('#navigation > button, #navigation .nav41more > .mt'); if (b) place(b); });
      nav.addEventListener('mouseleave', function () { place(); });
      addEventListener('resize', function () { place(); });
      if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { place(); }); }
    function cur() { return nav.querySelector(':scope > button.active') || (nav.querySelector('.nav41more.has-on') ? nav.querySelector('.nav41more > .mt') : null); }
    function place(b) { b = b || cur(); if (!b || !b.offsetWidth) { ind.style.opacity = 0; return; } ind.style.opacity = 1; ind.style.width = (b.offsetWidth - 20) + 'px'; ind.style.transform = 'translateX(' + (b.offsetLeft + 10) + 'px)'; }
    navInd.place = place; place();
  }
  function update() {
    if (!CONSULTA) return;
    setupPages(); nav41();
    (function () { var mo = D.querySelector('#navigation .nav41more'); if (mo) mo.classList.toggle('has-on', !!mo.querySelector('.menu button.active')); })();
    navInd();
    (function () { var nv = D.getElementById('navigation'); if (!nv) return; var sid = activePage() === 'libres' ? siteOpen() : null, g = sid ? groupOf(sid)[0] : null, ib = nv.querySelector('button[data-page="libres"]'); if (ib) ib.classList.toggle('v41hide', !!sid); nv.querySelectorAll('[data-v41]').forEach(function (b) { b.classList.toggle('v41on', !!g && ((b.dataset.v41 === 'temas' && g !== 'comites') || (b.dataset.v41 === 'comites' && g === 'comites'))); }); if (ib) { if (sid && g === 'comites') { ib.classList.remove('active'); ib.dataset.v41off = 1; } else { if (ib.dataset.v41off) delete ib.dataset.v41off; if (activePage() === 'libres') ib.classList.add('active'); } } })();
    if (activePage() === 'sentencias') renderSentencias();
    if (activePage() === 'casas') { var cs0 = D.getElementById('casas'); if (cs0 && cs0.dataset.lang !== (en() ? 'en' : 'es')) { cs0.dataset.lang = en() ? 'en' : 'es'; renderCasas(); } }
    if (activePage() === 'red') { var rh = D.querySelector('#red h1'), re = D.querySelector('#red .eyebrow'); if (re && re.textContent !== T('Red Nacional de Observatorios', 'National Observatory Network')) re.textContent = T('Red Nacional de Observatorios', 'National Observatory Network'); }
    if (activePage() === 'asistente') { cleanFaq(); setTimeout(cleanFaq, 400); }
    var home = activePage() === 'libres' && !siteOpen() && !full;
    R.classList.toggle('lv23home', home);
    if (home) mountHome();
    renderCrumb();
    if (siteOpen() && update.sid !== siteOpen()) curTab = 'res';
    update.sid = siteOpen();
    siteTabs(); setTimeout(siteTabs, 300); setTimeout(siteTabs, 900);
  }
  function hook() {
    if (typeof W.go === 'function' && !W.go.lv23) { var g = W.go; W.go = function (id) { if (id === 'libres' && !siteOpen()) {} var r = g.apply(this, arguments); setTimeout(update, 0); return r; }; W.go.lv23 = 1; }
    if (W.LV11 && !W.LV11.lv23) { var o = W.LV11.openSite; W.LV11.openSite = function (id) { var r = o.apply(this, arguments); setTimeout(update, 0); if (!id && !full) setTimeout(function () { scrollTo({ top: 0, behavior: 'smooth' }); }, 140); return r; }; W.LV11.lv23 = 1; }
  }
  function init() {
    var mInd = /^#ind\/([\w-]+)/.exec(W.LV44_HASH || ''); if (mInd) setTimeout(function () { if (W.go) W.go('indicadores'); setTimeout(function () { if (W.LV11 && W.LV11.openIndicator) W.LV11.openIndicator(decodeURIComponent(mInd[1])); }, 500); }, 400);
    if (W.LV44_HASH === '#casas') setTimeout(function () { if (W.go) W.go('casas'); }, 300);
    if (W.LV44_HASH === '#sentencias') setTimeout(function () { if (W.go) W.go('sentencias'); }, 300);
    topBar();
    if (!CONSULTA) return;
    hook(); update();
    // carrusel de indicadores destacados: avanza solo y se detiene al pasar el puntero
    setInterval(function () { if (R.classList.contains('lv23calm') || (W.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return; var t = D.querySelector('#indicadores.active .lv25track'); if (!t || t.matches(':hover') || t.contains(D.activeElement)) return; var end = t.scrollLeft + t.clientWidth >= t.scrollWidth - 8; t.scrollTo({ left: end ? 0 : t.scrollLeft + (t.firstElementChild ? t.firstElementChild.offsetWidth + 12 : 300), behavior: 'smooth' }); }, 4200);
    var rt = D.getElementById('libresRoot'), tt; if (rt) new MutationObserver(function () { if (!R.classList.contains('lv23site')) return; clearTimeout(tt); tt = setTimeout(siteTabs, 80); }).observe(rt, { childList: true, subtree: true });
    if (R.classList.contains('lv23home')) { [0, 250, 600].forEach(function (t) { setTimeout(function () { if (scrollY < 700) scrollTo(0, 0); }, t); }); }
    D.addEventListener('click', function (e) {
      var c = e.target.closest('#lv23crumb [data-cr]'); if (c) { e.preventDefault(); return c.dataset.cr === 'themes' ? goThemes() : goHome(); }
      var nb = e.target.closest('#navigation button'); if (nb && (nb.getAttribute('onclick') || '').indexOf("'libres'") > -1) { e.preventDefault(); setTimeout(goHome, 0); }
    }, true);
    addEventListener('hashchange', update);
    D.addEventListener('click', function (e) { if (e.target.closest('#asistente .lv14fcats button')) setTimeout(cleanFaq, 60); });
    D.addEventListener('input', function (e) { if (e.target.closest('#asistente .lv14fsearch')) setTimeout(cleanFaq, 60); });
    new MutationObserver(function () { var t = (D.querySelector('main .page.active') || {}).id; if (t !== update.last) { update.last = t; update(); } }).observe(D.querySelector('main'), { attributes: true, subtree: true, attributeFilter: ['class'] });
    // cambio de idioma
    new MutationObserver(function () { var l = en() ? 'en' : 'es'; if (l !== init.l) { init.l = l; var t = D.getElementById('lv23top'); if (t) { var tb = t.querySelector('.lang41'), hda = D.querySelector('body > header .actions'); if (tb && hda) hda.insertBefore(tb, hda.firstChild); t.remove(); topBar(); var nv = D.getElementById('navigation'); if (nv) nv.dataset.v41 = ''; } var s = D.getElementById('lv23home'); if (s) s.dataset.lang = ''; update(); } }).observe(R, { attributes: true, attributeFilter: ['lang'] });
    init.l = en() ? 'en' : 'es';
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { setTimeout(init, 350); }); else setTimeout(init, 350);
})();
