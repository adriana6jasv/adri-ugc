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
assert.equal((html.match(/class="[^"]*v2-video-card/g) || []).length, 3, 'Deben existir tres tarjetas de video (spotlights)');

// 4. Contacto y Redes
assert(html.includes('mailto:adriana6jasv@gmail.com'), 'Email de contacto presente');
assert(html.includes('href="https://instagram.com/maternidadconadri"'), 'Enlace a Instagram presente');

// 5. Todos los assets referenciados deben existir en dist
for (const match of html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)) {
  if (!match[1].startsWith('/#') && !match[1].endsWith('/')) {
    await access(path.join(dist, match[1]));
  }
}

// 6. Estados de video listos
const ready = Object.fromEntries(site.videos.items.map(p => [p.src, true]));
const active = render(site, ready);
assert.equal((active.match(/<video\b/g) || []).length, 3, 'Tres tags de video cuando están listos');
assert.equal((active.match(/preload="none"/g) || []).length, 3, 'Preload none en todos');
assert.equal((active.match(/playsinline/g) || []).length, 3, 'Playsinline en todos');
assert((active.match(/muted/g) || []).length >= 3, 'Inicio silenciado');

// 7. Copys esenciales de v1 preservados
assert(html.includes('México'), 'Mención de México presente');
assert(html.includes('3–5 días hábiles') || html.includes('RESPUESTA EN 1–2 DÍAS'), 'Tiempos de entrega / respuesta');
assert(html.includes('$3,200'), 'Precio paquete individual');
assert(html.includes('$7,500'), 'Precio paquete 3 videos');
assert(html.includes('Facturación Electrónica'), 'Mención de facturación fiscal SAT');

// 8. Código JS y CSS
const source = await readFile(path.join(root, 'src/main.js'), 'utf8');
assert(source.includes('visibilitychange'), 'Pausa al cambiar de pestaña en main.js');

const css = await readFile(path.join(dist, 'styles.css'), 'utf8');
assert(css.includes('prefers-reduced-motion'), 'Soporte de movimiento reducido en CSS');
assert(css.includes(':focus-visible'), 'Foco accesible en CSS');

// 9. Fuentes locales WOFF2
for (const file of await readdir(path.join(dist, 'fonts'))) {
  if (file.endsWith('.woff2')) {
    const data = await readFile(path.join(dist, 'fonts', file));
    assert.equal(data.subarray(0, 4).toString(), 'wOF2', `Fuente válida: ${file}`);
  }
}

const files = ['index.html', 'styles.css', 'main.js', 'icons.mjs'];
const bytes = (await Promise.all(files.map(f => stat(path.join(dist, f))))).reduce((a, s) => a + s.size, 0);
console.log(`OK: verificación exitosa de la v2. Anclas, assets, copys de v1 preservados y fuentes WOFF2. Total HTML + CSS + JS: ${(bytes / 1024).toFixed(1)} KB.`);
