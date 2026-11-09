// V5: resumen visual de preparación construido desde el estado local real de la ficha.
function adminStage(name){go('gestion');sheetTab(name);refreshVisualWork()}
function refreshVisualWork(){
 if(!$('adminCurrentSummary'))return;
 const x=getIntake(),required=x.contract.documents.filter(d=>d.required),docOk=required.length>0&&required.every(d=>intake.evidence.some(e=>e.type===d.type));
 const analysisIds=['analysisSummary','analysisInterpretation','analysisLimitations','analysisActions','analysisSummaryEn','analysisInterpretationEn','analysisLimitationsEn','analysisActionsEn'];
 const checks=[['Método definido',x.contract.mode!=='pending'],['Datos agregados',intake.raw.length>0],['Soportes requeridos',docOk],['Cálculo preliminar',intake.validated&&intake.results.length>0],['Análisis ES/EN',analysisIds.every(id=>$(id)?.value.trim())],['Responsable y revisión',!!$('metaOwner')?.value.trim()&&!!$('metaReview')?.value]];
 const count=checks.filter(c=>c[1]).length;$('adminCurrentCode').textContent=x.code;
 $('adminCurrentSummary').innerHTML=`<div class="adminIndicator"><span class="stageNumber">${count}/6</span><div><b style="font-size:13px">${esc(x.name)}</b><p>${intake.example?'Ejemplo ficticio en preparación':'Ficha local · sin autorización institucional'}</p></div></div><div class="navHint"><span>Preparación local</span><b>${count} de 6 verificaciones indicativas</b></div><div class="workflowProgress"><span style="width:${count/6*100}%"></span></div><p class="visualFoot">Este avance orienta el trabajo; no certifica calidad, aprobación ni cumplimiento contractual.</p>${checks.map(([label,ok])=>`<div class="stateRow"><span>${label}</span><strong style="color:${ok?'#416e24':'#92721d'}">${ok?'Disponible':'Pendiente'}</strong></div>`).join('')}<div class="navHint"><span>${intake.raw.length} filas de entrada</span><span>${intake.evidence.length} soportes locales</span></div>`;
}
// Guardar antes del ejemplo evita perder un espacio de trabajo ya alimentado.
async function adminVisualExample(){
 const hasWork=intake.raw.length||intake.evidence.length||Object.values(metadataValues()).some(Boolean);
 if(hasWork&&!(await saveDraft(true))){adminMsg('No se pudo guardar la ficha actual. No se cargó el ejemplo.');return}
 exampleIntake();go('gestion');sheetTab('data');refreshVisualWork();
}
const homeBeforeV5=refreshAdminHome;
refreshAdminHome=async function(){await homeBeforeV5();refreshVisualWork()};
const calcBeforeV5=calculateIntake;
calculateIntake=function(){calcBeforeV5();refreshVisualWork()};
const resetBeforeV5=resetIntakeResults;
resetIntakeResults=function(){resetBeforeV5();refreshVisualWork()};
// Resumen de estado también disponible al abrir las siete pestañas.
const heading=document.querySelector('#gestion > .filterbar');
if(heading)heading.insertAdjacentHTML('beforebegin','<div class="v5Summary"><b>De los insumos a una publicación comprensible.</b> La ficha conserva el dato, su evidencia y su interpretación. Recorre las siete etapas y prepara una salida pública solo después de validar los componentes.</div>');
refreshVisualWork();
