// Tablero de alimentación: muestra el estado REAL del trabajo local, sin inventar cifras operativas.
let v7DashboardBusy=false;
async function renderFeedingDashboard(){
 if(!$('v7Metrics')||v7DashboardBusy)return;v7DashboardBusy=true;
 try{
  const x=getIntake();$('feedingScope').value=currentObservatory;
  const choices=all.filter(i=>observatoryAllowed(i,currentObservatory));
  $('feedingIndicator').innerHTML=choices.map(i=>`<option value="${esc(i.code)}" ${i.code===intake.code?'selected':''}>${esc(i.code+' · '+i.name)}</option>`).join('');
  let drafts=[];try{drafts=await dbAll('drafts')}catch{}
  const inScope=drafts.filter(d=>d.observatory===currentObservatory);
  const ready=intake.validated&&intake.results.length>0;
  const analysisIds=['analysisSummary','analysisInterpretation','analysisLimitations','analysisActions','analysisSummaryEn','analysisInterpretationEn','analysisLimitationsEn','analysisActionsEn'];const analysed=analysisIds.every(id=>$(id)?.value.trim());
  const due=$('metaReview').value;
  $('v7Metrics').innerHTML=[['Borradores locales',inScope.length,'Datos de trabajo guardados en este navegador'],['Filas del indicador',intake.raw.length,'CSV de componentes agregados'],['Soportes asociados',intake.evidence.length,'Documentos de soporte'],['Próxima actualización',due||'Por programar','Responsable y revisión']].map(([a,b,c])=>`<div class="v7metric"><span>${esc(a)}</span><strong style="${String(b).length>7?'font-size:20px':''}">${esc(b)}</strong><small>${esc(c)}</small></div>`).join('');
  $('v7CurrentName').textContent=x.name;$('v7CurrentCode').textContent=x.code;
  $('v7DataFile').textContent=intake.filename||'Sin archivo seleccionado';$('v7Documents').textContent=intake.evidence.length?intake.evidence.length+' documentos':'Pendiente de adjuntar';
  $('v7CalcText').textContent=ready?'Cálculo preliminar disponible':'Sin cálculo disponible';$('v7CalcDot').classList.toggle('ready',ready);
  $('v7AnalysisText').textContent=analysed?'Completo':'Pendiente de completar';$('v7AnalysisDot').classList.toggle('ready',analysed);
  $('v7SheetState').textContent=intake.example?'DATOS FICTICIOS':'Estado de preparación';
  $('v7Stages').innerHTML=v6Steps.map(([key,title],i)=>`<button onclick="v6Stage('${key}')"><span>${i+1}</span>${esc(title)}</button>`).join('');
  $('v7DraftQueue').innerHTML=inScope.length?'<table><thead><tr><th>Indicador</th><th>Responsable</th><th>Actualizado</th><th>Estado</th><th>Acción</th></tr></thead><tbody>'+inScope.sort((a,b)=>b.updated_at.localeCompare(a.updated_at)).slice(0,12).map(d=>`<tr><td><b>${esc(d.code)}</b><br>${esc(all.find(i=>i.code===d.code)?.name||d.code)}</td><td>${esc(d.metadata?.metaOwner||'Sin asignar')}</td><td>${esc(new Date(d.updated_at).toLocaleDateString('es-CO'))}</td><td><span class="v7scopeBadge">${d.intake?.example?'DATOS FICTICIOS':'Borradores locales'}</span></td><td><button class="btn" onclick="v7Resume('${esc(d.observatory)}','${esc(d.code)}')">Abrir ficha →</button></td></tr>`).join('')+'</tbody></table>':'<div class="v7empty">Sin borradores todavía. Puedes comenzar con una carga de prueba o elegir el indicador que vas a actualizar.</div>';
  if(typeof translateInterface==='function')translateInterface();
 }finally{v7DashboardBusy=false}
}
async function v7Select(code){await selectIntake(code);await renderFeedingDashboard()}
async function v7Scope(scope){$('workspaceObservatory').value=scope;await changeObservatory(scope);await renderFeedingDashboard()}
async function v7Resume(scope,code){if(scope!==currentObservatory){$('workspaceObservatory').value=scope;await changeObservatory(scope)}await selectIntake(code);go('gestion');sheetTab('data')}
async function v7Example(){await adminVisualExample();await renderFeedingDashboard()}
const goBeforeV7=go;go=function(id){goBeforeV7(id);if(id==='datahome')renderFeedingDashboard()};
const homeBeforeV7=refreshAdminHome;refreshAdminHome=async function(){await homeBeforeV7();await renderFeedingDashboard()};
const saveBeforeV7=saveDraft;saveDraft=async function(silent=false){const result=await saveBeforeV7(silent);if(result)renderFeedingDashboard();return result};
renderFeedingDashboard();
// Acceso visible de regreso desde la ficha y soporte de enlaces directos entre secciones.
$('gestion').querySelector('h1')?.insertAdjacentHTML('beforebegin','<button class="btn" style="margin-bottom:12px" onclick="go(\'datahome\')">← Volver al tablero</button>');
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(nav.some(item=>item[0]===id))go(id)});
