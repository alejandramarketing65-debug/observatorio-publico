"""Read-only source processing. Exports territorial aggregates, never person-level rows.
The threshold is a draft display policy, not a claim of legal anonymisation.
"""
from pathlib import Path
import csv, json, zipfile, collections, unicodedata, hashlib, xml.etree.ElementTree as ET
P=Path('/workspace/scratch/43478bfd60b0'); U=P/'upload'; A=P/'analysis'
def norm(s): return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
inventory=[]
for p in U.iterdir():
 if not p.is_file() or p.suffix.lower() not in ['.csv','.xlsx','.zip','.pdf','.png']: continue
 x={'file':p.name,'bytes':p.stat().st_size,'kind':p.suffix[1:]}
 if p.suffix=='.zip':
  with zipfile.ZipFile(p) as z: x['members']=[i.filename for i in z.infolist() if not i.is_dir() and not i.filename.split('/')[-1].startswith(('.','~'))]
 inventory.append(x)
sources=[]
for key,pattern,title,en,theme in [
 ('fatal','Lesiones_fatales*.csv','Lesiones fatales por causa externa','Fatal external-cause injuries','salud'),
 ('nofatal','Lesiones_no_fatales*.csv','Lesiones no fatales por causa externa','Non-fatal external-cause injuries','salud'),
 ('pareja','Lesiones_por_Violencia*.csv','Lesiones por violencia de pareja','Intimate partner violence injuries','violencias')]:
 f=next(U.glob(pattern));counts=collections.Counter();years=collections.Counter();missing=0;ids=set();duplicates=0
 with f.open(encoding='utf-8-sig',newline='') as h:
  reader=csv.DictReader(h);fields=reader.fieldnames;lookup={norm(k):k for k in fields}
  def field(k):return lookup[norm(k)]
  for r in reader:
   year=r[field('Año del hecho')].strip().replace(',',''); dept=r[field('Código Dane Departamento')].strip().split('.')[0].zfill(2)
   sex=r[field('Sexo de la víctima')].strip() or 'Sin información'
   category=r.get('Manera de Muerte',r.get('Contexto de Violencia','Violencia de pareja')).strip() or 'Sin información'
   years[year]+=1
   if dept not in {str(x).zfill(2) for x in [5,8,11,13,15,17,18,19,20,23,25,27,41,44,47,50,52,54,63,66,68,70,73,76,81,85,86,88,91,94,95,97,99]}:missing+=1
   ident=r.get('ID','');duplicates+=int(bool(ident) and ident in ids);ids.add(ident)
   counts[(year,dept,sex,category)]+=1
 # No small counts or person attributes leave this processing step.
 rows=[{'year':y,'dept':d,'sex':s,'category':c,'count':n if n>=5 else None,'suppressed':n<5} for (y,d,s,c),n in sorted(counts.items())]
 sources.append({'id':key,'name':title,'en':en,'theme':theme,'file':f.name,'producer':'Instituto Nacional de Medicina Legal y Ciencias Forenses · según archivo suministrado','unit':'Registros del archivo; no personas únicas','periods':sorted(years),'preliminary':key!='pareja','cut':'2026-08-25','rows':rows,'audit':{'input_records':sum(years.values()),'duplicate_ids':duplicates,'invalid_department_records':missing,'aggregate_cells':len(rows),'suppressed_cells':sum(x['suppressed'] for x in rows),'headers':fields},'method':'Conteo de filas por año, departamento del hecho, sexo registrado y categoría de la fuente. No se enlazan bases ni se interpreta homicidio como feminicidio.'})
 print(key, sources[-1]['audit'] | {'headers':len(fields)},flush=True)
# Population is independent context. Never automatically divides an occurrence-based count.
f=U/'PPED-AreaSexoEdadDep-2018-2050_VP (1).xlsx';ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'};pop=[]
with zipfile.ZipFile(f) as z:
 ss=[''.join(t.text or '' for t in e.iter() if t.tag.endswith('}t')) for e in ET.fromstring(z.read('xl/sharedStrings.xml'))] if 'xl/sharedStrings.xml' in z.namelist() else []
 with z.open('xl/worksheets/sheet3.xml') as h:
  for _,e in ET.iterparse(h,events=['end']):
   if not e.tag.endswith('}row'):continue
   row={}
   for c in e:
    v=c.find('m:v',ns);s=v.text if v is not None else ''.join(t.text or '' for t in c.iter() if t.tag.endswith('}t'))
    if c.get('t')=='s' and s:s=ss[int(s)]
    row[''.join(x for x in c.get('r','') if x.isalpha())]=s
   if row.get('C') in ['2024','2025','2026'] and row.get('A') and row.get('G'):
    pop.append({'dept':str(row['A']).zfill(2),'name':row.get('B'),'year':row['C'],'area':row.get('D'),'women':int(float(row['G'])),'men':int(float(row['F']))})
   e.clear()
popcount=collections.Counter()
for r in pop:popcount[(r['dept'],r['year'])]+=r['women']
out={'version':8,'sources':sources,'population':{'file':f.name,'method':'Suma de mujeres de Cabecera Municipal y Centros Poblados y Rural Disperso. Solo contexto demográfico; no denominador automático de tasas por lugar del hecho.','rows':[{'dept':d,'year':y,'women':v} for (d,y),v in sorted(popcount.items())]},'inventory':inventory,'privacy':'Se omiten celdas de 1 a 4 registros. Los totales visibles son mínimos y no permiten reconstruir las celdas omitidas. Sin microdatos, direcciones ni coordenadas de personas. Política provisional pendiente de aprobación institucional.'}
(A/'libres_data_v8.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':')))
print('Sources',len(sources),'Population',len(popcount),'Inventory',len(inventory))
