import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const baseUrl = 'https://pologenki.eu';
const translations = {
  en: JSON.parse(await readFile(join(root, 'src', 'locales', 'en.json'), 'utf8')),
  ru: JSON.parse(await readFile(join(root, 'src', 'locales', 'ru.json'), 'utf8')),
  cn: JSON.parse(await readFile(join(root, 'src', 'locales', 'cn.json'), 'utf8'))
};

const services = [
  { slug: 'supplier-sourcing', title: 'supplierSourcing', modal: 'service1', includes: 'sourcing' },
  { slug: 'contract-negotiation', title: 'contractNegotiation', modal: 'service2', includes: 'negotiation' },
  { slug: 'logistics-coordination', title: 'logisticsManagement', modal: 'service3', includes: 'logistics' },
  { slug: 'trade-documentation', title: 'tradeDocumentation', modal: 'service4', includes: 'documents' },
  { slug: 'shipment-monitoring', title: 'shipmentMonitoring', modal: 'service5', includes: 'monitoring' },
  { slug: 'full-service-import', title: 'fullServiceImport', modal: 'service6', includes: 'full' }
];

const localeCopy = {
  en: {
    prefix: '', lang: 'en', locale: 'en_US', eyebrow: 'Import management service',
    pageTitle: title => `${title} for Food Imports | Pologenki`,
    processTitle: 'How the work is organized', includedTitle: 'What this service includes',
    process: ['Clarify the product, volume and destination', 'Compare practical options and commercial terms', 'Coordinate details with suppliers and logistics partners', 'Keep you informed at every decision point'],
    requestTitle: 'Information for an initial assessment',
    request: ['Product and required specification', 'Approximate volume or shipment frequency', 'Preferred origin, destination and timing'],
    note: 'The exact scope is agreed before work starts. You receive a clear sequence of actions and one point of contact for coordination.',
    cta: 'Discuss your import request', back: 'View all services', home: 'Home', services: 'Services'
  },
  ru: {
    prefix: '/ru', lang: 'ru', locale: 'ru_RU', eyebrow: 'Услуга по управлению импортом',
    pageTitle: title => `${title} для импорта продуктов | Pologenki`,
    processTitle: 'Как организована работа', includedTitle: 'Что входит в услугу',
    process: ['Уточняем товар, объем и пункт назначения', 'Сравниваем практические варианты и коммерческие условия', 'Согласовываем детали с поставщиками и логистическими партнерами', 'Сообщаем о каждом важном этапе и решении'],
    requestTitle: 'Что нужно для первичной оценки',
    request: ['Товар и требуемая спецификация', 'Примерный объем или частота поставок', 'Желаемая страна происхождения, пункт назначения и сроки'],
    note: 'Точный объем работ согласовывается заранее. Вы получаете понятную последовательность действий и одно контактное лицо для координации.',
    cta: 'Обсудить импортный запрос', back: 'Посмотреть все услуги', home: 'Главная', services: 'Услуги'
  },
  cn: {
    prefix: '/zh-cn', lang: 'zh-CN', locale: 'zh_CN', eyebrow: '进口管理服务',
    pageTitle: title => `${title} | 食品进口服务 | Pologenki`,
    processTitle: '工作流程', includedTitle: '服务内容',
    process: ['确认产品、数量和目的地', '比较可行方案与商业条款', '与供应商及物流合作伙伴协调细节', '在每个关键节点及时沟通'],
    requestTitle: '初步评估所需信息',
    request: ['产品及所需规格', '预计数量或发货频率', '首选产地、目的地和时间要求'],
    note: '工作范围将在开始前确认。您将获得清晰的行动步骤，并由一个固定联系人负责协调。',
    cta: '讨论进口需求', back: '查看全部服务', home: '首页', services: '服务'
  }
};

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

function serviceUrl(service, localeKey) {
  return `${baseUrl}${localeCopy[localeKey].prefix}/services/${service.slug}/`;
}

function alternateLinks(service) {
  return [
    `<link rel="alternate" hreflang="en" href="${serviceUrl(service, 'en')}" />`,
    `<link rel="alternate" hreflang="ru" href="${serviceUrl(service, 'ru')}" />`,
    `<link rel="alternate" hreflang="zh-CN" href="${serviceUrl(service, 'cn')}" />`,
    `<link rel="alternate" hreflang="x-default" href="${serviceUrl(service, 'en')}" />`
  ].join('\n  ');
}

function renderServicePage(service, localeKey) {
  const copy = localeCopy[localeKey];
  const dictionary = translations[localeKey];
  const title = dictionary.services[service.title];
  const description = dictionary.modals[service.modal].description;
  const included = [1, 2, 3].map(index => dictionary.services[`${service.includes}Include${index}`]);
  const canonical = serviceUrl(service, localeKey);
  const metaDescription = `${description} ${copy.note}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service', '@id': `${canonical}#service`, name: title, description: metaDescription,
        url: canonical, serviceType: title, provider: { '@id': `${baseUrl}/#organization` },
        areaServed: ['Europe', 'CIS', 'Asia'],
        audience: { '@type': 'BusinessAudience', audienceType: 'Importers, distributors, wholesalers and food businesses' }
      },
      {
        '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: copy.home, item: `${baseUrl}${copy.prefix}/` },
          { '@type': 'ListItem', position: 2, name: copy.services, item: `${baseUrl}${copy.prefix}/#services` },
          { '@type': 'ListItem', position: 3, name: title, item: canonical }
        ]
      }
    ]
  };

  return `<!doctype html>
<html lang="${copy.lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <title>${esc(copy.pageTitle(title))}</title>
  <meta name="description" content="${esc(metaDescription)}" />
  <link rel="canonical" href="${canonical}" />
  ${alternateLinks(service)}
  <link rel="icon" type="image/jpeg" href="/logo.jpeg" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(copy.pageTitle(title))}" />
  <meta property="og:description" content="${esc(metaDescription)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${baseUrl}/optimized/ParvinaFoto-1148.webp" />
  <meta property="og:site_name" content="Pologenki" />
  <meta property="og:locale" content="${copy.locale}" />
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <style>
    *{box-sizing:border-box}body{margin:0;background:#f5f7f9;color:#17212b;font:16px/1.65 Arial,sans-serif}header{height:76px;display:flex;align-items:center;justify-content:space-between;padding:0 max(22px,calc((100% - 1120px)/2));background:#fff;border-top:4px solid #171717;border-bottom:1px solid #dde3e8}header img{width:145px;height:46px;object-fit:contain}a{color:inherit}.languages{display:flex;gap:14px}.page{max-width:1120px;margin:0 auto;padding:58px 24px 74px}.hero{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(300px,.8fr);gap:58px;align-items:center}.eyebrow{margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#5f7180}h1{max-width:720px;margin:0 0 18px;font:600 48px/1.08 Georgia,serif}h2{margin:0 0 18px;font:600 29px/1.2 Georgia,serif}.lead{max-width:720px;font-size:18px;color:#43515e}.hero img{width:100%;height:auto;aspect-ratio:4/5;object-fit:cover;border-radius:7px}.cta{display:inline-block;margin-top:18px;padding:13px 20px;background:#121212;color:#fff;text-decoration:none}.content-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:54px}.panel{padding:28px;background:#fff;border:1px solid #dbe3e8;border-radius:7px}.panel ol,.panel ul{margin:0;padding-left:22px}.panel li+li{margin-top:10px}.note{margin:18px 0 0;padding:20px 22px;border-left:4px solid #111;background:#eef3f6}.back{display:inline-block;margin-top:30px}.footer-cta{margin-top:20px;padding:30px;background:#111;color:#fff}.footer-cta h2{margin-bottom:8px}.footer-cta .cta{background:#fff;color:#111}@media(max-width:760px){header{padding:0 18px}.page{padding:36px 18px 58px}.hero{grid-template-columns:1fr;gap:28px}h1{font-size:36px}.hero img{max-width:420px}.content-grid{grid-template-columns:1fr;margin-top:36px}.panel{padding:22px}}
  </style>
</head>
<body>
  <header><a href="${copy.prefix ? `${copy.prefix}/` : '/'}"><img src="/optimized/Logo2-compact-160.webp" srcset="/optimized/Logo2-compact-160.webp 160w, /optimized/Logo2-compact-320.webp 320w" sizes="145px" alt="Pologenki" width="160" height="46" /></a><nav class="languages" aria-label="Language"><a href="${serviceUrl(service, 'en')}" lang="en">EN</a><a href="${serviceUrl(service, 'ru')}" lang="ru">RU</a><a href="${serviceUrl(service, 'cn')}" lang="zh-CN">中文</a></nav></header>
  <main class="page">
    <section class="hero"><div><p class="eyebrow">${copy.eyebrow}</p><h1>${esc(title)}</h1><p class="lead">${esc(description)}</p><a class="cta" href="mailto:info@pologenki.eu?subject=${encodeURIComponent(title)}">${copy.cta}</a></div><img src="/optimized/ParvinaFoto-480.webp" alt="Parvina Pologenki" width="480" height="574" loading="eager" fetchpriority="high" /></section>
    <div class="content-grid">
      <section class="panel"><h2>${copy.includedTitle}</h2><ul>${included.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>
      <section class="panel"><h2>${copy.processTitle}</h2><ol>${copy.process.map(item => `<li>${esc(item)}</li>`).join('')}</ol></section>
      <section class="panel"><h2>${copy.requestTitle}</h2><ul>${copy.request.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>
      <aside class="panel"><p class="eyebrow">Pologenki</p><p>${copy.note}</p><p><strong>info@pologenki.eu</strong><br>+372 58006670</p></aside>
    </div>
    <div class="footer-cta"><h2>${copy.cta}</h2><p>${copy.note}</p><a class="cta" href="mailto:info@pologenki.eu?subject=${encodeURIComponent(title)}">info@pologenki.eu</a></div>
    <a class="back" href="${copy.prefix || '/'}#services">← ${copy.back}</a>
  </main>
</body>
</html>`;
}

for (const path of ['services', 'ru/services', 'zh-cn/services']) {
  await rm(join(publicDir, path), { recursive: true, force: true });
}

for (const service of services) {
  for (const localeKey of Object.keys(localeCopy)) {
    const outputDir = join(publicDir, localeCopy[localeKey].prefix.replace(/^\//, ''), 'services', service.slug);
    await mkdir(outputDir, { recursive: true });
    await writeFile(join(outputDir, 'index.html'), renderServicePage(service, localeKey), 'utf8');
  }
}

const productsData = JSON.parse(await readFile(join(publicDir, 'data', 'products.json'), 'utf8'));
const portfolioData = JSON.parse(await readFile(join(publicDir, 'data', 'portfolio.json'), 'utf8'));
const lastmod = [productsData.lastUpdated, portfolioData.lastUpdated].filter(Boolean).sort().at(-1) || new Date().toISOString().slice(0, 10);
const serviceEntries = [];
for (const service of services) {
  const alternates = [
    { lang: 'en', href: serviceUrl(service, 'en') }, { lang: 'ru', href: serviceUrl(service, 'ru') },
    { lang: 'zh-CN', href: serviceUrl(service, 'cn') }, { lang: 'x-default', href: serviceUrl(service, 'en') }
  ];
  for (const localeKey of Object.keys(localeCopy)) {
    serviceEntries.push(`  <url>\n    <loc>${serviceUrl(service, localeKey)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates.map(item => `    <xhtml:link rel="alternate" hreflang="${item.lang}" href="${item.href}" />`).join('\n')}\n  </url>`);
  }
}

const sitemapPath = join(publicDir, 'sitemap.xml');
const sitemap = await readFile(sitemapPath, 'utf8');
await writeFile(sitemapPath, sitemap.replace('</urlset>', `${serviceEntries.join('\n')}\n</urlset>`), 'utf8');
console.log(`Generated ${services.length * 3} localized service pages.`);
