import { readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'C:/Users/alhad/OneDrive - Wayne State University/Documents/japan flicks';
const OUT = 'C:/Users/alhad/OneDrive - Wayne State University/Documents/pell-to-planet/src/assets/photos';

// The source names carry spaces, an emoji and a couple of typos.
// Mapped by hand so the repo gets clean, descriptive slugs.
const MAP = {
  'goated korean resturant in hiroshima_k': 'hiroshima-korean-restaurant',
  'group karayoke tokyo_k': 'tokyo-karaoke-group',
  'Hiroshima 🏔️ _k': 'hiroshima-hills',
  'hiroshimadelta_k': 'hiroshima-delta',
  'hiroshimamazdadinner_k': 'hiroshima-mazda-dinner',
  'hiroshimawalk_k': 'hiroshima-walk',
  'keylex group pic_k': 'keylex-group',
  'tokyobus_k': 'tokyo-bus-ride',
  'tokyotoweers_k': 'tokyo-towers',
};

const files = (await readdir(SRC)).filter((f) => /_k\.(jpe?g|png|heic)$/i.test(f));
console.log(`found ${files.length} source files\n`);

for (const f of files) {
  const base = path.basename(f, path.extname(f));
  const slug = MAP[base] ?? MAP[base.trim()];
  if (!slug) {
    console.log(`SKIP (unmapped): "${base}"`);
    continue;
  }
  const dest = path.join(OUT, `${slug}.jpg`);
  try {
    const info = await sharp(path.join(SRC, f))
      .rotate() // honour EXIF orientation, otherwise phone shots land sideways
      .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(dest);
    console.log(`OK   ${slug}.jpg  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}kB   <- ${f}`);
  } catch (e) {
    console.log(`FAIL ${f}: ${e.message}`);
  }
}
