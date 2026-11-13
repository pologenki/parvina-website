import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const artifactDir = join(root, 'artifacts', 'services-motion');
const outputDir = join(root, 'public', 'import-services');
await mkdir(outputDir, { recursive: true });
const ids = ['sourcing', 'negotiation', 'logistics', 'documents', 'monitoring', 'full'];
const metadata = [], previews = [];
for (const [index, id] of ids.entries()) {
  const source = join(artifactDir, 'generated', `${id}.png`);
  const original = await sharp(source).metadata();
  const stats = await sharp(source).stats();
  if (!original.hasAlpha || stats.isOpaque) throw new Error(`Illustration must have alpha: ${id}`);
  const normalized = await sharp(source).trim({ threshold: 12 })
    .resize(1160, 734, { fit: 'contain', background: '#00000000' })
    .extend({ top: 60, bottom: 60, left: 60, right: 60, background: '#00000000' }).png().toBuffer();
  const variants = [];
  for (const width of [640, 1280]) {
    const info = await sharp(normalized).resize({ width }).webp({ lossless: true, effort: 5 })
      .toFile(join(outputDir, `${id}-${width}.webp`));
    variants.push({ width, height: info.height, bytes: info.size });
  }
  metadata.push({ id, originalWidth: original.width, originalHeight: original.height, transparent: true, variants });
  previews.push({ input: await sharp(normalized).resize(400, 267).png().toBuffer(), left: index % 3 * 400, top: Math.floor(index / 3) * 267 });
}
await sharp({ create: { width: 1200, height: 534, channels: 3, background: '#e9e9e9' } })
  .composite(previews).png().toFile(join(artifactDir, 'illustration-contact-sheet.png'));
await writeFile(join(artifactDir, 'image-metadata.json'), JSON.stringify(metadata, null, 2));
console.log(`Prepared ${ids.length} original import illustrations in two responsive sizes.`);
