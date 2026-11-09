/* v50 · Rutas de atención según los bocetos del equipo ¡LIBRES!
   Estructura:
     Alerta · peligro inminente (siempre visible)
     1. ¿Qué hacer ante una violencia?  → encuadre + tres sectores (salud, justicia, protección)
     2. ¿A dónde puedo acudir?          → geovisor por territorio (lv24) con sector, entidades especializadas
                                          y enfoque diferencial; «Te acompaño» guía paso a paso
     3. Herramientas de consulta y apoyo → flujograma, líneas de atención, guías y documentos técnicos
                                          (mecanismo articulador), infografía descargable y cómo citar */
(function () {
  var D = document, W = window, R = D.documentElement;
  if (/Administracion/i.test(location.pathname)) return;
  function en() { return (R.lang || 'es').indexOf('en') === 0; }
  function T(es, e) { return en() ? e : es; }
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function svg(p, s) { return '<svg viewBox="0 0 24 24" width="' + (s || 22) + '" height="' + (s || 22) + '" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  function X(k, d) { return W.LV11 && W.LV11.txt ? W.LV11.txt(k, d) : d; }
  var ARR = svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 16);
  var IC = {
    salud: '<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/>',
    justicia: '<path d="M12 4v16M7 20h10M5 8h14M5 8l-2.5 6a2.5 2.5 0 0 0 5 0zM19 8l-2.5 6a2.5 2.5 0 0 0 5 0z"/>',
    proteccion: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/>',
    alert: '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>',
    flow: '<rect x="9" y="3" width="6" height="4" rx="1"/><rect x="3" y="17" width="6" height="4" rx="1"/><rect x="15" y="17" width="6" height="4" rx="1"/><path d="M12 7v5M6 17v-3h12v3"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    img: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 9"/>',
    quote: '<path d="M7 7h4v4c0 3-2 5-4 6M15 7h4v4c0 3-2 5-4 6"/>'
  };
  var SECT = [
    ['salud', ['Salud', 'Health'], ['Urgencias, atención médica y psicológica, registro de lesiones. No necesitas denuncia para que te atiendan.', 'Emergency, medical and psychological care. No report needed to be attended.'], ['Hospital o ESE', 'IPS con protocolo de violencia sexual', 'Salud mental']],
    ['justicia', ['Justicia', 'Justice'], ['Denuncia, investigación y sanción. Fiscalía, Medicina Legal y Ministerio Público te acompañan.', 'Reporting, investigation and sanctions. Prosecutor, forensic institute and public ministry.'], ['Fiscalía (CAIVAS, CAVIF, URI)', 'Medicina Legal', 'Personería y Defensoría']],
    ['proteccion', ['Protección', 'Protection'], ['Medidas para que el agresor no se acerque, desalojo, acogida en casa refugio y protección de niñas y niños.', 'Orders to keep the aggressor away, eviction, shelter and child protection.'], ['Comisaría de Familia', 'Policía', 'ICBF y casas refugio']]
  ];
  var ENC = [
    ['No es tu culpa', 'It is not your fault', 'Ninguna violencia se justifica. Tienes derecho a una vida libre de violencias (Ley 1257 de 2008).', 'No violence is justified. You have the right to a life free from violence.'],
    ['Primero, tu seguridad', 'Safety first', 'Si estás en peligro, busca un lugar seguro y llama al 123.', 'If you are in danger, find a safe place and call 123.'],
    ['Puedes empezar por cualquier puerta', 'Any door is the right door', 'Salud, justicia o protección: la entidad a la que llegues debe atenderte y remitirte a las demás.', 'Health, justice or protection: whichever agency you reach must attend you and refer you.'],
    ['Tienes derecho a decidir', 'You decide', 'A recibir información clara, a ir acompañada, a no ser confrontada con el agresor y a que se respete tu privacidad.', 'To clear information, a companion, not to face the aggressor and to privacy.']
  ];
  var DOCS = [
    ['d1710', 'Mecanismo articulador · Decreto 1710 de 2020', 'Articulating mechanism · Decree 1710/2020', 'Instancia nacional y territorial que coordina a los sectores para el abordaje integral de las violencias por razones de sexo y género.', 'National and local body coordinating sectors for comprehensive response.'],
    ['', 'Protocolo y modelo de atención integral en salud para víctimas de violencia sexual (Res. 459 de 2012)', 'Health care protocol for sexual violence victims (Res. 459/2012)', 'Manual de referencia para la atención en salud de la violencia sexual: urgencia médica, profilaxis y salud mental.', 'Reference manual for health care in sexual violence cases.'],
    ['ley1257', 'Ley 1257 de 2008', 'Law 1257/2008', 'Derecho a una vida libre de violencias; medidas de protección y de atención.', 'Right to a life free from violence; protection and support measures.'],
    ['ley294', 'Ley 294 de 1996', 'Law 294/1996', 'Prevenir, remediar y sancionar la violencia intrafamiliar; medidas de protección.', 'Domestic violence; protection orders.'],
    ['ley2126', 'Ley 2126 de 2021', 'Law 2126/2021', 'Funcionamiento de las comisarías de familia.', 'Family commissioners.'],
    ['d1630', 'Decreto 1630 de 2019', 'Decree 1630/2019', 'Medidas de atención a mujeres víctimas de violencia.', 'Support measures for women victims.'],
    ['ley2215', 'Ley 2215 de 2022 · Casas refugio', 'Law 2215/2022 · Shelters', 'Casas refugio y Red Nacional.', 'Shelters and national network.']
  ];
  var LN = [
    ['123', ['Emergencias', 'Emergencies'], ['Si estás en peligro inmediato · 24 horas', 'Immediate danger · 24 hours']],
    ['155', ['Orientación a mujeres', 'Women\'s helpline'], ['Derechos, Ley 1257 y a dónde acudir · gratuita', 'Rights and where to go · free']],
    ['122', ['Fiscalía', 'Prosecutor'], ['Denuncia de violencia intrafamiliar, sexual y de género', 'Report domestic, sexual and gender violence']],
    ['141', ['ICBF', 'ICBF'], ['Niñas, niños y adolescentes · 24 horas', 'Children and adolescents · 24 hours']],
    ['018000522020', ['Trata de personas', 'Human trafficking'], ['Ministerio del Interior y OIM · 24 horas', 'Ministry of Interior and IOM · 24 hours'], '01 8000 52 2020'],
    ['018000911119', ['Unidad para las Víctimas', 'Victims Unit'], ['Víctimas del conflicto armado', 'Armed conflict victims'], '01 8000 911 119'],
    ['018000914814', ['Defensoría del Pueblo', 'Ombudsman'], ['Orientación jurídica y quejas', 'Legal guidance and complaints'], '01 8000 914 814']
  ];
  var st = { tool: 'flujo', chat: 0, ans: {}, view: 'r50b' };

  function flowHTML() {
    var G = W.LV24; if (!G) return '';
    var s = G.SIT[G.st.sit], cols = { salud: [], justicia: [], proteccion: [] };
    s[2].forEach(function (p, i) { var e = G.ENT[p[0]]; (cols[e.sec] || cols.proteccion).push('<li><i>' + (i + 1) + '</i><b>' + E(e.n) + '</b><small>' + E(p[1]) + '</small></li>'); });
    (G.ESP[s[0]] || []).forEach(function (x) { cols[x[2]].push('<li class="esp"><i>★</i><b>' + E(x[0]) + '</b><small>' + E(x[1]) + '</small></li>'); });
    return '<div class="f50sit">' + G.SIT.map(function (x, i) { return '<button type="button" data-fsit="' + i + '"' + (i === G.st.sit ? ' class="on"' : '') + '>' + E(x[1]) + '</button>'; }).join('') + '</div>' +
      '<div class="f50"><div class="nd start"><b>' + T('Ocurre una violencia', 'Violence happens') + '</b><small>' + E(s[1]) + '</small></div><span class="ar"></span>' +
      '<div class="nd q"><b>' + T('¿Hay peligro inminente?', 'Is there imminent danger?') + '</b><div class="yn"><span class="y">' + T('Sí → llama al 123', 'Yes → call 123') + '</span><span class="n">' + T('No → elige por dónde empezar', 'No → choose where to start') + '</span></div></div><span class="ar"></span>' +
      (s[0] === 'sexual' ? '<div class="nd vsx"><b>' + T('Urgencia médica · primeras 72 horas', 'Medical emergency · first 72 hours') + '</b></div><span class="ar"></span>' : '') +
      '<div class="cols">' + SECT.map(function (x) { return '<div class="col"><h4>' + svg(IC[x[0]], 18) + T(x[1][0], x[1][1]) + '</h4><ol>' + (cols[x[0]].join('') || '<li class="na"><small>' + T('Sin paso en esta ruta', 'No step in this pathway') + '</small></li>') + '</ol></div>'; }).join('') + '</div>' +
      '<span class="ar"></span><div class="nd end"><b>' + T('Seguimiento y acompañamiento', 'Follow-up and support') + '</b><small>' + T('Las entidades se remiten entre sí: no tienes que contar tu historia una y otra vez.', 'Agencies refer to each other: you should not have to retell your story.') + '</small></div></div>';
  }
  function toolHTML() {
    var t = st.tool, h = '';
    if (t === 'flujo') h = flowHTML();
    else if (t === 'lineas') h = '<div class="l50">' + ((W.LV11 && W.LV11.routes && W.LV11.routes().length) ? W.LV11.routes().map(function (r) { var n = String(r.num || '').replace(/[^\d+]/g, ''); return [n, [r.n, r.n], [r.for || r.cov || '', r.for || r.cov || ''], r.num]; }) : LN).map(function (l) { return '<a href="tel:' + l[0] + '"><b>' + (l[3] || l[0]) + '</b><span>' + T(l[1][0], l[1][1]) + '</span><small>' + T(l[2][0], l[2][1]) + '</small></a>'; }).join('') + '</div><p class="n50">' + T('Líneas nacionales verificadas en fuentes oficiales el 29 de octubre de 2026.', 'National lines verified on official sources on 29 October 2026.') + '</p>';
    else if (t === 'guias') h = '<div class="d50">' + ((W.LV11 && W.LV11.docs ? W.LV11.docs() : []).map(function (d) { return '<a class="dd" ' + (d.url ? 'href="' + E(d.url) + '" target="_blank" rel="noopener"' : '') + '><span class="ic">' + svg(IC.doc, 20) + '</span><span class="tx"><b>' + E(d.t) + '</b><small>' + E(d.d || '') + '</small></span><em>' + E(d.tipo || '') + (d.y ? ' · ' + d.y : '') + '</em></a>'; }).join('')) + DOCS.filter(function (d) { return d[0]; }).map(function (d) { return '<button type="button"' + (d[0] ? ' data-norm="' + d[0] + '"' : ' disabled') + '><span class="ic">' + svg(IC.doc, 20) + '</span><span class="tx"><b>' + T(d[1], d[2]) + '</b><small>' + T(d[3], d[4]) + '</small></span>' + (d[0] ? '<i>' + ARR + '</i>' : '<em>' + T('Documento técnico', 'Technical document') + '</em>') + '</button>'; }).join('') + '</div>';
    else if (t === 'info') { var G = W.LV24, s = G ? G.SIT[G.st.sit] : null; h = '<div class="i50"><div class="prev">' + (s ? infoSVG() : '') + '</div><div class="ac"><p>' + T('Infografía de la ruta elegida en el geovisor, lista para compartir o imprimir. Cambia la situación en el paso 2 para generar otra.', 'Infographic of the pathway chosen in the map viewer, ready to share or print.') + '</p><button type="button" data-dl="1">' + svg('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', 18) + T('Descargar infografía', 'Download infographic') + '</button></div></div>'; }
    else if (t === 'cita') { var c = T('Observatorio Colombiano de Mujeres en todas sus diversidades. (2026). Rutas de atención para mujeres víctimas de violencias. Proyecto ¡LIBRES! Consultado el ', 'Colombian Observatory of Women in all their diversity. (2026). Support pathways for women victims of violence. ¡LIBRES! project. Retrieved ') + new Date().toLocaleDateString(en() ? 'en-GB' : 'es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) + (location.protocol.indexOf('http') === 0 ? ', ' + location.href.split('#')[0] + '#rutas' : '') + '.'; h = '<div class="c50"><p class="lab">' + T('Cómo citar esta herramienta', 'How to cite this tool') + '</p><blockquote id="c50t">' + E(c) + '</blockquote><button type="button" data-copy="1">' + T('Copiar referencia', 'Copy reference') + '</button><p class="n50">' + T('Cada cifra del observatorio indica su fuente y fecha de corte en su ficha.', 'Each figure shows its source and cut-off date in its sheet.') + '</p></div>'; }
    return h;
  }
  function infoSVG() {
    var G = W.LV24, s = G.SIT[G.st.sit], W0 = 600, y = 150, rows = '';
    s[2].forEach(function (p, i) { var e = G.ENT[p[0]], txt = p[1], lines = [], cur = ''; txt.split(' ').forEach(function (w) { if ((cur + ' ' + w).length > 62) { lines.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; }); lines.push(cur);
      rows += '<circle cx="48" cy="' + (y + 10) + '" r="18" fill="#672e89"/><text x="48" y="' + (y + 16) + '" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">' + (i + 1) + '</text><text x="80" y="' + (y + 6) + '" font-size="16" font-weight="800" fill="#672e89">' + E(e.n) + '</text>' + lines.map(function (l, j) { return '<text x="80" y="' + (y + 26 + j * 18) + '" font-size="13" fill="#2f2f33">' + E(l) + '</text>'; }).join('');
      y += 44 + lines.length * 18; });
    var hgt = y + 110;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W0 + ' ' + hgt + '" font-family="Arial, sans-serif" role="img" aria-label="' + E(s[1]) + '"><rect width="' + W0 + '" height="' + hgt + '" fill="#fff"/><rect width="' + W0 + '" height="110" fill="#672e89"/><text x="30" y="44" font-size="13" font-weight="800" fill="#72dbdd" letter-spacing="2">' + E(T('RUTA DE ATENCIÓN', 'SUPPORT PATHWAY')) + '</text><text x="30" y="80" font-size="26" font-weight="800" fill="#fff">' + E(s[1]) + '</text>' +
      '<rect x="30" y="122" width="540" height="2" fill="#35cbce"/>' + rows +
      '<rect x="0" y="' + (hgt - 70) + '" width="' + W0 + '" height="70" fill="#d7f5f5"/><text x="30" y="' + (hgt - 40) + '" font-size="15" font-weight="800" fill="#672e89">123 ' + E(T('Emergencias', 'Emergencies')) + ' · 155 ' + E(T('Orientación', 'Guidance')) + ' · 122 ' + E(T('Fiscalía', 'Prosecutor')) + ' · 141 ICBF</text><text x="30" y="' + (hgt - 18) + '" font-size="11" fill="#575756">' + E(T('Observatorio de Mujeres en todas sus diversidades · Proyecto ¡LIBRES!', 'Observatory of Women in all their diversity · ¡LIBRES! project')) + '</text></svg>';
  }
  /* «Te acompaño»: preguntas guiadas que configuran el geovisor */
  var CHAT = [
    ['peligro', ['¿Estás en peligro ahora?', 'Are you in danger right now?'], [['si', ['Sí', 'Yes']], ['no', ['No', 'No']]]],
    ['sit', ['¿Qué está pasando?', 'What is happening?'], null],
    ['enf', ['¿Quieres que la ruta tenga en cuenta algo de ti? (opcional)', 'Should the pathway consider something about you? (optional)'], null]
  ];
  function chatHTML() {
    var G = W.LV24; if (!G) return '';
    var i = st.chat, h = '<div class="k50hd"><b>' + svg(IC.chat, 18) + T('Te acompaño', 'I\'ll guide you') + '</b><button type="button" data-chat="close" aria-label="' + T('Cerrar', 'Close') + '">×</button></div><div class="k50b">';
    if (st.ans.peligro === 'si') return h + '<div class="msg alert"><b>' + T('Llama ya al 123', 'Call 123 now') + '</b><p>' + T('Busca un lugar seguro, con otras personas. La Policía puede intervenir de inmediato. Cuando estés a salvo, vuelve y te muestro la ruta completa.', 'Find a safe place with others. Police can act immediately. When safe, come back for the full pathway.') + '</p><a href="tel:123">' + svg(IC.phone, 18) + ' 123</a></div><button type="button" class="rs" data-chat="reset">' + T('Volver a empezar', 'Start again') + '</button></div>';
    if (i >= CHAT.length) return h + '<div class="msg ok"><b>' + T('Listo. Te muestro tu ruta en el mapa.', 'Done. Here is your pathway on the map.') + '</b><p>' + E(G.SIT[G.st.sit][1]) + '</p></div><button type="button" class="go" data-chat="ver">' + T('Ver mi ruta', 'See my pathway') + ' ' + ARR + '</button><button type="button" class="rs" data-chat="reset">' + T('Volver a empezar', 'Start again') + '</button></div>';
    var q = CHAT[i], opts = q[2] ? q[2].map(function (o) { return [o[0], T(o[1][0], o[1][1])]; }) : q[0] === 'sit' ? G.SIT.map(function (s, j) { return [String(j), s[1]]; }) : G.ENF.map(function (e) { return [e[0] || 'none', e[0] ? e[1] : T('Prefiero no decir / ninguno', 'Rather not say / none')]; });
    h += CHAT.slice(0, i).map(function (c) { return '<div class="msg q"><small>' + T(c[1][0], c[1][1]) + '</small><b>' + E(st.lbl[c[0]] || '') + '</b></div>'; }).join('');
    h += '<p class="ask">' + T(q[1][0], q[1][1]) + '</p><div class="op">' + opts.map(function (o) { return '<button type="button" data-ans="' + q[0] + '" data-v="' + o[0] + '">' + E(o[1]) + '</button>'; }).join('') + '</div><p class="pv">' + T('No guardamos tus respuestas.', 'Your answers are not stored.') + '</p></div>';
    return h;
  }
  function pageHTML() {
    return '<div class="a50" role="alert" data-v51="1"><span class="ic">' + svg(IC.alert, 22) + '</span><div><b>' + T('Alerta · ¿estás en peligro inminente?', 'Alert · are you in imminent danger?') + '</b><span>' + X('rutas.alerta', T('Llama al 123 o busca un lugar seguro. Tu vida es lo primero.', 'Call 123 or find a safe place. Your life comes first.')) + '</span></div><a href="tel:123">' + svg(IC.phone, 18) + ' 123</a><a href="tel:155" class="b">155 · ' + T('Orientación', 'Guidance') + '</a></div>' +
      '<nav class="s50nav" role="tablist" aria-label="' + T('Secciones de la ruta', 'Pathway sections') + '">' + [['r50a', '¿Qué hacer ante una violencia?', 'What to do'], ['r50b', '¿A dónde puedo acudir?', 'Where can I go?'], ['r50c', 'Herramientas de consulta y apoyo', 'Tools and support']].map(function (x, i) { return '<button type="button" role="tab" data-jump="' + x[0] + '" aria-selected="' + (st.view === x[0]) + '"' + (st.view === x[0] ? ' class="on"' : '') + '><i>' + (i + 1) + '</i><span>' + T(x[1], x[2]) + '</span></button>'; }).join('') + '<button type="button" class="k50open" data-chat="open">' + svg(IC.chat, 18) + T('Te acompaño', 'I\'ll guide you') + '</button></nav>' +
      '<section class="r50" id="r50a"><div class="hd"><i>1</i><div><h2>' + T('¿Qué hacer ante una violencia?', 'What to do when violence happens?') + '</h2><p>' + T('Lo esencial antes de buscar la entidad.', 'The essentials before finding an agency.') + '</p></div></div>' +
      '<div class="enc">' + ENC.map(function (x, i) { return '<div><span>' + (i + 1) + '</span><b>' + T(x[0], x[1]) + '</b><small>' + X('rutas.enc' + (i + 1), T(x[2], x[3])) + '</small></div>'; }).join('') + '</div>' +
      '<h3 class="sub">' + T('Tres sectores te atienden', 'Three sectors attend you') + '</h3><div class="sec">' + SECT.map(function (x) { return '<button type="button" data-gsec="' + x[0] + '"><span class="ic">' + svg(IC[x[0]], 26) + '</span><b>' + T(x[1][0], x[1][1]) + '</b><small>' + X('rutas.' + x[0], T(x[2][0], x[2][1])) + '</small><ul>' + x[3].map(function (e) { return '<li>' + E(e) + '</li>'; }).join('') + '</ul><em>' + T('Ver en el geovisor', 'See on the map') + ' ' + ARR + '</em></button>'; }).join('') + '</div></section>' +
      '<section class="r50" id="r50b"><div class="hd"><i>2</i><div><h2>' + T('¿A dónde puedo acudir?', 'Where can I go?') + '</h2><p>' + T('Elige tu municipio, la situación y el sector. La ruta cambia con el enfoque diferencial.', 'Choose municipality, situation and sector. The pathway adapts to the differential approach.') + '</p></div></div><div id="lv50geo"></div></section>' +
      '<section class="r50" id="r50c"><div class="hd"><i>3</i><div><h2>' + T('Herramientas de consulta y apoyo', 'Tools and support') + '</h2><p>' + T('Flujogramas, líneas de atención, guías e infografías.', 'Flowcharts, helplines, guides and infographics.') + '</p></div></div>' +
      '<div class="t50" role="tablist">' + [['flujo', 'flow', 'Flujograma', 'Flowchart'], ['lineas', 'phone', 'Líneas de atención', 'Helplines'], ['guias', 'doc', 'Guías y documentos técnicos', 'Guides and documents'], ['info', 'img', 'Infografía', 'Infographic'], ['dir', 'phone', 'Directorio de entidades', 'Agency directory'], ['cita', 'quote', 'Cómo citar', 'How to cite']].map(function (x) { return '<button type="button" role="tab" data-tool="' + x[0] + '" aria-selected="' + (st.tool === x[0]) + '"' + (st.tool === x[0] ? ' class="on"' : '') + '>' + svg(IC[x[1]], 18) + T(x[2], x[3]) + '</button>'; }).join('') + '</div><div class="tp" id="t50p">' + toolHTML() + '</div><div id="t50dir"' + (st.tool === 'dir' ? '' : ' hidden') + '></div></section>' +
      '<aside class="k50" id="k50" hidden aria-label="' + T('Te acompaño', 'I\'ll guide you') + '"></aside>';
  }
  function moveDir() { var d = D.getElementById('t50dir'), r = D.getElementById('lv14ruta'); if (d && r && r.parentNode !== d) d.appendChild(r); if (d) d.hidden = st.tool !== 'dir'; }
  function refreshTool() { var p = D.getElementById('t50p'); if (p) { p.innerHTML = toolHTML(); p.hidden = st.tool === 'dir'; } moveDir(); D.querySelectorAll('#lv50 [data-tool]').forEach(function (b) { var on = b.dataset.tool === st.tool; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); }); }
  function openChat(on) { var k = D.getElementById('k50'); if (!k) return; k.hidden = !on; if (on) { k.innerHTML = chatHTML(); var b = k.querySelector('button[data-ans],button.go'); if (b) b.focus(); } }
  function setView(id) { st.view = id; D.querySelectorAll('#lv50 .r50').forEach(function (x) { x.hidden = x.id !== id; }); D.querySelectorAll('#lv50 [data-jump]').forEach(function (b) { var on = b.dataset.jump === id; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); }); var n = D.querySelector('#lv50 .s50nav'); if (n && n.getBoundingClientRect().top < 0) scrollToId('lv50'); }
  function scrollToId(id) { var el = D.getElementById(id), hd = D.querySelector('body > header'); if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY - (hd ? hd.offsetHeight : 0) - 12, behavior: 'smooth' }); }
  function mount() {
    var sec = D.getElementById('rutas'); if (!sec) return;
    var box = sec.querySelector('.lv11content') || sec, head = box.querySelector('.lv11rhero, .lv11head'); if (!head || !W.LV24) return;
    var lang = en() ? 'en' : 'es', host = D.getElementById('lv50');
    if (host && host.dataset.lang === lang) return;
    if (host) host.remove();
    host = D.createElement('div'); host.id = 'lv50'; host.dataset.lang = lang; host.setAttribute('data-no-translate', '');
    host.innerHTML = pageHTML(); head.parentNode.insertBefore(host, head.nextSibling);
    var g = D.getElementById('lv24geo'); if (g) D.getElementById('lv50geo').appendChild(g);
    W.LV24.mount(); moveDir(); setView(st.view);
    host.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('[data-jump]'))) { e.preventDefault(); setView(b.dataset.jump); return; }
      if ((b = e.target.closest('[data-gsec]'))) { W.LV24.set({ sec: b.dataset.gsec }); setView('r50b'); return; }
      if ((b = e.target.closest('[data-tool]'))) { st.tool = b.dataset.tool; refreshTool(); return; }
      if ((b = e.target.closest('[data-fsit]'))) { W.LV24.set({ sit: +b.dataset.fsit }); refreshTool(); return; }
      if ((b = e.target.closest('[data-norm]'))) { if (W.LV11 && W.LV11.openNorm) W.LV11.openNorm(b.dataset.norm); return; }
      if ((b = e.target.closest('[data-dl]'))) { var blob = new Blob([infoSVG()], { type: 'image/svg+xml' }), a = D.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ruta_atencion_' + W.LV24.SIT[W.LV24.st.sit][0] + '.svg'; D.body.appendChild(a); a.click(); a.remove(); return; }
      if ((b = e.target.closest('[data-copy]'))) { var t = D.getElementById('c50t'); try { navigator.clipboard.writeText(t.textContent); b.textContent = T('Referencia copiada', 'Copied'); } catch (err) {} return; }
      if ((b = e.target.closest('[data-chat]'))) { var a2 = b.dataset.chat; if (a2 === 'open') { st.chat = 0; st.ans = {}; st.lbl = {}; openChat(true); } else if (a2 === 'close') openChat(false); else if (a2 === 'reset') { st.chat = 0; st.ans = {}; st.lbl = {}; openChat(true); } else if (a2 === 'ver') { openChat(false); setView('r50b'); } return; }
      if ((b = e.target.closest('[data-ans]'))) { var k = b.dataset.ans, v = b.dataset.v; st.ans[k] = v; st.lbl = st.lbl || {}; st.lbl[k] = b.textContent; if (k === 'sit') W.LV24.set({ sit: +v, sec: 'todos' }); if (k === 'enf') W.LV24.set({ enf: v === 'none' ? '' : v }); st.chat++; openChat(true); if (st.tool === 'flujo' || st.tool === 'info') refreshTool(); return; }
    });
    // la situación elegida en el geovisor se refleja en el flujograma y la infografía
    var g2 = D.getElementById('lv24geo'); if (g2) g2.addEventListener('click', function (e) { if (e.target.closest('[data-sit]')) setTimeout(function () { if (st.tool === 'flujo' || st.tool === 'info') refreshTool(); }, 30); });
  }
  function init() { if (!W.LV24) return setTimeout(init, 300); mount(); var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(mount, 150); }).observe(R, { attributes: true, attributeFilter: ['lang'] }); new MutationObserver(function () { clearTimeout(t); t = setTimeout(mount, 150); }).observe(D.querySelector('main') || D.body, { childList: true }); setInterval(function () { if (D.getElementById('lv14ruta') && !D.getElementById('lv14ruta').closest('#t50dir')) moveDir(); }, 1500); if ((W.LV44_HASH || '') === '#rutas') setTimeout(function () { if (W.go) W.go('rutas'); }, 300); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { setTimeout(init, 700); }); else setTimeout(init, 700);
})();
