import assert from 'node:assert/strict';
import { readFile, access, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { build, dist, root } from './build.mjs';
import { site } from '../src/content.mjs';
import { render } from '../src/render.mjs';
await build();
const html = await readFile(path.join(dist,'index.html'),'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'IDs únicos');
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(match[1]),`Ancla existente: ${match[1]}`);
assert.equal((html.match(/<h1\b/g)||[]).length,1,'Un h1');
assert.equal((html.match(/class="work-piece/g)||[]).length,3,'Tres spotlights');
assert(html.includes('mailto:adriana6jasv@gmail.com'));
assert(html.includes('href="https://instagram.com/maternidadconadri"'));
for (const match of html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)) await access(path.join(dist,match[1]));
const pending = render(site,{});
assert.equal((pending.match(/<video\b/g)||[]).length,0,'No se cargan videos pendientes');
assert.equal((pending.match(/Próximamente/g)||[]).length,3,'Tres avisos de piezas próximamente');
const ready = Object.fromEntries(site.work.pieces.map(p=>[p.video,true]));
const active = render(site,ready);
assert.equal((active.match(/<video\b/g)||[]).length,3);
assert.equal((active.match(/preload="none"/g)||[]).length,3);
assert.equal((active.match(/playsinline/g)||[]).length,3);
assert.equal((active.match(/<video playsinline muted/g)||[]).length,3,'Inicio silenciado');
assert.equal((active.match(/Descargar MP4 en Drive/g)||[]).length,3,'Enlace a Drive en cada pieza');
assert(active.includes('Ciudad de México, México'));
assert(active.includes('3–5 días hábiles'));
assert(active.includes('$3,200'));
assert(active.includes('$7,500'));
assert(active.includes('Facturación Electrónica'));
const source = await readFile(path.join(root,'src/main.js'),'utf8');
assert(source.includes('visibilitychange'));
const css = await readFile(path.join(dist,'styles.css'),'utf8');
assert(css.includes('prefers-reduced-motion'));
assert(css.includes(':focus-visible'));
for (const file of await readdir(path.join(dist,'fonts'))) {
  if (file.endsWith('.woff2')) {
    const data = await readFile(path.join(dist,'fonts',file));
    assert.equal(data.subarray(0,4).toString(),'wOF2',`Fuente válida: ${file}`);
  }
}
const files = ['index.html','styles.css','main.js','icons.mjs'];
const bytes = (await Promise.all(files.map(f=>stat(path.join(dist,f))))).reduce((a,s)=>a+s.size,0);
console.log(`OK: enlaces, anclas, assets, estados pendientes/listos, metadatos básicos y fuentes. HTML + CSS + JS: ${(bytes/1024).toFixed(1)} KB sin comprimir.`);
