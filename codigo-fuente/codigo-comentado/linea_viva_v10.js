/* ==========================================================================
   LIBRES · LÍNEA VIVA (v10) — interacción de consulta
   - Héroe con buscador en lenguaje natural ("violencia de pareja en Antioquia 2022")
     que interpreta indicador, territorio y año y los aplica a los filtros existentes.
   - Cintas de color por línea temática; el acento de la página cambia con la línea.
   - Cifras que se animan al aparecer.
   - Perfil administrativo con su línea de color.
   Solo usa las funciones públicas ya existentes (v8Topic, go, help, v8Docs…).
   ========================================================================== */
(function(){
  'use strict';
  var D=document, R=D.documentElement;
  var isAdmin=/Administracion/i.test(location.pathname)||!!D.querySelector('#roleGate,.adminlogin');
  R.dataset.perfil=isAdmin?'admin':'publico';

  function lang(){
    try{var s=localStorage.getItem('omd_interface_language');if(s)return s==='en'?'en':'es'}catch(e){}
    return (R.lang||'es').indexOf('en')===0?'en':'es';
  }
  function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim()}

  /* ---------- cifras animadas ---------- */
  var done=new WeakSet();
  function countUp(el){
    if(done.has(el))return;done.add(el);
    var final=el.textContent;var m=final.match(/\d[\d.,]*/);if(!m)return;
    var chunk=m[0],seps=chunk.match(/[.,]/g)||[],last=seps.length?chunk.lastIndexOf(seps[seps.length-1]):-1;
    chunk=chunk.replace(/[.,]+$/,'');
    if(/^(19|20)\d\d$/.test(chunk))return; // años: no se animan
    seps=chunk.match(/[.,]/g)||[];last=seps.length?chunk.lastIndexOf(seps[seps.length-1]):-1;
    var dec=0,decSep='',thSep='';
    if(last>-1){var tail=chunk.length-last-1;if(tail===3){thSep=chunk[last]}else{decSep=chunk[last];dec=tail;thSep=decSep===','?'.':','}}
    var num=parseFloat(chunk.split(thSep||'\u0000').join('').replace(decSep||'\u0000','.'));
    if(!isFinite(num)||num===0)return;
    function fmt(v){var s=v.toFixed(dec),p=s.split('.'),i=p[0];if(thSep)i=i.replace(/\B(?=(\d{3})+(?!\d))/g,thSep);return i+(dec?decSep+p[1]:'')}
    var pre=final.slice(0,m.index),post=final.slice(m.index+chunk.length),t0=null,dur=900,lastTxt=null;
    function step(t){
      if(lastTxt!==null&&el.textContent!==lastTxt)return; // la app cambió el valor: no interferir
      if(!t0)t0=t;var k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);
      lastTxt=k<1?pre+fmt(num*e)+post:final;el.textContent=lastTxt;
      if(k<1)requestAnimationFrame(step);
    }
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    requestAnimationFrame(step);
  }
  function animateNumbers(root){
    (root||D).querySelectorAll('.v9card strong,.v9adminStats strong,.v9current strong,.v9mapStats strong,.lvStat b,.kpi strong').forEach(function(el){
      if(el.childElementCount===0)countUp(el);
    });
  }

  /* ---------- líneas temáticas ---------- */
  var LINES=[
    {id:'all',c:'linear-gradient(90deg,#d33b78,#f8c20a,#22a37a,#1a82b9,#9e2c5a)',ci:'#ffd0e0',ico:'◈',es:['Todas las diversidades','Panorama completo'],en:['All diversities','Full overview'],kw:'todas diversidades panorama general mujeres'},
    {id:'violencias',c:'#d33b78',ico:'◇',es:['Vida libre de violencias','Pareja, lesiones, feminicidio'],en:['Life free from violence','Partner, injuries, femicide'],kw:'violencia violencias pareja feminicidio agresion maltrato'},
    {id:'refugio',c:'#ef6b4a',ico:'⌂',es:['Casas refugio','Protección y respuesta'],en:['Shelters','Protection and response'],kw:'casa casas refugio albergue proteccion respuesta acogida'},
    {id:'cuidados',c:'#f8c20a',ico:'◷',es:['Cuidados y tiempo','Trabajo no remunerado'],en:['Care and time use','Unpaid work'],kw:'cuidado cuidados tiempo uso del tiempo enut hogar domestico'},
    {id:'autonomia',c:'#22a37a',ico:'↗',es:['Autonomía económica','Empleo e ingresos'],en:['Economic autonomy','Jobs and income'],kw:'autonomia economica empleo ingresos desocupacion desempleo trabajo remunerado'},
    {id:'salud',c:'#1a82b9',ico:'✳',es:['Salud y contextos','Bienestar y territorio'],en:['Health and contexts','Wellbeing and territory'],kw:'salud contextos bienestar embarazo'}
  ];
  var TOPIC_SITE={violencias:'violencias',refugio:'casas-refugio',cuidados:'cuidados',autonomia:'autonomia',salud:'salud-dsr'};
  var SITE_KW={'lgbtiq':'lgbt lgbti lgbtiq trans lesbiana lesbianas bisexual bisexuales diversidad sexual identidad orientacion prejuicio',
    'etnico':'indigena indigenas afro afrodescendiente afrodescendientes negra negras raizal raizales palenquera palenqueras rrom etnica etnico etnicas racial',
    'pan-1325':'paz 1325 seguridad construccion',
    'comite-1257':'1257',
    'comite-1719':'1719 conflicto armado',
    'comites-tecnico-juridicos':'tecnico juridico juridicos tecnicos',
    'casas-refugio':'casa casas refugio refugios albergue acogida',
    'participacion':'participacion politica elecciones cuotas congreso concejo listas',
    'educacion':'educacion tic stem matricula universidad digital colegio',
    'red-observatorios':'red',
    'demografia':'poblacion demografia demografica caracterizacion cuantas',
    'salud-dsr':'salud sexual reproductiva reproductivos aborto ive embarazo parto',
    'cuidados':'cuidado cuidados tiempo enut',
    'autonomia':'autonomia economica empleo desempleo desocupacion ingresos',
    'violencias':'violencias'};
  function siteList(){return (window.LV11&&LV11.sites)?LV11.sites():[]}
  function siteById(id){return siteList().filter(function(s){return s.id===id})[0]}
  function siteName(s){return s?(lang()==='en'&&s.en?s.en:s.es):''}
  function setLinea(t){R.dataset.linea=t||'all';var sid=TOPIC_SITE[t]||'';D.querySelectorAll('.lvLine').forEach(function(b){b.classList.toggle('on',b.dataset.t===sid)})}
  if(typeof window.v8Topic==='function'){
    var _t=window.v8Topic;window.v8Topic=function(t){var r=_t.apply(this,arguments);setLinea(t);return r};
  }
  if(typeof window.go==='function'){
    var _g=window.go;window.go=function(p){var r=_g.apply(this,arguments);R.dataset.page=p;if(p==='violencias'||p==='refugio')setLinea(p);else if(p!=='libres')R.dataset.linea='all';return r};
  }

  /* ---------- consulta en lenguaje natural ---------- */
  var IND=[
    {v:'nofatal',kw:['no fatal','no fatales','lesiones no fatales','lesion no fatal','agresion','agresiones'],c:'#1a82b9'},
    {v:'pareja',kw:['pareja','violencia de pareja','intrafamiliar','novio','esposo','expareja','companero'],c:'#d33b78'},
    {v:'fatal',kw:['fatal','fatales','homicidio','homicidios','muerte','muertes','feminicidio','feminicidios','asesinato'],c:'#9e2c5a'},
    {v:'enut',kw:['trabajo no remunerado','no remunerado','enut','uso del tiempo','cuidado','cuidados','labores del hogar','domestico'],c:'#f8c20a'}
  ];
  var PAGES=[
    {p:'normativa',kw:['ley','leyes','norma','normas','normativa','decreto','resolucion','jurisprudencia'],c:'#f8c20a',es:'Normativa',en:'Regulations'},
    {p:'red',kw:['fuentes','fuente','observatorio','observatorios','dane','cepal','onu','medicina legal','red'],c:'#1a82b9',es:'Fuentes y observatorios',en:'Sources and observatories'},
    {p:'conocimiento',kw:['estudio','estudios','conocimiento','publicacion','publicaciones','boletin','boletines','investigacion'],c:'#22a37a',es:'Conocimiento',en:'Knowledge'},
    {p:'indicadores',kw:['ficha','fichas','indicador','indicadores','catalogo'],c:'#9e2c5a',es:'Indicadores',en:'Indicators'},
    {p:'asistente',kw:['metodologia','formula','formulas','calculo','metodo'],c:'#f0b3ca',es:'Consulta metodológica',en:'Methodology'}
  ];
  var HELPKW=['ruta','rutas','ayuda','denunciar','denuncia','emergencia','155','atencion','orientacion','auxilio'];
  function has(q,kw){q=' '+q+' ';return kw.some(function(k){return q.indexOf(' '+k+' ')>-1})}
  function sel(i){return D.querySelectorAll('.v9toolbar select')[i]}
  function setSel(i,val){var s=sel(i);if(!s)return false;var ok=[].some.call(s.options,function(o){return o.value===val});if(!ok)return false;s.value=val;s.dispatchEvent(new Event('input',{bubbles:true}));s.dispatchEvent(new Event('change',{bubbles:true}));return true}
  function deptList(){var s=sel(2);return s?[].map.call(s.options,function(o){return{v:o.value,t:o.text,n:norm(o.text)}}).filter(function(o){return o.v!=='*'}):[]}
  var ALIAS={'bogota':'11','san andres':'88','valle':'76','norte de santander':'54','guajira':'44'};
  function findDept(q){
    var best=null;deptList().forEach(function(d){var n=d.n.replace(/ d c$/,'');if((' '+q+' ').indexOf(' '+n+' ')>-1&&(!best||n.length>best.n.length))best=d});
    if(!best)Object.keys(ALIAS).forEach(function(a){if(!best&&(' '+q+' ').indexOf(' '+a+' ')>-1)best=deptList().filter(function(d){return d.v===ALIAS[a]})[0]});
    return best;
  }
  function interpret(raw){
    var q=norm(raw),r={};
    if(!q)return r;
    if(has(q,HELPKW))r.help=true;
    for(var i=0;i<IND.length;i++){if(has(q,IND[i].kw)){r.ind=IND[i].v;break}}
    var d=findDept(q);if(d)r.dept=d;
    var y=q.match(/\b(20[0-3]\d)\b/);if(y)r.year=y[1];
    if(!r.ind){for(var j=0;j<PAGES.length;j++){if(has(q,PAGES[j].kw)){r.page=PAGES[j];break}}}
    if(!r.ind&&!r.page){var best=null,bl=0;Object.keys(SITE_KW).forEach(function(id){SITE_KW[id].split(' ').forEach(function(k){if(k.length>2&&(' '+q+' ').indexOf(' '+k+' ')>-1&&k.length>bl){best=id;bl=k.length}})});if(/\b1257\b/.test(q))best='comite-1257';if(/\b1719\b/.test(q))best=/tecnic/.test(q)?'comites-tecnico-juridicos':'comite-1719';if(/\b1325\b/.test(q))best='pan-1325';if(best)r.site=best}
    return r;
  }
  function indLabel(v){var s=sel(0);if(!s)return v;var o=[].filter.call(s.options,function(o){return o.value===v})[0];return o?o.text:v}
  function describe(r){
    var L=lang(),out=[];
    if(r.ind)out.push((L==='en'?'Indicator: ':'Indicador: ')+indLabel(r.ind));
    if(r.dept)out.push((L==='en'?'Territory: ':'Territorio: ')+r.dept.t);
    if(r.year)out.push((L==='en'?'Year: ':'Año: ')+r.year);
    if(r.site)out.push((L==='en'?'Microsite: ':'Micrositio: ')+siteName(siteById(r.site)));
    if(r.page)out.push((L==='en'?'Section: ':'Sección: ')+r.page[L]);
    if(r.help)out.push(L==='en'?'Support routes':'Rutas de atención');
    if(r.yearMissing)out.push(L==='en'?r.yearMissing+' not available in this source · default period shown':r.yearMissing+' sin dato en esta fuente · se muestra el periodo de referencia');
    return out;
  }
  function showParsed(r,ok){
    var box=D.getElementById('lvParsed');if(!box)return;var d=describe(r);
    box.innerHTML='';
    if(!d.length){box.textContent=ok===false?(lang()==='en'?'Try: “partner violence in Antioquia 2022”, “unpaid work Bogotá”, “shelters”, “law”.':'Prueba: «violencia de pareja en Antioquia 2022», «trabajo no remunerado Bogotá», «casas refugio», «ley».'):'';return}
    var s=D.createElement('span');s.textContent=lang()==='en'?'Showing → ':'Mostrando → ';box.appendChild(s);
    d.forEach(function(t){var b=D.createElement('b');b.textContent=t;box.appendChild(b)});
  }
  function scrollToDash(){var t=D.querySelector('.v9contextbar')||D.querySelector('.v9cards');if(t){var y=t.getBoundingClientRect().top+scrollY-150;scrollTo({top:y,behavior:'smooth'})}}
  function run(raw){
    var r=interpret(raw);
    if(!Object.keys(r).length){showParsed(r,false);return}
    showParsed(r);
    if(r.help&&!r.ind&&!r.dept&&!r.page&&!r.site){if(typeof go==='function'&&document.getElementById('rutas'))go('rutas');else if(typeof help==='function')help();return}
    if(r.page){if(typeof go==='function')go(r.page.p);scrollTo({top:0,behavior:'smooth'});return}
    if(r.site&&window.LV11){LV11.openSite(r.site);scrollTo({top:0,behavior:'smooth'});return}
    if(R.dataset.linea&&R.dataset.linea!=='all'&&typeof v8Topic==='function'&&(r.ind||r.dept||r.year))v8Topic('all');
    setTimeout(function(){
      if(r.ind)setSel(0,r.ind);
      setTimeout(function(){
        if(r.dept)setSel(2,r.dept.v);else if(r.ind)setSel(2,'*');
        setTimeout(function(){
          if(r.year){var okY=setSel(1,r.year);if(!okY){var s=sel(1);var o=s&&[].filter.call(s.options,function(o){return o.value.indexOf(r.year)>-1})[0];if(o)okY=setSel(1,o.value)}if(!okY){r.yearMissing=r.year;delete r.year}}
          showParsed(r);
          setTimeout(function(){animateNumbers();scrollToDash()},80);
        },60);
      },60);
    },40);
  }

  /* sugerencias mientras se escribe */
  function suggestions(raw){
    var q=norm(raw),L=lang(),out=[];if(!q)return out;
    var r=interpret(raw);
    if(r.ind||r.dept||r.year)out.push({t:describe(r).join(' · '),k:L==='en'?'query':'consulta',c:'#d33b78',run:raw});
    var s=sel(0);if(s)[].forEach.call(s.options,function(o){if(norm(o.text).indexOf(q)>-1||IND.some(function(i){return i.v===o.value&&i.kw.some(function(k){return k.indexOf(q)===0})}))out.push({t:o.text,k:L==='en'?'indicator':'indicador',c:(IND.filter(function(i){return i.v===o.value})[0]||{}).c,act:function(){run(o.text)}})});
    siteList().forEach(function(s){if(norm(siteName(s)).indexOf(q)>-1||(SITE_KW[s.id]||'').split(' ').some(function(k){return k.length>2&&k.indexOf(q)===0}))out.push({t:siteName(s),k:L==='en'?'microsite':'micrositio',c:s.c,act:function(){LV11.openSite(s.id);scrollTo({top:0,behavior:'smooth'})}})});
    deptList().forEach(function(d){if(q.length>1&&d.n.indexOf(q)===0)out.push({t:d.t,k:L==='en'?'territory':'territorio',c:'#22a37a',act:function(){setSel(2,d.v);setTimeout(function(){animateNumbers();scrollToDash()},80)}})});
    PAGES.forEach(function(p){if(norm(p[L]).indexOf(q)>-1||p.kw.some(function(k){return k.indexOf(q)===0}))out.push({t:p[L],k:L==='en'?'section':'sección',c:p.c,act:function(){go(p.p);scrollTo({top:0,behavior:'smooth'})}})});
    if(HELPKW.some(function(k){return k.indexOf(q)===0}))out.push({t:L==='en'?'Support and care routes':'Orientación y rutas de atención',k:L==='en'?'help':'ayuda',c:'#d33b78',act:function(){if(document.getElementById('rutas'))go('rutas');else help()}});
    return out.slice(0,8);
  }

  /* ---------- héroe de consulta ---------- */
  var T={
    es:{eb:'Observatorio de Mujeres en todas sus diversidades · Colombia',h1:'Mujeres, territorios y <em>realidades</em>.',lead:'Consulta las cifras como lo preguntarías: escribe un tema, un departamento o un año. Cada dato conserva su fuente, su corte y sus límites.',ph:'¿Qué quieres consultar? Ej.: violencia de pareja en Antioquia 2022',go:'Consultar',try:'Prueba',chips:['Violencia de pareja en Antioquia','Trabajo no remunerado en Bogotá','Mujeres indígenas y afro','PAN 1325','Leyes y normativa','Rutas de atención'],
        lines:'Líneas temáticas',s1:['33','departamentos con datos visibles'],s2:['16','micrositios temáticos'],s3:['32','observatorios en la red'],s4:['ES · EN','consulta bilingüe y descargable']},
    en:{eb:'Observatory of Women in all their diversity · Colombia',h1:'Women, territories and <em>realities</em>.',lead:'Ask the data the way you would ask a person: type a topic, a department or a year. Every figure keeps its source, cut-off date and limits.',ph:'What would you like to explore? e.g. partner violence in Antioquia 2022',go:'Search',try:'Try',chips:['Partner violence in Antioquia','Unpaid work in Bogotá','Indigenous and Afro women','NAP 1325','Laws and regulations','Support routes'],
        lines:'Thematic lines',s1:['33','departments with visible data'],s2:['16','thematic microsites'],s3:['32','observatories in the network'],s4:['ES · EN','bilingual, downloadable']}
  };
  var CHIPQ={es:['violencia de pareja antioquia','trabajo no remunerado bogota','mujeres indigenas afro','pan 1325','normativa','rutas de atencion'],en:['pareja antioquia','trabajo no remunerado bogota','fatales 2023','casas refugio','normativa','rutas de atencion']};
  var WAVES='<svg class="lvWaves" viewBox="0 0 800 520" preserveAspectRatio="none" aria-hidden="true">'+
    ['#d33b78','#ef6b4a','#f8c20a','#22a37a','#1a82b9','#f0b3ca'].map(function(c,i){var o=i*26;return '<path stroke="'+c+'" d="M-20 '+(380-o)+' C 140 '+(300-o)+', 220 '+(470-o)+', 380 '+(330-o)+' S 640 '+(150-o)+', 820 '+(250-o)+'"/>'}).join('')+'</svg>';

  function buildHero(){
    var host=D.getElementById('libres'),root=D.getElementById('libresRoot');
    if(!host||!root||isAdmin)return;
    var L=lang(),t=Object.assign({},T[L]);if(innerWidth<600)t.ph=L==='en'?'What would you like to explore?':'¿Qué quieres consultar?';var old=D.getElementById('lvHero'),val=old?old.querySelector('input').value:'';
    var h=D.createElement('section');h.id='lvHero';h.className='lvHero';h.setAttribute('data-no-translate','');h.setAttribute('aria-label',t.lines);
    h.innerHTML=WAVES+
      '<div class="lvHeroGrid"><div>'+
        '<span class="lvEyebrow"><i></i>'+t.eb+'</span>'+
        '<h1>'+t.h1+'</h1><p class="lvLead">'+t.lead+'</p>'+
        '<div class="lvSearch"><form class="lvSearchBox" role="search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'+
        '<input type="search" autocomplete="off" aria-label="'+t.ph+'" placeholder="'+t.ph+'"><kbd>/</kbd><button class="lvGo" type="submit">'+t.go+' →</button></form>'+
        '<div class="lvSuggest" role="listbox"></div></div>'+
        '<div class="lvParsed" id="lvParsed" aria-live="polite"></div>'+
        '<div class="lvChips"><span>'+t.try+'</span>'+t.chips.map(function(c,i){return '<button type="button" data-q="'+CHIPQ.es[i]+'">'+c+'</button>'}).join('')+'</div>'+
      '</div><div class="lvSide">'+
        [[t.s1,t.s2],[t.s3,t.s4]].map(function(row){return '<div class="lvStatRow">'+row.map(function(s){return '<div class="lvStat"><b>'+s[0]+'</b><span>'+s[1]+'</span></div>'}).join('')+'</div>'}).join('')+
      '</div></div>'+
      '<div class="lvLines scroll" aria-label="'+(L==='en'?'Microsites':'Micrositios')+'">'+siteList().map(function(s){return '<button type="button" class="lvLine" data-t="'+s.id+'" style="--c:'+s.c+'"><em style="color:'+s.c+'">'+(window.LV11?LV11.icon(s.ico,20):'◆')+'</em><b>'+siteName(s)+'</b></button>'}).join('')+'</div>';
    // color sólido del icono
    if(old)old.replaceWith(h);else host.insertBefore(h,root);
    host.classList.add('lvHasHero');
    wireHero(h,val);setLinea(R.dataset.linea||'all');animateNumbers(h);
  }
  window.LV10_buildHero=function(){buildHero()};
  function wireHero(h,val){
    var f=h.querySelector('form'),inp=h.querySelector('input'),box=h.querySelector('.lvSuggest'),items=[],on=-1;
    inp.value=val||'';
    function close(){box.classList.remove('open');on=-1}
    function render(){
      items=suggestions(inp.value);box.innerHTML='';
      if(!items.length){close();return}
      items.forEach(function(it,i){var b=D.createElement('button');b.type='button';b.setAttribute('role','option');b.style.setProperty('--c',it.c||'#9e2c5a');
        b.innerHTML='<i></i><span></span><small></small>';b.children[1].textContent=it.t;b.children[2].textContent=it.k;
        b.addEventListener('mousedown',function(e){e.preventDefault();pick(i)});box.appendChild(b)});
      box.classList.add('open');
    }
    function pick(i){var it=items[i];close();if(!it)return;if(it.run)run(it.run);else{it.act();showParsed({})}}
    inp.addEventListener('input',render);
    inp.addEventListener('blur',function(){setTimeout(close,120)});
    inp.addEventListener('keydown',function(e){
      var bs=box.querySelectorAll('button');
      if(e.key==='ArrowDown'&&bs.length){e.preventDefault();on=(on+1)%bs.length}
      else if(e.key==='ArrowUp'&&bs.length){e.preventDefault();on=(on-1+bs.length)%bs.length}
      else if(e.key==='Escape'){close();return}
      else return;
      bs.forEach(function(b,i){b.classList.toggle('on',i===on)});
    });
    f.addEventListener('submit',function(e){e.preventDefault();if(on>-1&&box.classList.contains('open'))pick(on);else{close();run(inp.value)}});
    h.querySelectorAll('.lvChips button').forEach(function(b){b.addEventListener('click',function(){inp.value=b.textContent;run(b.dataset.q)})});
    h.querySelectorAll('.lvLine').forEach(function(b){b.addEventListener('click',function(){showParsed({});if(window.LV11)LV11.openSite(b.dataset.t)})});
  }

  /* ---------- perfil administrativo ---------- */
  function adminDecor(){
    var a=D.querySelector('.adminlogin aside');if(!a||a.querySelector('.lvAdminLines'))return;
    var l=D.createElement('div');l.className='lvAdminLines';l.setAttribute('aria-hidden','true');
    l.innerHTML=['#f8c20a','#f8c20a','#22a37a','#ffffff','#d33b78'].map(function(c){return '<i style="background:'+c+'"></i>'}).join('');
    var h=a.querySelector('h1');if(h)h.after(l);
  }

  /* ---------- arranque ---------- */
  function init(){
    if(!D.querySelector('link[data-lv-fonts]')){
      var k=D.createElement('link');k.rel='stylesheet';k.dataset.lvFonts='1';
      k.href='https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,600;0,6..12,700;0,6..12,800;0,6..12,900;1,6..12,700;1,6..12,800&display=swap';
      D.head.appendChild(k);
    }
    buildHero();adminDecor();animateNumbers();
    var act=D.querySelector('.v9side button.active');
    if(act){var m=(act.getAttribute('onclick')||'').match(/v8Topic\('(\w+)'\)/);if(m)setLinea(m[1])}
    // re-render del tablero → animar cifras nuevas
    var mo=new MutationObserver(function(){animateNumbers()});
    ['libresRoot','v8AdminRoot'].forEach(function(id){var n=D.getElementById(id);if(n)mo.observe(n,{childList:true,subtree:true})});
    // cambio de idioma
    D.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('header .tabs button'))setTimeout(buildHero,60)});
    // atajo "/" para consultar
    D.addEventListener('keydown',function(e){
      if(e.key==='/'&&!/input|textarea|select/i.test((D.activeElement||{}).tagName||'')){var i=D.querySelector('#lvHero input');if(i){e.preventDefault();i.focus();scrollTo({top:0,behavior:'smooth'})}}
    });
    // enlaces profundos desde la portada: ?linea=violencias  ·  ?q=pareja%20antioquia
    var P=new URLSearchParams(location.search);
    if(P.get('linea')&&typeof v8Topic==='function'){setTimeout(function(){v8Topic(P.get('linea'));setTimeout(scrollToDash,150)},250)}
    if(P.get('q')){setTimeout(function(){var i=D.querySelector('#lvHero input');if(i)i.value=P.get('q');run(P.get('q'))},300)}
  }
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',function(){setTimeout(init,30)});else setTimeout(init,30);
})();
