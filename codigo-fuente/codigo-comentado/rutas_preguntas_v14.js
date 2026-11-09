/* ==========================================================================
   LIBRES v14 · «Encuentra tu ruta» y preguntas frecuentes
   - Rutas de atención por situación y por población, con lo que puede pasar
     en cada paso (salud, protección, justicia, acogida) y los derechos que
     aplican. Líneas verificadas en fuentes oficiales el 29 de octubre de 2026.
   - Preguntas frecuentes en Consulta metodológica.
   El portal no guarda lo que la persona elige ni recibe denuncias.
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window;
  function en() { try { if (typeof language === 'string') return language === 'en'; } catch (e) {} return (D.documentElement.lang || 'es').indexOf('en') === 0; }
  function T(es, e) { return en() ? e : es; }
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ico(n, s) { try { return W.LV11 ? LV11.icon(n, s || 18) : ''; } catch (e) { return ''; } }
  function tel(n) { return 'tel:' + String(n).replace(/[^\d+]/g, ''); }
  function L(num, label) { return '<a class="lv14tel" href="' + tel(num) + '">' + ico('phone', 14) + '<b>' + E(num) + '</b>' + (label ? '<span>' + E(label) + '</span>' : '') + '</a>'; }

  /* ---------------- Situaciones y procesos ---------------- */
  // Cada paso: [título, qué pasa, dónde, cuándo/tiempo, derechos]
  var R = [
    { id: 'peligro', c: '#E0315B', ico: 'shield', t: 'Estoy en peligro ahora', s: 'Agresión en curso, amenaza de muerte o miedo de volver a casa.',
      now: [['123', 'Emergencias · Policía'], ['155', 'Orientación a mujeres']],
      steps: [
        ['Ponte a salvo', 'Busca un lugar seguro, con otras personas. Llama al 123: la Policía debe acudir y puede trasladarte a un lugar seguro o a urgencias.', 'Policía Nacional · 123', 'De inmediato', 'Recibir protección inmediata.'],
        ['Pide una medida de protección', 'Ve a la comisaría de familia (o a la Fiscalía o un juez si no hay comisaría). Puede ordenar que el agresor salga de la vivienda, que no se acerque a ti, protección policial y otras medidas.', 'Comisaría de familia · Fiscalía · juez', 'La medida provisional se dicta de forma inmediata; en la ley, dentro de las 4 horas hábiles siguientes', 'No tener que demostrar todo para recibir protección provisional.'],
        ['Si no puedes volver a casa', 'Pide a la autoridad que te dio la medida la remisión a una casa refugio para ti y tus hijas o hijos. La ubicación es reservada.', 'Comisaría o juez · casas refugio (Ley 2215 de 2022)', 'Según la autoridad y el territorio', 'Alojamiento, alimentación y acompañamiento psicosocial y jurídico.'],
        ['Denuncia cuando estés lista', 'Puedes denunciar en la Fiscalía, la Policía o en línea. La violencia intrafamiliar se investiga de oficio: no necesitas «querella».', 'Fiscalía · 122 · URI · CAVIF', 'Cuando lo decidas', 'Asistencia legal gratuita y no ser confrontada con el agresor si no quieres.']
      ] },
    { id: 'sexual', c: '#17A58C', ico: 'health', t: 'Violencia sexual', s: 'Cualquier acto sexual sin tu consentimiento, también por parte de tu pareja o en el conflicto armado.',
      now: [['123', 'Si estás en riesgo'], ['155', 'Orientación']],
      steps: [
        ['Ve a urgencias: es una urgencia médica', 'Cualquier hospital o centro de salud debe atenderte, aunque no hayas denunciado. No te bañes ni te cambies si puedes, pero no lo dejes de hacer por eso: lo importante es que te atiendan.', 'Urgencias de cualquier IPS', 'Ideal en las primeras 72 horas', 'Atención integral sin exigir denuncia (Resolución 459 de 2012).'],
        ['Prevención de infecciones y embarazo', 'Te ofrecen anticoncepción de emergencia, profilaxis para VIH y otras infecciones, pruebas y vacunas, según el tiempo transcurrido.', 'Sector salud', 'Antes de 72 horas desde el hecho', 'Recibir información clara y decidir sobre cada procedimiento.'],
        ['Atención en salud mental', 'Primeros auxilios emocionales y remisión a acompañamiento psicológico de mediano y largo plazo.', 'Sector salud · EPS', 'Desde la primera atención', 'Atención continua, sin barreras administrativas.'],
        ['Denuncia y examen médico-legal', 'La institución de salud informa a la justicia. El examen y la toma de evidencias los hace Medicina Legal con orden de autoridad. Tú das el consentimiento.', 'Fiscalía · CAIVAS · URI · Medicina Legal', 'Cuando lo decidas; antes es mejor para las evidencias', 'Consentimiento informado y elegir el sexo de quien te examina (Ley 1257 de 2008, art. 8).'],
        ['Si hay embarazo', 'Tienes derecho a decidir. Puedes acceder a la interrupción voluntaria del embarazo hasta la semana 24 sin causales; después, la violencia sexual es una de las causales. La falta de denuncia no debe retrasarla.', 'EPS o IPS', 'Acceso inmediato cuando lo solicites', 'Sentencias C-355 de 2006 y C-055 de 2022.'],
        ['Proceso penal', 'La Fiscalía investiga, puede imputar cargos y llevar el caso a juicio. Puedes tener representación jurídica gratuita.', 'Fiscalía · jueces · Defensoría del Pueblo', 'Meses o años, según el caso', 'Reserva de tu identidad, no confrontación con el agresor, verdad, justicia y reparación.']
      ] },
    { id: 'pareja', c: '#D33B78', ico: 'house', t: 'Violencia de pareja, expareja o familiar', s: 'Golpes, insultos, control, amenazas, violencia económica, aunque no vivan juntos o ya se hayan separado.',
      now: [['155', 'Orientación'], ['123', 'Si hay peligro']],
      steps: [
        ['Acude a la comisaría de familia', 'Es competente aunque no vivan bajo el mismo techo, si están separados o divorciados, o si fue una relación de pareja permanente.', 'Comisaría de familia (Ley 2126 de 2021)', 'Atención con respuesta inmediata', 'Que no te remitan sin necesidad: las remisiones injustificadas son falta disciplinaria.'],
        ['Medidas de protección', 'Prohibición de acercarse, desalojo del agresor, protección policial, tratamiento, decisiones provisionales sobre alimentos y custodia.', 'Comisaría de familia o juez', 'Provisional: inmediata; definitiva tras audiencia', 'Ser escuchada y que la medida se cumpla; si no se cumple, informa a la comisaría.'],
        ['Denuncia penal', 'La violencia intrafamiliar es delito y se investiga de oficio. Puedes denunciar en la Fiscalía, la Policía, en línea o por la línea 122.', 'Fiscalía · CAVIF · URI · 122', 'Cuando lo decidas', 'Asesoría jurídica gratuita y no conciliar la violencia.'],
        ['Atención en salud', 'Lesiones y salud mental. El sector salud también debe activar la ruta de protección.', 'Urgencias · EPS', 'Cuando lo necesites', 'Atención integral y confidencial.'],
        ['Acogida y autonomía', 'Casa refugio si no puedes volver a casa, y orientación para empleo, vivienda y cuidado de hijas e hijos.', 'Casas refugio · secretarías de la mujer', 'Según el territorio', 'Medidas de atención (Ley 1257 de 2008, art. 19).']
      ] },
    { id: 'conflicto', c: '#7A2E8E', ico: 'dove', t: 'Violencia en el conflicto armado', s: 'Violencia sexual, desplazamiento, amenazas o reclutamiento por grupos armados.',
      now: [['01 8000 911 119', 'Unidad para las Víctimas']],
      steps: [
        ['Declara ante el Ministerio Público', 'Puedes rendir tu declaración en la personería municipal, la Defensoría del Pueblo o la Procuraduría para ser incluida en el Registro Único de Víctimas.', 'Personería · Defensoría · Procuraduría (Ley 1448 de 2011)', 'Pide orientación sobre los plazos que aplican a tu caso', 'Trato digno y reserva de tu información.'],
        ['Atención en salud y psicosocial', 'La violencia sexual es una urgencia médica. Pide también atención psicosocial para víctimas.', 'Sector salud · EPS', 'De inmediato', 'Atención gratuita y especializada (Ley 1719 de 2014).'],
        ['Justicia', 'La Fiscalía investiga. La violencia sexual en el conflicto puede ser crimen de lesa humanidad y en ese caso no prescribe.', 'Fiscalía · jurisdicciones de justicia transicional', 'Proceso largo', 'Verdad, justicia, reparación y garantías de no repetición.'],
        ['Reparación', 'La Unidad para las Víctimas orienta sobre indemnización, rehabilitación y medidas colectivas.', 'Unidad para las Víctimas', 'Según el estado de tu registro', 'Información sobre tu proceso por WhatsApp 322 815 1101.']
      ] },
    { id: 'trata', c: '#EF6B4A', ico: 'network', t: 'Trata y explotación', s: 'Te prometieron trabajo o viaje y te retienen, quitan documentos, explotan sexual o laboralmente.',
      now: [['01 8000 52 2020', 'Línea contra la trata · 24 h'], ['123', 'Emergencias']],
      steps: [
        ['Reporta el caso', 'Llama a la línea gratuita contra la trata, también si eres familiar o testigo. Desde el exterior: +57 601 600 1035.', 'Ministerio del Interior y OIM', '24 horas, todos los días', 'Reserva de identidad.'],
        ['Asistencia inmediata', 'Alojamiento seguro, salud, apoyo psicológico, documentos y retorno al lugar de origen si lo deseas.', 'Comités de lucha contra la trata (Ley 985 de 2005)', 'Desde que se identifica el caso', 'Que no te traten como delincuente por lo que te obligaron a hacer.'],
        ['Denuncia', 'La Fiscalía investiga la trata y la explotación.', 'Fiscalía · 122', 'Cuando estés segura', 'Protección como víctima y testigo.'],
        ['Asistencia mediata', 'Acompañamiento para educación, empleo y proyecto de vida.', 'Entidades territoriales', 'Después de la etapa inmediata', 'Atención con enfoque de género y diferencial.']
      ] },
    { id: 'lgbtiq', c: '#B243EA', ico: 'spark', t: 'Violencia por ser lesbiana, bisexual o trans', s: 'Agresiones, amenazas, discriminación o violencia por tu orientación sexual o identidad de género.',
      now: [['123', 'Si hay peligro'], ['01 8000 914 814', 'Defensoría del Pueblo']],
      steps: [
        ['Ponte a salvo y busca atención', 'Urgencias y salud mental si hubo agresión. Tienes derecho a ser llamada por tu nombre y tratada según tu identidad.', 'Sector salud', 'De inmediato', 'Trato digno, sin discriminación.'],
        ['Denuncia', 'Los actos de discriminación son delito (Ley 1482 de 2011) y la motivación por prejuicio agrava la pena. Pide que la denuncia registre el prejuicio.', 'Fiscalía · 122 · Policía', 'Cuando lo decidas', 'Que tu caso se investigue con enfoque diferencial.'],
        ['Si es violencia de pareja o familiar', 'La comisaría de familia es competente también entre mujeres o con parejas trans.', 'Comisaría de familia', 'Inmediata', 'Medidas de protección.'],
        ['Acompañamiento', 'La Defensoría del Pueblo orienta y acompaña. Organizaciones de la sociedad civil también documentan y apoyan casos.', 'Defensoría · organizaciones LGBTIQ+', 'En todo el proceso', 'Asistencia legal gratuita.']
      ] },
    { id: 'digital', c: '#2F6FDB', ico: 'phone', t: 'Violencia digital', s: 'Difusión de fotos íntimas, acoso o amenazas en redes, suplantación, vigilancia del celular.',
      now: [['122', 'Fiscalía']],
      steps: [
        ['Guarda las pruebas', 'Capturas con fecha, enlaces, nombres de usuario y mensajes. No borres las conversaciones.', 'Tu celular o computador', 'Antes de reportar o bloquear', 'Que tus pruebas sean recibidas.'],
        ['Denuncia', 'Amenazas, injuria, acceso abusivo a tus cuentas o divulgación de datos e imágenes pueden ser delitos (Ley 1273 de 2009, entre otras).', 'Fiscalía · CAI Virtual de la Policía', 'Cuando lo decidas', 'Reserva de tu identidad.'],
        ['Pide el retiro del contenido', 'Reporta a la plataforma. La Fiscalía o un juez pueden ordenar el retiro.', 'Plataformas · autoridades', 'Lo antes posible', 'Protección de tu intimidad y tus datos.'],
        ['Protección y apoyo', 'Si quien te acosa es tu pareja o expareja, la comisaría puede dictar medidas de protección.', 'Comisaría de familia · salud mental', 'Inmediata', 'Atención integral.']
      ] },
    { id: 'trabajo', c: '#22A37A', ico: 'people', t: 'Acoso sexual en el trabajo o el estudio', s: 'Insinuaciones, chantajes, tocamientos o presión de jefes, compañeros, docentes.',
      now: [['155', 'Orientación']],
      steps: [
        ['Registra lo que pasa', 'Fechas, lugares, testigos, mensajes.', 'Tú', 'Desde el primer hecho', 'Que no te pidan pruebas imposibles.'],
        ['Activa el protocolo', 'Empresas e instituciones de educación superior deben tener protocolos de prevención y atención del acoso sexual (Ley 2365 de 2024).', 'Recursos humanos · comité de convivencia · bienestar universitario', 'Según el protocolo', 'No sufrir represalias por denunciar.'],
        ['Denuncia penal', 'El acoso sexual es delito (artículo 210A del Código Penal).', 'Fiscalía · 122', 'Cuando lo decidas', 'Asistencia legal gratuita.'],
        ['Inspección del trabajo', 'Si hay acoso laboral o represalias, acude al inspector del Ministerio del Trabajo (Ley 1010 de 2006).', 'Ministerio del Trabajo', 'Según el caso', 'Estabilidad y garantías laborales.']
      ] },
    { id: 'ninas', c: '#F2A71B', ico: 'hands', t: 'Niñas y adolescentes', s: 'Violencia, abuso o explotación contra una niña o adolescente.',
      now: [['141', 'ICBF · 24 h'], ['123', 'Emergencias']],
      steps: [
        ['Llama a la línea 141', 'Cualquier persona puede reportar, también la niña o adolescente. Es gratuita.', 'ICBF', '24 horas', 'Reserva de identidad de quien reporta.'],
        ['Atención en salud', 'La violencia sexual es una urgencia médica. No se exige denuncia ni la presencia de los padres para atenderla.', 'Urgencias · EPS', 'De inmediato; ideal antes de 72 horas', 'Atención integral y prioritaria.'],
        ['Restablecimiento de derechos', 'La defensoría de familia es competente en violencia sexual contra niñas, niños y adolescentes; la comisaría, en otras violencias familiares.', 'Defensoría de familia · comisaría', 'Inmediata', 'Interés superior de la niña.'],
        ['Denuncia', 'La Fiscalía investiga. Se evita que la niña repita su relato muchas veces.', 'Fiscalía · CAIVAS', 'Lo antes posible', 'Entrevista única y acompañamiento.']
      ] },
    { id: 'salud', c: '#17A58C', ico: 'health', t: 'Barreras en salud sexual y reproductiva', s: 'Te niegan o retrasan el aborto, la anticoncepción o te maltratan en la atención del parto.',
      now: [['155', 'Orientación']],
      steps: [
        ['Pide la atención a tu EPS o IPS', 'El aborto es un servicio de salud hasta la semana 24 sin causales; después, por las causales legales. No pueden exigirte requisitos adicionales.', 'EPS · IPS', 'La atención debe ser oportuna', 'Información clara, confidencialidad y decidir sin presiones (Sentencia C-055 de 2022).'],
        ['Si te niegan la atención', 'Pide la negativa por escrito y presenta una queja ante la Superintendencia Nacional de Salud.', 'Superintendencia de Salud · personería', 'De inmediato', 'Respuesta oportuna.'],
        ['Tutela', 'Si la barrera persiste, la acción de tutela protege tus derechos fundamentales.', 'Cualquier juez', 'El juez decide en 10 días', 'No necesitas abogada.'],
        ['Violencia obstétrica', 'Maltrato, procedimientos sin consentimiento o humillaciones en la atención: puedes quejarte ante la IPS, la EPS y la Superintendencia.', 'IPS · EPS · Superintendencia', 'Cuando lo decidas', 'Trato digno y consentimiento informado.']
      ] },
    { id: 'economica', c: '#E0A800', ico: 'trend', t: 'Violencia económica o patrimonial', s: 'Te quitan el dinero, documentos o bienes, no aportan alimentos o te impiden trabajar.',
      now: [['155', 'Orientación']],
      steps: [
        ['Comisaría de familia', 'La violencia económica y patrimonial está reconocida en la Ley 1257 de 2008. La comisaría puede dictar medidas, incluidas decisiones provisionales sobre alimentos.', 'Comisaría de familia', 'Inmediata', 'Medidas de protección.'],
        ['Alimentos para hijas e hijos', 'Conciliación y fijación de cuota de alimentos.', 'Comisaría · ICBF · juez de familia', 'Según el caso', 'La violencia no se concilia; los alimentos sí se pueden fijar.'],
        ['Denuncia', 'La inasistencia alimentaria y otros hechos patrimoniales pueden ser delito.', 'Fiscalía', 'Cuando lo decidas', 'Asistencia legal gratuita.'],
        ['Autonomía económica', 'Pregunta en tu secretaría de la mujer por programas de empleo, emprendimiento y formación.', 'Entidades territoriales', 'Según la oferta local', 'Atención sin discriminación.']
      ] }
  ];
  var WHO = [
    ['indigena', 'Mujer indígena', 'Puedes acudir a tu autoridad tradicional y también a la justicia ordinaria, la comisaría y el sector salud. Tienes derecho a intérprete. Ninguna autoridad étnica puede prohibir o restringir el acceso al aborto (Corte Constitucional, SU-297 de 2025).'],
    ['afro', 'Mujer negra, afrodescendiente, raizal o palenquera', 'Tienes derecho a atención con enfoque étnico-racial y sin discriminación; la discriminación racial es delito (Ley 1482 de 2011). Consejos comunitarios y organizaciones de mujeres afro pueden acompañarte.'],
    ['trans', 'Mujer trans', 'Tienes derecho a ser llamada por tu nombre y a ser atendida según tu identidad de género en salud, justicia y protección. Si la violencia es por prejuicio, pide que quede registrado en la denuncia.'],
    ['lb', 'Mujer lesbiana o bisexual', 'La violencia de pareja entre mujeres también es violencia en el contexto familiar: la comisaría de familia es competente y puede dictar medidas de protección.'],
    ['disc', 'Mujer con discapacidad', 'Pide ajustes razonables: intérprete de lengua de señas, información accesible y apoyo de una persona de confianza. Tú decides: tienes capacidad legal plena (Ley 1996 de 2019).'],
    ['migrante', 'Mujer migrante o refugiada', 'Las rutas de atención a violencias aplican sin importar tu situación migratoria y la atención de urgencias no puede negarse. Si te retienen documentos o te explotan, puede ser trata: 01 8000 52 2020.'],
    ['rural', 'Mujer rural o campesina', 'Si no hay comisaría cerca, acude a la personería municipal, la inspección de policía, el juez municipal o el centro de salud, que también activan la ruta.'],
    ['mayor', 'Mujer mayor', 'La violencia de hijos, nietos u otros familiares también es competencia de la comisaría de familia. Puedes pedir medidas de protección y apoyo de la personería.'],
    ['victima', 'Víctima del conflicto armado', 'Además de la ruta de violencias, puedes declarar ante el Ministerio Público para el Registro Único de Víctimas y pedir atención psicosocial. Unidad para las Víctimas: 01 8000 911 119.']
  ];
  var RIGHTS = ['Recibir información clara, completa y oportuna sobre tus derechos y los servicios.', 'Asistencia jurídica gratuita, inmediata y especializada.', 'Dar tu consentimiento informado para los exámenes y elegir el sexo de quien te examina en casos de violencia sexual.', 'Decidir si aceptas o no ser confrontada con el agresor.', 'Reserva de tu identidad y de tu información.', 'Verdad, justicia, reparación y garantías de no repetición.'];

  /* ---------------- Dónde denunciar o pedir ayuda (enlaces oficiales, verificados 29 oct. 2026) ---------------- */
  // [tipo, entidad, para qué, [[etiqueta, enlace o teléfono]...], urgente]
  var DEN = [
    ['emergencia', 'Policía Nacional · Línea 123', 'Si estás en peligro inmediato o la agresión está ocurriendo.', [['Llamar 123', 'tel:123']], 1],
    ['emergencia', 'Línea 155', 'Orientación gratuita a mujeres víctimas de violencias: derechos y a dónde acudir.', [['Llamar 155', 'tel:155']], 1],
    ['denuncia', 'Fiscalía General de la Nación', 'Denuncia violencia intrafamiliar, sexual, de género, feminicidio y otros delitos. También en URI, CAVIF y CAIVAS.', [['Denunciar en línea', 'https://sicecon.fiscalia.gov.co/denuncia/ingresoPrincipal'], ['Dónde y cómo denunciar', 'https://www.fiscalia.gov.co/colombia/servicios-de-informacion-al-ciudadano/donde-y-como-denunciar/'], ['Llamar 122', 'tel:122']]],
    ['denuncia', 'Policía Nacional · ADenunciar', 'Denuncia virtual de algunos delitos, como delitos informáticos y extorsión.', [['ADenunciar', 'https://adenunciar.policia.gov.co/adenunciar/Login.aspx'], ['Denuncia virtual', 'https://www.policia.gov.co/denuncia-virtual']]],
    ['proteccion', 'Comisaría de familia de tu municipio', 'Medidas de protección por violencia de pareja, expareja o familiar, aunque no vivan juntos. Si no hay comisaría: inspección de policía, juez municipal o personería.', [['Ver ruta de pareja o familia', '#ruta:pareja']]],
    ['proteccion', 'Línea Púrpura Distrital · Bogotá', 'Escucha y orientación a mujeres, 24 horas, gratuita.', [['Llamar 01 8000 112 137', 'tel:018000112137'], ['WhatsApp 300 755 1846', 'https://wa.me/573007551846'], ['Opción 7 de la Línea 195', 'tel:195']]],
    ['ninas', 'ICBF · Línea 141', 'Niñas, niños y adolescentes en riesgo o víctimas de violencia. 24 horas, gratuita.', [['Llamar 141', 'tel:141'], ['Línea ICBF 01 8000 91 80 80', 'tel:018000918080']]],
    ['ninas', 'Te Protejo Colombia', 'Reporte confidencial de situaciones que afectan a menores de 18 años, también en internet.', [['Reportar', 'https://teprotejocolombia.org/']]],
    ['digital', 'CAI Virtual · Policía', 'Acoso, amenazas, suplantación o difusión de imágenes íntimas en internet.', [['CAI Virtual', 'https://caivirtual.policia.gov.co/']]],
    ['digital', 'Acoso.online', 'Guía para actuar ante la publicación no consentida de imágenes íntimas.', [['Ver guía', 'https://acoso.online']]],
    ['conflicto', 'Unidad para las Víctimas', 'Víctimas del conflicto armado, incluida la violencia sexual. Declaración ante personería, Defensoría o Procuraduría.', [['Llamar 01 8000 911 119', 'tel:018000911119'], ['WhatsApp 322 815 1101', 'https://wa.me/573228151101'], ['Sitio web', 'https://www.unidadvictimas.gov.co']]],
    ['trata', 'Línea nacional contra la trata', 'Te retienen documentos, te explotan o te engañaron con un trabajo o viaje. Ministerio del Interior y OIM, 24 horas.', [['Llamar 01 8000 52 2020', 'tel:018000522020'], ['Desde el exterior +57 601 600 1035', 'tel:+576016001035']]],
    ['derechos', 'Defensoría del Pueblo', 'Orientación, acompañamiento jurídico gratuito y quejas cuando no te atienden o te revictimizan. Incluye personas LGBTIQ+.', [['Llamar 01 8000 914 814', 'tel:018000914814'], ['Canales de atención', 'https://www.defensoria.gov.co/orientacion-al-ciudadano']]],
    ['derechos', 'Procuraduría General de la Nación', 'Quejas contra servidores públicos que niegan, retrasan o maltratan en la atención.', [['Sitio web', 'https://www.procuraduria.gov.co']]],
    ['derechos', 'Consultorios jurídicos · LegalApp', 'Asesoría jurídica gratuita en universidades del país.', [['Agendar cita', 'https://www.legalapp.gov.co/Agendamiento']]],
    ['salud', 'Superintendencia Nacional de Salud', 'Quejas si la EPS o IPS niega o retrasa la atención por violencia sexual, aborto legal o anticoncepción.', [['Sitio web', 'https://www.supersalud.gov.co']]],
    ['trabajo', 'Ministerio del Trabajo', 'Acoso laboral o sexual en el trabajo y represalias.', [['Sitio web', 'https://www.mintrabajo.gov.co']]]
  ];
  var DT = [['', 'Todas'], ['emergencia', 'Emergencia'], ['denuncia', 'Denunciar'], ['proteccion', 'Protección'], ['ninas', 'Niñas y adolescentes'], ['digital', 'Violencia digital'], ['conflicto', 'Conflicto armado'], ['trata', 'Trata'], ['derechos', 'Defensa de derechos'], ['salud', 'Salud'], ['trabajo', 'Trabajo']];
  var dt = '';
  function denHTML() {
    var items = DEN.filter(function (d) { return !dt || d[0] === dt; });
    return '<div class="lv14den"><div class="lv14denh"><div><b>' + T('Dónde denunciar o pedir ayuda', 'Where to report or get help') + '</b><span>' + T('Enlaces oficiales.', 'Official links and lines. They open in a new tab.') + '</span></div></div>' +
      '<div class="lv14dent">' + DT.map(function (t) { return '<button type="button" data-dt="' + t[0] + '"' + (t[0] === dt ? ' class="on"' : '') + '>' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div class="lv14deng">' + items.map(function (d) { return '<div class="lv14denc' + (d[4] ? ' urg' : '') + '"><small>' + E((DT.find(function (t) { return t[0] === d[0]; }) || [])[1]) + '</small><b>' + E(d[1]) + '</b><p>' + E(d[2]) + '</p><div>' + d[3].map(function (l) { var tel = l[1].indexOf('tel:') === 0, rt = l[1].indexOf('#ruta:') === 0; return rt ? '<button type="button" class="lv14dl" data-r="' + l[1].slice(6) + '">' + E(l[0]) + ' →</button>' : '<a class="lv14dl' + (tel ? ' tel' : '') + '" href="' + E(l[1]) + '"' + (tel ? '' : ' target="_blank" rel="noopener noreferrer"') + '>' + E(l[0]) + (tel ? '' : ' ↗') + '</a>'; }).join('') + '</div></div>'; }).join('') + '</div></div>';
  }
  var sel = { r: '', who: [] };
  function rutaHTML() {
    var h = '<div class="lv14rhead"><div><div class="eyebrow">' + T('Encuentra tu ruta', 'Find your pathway') + '</div><h2>' + T('¿Qué está pasando?', 'What is happening?') + '</h2><p>' + T('Elige la situación. Nada se guarda ni se envía.', 'Choose the situation. Nothing is saved or sent.') + (en() ? ' <em>Pathway details are in Spanish.</em>' : '') + '</p></div></div>' + denHTML();
    h += '<div class="lv14sits" role="list">' + R.map(function (r) { return '<button type="button" role="listitem" class="lv14sit' + (sel.r === r.id ? ' on' : '') + '" data-r="' + r.id + '" style="--c:' + r.c + '"><span class="fxbox">' + (W.LV17_SICON ? W.LV17_SICON(r.ico, 40) : ico(r.ico, 20)) + '</span><b>' + E(r.t) + '</b><small>' + E(r.s) + '</small></button>'; }).join('') + '</div>';
    h += '<div class="lv14who"><span>' + T('Tener en cuenta (opcional):', 'Take into account (optional):') + '</span>' + WHO.map(function (w) { return '<button type="button" data-w="' + w[0] + '" aria-pressed="' + (sel.who.indexOf(w[0]) > -1) + '"' + (sel.who.indexOf(w[0]) > -1 ? ' class="on"' : '') + '>' + E(w[1]) + '</button>'; }).join('') + '</div>';
    var r = R.find(function (x) { return x.id === sel.r; });
    if (!r) return h + '<div class="lv14hint">' + ico('arrow', 18) + ' ' + T('Toca una situación para ver la ruta paso a paso.', 'Tap a situation to see the pathway step by step.') + '</div>';
    h += '<div class="lv14res" style="--c:' + r.c + '"><div class="lv14rtop"><div><small>' + T('Tu ruta', 'Your pathway') + '</small><h3>' + E(r.t) + '</h3></div><div class="lv14now"><span>' + T('Ahora mismo:', 'Right now:') + '</span>' + r.now.map(function (n) { return L(n[0], n[1]); }).join('') + '</div></div>';
    var notes = WHO.filter(function (w) { return sel.who.indexOf(w[0]) > -1; });
    if (notes.length) h += '<div class="lv14notes">' + notes.map(function (w) { return '<div><b>' + E(w[1]) + '</b><p>' + E(w[2]) + '</p></div>'; }).join('') + '</div>';
    h += '<ol class="lv14steps">' + r.steps.map(function (s, i) { return '<li><i>' + (i + 1) + '</i><div><b>' + E(s[0]) + '</b><p>' + E(s[1]) + '</p><div class="lv14meta"><span><em>' + T('Dónde', 'Where') + '</em>' + E(s[2]) + '</span><span><em>' + T('Cuándo', 'When') + '</em>' + E(s[3]) + '</span><span class="rt"><em>' + T('Tu derecho', 'Your right') + '</em>' + E(s[4]) + '</span></div></div></li>'; }).join('') + '</ol>';
    h += '<div class="lv14grid2"><div class="lv14box2"><h4>' + T('Tus derechos en cualquier ruta', 'Your rights on any pathway') + '</h4><ul>' + RIGHTS.map(function (x) { return '<li>' + E(x) + '</li>'; }).join('') + '</ul><small>' + T('Ley 1257 de 2008, artículo 8.', 'Law 1257 of 2008, art. 8.') + '</small></div>' +
      '<div class="lv14box2 warn"><h4>' + T('Si no te atienden o te revictimizan', 'If you are turned away or revictimised') + '</h4><p>' + T('Pide el nombre de quien te atendió y la negativa por escrito. Acude a la personería municipal o a la Defensoría del Pueblo; la Procuraduría vigila a las y los servidores públicos.', 'Ask for the name of the official and a written refusal. Go to the municipal ombudsman or the Defensoría del Pueblo.') + '</p>' + L('01 8000 914 814', 'Defensoría del Pueblo') + L('155', T('Orientación', 'Guidance')) + '</div></div>';
    h += '<div class="lv14ract"><button type="button" data-print="1">' + T('Imprimir o guardar esta ruta', 'Print or save this pathway') + '</button><span>' + T('Información orientativa. Verifica horarios y canales en tu municipio.', 'Guidance only. Check local hours and channels.') + '</span></div></div>';
    return h;
  }
  function mountRuta() {
    var sec = D.getElementById('rutas'); if (!sec) return;
    var box = sec.querySelector('.lv11content') || sec, lines = box.querySelector('.lv11lines'); if (!lines) return;
    var host = D.getElementById('lv14ruta');
    if (!host) {
      host = D.createElement('section'); host.id = 'lv14ruta'; host.className = 'lv14ruta'; host.setAttribute('data-no-translate', ''); host.innerHTML = rutaHTML();
      host.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.r) { sel.r = sel.r === b.dataset.r ? '' : b.dataset.r; paintRuta(); var res = host.querySelector('.lv14res'); if (res) scrollTo({ top: res.getBoundingClientRect().top + scrollY - 140, behavior: 'smooth' }); }
        else if (b.dataset.dt != null) { dt = b.dataset.dt; var dn = host.querySelector('.lv14den'); if (dn) dn.outerHTML = denHTML(); }
        else if (b.dataset.w) { var i = sel.who.indexOf(b.dataset.w); if (i > -1) sel.who.splice(i, 1); else sel.who.push(b.dataset.w); paintRuta(); }
        else if (b.dataset.print) { D.body.classList.add('lv14printing'); setTimeout(function () { print(); D.body.classList.remove('lv14printing'); }, 50); }
      });
    }
    if (host.parentNode !== box && !host.closest('#t50dir')) box.insertBefore(host, box.querySelector('.lv14lineh') || lines);
    if (!box.querySelector('.lv14lineh')) { var t = D.createElement('h2'); t.className = 'lv11h2 lv14lineh'; t.textContent = T('Líneas de atención verificadas', 'Verified helplines'); box.insertBefore(t, lines); var n = D.createElement('p'); n.className = 'lv11note lv14lineh2'; n.textContent = T('Verificadas en fuentes oficiales el 29 de octubre de 2026. Toca un número para llamar.', 'Checked against official sources on 29 October 2026. Tap a number to call.'); box.insertBefore(n, lines); }
  }
  function paintRuta() { var h = D.getElementById('lv14ruta'); if (h) h.innerHTML = rutaHTML(); }

  /* ---------------- Preguntas frecuentes ---------------- */
  var FAQ = [
    ['portal', '¿Puedo denunciar o pedir ayuda por este portal?', 'No. El Observatorio no recibe denuncias, solicitudes ni datos personales. Si necesitas ayuda, usa las rutas de atención: 123 en emergencia, 155 para orientación y 122 para denunciar. En «Rutas de atención» encuentras qué puede pasar en cada paso.'],
    ['privacidad', '¿Si denuncio, mi caso aparecerá aquí?', 'Solo como parte de un conteo anónimo. El portal publica cifras agregadas por año, departamento, sexo y categoría. No hay nombres, documentos, direcciones ni coordenadas de personas.'],
    ['privacidad', '¿Por qué algunas cifras aparecen como «menos de 5» o no aparecen?', 'Cuando una celda tiene entre 1 y 4 registros no se muestra, para que nadie pueda reconocer a una persona, sobre todo en municipios pequeños. Esas celdas no se suman a los totales visibles.'],
    ['privacidad', '¿El portal guarda lo que busco o lo que elijo en las rutas?', 'No. Las búsquedas y la selección de rutas funcionan en tu navegador y no se envían. Si compartes el equipo, puedes borrar el historial del navegador o usar una ventana privada.'],
    ['datos', '¿De dónde salen las cifras?', 'De fuentes oficiales: Medicina Legal, DANE (ENUT, GEIH, proyecciones de población), Instituto Nacional de Salud, Fiscalía y otras. Cada gráfico dice su fuente, archivo y fecha de corte. En «Consulta desagregada» puedes ver cómo se procesó cada base.'],
    ['datos', '¿Una cifra baja significa que hay menos violencia?', 'No necesariamente. Muchas mujeres no denuncian ni consultan; eso se llama subregistro. Una cifra baja puede reflejar menos acceso a instituciones, miedo o barreras, no menos violencia. Una cifra que sube puede indicar más confianza para denunciar.'],
    ['datos', '¿Por qué no coinciden las cifras de Medicina Legal, Fiscalía y salud?', 'Cada entidad registra un momento distinto: Medicina Legal cuenta exámenes y valoraciones, la Fiscalía cuenta denuncias y noticias criminales, y el sector salud cuenta casos notificados. Miden cosas diferentes y no deben sumarse.'],
    ['datos', '¿Qué es un «registro»? ¿Es lo mismo que una mujer?', 'No siempre. Un registro es una fila del archivo: una misma mujer puede tener varios registros si fue atendida más de una vez. Por eso hablamos de registros y no de personas únicas.'],
    ['datos', '¿Qué significa «preliminar»?', 'Que la fuente todavía puede ajustar los datos. Los años preliminares o parciales se marcan y no se comparan con años completos sin advertirlo.'],
    ['datos', '¿Un homicidio de una mujer es un feminicidio?', 'No siempre. El feminicidio es un delito específico (Ley 1761 de 2015) que requiere que la muerte ocurra por ser mujer o por motivos de su identidad de género. Solo la investigación judicial lo determina; por eso el portal no convierte homicidios en feminicidios.'],
    ['diversidad', '¿Cómo aparecen las mujeres indígenas, afro, trans, lesbianas o con discapacidad?', 'Varias fuentes registran pertenencia étnica, orientación sexual, identidad de género y discapacidad. La matriz de desagregación muestra qué cortes ya se publican y cuáles existen en la fuente y faltan por procesar, con la misma protección de celdas pequeñas.'],
    ['diversidad', '¿Por qué no hay datos de mi municipio?', 'Por ahora los datos se publican por departamento. Las fuentes traen el municipio, pero publicarlo exige más protección porque las cifras pequeñas pueden identificar personas. Está en la lista de desagregaciones por procesar.'],
    ['diversidad', '¿Puedo pedir que se procese otra desagregación?', 'Sí. La matriz de desagregación muestra lo que es posible con las fuentes actuales. Las solicitudes se canalizarán por el Observatorio cuando se definan sus canales oficiales y pasan por aprobación de la política de protección de datos.'],
    ['uso', '¿Puedo descargar y usar los datos?', 'Sí. Cada vista tiene descarga en CSV con la fuente y los filtros. Cita la fuente original y la fecha de corte, y respeta las advertencias de cada indicador.'],
    ['uso', '¿Cada cuánto se actualiza la información?', 'Depende de cada fuente: algunas publican mensualmente, otras cada año o cada tres años, como la Encuesta Nacional de Uso del Tiempo. La fecha de corte aparece en cada gráfico y en la ficha de cada base.'],
    ['uso', '¿Encontré un error, qué hago?', 'Anota el indicador, el filtro y la fecha de corte que estabas viendo. El equipo del Observatorio revisa los reportes contra la fuente original antes de corregir.'],
    ['uso', '¿El portal sirve sin buena conexión o en otro idioma?', 'El portal funciona en celular, se puede imprimir y está en español e inglés. Las rutas de atención se pueden imprimir o guardar como PDF.']
  ];
  var CATS = [['', 'Todas'], ['portal', 'Ayuda y denuncias'], ['privacidad', 'Privacidad'], ['datos', 'Entender las cifras'], ['diversidad', 'Diversidad y territorio'], ['uso', 'Usar el portal']];
  var fq = { c: '', q: '' };
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function faqList() {
    var q = norm(fq.q), items = FAQ.filter(function (f) { return (!fq.c || f[0] === fq.c) && (!q || norm(f[1] + ' ' + f[2]).indexOf(q) > -1); });
    return items.length ? items.map(function (f, i) { return '<details class="lv14q"' + (i === 0 && !q ? ' open' : '') + '><summary><span>' + E(f[1]) + '</span><i>+</i></summary><p>' + E(f[2]) + '</p></details>'; }).join('') : '<p class="lv11note">' + T('No encontramos preguntas con esas palabras.', 'No questions match.') + '</p>';
  }
  function mountFAQ() {
    var sec = D.getElementById('asistente'); if (!sec || D.getElementById('lv14faq')) return;
    var f = D.createElement('section'); f.id = 'lv14faq'; f.className = 'lv14faq'; f.setAttribute('data-no-translate', '');
    f.innerHTML = '<div class="lv14fhead"><div><div class="eyebrow">' + T('Preguntas frecuentes', 'Frequently asked questions') + '</div><h2>' + T('Lo que las mujeres nos preguntan sobre el Observatorio', 'What women ask us about the Observatory') + '</h2><p>' + T('Cómo se obtienen las cifras, cómo se protege tu identidad y qué hacer si necesitas ayuda.', 'How figures are produced, how your identity is protected and what to do if you need help.') + (en() ? ' <em>Answers in Spanish.</em>' : '') + '</p></div><label class="lv14fsearch">' + ico('search', 18) + '<input type="search" placeholder="' + T('Busca una pregunta: privacidad, municipio, feminicidio…', 'Search a question…') + '" aria-label="' + T('Buscar en preguntas frecuentes', 'Search FAQ') + '"></label></div>' +
      '<div class="lv14fcats">' + CATS.map(function (c) { return '<button type="button" data-c="' + c[0] + '"' + (c[0] === fq.c ? ' class="on"' : '') + '>' + E(c[1]) + '</button>'; }).join('') + '</div><div class="lv14flist">' + faqList() + '</div>' +
      '<div class="lv14fhelp"><b>' + T('¿Necesitas ayuda ahora?', 'Need help now?') + '</b>' + L('123', 'Emergencias') + L('155', 'Orientación') + L('122', 'Fiscalía') + '<button type="button" onclick="go(\'rutas\')">' + T('Encuentra tu ruta →', 'Find your pathway →') + '</button></div>';
    var anchor = sec.querySelector(':scope > p.muted') || sec.querySelector(':scope > h1');
    if (anchor && anchor.nextSibling) sec.insertBefore(f, anchor.nextSibling); else sec.appendChild(f);
    f.addEventListener('click', function (e) { var b = e.target.closest('button[data-c]'); if (!b) return; fq.c = b.dataset.c; f.querySelectorAll('.lv14fcats button').forEach(function (x) { x.classList.toggle('on', x === b); }); f.querySelector('.lv14flist').innerHTML = faqList(); });
    f.querySelector('input').addEventListener('input', function (e) { fq.q = e.target.value; f.querySelector('.lv14flist').innerHTML = faqList(); });
  }

  function tick() { try { mountRuta(); mountFAQ(); } catch (e) { if (W.console) console.warn('lv14', e); } }
  function init() {
    tick();
    var t; new MutationObserver(function (m) { if (m.every(function (x) { var h = D.getElementById('lv14ruta'), f = D.getElementById('lv14faq'); return (h && h.contains(x.target)) || (f && f.contains(x.target)); })) return; clearTimeout(t); t = setTimeout(tick, 120); }).observe(D.querySelector('main') || D.body, { childList: true, subtree: true });
    if (typeof W.setLanguage === 'function') { var sl = W.setLanguage; W.setLanguage = function () { var r = sl.apply(this, arguments); setTimeout(function () { ['lv14ruta', 'lv14faq'].forEach(function (id) { var x = D.getElementById(id); if (x) x.remove(); }); D.querySelectorAll('.lv14lineh,.lv14lineh2').forEach(function (x) { x.remove(); }); tick(); }, 140); return r; }; }
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { setTimeout(init, 260); }); else setTimeout(init, 260);
  W.LV14 = { routes: R, faq: FAQ, open: function (id) { sel.r = id; paintRuta(); } };
})();
