# Observatorio de Mujeres en todas sus diversidades · ¡LIBRES!

Este repositorio publica dos páginas con GitHub Pages:

| Página | Enlace público | Archivo publicado |
|---|---|---|
| Consulta pública | https://alejandramarketing65-debug.github.io/observatorio-publico/ | `index.html` |
| Administración | https://alejandramarketing65-debug.github.io/observatorio-publico/admin/ | `admin/index.html` |

Todo lo que se sube a la rama `main` se publica automáticamente en uno o dos minutos.

## Estructura

```
index.html                         ← consulta pública (versión publicada)
admin/index.html                   ← administración (versión publicada)
codigo-fuente/
  consulta-publica/Consulta_Publica_Observatorio.html   ← original del equipo
  administracion/Administracion_Observatorio.html       ← original del equipo
  codigo-comentado/                                     ← módulos comentados por versión (CSS, JS, datos, ilustraciones, scripts)
```

### Código comentado (`codigo-fuente/codigo-comentado/`)

Contiene los módulos de cada versión con sus comentarios (por ejemplo `rutas_atencion_v50.js`, `inicio_accesibilidad_v24.css`), los datos agregados (`libres_datos_agregados_v8.json`, `colombia.geojson`), las ilustraciones y los scripts Python de preparación. Es material de **referencia**: las páginas publicadas son archivos autónomos que ya incluyen estos módulos, así que no hace falta cargarlos aparte. Consulte `LEEME_codigo_v8.md` dentro de la carpeta.

Los archivos HTML de esa carpeta (`public.html`, `admin.html`, etc.) son prototipos de versiones anteriores y **no** son los enlaces oficiales.

### ¿Cuál es la diferencia entre la carpeta `codigo-fuente` y los archivos publicados?

- **`codigo-fuente/`** guarda los archivos tal como los entrega el equipo de diseño, con sus nombres originales. Sirve como referencia y para seguir trabajando el diseño.
- **`index.html` y `admin/index.html`** son lo que ve el público. Son el mismo código con estos ajustes añadidos al publicar:
  - Consulta: logo ¡LIBRES! en la pantalla de carga, consulta limpia (cada sección del menú empieza sin filtros), menú desplegable y línea de tiempo vertical de Sentencias en celular, menú en inglés igual al español, texto del proyecto justificado, sin espacio blanco antes del pie de página y letra más grande en la línea de tiempo de Normativa.
  - Administración: paleta morada (#672e89 con acentos #a844e2 y #35cbce) y enlaces que abren la consulta publicada.

### Para publicar cambios

- **Cambio pequeño en lo que ya está publicado** (un texto, un color): edítelo directamente en `index.html` o `admin/index.html`.
- **Versión nueva completa del diseño**: guarde el archivo nuevo en `codigo-fuente/` y pida que se vuelva a publicar con los ajustes de arriba. Si solo reemplaza `index.html` con el archivo original, esos ajustes se pierden.

> Importante: el repositorio es público. No suba datos personales ni información sensible.
