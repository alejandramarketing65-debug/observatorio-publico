/* ==========================================================================
   LIBRES v25 · Geovisor de rutas de atención por territorio
   Mapa municipal de Cauca y Valle del Cauca (MGN DANE 2018) con los 7
   territorios ¡LIBRES!. Al elegir un municipio y una situación, dibuja la
   ruta de atención como un recorrido numerado entre los tipos de entidad que
   la ley prevé en cada municipio (Policía, ESE/hospital, Comisaría de Familia,
   Fiscalía, Personería, ICBF) y muestra qué pasa en cada paso.
   Las posiciones en el mapa son ilustrativas: direcciones, horarios y sedes se
   validan con cada alcaldía antes de publicar. No se ubican casas refugio.
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window;
  function en() { try { if (typeof language === 'string') return language === 'en'; } catch (e) {} return (D.documentElement.lang || 'es').indexOf('en') === 0; }
  function T(es, e) { return en() ? e : es; }
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    var LIBRES = ['19573', '19780', '19212', '19110', '76275', '76563', '76364'];
  // tipos de entidad · ícono (trazo SVG) · color
  var ENT = {
    pol: { sec: 'proteccion', n: T('Policía · estación municipal', 'Police station'), s: 'Policía', ico: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z', c: '#1A82B9', tel: '123' },
    sal: { sec: 'salud', n: T('Hospital o ESE municipal', 'Local hospital'), s: 'Salud', ico: 'M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z', c: '#17A58C', tel: '' },
    com: { sec: 'proteccion', n: T('Comisaría de Familia', 'Family commissioner'), s: 'Comisaría', ico: 'M4 11l8-7 8 7v9H4zM10 20v-5h4v5', c: '#8E36CF', tel: '' },
    fis: { sec: 'justicia', n: T('Fiscalía · denuncia', 'Prosecutor · report'), s: 'Fiscalía', ico: 'M12 3v18M5 8h14M7 8l-3 7h6zM17 8l-3 7h6z', c: '#9E2C5A', tel: '122' },
    per: { sec: 'justicia', n: T('Personería Municipal', 'Municipal ombudsperson'), s: 'Personería', ico: 'M5 4h10l4 4v12H5zM9 12h6M9 16h6', c: '#E0A800', tel: '' },
    icb: { sec: 'proteccion', n: T('ICBF · centro zonal', 'Child welfare (ICBF)'), s: 'ICBF', ico: 'M8 7a2.5 2.5 0 1 0 0-.1M16 9a2 2 0 1 0 0-.1M4 20c0-4 2-7 4-7s4 3 4 7M12 20c0-3 2-5 4-5s4 2 4 5', c: '#EF6B4A', tel: '141' }
  };
  var SIT = [
    ['pareja', T('Violencia de pareja o familiar', 'Partner or family violence'), [['pol', T('Si hay peligro, llama al 123: la Policía puede intervenir de inmediato y trasladarte.', 'If in danger, call 123: police can act immediately.')], ['sal', T('Atención en urgencias y registro de lesiones. No necesitas denuncia previa.', 'Emergency care; no prior report needed.')], ['com', T('Medidas de protección: desalojo del agresor, prohibición de acercarse, acompañamiento.', 'Protection orders.')], ['fis', T('Denuncia penal. También en línea o en la estación de Policía, que la remite.', 'Criminal report, also online.')], ['per', T('Si una entidad no te atiende o te revictimiza, la Personería vigila y te acompaña.', 'If an agency fails you, the ombudsperson steps in.')]]],
    ['sexual', T('Violencia sexual', 'Sexual violence'), [['sal', T('Ve a urgencias lo antes posible, idealmente antes de 72 horas: anticoncepción de emergencia y profilaxis, gratis.', 'Go to emergency care within 72 hours: free emergency contraception and prophylaxis.')], ['fis', T('Denuncia y toma de pruebas con tu consentimiento. Puedes ir acompañada.', 'Report and evidence with your consent.')], ['com', T('Medidas de protección si el agresor es de tu entorno.', 'Protection orders if the aggressor is close to you.')], ['per', T('Acompañamiento para exigir tus derechos.', 'Support to claim your rights.')]]],
    ['nna', T('Niñas y adolescentes', 'Girls and adolescents'), [['icb', T('Línea 141 o centro zonal: restablecimiento de derechos.', 'Line 141: restoration of rights.')], ['com', T('La Comisaría actúa cuando la violencia ocurre en la familia.', 'Commissioner acts on family violence.')], ['sal', T('Atención en salud prioritaria y gratuita.', 'Priority free health care.')], ['fis', T('Denuncia: es obligatoria para quien conozca el caso.', 'Reporting is mandatory.')]]],
    ['conflicto', T('Conflicto armado', 'Armed conflict'), [['per', T('Declaración ante la Personería para ingresar al Registro Único de Víctimas.', 'Statement to enter the Victims Registry.')], ['sal', T('Atención en salud y apoyo psicosocial.', 'Health and psychosocial care.')], ['fis', T('Denuncia de los hechos.', 'Report the facts.')], ['pol', T('Protección si hay amenazas.', 'Protection if threatened.')]]]
  ];
  // v50 · sectores, entidades especializadas y enfoques diferenciales (bocetos de Rutas de atención)
  var SEC = [['todos', T('Todos', 'All')], ['salud', T('Salud', 'Health')], ['justicia', T('Justicia', 'Justice')], ['proteccion', T('Protección', 'Protection')]];
  var ESP = {
    pareja: [[T('Casa refugio', 'Shelter'), T('Si necesitas alojamiento seguro, la autoridad que da tus medidas de atención te remite (Ley 2215 de 2022).', 'If you need safe housing, the authority granting your measures refers you (Law 2215/2022).'), 'proteccion'], [T('CAVIF · Fiscalía', 'CAVIF · Prosecutor'), T('Centro de atención a víctimas de violencia intrafamiliar, donde existe.', 'Domestic violence victims centre, where available.'), 'justicia'], [T('Defensoría del Pueblo', 'Ombudsman'), T('Orientación jurídica y quejas si no te atienden. 01 8000 914 814.', 'Legal guidance and complaints. 01 8000 914 814.'), 'justicia']],
    sexual: [[T('CAIVAS · Fiscalía', 'CAIVAS · Prosecutor'), T('Centro de atención integral a víctimas de violencia sexual, donde existe.', 'Integrated sexual violence centre, where available.'), 'justicia'], [T('Medicina Legal', 'Forensic institute'), T('Examen médico-legal y toma de pruebas con tu consentimiento.', 'Forensic exam and evidence with your consent.'), 'justicia'], [T('IPS con protocolo de violencia sexual', 'Clinic with sexual violence protocol'), T('Atención integral en salud y salud mental, sin costo.', 'Comprehensive free health and mental health care.'), 'salud']],
    nna: [[T('Defensoría de Familia · ICBF', 'Family Defender · ICBF'), T('Restablecimiento de derechos de niñas y adolescentes. Línea 141.', 'Restoration of rights of girls. Line 141.'), 'proteccion'], [T('CAIVAS · Fiscalía', 'CAIVAS · Prosecutor'), T('Si hay violencia sexual contra una niña o adolescente.', 'If there is sexual violence against a girl.'), 'justicia']],
    conflicto: [[T('Unidad para las Víctimas', 'Victims Unit'), T('Registro, atención y reparación. 01 8000 911 119.', 'Registry, assistance and reparation. 01 8000 911 119.'), 'proteccion'], [T('Defensoría del Pueblo', 'Ombudsman'), T('Acompañamiento a víctimas del conflicto, incluida la violencia sexual.', 'Support for conflict victims, including sexual violence.'), 'justicia'], [T('Unidad Nacional de Protección', 'National Protection Unit'), T('Si eres lideresa o defensora y estás amenazada.', 'If you are a threatened leader or defender.'), 'proteccion']]
  };
  var ENF = [['', T('Sin enfoque específico', 'No specific approach'), ''],
    ['etnico', T('Mujer indígena, afro, raizal, palenquera o Rrom', 'Indigenous, Afro, Raizal, Palenquera or Rrom woman'), T('Puedes acudir también a tu autoridad propia (cabildo, consejo comunitario o kumpania). La ruta ordinaria debe atenderte con respeto a tu cultura y, si lo pides, con intérprete.', 'You may also go to your own authority (cabildo, community council or kumpania). The ordinary pathway must respect your culture and provide an interpreter if requested.')],
    ['lbt', T('Mujer lesbiana, bisexual o trans', 'Lesbian, bisexual or trans woman'), T('Tienes derecho a ser atendida sin discriminación y a que se respete tu nombre identitario. Si te revictimizan, informa a la Personería o la Defensoría.', 'You have the right to non-discriminatory care and to be called by your chosen name. Report revictimisation to the Personería or Ombudsman.')],
    ['disc', T('Mujer con discapacidad', 'Woman with disability'), T('Las entidades deben hacer ajustes razonables: acompañante de tu confianza, lengua de señas, información accesible y apoyos para decidir.', 'Agencies must make reasonable adjustments: trusted companion, sign language, accessible information and decision support.')],
    ['mig', T('Mujer migrante', 'Migrant woman'), T('Te deben atender en urgencias y en protección sin importar tu situación migratoria.', 'You must be attended in emergencies and protection regardless of your migration status.')],
    ['rural', T('Mujer rural o campesina', 'Rural woman'), T('Si no hay Comisaría cerca, el juez municipal o la inspección de policía pueden recibir tu caso. Pide que te informen el transporte para llegar.', 'If there is no commissioner nearby, the municipal judge or police inspection can take your case.')],
    ['mayor', T('Mujer mayor', 'Older woman'), T('Tienes atención prioritaria. Si la violencia viene de quien te cuida, la Comisaría puede ordenar medidas de protección.', 'You have priority care. If violence comes from a caregiver, the commissioner can issue protection orders.')]];
  var LINES = [['155', T('Orientación a mujeres', 'Women\'s helpline')], ['123', T('Emergencias', 'Emergencies')], ['122', T('Fiscalía', 'Prosecutor')], ['141', 'ICBF']];

  var DN = { '05': 'Antioquia', '08': 'Atlántico', '11': 'Bogotá D.C.', '13': 'Bolívar', '15': 'Boyacá', '17': 'Caldas', '18': 'Caquetá', '19': 'Cauca', '20': 'Cesar', '23': 'Córdoba', '25': 'Cundinamarca', '27': 'Chocó', '41': 'Huila', '44': 'La Guajira', '47': 'Magdalena', '50': 'Meta', '52': 'Nariño', '54': 'Norte de Santander', '63': 'Quindío', '66': 'Risaralda', '68': 'Santander', '70': 'Sucre', '73': 'Tolima', '76': 'Valle del Cauca', '81': 'Arauca', '85': 'Casanare', '86': 'Putumayo', '88': 'San Andrés y Providencia', '91': 'Amazonas', '94': 'Guainía', '95': 'Guaviare', '97': 'Vaupés', '99': 'Vichada' };
  var st = { dep: '11', mun: '11001', sit: 0, zoom: 'mun', sec: 'todos', enf: '' };
  var G = null, CEN = {}, BY = {};
  function geo() {
    if (G) return G; var TG = W.LV22_GEO; if (!TG) return null;
    G = TG.mun.map(function (m) { return { c: m[0], d: m[1], n: m[2], p: m[3] }; });
    G.forEach(function (m) {
      (BY[m.d] = BY[m.d] || []).push(m);
      var n = (m.p.match(/-?\d+(\.\d+)?/g) || []).map(Number), x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, sx = 0, sy = 0, k = 0;
      for (var i = 0; i + 1 < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]); sx += n[i]; sy += n[i + 1]; k++; }
      CEN[m.c] = [k ? sx / k : (x0 + x1) / 2, k ? sy / k : (y0 + y1) / 2, Math.max(x1 - x0, y1 - y0), x0, y0, x1, y1];
    });
    return G;
  }
  function icon(k, s) { return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + ENT[k].ico + '"/></svg>'; }
  function vb() { // encuadre del departamento elegido
    var X0 = 1e9, Y0 = 1e9, X1 = -1e9, Y1 = -1e9;
    (BY[st.dep] || []).forEach(function (m) { var c = CEN[m.c]; X0 = Math.min(X0, c[3]); Y0 = Math.min(Y0, c[4]); X1 = Math.max(X1, c[5]); Y1 = Math.max(Y1, c[6]); });
    var w = X1 - X0, h = Y1 - Y0, s = Math.max(w, h / .85) * 1.12 + .6, cx = (X0 + X1) / 2, cy = (Y0 + Y1) / 2;
    var c = CEN[st.mun];
    if (st.zoom !== 'dep' && c) { var s2 = Math.min(s, Math.max(c[2] * 4.2, s * .32)); return [c[0] - s2 / 2, c[1] - s2 * .85 / 2, s2, s2 * .85]; }
    return [cx - s / 2, cy - s * .85 / 2, s, s * .85];
  }
  function mname(c) { var m = G.filter(function (x) { return x.c === c; })[0]; return m ? m.n : c; }
  function routeSVG(v) {
    var c = CEN[st.mun]; if (!c) return '';
    var steps = SIT[st.sit][2], r = Math.max(c[2] * .5, v[2] * .045), pts = steps.map(function (s, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / steps.length; return [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]; });
    var sz = v[2] * .02, path = 'M' + pts.map(function (p) { return p[0].toFixed(3) + ' ' + p[1].toFixed(3); }).join(' L');
    return '<path class="rt" style="stroke-width:' + (v[2] * .004).toFixed(3) + ';stroke-dasharray:' + (v[2] * .012).toFixed(3) + ' ' + (v[2] * .008).toFixed(3) + '" d="' + path + '"/>' + pts.map(function (p, i) { var k = steps[i][0]; return '<g class="pin' + (st.sec !== 'todos' && ENT[k].sec !== st.sec ? ' dim' : '') + '" transform="translate(' + p[0].toFixed(3) + ' ' + p[1].toFixed(3) + ')" style="--c:' + ENT[k].c + ';animation-delay:' + (i * 120) + 'ms"><circle r="' + sz.toFixed(3) + '" style="stroke-width:' + (sz * .18).toFixed(3) + '"/><text y="' + (sz * .38).toFixed(3) + '" font-size="' + (sz * 1.05).toFixed(3) + '">' + (i + 1) + '</text></g>'; }).join('');
  }
  function render(root) {
    if (!geo()) { root.innerHTML = ''; return; }
    var v = vb(), s = SIT[st.sit], m = G.filter(function (x) { return x.c === st.mun; })[0], sw = (v[2] * .0016).toFixed(3);
    var ms = (BY[st.dep] || []).slice().sort(function (a, b) { return a.n.localeCompare(b.n); });
    var mapSvg = '<svg class="mp" viewBox="' + v.map(function (n) { return n.toFixed(3); }).join(' ') + '" role="img" aria-label="' + T('Municipios de ', 'Municipalities of ') + E(DN[st.dep]) + '" style="--sw:' + sw + '">' +
      (st.zoom !== 'dep' ? G.filter(function (x) { var c = CEN[x.c]; return c[5] > v[0] && c[3] < v[0] + v[2] && c[6] > v[1] && c[4] < v[1] + v[3]; }) : ms).map(function (x) { var lb = false; return '<path d="' + x.p + '" data-m="' + x.c + '" class="' + (x.c === st.mun ? 'on ' : '') + (lb ? 'lb ' : '') + (x.d !== st.dep ? 'out' : '') + '"><title>' + E(x.n) + (x.d !== st.dep ? ' · ' + E(DN[x.d] || '') : '') + '</title></path>'; }).join('') + routeSVG(v) + '</svg>';
    var TG = W.LV22_GEO, loc = '<svg class="loc" viewBox="20 10 380 470" role="group" aria-label="' + T('Elegir departamento', 'Choose department') + '">' + Object.keys(TG.dep).map(function (d) { return '<path d="' + TG.dep[d] + '" data-dep="' + d + '"' + (d === st.dep ? ' class="on"' : '') + '><title>' + E(DN[d] || d) + '</title></path>'; }).join('') + '</svg>';
    var SRCH = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
    var enfN = st.enf ? ENF.filter(function (x) { return x[0] === st.enf; })[0] : null;
    root.innerHTML = '<div class="g51hd"><span class="g24eye">' + T('Geovisor · todo el país', 'Map viewer · whole country') + '</span><h2>' + T('¿A dónde puedo acudir?', 'Where can I go?') + '</h2></div>' +
      '<div class="g51ctl"><div class="g51row r1"><span class="g51n">1</span><div class="g51c"><b>' + T('¿Dónde estás?', 'Where are you?') + '</b>' +
      '<form class="g50q" role="search"><div>' + SRCH + '<input id="g50qi" list="g50ml" autocomplete="off" aria-label="' + T('Busca tu municipio en todo el país', 'Search your municipality') + '" placeholder="' + T('Busca tu municipio… ej. Pasto, Leticia, Riohacha', 'Search your municipality… e.g. Pasto, Leticia') + '"><button type="submit">' + T('Buscar', 'Search') + '</button></div><datalist id="g50ml">' + G.map(function (x) { return '<option value="' + E(x.n + ', ' + (DN[x.d] || '')) + '">'; }).join('') + '</datalist><p class="g50qm" aria-live="polite"></p></form>' +
      '<div class="g24sel"><label><span>' + T('Departamento', 'Department') + '</span><select data-k="dep">' + Object.keys(DN).sort(function (a, b) { return DN[a].localeCompare(DN[b]); }).map(function (d) { return '<option value="' + d + '"' + (d === st.dep ? ' selected' : '') + '>' + E(DN[d]) + '</option>'; }).join('') + '</select></label>' +
      '<label><span>' + T('Municipio', 'Municipality') + '</span><select data-k="mun">' + ms.map(function (x) { return '<option value="' + x.c + '"' + (x.c === st.mun ? ' selected' : '') + '>' + E(x.n) + '</option>'; }).join('') + '</select></label></div></div></div>' +
      '<div class="g51row"><span class="g51n">2</span><div class="g51c"><b>' + T('¿Qué pasó?', 'What happened?') + '</b><div class="g24sit" role="group" aria-label="' + T('Situación', 'Situation') + '">' + SIT.map(function (x, i) { return '<button type="button" data-sit="' + i + '"' + (i === st.sit ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') + '>' + E(x[1]) + '</button>'; }).join('') + '</div></div></div>' +
      '<div class="g51row two"><div class="g51half"><span class="g51n">3</span><div class="g51c"><b>' + T('¿Quién eres? (opcional)', 'Who are you? (optional)') + '</b><label class="g50enf"><span class="sr">' + T('Enfoque diferencial', 'Differential approach') + '</span><select data-k="enf">' + ENF.map(function (x) { return '<option value="' + x[0] + '"' + (st.enf === x[0] ? ' selected' : '') + '>' + E(x[1]) + '</option>'; }).join('') + '</select></label></div></div>' +
      '<div class="g51half"><span class="g51n">4</span><div class="g51c"><b>' + T('¿Qué sector buscas?', 'Which sector?') + '</b><div class="g50sec" role="group" aria-label="' + T('Sector', 'Sector') + '">' + SEC.map(function (x) { return '<button type="button" data-sec="' + x[0] + '"' + (st.sec === x[0] ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') + '>' + E(x[1]) + '</button>'; }).join('') + '</div></div></div></div></div>' +
      '<div class="g24body"><div class="g24map"><div class="g24mtitle"><b>' + E(DN[st.dep]) + '</b><span>' + ms.length + ' ' + T('municipios', 'municipalities') + '</span><span class="g24zm" role="group"><button type="button" data-zoom="mun"' + (st.zoom !== 'dep' ? ' class="on"' : '') + '>' + T('Municipio', 'Municipality') + '</button><button type="button" data-zoom="dep"' + (st.zoom === 'dep' ? ' class="on"' : '') + '>' + T('Departamento', 'Department') + '</button></span></div>' + mapSvg + '<div class="g24loc">' + loc + '<small>' + T('Toca otro departamento', 'Tap another department') + '</small></div>' +
      '</div>' +
      '<div class="g24panel"><div class="g51res"><span>' + T('Tu ruta', 'Your pathway') + '</span><b>' + E(m ? m.n : '') + '</b><small>' + E(DN[st.dep]) + ' · ' + E(s[1]) + (enfN ? ' · ' + E(enfN[1]) : '') + '</small></div>' +
      (s[0] === 'sexual' ? '<div class="g50vsx" role="alert"><b>' + T('Alerta · violencia sexual', 'Alert · sexual violence') + '</b><span>' + ((W.LV11 && W.LV11.txt) ? W.LV11.txt('rutas.vsx', T('Es una urgencia médica. Ve a urgencias en las primeras 72 horas, aunque no hayas denunciado: hay anticoncepción de emergencia y profilaxis gratuitas.', 'It is a medical emergency. Go to the ER within 72 hours, even without reporting: free emergency contraception and prophylaxis.')) : T('Es una urgencia médica. Ve a urgencias en las primeras 72 horas, aunque no hayas denunciado: hay anticoncepción de emergencia y profilaxis gratuitas.', 'It is a medical emergency. Go to the ER within 72 hours, even without reporting: free emergency contraception and prophylaxis.')) + '</span></div>' : '') +
      (enfN ? '<p class="g50enfn"><b>' + T('Para ti', 'For you') + ':</b> ' + E(enfN[2]) + '</p>' : '') +
      '<ol class="g24steps">' +
      s[2].map(function (p, i) { var e = ENT[p[0]]; return '<li class="' + (st.sec !== 'todos' && e.sec !== st.sec ? 'dim' : '') + '" style="--c:' + e.c + ';animation-delay:' + (i * 90) + 'ms"><span class="n">' + (i + 1) + '</span><span class="ic">' + icon(p[0], 20) + '</span><div><b>' + E(e.n) + (e.tel ? ' <a href="tel:' + e.tel + '">' + e.tel + '</a>' : '') + '</b><small>' + E(p[1]) + '</small></div></li>'; }).join('') + '</ol>' +
      '<details class="g50esp"><summary>' + T('Entidades especializadas', 'Specialised agencies') + ' <small>' + (ESP[s[0]] || []).length + '</small></summary>' + (ESP[s[0]] || []).map(function (x) { return '<div class="' + (st.sec !== 'todos' && x[2] !== st.sec ? 'dim' : '') + '"><b>' + E(x[0]) + '</b><small>' + E(x[1]) + '</small></div>'; }).join('') + '</details>' +
      '<div class="g51act"><button type="button" class="g50say" data-say="1"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/></svg>' + T('Escuchar esta ruta', 'Listen to this pathway') + '</button></div>' +
      '<p class="g24note">' + T('Ubicaciones ilustrativas. Sedes y horarios se validan con cada alcaldía.', 'Illustrative locations. Offices and hours are validated with each municipality.') + '</p></div></div>';
  }
  function setDep(d) { st.dep = d; var ms = (BY[d] || []).slice().sort(function (a, b) { return (b.c.slice(2) === '001') - (a.c.slice(2) === '001'); }); if (ms[0]) st.mun = ms[0].c; }
  function mount() {
    var sec = D.getElementById('rutas'); if (!sec || !W.LV22_GEO) return;
    var box = sec.querySelector('.lv11content') || sec, head = box.querySelector('.lv11rhero, .lv11head'); if (!head) return;
    var g = D.getElementById('lv24geo');
    var host = D.getElementById('lv50geo');
    if (g && g.dataset.lang === (en() ? 'en' : 'es') && (host ? g.parentNode === host : g.previousElementSibling === head)) return;
    if (!g) {
      g = D.createElement('section'); g.id = 'lv24geo'; g.setAttribute('data-no-translate', '');
      g.addEventListener('click', function (e) {
        var z = e.target.closest('[data-zoom]'); if (z) { st.zoom = z.dataset.zoom; render(g); return; }
        var sc = e.target.closest('[data-sec]'); if (sc) { st.sec = sc.dataset.sec; render(g); return; }
        if (e.target.closest('[data-say]')) { say(); return; }
        var b = e.target.closest('[data-sit],[data-mun],path[data-m],path[data-dep]'); if (!b) return;
        if (b.dataset.sit != null) st.sit = +b.dataset.sit; else if (b.dataset.dep) setDep(b.dataset.dep); else { st.mun = b.dataset.mun || b.dataset.m; st.dep = st.mun.slice(0, 2); }
        render(g);
      });
      function find(q) { q = (q || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); if (!q) return null; var nm = function (x) { return (x.n + ', ' + (DN[x.d] || '')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }; return G.filter(function (x) { return nm(x) === q; })[0] || G.filter(function (x) { return nm(x).indexOf(q) === 0; })[0] || G.filter(function (x) { return nm(x).indexOf(q) > -1; })[0] || null; }
      function pick(v) { var m = find(v); if (!m) { var msg = g.querySelector('.g50qm'); if (msg) msg.textContent = T('No encontramos ese municipio. Revisa la escritura.', 'Municipality not found.'); return; } st.mun = m.c; st.dep = m.d; st.zoom = 'mun'; render(g); var i = g.querySelector('#g50qi'); if (i) { i.value = ''; } var pn = g.querySelector('.g24panel'); if (pn && innerWidth < 900) pn.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      g.addEventListener('submit', function (e) { e.preventDefault(); var i = g.querySelector('#g50qi'); pick(i && i.value); });
      g.addEventListener('input', function (e) { if (e.target.id === 'g50qi' && e.inputType === 'insertReplacementText' || (e.target.id === 'g50qi' && /, /.test(e.target.value) && find(e.target.value) && G.some(function (x) { return (x.n + ', ' + (DN[x.d] || '')) === e.target.value; }))) pick(e.target.value); });
      g.addEventListener('change', function (e) { var k = e.target.dataset.k; if (k === 'enf') st.enf = e.target.value; else if (k === 'mun') st.mun = e.target.value; else if (k === 'dep') setDep(e.target.value); else return; render(g); });
    }
    if (host) host.appendChild(g); else head.parentNode.insertBefore(g, head.nextSibling); g.dataset.lang = en() ? 'en' : 'es';
    render(g);
  }
  function say() { if (!W.speechSynthesis) return; var s0 = SIT[st.sit], txt = s0[1] + '. ' + s0[2].map(function (p, i) { return (i + 1) + '. ' + ENT[p[0]].n + ': ' + p[1]; }).join(' '); speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(txt); u.lang = en() ? 'en-US' : 'es-CO'; speechSynthesis.speak(u); }
  W.LV24 = { st: st, SIT: SIT, ENT: ENT, ESP: ESP, ENF: ENF, LINES: LINES, say: say, set: function (o) { for (var k in o) st[k] = o[k]; var g = D.getElementById('lv24geo'); if (g) render(g); }, mount: function () { mount(); } };
  function init() { mount(); var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(mount, 200); }).observe(D.querySelector('main') || D.body, { childList: true, subtree: true }); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { setTimeout(init, 500); }); else setTimeout(init, 500);
})();
