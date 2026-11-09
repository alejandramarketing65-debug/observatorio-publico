/* ==========================================================================
   LIBRES v11 · Contenidos del portal (valores iniciales)
   Administración puede editarlos; los cambios se guardan en este navegador
   (localStorage 'OMD_PORTAL_V11') y alimentan la consulta pública del mismo origen.
   Las cifras de boletines se transcribieron de los PDF entregados en /Documentos.
   ========================================================================== */
window.LV11_DEFAULTS = (function () {
  'use strict';

  /* ---------- Micrositios (subsitios de consulta) ---------- */
  var sites = [
    { id: 'violencias', es: 'Una vida libre de violencias', en: 'A life free from violence', c: '#D33B78', ico: 'shield',
      d: 'Lesiones por violencia de pareja, exámenes por presunto delito sexual, muertes de mujeres por causa externa y casos de violencia de género notificados al sector salud.',
      de: 'Partner violence injuries, forensic exams for alleged sexual offences, deaths of women from external causes and gender-based violence cases notified to health services.',
      themes: ['Vida libre de violencias'], panorama: 'pareja', analyses: ['pareja-serie', 'nofatal-mujeres', 'sexual-sexo', 'ins-notificacion', 'fatal-manera'],
      kpis: ['VBG-04', 'AMP-V07', 'VBG-05', 'AMP-V06'] },
    { id: 'casas-refugio', es: 'Red Nacional de Casas Refugio', en: 'National Shelter Network', c: '#EF6B4A', ico: 'house',
      d: 'Qué son las casas refugio, quién puede acceder, cómo se activan las medidas de atención y qué normas las regulan. No se publican direcciones ni ubicaciones.',
      de: 'What shelters are, who can access them, how support measures are activated and which rules govern them. No addresses or locations are published.',
      themes: ['Casas refugio y respuesta'], analyses: ['pareja-serie'],
      info: [
        ['Qué son', 'Espacios de acogida, protección y atención integral para mujeres víctimas de violencias y, cuando aplica, sus hijas, hijos y personas dependientes (Ley 2215 de 2022).'],
        ['Cómo se accede', 'Por medidas de atención otorgadas por autoridad competente (comisaría de familia, juez o fiscal) o por remisión del sector salud, según los decretos reglamentarios.'],
        ['Qué ofrece', 'Alojamiento temporal, alimentación, acompañamiento psicosocial y jurídico, y articulación con salud, educación y autonomía económica.'],
        ['Qué falta para publicar cifras', 'Directorio validado de casas operativas, cupos y ocupación, con reglas de confidencialidad. La cifra de 59 casas sigue pendiente de respaldo y no se muestra como dato oficial.']
      ] },
    { id: 'lgbtiq', es: 'Mujeres LBT y personas LGBTIQ+: afectación por violencias', en: 'LBT women and LGBTIQ+ people: impact of violence', c: '#B243EA', ico: 'spark', rainbow: true,
      d: 'Violencias por prejuicio contra mujeres lesbianas, bisexuales y trans, y personas con orientaciones sexuales e identidades de género diversas.',
      de: 'Prejudice-based violence against lesbian, bisexual and trans women and people with diverse sexual orientations and gender identities.',
      themes: ['Diversidades y no discriminación'], analyses: [],
      info: [
        ['Por qué no hay cifras aún', 'Los registros recibidos solo traen «sexo registrado» (hombre, mujer, indeterminado). El Observatorio no infiere identidad de género ni orientación sexual a partir de ese campo.'],
        ['Qué se necesita', 'Fuentes con variables de orientación sexual e identidad de género (Medicina Legal, Fiscalía, SIVIGILA) y acuerdos con organizaciones que documentan violencias por prejuicio.'],
        ['Fuentes complementarias', 'Informes de Caribe Afirmativo y Colombia Diversa: documentación de sociedad civil, con método y cobertura propios.']
      ] },
    { id: 'autonomia', es: 'Autonomía económica', en: 'Economic autonomy', c: '#22A37A', ico: 'trend',
      d: 'Participación laboral, ocupación, desocupación y brechas entre mujeres y hombres; trabajo remunerado y no remunerado.',
      de: 'Labour participation, employment, unemployment and gender gaps; paid and unpaid work.',
      themes: ['Autonomía económica'], topic: 'autonomia', analyses: ['geih-td', 'geih-brechas', 'enut-participacion'],
      kpis: ['ECO-01', 'ECO-02', 'ECO-03'] },
    { id: 'participacion', es: 'Participación social y política', en: 'Social and political participation', c: '#5B5BD6', ico: 'vote',
      d: 'Mujeres en cargos de decisión, listas y corporaciones de elección popular, y violencia contra las mujeres en política.',
      de: 'Women in decision-making posts, electoral lists and elected bodies, and violence against women in politics.',
      themes: ['Participación y decisiones'], analyses: [],
      info: [
        ['Marco', 'Ley 581 de 2000 (cuotas en cargos directivos), Ley 1475 de 2011 (cuota en listas) y Ley 2453 de 2025 (violencia contra las mujeres en política).'],
        ['Qué se necesita', 'Resultados electorales por sexo (Registraduría), informe de Ley de cuotas (Función Pública) y registros de violencia política.']
      ] },
    { id: 'educacion', es: 'Educación y TIC', en: 'Education and ICT', c: '#2F6FDB', ico: 'book',
      d: 'Acceso, permanencia y graduación de mujeres en la educación; participación en áreas STEM y brecha digital.',
      de: 'Women’s access, retention and graduation in education; STEM participation and the digital gap.',
      themes: ['Educación y brecha digital'], analyses: [],
      info: [['Qué se necesita', 'Bases consolidadas SNIES y SIMAT por sexo, y la encuesta de TIC del DANE para la brecha digital.']] },
    { id: 'red-observatorios', es: 'Red Nacional de Observatorios', en: 'National Network of Observatories', c: '#1A82B9', ico: 'network',
      d: 'Observatorios nacionales, territoriales, académicos y de sociedad civil que producen información sobre las mujeres en todas sus diversidades.',
      de: 'National, local, academic and civil-society observatories producing information on women in all their diversity.',
      themes: [], analyses: ['obs-red'], link: 'red',
      info: [
        ['Base legal', 'El Observatorio de Asuntos de Género (OAG) fue creado con carácter permanente por la Ley 1009 de 2006.'],
        ['Cómo se articula', 'Intercambio de boletines e indicadores mediante acuerdos documentados. La inclusión en el directorio no supone convenio ni intercambio de microdatos.']
      ] },
    { id: 'comite-1257', es: 'Comité de Seguimiento a la Ley 1257 de 2008', en: 'Law 1257/2008 Monitoring Committee', c: '#9E2C5A', ico: 'scale',
      d: 'Instancia que hace seguimiento a la implementación y cumplimiento de la ley de sensibilización, prevención y sanción de las violencias contra las mujeres.',
      de: 'Body monitoring implementation of the law on awareness, prevention and punishment of violence against women.',
      themes: [], analyses: ['ins-notificacion', 'nofatal-mujeres', 'pareja-serie'],
      info: [
        ['Base legal', 'Artículo 35 de la Ley 1257 de 2008.'],
        ['Quiénes lo crean', 'La Consejería para la Equidad de la Mujer (hoy la entidad rectora de la política de mujeres), en coordinación con la Procuraduría General de la Nación y la Defensoría del Pueblo.'],
        ['Participación', 'Debe contar con la participación de organizaciones de mujeres.'],
        ['Informe', 'La ley ordena un informe anual al Congreso sobre la situación de violencia contra las mujeres: manifestaciones, magnitud, avances y retrocesos, consecuencias e impacto.'],
        ['Qué aporta el Observatorio', 'Series de violencias, medidas de atención y casas refugio para alimentar el informe anual.']
      ] },
    { id: 'comite-1719', es: 'Comité de Seguimiento · violencia sexual en el marco del conflicto armado', en: 'Monitoring Committee · conflict-related sexual violence', c: '#7A2E8E', ico: 'dove',
      d: 'Seguimiento a las obligaciones de prevención, atención, investigación y reparación de la violencia sexual, en especial la ocurrida en el conflicto armado (Ley 1719 de 2014).',
      de: 'Monitoring of prevention, care, investigation and reparation duties for sexual violence, especially conflict-related (Law 1719/2014).',
      themes: ['Paz y conflicto armado'], analyses: ['sexual-sexo', 'ins-notificacion'],
      info: [
        ['Base legal', 'Artículo 32 de la Ley 1719 de 2014.'],
        ['Funciones', 'Evaluar el cumplimiento de las obligaciones de las instituciones responsables de la prevención, atención, investigación y reparación.'],
        ['Sesiones', 'Trimestrales.'],
        ['Invitados permanentes', 'Delegados de ministerios y entidades, dos representantes a la Cámara, dos senadores y tres representantes de víctimas. Pueden participar como observadores representantes de Naciones Unidas.']
      ] },
    { id: 'comites-tecnico-juridicos', es: 'Comités Técnico-Jurídicos para la Investigación de la Violencia Sexual', en: 'Technical-Legal Committees on Sexual Violence Investigation', c: '#4B2A6B', ico: 'gavel',
      d: 'Comités de la Fiscalía creados por la Ley 1719 de 2014 para analizar, monitorear y definir técnicas y estrategias de investigación de la violencia sexual.',
      de: 'Prosecution committees created by Law 1719/2014 to analyse, monitor and define investigation strategies for sexual violence.',
      themes: [], analyses: ['sexual-sexo'],
      info: [
        ['Base legal', 'Artículo 21 de la Ley 1719 de 2014.'],
        ['Objetivo', 'Análisis, monitoreo y definición de técnicas y estrategias de investigación de la violencia sexual.'],
        ['Activación', 'De oficio por la Fiscalía o a solicitud de la víctima, su representante, la Defensoría del Pueblo u otra organización acompañante.'],
        ['Integrantes', 'Personas con experiencia o formación en derechos humanos de mujeres, niñas, niños y adolescentes.'],
        ['Qué se necesita para medir', 'Registros de la Fiscalía sobre activaciones y casos acompañados, mediante convenio y con datos agregados.']
      ] },
    { id: 'pan-1325', es: 'Construcción de paz · PAN 1325 (Mujeres, Paz y Seguridad)', en: 'Peacebuilding · NAP 1325 (Women, Peace and Security)', c: '#3A86C8', ico: 'leaf',
      d: 'Primer Plan de Acción Nacional de la Resolución 1325 del Consejo de Seguridad de la ONU: participación de las mujeres en la paz, protección y reparación.',
      de: 'First National Action Plan for UN Security Council Resolution 1325: women’s participation in peace, protection and reparation.',
      themes: ['Paz y conflicto armado'], analyses: [],
      info: [
        ['Presentación', '30 de noviembre de 2024, por el Gobierno nacional (Viceministerio de las Mujeres).'],
        ['Vigencia', 'Diez años, hasta 2034, con un comité de seguimiento.'],
        ['Alcance', '105 acciones a cargo de 33 entidades, con metas, indicadores y presupuesto.'],
        ['Objetivos', 'Participación; salud y bienestar integral; vida libre de violencias; justicia y reparación; autonomía económica; protección en desplazamiento forzado; enfoque de género en la acción del Estado.']
      ] },
    { id: 'salud-dsr', es: 'Salud, derechos sexuales y derechos reproductivos', en: 'Health and sexual and reproductive rights', c: '#17A58C', ico: 'health',
      d: 'Atención en salud de las violencias, salud sexual y reproductiva, interrupción voluntaria del embarazo y parto digno.',
      de: 'Health care for violence, sexual and reproductive health, abortion rights and dignified childbirth.',
      themes: ['Salud y derechos sexuales'], topic: 'salud', panorama: 'fatal', analyses: ['ins-notificacion', 'fatal-manera'],
      kpis: ['VBG-05', 'AMP-V06'] },
    { id: 'cuidados', es: 'Cuidados y uso del tiempo', en: 'Care and time use', c: '#E0A800', ico: 'clock',
      d: 'Trabajo doméstico y de cuidado no remunerado: quién lo hace, cuánto tiempo toma y cómo cambia entre territorios.',
      de: 'Unpaid domestic and care work: who does it, how much time it takes and how it varies by territory.',
      themes: ['Cuidado y uso del tiempo'], topic: 'cuidados', panorama: 'enut', analyses: ['enut-horas', 'enut-participacion', 'enut-departamentos'],
      kpis: ['CUI-01', 'CUI-02', 'CUI-04'] },
    { id: 'demografia', es: 'Caracterización demográfica de las mujeres en todas sus diversidades', en: 'Demographic profile of women in all their diversity', c: '#A05CC8', ico: 'people',
      d: 'Cuántas son, dónde viven y cómo se distribuyen las mujeres por territorio y zona.',
      de: 'How many women there are, where they live and how they are distributed by territory and area.',
      themes: ['Demografía y diversidades'], analyses: ['poblacion-mujeres'],
      kpis: ['DEM-01'] },
    { id: 'rutas', es: 'Rutas de atención', en: 'Support pathways', c: '#E0315B', ico: 'route',
      d: 'Líneas de orientación y pasos para buscar atención en salud, protección, justicia y acogida.',
      de: 'Helplines and steps to seek health care, protection, justice and shelter.',
      themes: [], analyses: [], link: 'rutas' },
    { id: 'etnico', es: 'Pertenencia étnico-racial: mujeres afrodescendientes, negras, raizales, palenqueras, indígenas y Rrom', en: 'Ethnic and racial belonging: Afro-descendant, Black, Raizal, Palenquera, Indigenous and Roma women', c: '#A0522D', ico: 'hands',
      d: 'Brechas y violencias que afectan a las mujeres de los pueblos y comunidades étnicas, con enfoque diferencial e interseccional.',
      de: 'Gaps and violence affecting women from ethnic peoples and communities, with a differential and intersectional approach.',
      themes: [], analyses: [],
      info: [
        ['Por qué no hay cifras aún', 'Los agregados recibidos no traen pertenencia étnica. Se requiere la variable en cada fuente y reglas de protección para celdas pequeñas.'],
        ['Fuentes a integrar', 'DANE (CNPV 2018 y encuestas con enfoque étnico), RUV para víctimas del conflicto y SIVIGILA con variable étnica.'],
        ['Marco', 'Ley 70 de 1993, Ley 21 de 1991 (Convenio 169 de la OIT), Decretos Ley 4633 y 4635 de 2011, y Auto 092 de 2008 de la Corte Constitucional.']
      ] }
  ];

  /* ---------- Derechos de las mujeres ---------- */
  var rights = [
    { id: 'vida', es: 'Vida libre de violencias', en: 'Life free from violence', d: 'En el ámbito público y privado: física, psicológica, sexual, económica y patrimonial.' },
    { id: 'igualdad', es: 'Igualdad y no discriminación', en: 'Equality and non-discrimination', d: 'Mismas oportunidades y trato, con medidas afirmativas cuando se requieran.' },
    { id: 'participacion', es: 'Participación y representación', en: 'Participation and representation', d: 'En cargos de decisión, listas y corporaciones públicas, sin violencia política.' },
    { id: 'trabajo', es: 'Trabajo digno e igualdad salarial', en: 'Decent work and equal pay', d: 'Igual remuneración por igual trabajo, protección de la maternidad y reconocimiento del cuidado.' },
    { id: 'dsr', es: 'Salud y derechos sexuales y reproductivos', en: 'Health and sexual and reproductive rights', d: 'Decidir sobre el propio cuerpo, acceso a servicios y parto digno.' },
    { id: 'justicia', es: 'Acceso a la justicia y reparación', en: 'Access to justice and reparation', d: 'Investigación con debida diligencia, protección y reparación integral.' },
    { id: 'diversidad', es: 'Reconocimiento de la diversidad', en: 'Recognition of diversity', d: 'Orientación sexual, identidad de género, pertenencia étnica, discapacidad, ruralidad y curso de vida.' },
    { id: 'paz', es: 'Paz y seguridad', en: 'Peace and security', d: 'Participación en la construcción de paz y protección en el conflicto y el desplazamiento.' }
  ];

  /* ---------- Normativa ---------- */
  var FP = function (i) { return 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=' + i; };
  var SUIN = 'https://www.suin-juriscol.gov.co/';
  var norms = [
    { id: 'cp91', tipo: 'Constitución', n: 'Constitución Política de 1991 (arts. 13, 40, 43 y 53)', y: 1991, d: 'Igualdad y no discriminación, participación de las mujeres en la administración pública, igualdad de derechos y protección especial, y trabajo digno.', de: 'Equality, women’s participation in public administration, equal rights and decent work.', rights: ['igualdad', 'participacion', 'trabajo'], sites: ['violencias', 'participacion', 'autonomia'], url: SUIN },
    { id: 'cedaw', tipo: 'Tratado internacional', n: 'Ley 51 de 1981 · CEDAW', y: 1981, d: 'Aprueba la Convención sobre la eliminación de todas las formas de discriminación contra la mujer.', de: 'Approves CEDAW.', rights: ['igualdad'], sites: ['violencias', 'participacion', 'autonomia', 'educacion'], url: 'https://www.ohchr.org/es/instruments-mechanisms/instruments/convention-elimination-all-forms-discrimination-against-women' },
    { id: 'ley21', tipo: 'Tratado internacional', n: 'Ley 21 de 1991 · Convenio 169 de la OIT', y: 1991, d: 'Aprueba el Convenio sobre pueblos indígenas y tribales: consulta previa y derechos colectivos.', de: 'Approves ILO Convention 169 on indigenous and tribal peoples.', rights: ['diversidad'], sites: ['etnico'], url: SUIN },
    { id: 'belem', tipo: 'Tratado internacional', n: 'Ley 248 de 1995 · Belém do Pará', y: 1995, d: 'Aprueba la Convención Interamericana para prevenir, sancionar y erradicar la violencia contra la mujer.', de: 'Approves the Inter-American Convention on violence against women.', rights: ['vida'], sites: ['violencias', 'comite-1257'], url: 'https://www.oas.org/juridico/spanish/tratados/a-61.html' },
    { id: 'ley70', tipo: 'Ley', n: 'Ley 70 de 1993', y: 1993, d: 'Reconoce los derechos de las comunidades negras: territorio, identidad cultural y desarrollo.', de: 'Recognises the rights of Black communities.', rights: ['diversidad'], sites: ['etnico'], url: SUIN },
    { id: 'ley294', tipo: 'Ley', n: 'Ley 294 de 1996', y: 1996, d: 'Normas para prevenir, remediar y sancionar la violencia intrafamiliar; medidas de protección.', de: 'Prevents and punishes domestic violence; protection orders.', rights: ['vida', 'justicia'], sites: ['violencias', 'rutas'], url: SUIN },
    { id: 'ley581', tipo: 'Ley', n: 'Ley 581 de 2000 · Ley de cuotas', y: 2000, d: 'Participación mínima del 30 % de mujeres en los cargos de máximo nivel decisorio del Estado.', de: 'At least 30% women in top public decision-making posts.', rights: ['participacion'], sites: ['participacion'], url: 'https://www1.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=5367' },
    { id: 'ley731', tipo: 'Ley', n: 'Ley 731 de 2002 · Mujer rural', y: 2002, d: 'Mejora la calidad de vida de las mujeres rurales: acceso a tierra, crédito y participación.', de: 'Improves rural women’s quality of life.', rights: ['trabajo', 'igualdad'], sites: ['autonomia'], url: SUIN },
    { id: 'ley823', tipo: 'Ley', n: 'Ley 823 de 2003', y: 2003, d: 'Normas sobre igualdad de oportunidades para las mujeres.', de: 'Equal opportunities for women.', rights: ['igualdad', 'trabajo'], sites: ['autonomia', 'educacion'], url: SUIN },
    { id: 'ley1009', tipo: 'Ley', n: 'Ley 1009 de 2006', y: 2006, d: 'Crea con carácter permanente el Observatorio de Asuntos de Género (OAG).', de: 'Creates the permanent Gender Affairs Observatory.', rights: ['igualdad'], sites: ['red-observatorios'], url: FP(18859) },
    { id: 'c355', tipo: 'Sentencia', n: 'Sentencia C-355 de 2006', y: 2006, d: 'Despenaliza la interrupción voluntaria del embarazo en tres causales.', de: 'Decriminalises abortion on three grounds.', rights: ['dsr'], sites: ['salud-dsr'], url: 'https://www.corteconstitucional.gov.co/relatoria/2006/C-355-06.htm' },
    { id: 'auto092', tipo: 'Auto', n: 'Auto 092 de 2008 · Corte Constitucional', y: 2008, d: 'Protección de los derechos de las mujeres víctimas del desplazamiento forzado; reconoce riesgos de género en el conflicto.', de: 'Protects women displaced by the armed conflict.', rights: ['paz', 'justicia', 'diversidad'], sites: ['pan-1325', 'comite-1719', 'etnico'], url: SUIN },
    { id: 'ley1257', tipo: 'Ley', n: 'Ley 1257 de 2008', y: 2008, d: 'Sensibilización, prevención y sanción de las violencias y la discriminación contra las mujeres; medidas de protección y atención. El art. 35 crea el comité de seguimiento.', de: 'Awareness, prevention and punishment of violence against women; art. 35 creates the monitoring committee.', rights: ['vida', 'justicia', 'igualdad'], sites: ['violencias', 'comite-1257', 'rutas', 'casas-refugio'], url: FP(34054) },
    { id: 'ley1413', tipo: 'Ley', n: 'Ley 1413 de 2010 · Economía del cuidado', y: 2010, d: 'Incluye la economía del cuidado en las cuentas nacionales; origen de la ENUT.', de: 'Includes the care economy in national accounts; basis of the time-use survey.', rights: ['trabajo'], sites: ['cuidados', 'autonomia'], url: SUIN },
    { id: 'ley1448', tipo: 'Ley', n: 'Ley 1448 de 2011 · Víctimas y restitución de tierras', y: 2011, d: 'Atención, asistencia y reparación integral a las víctimas del conflicto armado, con enfoque diferencial.', de: 'Assistance and reparation for conflict victims.', rights: ['justicia', 'paz'], sites: ['pan-1325', 'comite-1719'], url: SUIN },
    { id: 'ley1475', tipo: 'Ley', n: 'Ley 1475 de 2011', y: 2011, d: 'Reglas de los partidos; cuota mínima de 30 % de mujeres en listas a corporaciones de elección popular.', de: 'Party rules; 30% minimum of women on electoral lists.', rights: ['participacion'], sites: ['participacion'], url: SUIN },
    { id: 'ley1482', tipo: 'Ley', n: 'Ley 1482 de 2011 · Antidiscriminación', y: 2011, d: 'Sanciona actos de discriminación por raza, etnia, religión, sexo u orientación sexual, entre otros.', de: 'Punishes discrimination on grounds including race, sex and sexual orientation.', rights: ['igualdad', 'diversidad'], sites: ['lgbtiq', 'etnico'], url: SUIN },
    { id: 'ley1496', tipo: 'Ley', n: 'Ley 1496 de 2011 · Igualdad salarial', y: 2011, d: 'Garantiza la igualdad salarial y de remuneración entre mujeres y hombres.', de: 'Equal pay between women and men.', rights: ['trabajo', 'igualdad'], sites: ['autonomia'], url: SUIN },
    { id: 'dl4633', tipo: 'Decreto', n: 'Decretos Ley 4633 y 4635 de 2011', y: 2011, d: 'Medidas de asistencia y reparación para víctimas de pueblos indígenas y de comunidades negras, afrocolombianas, raizales y palenqueras.', de: 'Reparation for Indigenous and Afro-Colombian victims.', rights: ['justicia', 'diversidad'], sites: ['etnico', 'pan-1325'], url: SUIN },
    { id: 'ley1542', tipo: 'Ley', n: 'Ley 1542 de 2012', y: 2012, d: 'Elimina el carácter querellable y desistible de la violencia intrafamiliar y la inasistencia alimentaria.', de: 'Domestic violence prosecuted without complaint requirement.', rights: ['vida', 'justicia'], sites: ['violencias'], url: SUIN },
    { id: 'ley1719', tipo: 'Ley', n: 'Ley 1719 de 2014', y: 2014, d: 'Acceso a la justicia de víctimas de violencia sexual, en especial en el conflicto armado. Art. 21: comités técnico-jurídicos; art. 32: comité de seguimiento.', de: 'Access to justice for sexual violence victims; art. 21 technical-legal committees; art. 32 monitoring committee.', rights: ['justicia', 'vida', 'paz'], sites: ['comite-1719', 'comites-tecnico-juridicos', 'violencias'], url: FP(57716) },
    { id: 'ley1761', tipo: 'Ley', n: 'Ley 1761 de 2015 · Rosa Elvira Cely', y: 2015, d: 'Tipifica el feminicidio como delito autónomo.', de: 'Makes femicide a stand-alone crime.', rights: ['vida', 'justicia'], sites: ['violencias'], url: FP(65337) },
    { id: 'ley1773', tipo: 'Ley', n: 'Ley 1773 de 2016', y: 2016, d: 'Agrava las sanciones por lesiones con agentes químicos, ácido y sustancias similares.', de: 'Harsher penalties for acid attacks.', rights: ['vida'], sites: ['violencias'], url: SUIN },
    { id: 'ley1822', tipo: 'Ley', n: 'Ley 1822 de 2017', y: 2017, d: 'Amplía la licencia de maternidad a 18 semanas.', de: 'Extends maternity leave to 18 weeks.', rights: ['trabajo', 'dsr'], sites: ['autonomia', 'cuidados'], url: SUIN },
    { id: 'd762', tipo: 'Decreto', n: 'Decreto 762 de 2018 · Política pública LGBTI', y: 2018, d: 'Adopta la política pública para garantizar los derechos de las personas de los sectores sociales LGBTI.', de: 'National LGBTI rights policy.', rights: ['diversidad', 'igualdad'], sites: ['lgbtiq'], url: 'https://www1.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=86303' },
    { id: 'd1630', tipo: 'Decreto', n: 'Decreto 1630 de 2019', y: 2019, d: 'Medidas de atención a mujeres víctimas de violencia; leer con sus modificaciones posteriores.', de: 'Support measures for women victims of violence.', rights: ['vida', 'justicia'], sites: ['casas-refugio', 'rutas'], url: FP(100137) },
    { id: 'd1710', tipo: 'Decreto', n: 'Decreto 1710 de 2020', y: 2020, d: 'Mecanismo articulador para el abordaje integral de las violencias por razones de sexo y género.', de: 'Coordination mechanism for gender-based violence.', rights: ['vida'], sites: ['violencias', 'rutas', 'comite-1257'], url: FP(153846) },
    { id: 'ley2126', tipo: 'Ley', n: 'Ley 2126 de 2021', y: 2021, d: 'Regula la creación, conformación y funcionamiento de las comisarías de familia.', de: 'Regulates family police stations (comisarías de familia).', rights: ['vida', 'justicia'], sites: ['rutas', 'violencias'], url: FP(168066) },
    { id: 'c055', tipo: 'Sentencia', n: 'Sentencia C-055 de 2022', y: 2022, d: 'Interrupción voluntaria del embarazo sin causales hasta la semana 24; después, bajo las causales de la C-355 de 2006.', de: 'Abortion on request up to week 24.', rights: ['dsr'], sites: ['salud-dsr'], url: 'https://www.corteconstitucional.gov.co/relatoria/2022/C-055-22.htm' },
    { id: 't967', tipo: 'Sentencia', n: 'Sentencia T-967 de 2014', y: 2014, d: 'Reconoce la violencia psicológica y económica en el hogar y exige a los jueces de familia decidir con perspectiva de género.', de: 'Recognises psychological and economic violence at home; family judges must apply a gender perspective.', rights: ['vida', 'justicia'], sites: ['violencias', 'rutas'], url: 'https://www.corteconstitucional.gov.co/relatoria/2014/T-967-14.htm' },
    { id: 't878', tipo: 'Sentencia', n: 'Sentencia T-878 de 2014', y: 2014, d: 'Las autoridades y los empleadores deben actuar con perspectiva de género para prevenir y atender la violencia contra las mujeres.', de: 'Authorities and employers must act with a gender perspective against violence towards women.', rights: ['vida', 'trabajo', 'justicia'], sites: ['violencias', 'autonomia'], url: 'https://www.corteconstitucional.gov.co/relatoria/2014/T-878-14.htm' },
    { id: 'c754', tipo: 'Sentencia', n: 'Sentencia C-754 de 2015', y: 2015, d: 'Hace obligatorio aplicar el protocolo y el modelo de atención en salud para víctimas de violencia sexual.', de: 'Makes the health care protocol for sexual violence victims mandatory.', rights: ['dsr', 'vida'], sites: ['salud-dsr', 'comite-1719'], url: 'https://www.corteconstitucional.gov.co/relatoria/2015/C-754-15.htm' },
    { id: 'c297', tipo: 'Sentencia', n: 'Sentencia C-297 de 2016', y: 2016, d: 'Precisa cómo se interpreta el delito de feminicidio de la Ley 1761 de 2015 ("Rosa Elvira Cely").', de: 'Clarifies the femicide offence of Law 1761 of 2015.', rights: ['vida', 'justicia'], sites: ['violencias', 'comites-tecnico-juridicos'], url: 'https://www.corteconstitucional.gov.co/relatoria/2016/C-297-16.htm' },
    { id: 'su080', tipo: 'Sentencia', n: 'Sentencia SU-080 de 2020', y: 2020, d: 'Las mujeres víctimas de violencia intrafamiliar pueden pedir reparación dentro de los procesos de familia.', de: 'Victims of domestic violence may claim reparation within family proceedings.', rights: ['vida', 'justicia'], sites: ['violencias', 'rutas'], url: 'https://www.corteconstitucional.gov.co/relatoria/2020/SU080-20.htm' },
    { id: 'conpes4080', tipo: 'Política pública', n: 'CONPES 4080 de 2022', y: 2022, d: 'Política Pública de Equidad de Género para las Mujeres: hacia el desarrollo sostenible del país.', de: 'National gender equity policy for women.', rights: ['igualdad', 'trabajo', 'participacion', 'vida'], sites: ['autonomia', 'participacion', 'violencias', 'educacion'], url: 'https://sidn.ramajudicial.gov.co/SIDN/NORMATIVA/TEXTOS_COMPLETOS/91_1_DOCUMENTO CONPES/Documento Conpes 4080 de 2022.pdf' },
    { id: 'ley2215', tipo: 'Ley', n: 'Ley 2215 de 2022 · Casas refugio', y: 2022, d: 'Establece las casas refugio: objeto, funciones, operación, responsabilidades y Red Nacional.', de: 'Establishes shelters and the National Shelter Network.', rights: ['vida', 'justicia'], sites: ['casas-refugio', 'rutas'], url: 'https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=124940' },
    { id: 'ley2244', tipo: 'Ley', n: 'Ley 2244 de 2022 · Parto digno', y: 2022, d: 'Reconoce los derechos durante el embarazo, trabajo de parto, parto y posparto: parto digno, respetado y humanizado.', de: 'Rights to dignified, respectful childbirth.', rights: ['dsr'], sites: ['salud-dsr'], url: 'https://sidn.ramajudicial.gov.co/SIDN/NORMATIVA/TEXTOS_COMPLETOS/7_LEYES/LEYES 2022/Ley 2244 de 2022 (Ley de Parto Digno, Respetado y Humanizado).pdf' },
    { id: 'r1884', tipo: 'Resolución', n: 'Resolución 1884 de 2023 · MinSalud', y: 2023, d: 'Criterios de distribución y asignación de recursos para las medidas de atención.', de: 'Resource allocation for support measures.', rights: ['vida'], sites: ['casas-refugio'], url: 'https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%20No%201884%20de%202023.pdf' },
    { id: 'd0075', tipo: 'Decreto', n: 'Decreto 0075 de 2024', y: 2024, d: 'Actualiza las medidas de atención y los supuestos de acceso desde el sector salud.', de: 'Updates support measures accessed through health services.', rights: ['vida', 'dsr'], sites: ['casas-refugio', 'salud-dsr'], url: 'https://www1.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=228590' },
    { id: 'ley2365', tipo: 'Ley', n: 'Ley 2365 de 2024 · Acoso sexual', y: 2024, d: 'Medidas de prevención, protección y atención del acoso sexual en el ámbito laboral y en las instituciones de educación superior.', de: 'Prevention of sexual harassment at work and in higher education.', rights: ['vida', 'trabajo'], sites: ['autonomia', 'educacion', 'violencias'], url: 'https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=157481' },
    { id: 'pan1325', tipo: 'Política pública', n: 'Plan de Acción Nacional de la Resolución 1325 (2024-2034)', y: 2024, d: 'Primer plan nacional de Mujeres, Paz y Seguridad: 105 acciones de 33 entidades.', de: 'First national Women, Peace and Security plan.', rights: ['paz', 'participacion', 'justicia'], sites: ['pan-1325'], url: 'https://cancilleria.gov.co/sala-de-prensa/noticias/colombia-presenta-ante-la-comunidad-internacional-el-plan-de-accion-nacional-mas-participativo-del-mundo-en-mujeres-paz-y-seguridad' },
    { id: 'ley2453', tipo: 'Ley', n: 'Ley 2453 de 2025 · Violencia política', y: 2025, d: 'Prevención, atención y sanción de la violencia contra las mujeres en la vida política.', de: 'Prevention and punishment of violence against women in politics.', rights: ['participacion', 'vida'], sites: ['participacion'], url: 'https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=177519' }
  ];

  /* ---------- Observatorios ---------- */
  var obs = [
    { id: 'oag', n: 'Observatorio de Asuntos de Género (OAG)', e: 'Entidad rectora de la política de mujeres (antes Consejería Presidencial para la Equidad de la Mujer)', amb: 'Nacional', foc: ['red-observatorios', 'violencias', 'autonomia'], url: FP(18859), d: 'Creado por la Ley 1009 de 2006. Referente nacional para la articulación de la Red.' },
    { id: 'ocm', n: 'Observatorio Colombiano de Mujeres', e: 'Consejería Presidencial para la Equidad de la Mujer', amb: 'Nacional', foc: ['red-observatorios'], url: null, d: 'Referenciado en el directorio de observatorios de la Alcaldía de Medellín; verificar enlace vigente.' },
    { id: 'sivige', n: 'SIVIGE · Sistema Integrado de Información sobre Violencias de Género', e: 'Ministerio de Salud y Protección Social', amb: 'Nacional', foc: ['violencias', 'salud-dsr'], url: 'https://www.minsalud.gov.co/salud/publica/ssr/Paginas/violencias-de-genero2.aspx', d: 'Integra información sectorial sobre violencias de género.' },
    { id: 'inmlcf', n: 'Medicina Legal · Forensis y boletines', e: 'Instituto Nacional de Medicina Legal y Ciencias Forenses', amb: 'Nacional', foc: ['violencias', 'salud-dsr'], url: 'https://www.medicinalegal.gov.co/cifras-estadisticas/forensis', d: 'Lesiones fatales y no fatales examinadas en el sistema médico-legal.' },
    { id: 'uariv', n: 'Unidad para las Víctimas · Datos para la Paz', e: 'Unidad para la Atención y Reparación Integral a las Víctimas', amb: 'Nacional', foc: ['pan-1325', 'comite-1719'], url: 'https://datospaz.unidadvictimas.gov.co/reportes/', d: 'Registro Único de Víctimas: mujeres víctimas del conflicto por hecho victimizante.' },
    { id: 'dane-ed', n: 'DANE · enfoque diferencial e interseccional', e: 'Departamento Administrativo Nacional de Estadística', amb: 'Nacional', foc: ['demografia', 'etnico', 'autonomia', 'cuidados'], url: 'https://www.dane.gov.co/index.php/estadisticas-por-tema/enfoque-diferencial-e-interseccional/enfoque-diferencial-e-interseccional-publicaciones', d: 'Estadísticas de población, mercado laboral, uso del tiempo y grupos étnicos.' },
    { id: 'omeg', n: 'OMEG · Observatorio de Mujeres y Equidad de Género de Bogotá', e: 'Secretaría Distrital de la Mujer', amb: 'Territorial', dept: '11', foc: ['violencias', 'autonomia', 'participacion'], url: 'https://sdmujer.gov.co/noticia/news/omeg-datos-y-acciones-que-transforman-la-vida-de-mujeres-en-bogota', d: 'Tableros, mapas y análisis por derechos de las mujeres en Bogotá.' },
    { id: 'antioquia', n: 'Observatorio de Asuntos de Mujer y Género de Antioquia', e: 'Secretaría de las Mujeres · Gobernación de Antioquia', amb: 'Territorial', dept: '05', foc: ['violencias', 'autonomia', 'participacion'], url: 'https://mujeresantioquia.gov.co/index.php/es/observatorio/que-es', d: 'Información departamental sobre la situación de las mujeres antioqueñas.' },
    { id: 'medellin', n: 'Sistema de información para la equidad de género de Medellín (SICGEM)', e: 'Secretaría de las Mujeres · Alcaldía de Medellín', amb: 'Territorial', dept: '05', foc: ['red-observatorios'], url: 'https://www.medellin.gov.co/es/secretaria-mujeres/sicgem/sistemas-de-informacion-u-observatorios/', d: 'Publica un directorio de observatorios de mujeres y género nacionales e internacionales.' },
    { id: 'ogen', n: 'OGEN · Observatorio de Género del Valle del Cauca', e: 'Gobernación del Valle del Cauca', amb: 'Territorial', dept: '76', foc: ['violencias', 'autonomia'], url: 'https://ogen.valledelcauca.gov.co/nosotros', d: 'Indicadores y análisis de género del departamento.' },
    { id: 'cundinamarca', n: 'Observatorio de Asuntos de Mujer y Género de Cundinamarca', e: 'Gobernación de Cundinamarca', amb: 'Territorial', dept: '25', foc: ['violencias', 'autonomia'], url: 'https://www.cundinamarca.gov.co/observatorios/oamg/datos-de-genero/indicadores-estrategicos', d: 'Indicadores estratégicos para el seguimiento a derechos.' },
    { id: 'casanare', n: 'Observatorio de Género y Derechos de las Mujeres de Casanare', e: 'Secretaría de la Mujer · Gobernación de Casanare', amb: 'Territorial', dept: '85', foc: ['violencias'], url: null, d: 'Referenciado en el directorio de Medellín; verificar enlace vigente.' },
    { id: 'oem', n: 'Observatorio para la Equidad de las Mujeres (OEM)', e: 'Universidad Icesi y Fundación WWB Colombia', amb: 'Académico', dept: '76', foc: ['autonomia', 'cuidados'], url: 'https://www.icesi.edu.co/oem/', d: 'Análisis de autonomía económica y brechas de género.' },
    { id: 'urosario', n: 'Observatorio de Asuntos de Género y Diversidades', e: 'Universidad del Rosario', amb: 'Académico', dept: '11', foc: ['lgbtiq', 'participacion'], url: null, d: 'Referenciado en el directorio de Medellín; verificar enlace vigente.' },
    { id: 'unal', n: 'Observatorio de Asuntos de Género (OAG-UN)', e: 'Universidad Nacional de Colombia', amb: 'Académico', dept: '11', foc: ['educacion'], url: null, d: 'Referenciado en el directorio de Medellín; verificar enlace vigente.' },
    { id: 'udenar', n: 'Observatorio de Género de Nariño', e: 'Universidad de Nariño', amb: 'Académico', dept: '52', foc: ['violencias', 'etnico'], url: null, d: 'Referenciado en el directorio de Medellín; verificar enlace vigente.' },
    { id: 'feminicidios', n: 'Observatorio de Feminicidios Colombia', e: 'Red Feminista Antimilitarista', amb: 'Sociedad civil', foc: ['violencias'], url: 'https://www.observatoriofeminicidioscolombia.org/', d: 'Boletines de feminicidios con método y cobertura propios.' },
    { id: 'moe', n: 'Observatorio de Violencia contra las Mujeres en Política', e: 'Misión de Observación Electoral (MOE)', amb: 'Sociedad civil', foc: ['participacion'], url: 'https://moe.org.co/', d: 'Anunciado en 2021 con apoyo de cooperación internacional y entidades del Estado.' },
    { id: 'caribe', n: 'Caribe Afirmativo · derechos humanos de personas LGBTIQ+', e: 'Corporación Caribe Afirmativo', amb: 'Sociedad civil', foc: ['lgbtiq', 'violencias'], url: 'https://www.caribeafirmativo.lgbt/marchamos-por-las-que-ya-no-estan-42-mujeres-lesbianas-bisexuales-y-trans-fueron-asesinadas-en-colombia-durante-el-2022/', d: 'Documentación de violencias por prejuicio, incluidas mujeres lesbianas, bisexuales y trans.' },
    { id: 'diversa', n: 'Colombia Diversa · informes de derechos humanos LGBT', e: 'Colombia Diversa', amb: 'Sociedad civil', foc: ['lgbtiq'], url: 'https://colombiadiversa.org/', d: 'Informes sobre violencias y derechos de personas LGBT.' },
    { id: 'sisma', n: 'Sisma Mujer · boletines de violencias', e: 'Corporación Sisma Mujer', amb: 'Sociedad civil', foc: ['violencias', 'comite-1257'], url: 'https://sismamujer.org/', d: 'Boletines periódicos y seguimiento a la Ley 1257.' },
    { id: 'humanas', n: 'Corporación Humanas', e: 'Centro Regional de Derechos Humanos y Justicia de Género', amb: 'Sociedad civil', foc: ['comite-1719', 'comites-tecnico-juridicos', 'etnico'], url: 'https://humanas.org.co/', d: 'Investigación sobre acceso a la justicia y violencia sexual.' },
    { id: 'oig', n: 'Observatorio de Igualdad de Género de América Latina y el Caribe', e: 'CEPAL', amb: 'Internacional', foc: ['autonomia', 'participacion', 'violencias'], url: 'https://oig.cepal.org/es/indicadores?id=2294', d: 'Autonomía física, económica y en la toma de decisiones.' },
    { id: 'wc', n: 'ONU Mujeres · Women Count Colombia', e: 'ONU Mujeres', amb: 'Internacional', foc: ['red-observatorios'], url: 'https://data.unwomen.org/country/colombia', d: 'Indicadores de género de los ODS y vacíos de datos.' },
    { id: 'chile', n: 'Observatorio Chileno del Femicidio · directorio', e: 'Sociedad civil (Chile)', amb: 'Internacional', foc: ['violencias'], url: 'https://observatoriochilenodelfemicidio.cl/otros-observatorios/', d: 'Directorio de observatorios de la región.' },
    { id: 'arg', n: 'Registro Nacional de Femicidios de la Justicia Argentina', e: 'Corte Suprema de Justicia de la Nación (Argentina)', amb: 'Internacional', foc: ['violencias'], url: 'https://www.csjn.gov.ar/omrecopilacion/omfemicidio/homefemicidio', d: 'Registro judicial con datos abiertos; incluye mujeres cis, trans y travestis.' },
    { id: 'esp', n: 'Delegación del Gobierno contra la Violencia de Género · estadísticas', e: 'Ministerio de Igualdad (España)', amb: 'Internacional', foc: ['violencias'], url: 'https://violenciagenero.igualdad.gob.es/violenciaencifras/', d: 'Portal estadístico, macroencuestas y boletines.' },
    { id: 'cr', n: 'Observatorio de Violencia de Género contra las Mujeres y Acceso a la Justicia', e: 'Poder Judicial de Costa Rica', amb: 'Internacional', foc: ['violencias', 'comites-tecnico-juridicos'], url: 'https://observatoriodegenero.poder-judicial.go.cr/', d: 'Estadísticas judiciales de violencia de género.' },
    { id: 'peru', n: 'Observatorio Nacional de la Violencia contra las Mujeres y los Integrantes del Grupo Familiar', e: 'Ministerio de la Mujer y Poblaciones Vulnerables (Perú)', amb: 'Internacional', foc: ['violencias'], url: null, d: 'Referente regional; verificar enlace vigente.' },
    { id: 'mex', n: 'Observatorio de Participación Política de las Mujeres en México', e: 'Instituto Nacional de las Mujeres (México)', amb: 'Internacional', foc: ['participacion'], url: null, d: 'Referente regional; verificar enlace vigente.' },
    { id: 'uy', n: 'Sistema de Información de Género', e: 'Instituto Nacional de las Mujeres (Uruguay)', amb: 'Internacional', foc: ['autonomia'], url: null, d: 'Referente regional; verificar enlace vigente.' },
    { id: 'rimisp', n: 'Observatorio de Género: mujeres y territorio', e: 'Rimisp · Centro Latinoamericano para el Desarrollo Rural', amb: 'Internacional', foc: ['autonomia', 'etnico'], url: null, d: 'Mujeres rurales y territorio; verificar enlace vigente.' }
  ];

  /* ---------- Rutas de atención ---------- */
  var routes = [
    { id: 'l123', n: 'Línea 123 · Emergencias', num: '123', for: 'Si estás en peligro inmediato. Policía Nacional.', cov: 'Nacional · 24 horas', urgent: true },
    { id: 'l155', n: 'Línea 155', num: '155', for: 'Orientación gratuita a mujeres víctimas de violencias: derechos, Ley 1257 y a dónde acudir. Atendida por la Policía Nacional.', cov: 'Nacional · gratuita', urgent: true },
    { id: 'l122', n: 'Línea 122 · Fiscalía', num: '122', for: 'Denunciar violencia intrafamiliar, sexual y de género. También denuncia en línea en fiscalia.gov.co.', cov: 'Nacional · Fiscalía General de la Nación' },
    { id: 'l141', n: 'Línea 141 · ICBF', num: '141', for: 'Protección, emergencia y orientación para niñas, niños y adolescentes. Línea gratuita ICBF 01 8000 91 80 80 (lunes a viernes).', cov: 'Nacional · 24 horas · gratuita' },
    { id: 'trata', n: 'Línea contra la trata de personas', num: '01 8000 52 2020', for: 'Reporta posibles casos de trata, explotación o tráfico de migrantes. Desde el exterior: +57 601 600 1035.', cov: 'Nacional · 24 horas · Ministerio del Interior y OIM' },
    { id: 'victimas', n: 'Unidad para las Víctimas', num: '01 8000 911 119', for: 'Víctimas del conflicto armado, incluida la violencia sexual. Bogotá (601) 426 1111 · WhatsApp 322 815 1101.', cov: 'Nacional · gratuita' },
    { id: 'defensoria', n: 'Defensoría del Pueblo', num: '01 8000 914 814', for: 'Orientación y defensa de derechos, acompañamiento jurídico y quejas cuando no te atienden. PBX (601) 314 4000.', cov: 'Nacional · gratuita' },
    { id: 'purpura', n: 'Línea Púrpura Distrital · Bogotá', num: '01 8000 112 137', for: 'Escucha y orientación a mujeres, 24 horas. WhatsApp 300 755 1846 · también opción 7 de la Línea 195.', cov: 'Bogotá · Secretaría Distrital de la Mujer' }
  ];
  var steps = [
    { t: 'Si estás en peligro', d: 'Llama al 123 o busca un lugar seguro. Tu vida es lo primero.', c: '#E0315B' },
    { t: 'Violencia sexual: es una urgencia médica', d: 'Acude a urgencias de cualquier hospital o centro de salud, aunque no hayas denunciado. La atención temprana, idealmente en las primeras 72 horas, permite prevenir infecciones y embarazos.', c: '#17A58C' },
    { t: 'Medidas de protección', d: 'La comisaría de familia, o un juez cuando no hay comisaría, puede ordenar medidas de protección (Leyes 294 de 1996, 1257 de 2008 y 2126 de 2021).', c: '#9E2C5A' },
    { t: 'Denuncia', d: 'Puedes denunciar ante la Fiscalía (línea 122, CAIVAS, CAVIF o URI) o la Policía. La violencia intrafamiliar no requiere querella.', c: '#5B5BD6' },
    { t: 'Acogida', d: 'Si necesitas alojamiento temporal, pide a la autoridad que otorga tus medidas de atención la remisión a una casa refugio (Ley 2215 de 2022).', c: '#EF6B4A' },
    { t: 'Orientación y acompañamiento', d: 'Línea 155, Defensoría del Pueblo, personerías y organizaciones de mujeres pueden orientarte sobre tus derechos.', c: '#22A37A' }
  ];

  /* ---------- Cifras transcritas de boletines (Documentos/) ---------- */
  var bulletins = {
    enut: {
      src: 'DANE · ENUT septiembre 2024 – agosto 2025 (boletín técnico, 2 de junio de 2026)', file: 'bol-ENUT-2024-2025.pdf',
      periods: ['2016-2017', '2020-2021', '2024-2025'],
      hours: {
        'Total nacional': { H: ['3:19', '3:06', '3:14'], M: ['6:52', '7:44', '7:35'] },
        'Cabeceras municipales': { H: ['3:22', '3:07', '3:15'], M: ['6:41', '7:31', '7:18'] },
        'Centros poblados y rural disperso': { H: ['3:12', '3:00', '3:09'], M: ['7:32', '8:33', '8:35'] }
      },
      participation: { tnr: { H: 65.2, M: 89.8 }, tr: { H: 55.9, M: 34.2 }, ruralTnrM: 93.4 },
      domestic: [['Suministro de alimentos', 32.8, 78.1], ['Limpieza y mantenimiento', 40.6, 70.4], ['Cuidado de menores de 5 años', 7.9, 12.4], ['Cuidado físico de personas del hogar', 3.2, 16.6]],
      population: { 'Total nacional': { H: 25027, M: 26439 }, 'Cabeceras municipales': { H: 18948, M: 20769 }, 'Centros poblados y rural disperso': { H: 6078, M: 5670 } },
      note: 'Por comparabilidad, 2024-2025 no incluye la muestra ampliada de Amazonía y Orinoquía. Tiempo promedio por participante.'
    },
    geih: {
      src: 'DANE · GEIH, trimestre móvil mayo – julio 2026 (boletín técnico)', file: 'bol-GEIHMLS-may-jul2026.pdf',
      years: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
      td: { M: [13.6, 26.0, 18.1, 13.9, 12.2, 12.6, 11.2, 9.9], H: [8.4, 17.7, 11.7, 8.8, 8.0, 8.3, 7.0, 6.6] },
      rates: [['Tasa global de participación', 77.0, 53.5], ['Tasa de ocupación', 71.9, 48.2], ['Tasa de desocupación', 6.6, 9.9]],
      domains: [['Total nacional', 6.6, 9.9], ['Centros poblados y rural disperso', 3.6, 9.9], ['Otras cabeceras', 7.2, 11.0], ['10 ciudades', 8.7, 12.2], ['13 ciudades y áreas metropolitanas', 7.7, 9.1]],
      note: 'Trimestre móvil mayo – julio de cada año. Brechas en puntos porcentuales.'
    },
    ins: {
      src: 'INS · Informe de evento 875, violencia de género e intrafamiliar, 2025', file: 'Informe_evento_875_2025.pdf',
      years: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
      M: [46281, 34405, 49565, 56905, 71932, 76502, 87699, 93423, 81183, 92020, 110738, 124127, 127018, 129349],
      H: [16953, 8403, 12249, 15696, 21682, 22497, 22000, 25046, 22024, 24282, 29956, 34186, 37123, 40315],
      types2025: [['Violencia física', 76930], ['Violencia sexual', 46371], ['Negligencia y abandono', 25679], ['Violencia psicológica', 20684]],
      rates2025: { M: 477.0, H: 154.7, fisicaM: 229.5, sexualM: 141.1 },
      note: 'Casos sospechosos notificados al Sivigila; no equivalen a todas las atenciones en salud ni a víctimas únicas. Ambos sexos incluyen todas las edades.'
    }
  };

  /* ---------- Indicadores públicos (publicados por defecto) ---------- */
  var publishedIndicators = ['CON-01', 'CON-02', 'CON-03', 'CON-04', 'CUI-01', 'CUI-02', 'CUI-03', 'CUI-04', 'DEM-01', 'DEM-02', 'DEM-03', 'ECO-01', 'ECO-02', 'ECO-03', 'ECO-04', 'ECO-05', 'ECO-06', 'ECO-07', 'EDU-01', 'EDU-02', 'EDU-03', 'EMP-01', 'EMP-02', 'EMP-03', 'EMP-04', 'VBG-01', 'VBG-02', 'VBG-03', 'VBG-04', 'VBG-05', 'VBG-07', 'AMP-V01', 'AMP-V06', 'AMP-V07', 'AMP-V10', 'AMP-R01', 'AMP-S02', 'AMP-I01', 'AMP-L01'];
  /* Línea temática del catálogo → micrositio */
  var themeToSite = {
    'Vida libre de violencias': 'violencias', 'Casas refugio y respuesta': 'casas-refugio', 'Autonomía económica': 'autonomia',
    'Participación y decisiones': 'participacion', 'Educación y brecha digital': 'educacion', 'Salud y derechos sexuales': 'salud-dsr',
    'Cuidado y uso del tiempo': 'cuidados', 'Demografía y diversidades': 'demografia', 'Paz y conflicto armado': 'pan-1325',
    'Diversidades y no discriminación': 'lgbtiq', 'Territorio y ambiente': 'demografia', 'Calidad y disponibilidad': 'red-observatorios'
  };

  var analyses = [
    { id: 'pareja-serie', site: 'violencias', es: 'Diez años de lesiones por violencia de pareja contra mujeres', en: 'Ten years of partner-violence injuries against women' },
    { id: 'nofatal-mujeres', site: 'violencias', es: 'Qué lesiones no fatales se examinan en mujeres', en: 'Which non-fatal injuries are examined in women' },
    { id: 'sexual-sexo', site: 'violencias', es: 'Exámenes por presunto delito sexual: quiénes son las víctimas', en: 'Forensic exams for alleged sexual offences by sex' },
    { id: 'fatal-manera', site: 'violencias', es: 'Muertes de mujeres por causa externa, según manera', en: 'Deaths of women from external causes, by manner' },
    { id: 'ins-notificacion', site: 'salud-dsr', es: 'Violencias de género notificadas al sector salud, 2012–2025', en: 'Gender-based violence notified to health services, 2012–2025' },
    { id: 'enut-horas', site: 'cuidados', es: 'Horas diarias de trabajo no remunerado: la brecha persiste', en: 'Daily hours of unpaid work: the gap persists' },
    { id: 'enut-participacion', site: 'cuidados', es: 'Quién hace el trabajo doméstico y de cuidado', en: 'Who does domestic and care work' },
    { id: 'enut-departamentos', site: 'cuidados', es: 'Brecha de participación en trabajo no remunerado por departamento', en: 'Unpaid-work participation gap by department' },
    { id: 'geih-td', site: 'autonomia', es: 'Desocupación de mujeres y hombres, 2019–2026', en: 'Unemployment of women and men, 2019–2026' },
    { id: 'geih-brechas', site: 'autonomia', es: 'Brechas del mercado laboral y dónde son mayores', en: 'Labour-market gaps and where they are widest' },
    { id: 'obs-red', site: 'red-observatorios', es: 'La red: observatorios por ámbito y territorio', en: 'The network: observatories by scope and territory' },
    { id: 'poblacion-mujeres', site: 'demografia', es: 'Dónde viven las mujeres: población por departamento', en: 'Where women live: population by department' }
  ];

  return { sites: sites, rights: rights, norms: norms, obs: obs, routes: routes, steps: steps, bulletins: bulletins, publishedIndicators: publishedIndicators, themeToSite: themeToSite, analyses: analyses };
})();
