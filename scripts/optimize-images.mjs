import { mkdir, readFile, rm } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const outputDir = join(publicDir, 'optimized');
const products = JSON.parse(await readFile(join(publicDir, 'data', 'products.json'), 'utf8')).products || [];
const portfolio = JSON.parse(await readFile(join(publicDir, 'data', 'portfolio.json'), 'utf8')).items || [];

function normalizedPath(value = '') {
  return String(value).replace(/^\/+/, '').replace(/\\/g, '/');
}

function outputPath(source, width) {
  const relative = normalizedPath(source);
  const extension = extname(relative);
  return join(outputDir, `${relative.slice(0, -extension.length)}-${width}.webp`);
}

async function createVariant(source, width, quality = 82) {
  const relative = normalizedPath(source);
  const input = join(publicDir, relative);
  const output = outputPath(relative, width);
  await mkdir(dirname(output), { recursive: true });
  await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: false, fit: 'inside' })
    .webp({ quality, effort: 5, smartSubsample: true })
    .toFile(output);
}

async function createCompactLogo(width) {
  const output = join(outputDir, `Logo2-compact-${width}.webp`);
  await mkdir(dirname(output), { recursive: true });
  await sharp(join(publicDir, 'Logo2.png'))
    .trim({ threshold: 10 })
    .resize({ width, fit: 'inside' })
    .webp({ quality: 90, effort: 5 })
    .toFile(output);
}

await rm(outputDir, { recursive: true, force: true });

const jobs = [
  ...[480, 768, 1148].map(width => createVariant('ParvinaFoto.png', width, 84)),
  ...[160, 320].map(width => createVariant('Logo2.png', width, 88)),
  ...[160, 320].map(width => createCompactLogo(width)),
  ...products.flatMap(product => [240, 480].map(width => createVariant(product.image, width, 82))),
  ...portfolio
    .filter(item => item.published !== false && item.img)
    .flatMap(item => [480, 960].map(width => createVariant(item.img, width, 82)))
];

await Promise.all(jobs);
console.log(`Generated ${jobs.length} responsive WebP images.`);
