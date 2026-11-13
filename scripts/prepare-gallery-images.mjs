import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const artifacts = join(root, 'artifacts/gallery-editorial');
const output = join(root, 'public/gallery');
await mkdir(output, { recursive: true });
const items = JSON.parse(await readFile(join(root, 'public/data/portfolio.json'), 'utf8')).items.filter(i => i.published !== false);
const manifest = {}, metadata = [], comparisons = [];
// Generative restoration candidates were reviewed against the real photographs.
// They changed some faces/signage. Use their tonal direction, but retain the original
// geometry and documentary details with a conservative photographic development pass.
const profiles = [
  [1.035, 1.015, 1.025], [1.035, 1.02, 1.025], [1.06, 1.015, 1.04],
  [1.075, 1.01, 1.035], [1.055, 1.01, 1.035], [1.045, .99, 1.025],
  [1.035, 1.02, 1.09], [1.065, 1.02, 1.10], [1.025, 1.01, 1.025],
  [1.09, 1.015, 1.04], [1.06, 1.015, 1.045], [1.035, 1.015, 1.03],
];
for (const [index, item] of items.entries()) {
  const id = item.img.split('/').pop().replace(/\.[^.]+$/, '');
  const original = join(root, 'public', item.img);
  const before = await sharp(original).metadata();
  const [brightness, saturation, contrast] = profiles[index] || [1.035, 1.015, 1.025];
  const master = await sharp(original).rotate()
    .modulate({ brightness, saturation }).linear(contrast, -128 * (contrast - 1))
    .resize({ width: Math.round(before.width * 1.5), height: Math.round(before.height * 1.5), fit: 'inside' })
    .sharpen({ sigma: .65, m1: .5, m2: 1.5 }).png().toBuffer();
  const after = await sharp(master).metadata();
  // Keep the original photograph's framing and aspect ratio in every derivative.
  const variants = [];
  for (const width of [240, 480, 960, 1600]) {
    const size = Math.min(width, after.width);
    if (variants.some(v => v.width === size)) continue;
    const name = `${id}-${size}.webp`;
    const result = await sharp(master).resize({ width: size, withoutEnlargement: true }).webp({ quality: width >= 960 ? 94 : 89, effort: 5, smartSubsample: true }).toFile(join(output, name));
    variants.push({ src: `/gallery/${name}`, width: result.width, height: result.height, bytes: result.size });
  }
  manifest[id] = { width: after.width, height: after.height, variants };
  metadata.push({ id, original: item.img, originalWidth: before.width, originalHeight: before.height, outputWidth: after.width, outputHeight: after.height, method: 'Imagegen restoration candidates reviewed; final photographic development from original preserves faces, lettering and framing. 1.5x resampling is not newly captured detail.', brightness, saturation, contrast, variants });
  const y = Math.floor(index / 3) * 300, x = index % 3 * 420;
  comparisons.push({ input: await sharp(original).resize(210, 288, { fit: 'contain', background: '#e9e9e9' }).png().toBuffer(), left: x, top: y });
  comparisons.push({ input: await sharp(master).resize(210, 288, { fit: 'contain', background: '#e9e9e9' }).png().toBuffer(), left: x + 210, top: y });
}
await writeFile(join(output, 'photos.json'), JSON.stringify(manifest, null, 2));
await writeFile(join(artifacts, 'image-metadata.json'), JSON.stringify(metadata, null, 2));
await sharp({ create: { width: 1260, height: Math.ceil(items.length / 3) * 300, channels: 3, background: '#e9e9e9' } }).composite(comparisons).png().toFile(join(artifacts, 'photo-comparison.png'));
console.log(`Prepared ${items.length} restored gallery photographs with responsive variants. Originals are retained.`);
