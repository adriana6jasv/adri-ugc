import assert from 'node:assert/strict';
import { readFile, access, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { build, dist, root } from './build.mjs';
import { site } from '../src/content.mjs';
import { render } from '../src/render.mjs';

await build();
const html = await readFile(path.join(dist, 'index.html'), 'utf8');

// 1. IDs únicos
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'Todos los IDs en el DOM deben ser únicos');

// 2. Anclas válidas
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  assert(ids.includes(match[1]), `Ancla existente: #${match[1]}`);
}

// 3. Estructura semántica
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Debe haber exactamente un H1 editorial');
assert.equal((html.match(/<article class="spotlight-case\b/g) || []).length, 3, 'Deben existir exactamente tres artículos de video (spotlights)');
assert.equal((html.match(/class="differential-row"/g) || []).length, 4, 'Deben existir exactamente cuatro filas en El Enfoque');

// 4. Contacto y Redes
assert(html.includes('mailto:hola@maternidadconadri.com'), 'Email de contacto presente');
assert(html.includes('https://instagram.com/maternidadconadri'), 'Enlace a Instagram presente');

// 5. Verificación estricta: CERO PRECIOS NI PAQUETES PROHIBIDOS
const banned = ['$3,200', '$7,500', 'Paquete Individual', 'Paquete de 3', 'tarifas base', 'paquete individual'];
for (const term of banned) {
  assert(!html.toLowerCase().includes(term.toLowerCase()), `Término prohibido encontrado en HTML: "${term}"`);
}

// 6. Copys esenciales de la refactorización editorial
assert(html.includes('México'), 'Mención de México presente');
assert(html.includes('Contenido auténtico que conecta con familias reales.'), 'Tagline esencial presente');
assert(html.includes('No sólo creo contenido. Sé cómo contarlo.'), 'Manifesto diferencial presente');
assert(html.includes('CREADORA UGC &amp; COMUNICADORA') || html.includes('CREADORA UGC & COMUNICADORA'), 'Diferenciador presente');
assert(html.includes('Mamá con formación en Comunicación y Periodismo.'), 'Hero copy humanizado presente');
assert(html.includes('Facturación'), 'Mención de facturación fiscal SAT');
assert(html.includes('GTM-N5RK6MLW'), 'GTM tag presente');
assert(html.includes('G-0LG1K9B8FP'), 'GA4 tag presente');

// 7. Todos los assets referenciados deben existir en dist
for (const match of html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)) {
  if (!match[1].startsWith('/#') && !match[1].endsWith('/')) {
    await access(path.join(dist, match[1]));
  }
}

// 8. Estados de video listos con Vercel Blob
assert.equal((html.match(/<video\b/g) || []).length, 3, 'Tres tags de video en dist/index.html');
assert.equal((html.match(/preload="metadata"/g) || []).length, 3, 'Preload metadata en todos');
assert.equal((html.match(/playsinline/g) || []).length, 3, 'Playsinline en todos');
assert((html.match(/muted/g) || []).length >= 3, 'Inicio silenciado');
for (const piece of site.work.pieces) {
  assert(html.includes(piece.video), `URL de video presente: ${piece.video}`);
  assert(html.includes(piece.poster), `URL de poster presente: ${piece.poster}`);
}

// 9. Código JS y CSS
const source = await readFile(path.join(root, 'src/main.js'), 'utf8');
assert(source.includes('visibilitychange'), 'Pausa al cambiar de pestaña en main.js');

const css = await readFile(path.join(dist, 'styles.css'), 'utf8');
assert(css.includes('prefers-reduced-motion'), 'Soporte de movimiento reducido en CSS');
assert(css.includes(':focus-visible'), 'Foco accesible en CSS');

// 10. Fuentes locales WOFF2
for (const file of await readdir(path.join(dist, 'fonts'))) {
  if (file.endsWith('.woff2')) {
    const data = await readFile(path.join(dist, 'fonts', file));
    assert.equal(data.subarray(0, 4).toString(), 'wOF2', `Fuente válida: ${file}`);
  }
}

// 11. Botones «Hablemos» enlazan a /hablemos/
const hablemosButtons = [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
  .filter(m => m[2].includes('Hablemos'));
assert.equal(hablemosButtons.length, 3, 'Deben existir exactamente tres botones con texto Hablemos');
for (const btn of hablemosButtons) {
  assert.equal(btn[1], '/hablemos/', `El botón Hablemos debe enlazar a /hablemos/, encontrado: ${btn[1]}`);
}

// 12. Verificación de la landing de captación /hablemos/
const leadHtml = await readFile(path.join(dist, 'hablemos/index.html'), 'utf8');
assert(leadHtml.includes('https://maternidadconadri.com/hablemos/'), 'Canonical URL en /hablemos/');
assert(leadHtml.includes('GTM-N5RK6MLW'), 'GTM tag en /hablemos/');
assert(leadHtml.includes('G-0LG1K9B8FP'), 'GA4 tag en /hablemos/');
assert(leadHtml.includes('https://js.hsforms.net/forms/embed/52036222.js'), 'Script embed de HubSpot en /hablemos/');
assert(leadHtml.includes('4ce2d475-ba60-4534-bda0-ad4deaaaea41'), 'Form ID de HubSpot presente');
assert(leadHtml.includes('52036222'), 'Portal ID de HubSpot presente');
assert(leadHtml.includes('Cuéntame sobre'), 'Titular de campaña presente');
assert(leadHtml.includes('Reviso tu brief'), 'Paso 1 del proceso presente');
assert(leadHtml.includes('Te respondo'), 'Paso 2 del proceso presente');
assert(leadHtml.includes('Armamos la propuesta'), 'Paso 3 del proceso presente');
assert(leadHtml.includes('Presupuestos y pagos en MXN') || leadHtml.includes('pesos mexicanos (MXN)'), 'Mención de MXN presente');
assert(leadHtml.includes('Facturación fiscal en México'), 'Mención de facturación fiscal SAT presente');
assert(leadHtml.includes('href="/"'), 'Enlace para volver al portafolio presente');

// 13. Verificación de CSP para HubSpot
const headers = await readFile(path.join(dist, '_headers'), 'utf8');
assert(headers.includes('https://js.hsforms.net'), 'CSP permite js.hsforms.net');
assert(headers.includes('https://*.hubspot.com'), 'CSP permite *.hubspot.com');
assert(headers.includes('https://*.hsforms.com'), 'CSP permite *.hsforms.com');
assert(headers.includes('form-action') && headers.includes('https://*.hubspot.com'), 'CSP form-action permite HubSpot');

const files = ['index.html', 'styles.css', 'main.js', 'icons.mjs', 'lead.css', 'hablemos/index.html'];
const bytes = (await Promise.all(files.map(f => stat(path.join(dist, f))))).reduce((a, s) => a + s.size, 0);
console.log(`OK: verificación editorial pulida exitosa. Anclas, 3 spotlights visuales, 4 enfoques, 3 botones Hablemos -> /hablemos/, landing con HubSpot integrada, CSP verificado y fuentes WOFF2. Total: ${(bytes / 1024).toFixed(1)} KB.`);
