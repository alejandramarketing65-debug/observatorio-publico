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
```

### ¿Cuál es la diferencia entre la carpeta `codigo-fuente` y los archivos publicados?

- **`codigo-fuente/`** guarda los archivos tal como los entrega el equipo de diseño, con sus nombres originales. Sirve como referencia y para seguir trabajando el diseño.
- **`index.html` y `admin/index.html`** son lo que ve el público. Son el mismo código con estos ajustes añadidos al publicar:
  - Consulta: logo ¡LIBRES! en la pantalla de carga, consulta limpia (cada sección del menú empieza sin filtros), menú desplegable y línea de tiempo vertical de Sentencias en celular, menú en inglés igual al español, texto del proyecto justificado, sin espacio blanco antes del pie de página y letra más grande en la línea de tiempo de Normativa.
  - Administración: paleta morada (#672e89 con acentos #a844e2 y #35cbce) y enlaces que abren la consulta publicada.

### Para publicar cambios

- **Cambio pequeño en lo que ya está publicado** (un texto, un color): edítelo directamente en `index.html` o `admin/index.html`.
- **Versión nueva completa del diseño**: guarde el archivo nuevo en `codigo-fuente/` y pida que se vuelva a publicar con los ajustes de arriba. Si solo reemplaza `index.html` con el archivo original, esos ajustes se pierden.

> Importante: el repositorio es público. No suba datos personales ni información sensible.
