import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const baseUrl = 'https://pologenki.eu';
const productsData = JSON.parse(await readFile(join(publicDir, 'data', 'products.json'), 'utf8'));
const portfolioData = JSON.parse(await readFile(join(publicDir, 'data', 'portfolio.json'), 'utf8'));
const products = (productsData.products || []).filter(product => product.published !== false);

const locales = {
  en: {
    prefix: '', lang: 'en', locale: 'en_US',
    catalogue: 'Product catalogue', origin: 'Origin', grades: 'Available grades and packing',
    request: 'Request current price and delivery terms', back: 'Back to all products',
    description: name => `${name} for wholesale import. Review available grades, origin, packing information and current indicative price.`,
    pageTitle: name => `${name} Wholesale Import | Grades & Price | Pologenki`
  },
  ru: {
    prefix: '/ru', lang: 'ru', locale: 'ru_RU',
    catalogue: 'Каталог товаров', origin: 'Происхождение', grades: 'Доступные сорта и упаковка',
    request: 'Запросить актуальную цену и условия доставки', back: 'Вернуться ко всем товарам',
    description: name => `${name} для оптового импорта. Доступные сорта, происхождение, упаковка и актуальная ориентировочная цена.`,
    pageTitle: name => `${name} оптом | Сорта и цена | Pologenki`
  },
  cn: {
    prefix: '/zh-cn', lang: 'zh-CN', locale: 'zh_CN',
    catalogue: '产品目录', origin: '产地', grades: '可供等级与包装',
    request: '咨询当前价格与交货条件', back: '返回全部产品',
    description: name => `${name}批量进口信息，包括产品等级、产地、包装和当前参考价格。`,
    pageTitle: name => `${name}批量进口、等级与价格 | Pologenki`
  }
};

const cnNames = {
  cashew: '腰果', walnuts: '核桃仁', dates: '椰枣干', papaya: '木瓜干丁', mango: '芒果干',
  'walnuts-shell': '带壳核桃', peanuts: '生花生', 'peanuts-blanched': '脱皮花生',
  'dried-fruits': '混合果干', 'banana-chips': '香蕉片'
};
const cnDescriptions = {
  cashew: 'AFI 标准', walnuts: '特级浅色半仁', dates: 'Deglet Nour 椰枣', papaya: '混合色/天然 8-10 毫米',
  mango: '加糖及无糖规格', 'walnuts-shell': '多种规格，清洗处理', peanuts: '40/50、50/60 规格',
  'peanuts-blanched': '整粒及半粒', 'dried-fruits': '渗透脱水果干', 'banana-chips': '整片、半片和四分片'
};
const cnOrigins = { Vietnam: '越南', China: '中国', Tunisia: '突尼斯', India: '印度', Philippines: '菲律宾' };

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

function textFor(product, field, locale) {
  if (locale === 'ru') return product[`${field}_ru`] || product[field] || '';
  if (locale === 'cn') {
    if (field === 'name') return product.name_cn || cnNames[product.id] || product.name || '';
    if (field === 'desc') return product.desc_cn || cnDescriptions[product.id] || product.desc || '';
    if (field === 'origin') return product.origin_cn || cnOrigins[product.origin] || product.origin || '';
  }
  return product[field] || '';
}

function variantText(variant, field, locale) {
  return variant[`${field}_${locale}`] || variant[field] || '';
}

function productUrl(product, locale) {
  return `${baseUrl}${locales[locale].prefix}/products/${encodeURIComponent(product.id)}/`;
}

function alternateLinks(product) {
  return [
    `<link rel="alternate" hreflang="en" href="${productUrl(product, 'en')}" />`,
    `<link rel="alternate" hreflang="ru" href="${productUrl(product, 'ru')}" />`,
    `<link rel="alternate" hreflang="zh-CN" href="${productUrl(product, 'cn')}" />`,
    `<link rel="alternate" hreflang="x-default" href="${productUrl(product, 'en')}" />`
  ].join('\n    ');
}

function offerSchema(product, canonical) {
  const match = String(product.mainPrice || '').replace(',', '.').match(/([0-9]+(?:\.[0-9]+)?)/);
  if (!match) return null;
  return {
    '@type': 'Offer',
    url: canonical,
    priceCurrency: 'USD',
    price: match[1],
    availability: 'https://schema.org/InStock',
    seller: { '@id': `${baseUrl}/#organization` },
    priceSpecification: { '@type': 'UnitPriceSpecification', price: match[1], priceCurrency: 'USD', unitCode: 'KGM' }
  };
}

function renderProductPage(product, localeKey) {
  const locale = locales[localeKey];
  const name = textFor(product, 'name', localeKey);
  const description = textFor(product, 'desc', localeKey);
  const origin = textFor(product, 'origin', localeKey);
  const canonical = productUrl(product, localeKey);
  const image = `${baseUrl}/${String(product.image || '').replace(/^\/+/, '')}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product', '@id': `${canonical}#product`, name, description: locale.description(name),
        image: [image], category: 'Nuts, dried fruits and food ingredients',
        countryOfOrigin: origin ? { '@type': 'Country', name: origin } : undefined,
        offers: offerSchema(product, canonical)
      },
      {
        '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Pologenki', item: `${baseUrl}${locale.prefix}/` },
          { '@type': 'ListItem', position: 2, name: locale.catalogue, item: `${baseUrl}${locale.prefix}/#products` },
          { '@type': 'ListItem', position: 3, name, item: canonical }
        ]
      }
    ]
  };
  if (!schema['@graph'][0].offers) delete schema['@graph'][0].offers;
  if (!schema['@graph'][0].countryOfOrigin) delete schema['@graph'][0].countryOfOrigin;

  const variants = (product.variants || []).map(variant => `
          <article class="grade">
            <div><h3>${esc(variantText(variant, 'name', localeKey))}</h3><p>${esc(variantText(variant, 'desc', localeKey))}</p></div>
            <strong>${esc(variant.price || '')}</strong>
          </article>`).join('');

  return `<!doctype html>
<html lang="${locale.lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <title>${esc(locale.pageTitle(name))}</title>
  <meta name="description" content="${esc(locale.description(name))}" />
  <link rel="canonical" href="${canonical}" />
  ${alternateLinks(product)}
  <link rel="icon" type="image/jpeg" href="/logo.jpeg" />
  <meta property="og:type" content="product" />
  <meta property="og:title" content="${esc(locale.pageTitle(name))}" />
  <meta property="og:description" content="${esc(locale.description(name))}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:site_name" content="Pologenki" />
  <meta property="og:locale" content="${locale.locale}" />
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <style>
    *{box-sizing:border-box}body{margin:0;background:#f6f8fa;color:#17212b;font:16px/1.55 Arial,sans-serif}header{height:76px;display:flex;align-items:center;justify-content:space-between;padding:0 max(24px,calc((100% - 1120px)/2));background:#fff;border-top:4px solid #222;border-bottom:1px solid #dfe5e9}header img{width:132px;height:58px;object-fit:contain}header a{color:#17212b;text-decoration:none}.page{max-width:1120px;margin:0 auto;padding:54px 24px 72px}.hero{display:grid;grid-template-columns:420px 1fr;gap:54px;align-items:center}.photo{aspect-ratio:1;background:#fff;border:1px solid #dbe3e8;padding:24px}.photo img{width:100%;height:100%;object-fit:contain}.eyebrow{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#607080}h1{margin:8px 0 10px;font:600 46px/1.05 Georgia,serif}h2{margin:54px 0 18px;font:600 30px/1.2 Georgia,serif}.meta{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0}.meta span,.price{padding:8px 12px;border:1px solid #dbe3e8;background:#fff}.price{display:inline-block;font-size:20px;font-weight:700}.cta{display:inline-block;margin-top:20px;padding:13px 20px;background:#111;color:#fff;text-decoration:none}.grades{display:grid;gap:10px}.grade{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:start;padding:20px;background:#fff;border:1px solid #dbe3e8}.grade h3{margin:0 0 6px;font-size:17px}.grade p{margin:0;color:#53616e}.grade strong{white-space:nowrap;padding:6px 10px;background:#eef7ff;border:1px solid #b8ddfb}.languages{display:flex;gap:14px}.languages a{text-decoration:underline}@media(max-width:760px){header{padding:0 18px}.page{padding:32px 18px 56px}.hero{grid-template-columns:1fr;gap:28px}.photo{max-width:420px}h1{font-size:36px}.grade{grid-template-columns:1fr}.grade strong{justify-self:start}}
  </style>
</head>
<body>
  <header><a href="${locale.prefix || '/'}"><img src="/Logo2.png" alt="Pologenki" width="1024" height="1024" /></a><nav class="languages" aria-label="Language"><a href="${productUrl(product, 'en')}" lang="en">EN</a><a href="${productUrl(product, 'ru')}" lang="ru">RU</a><a href="${productUrl(product, 'cn')}" lang="zh-CN">中文</a></nav></header>
  <main class="page">
    <div class="hero">
      <div class="photo"><img src="/${esc(String(product.image || '').replace(/^\/+/, ''))}" alt="${esc(name)}" width="640" height="640" fetchpriority="high" /></div>
      <div><p class="eyebrow">${locale.catalogue}</p><h1>${esc(name)}</h1><p>${esc(description)}</p><div class="meta"><span>${locale.origin}: ${esc(origin)}</span></div><div class="price">${esc(product.mainPrice || '')}</div><br><a class="cta" href="mailto:info@pologenki.eu?subject=${encodeURIComponent(name)}">${locale.request}</a></div>
    </div>
    <section><h2>${locale.grades}</h2><div class="grades">${variants}</div></section>
    <p><a href="${locale.prefix || '/'}#products">← ${locale.back}</a></p>
  </main>
</body>
</html>`;
}

for (const path of ['products', 'ru/products', 'zh-cn/products']) {
  await rm(join(publicDir, path), { recursive: true, force: true });
}

for (const product of products) {
  for (const locale of Object.keys(locales)) {
    const outputDir = join(publicDir, locales[locale].prefix.replace(/^\//, ''), 'products', product.id);
    await mkdir(outputDir, { recursive: true });
    await writeFile(join(outputDir, 'index.html'), renderProductPage(product, locale), 'utf8');
  }
}

const lastmod = [productsData.lastUpdated, portfolioData.lastUpdated].filter(Boolean).sort().at(-1) || new Date().toISOString().slice(0, 10);
const homeUrls = { en: `${baseUrl}/`, ru: `${baseUrl}/ru/`, cn: `${baseUrl}/zh-cn/` };
const allImages = [
  ...products.map(product => ({ loc: `${baseUrl}/${String(product.image || '').replace(/^\/+/, '')}`, title: product.name })),
  ...(portfolioData.items || []).filter(item => item.published !== false).map(item => ({ loc: `${baseUrl}/${String(item.img || '').replace(/^\/+/, '')}`, title: item.title }))
].filter(image => image.loc && image.title);

function sitemapEntry(loc, alternates, images = []) {
  return `  <url>\n    <loc>${esc(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates.map(item => `    <xhtml:link rel="alternate" hreflang="${item.lang}" href="${esc(item.href)}" />`).join('\n')}\n${images.map(image => `    <image:image><image:loc>${esc(image.loc)}</image:loc><image:title>${esc(image.title)}</image:title></image:image>`).join('\n')}\n  </url>`;
}

const homeAlternates = [
  { lang: 'en', href: homeUrls.en }, { lang: 'ru', href: homeUrls.ru },
  { lang: 'zh-CN', href: homeUrls.cn }, { lang: 'x-default', href: homeUrls.en }
];
const sitemapEntries = [sitemapEntry(homeUrls.en, homeAlternates, allImages), sitemapEntry(homeUrls.ru, homeAlternates), sitemapEntry(homeUrls.cn, homeAlternates)];

for (const product of products) {
  const alternates = [
    { lang: 'en', href: productUrl(product, 'en') }, { lang: 'ru', href: productUrl(product, 'ru') },
    { lang: 'zh-CN', href: productUrl(product, 'cn') }, { lang: 'x-default', href: productUrl(product, 'en') }
  ];
  for (const locale of Object.keys(locales)) {
    sitemapEntries.push(sitemapEntry(productUrl(product, locale), alternates, [{ loc: `${baseUrl}/${String(product.image || '').replace(/^\/+/, '')}`, title: textFor(product, 'name', locale) }]));
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${sitemapEntries.join('\n')}\n</urlset>\n`;
await writeFile(join(publicDir, 'sitemap.xml'), sitemap, 'utf8');

console.log(`Generated ${products.length * 3} localized product pages and ${sitemapEntries.length} sitemap URLs.`);
