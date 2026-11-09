from pathlib import Path
import json,zipfile,xml.etree.ElementTree as E,unicodedata,re
A=Path('/workspace/scratch/43478bfd60b0/analysis');D=json.loads((A/'libres_data_v8.json').read_text());g=json.loads((A/'colombia.geojson').read_text())
def norm(s):return re.sub('[^a-z]','', ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn'))
codes={norm(x['properties']['NOMDPTO']):x['properties']['CODDPTO'] for x in g['features']};codes['bogotadc']='11';codes['valledelcauca']='76';codes['archipielagodesanandresprovidenciaysantacatalina']='88'
ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'};rows=[]
with zipfile.ZipFile(A/'referencias_v8/anex-ENUTDepartamental-2025.xlsx') as z:
 ss=[''.join(t.text or '' for t in e.iter() if t.tag.endswith('}t')) for e in E.fromstring(z.read('xl/sharedStrings.xml'))]
 for r in E.fromstring(z.read('xl/worksheets/sheet4.xml')).findall('.//m:sheetData/m:row',ns):
  vals={}
  for c in r:
   v=c.find('m:v',ns)
   if v is not None:vals[re.sub(r'\d','',c.get('r'))]=ss[int(v.text)] if c.get('t')=='s' else v.text
  code=codes.get(norm(vals.get('A','')))
  if not code or 'AK' not in vals:continue
  for sex,col,lo,hi,cv in [('Mujer','AK','AL','AM','AN'),('Hombre','AG','AH','AI','AJ')]:
   rows.append({'year':'2024-2025','dept':code,'sex':sex,'category':'Trabajo no remunerado y actividades conexas','count':float(vals[col]),'suppressed':False,'lower':float(vals[lo]),'upper':float(vals[hi]),'cve':float(vals[cv])})
D['sources'].append({'id':'enut','name':'Participación en trabajo no remunerado','en':'Participation in unpaid work','theme':'cuidados','file':'anex-ENUTDepartamental-2025.xlsx · Cuadro_2, columnas AG/AK; AL–AN y AH–AJ','producer':'DANE · ENUT Departamental','unit':'Porcentaje (%)','measure':'percent','periods':['2024-2025'],'preliminary':False,'cut':'2026-08-14','rows':rows,'method':'Estimaciones publicadas, población de 10 años y más. Se conserva el porcentaje de participación, intervalo de confianza del 95 % y CVE. No se suman ni se promedian porcentajes entre departamentos. No confundir con horas de trabajo ni con medición exclusiva de cuidados.','audit':{'aggregate_cells':len(rows),'headers':['Departamento','Sexo','Participación (%)','L.i.','L.s.','cve %']}})
(A/'libres_data_v8.json').write_text(json.dumps(D,ensure_ascii=False,separators=(',',':')))
print('ENUT',len(rows),'department codes',len(set(x['dept'] for x in rows)))
