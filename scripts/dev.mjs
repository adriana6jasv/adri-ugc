import { createServer } from 'node:http';
import { readFile, stat, watch } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { root, dist, build } from './build.mjs';

const preview = process.argv.includes('--preview');
const port = Number(process.env.PORT || 4174);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg', '.woff2':'font/woff2', '.mp4':'video/mp4', '.vtt':'text/vtt; charset=utf-8', '.txt':'text/plain; charset=utf-8', '.xml':'application/xml' };
await build();
const server = createServer(async (req, res) => {
  try {
    const decoded = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(dist, '.' + (decoded.endsWith('/') ? decoded + 'index.html' : decoded));
    if (!file.startsWith(dist + path.sep)) { res.writeHead(403); res.end(); return; }
    const size = (await stat(file)).size;
    const data = await readFile(file);
    const headers = { 'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-cache', 'Accept-Ranges':'bytes', 'X-Content-Type-Options':'nosniff' };
    const range = req.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match || (!match[1] && !match[2])) { res.writeHead(416, {'Content-Range':`bytes */${size}`}); res.end(); return; }
      const start = match[1] ? Number(match[1]) : Math.max(0, size-Number(match[2]));
      const end = match[1] ? Math.min(match[2] ? Number(match[2]) : size-1, size-1) : size-1;
      if (start >= size || start > end) { res.writeHead(416, {'Content-Range':`bytes */${size}`}); res.end(); return; }
      res.writeHead(206, {...headers, 'Content-Range':`bytes ${start}-${end}/${size}`, 'Content-Length':end-start+1});
      res.end(req.method === 'HEAD' ? undefined : data.subarray(start,end+1)); return;
    }
    res.writeHead(200, {...headers, 'Content-Length':size}); res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'}); res.end(await readFile(path.join(dist,'404.html'))); }
});
server.listen(port, '127.0.0.1', () => console.log(`Adri: http://localhost:${port}`));

if (!preview) {
  let timer, building = false, queued = false;
  const rebuild = () => {
    if (building) { queued = true; return; }
    building = true;
    const child = spawn(process.execPath, ['scripts/build.mjs'], { cwd: root, stdio: 'inherit', windowsHide:true });
    child.on('exit', () => { building = false; if (queued) { queued = false; rebuild(); } });
  };
  for (const folder of ['src','public']) {
    (async () => {
      for await (const event of watch(path.join(root,folder), { recursive: true })) {
        clearTimeout(timer); timer = setTimeout(rebuild, 150);
      }
    })().catch(err => console.error('No se pudieron observar cambios:', err.message));
  }
}
