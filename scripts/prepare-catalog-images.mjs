import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const artifactDir = join(root, 'artifacts', 'catalog-dialogs');
const outputDir = join(root, 'public', 'catalog', 'products');
const ids = ['cashew', 'walnuts', 'walnuts-shell', 'peanuts', 'peanuts-blanched', 'dates', 'papaya', 'mango', 'dried-fruits', 'banana-chips'];
await mkdir(outputDir, { recursive: true });
const metadata = [];
const previews = [];

for (const [index, id] of ids.entries()) {
  const source = id === 'dates' ? join(root, 'public', 'goods', 'dates.png') : join(artifactDir, 'cutouts', `${id}.png`);
  const original = await sharp(source).metadata();
  const stats = await sharp(source).stats();
  if (!original.hasAlpha || stats.isOpaque) throw new Error(`Catalogue image needs transparency: ${id}`);
  const normalized = await sharp(source)
    .trim({ threshold: 20 })
    .resize(900, 900, { fit: 'contain', background: '#00000000' })
    .extend({ top: 30, bottom: 30, left: 30, right: 30, background: '#00000000' })
    .png().toBuffer();
  const variants = [];
  for (const width of [240, 480, 960]) {
    const info = await sharp(normalized).resize(width, width)
      .webp({ quality: 94, alphaQuality: 100, effort: 6 })
      .toFile(join(outputDir, `${id}-${width}.webp`));
    variants.push({ width, bytes: info.size });
  }
  metadata.push({ id, source: source.slice(root.length + 1).replaceAll('\\', '/'), originalWidth: original.width, originalHeight: original.height, transparent: true, generated: id !== 'dates', variants });
  previews.push({ input: await sharp(normalized).resize(256, 256).png().toBuffer(), left: index % 5 * 256, top: Math.floor(index / 5) * 256 });
}

await sharp({ create: { width: 1280, height: 512, channels: 3, background: '#e9e9e9' } })
  .composite(previews).png().toFile(join(artifactDir, 'cutout-contact-sheet.png'));
await writeFile(join(artifactDir, 'image-metadata.json'), JSON.stringify(metadata, null, 2));
console.log(`Prepared ${metadata.length} transparent catalogue images in three responsive sizes.`);
