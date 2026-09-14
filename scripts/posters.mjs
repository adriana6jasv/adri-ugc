import { writeFile } from 'node:fs/promises';
import { site } from '../src/content.mjs';
const escape = text => text.replace(/&/g,'&amp;').replace(/</g,'&lt;');
for (const piece of site.work.pieces) {
  const tones = {clay:['#884c3d','#f7f4ec'],olive:['#4b5142','#f7f4ec'],sand:['#e9e3d6','#302c27']};
  const [bg,fg] = tones[piece.tone];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280"><rect width="720" height="1280" fill="${bg}"/><g fill="${fg}"><text x="60" y="112" font-family="Georgia,serif" font-size="70" letter-spacing="-4">adri</text>${piece.cover.map((t,i)=>`<text x="60" y="${555+i*105}" font-family="Georgia,serif" font-size="78" ${i===1?'font-style="italic"':''}>${escape(t)}</text>`).join('')}<path d="M60 845h110" stroke="${fg}"/><text x="60" y="920" font-family="Arial,sans-serif" font-size="17" letter-spacing="2">UNA HISTORIA DE ADRI</text><text x="60" y="958" font-family="Arial,sans-serif" font-size="14">UGC · Motherhood &amp; Family Lifestyle</text><text x="60" y="1175" font-family="Arial,sans-serif" font-size="16" letter-spacing="1">SPOTLIGHT ${piece.number}</text></g></svg>`;
  await writeFile(new URL(`../public${piece.poster}`, import.meta.url), svg);
}
