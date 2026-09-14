# Adri — portfolio UGC

Portfolio editorial de una página, construido y verificado **localmente**. La publicación en Vercel queda pendiente por indicación del usuario. No se ha creado un proyecto remoto ni una URL pública.

La versión final toma como inspiración visual las referencias de Anna’s Frames y Katie UGC aportadas durante el trabajo: nombre más protagonista, retrato en capas, contacto desde el hero y videos tras la presentación breve. Conserva el posicionamiento propio de Adri y no reutiliza los activos ni las afirmaciones de esas creadoras.

## Abrir y ejecutar

Requisito: Node.js 20 o superior. No necesitas instalar dependencias.

Desde esta carpeta:

```sh
npm run dev
```

Abre **http://localhost:4173**. El servidor observa cambios en `src/` y `public/`: guarda el archivo, espera el mensaje de generación y recarga el navegador. Para detenerlo, pulsa Ctrl+C en la terminal.

En Windows también puedes hacer doble clic en **ABRIR-PORTFOLIO.cmd**. Si ya hay un servidor en el puerto 4173, basta con abrir la URL. No abras `dist/index.html` con doble clic: las rutas están preparadas para un servidor web.

Para generar la versión que se publicará:

```sh
npm run build
npm run preview
```

`dist/` se regenera completamente. **No edites nada en `dist/`**: tus cambios se perderán. `npm run check` comprueba las anclas, enlaces, archivos y estados de contenido.

## Reemplazar la foto de Adri

1. Coloca una foto real en `public/images/adri.webp`.
2. Usa preferentemente una foto vertical de aproximadamente 1200 × 1500 px, optimizada a WebP (idealmente menos de 250 KB), con luz natural y espacio alrededor del rostro.
3. El build detecta el archivo y sustituye automáticamente el monograma provisional.
4. En `src/content.mjs`, ajusta `portrait.alt` y `portrait.position` para describir y encuadrar la foto. Por ejemplo: `position: '50% 35%'`.

Si prefieres JPG, cambia también `portrait.src` a `/images/adri.jpg`. No uses una persona de stock para representar a Adri.

## Subir los tres videos

Reemplaza los marcadores de cero bytes dentro de `public/videos/` por estos archivos:

| Pieza | Archivo |
| --- | --- |
| Problem → Solution | `video-problem-solution.mp4` |
| Voice-over Storytelling | `video-voiceover.mp4` |
| Real Mom Storytelling | `video-real-mom-storytelling.mp4` |

Formato recomendado: MP4, video H.264, audio AAC, relación **9:16**, 1080 × 1920 px y 24 o 30 fps. Exporta con optimización para streaming web (fast start). Como referencia de peso, intenta 5–12 MB por pieza según duración y calidad; no es un límite técnico.

Cada archivo se activa individualmente al generar el sitio. La comprobación identifica el contenedor MP4; **no sustituye la revisión del codec, audio ni contenido**. Los archivos vacíos no se copian al sitio, y no hay peticiones a videos ausentes. Cuando los tres videos están disponibles, desaparece el aviso de piezas pendientes.

Los reproductores incluyen play/pausa, audio, línea de tiempo y pantalla completa cuando el navegador la admite. Solo un video puede reproducirse a la vez; se pausa al salir de pantalla o al ocultar la pestaña. No hay autoplay. El video carga únicamente cuando se solicita (`preload="none"`). Si JavaScript falla, quedan los controles nativos del navegador.

### Subtítulos

Se recomienda añadir subtítulos reales, sincronizados, en formato WebVTT:

- `public/videos/problem-solution.es.vtt`
- `public/videos/voiceover.es.vtt`
- `public/videos/real-mom.es.vtt`

Cuando existen, se incluyen como pista de español y se muestran por defecto. No se han inventado transcripciones.

## Cambiar las portadas

Las portadas provisionales están en `public/images/`:

- `poster-problem-solution.svg`
- `poster-voiceover.svg`
- `poster-real-mom.svg`

Para videos reales, usa fotogramas verticales de 720 × 1280 px o 1080 × 1920 px en WebP o JPG. Guarda los archivos en esa carpeta y cambia `poster` en cada pieza de `src/content.mjs`.

Las portadas tipográficas de los espacios pendientes se construyen con `cover` y `tone` en el mismo archivo. Se muestran hasta incorporar el video. Las SVG son referencias conceptuales y no se usan como apertura de videos reales; puedes regenerarlas con `node scripts/posters.mjs` después de cambiar el texto. No ejecutes este comando sobre SVG que hayas diseñado manualmente: escribe de nuevo los tres archivos.

## Editar textos, email e Instagram

Todo el contenido principal está centralizado en **`src/content.mjs`**:

- `hero`, `about`, `craft`: presentación y diferenciador.
- `work.pieces`: nombres, descripciones, tags y archivos de cada video.
- `capabilities`, `industries`, `why`, `contact`: oferta y cierre.
- `email`: actualiza todos los enlaces `mailto:`.
- `instagram` y `instagramUrl`: nombre visible y dirección real del perfil.
- `title` y `description`: título y descripción SEO.

Guarda, vuelve a generar y recarga. No hay que editar el HTML a mano.

## Imagen para compartir y SEO

`public/images/og-adri.jpg` es la imagen **1200 × 630** para WhatsApp y redes. Se construyó con el mismo sistema tipográfico y cromático del sitio. Su composición editable se conserva en `public/og-preview.html` y `public/og-preview.css`; esta página es una utilidad visual, no está enlazada en el portfolio.

Al publicar, escribe la URL real en `site.url` dentro de `src/content.mjs`, por ejemplo `https://adri-ugc.vercel.app` **solo si ese dominio fue asignado al proyecto**. Esto genera canonical, `og:url`, rutas absolutas de imágenes, sitemap y referencia del sitemap en robots.txt. No se inventó una URL de producción.

Las previsualizaciones de WhatsApp no pueden comprobarse con una dirección localhost: habrá que revisarlas después del despliegue público. Las redes pueden conservar la imagen anterior en caché; al sustituirla conviene usar un nuevo nombre y actualizar sus dos referencias en `src/render.mjs`.

## Publicar más adelante en Vercel

El archivo `vercel.json` ya configura la generación estática y los encabezados. No hay variables secretas, backend ni servicios que conectar.

1. Inicia sesión en tu cuenta de Vercel cuando el servicio esté disponible.
2. Desde esta carpeta, instala/ejecuta su CLI oficial y vincula el proyecto:

```sh
npx vercel login
npx vercel link
```

3. Selecciona tu cuenta/equipo y crea `adri-ugc` o una variante disponible. Comprueba que `.vercel/project.json` corresponde al proyecto correcto.
4. Haz un primer despliegue para conocer la URL asignada, incorpora esa dirección en `site.url`, y publica la versión con metadatos definitivos:

```sh
npm run check
npx vercel --prod
```

Los cambios posteriores se publican con el mismo comando desde esta carpeta. No se necesita comprar un dominio. También puedes importar el código desde un repositorio propio, con framework **Other**, build **npm run build** y output **dist**.

## Estructura

```text
src/
  content.mjs        Identidad, copy y rutas de medios
  render.mjs         HTML estático, SEO y componentes
  styles.css         Sistema visual y responsive
  refinements.css    Ajustes de la revisión visual
  main.js            Controles de video y movimiento
  icons.mjs          SVG de controles
public/
  fonts/             Cuatro WOFF2 locales y licencias OFL
  images/            Portadas, favicon y Open Graph
  videos/            Tres marcadores para los videos reales
scripts/
  build.mjs          Genera dist sin dependencias
  dev.mjs            Servidor local y observación de cambios
  check.mjs          Comprobaciones de integridad
  posters.mjs        Regenera SVG provisionales
```

## Lo que falta aportar

- **Una fotografía real de Adri.**
- **Tres videos reales**, con sus portadas definitivas.
- Subtítulos reales de esos videos, recomendados.

No hay estadísticas, seguidores, clientes, testimonios, colaboraciones ni resultados inventados. Las portadas explican conceptos; no se presentan como campañas realizadas. La prueba comercial del trabajo se completará al añadir los videos.

## Validación y límites

Consulta `QA.md`. Se verificaron los enlaces de contacto sin enviar mensajes. El enlace email requiere que el visitante tenga configurada una aplicación de correo. La disponibilidad del perfil, una respuesta por email y la entrega de mensajes no se deducen del funcionamiento de los enlaces.

Las capturas están en la carpeta de entregables, junto al proyecto. Las fuentes tienen licencia SIL OFL 1.1 y se sirven desde el propio sitio. La página no carga analítica, cookies, scripts de terceros ni rastreadores.


## Actualización para agencias y marcas

Datos confirmados: Ciudad de México, México; español; estrategia y producción; perfil Adulto / Mamá / Lifestyle / Wellness; entrega de 3–5 días hábiles tras recibir el producto. Las modalidades y entregables están en collaboration dentro de src/content.mjs.

- agencyFolderUrl: pegar el enlace público HTTPS del Media Kit / Reel en Drive. Al completarlo aparece el botón secundario en el hero. Comprobar acceso sin sesión y permiso de descarga; no se modifican permisos automáticamente.
- pricing: completar range con moneda y rango, includes con duración/hooks/revisiones/derechos y note con condiciones. Activar visible solo cuando Adri confirme cifras y alcance. El usuario quiere publicar un rango una vez confirmado.
- paidIdentity y paidIdentityDays: completar únicamente si se confirma whitelisting / Spark Ads y sus periodos. No se presupone que están incluidos.
- Cada pieza admite topic, downloadUrl y language. Los filtros muestran solo los tres nichos de las muestras actuales. No crear una categoría sin contenido.
- Cuando se incorpora un MP4 válido aparece su descarga local. downloadUrl permite sustituirla por una descarga en Drive. El enlace por pieza usa su ancla; compartir la URL desde la barra del navegador. Localhost solo es accesible desde este equipo.
- Los videos empiezan silenciados, sin autoplay; el botón de sonido permite escucharlos. Usar subtítulos integrados como parte de la entrega confirmada y, si procede, la pista VTT accesible existente.
- languages[].sampleId vincula cada idioma con una muestra real cuando su video está disponible.
- Consultar GUIA-DE-MUESTRAS.md para aperturas, variedad y pitch. Las tres tarjetas siguen identificadas como conceptos hasta recibir los videos.

Pendientes: retrato, tres videos, enlace Drive, cifras y alcance de tarifas, disponibilidad y periodos de whitelisting/Spark Ads. Publicación en Vercel aplazada por el usuario.
