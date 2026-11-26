import { mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = 'images-source';
const OUTPUT_DIR = 'src/assets/images';

// Для кожного префікса імені: ширини (px) і співвідношення сторін (висота / ширина)
const PRESETS = {
  work: { widths: [400, 800], ratio: 348 / 440 },
  journal: { widths: [150, 300], ratio: 1 },
};

const QUALITY = { avif: 55, webp: 78, jpg: 80 };
const SOURCE_EXT = /\.(jpe?g|png|webp)$/i;

const files = (await readdir(SOURCE_DIR)).filter((file) => SOURCE_EXT.test(file));

await rm(OUTPUT_DIR, { recursive: true, force: true });
await mkdir(OUTPUT_DIR, { recursive: true });

for (const file of files) {
  const name = path.parse(file).name;
  const preset = PRESETS[name.split('-')[0]];

  if (!preset) {
    console.warn(`Пропущено ${file}: немає пресета для префікса "${name.split('-')[0]}"`);
    continue;
  }

  for (const width of preset.widths) {
    const height = Math.round(width * preset.ratio);
    const base = sharp(path.join(SOURCE_DIR, file)).resize(width, height, { fit: 'cover' });
    const target = path.join(OUTPUT_DIR, `${name}-${width}`);

    await Promise.all([
      base.clone().avif({ quality: QUALITY.avif }).toFile(`${target}.avif`),
      base.clone().webp({ quality: QUALITY.webp }).toFile(`${target}.webp`),
      base.clone().jpeg({ quality: QUALITY.jpg, mozjpeg: true }).toFile(`${target}.jpg`),
    ]);
  }

  console.log(`✔ ${file} → ${preset.widths.join(', ')}px (avif, webp, jpg)`);
}
