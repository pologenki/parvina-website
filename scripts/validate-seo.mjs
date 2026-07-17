import { access, readFile, stat } from 'node:fs/promises';

const pages = [
  { path: 'index.html', canonical: 'https://pologenki.eu/', lang: 'en' },
  { path: 'ru/index.html', canonical: 'https://pologenki.eu/ru/', lang: 'ru' },
  { path: 'zh-cn/index.html', canonical: 'https://pologenki.eu/zh-cn/', lang: 'zh-CN' }
];
const errors = [];

for (const page of pages) {
  const html = await readFile(page.path, 'utf8');
  if (!new RegExp(`<html[^>]*lang="${page.lang}"`).test(html)) errors.push(`${page.path}: incorrect html lang`);
  if (!/<title>[^<]{20,}[^<]*<\/title>/.test(html)) errors.push(`${page.path}: missing descriptive title`);
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '';
  const minimumDescriptionLength = page.lang === 'zh-CN' ? 35 : 80;
  if (description.length < minimumDescriptionLength) errors.push(`${page.path}: description is missing or too short`);
  if (!html.includes(`<link rel="canonical" href="${page.canonical}"`)) errors.push(`${page.path}: incorrect canonical`);
  for (const lang of ['en', 'ru', 'zh-CN', 'x-default']) {
    if (!html.includes(`hreflang="${lang}"`)) errors.push(`${page.path}: missing hreflang ${lang}`);
  }
  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!jsonLdBlocks.length) errors.push(`${page.path}: missing JSON-LD`);
  for (const block of jsonLdBlocks) {
    try { JSON.parse(block[1]); } catch { errors.push(`${page.path}: invalid JSON-LD`); }
  }
  if (!/<h1>[^<]+<\/h1>/.test(html)) errors.push(`${page.path}: missing static H1`);
  if (!html.includes('rel="preload" as="image"')) errors.push(`${page.path}: missing LCP image preload`);
  if (!html.includes('srcset=')) errors.push(`${page.path}: missing responsive image sources`);
}

const sitemap = await readFile('public/sitemap.xml', 'utf8');
const sitemapLocations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
if (sitemapLocations.some(location => location.includes('#'))) errors.push('sitemap.xml: fragment URLs are not indexable pages');
if (sitemap.includes('www.pologenki.eu')) errors.push('sitemap.xml: canonical host must be pologenki.eu');
for (const url of ['https://pologenki.eu/', 'https://pologenki.eu/ru/', 'https://pologenki.eu/zh-cn/']) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) errors.push(`sitemap.xml: missing ${url}`);
}
if (sitemapLocations.length !== 51) errors.push(`sitemap.xml: expected 51 indexable URLs, found ${sitemapLocations.length}`);

const robots = await readFile('public/robots.txt', 'utf8');
if (!robots.includes('Sitemap: https://pologenki.eu/sitemap.xml')) errors.push('robots.txt: incorrect sitemap URL');
if (!robots.includes('Disallow: /admin/')) errors.push('robots.txt: admin must be excluded');

const admin = await readFile('public/admin/index.html', 'utf8');
if (!admin.includes('content="noindex, nofollow, noarchive"')) errors.push('admin: missing noindex protection');

const productsData = JSON.parse(await readFile('public/data/products.json', 'utf8'));
for (const product of (productsData.products || []).filter(item => item.published !== false)) {
  for (const prefix of ['', 'ru/', 'zh-cn/']) {
    const productPage = `public/${prefix}products/${product.id}/index.html`;
    try {
      await access(productPage);
      const html = await readFile(productPage, 'utf8');
      if (!html.includes('"@type":"Product"')) errors.push(`${productPage}: missing Product JSON-LD`);
      if (!html.includes(`/${String(product.image).replace(/^\/+/, '')}`)) errors.push(`${productPage}: missing product image`);
      if (!html.includes('/optimized/')) errors.push(`${productPage}: missing optimized product image`);
    } catch {
      errors.push(`${productPage}: generated product page is missing`);
    }
  }
}

const serviceSlugs = [
  'supplier-sourcing', 'contract-negotiation', 'logistics-coordination',
  'trade-documentation', 'shipment-monitoring', 'full-service-import'
];
for (const slug of serviceSlugs) {
  for (const prefix of ['', 'ru/', 'zh-cn/']) {
    const servicePage = `public/${prefix}services/${slug}/index.html`;
    try {
      const html = await readFile(servicePage, 'utf8');
      if (!html.includes('"@type":"Service"')) errors.push(`${servicePage}: missing Service JSON-LD`);
      if (!html.includes('"@type":"BreadcrumbList"')) errors.push(`${servicePage}: missing breadcrumbs`);
      if (!/<h1>[^<]+<\/h1>/.test(html)) errors.push(`${servicePage}: missing H1`);
    } catch {
      errors.push(`${servicePage}: generated service page is missing`);
    }
  }
}

for (const image of [
  'public/optimized/ParvinaFoto-480.webp',
  'public/optimized/ParvinaFoto-768.webp',
  'public/optimized/ParvinaFoto-1148.webp',
  'public/optimized/Logo2-160.webp',
  'public/optimized/Logo2-compact-160.webp',
  'public/optimized/Logo2-sharp-320.png'
]) {
  try {
    const imageStat = await stat(image);
    if (imageStat.size > 250 * 1024) errors.push(`${image}: optimized image exceeds 250 KB`);
  } catch {
    errors.push(`${image}: optimized image is missing`);
  }
}

if (errors.length) {
  console.error(`SEO validation failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('SEO validation passed for EN, RU and ZH-CN pages.');
