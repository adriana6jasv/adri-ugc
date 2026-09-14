# Verificación local — 13 de septiembre de 2026

## Estado

Portfolio local construido. Vercel se aplazó expresamente por el usuario. La versión final incorpora inspiración visual de Anna’s Frames y Katie UGC: nombre protagonista, retrato en capas, contacto temprano, fondos ligeros y trabajo antes de la explicación extensa del oficio.

## Comprobaciones realizadas

- Generación estática y prueba de integridad con `npm run check`: anclas existentes, IDs únicos, tres spotlights, un h1, rutas de fuentes y recursos, enlaces de contacto y estados con/sin videos.
- Revisión visual de portada y recorrido completo en escritorio y móvil. Capturas completas guardadas como `desktop-completo.jpg` y `mobile-completo.jpg`, además de las primeras pantallas.
- Anchos de navegador comprobados: 320, 390, 768, 1280 y 1440 px. Sin elementos del contenido fuera del ancho de la pantalla en las mediciones realizadas.
- Tab desde la entrada: foco visible en «Saltar al contenido».
- CTA «Ver mi trabajo» dirigido a `#trabajo`; CTA de colaboración a `#contacto`.
- Email: `mailto:adriana6jasv@gmail.com`. Instagram: `https://instagram.com/maternidadconadri`, en otra pestaña con `noopener noreferrer`. No se enviaron mensajes.
- Prueba funcional del reproductor con un MP4 CC0 de MDN en una página temporal separada: play, pausa, silencio, avance mediante teclado y exclusión entre videos confirmados. La página y el video de prueba se eliminaron de `dist/` al generar la entrega.
- Carga de video a demanda y recuperación de controles nativos sin JavaScript implementadas. Pausa al ocultar pestaña y al salir de pantalla implementadas; no hubo validación en dispositivos iOS físicos.
- Sin errores de consola observados durante las pruebas del reproductor.
- Cuatro fuentes WOFF2 locales válidas, con licencias incluidas. Ninguna petición externa necesaria para representar el portfolio.
- Open Graph JPEG de 1200 × 630 generado y visto. La previsualización real de WhatsApp se comprobará al publicar.

## Accesibilidad y rendimiento

Contrastes medidos: tinta principal sobre papel 12.61:1; texto secundario sobre papel 5.48:1; papel sobre arcilla 6.07:1. La paleta nueva usa tinta oscura sobre salvia y arena clara. Foco visible, semántica de secciones, textos alternativos, enlaces descriptivos, modo de movimiento reducido y controles de video de 44 px implementados.

HTML + CSS + JS sin frameworks ni librerías externas. Fuentes locales, video sin precarga y contenido estático legible sin JavaScript. No se ha ejecutado Lighthouse ni medido Core Web Vitals de campo; no se afirma una puntuación de rendimiento.

## Revisión del diseño

La primera versión obtuvo revisión independiente «ship local» para sus capturas y código revisados. El usuario aportó después dos referencias. La revisión de la adaptación final y la documentación se completaron manualmente en la tarea principal, porque el agente de documentación alcanzó su límite de uso. No se atribuye al revisor independiente una aprobación de esta adaptación posterior.

### Revisión final manual

- **Disposición:** ship para entrega local con los materiales pendientes expresamente señalados.
- **Persistencia:** código, contenido centralizado, README y sistema visual documentados.
- **Fidelidad:** nombre y formación de Adri visibles; retrato y nota en capas; tres videos antes de la sección de oficio; contacto temprano; sin material ni claims tomados de las referencias.
- **Calidad y límites:** composición comprobada en las capturas completas. La demostración comercial seguirá incompleta hasta aportar videos reales. No hubo validación física en Safari/iPhone ni auditoría formal completa de accesibilidad.
- **Correcciones materiales:** descriptor móvil visible; aviso de retrato pendiente reubicado arriba para que la nota no lo tape; sin otros defectos materiales detectados en esta revisión.
- **Conservar:** nicho de maternidad y familia, formación en comunicación, transparencia de placeholders y simplicidad de reproducción.

## Pendiente de materiales o publicación

Foto real, tres videos, portadas definitivas y subtítulos reales recomendados. URL de Vercel, canonical definitivo, sitemap público y prueba de WhatsApp se completarán al desplegar. El email necesita un cliente de correo configurado; no se ha probado la entrega de correo ni se garantiza la disponibilidad externa de Instagram.


## Revisión de criterios de agencias

Comprobación automática: tres conceptos sin descargas falsas; tres videos de prueba con descarga local, inicio silenciado y sin poster de logo; tarifas ocultas sin confirmación y visibles con configuración de prueba; Drive condicional. Navegador: filtro Infancia muestra solo voiceover; Todas mediante Enter devuelve tres piezas; reproducción de fixture inicia silenciada y permite activar sonido. Sin desbordamiento horizontal a 390 y 1440 px. Capturas actualizadas. Videos y retrato reales pendientes; no se ha evaluado la retención ni el contenido audiovisual de Adri. La página de prueba se elimina al generar la entrega final. Vercel no publicado.
