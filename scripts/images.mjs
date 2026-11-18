// npm run images
// Downloads the photos listed in scripts/images.json from Unsplash (once),
// applies one shared warm "film" grade so every photo sits in the
// espresso / cream palette, and writes AVIF + WebP + JPG at several widths to
// public/images/wedding/. Also writes src/data/images.json (sizes) and
// ATTRIBUTIONS.md. To swap in client photos: drop a file into
// photos-src/<name>.jpg and re-run — existing files are never re-downloaded.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const list = JSON.parse(readFileSync('scripts/images.json', 'utf8'));
const SRC = 'photos-src';
const OUT = 'public/images/wedding';
const WIDTHS = [640, 1080, 1600, 2400];
mkdirSync(SRC, { recursive: true });
mkdirSync(OUT, { recursive: true });

// 78% original + 22% sepia: warms whites to cream and calms saturated reds.
const S = [[0.393, 0.769, 0.189], [0.349, 0.686, 0.168], [0.272, 0.534, 0.131]];
const GRADE = S.map((row, r) => row.map((v, c) => 0.78 * (r === c ? 1 : 0) + 0.22 * v));

// `npm run images -- name1 name2` reprocesses only those photos; the rest keep their manifest entries.
const only = process.argv.slice(2);
const manifest = only.length ? JSON.parse(readFileSync('src/data/images.json', 'utf8')) : {};
for (const img of list.filter((i) => !only.length || only.includes(i.name))) {
  const src = `${SRC}/${img.name}.jpg`;
  if (!existsSync(src)) {
    console.log(`downloading ${img.name}`);
    const res = await fetch(`https://images.unsplash.com/photo-${img.photo}?w=2400&q=90&fm=jpg`);
    if (!res.ok) throw new Error(`${img.name}: download failed (${res.status})`);
    writeFileSync(src, Buffer.from(await res.arrayBuffer()));
  }
  const meta = await sharp(src).metadata();
  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (!widths.length) widths.push(meta.width);

  const base = sharp(src).rotate().recomb(GRADE).modulate({ saturation: 0.74 }).linear(0.96, 6);
  for (const w of widths) {
    const r = base.clone().resize({ width: w });
    await r.clone().avif({ quality: 52, effort: 4 }).toFile(`${OUT}/${img.name}-${w}.avif`);
    await r.clone().webp({ quality: 74 }).toFile(`${OUT}/${img.name}-${w}.webp`);
    if (w === 1080 || w === widths.at(-1)) await r.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`${OUT}/${img.name}-${w}.jpg`);
  }
  const fallback = widths.includes(1080) ? 1080 : widths.at(-1);
  manifest[img.name] = { width: meta.width, height: meta.height, widths, fallback };
  console.log(`${img.name}  ${meta.width}×${meta.height}  → ${widths.join(', ')}`);
}

writeFileSync('src/data/images.json', JSON.stringify(manifest, null, 2) + '\n');

const rows = list
  .map((i) => `| \`${i.name}\` | [${i.author}](${i.page}) | ${i.use} | ${i.people ? 'Yes — identifiable people' : 'No'} |`)
  .join('\n');
writeFileSync(
  'ATTRIBUTIONS.md',
  `# Image sources & licensing

All photographs are from **Unsplash** and are published under the
[Unsplash License](https://unsplash.com/license): free for commercial and
non-commercial use, no permission or attribution required (credit is given
here anyway). Restrictions: images may not be sold unaltered, and may not be
used to build a competing photo service.

Every photo below is served from \`images.unsplash.com\` (free licence).
Unsplash+ images, which need a paid licence, are only served from
\`plus.unsplash.com/premium_photo-*\` — none are used.

Files are graded (warm film tone) and resized by \`npm run images\`;
originals live in \`photos-src/\`.

## ⚠ Needs client approval before launch

The Unsplash License does **not** include model releases. Photos marked
"identifiable people" show real, unrelated couples. They are stand-ins:
they must be replaced with the client's own photographs — in particular the
bride and groom portraits, which would otherwise present strangers as the
couple. Venue/décor photos can stay if the client is happy with them.

| File | Photographer | Used for | People |
| --- | --- | --- | --- |
${rows}
`,
);
console.log(`\n${list.length} images → ${OUT}, src/data/images.json, ATTRIBUTIONS.md`);
