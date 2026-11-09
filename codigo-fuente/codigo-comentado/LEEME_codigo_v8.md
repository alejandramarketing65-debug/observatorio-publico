# Código de referencia v8

Los HTML de la raíz son autónomos e incluyen los módulos de las versiones anteriores y v8. Editarlos permite trabajar directamente sin compilación. Los módulos comentados explican la implementación incremental y no deben cargarse dos veces. libres_v8.js se entrega con los agregados y cartografía incorporados.

Los scripts Python de preparación y ensamblaje documentan el proceso del entorno de trabajo original; requieren adaptar rutas y disponer de los insumos privados. No constituyen un proyecto backend instalable. Los originales no se incluyen.


## v10 · Línea viva

Los HTML de la raíz incluyen al final una capa visual autocontenida (v10) y la capa de contenidos v11 (portal_v11.css, portal_v11.js y portal_v11_data.js) (estilo `lv-linea-viva` y script `lv-linea-viva-js`). Sus fuentes comentadas son `linea_viva_v10.css` y `linea_viva_v10.js`. No modifican datos ni cálculos: solo presentación, buscador de consulta y colores por línea temática y por perfil. Para retirarla basta con eliminar esos dos bloques.
