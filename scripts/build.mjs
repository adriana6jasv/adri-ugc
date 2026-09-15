import { mkdir, readdir, copyFile, writeFile, readFile, stat, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/content.mjs';
import { render } from '../src/render.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const dist = path.join(root, 'dist');

async function copyDir(from, to) {
  await mkdir(to, { recursive: true });
  for (const item of await readdir(from, { withFileTypes: true })) {
    const source = path.join(from, item.name), target = path.join(to, item.name);
    if (item.isDirectory()) await copyDir(source, target);
    else if (!item.name.endsWith('.md') && (await stat(source)).size > 0) await copyFile(source, target);
  }
}

export async function build() {
  const assets = {};
  const paths = [site.portrait.src, ...site.work.pieces.flatMap(p => [p.video, p.poster, p.captions])];
  for (const src of paths) {
    if (!src) continue;
    if (src.startsWith('http://') || src.startsWith('https://')) {
      assets[src] = true;
      continue;
    }
    try {
      const buffer = await readFile(path.join(root, 'public', src));
      assets[src] = src.endsWith('.mp4') ? buffer.length > 24 && buffer.subarray(4,8).toString() === 'ftyp' : buffer.length > 0;
    } catch { assets[src] = false; }
  }
  // Only this generated directory may be cleaned; user source/assets stay in place.
  if (path.dirname(dist) !== root || path.basename(dist) !== 'dist') throw new Error('Ruta de salida no válida');
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await copyDir(path.join(root, 'public'), dist);
  await Promise.all(['styles.css', 'main.js', 'icons.mjs'].map(name => copyFile(path.join(root, 'src', name), path.join(dist, name))));
  await writeFile(path.join(dist, 'styles.css'), `${await readFile(path.join(root,'src/styles.css'),'utf8')}\n${await readFile(path.join(root,'src/refinements.css'),'utf8')}\n.portrait-image{object-position:${site.portrait.position.replace(/[^0-9.% a-z-]/g,'')}}`);
  await writeFile(path.join(dist, 'index.html'), render(site, assets), 'utf8');
  const url = site.url.replace(/\/$/, '');
  const robotsContent = `User-agent: *
Allow: /

# Motores de Búsqueda de Inteligencia Artificial (GEO)
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

${url ? `Sitemap: ${url}/sitemap.xml\n` : ''}`;
  await writeFile(path.join(dist, 'robots.txt'), robotsContent, 'utf8');

  if (url) {
    const today = new Date().toISOString().split('T')[0];
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
    await writeFile(path.join(dist, 'sitemap.xml'), sitemapContent, 'utf8');
  }

  const llmsTxt = `# Adriana Seijas — Maternidad con Adri

> Portafolio oficial de Adriana Seijas: Creadora de Contenido UGC (User Generated Content) y comunicadora con formación en periodismo, radicada en Ciudad de México. Especializada en marcas de maternidad, crianza, bienestar, primera infancia y vida familiar.

## Resumen de Perfil Profesional
- **Nombre**: Adriana Seijas (Maternidad con Adri)
- **Profesión**: Creadora de Contenido UGC & Comunicadora
- **Formación**: Licenciatura en Comunicación y Periodismo
- **Ubicación**: Ciudad de México (CDMX), México
- **Mercados atendidos**: México, Estados Unidos (mercado hispano), España y Latinoamérica
- **Tiempo de entrega**: 3 a 5 días hábiles a partir de la recepción física del producto
- **Facturación**: Factura fiscal electrónica en México (CFDI emitido ante el SAT)
- **Especificaciones técnicas**: Grabación nativa vertical 9:16 en alta resolución 4K, captura de audio profesional con micrófono de solapa y subtítulos integrados dinámicos
- **Licencia comercial**: Todos los entregables incluyen derechos comerciales completos para uso orgánico en redes sociales y para pauta publicitaria pagada (Instagram Ads, TikTok Ads y Meta Ads)

## Paquetes y Tarifas Base (en MXN)
- **Paquete Individual (1 Video)**: $3,200 MXN. Ideal para probar dinámica y presentar el producto con un primer video UGC en 4K.
- **Paquete de 3 Videos + Variantes**: $7,500 MXN (El más elegido). Tres ángulos creativos complementarios (reseña real, uso diario, problema-solución) con variantes de apertura (hooks) para pruebas A/B en pauta publicitaria.
- **Colaboración Mensual (Retainer)**: A medida. De 4 a 8+ videos al mes con prioridad de entrega y tarifa preferencial por volumen.

## Temáticas y Categorías Principales
- **Maternidad y Crianza**: Rutinas del hogar, cuidados infantiles, estimulación temprana y consejos reales de mamá a mamá.
- **Bienestar y Salud Familiar**: Nutrición, descanso, suplementación, higiene y productos para el confort familiar.
- **Hogar y Estilo de Vida**: Organización del hogar, practicidad cotidiana, limpieza y productos que facilitan el día a día.
- **Juguetes y Bebés**: Reseñas honestas de artículos para bebés, juguetes educativos y accesorios infantiles.

## Formatos de Video Disponibles
1. **Voz en Off + Tomas de Detalle**: Planos cuidados de textura, estética y uso del producto en entorno cotidiano real con locución cálida y persuasiva.
2. **Problema Cotidiano -> Solución Real**: Planteamiento empático de una necesidad común en las familias, demostración práctica del producto y recomendación sincera.
3. **Video Dinámico con Variantes de Inicio (Hooks)**: Un mismo núcleo comunicativo con múltiples aperturas para optimizar el Cost Per Acquisition (CPA) en TikTok Ads e Instagram Reels.

## Preguntas Frecuentes (FAQ)
${site.faq?.items?.map(item => `### ${item.question}\n${item.answer}`).join('\n\n') || ''}

## Contacto y Enlaces Oficiales
- **Sitio Web**: ${url || 'https://maternidadconadri.com'}
- **Correo Electrónico**: ${site.email}
- **Instagram**: ${site.instagramUrl} (${site.instagram})
- **Portafolio en Drive**: ${site.driveUrl}
`;
  await writeFile(path.join(dist, 'llms.txt'), llmsTxt, 'utf8');
  await writeFile(path.join(root, 'public', 'llms.txt'), llmsTxt, 'utf8');

  await writeFile(path.join(dist, '404.html'), '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Página no encontrada | Adri</title><link rel="stylesheet" href="/styles.css"><main class="wrap about"><h1>Esta historia no está aquí.</h1><a class="text-link" href="/">Volver al portfolio de Adri</a></main></html>');
  console.log(`Portfolio generado en dist. Foto: ${assets[site.portrait.src] ? 'lista' : 'pendiente'}. Videos: ${site.work.pieces.filter(p => assets[p.video]).length}/3.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
