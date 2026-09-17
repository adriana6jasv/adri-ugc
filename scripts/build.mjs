import { mkdir, readdir, copyFile, writeFile, readFile, stat, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/content.mjs';
import { render } from '../src/render.mjs';
import { renderLead } from '../src/lead.mjs';

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
  const paths = [site.portrait.src, ...site.work.pieces.flatMap(p => [p.video, p.poster, p.captions])].filter(Boolean);
  for (const src of paths) {
    if (src.startsWith('http://') || src.startsWith('https://')) {
      assets[src] = true;
      continue;
    }
    try {
      const buffer = await readFile(path.join(root, 'public', src));
      assets[src] = src.endsWith('.mp4') ? buffer.length > 24 && buffer.subarray(4,8).toString() === 'ftyp' : buffer.length > 0;
    } catch { assets[src] = false; }
  }

  // Ensure clean dist directory
  if (path.dirname(dist) !== root || path.basename(dist) !== 'dist') throw new Error('Ruta de salida no válida');
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await copyDir(path.join(root, 'public'), dist);
  await Promise.all(['styles.css', 'refinements.css', 'main.js', 'icons.mjs', 'lead.css'].map(name => copyFile(path.join(root, 'src', name), path.join(dist, name))));
  
  // Concatenate main styles and refinements
  const mainCss = await readFile(path.join(root, 'src/styles.css'), 'utf8');
  const refCss = await readFile(path.join(root, 'src/refinements.css'), 'utf8');
  await writeFile(path.join(dist, 'styles.css'), `${mainCss}\n${refCss}\n.hero-portrait-img{object-position:${site.portrait.position.replace(/[^0-9.% a-z-]/g,'')}}`);

  await writeFile(path.join(dist, 'index.html'), render(site, assets), 'utf8');
  await mkdir(path.join(dist, 'hablemos'), { recursive: true });
  await writeFile(path.join(dist, 'hablemos', 'index.html'), renderLead(site), 'utf8');
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
  <url>
    <loc>${url}/hablemos/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
`;
    await writeFile(path.join(dist, 'sitemap.xml'), sitemapContent, 'utf8');
  }

  const llmsTxt = `# Adriana Seijas — Portfolio UGC Editorial

> Portafolio oficial de Adriana Seijas: Creadora de Contenido UGC (User Generated Content) y comunicadora con formación en Comunicación y Periodismo, radicada en Ciudad de México. Especializada en maternidad, niños, juguetes, moda infantil, productos maternos y family lifestyle.

## Posicionamiento y Enfoque
- **Nombre**: Adriana Seijas
- **Rol**: Creadora UGC & Comunicadora
- **Diferencial**: Mamá real + formación en Comunicación y Periodismo
- **Ubicación**: Ciudad de México, México
- **Disponibilidad**: Marcas de México y mercados de habla hispana
- **Tiempos de respuesta**: 1 a 2 días hábiles
- **Facturación**: Facturación disponible en México (CFDI emitido ante el SAT)
- **Especificaciones técnicas**: Grabación vertical nativa 9:16 en alta resolución 4K, audio profesional y subtítulos integrados dinámicos
- **Derechos de uso**: Derechos de uso orgánico incluidos. Paid Media, whitelisting, exclusividad y periodos extendidos de uso se acuerdan según cada campaña.

## Spotlight Work (Formatos Clave)
1. **Problem → Solution**: Plantea una situación cotidiana con la que cualquier familia empatiza de inmediato y muestra cómo el producto aporta una respuesta práctica, cerrando con una recomendación genuina.
2. **Voice-over Storytelling**: Tomas detalladas de textura, estética y uso del producto en un entorno familiar real, con una locución cálida y fluida que explica beneficios de manera agradable.
3. **Real Mom Storytelling**: Cercanía auténtica frente a cámara. Una anécdota real de maternidad donde el producto entra orgánicamente en la conversación, sin clichés ni tono publicitario impostado.

## Formas de Trabajar
- **Opción A — Concepto + Guion + Producción**: Adri desarrolla el enfoque creativo, estructura la historia, crea o adapta el guion y produce el video completo listo para publicar.
- **Opción B — Producción desde tu Brief**: La marca o agencia aporta el concepto o script y Adri lo interpreta y produce naturalmente frente a cámara con iluminación y audio cuidados.

## Capabilities y Categorías
- **Capabilities**: Problem → Solution, Voice-over, Storytelling, Product Demo, Testimonial, Unboxing, Hooks, Paid Social Creative.
- **Nicho**: Maternidad, Niños, Juguetes, Moda Infantil, Productos Maternos, Family Lifestyle.

## Contacto Oficial
- **Sitio Web**: ${url || 'https://maternidadconadri.com'}
- **Correo Electrónico**: ${site.email}
- **Instagram**: ${site.instagramUrl} (${site.instagram})
`;

  await writeFile(path.join(dist, 'llms.txt'), llmsTxt, 'utf8');
  await writeFile(path.join(root, 'public', 'llms.txt'), llmsTxt, 'utf8');

  await writeFile(path.join(dist, '404.html'), '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Página no encontrada | Adri</title><link rel="stylesheet" href="/styles.css"><main class="container" style="padding-top:120px;text-align:center"><h1 style="font-family:var(--font-serif);font-size:42px;margin-bottom:20px">Esta historia no está aquí.</h1><a style="color:var(--terracotta);font-weight:600" href="/">Volver al portfolio de Adri</a></main></html>');
  console.log(`Portfolio editorial generado en dist. Foto: ${assets[site.portrait.src] ? 'lista' : 'pendiente'}. Videos: ${site.work.pieces.filter(p => assets[p.video]).length}/3.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
