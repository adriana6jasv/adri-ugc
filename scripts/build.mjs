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
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n${url ? `Sitemap: ${url}/sitemap.xml\n` : ''}`);
  if (url) await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url}/</loc></url></urlset>`);
  await writeFile(path.join(dist, '404.html'), '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Página no encontrada | Adri</title><link rel="stylesheet" href="/styles.css"><main class="wrap about"><h1>Esta historia no está aquí.</h1><a class="text-link" href="/">Volver al portfolio de Adri</a></main></html>');
  console.log(`Portfolio generado en dist. Foto: ${assets[site.portrait.src] ? 'lista' : 'pendiente'}. Videos: ${site.work.pieces.filter(p => assets[p.video]).length}/3.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
