const REPO = 'pologenki/parvina-website';
const BRANCH = 'master';
const PATH = 'public/data/products.json';
const MAX_SOURCE_IMAGE_SIZE = 24 * 1024 * 1024;
const PRODUCT_IMAGE_PROFILE = { maxWidth: 1400, maxHeight: 1400, targetBytes: 650 * 1024 };
const PORTFOLIO_IMAGE_PROFILE = { maxWidth: 1920, maxHeight: 1920, targetBytes: 1200 * 1024 };
const ANALYTICS_URL = 'https://analytics.google.com/analytics/web/#/a370639609p507773161/realtime/overview?params=_u..nav%3Dmaui';
const GA_PROPERTY_ID = '507773161';
const GA_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const GA_CLIENT_ID_KEY = 'pologenkiGaOAuthClientId';
const PRIVATE_PRICE_KEY = 'pologenkiPrivatePriceLedgerV1';
let token = '', data = null, sha = '';
let originalData = null;
let privatePriceLedger = { version: 1, entries: {} };
let deletedStack = [];
let gaAccessToken = '';
let gaTokenClient = null;
let gaTrendRows = [];
let dashboardIssueFilter = null;

function doLogin() {
  const t = document.getElementById('tokenInput').value.trim();
  if (!t) return;
  token = t;
  sessionStorage.setItem('pg_tok', t);
  enterAdmin();
}

function doLogout() {
  closeAdminMenu();
  sessionStorage.removeItem('pg_tok');
  token = ''; data = null; sha = '';
  gaAccessToken = '';
  document.getElementById('loginWrap').style.display = 'flex';
  document.getElementById('siteHeader').classList.remove('visible');
  document.getElementById('adminSidebar').classList.remove('visible');
  document.getElementById('adminMain').classList.remove('visible');
  document.getElementById('statusBar').classList.remove('visible');
}

function toggleAdminMenu() {
  const sidebar = document.getElementById('adminSidebar');
  const toggle = document.getElementById('mobileMenuToggle');
  const willOpen = !sidebar?.classList.contains('mobile-open');
  sidebar?.classList.toggle('mobile-open', willOpen);
  toggle?.classList.toggle('is-open', willOpen);
  toggle?.setAttribute('aria-expanded', String(willOpen));
  toggle?.setAttribute('aria-label', willOpen ? 'Закрыть меню' : 'Открыть меню');
  document.body.classList.toggle('admin-menu-open', willOpen);
}

function closeAdminMenu() {
  document.getElementById('adminSidebar')?.classList.remove('mobile-open');
  const toggle = document.getElementById('mobileMenuToggle');
  toggle?.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Открыть меню');
  document.body.classList.remove('admin-menu-open');
}

function replayAdminLogo() {
  const logo = document.querySelector('.site-header .header-logo');
  if (!logo || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  logo.classList.remove('is-replaying');
  void logo.offsetWidth;
  logo.classList.add('is-replaying');
  window.setTimeout(() => logo.classList.remove('is-replaying'), 1900);
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeAdminMenu();
});

async function enterAdmin() {
  document.getElementById('loginWrap').style.display = 'none';
  document.getElementById('siteHeader').classList.add('visible');
  document.getElementById('adminSidebar').classList.add('visible');
  document.getElementById('adminMain').classList.add('visible');
  document.getElementById('statusBar').classList.add('visible');
  loadDeletedStack();
  loadPrivatePriceLedger();
  await fetchProducts();
  await fetchPortfolio();
  renderDashboard();
  switchTab('dashboard');
}

async function fetchProducts() {
  setStatus('busy', 'Loading products...');
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
    });
    if (!r.ok) throw new Error('Auth failed - check your token');
    const json = await r.json();
    sha = json.sha;
    const binary = atob(json.content.replace(/\n/g,''));
const bytes = new Uint8Array(binary.length);
for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
data = JSON.parse(new TextDecoder('utf-8').decode(bytes));
    originalData = JSON.parse(JSON.stringify(data));
    data.products = data.products || [];
    normalizeLocalizedFields();
    document.getElementById('pageMeta').textContent =
      `${data.products.length} products - Last updated: ${data.lastUpdated || '-'}`;
    document.getElementById('headerMeta').textContent =
      `Last updated: ${data.lastUpdated || '-'}`;
    renderGrid();
    setStatus('ok', 'Ready');
  } catch(e) {
    setStatus('err', e.message);
    showToast(e.message, 'fail');
  }
}

function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function adminImageSrc(path) {
  const value = String(path || '').trim();
  if (!value) return '';
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:')) return value;
  const normalized = value.replace(/^\/+/, '');
  return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/public/${normalized}`;
}

async function putGitHubFile(remotePath, base64, message) {
  let existingSha = '';
  const checkResponse = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${remotePath}?ref=${BRANCH}`,
    { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } }
  );
  if (checkResponse.ok) {
    const checkJson = await checkResponse.json();
    existingSha = checkJson.sha;
  }

  const body = {
    message,
    content: base64,
    branch: BRANCH
  };
  if (existingSha) body.sha = existingSha;

  const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${remotePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Upload failed: ${remotePath}`);
  }

  return response.json();
}

async function getGitHubFileSha(remotePath) {
  const response = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${remotePath}?ref=${BRANCH}&_=${Date.now()}`,
    { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } }
  );
  if (response.status === 404) return '';
  if (!response.ok) throw new Error(`Не удалось проверить актуальную версию ${remotePath}`);
  const json = await response.json();
  return json.sha || '';
}

function mojibakeScore(text) {
  return (String(text || '').match(/[ÃÂÐÑРСЃЊЌЏЉЋє§ЃђЌґ�]/g) || []).length;
}

function looksLikeLanguage(text, targetLang) {
  const value = String(text || '');
  if (targetLang === 'cn') return /[\u4e00-\u9fff]/.test(value);
  if (targetLang === 'ru') return /[А-Яа-яЁё]/.test(value);
  return Boolean(value.trim());
}

function decodeUtf8Bytes(bytes) {
  try {
    return new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(bytes));
  } catch (error) {
    return '';
  }
}

function decodeLatin1Mojibake(text) {
  const bytes = [];
  for (const char of String(text || '')) {
    const code = char.charCodeAt(0);
    if (code > 255) return '';
    bytes.push(code);
  }
  return decodeUtf8Bytes(bytes);
}

function decodeCp1251Mojibake(text) {
  const cp1251 =
    '\u0402\u0403\u201A\u0453\u201E\u2026\u2020\u2021\u20AC\u2030\u0409\u2039\u040A\u040C\u040B\u040F' +
    '\u0452\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u2122\u0459\u203A\u045A\u045C\u045B\u045F' +
    '\u00A0\u040E\u045E\u0408\u00A4\u0490\u00A6\u00A7\u0401\u00A9\u0404\u00AB\u00AC\u00AD\u00AE\u0407' +
    '\u00B0\u00B1\u0406\u0456\u0491\u00B5\u00B6\u00B7\u0451\u2116\u0454\u00BB\u0458\u0405\u0455\u0457' +
    '\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F' +
    '\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F' +
    '\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F' +
    '\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E\u044F';
  const bytes = [];
  for (const char of String(text || '')) {
    const code = char.charCodeAt(0);
    if (code < 128) {
      bytes.push(code);
      continue;
    }
    const index = cp1251.indexOf(char);
    if (index === -1) return '';
    bytes.push(index + 128);
  }
  return decodeUtf8Bytes(bytes);
}

function repairMojibakeText(value, targetLang = '') {
  const text = String(value || '');
  if (!text) return text;

  const originalScore = mojibakeScore(text);
  if (looksLikeLanguage(text, targetLang) && originalScore === 0) return text;
  if (originalScore === 0 && !/[РСÐÑÃÂ�]/.test(text)) return text;

  const candidates = [text];

  try {
    candidates.push(decodeURIComponent(escape(text)));
  } catch (error) {}

  candidates.push(decodeLatin1Mojibake(text));
  candidates.push(decodeCp1251Mojibake(text));

  const cleanCandidates = candidates
    .filter(Boolean)
    .map(candidate => candidate.trim())
    .filter((candidate, index, array) => array.indexOf(candidate) === index);

  const languageMatch = cleanCandidates.find(candidate =>
    candidate !== text &&
    looksLikeLanguage(candidate, targetLang) &&
    mojibakeScore(candidate) < originalScore
  );
  if (languageMatch) return languageMatch;

  const lowerScore = cleanCandidates.find(candidate =>
    candidate !== text &&
    mojibakeScore(candidate) < originalScore
  );
  return lowerScore || text;
}

function normalizeLocalizedFields() {
  if (data?.products) {
    data.products.forEach(product => {
      ['name_ru', 'desc_ru', 'origin_ru'].forEach(field => {
        product[field] = repairMojibakeText(product[field], 'ru');
      });
      ['name_cn', 'desc_cn', 'origin_cn'].forEach(field => {
        product[field] = repairMojibakeText(product[field], 'cn');
      });
      (product.variants || []).forEach(variant => {
        variant.desc_ru = repairMojibakeText(variant.desc_ru, 'ru');
        variant.desc_cn = repairMojibakeText(variant.desc_cn, 'cn');
      });
    });
  }

  if (pfData?.items) {
    pfData.items.forEach(item => {
      ['title_ru', 'desc_ru'].forEach(field => {
        item[field] = repairMojibakeText(item[field], 'ru');
      });
      ['title_cn', 'desc_cn'].forEach(field => {
        item[field] = repairMojibakeText(item[field], 'cn');
      });
    });
  }
}

function repairAllLocalizedText() {
  normalizeLocalizedFields();
  renderGrid();
  if (pfData?.items) renderPortfolioGrid();
  showToast('Кодировка RU/CN полей исправлена', 'ok');
}

function buildVariantHTML(i, j, v) {
  const variantName = v.name || `Сорт ${j + 1}`;
  const variantPrice = v.price || 'Цена не указана';
  return `
    <details class="variant-item" id="variant-${i}-${j}">
      <summary class="variant-summary" aria-label="Редактировать сорт ${esc(variantName)}">
        <span class="variant-summary-index">${String(j + 1).padStart(2, '0')}</span>
        <span class="variant-summary-title">${esc(variantName)}</span>
        <span class="variant-summary-price">${esc(variantPrice)}</span>
        <span class="variant-summary-action" aria-hidden="true"></span>
      </summary>
      <div class="variant-editor">
        <button class="variant-delete-btn" onclick="deleteVariant(${i},${j})" title="Delete variant">Удалить сорт</button>
        <div class="variant-field">
          <span class="variant-mini-label">Название сорта</span>
          <input class="variant-input" value="${esc(v.name)}"
            oninput="updV(${i},${j},'name',this.value);updateVariantSummary(${i},${j})" placeholder="e.g. WW320 - Whole White">
        </div>
        <div class="variant-row-2col admin-price-pair">
          <div>
            <span class="variant-mini-label">Цена на сайте</span>
            <input class="variant-input price" value="${esc(v.price)}"
              oninput="updV(${i},${j},'price',this.value);updateVariantSummary(${i},${j});updateInlinePrivateMargin(${i},${j})" placeholder="0,00 USD/kg">
          </div>
          <div class="private-inline-field">
            <span class="variant-mini-label">Закупка <em>приватно</em></span>
            <input class="variant-input private-cost-input" value="${esc(getPrivateCostValue(i,j))}"
              onblur="savePrivateCostInline(${i},${j},this)" placeholder="Только для вас">
            <small id="private-margin-${i}-${j}">${esc(getPrivateMarginText(i,j,v.price))}</small>
          </div>
        </div>
        <div class="variant-desc-row">
          <div>
            <span class="variant-mini-label">Описание <span class="lang-badge en">EN</span></span>
            <textarea class="variant-input en"
              oninput="updV(${i},${j},'desc',this.value)" onblur="autoTranslateVariantField(${i},${j},'desc')" placeholder="Packing, port, quality notes...">${esc(v.desc)}</textarea>
          </div>
          <div class="translation-field">
            <span class="variant-mini-label">Описание <span class="lang-badge ru">RU</span></span>
            <textarea class="variant-input ru"
              oninput="updV(${i},${j},'desc_ru',this.value)" placeholder="Упаковка, порт, качество...">${esc(v.desc_ru)}</textarea>
          </div>
          <div class="translation-field">
            <span class="variant-mini-label">Описание <span class="lang-badge cn">CN</span></span>
            <textarea class="variant-input cn"
              oninput="updV(${i},${j},'desc_cn',this.value)" placeholder="包装、港口、质量说明...">${esc(v.desc_cn)}</textarea>
          </div>
        </div>
      </div>
    </details>
  `;
}

function renderGrid() {
  const grid = document.getElementById('productsGrid');
  const search = (document.getElementById('productSearch')?.value || '').toLowerCase().trim();
  const categoryFilter = (document.getElementById('productCategoryFilter')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('productStatusFilter')?.value || 'all';
  const entries = data.products
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => {
      const haystack = [
        p.name, p.name_ru, p.name_cn, p.desc, p.desc_ru, p.desc_cn,
        p.origin, p.origin_ru, p.origin_cn, p.mainPrice, p.category, p.image
      ].join(' ').toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      const matchesCategory = !categoryFilter || String(p.category || '').toLowerCase().includes(categoryFilter);
      const isPublished = p.published !== false;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && isPublished) ||
        (statusFilter === 'draft' && !isPublished);
      const matchesIssue = !dashboardIssueFilter || dashboardIssueFilter.tab !== 'products' || productHasIssue(p, dashboardIssueFilter.type);
      return matchesSearch && matchesCategory && matchesStatus && matchesIssue;
    });

  document.getElementById('pageMeta').textContent =
    `${entries.length}/${data.products.length} products - Last updated: ${data.lastUpdated || '-'}`;
  const publishedCount = data.products.filter(p => p.published !== false).length;
  const missingCnCount = data.products.filter(p => p.published !== false && (!p.name_cn || !p.desc_cn || !p.origin_cn)).length;
  renderStats('productsStats', [
    { value: data.products.length, label: 'Всего', hint: 'Все товары в админке' },
    { value: publishedCount, label: 'На сайте', hint: 'Показываются посетителям' },
    { value: data.products.length - publishedCount, label: 'Скрыто', hint: 'Черновики не видны на сайте' },
    { value: missingCnCount, label: 'Без CN', hint: 'Нет китайского текста' }
  ]);
  renderChangeLog('productChangeLog', data.changeLog);

  grid.innerHTML = entries.map(({ p, i }) => `
  <details class="product-card product-list-card" id="product-card-${i}">
      <summary class="product-list-summary">
        <span class="product-row-num">${String(i+1).padStart(2,'0')}</span>
        <img class="product-row-img" src="https://raw.githubusercontent.com/${REPO}/master/public/${esc(p.image || '')}" onerror="this.style.opacity='0.15'">
        <span class="product-row-main">
          <strong>${esc(p.name || 'New product')}</strong>
          <small>${esc(p.desc || 'Short description')} · ${esc(p.origin || 'Origin')}</small>
        </span>
        <span class="product-row-price">${esc(p.mainPrice || 'Price on request')}</span>
        <span class="product-row-meta">${p.variants?.length || 0} сортов</span>
        <span class="product-row-status ${p.published !== false ? 'is-live' : 'is-draft'}">${p.published !== false ? 'Опубликовано' : 'Черновик'}</span>
      </summary>
      <div class="card-body">
        <div class="card-toolbar">
          <label class="publish-toggle">
            <input type="checkbox" ${p.published !== false ? 'checked' : ''}
              onchange="upd(${i},'published',this.checked);renderGrid()">
            ${p.published !== false ? 'Опубликовано' : 'Черновик'}
          </label>
          <button class="btn-mini" type="button" onclick="duplicateProduct(${i})">Дубль</button>
          <button class="btn-mini danger" type="button" onclick="deleteProduct(${i})">Удалить</button>
          <button class="btn-mini" type="button" onclick="toggleTranslations(this)">Переводы</button>
          <button class="btn-mini" type="button" onclick="autoTranslateProduct(${i})">RU/CN авто</button>
        </div>
        <div class="translation-note">Заполняй английские поля. Русский и китайский будут подставляться автоматически; здесь можно проверить или поправить перевод вручную.</div>

        <div class="bilingual-row">
          <div class="card-field">
            <label class="card-label">Название <span class="lang-badge en">EN</span></label>
            <input class="card-input en" value="${esc(p.name)}"
              oninput="upd(${i},'name',this.value)" onblur="autoTranslateProductField(${i},'name')" placeholder="Product name">
          </div>
          <div class="card-field translation-field">
            <label class="card-label">Название <span class="lang-badge ru">RU</span></label>
            <input class="card-input ru" value="${esc(p.name_ru)}"
              oninput="upd(${i},'name_ru',this.value)" placeholder="Название товара">
          </div>
          <div class="card-field translation-field">
            <label class="card-label">Название <span class="lang-badge cn">CN</span></label>
            <input class="card-input cn" value="${esc(p.name_cn)}"
              oninput="upd(${i},'name_cn',this.value)" placeholder="产品名称">
          </div>
        </div>

        <div class="admin-price-pair product-price-pair">
          <div class="card-field">
            <label class="card-label">Цена на сайте</label>
            <input class="card-input price" value="${esc(p.mainPrice)}"
              oninput="upd(${i},'mainPrice',this.value);updateInlinePrivateMargin(${i},null)">
          </div>
          <div class="card-field private-inline-field">
            <label class="card-label">Закупочная цена <em>приватно</em></label>
            <input class="card-input private-cost-input" value="${esc(getPrivateCostValue(i,null))}"
              onblur="savePrivateCostInline(${i},null,this)" placeholder="Не публикуется на сайте">
            <small id="private-margin-${i}-main">${esc(getPrivateMarginText(i,null,p.mainPrice))}</small>
          </div>
        </div>

        <div class="bilingual-row">
          <div class="card-field">
            <label class="card-label">Категория</label>
            <input class="card-input" value="${esc(p.category || '')}"
              oninput="upd(${i},'category',this.value)" placeholder="nuts / dried-fruits / spices">
          </div>
          <div class="card-field">
            <label class="card-label">Путь к фото</label>
            <input class="card-input" value="${esc(p.image || '')}"
              oninput="upd(${i},'image',this.value)" placeholder="goods/product.webp">
          </div>
        </div>

        <div class="card-field">
          <label class="card-label">Загрузить фото товара</label>
          <div class="pf-upload-area" id="product-upload-area-${i}"
            ondragover="event.preventDefault();this.classList.add('dragover')"
            ondragleave="this.classList.remove('dragover')"
            ondrop="handleProductPhotoDrop(event,${i})">
            <input type="file" accept="image/*" onchange="uploadProductPhoto(this,${i})">
            <div class="pf-upload-icon">📷</div>
            <div class="pf-upload-label">Нажми или перетащи фото товара</div>
            <div class="pf-upload-sub">JPG, PNG, WEBP - загрузка в /goods/</div>
          </div>
          <div class="pf-upload-progress" id="product-progress-${i}">
            <div class="pf-upload-progress-fill" id="product-progress-fill-${i}"></div>
          </div>
          <div class="pf-upload-status" id="product-status-${i}">
            ${p.image ? `✓ ${p.image.split('/').pop()}` : ''}
          </div>
        </div>

        ${(p.priceHistory && p.priceHistory.length) ? `
          <div class="price-history">Последнее изменение цены: ${esc(p.priceHistory[0].from)} -> ${esc(p.priceHistory[0].to)} (${esc(p.priceHistory[0].date)})</div>
        ` : ''}

        <div class="bilingual-row">
          <div class="card-field">
            <label class="card-label">Страна <span class="lang-badge en">EN</span></label>
            <input class="card-input en" value="${esc(p.origin)}"
              oninput="upd(${i},'origin',this.value)" onblur="autoTranslateProductField(${i},'origin')" placeholder="e.g. Vietnam">
          </div>
          <div class="card-field translation-field">
            <label class="card-label">Страна <span class="lang-badge ru">RU</span></label>
            <input class="card-input ru" value="${esc(p.origin_ru)}"
              oninput="upd(${i},'origin_ru',this.value)" placeholder="например: Вьетнам">
          </div>
          <div class="card-field translation-field">
            <label class="card-label">Страна <span class="lang-badge cn">CN</span></label>
            <input class="card-input cn" value="${esc(p.origin_cn)}"
              oninput="upd(${i},'origin_cn',this.value)" placeholder="例如：越南">
          </div>
        </div>

        <div class="bilingual-row">
          <div class="card-field">
            <label class="card-label">Описание <span class="lang-badge en">EN</span></label>
            <input class="card-input en" value="${esc(p.desc)}"
              oninput="upd(${i},'desc',this.value)" onblur="autoTranslateProductField(${i},'desc')" placeholder="Short description">
          </div>
          <div class="card-field translation-field">
            <label class="card-label">Описание <span class="lang-badge ru">RU</span></label>
            <input class="card-input ru" value="${esc(p.desc_ru)}"
              oninput="upd(${i},'desc_ru',this.value)" placeholder="Краткое описание">
          </div>
          <div class="card-field translation-field">
            <label class="card-label">Описание <span class="lang-badge cn">CN</span></label>
            <input class="card-input cn" value="${esc(p.desc_cn)}"
              oninput="upd(${i},'desc_cn',this.value)" placeholder="简短描述">
          </div>
        </div>

      </div>
      <div class="variants-header" onclick="toggleV(this)">
        <span class="variants-label" id="vlabel-${i}"><strong>Сорта</strong><em>${p.variants.length}</em></span>
        <span class="variants-arrow" aria-hidden="true"></span>
      </div>
      <div class="variants-body">
        <div id="vlist-${i}">
          ${p.variants.map((v,j) => buildVariantHTML(i,j,v)).join('')}
        </div>
        <button class="btn-add-variant" onclick="addVariant(${i})">+ Добавить сорт</button>
      </div>
    </details>
  `).join('');
  renderDashboardIssueNotice('products');
}

function addVariant(i) {
  data.products[i].variants.push({ name: '', price: '', desc: '', desc_ru: '', desc_cn: '' });
  const j = data.products[i].variants.length - 1;
  document.getElementById(`vlist-${i}`).insertAdjacentHTML('beforeend', buildVariantHTML(i, j, { name:'', price:'', desc:'', desc_ru:'', desc_cn:'' }));
  updateVLabel(i);
  document.getElementById(`variant-${i}-${j}`).open = true;
  document.getElementById(`variant-${i}-${j}`).querySelector('.variant-input').focus();
}

function deleteVariant(i, j) {
  if (data.products[i].variants.length <= 1) { showToast('At least one variant required', 'fail'); return; }
  shiftPrivateVariantPricesAfterDelete(i, j);
  data.products[i].variants.splice(j, 1);
  const list = document.getElementById(`vlist-${i}`);
  list.innerHTML = data.products[i].variants.map((v, nj) => buildVariantHTML(i, nj, v)).join('');
  updateVLabel(i);
}

function shiftPrivateVariantPricesAfterDelete(productIndex, deletedIndex) {
  const product = data?.products?.[productIndex];
  const productId = product?.id || `product-${productIndex}`;
  const nextEntries = { ...privatePriceLedger.entries };
  delete nextEntries[`variant:${productId}:${deletedIndex}`];
  for (let index = deletedIndex + 1; index < (product?.variants?.length || 0); index++) {
    const oldKey = `variant:${productId}:${index}`;
    const newKey = `variant:${productId}:${index - 1}`;
    if (nextEntries[oldKey]) {
      nextEntries[newKey] = nextEntries[oldKey];
      delete nextEntries[oldKey];
    }
  }
  privatePriceLedger.entries = nextEntries;
  persistPrivatePriceLedger();
}

function updateVLabel(i) {
  const el = document.getElementById(`vlabel-${i}`);
  if (el) el.innerHTML = `<strong>Сорта</strong><em>${data.products[i].variants.length}</em>`;
}

function updateVariantSummary(i, j) {
  const variant = data.products?.[i]?.variants?.[j];
  const item = document.getElementById(`variant-${i}-${j}`);
  if (!variant || !item) return;
  const title = item.querySelector('.variant-summary-title');
  const price = item.querySelector('.variant-summary-price');
  if (title) title.textContent = variant.name || `Сорт ${j + 1}`;
  if (price) price.textContent = variant.price || 'Цена не указана';
}

function toggleV(header) {
  const body = header.nextElementSibling;
  const willOpen = !body.classList.contains('open');
  document.querySelectorAll('.variants-body.open').forEach(openBody => {
    if (openBody !== body) openBody.classList.remove('open');
  });
  document.querySelectorAll('.variants-arrow.open').forEach(openArrow => {
    if (openArrow !== header.querySelector('.variants-arrow')) openArrow.classList.remove('open');
  });
  header.querySelector('.variants-arrow').classList.toggle('open', willOpen);
  body.classList.toggle('open', willOpen);
}

function upd(i, f, v) { data.products[i][f] = v; }
function updV(i, j, f, v) { data.products[i].variants[j][f] = v; }

function toggleTranslations(button) {
  const card = button.closest('.product-card, .portfolio-card');
  if (!card) return;
  card.classList.toggle('show-translations');
  button.textContent = card.classList.contains('show-translations') ? 'Скрыть переводы' : 'Переводы';
}

async function translateText(text, targetLang) {
  const value = String(text || '').trim();
  if (!value) return '';
  const target = targetLang === 'ru' ? 'ru' : 'zh-CN';

  const providers = [
    async () => {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(value)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Google translate request failed');
      const json = await response.json();
      return json?.[0]?.map(part => part?.[0] || '').join('');
    },
    async () => {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(value)}&langpair=en|${target}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('MyMemory translate request failed');
      const json = await response.json();
      return json?.responseData?.translatedText;
    }
  ];

  for (const provider of providers) {
    try {
      const translated = await provider();
      if (translated && translated !== value) return repairMojibakeText(translated, targetLang);
    } catch (error) {
      console.warn('Auto translate provider failed:', error);
    }
  }

  showToast('Автоперевод не сработал. Попробуй позже.', 'fail');
  return value;
}

function translateToRu(text) {
  return translateText(text, 'ru');
}

function translateToCn(text) {
  return translateText(text, 'cn');
}

async function translatePairFromEnglish(text) {
  const [ru, cn] = await Promise.all([translateToRu(text), translateToCn(text)]);
  return { ru, cn };
}

async function autoTranslateProduct(i) {
  const product = data.products[i];
  if (!product) return;

  setStatus('busy', `Перевожу ${product.name || 'товар'}...`);
  if (product.name) {
    const translated = await translatePairFromEnglish(product.name);
    product.name_ru = translated.ru;
    product.name_cn = translated.cn;
  }
  if (product.desc) {
    const translated = await translatePairFromEnglish(product.desc);
    product.desc_ru = translated.ru;
    product.desc_cn = translated.cn;
  }
  if (product.origin) {
    const translated = await translatePairFromEnglish(product.origin);
    product.origin_ru = translated.ru;
    product.origin_cn = translated.cn;
  }

  for (const variant of product.variants || []) {
    if (!variant.desc) continue;
    const translated = await translatePairFromEnglish(variant.desc);
    variant.desc_ru = translated.ru;
    variant.desc_cn = translated.cn;
  }

  renderGrid();
  setStatus('ok', 'Переводы обновлены');
  showToast('RU/CN поля заполнены', 'ok');
}

async function autoTranslateProductField(i, field) {
  const product = data.products[i];
  const value = String(product?.[field] || '').trim();
  if (!product || !value) return;

  setStatus('busy', 'Перевожу поле...');
  const translated = await translatePairFromEnglish(value);
  product[`${field}_ru`] = translated.ru;
  product[`${field}_cn`] = translated.cn;
  renderGrid();
  setStatus('ok', 'Поле переведено');
}

async function autoTranslateVariantField(i, j, field) {
  const variant = data.products?.[i]?.variants?.[j];
  const value = String(variant?.[field] || '').trim();
  if (!variant || !value) return;

  setStatus('busy', 'Перевожу сорт...');
  const translated = await translatePairFromEnglish(value);
  variant[`${field}_ru`] = translated.ru;
  variant[`${field}_cn`] = translated.cn;
  renderGrid();
  setStatus('ok', 'Сорт переведён');
}

async function autoTranslateAllProducts() {
  if (!data?.products?.length) return;
  for (let i = 0; i < data.products.length; i++) {
    await autoTranslateProduct(i);
  }
  showToast('RU/CN поля заполнены для всех товаров', 'ok');
}

function addProduct() {
  if (!data?.products) return;
  const next = data.products.length + 1;
  const product = {
    id: `new-product-${Date.now()}`,
    published: false,
    category: '',
    name: `New Product ${next}`,
    name_ru: '',
    name_cn: '',
    desc: '',
    desc_ru: '',
    desc_cn: '',
    origin: '',
    origin_ru: '',
    origin_cn: '',
    image: 'goods/cashew.webp',
    mainPrice: 'Price on request',
    variants: [
      { name: 'Default grade', price: 'Price on request', desc: '', desc_ru: '', desc_cn: '' }
    ]
  };

  data.products.push(product);
  renderGrid();
  document.getElementById('pageMeta').textContent =
    `${data.products.length} products - Last updated: ${data.lastUpdated || '-'}`;

  setTimeout(() => {
    const cards = document.querySelectorAll('.product-card');
    const last = cards[cards.length - 1];
    if (last) {
      last.scrollIntoView({ behavior: 'smooth', block: 'center' });
      last.querySelector('.card-input')?.focus();
    }
  }, 50);
}

function duplicateProduct(i) {
  const source = data.products[i];
  if (!source) return;
  const copy = JSON.parse(JSON.stringify(source));
  copy.id = `${source.id || 'product'}-copy-${Date.now()}`;
  copy.name = `${source.name || 'Product'} Copy`;
  copy.published = false;
  data.products.splice(i + 1, 0, copy);
  renderGrid();
  showToast('Product duplicated as draft', 'ok');
}

function deleteProduct(i) {
  const product = data.products[i];
  if (!product) return;
  const name = product.name || product.name_ru || `Product #${i + 1}`;
  if (!confirm(`Delete product "${name}"?`)) return;
  const [deleted] = data.products.splice(i, 1);
  rememberDeleted('product', deleted, i);
  renderGrid();
  showToast('Товар удалён. Можно вернуть кнопкой "Вернуть удалённое".', 'ok');
}

function moveProduct(i, direction) {
  const next = i + direction;
  if (next < 0 || next >= data.products.length) return;
  const [item] = data.products.splice(i, 1);
  data.products.splice(next, 0, item);
  renderGrid();
}

function handleProductPhotoDrop(event, i) {
  event.preventDefault();
  document.getElementById(`product-upload-area-${i}`)?.classList.remove('dragover');
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) uploadProductPhoto({ files: [file] }, i);
}

async function uploadProductPhoto(input, i) {
  const file = input.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Выбери файл изображения', 'fail');
    return;
  }

  if (file.size > MAX_SOURCE_IMAGE_SIZE) {
    showToast('Фото слишком большое. Максимальный исходный размер — 24 MB.', 'fail');
    return;
  }

  const statusEl = document.getElementById(`product-status-${i}`);
  const progressEl = document.getElementById(`product-progress-${i}`);
  const fillEl = document.getElementById(`product-progress-fill-${i}`);
  statusEl.className = 'pf-upload-status';
  statusEl.textContent = 'Оптимизация фото...';
  progressEl.style.display = 'block';
  fillEl.style.width = '20%';

  try {
    const optimized = await optimizeImageForUpload(file, PRODUCT_IMAGE_PROFILE);
    const safeName = safeFileName(optimized.fileName);
    const sourcePath = `public/goods/${safeName}`;
    const base64 = await blobToBase64(optimized.blob);

    fillEl.style.width = '60%';
    statusEl.textContent = 'Загрузка в GitHub...';

    await putGitHubFile(sourcePath, base64, `Upload product photo: ${safeName}`);

    fillEl.style.width = '100%';
    data.products[i].image = `goods/${safeName}`;
    renderGrid();
    showToast(buildOptimizationMessage('Фото товара загружено', optimized), 'ok');
  } catch (error) {
    fillEl.style.width = '100%';
    fillEl.style.background = 'var(--danger)';
    statusEl.className = 'pf-upload-status err';
    statusEl.textContent = 'Ошибка: ' + error.message;
    setTimeout(() => {
      progressEl.style.display = 'none';
      fillEl.style.background = 'var(--dark)';
    }, 3000);
  }
}

function isSafeImagePath(value) {
  const path = String(value || '').trim();
  if (!path) return false;
  if (/javascript:/i.test(path)) return false;
  if (path.includes('..')) return false;
  return /^(https?:\/\/|\/?(goods|portfolio|images\/portfolio)\/)/i.test(path);
}

function safeFileName(fileName) {
  const parts = String(fileName || 'portfolio-image.jpg').split('.');
  const ext = (parts.pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const base = parts.join('.').replace(/[^a-z0-9._-]/gi, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '') || 'portfolio';
  return `${Date.now()}_${base}.${ext}`;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = () => reject(new Error('Не удалось прочитать изображение'));
    reader.readAsDataURL(blob);
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error('Не удалось сжать изображение')),
      type,
      quality
    );
  });
}

async function optimizeImageForUpload(file, profile) {
  const originalSize = file.size;
  const passthrough = /image\/(svg\+xml|gif)/i.test(file.type);
  if (passthrough) {
    return { blob: file, fileName: file.name, originalSize, finalSize: file.size, optimized: false };
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch (error) {
    throw new Error('Формат изображения не поддерживается браузером');
  }

  const scale = Math.min(1, profile.maxWidth / bitmap.width, profile.maxHeight / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  if (scale === 1 && file.size <= profile.targetBytes) {
    bitmap.close?.();
    return { blob: file, fileName: file.name, originalSize, finalSize: file.size, optimized: false };
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: true });
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  let compressed = null;
  for (const quality of [0.84, 0.76, 0.68, 0.6]) {
    compressed = await canvasToBlob(canvas, 'image/webp', quality);
    if (compressed.size <= profile.targetBytes) break;
  }

  if (scale === 1 && compressed.size >= file.size) {
    return { blob: file, fileName: file.name, originalSize, finalSize: file.size, optimized: false };
  }

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
  return {
    blob: compressed,
    fileName: `${baseName}.webp`,
    originalSize,
    finalSize: compressed.size,
    optimized: true,
    width,
    height
  };
}

function buildOptimizationMessage(prefix, result) {
  if (!result.optimized) return `${prefix}: ${formatFileSize(result.finalSize)}`;
  return `${prefix}: ${formatFileSize(result.originalSize)} → ${formatFileSize(result.finalSize)}`;
}

function validateProductsData(payload) {
  const errors = [];
  if (!payload || !Array.isArray(payload.products)) {
    return ['Products JSON must contain a products array'];
  }

  payload.products.forEach((product, i) => {
    const label = product.name || product.name_ru || `Product #${i + 1}`;
    if (product.published === false) {
      if (!String(product.id || '').trim()) errors.push(`${label}: draft is missing id`);
      return;
    }
    if (!String(product.id || '').trim()) errors.push(`${label}: missing id`);
    if (!String(product.name || '').trim()) errors.push(`${label}: missing English name`);
    if (!String(product.name_ru || '').trim()) errors.push(`${label}: missing Russian name`);
    if (!isSafeImagePath(product.image)) errors.push(`${label}: invalid image path`);
    if (!String(product.mainPrice || '').trim()) errors.push(`${label}: missing main price`);
    if (!Array.isArray(product.variants) || product.variants.length === 0) {
      errors.push(`${label}: add at least one variant`);
      return;
    }

    product.variants.forEach((variant, j) => {
      const variantLabel = `${label}, variant #${j + 1}`;
      if (!String(variant.name || '').trim()) errors.push(`${variantLabel}: missing English name`);
      if (!String(variant.price || '').trim()) errors.push(`${variantLabel}: missing price`);
      if (!String(variant.desc || '').trim()) errors.push(`${variantLabel}: missing English description`);
      if (!String(variant.desc_ru || '').trim()) errors.push(`${variantLabel}: missing Russian description`);
    });
  });

  return errors;
}

function validatePortfolioData(payload) {
  const errors = [];
  if (!payload || !Array.isArray(payload.items)) {
    return ['Portfolio JSON must contain an items array'];
  }

  payload.items.forEach((item, i) => {
    const label = item.title || item.title_ru || `Portfolio item #${i + 1}`;
    if (item.published === false) return;
    if (!String(item.title || '').trim()) errors.push(`${label}: missing English title`);
    if (!String(item.title_ru || '').trim()) errors.push(`${label}: missing Russian title`);
    if (!isSafeImagePath(item.img)) errors.push(`${label}: invalid image URL`);
  });

  return errors;
}

function blockPublish(errors, area) {
  const first = errors[0] || 'Validation failed';
  setStatus('err', `${area}: ${first}`);
  showToast(`${area}: ${first}`, 'fail');
  renderValidationPanel(area === 'Products' ? 'productsValidation' : 'portfolioValidation', errors);
  console.warn(`${area} validation errors`, errors);
}

function renderValidationPanel(id, errors) {
  const el = document.getElementById(id);
  if (!el) return;
  const list = (errors || []).slice(0, 12).map(error => `<li>${esc(error)}</li>`).join('');
  el.className = `validation-panel visible ${errors.length ? 'fail' : 'ok'}`;
  el.innerHTML = errors.length
    ? `<strong>Needs attention</strong><ul>${list}</ul>${errors.length > 12 ? `<p>And ${errors.length - 12} more issues...</p>` : ''}`
    : '<strong>Validation passed</strong><p>No critical issues found.</p>';
}

function showValidationPanel(area) {
  if (area === 'portfolio') {
    const errors = validatePortfolioData(pfData);
    renderValidationPanel('portfolioValidation', errors);
    showToast(errors.length ? `${errors.length} portfolio issues found` : 'Portfolio looks good', errors.length ? 'fail' : 'ok');
    return;
  }
  const errors = validateProductsData(data);
  renderValidationPanel('productsValidation', errors);
  showToast(errors.length ? `${errors.length} product issues found` : 'Products look good', errors.length ? 'fail' : 'ok');
}

function renderChangeLog(id, entries = []) {
  const el = document.getElementById(id);
  if (!el) return;
  const recent = (entries || []).slice(0, 5);
  if (!recent.length) {
    el.className = 'admin-log-panel';
    el.innerHTML = '';
    return;
  }
  el.className = 'admin-log-panel visible';
  const target = id === 'portfolioChangeLog' ? 'portfolio' : 'products';
  el.innerHTML = `
    <details class="admin-log-details">
      <summary>
        <span>Журнал изменений</span>
        <em>${entries.length}</em>
      </summary>
      <div class="admin-log-head">
        <strong>Последние изменения</strong>
        <button class="btn-log-clear" type="button" onclick="clearChangeLog('${target}')">Очистить</button>
      </div>
      <div class="admin-log-list">
        ${recent.map(entry => `
          <div class="admin-log-item">
            <span>${esc(formatLogDate(entry.date))}</span>
            <b>${esc(entry.message || 'Updated')}</b>
          </div>
        `).join('')}
      </div>
    </details>`;
}

function formatLogDate(value) {
  if (!value) return 'Без даты';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function clearChangeLog(target) {
  if (target === 'portfolio') {
    if (!pfData) return;
    pfData.changeLog = [];
    renderChangeLog('portfolioChangeLog', pfData.changeLog);
  } else {
    if (!data) return;
    data.changeLog = [];
    renderChangeLog('productChangeLog', data.changeLog);
  }
  showToast('Журнал очищен. Нажми «Опубликовать», чтобы сохранить на сайте.', 'ok');
}

function addChangeLog(target, message) {
  target.changeLog = target.changeLog || [];
  target.changeLog.unshift({
    date: new Date().toISOString(),
    message
  });
  target.changeLog = target.changeLog.slice(0, 50);
}

function updatePriceHistory() {
  if (!originalData?.products || !data?.products) return;
  const date = new Date().toISOString().split('T')[0];
  data.products.forEach(product => {
    const previous = originalData.products.find(item => item.id === product.id);
    if (!previous) return;
    if (previous.mainPrice !== product.mainPrice) {
      product.priceHistory = product.priceHistory || [];
      product.priceHistory.unshift({
        date,
        from: previous.mainPrice || '',
        to: product.mainPrice || ''
      });
      product.priceHistory = product.priceHistory.slice(0, 24);
    }
    (product.variants || []).forEach((variant, index) => {
      const previousVariant = (previous.variants || [])[index];
      if (!previousVariant || previousVariant.price === variant.price) return;
      variant.priceHistory = variant.priceHistory || [];
      variant.priceHistory.unshift({
        date,
        from: previousVariant.price || '',
        to: variant.price || ''
      });
      variant.priceHistory = variant.priceHistory.slice(0, 24);
    });
  });
}

function openAnalytics() {
  window.open(ANALYTICS_URL, '_blank', 'noopener');
}

function saveLocalDraft() {
  const draft = {
    savedAt: new Date().toISOString(),
    data,
    pfData
  };
  localStorage.setItem('pologenkiAdminDraft', JSON.stringify(draft));
  showToast('Черновик сохранён в браузере', 'ok');
}

function loadLocalDraft() {
  const raw = localStorage.getItem('pologenkiAdminDraft');
  if (!raw) {
    showToast('Локальный черновик не найден', 'fail');
    return;
  }

  try {
    const draft = JSON.parse(raw);
    if (draft.data) {
      data = draft.data;
      renderGrid();
    }
    if (draft.pfData) {
      pfData = draft.pfData;
      renderPortfolioGrid();
    }
    showToast(`Черновик загружен: ${new Date(draft.savedAt).toLocaleString()}`, 'ok');
  } catch (error) {
    showToast('Не удалось загрузить черновик', 'fail');
  }
}

function rememberDeleted(type, item, index) {
  deletedStack.push({
    type,
    item: JSON.parse(JSON.stringify(item)),
    index,
    deletedAt: new Date().toISOString()
  });
  deletedStack = deletedStack.slice(-20);
  localStorage.setItem('pologenkiDeletedStack', JSON.stringify(deletedStack));
}

function loadDeletedStack() {
  try {
    deletedStack = JSON.parse(localStorage.getItem('pologenkiDeletedStack') || '[]');
  } catch (error) {
    deletedStack = [];
  }
}

function restoreDeleted() {
  if (!deletedStack.length) {
    showToast('Удалённых элементов для восстановления нет', 'fail');
    return;
  }

  const record = deletedStack.pop();
  localStorage.setItem('pologenkiDeletedStack', JSON.stringify(deletedStack));

  if (record.type === 'product') {
    if (!data?.products) {
      showToast('Сначала загрузи товары', 'fail');
      deletedStack.push(record);
      localStorage.setItem('pologenkiDeletedStack', JSON.stringify(deletedStack));
      return;
    }
    const index = Math.min(record.index, data.products.length);
    data.products.splice(index, 0, record.item);
    renderGrid();
    switchTab('products');
    showToast('Товар восстановлен', 'ok');
    return;
  }

  if (record.type === 'portfolio') {
    if (!pfData?.items) {
      showToast('Сначала открой вкладку портфолио', 'fail');
      deletedStack.push(record);
      localStorage.setItem('pologenkiDeletedStack', JSON.stringify(deletedStack));
      return;
    }
    const index = Math.min(record.index, pfData.items.length);
    pfData.items.splice(index, 0, record.item);
    renderPortfolioGrid();
    switchTab('portfolio');
    showToast('Проект восстановлен', 'ok');
  }
}

async function publishChanges() {
  const errors = validateProductsData(data);
  if (errors.length) {
    blockPublish(errors, 'Products');
    return;
  }

  const btn = document.getElementById('publishBtn');
  btn.disabled = true;
  setStatus('busy', 'Publishing...');
  data.lastUpdated = new Date().toISOString().split('T')[0];
  updatePriceHistory();
  addChangeLog(data, `Products updated: ${data.products.length} items`);

  try {
    setStatus('busy', 'Проверка актуальной версии...');
    sha = await getGitHubFileSha(PATH);

    const jsonStr = JSON.stringify(data, null, 2);
const bytes = new TextEncoder().encode(jsonStr);
const binStr = Array.from(bytes).map(b => String.fromCharCode(b)).join('');
const content = btoa(binStr);
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Update prices ${data.lastUpdated}`,
        content,
        sha,
        branch: BRANCH
      })
    });
    if (!r.ok) {
      const error = await r.json().catch(() => ({}));
      throw new Error(error.message || 'Не удалось опубликовать товары');
    }
    const json = await r.json();
    sha = json.content.sha;
    document.getElementById('pageMeta').textContent =
      `${data.products.length} products - Last updated: ${data.lastUpdated}`;
    document.getElementById('headerMeta').textContent =
      `Last updated: ${data.lastUpdated}`;
    originalData = JSON.parse(JSON.stringify(data));
    renderGrid();
    setStatus('ok', 'Published successfully');
    showToast('Опубликовано. Сайт обновится примерно через 2 минуты.', 'ok');
  } catch(e) {
    setStatus('err', e.message);
    showToast(e.message, 'fail');
  }
  btn.disabled = false;
}

function setStatus(type, text) {
  const d = document.getElementById('statusDot');
  d.className = 'status-dot' + (type==='busy'?' busy':type==='err'?' err':'');
  document.getElementById('statusText').textContent = text;
}

function showToast(msg, type='') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' '+type : '');
  setTimeout(() => t.className = 'toast', 3500);
}

window.onload = () => {
  const saved = sessionStorage.getItem('pg_tok');
  if (saved) { token = saved; enterAdmin(); }
};

// в”Ђв”Ђ TABS
function switchTab(name) {
  if (window.matchMedia('(max-width: 900px)').matches) closeAdminMenu();
  const labels = {
    dashboard: 'Обзор сайта',
    products: `Товары · ${data?.lastUpdated || 'загрузка'}`,
    prices: 'История и динамика цен',
    portfolio: 'Управление портфолио',
    analytics: 'Статистика Google Analytics'
  };
  document.querySelectorAll('[data-tab]').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === name);
  });
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('tab-' + name);
  if (!panel) return;
  panel.classList.add('active');
  panel.classList.remove('tab-entering');
  void panel.offsetWidth;
  panel.classList.add('tab-entering');
  window.setTimeout(() => panel.classList.remove('tab-entering'), 900);

  document.getElementById('headerMeta').textContent = labels[name] || 'Панель управления';
  document.getElementById('publishBtn').hidden = !['products', 'prices', 'portfolio'].includes(name);

  if (name === 'portfolio' && pfData === null) fetchPortfolio();
  if (name === 'dashboard') renderDashboard();
  if (name === 'prices') preparePricesTab();
  if (name === 'analytics') prepareAnalyticsTab();
}

function renderDashboard() {
  const products = data?.products || [];
  const projects = pfData?.items || [];
  const publishedProducts = products.filter(item => item.published !== false).length;
  const publishedProjects = projects.filter(item => item.published !== false).length;
  const productDrafts = products.length - publishedProducts;
  const projectDrafts = projects.length - publishedProjects;
  const missingProductTranslations = products.filter(item =>
    !item.name_ru || !item.name_cn || !item.desc_ru || !item.desc_cn || !item.origin_ru || !item.origin_cn
  ).length;
  const missingProjectTranslations = projects.filter(item =>
    !item.title_ru || !item.title_cn || !item.desc_ru || !item.desc_cn
  ).length;

  animateMetricValue('dashProducts', products.length);
  setDashboardText('dashProductsMeta', `${publishedProducts} опубликовано`);
  animateMetricValue('dashPortfolio', projects.length);
  setDashboardText('dashPortfolioMeta', `${publishedProjects} опубликовано`);
  animateMetricValue('dashTranslations', missingProductTranslations + missingProjectTranslations);
  animateMetricValue('dashDrafts', productDrafts + projectDrafts);
  setDashboardText('dashboardDate', `Данные сайта · ${data?.lastUpdated || 'без даты'}`);
  setDashboardText('dashProductReadinessText', `${publishedProducts} из ${products.length} опубликовано`);
  setDashboardText('dashPortfolioReadinessText', `${publishedProjects} из ${projects.length} опубликовано`);

  const productReadiness = products.length ? Math.round((publishedProducts / products.length) * 100) : 0;
  const portfolioReadiness = projects.length ? Math.round((publishedProjects / projects.length) * 100) : 0;
  const productBar = document.getElementById('dashProductReadiness');
  const portfolioBar = document.getElementById('dashPortfolioReadiness');
  if (productBar) {
    productBar.style.width = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => { productBar.style.width = `${productReadiness}%`; }));
  }
  if (portfolioBar) {
    portfolioBar.style.width = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => { portfolioBar.style.width = `${portfolioReadiness}%`; }));
  }

  const rawActivity = [
    ...((data?.changeLog || []).map(entry => ({ source: 'Товары', entry }))),
    ...((pfData?.changeLog || []).map(entry => ({ source: 'Портфолио', entry })))
  ].slice(-6).reverse();
  const activity = document.getElementById('dashboardActivity');
  if (activity && !rawActivity.length) {
    activity.innerHTML = `<p class="dashboard-empty">Изменений пока нет. Новые публикации появятся здесь.</p>`;
  } else if (activity) {
    activity.innerHTML = rawActivity.map(item => {
      const normalized = normalizeChangeLogEntry(item.entry, item.source);
      return `<div class="dashboard-activity-item"><span>${esc(normalized.date)}</span><strong>${esc(normalized.message)}</strong></div>`;
    }).join('');
  }

  const priceList = document.getElementById('dashboardPriceList');
  if (priceList) {
    priceList.innerHTML = products.slice(0, 5).map((product, index) => `
      <div class="dashboard-price-row" onclick="switchTab('prices');selectPriceProduct(${index})">
        <img src="${esc(adminImageSrc(product.image))}" alt="">
        <span>${esc(product.name || `Товар ${index + 1}`)}</span>
        <strong>${esc(product.mainPrice || 'По запросу')}</strong>
      </div>`).join('') || '<p class="dashboard-empty">Товары пока не добавлены.</p>';
  }

  const qualityList = document.getElementById('dashboardQualityList');
  if (qualityList) {
    const missingImages = products.filter(item => !item.image).length + projects.filter(item => !item.img).length;
    const requestPrices = products.filter(item => parsePriceValue(item.mainPrice) === null).length;
    const qualityItems = [
      { type: 'translations', icon: 'RU', title: 'Переводы', hint: 'Незаполненные RU/CN поля', value: missingProductTranslations + missingProjectTranslations },
      { type: 'drafts', icon: 'DR', title: 'Черновики', hint: 'Скрыты от посетителей', value: productDrafts + projectDrafts },
      { type: 'images', icon: 'PH', title: 'Фотографии', hint: 'Карточки без изображения', value: missingImages },
      { type: 'prices', icon: '$', title: 'Цена по запросу', hint: 'Без числовой цены', value: requestPrices }
    ];
    qualityList.innerHTML = qualityItems.map(item => `
      <div class="dashboard-quality-item" role="button" tabindex="0" onclick="openDashboardIssue('${item.type}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openDashboardIssue('${item.type}')}">
        <span class="dashboard-quality-icon">${esc(item.icon)}</span>
        <span class="dashboard-quality-copy"><strong>${esc(item.title)}</strong><small>${esc(item.hint)}</small></span>
        <span class="dashboard-quality-value">${item.value}</span>
      </div>`).join('');
  }
}

function setDashboardText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = String(value);
}

function animateMetricValue(id, target) {
  const element = document.getElementById(id);
  if (!element) return;
  const end = Number(target) || 0;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.textContent = String(end);
    return;
  }
  const startedAt = performance.now();
  const duration = 650;
  const tick = now => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(end * eased));
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function normalizeChangeLogEntry(entry, fallbackSource) {
  let value = entry;
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch (_) { value = { message: value }; }
  }
  const rawDate = value?.date || value?.timestamp || '';
  const date = String(rawDate).match(/\d{4}-\d{2}-\d{2}/)?.[0] || fallbackSource;
  let message = value?.message || value?.text || '';
  if (!message && value && typeof value === 'object') {
    const items = value.items ?? value.count;
    message = items !== undefined ? `${fallbackSource}: обновлено ${items}` : `${fallbackSource}: данные обновлены`;
  }
  message = String(message || `${fallbackSource}: данные обновлены`)
    .replace(/^Products updated:/i, 'Товары обновлены:')
    .replace(/^Portfolio updated:/i, 'Портфолио обновлено:')
    .replace(/items?$/i, 'позиций');
  return { date, message };
}

function productHasIssue(product, type) {
  if (type === 'translations') return !product.name_ru || !product.name_cn || !product.desc_ru || !product.desc_cn || !product.origin_ru || !product.origin_cn;
  if (type === 'drafts') return product.published === false;
  if (type === 'images') return !String(product.image || '').trim();
  if (type === 'prices') return parsePriceValue(product.mainPrice) === null;
  return true;
}

function portfolioHasIssue(item, type) {
  if (type === 'translations') return !item.title_ru || !item.title_cn || !item.desc_ru || !item.desc_cn;
  if (type === 'drafts') return item.published === false;
  if (type === 'images') return !String(item.img || '').trim();
  return true;
}

function openDashboardIssue(type) {
  if (type === 'products' || type === 'portfolio') {
    clearDashboardIssueFilter(false);
    switchTab(type);
    return;
  }
  const productCount = (data?.products || []).filter(item => productHasIssue(item, type)).length;
  const portfolioCount = (pfData?.items || []).filter(item => portfolioHasIssue(item, type)).length;
  const targetTab = productCount ? 'products' : portfolioCount ? 'portfolio' : '';
  if (!targetTab) {
    showToast('Проблем этого типа не найдено.', 'ok');
    return;
  }
  openDashboardIssueForTab(type, targetTab);
}

function openDashboardIssueForTab(type, tab) {
  dashboardIssueFilter = { type, tab };
  const search = document.getElementById(tab === 'products' ? 'productSearch' : 'portfolioSearch');
  if (search) search.value = '';
  if (tab === 'products') {
    const category = document.getElementById('productCategoryFilter');
    if (category) category.value = '';
  }
  const status = document.getElementById(tab === 'products' ? 'productStatusFilter' : 'portfolioStatusFilter');
  if (status) status.value = 'all';
  switchTab(tab);
  if (tab === 'products') renderGrid();
  else renderPortfolioGrid();
  window.setTimeout(() => {
    const selector = tab === 'products' ? '#productsGrid .product-list-card' : '#portfolioGrid .portfolio-card';
    const first = document.querySelector(selector);
    if (first) {
      first.open = true;
      first.classList.add('issue-focus');
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => first.classList.remove('issue-focus'), 1800);
    }
  }, 120);
}

function renderDashboardIssueNotice(tab) {
  if (!dashboardIssueFilter || dashboardIssueFilter.tab !== tab) return;
  const type = dashboardIssueFilter.type;
  const panel = document.getElementById(tab === 'products' ? 'productsValidation' : 'portfolioValidation');
  if (!panel) return;
  const labels = {
    translations: 'Показаны позиции с незаполненными RU/CN-полями.',
    drafts: 'Показаны черновики, которые сейчас скрыты на сайте.',
    images: 'Показаны позиции без фотографии.',
    prices: 'Показаны товары без числовой цены.'
  };
  const productCount = (data?.products || []).filter(item => productHasIssue(item, type)).length;
  const portfolioCount = (pfData?.items || []).filter(item => portfolioHasIssue(item, type)).length;
  const otherTab = tab === 'products' ? 'portfolio' : 'products';
  const otherCount = otherTab === 'products' ? productCount : portfolioCount;
  panel.className = 'validation-panel visible issue-navigation';
  panel.innerHTML = `<div><strong>${esc(labels[type] || 'Показаны проблемные позиции.')}</strong><small>Исправьте поля и опубликуйте изменения.</small></div>
    <div class="issue-navigation-actions">
      ${otherCount && type !== 'prices' ? `<button type="button" onclick="openDashboardIssueForTab('${type}','${otherTab}')">${otherTab === 'products' ? 'Товары' : 'Проекты'} · ${otherCount}</button>` : ''}
      <button type="button" onclick="clearDashboardIssueFilter()">Показать всё</button>
    </div>`;
}

function clearDashboardIssueFilter(rerender = true) {
  dashboardIssueFilter = null;
  ['productsValidation', 'portfolioValidation'].forEach(id => {
    const panel = document.getElementById(id);
    if (panel?.classList.contains('issue-navigation')) {
      panel.className = 'validation-panel';
      panel.innerHTML = '';
    }
  });
  if (!rerender) return;
  if (document.getElementById('tab-products')?.classList.contains('active')) renderGrid();
  if (document.getElementById('tab-portfolio')?.classList.contains('active')) renderPortfolioGrid();
}

function parsePriceValue(value) {
  const match = String(value || '').replace(',', '.').match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function formatPriceNumber(value) {
  return Number.isFinite(value)
    ? `${value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD/kg`
    : 'По запросу';
}

function buildPriceSeries(item, currentPrice) {
  const history = Array.isArray(item?.priceHistory) ? [...item.priceHistory].reverse() : [];
  const points = [];
  history.forEach((entry, index) => {
    const from = parsePriceValue(entry.from);
    const to = parsePriceValue(entry.to);
    if (!points.length && from !== null) points.push({ date: entry.date || '', value: from, label: entry.from, kind: 'from' });
    if (to !== null) points.push({ date: entry.date || '', value: to, label: entry.to, kind: 'to', index });
  });
  const current = parsePriceValue(currentPrice);
  if (current !== null && (!points.length || points.at(-1).value !== current)) {
    points.push({ date: data?.lastUpdated || new Date().toISOString().slice(0,10), value: current, label: currentPrice, kind: 'current' });
  }
  if (current !== null && !points.length) {
    points.push({ date: data?.lastUpdated || new Date().toISOString().slice(0,10), value: current, label: currentPrice, kind: 'current' });
  }
  return points;
}

function getPriceEntries() {
  const entries = [];
  (data?.products || []).forEach((product, productIndex) => {
    const productId = product.id || `product-${productIndex}`;
    entries.push({
      key: `product:${productId}`,
      selectValue: `product:${productIndex}`,
      productIndex,
      variantIndex: null,
      type: 'product',
      product,
      item: product,
      label: product.name || `Товар ${productIndex + 1}`,
      parentLabel: '',
      price: product.mainPrice || '',
      image: product.image || ''
    });
    (product.variants || []).forEach((variant, variantIndex) => {
      entries.push({
        key: `variant:${productId}:${variantIndex}`,
        selectValue: `variant:${productIndex}:${variantIndex}`,
        productIndex,
        variantIndex,
        type: 'variant',
        product,
        item: variant,
        label: variant.name || `Сорт ${variantIndex + 1}`,
        parentLabel: product.name || `Товар ${productIndex + 1}`,
        price: variant.price || '',
        image: product.image || ''
      });
    });
  });
  return entries;
}

function getSelectedPriceEntry() {
  const select = document.getElementById('priceProductSelect');
  const entries = getPriceEntries();
  return entries.find(entry => entry.selectValue === select?.value) || entries[0] || null;
}

function preparePricesTab() {
  const select = document.getElementById('priceProductSelect');
  const entries = getPriceEntries();
  if (!select) return;
  const previousValue = select.value;
  select.innerHTML = entries.map(entry =>
    `<option value="${entry.selectValue}">${entry.type === 'variant' ? '↳ ' : ''}${esc(entry.type === 'variant' ? `${entry.parentLabel} / ${entry.label}` : entry.label)}</option>`
  ).join('');
  if (entries.some(entry => entry.selectValue === previousValue)) select.value = previousValue;
  renderPriceDashboard();
}

function renderPriceDashboard() {
  const entries = getPriceEntries();
  const select = document.getElementById('priceProductSelect');
  if (!select || !entries.length) return;
  const selected = getSelectedPriceEntry();
  if (!selected) return;
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  const changedRecently = entries.filter(entry => (entry.item.priceHistory || []).some(historyItem => {
    const time = Date.parse(historyItem.date);
    return Number.isFinite(time) && now - time <= thirtyDays;
  })).length;
  const tracked = entries.filter(entry => parsePriceValue(entry.price) !== null).length;

  animateMetricValue('priceTrackedCount', tracked);
  animateMetricValue('priceChangedCount', changedRecently);
  setDashboardText('priceUpdatedDate', data?.lastUpdated || '-');
  animateMetricValue('priceRequestCount', entries.length - tracked);
  setDashboardText('priceChartTitle', selected.type === 'variant' ? `${selected.parentLabel} / ${selected.label}` : selected.label);
  setDashboardText('priceCurrentValue', selected.price || 'По запросу');

  const historyList = document.getElementById('priceHistoryList');
  const history = Array.isArray(selected.item.priceHistory) ? selected.item.priceHistory : [];
  historyList.innerHTML = history.length ? history.map(entry => {
    const from = parsePriceValue(entry.from);
    const to = parsePriceValue(entry.to);
    const delta = from !== null && to !== null ? ((to - from) / from) * 100 : null;
    const deltaClass = delta === null || delta === 0 ? 'price-delta-flat' : delta > 0 ? 'price-delta-up' : 'price-delta-down';
    const deltaText = delta === null ? 'изменено' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`;
    return `<div class="price-history-row"><time>${esc(entry.date || '-')}</time><span>${esc(entry.from || '-')} → ${esc(entry.to || '-')}</span><strong class="${deltaClass}">${deltaText}</strong></div>`;
  }).join('') : '<p class="dashboard-empty">История появится здесь после первой публикации изменённой цены.</p>';

  const overview = document.getElementById('priceOverviewTable');
  overview.innerHTML = entries.map(entry => {
    const latest = Array.isArray(entry.item.priceHistory) ? entry.item.priceHistory[0] : null;
    const from = parsePriceValue(latest?.from);
    const to = parsePriceValue(latest?.to);
    const delta = from !== null && to !== null ? ((to - from) / from) * 100 : null;
    const deltaClass = delta === null || delta === 0 ? 'price-delta-flat' : delta > 0 ? 'price-delta-up' : 'price-delta-down';
    const deltaText = delta === null ? 'без изменений' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`;
    const rowClass = `${entry.type === 'variant' ? ' is-variant' : ''}${entry.key === selected.key ? ' is-selected' : ''}`;
    return `<div class="price-overview-row${rowClass}" onclick="selectPriceEntry('${entry.selectValue}')">
      <div class="price-product-cell">
        <img src="${esc(adminImageSrc(entry.image))}" alt="">
        <div class="price-product-cell-copy"><strong>${esc(entry.label)}</strong>${entry.parentLabel ? `<small>${esc(entry.parentLabel)}</small>` : ''}</div>
      </div>
      <span><b>${esc(entry.price || 'По запросу')}</b></span>
      <span>${esc(latest?.date || data?.lastUpdated || '-')}</span>
      <span class="${deltaClass}">${deltaText}</span>
    </div>`;
  }).join('');

  const privateEntry = privatePriceLedger.entries[selected.key];
  drawPriceHistoryChart(
    buildPriceSeries(selected.item, selected.price),
    buildPrivatePriceSeries(privateEntry)
  );
  renderPrivatePricePanel(selected);
}

function selectPriceEntry(value) {
  const select = document.getElementById('priceProductSelect');
  if (!select) return;
  select.value = value;
  renderPriceDashboard();
  document.getElementById('tab-prices')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function loadPrivatePriceLedger() {
  try {
    const saved = JSON.parse(localStorage.getItem(PRIVATE_PRICE_KEY) || 'null');
    if (saved && saved.entries && typeof saved.entries === 'object') privatePriceLedger = saved;
  } catch (error) {
    privatePriceLedger = { version: 1, entries: {} };
  }
}

function persistPrivatePriceLedger() {
  localStorage.setItem(PRIVATE_PRICE_KEY, JSON.stringify(privatePriceLedger));
}

function getPrivatePriceKey(productIndex, variantIndex = null) {
  const product = data?.products?.[productIndex];
  const productId = product?.id || `product-${productIndex}`;
  return variantIndex === null
    ? `product:${productId}`
    : `variant:${productId}:${variantIndex}`;
}

function getPrivateCostValue(productIndex, variantIndex = null) {
  return privatePriceLedger.entries[getPrivatePriceKey(productIndex, variantIndex)]?.current || '';
}

function getPrivateMarginText(productIndex, variantIndex, saleValue) {
  const cost = parsePriceValue(getPrivateCostValue(productIndex, variantIndex));
  const sale = parsePriceValue(saleValue);
  if (cost === null) return 'Закупочная цена не заполнена';
  if (sale === null || cost <= 0) return 'Добавьте числовую цену продажи';
  const profit = sale - cost;
  const markup = (profit / cost) * 100;
  return `Прибыль ${formatPriceNumber(profit)} · наценка ${markup.toFixed(1)}%`;
}

function savePrivatePriceRecord(key, value, label = '', parentLabel = '') {
  const numeric = parsePriceValue(value);
  if (numeric === null) return null;
  const normalized = formatPriceNumber(numeric);
  const previous = privatePriceLedger.entries[key] || { history: [] };
  if (previous.current !== normalized) {
    previous.history = Array.isArray(previous.history) ? previous.history : [];
    previous.history.unshift({
      date: new Date().toISOString().slice(0,10),
      from: previous.current || '',
      to: normalized
    });
    previous.history = previous.history.slice(0, 36);
  }
  previous.current = normalized;
  previous.updatedAt = new Date().toISOString().slice(0,10);
  previous.label = label;
  previous.parentLabel = parentLabel;
  privatePriceLedger.entries[key] = previous;
  persistPrivatePriceLedger();
  return normalized;
}

function savePrivateCostInline(productIndex, variantIndex, input) {
  const value = input?.value.trim() || '';
  if (!value) {
    input.value = getPrivateCostValue(productIndex, variantIndex);
    updateInlinePrivateMargin(productIndex, variantIndex);
    return;
  }
  const product = data?.products?.[productIndex];
  const variant = variantIndex === null ? null : product?.variants?.[variantIndex];
  const normalized = savePrivatePriceRecord(
    getPrivatePriceKey(productIndex, variantIndex),
    value,
    variant?.name || product?.name || '',
    variant ? product?.name || '' : ''
  );
  if (!normalized) {
    showToast('Введите числовую закупочную цену', 'fail');
    input.focus();
    return;
  }
  input.value = normalized;
  updateInlinePrivateMargin(productIndex, variantIndex);
  showToast('Закупочная цена сохранена приватно', 'ok');
}

function updateInlinePrivateMargin(productIndex, variantIndex = null) {
  const product = data?.products?.[productIndex];
  const saleValue = variantIndex === null
    ? product?.mainPrice
    : product?.variants?.[variantIndex]?.price;
  const suffix = variantIndex === null ? 'main' : variantIndex;
  const target = document.getElementById(`private-margin-${productIndex}-${suffix}`);
  if (target) target.textContent = getPrivateMarginText(productIndex, variantIndex, saleValue);
}

function buildPrivatePriceSeries(entry) {
  if (!entry) return [];
  const history = Array.isArray(entry.history) ? [...entry.history].reverse() : [];
  const points = [];
  history.forEach(item => {
    const from = parsePriceValue(item.from);
    const to = parsePriceValue(item.to);
    if (!points.length && from !== null) points.push({ date: item.date || '', value: from });
    if (to !== null) points.push({ date: item.date || '', value: to });
  });
  const current = parsePriceValue(entry.current);
  if (current !== null && (!points.length || points.at(-1).value !== current)) {
    points.push({ date: entry.updatedAt || new Date().toISOString().slice(0,10), value: current });
  }
  return points;
}

function renderPrivatePricePanel(selected) {
  const record = privatePriceLedger.entries[selected.key] || null;
  const sale = parsePriceValue(selected.price);
  const cost = parsePriceValue(record?.current);
  const profit = sale !== null && cost !== null ? sale - cost : null;
  const markup = cost !== null && cost > 0 && profit !== null ? (profit / cost) * 100 : null;
  setDashboardText('privateSaleValue', sale !== null ? formatPriceNumber(sale) : 'По запросу');
  setDashboardText('privateCostValue', cost !== null ? formatPriceNumber(cost) : 'Не указана');
  setDashboardText('privateProfitValue', profit !== null ? formatPriceNumber(profit) : '-');
  setDashboardText('privateMarkupValue', markup !== null ? `${markup.toFixed(1)}%` : '-');
  const history = document.getElementById('privatePriceHistory');
  const items = Array.isArray(record?.history) ? record.history : [];
  history.innerHTML = items.length
    ? items.map(item => `<div class="private-price-history-item"><time>${esc(item.date || '-')}</time><strong>${esc(item.from || 'не указана')} → ${esc(item.to || '-')}</strong></div>`).join('')
    : '<p class="dashboard-empty">История закупочной цены пока пуста.</p>';
}

function removePrivateCost() {
  const selected = getSelectedPriceEntry();
  if (!selected || !privatePriceLedger.entries[selected.key]) {
    showToast('Для этой позиции нет приватной цены', 'fail');
    return;
  }
  delete privatePriceLedger.entries[selected.key];
  persistPrivatePriceLedger();
  renderPriceDashboard();
  showToast('Приватная закупочная цена удалена', 'ok');
}

function exportPrivatePrices() {
  const payload = JSON.stringify({ ...privatePriceLedger, exportedAt: new Date().toISOString() }, null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `pologenki-private-prices-${new Date().toISOString().slice(0,10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast('Приватная база экспортирована', 'ok');
}

async function importPrivatePrices(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    if (!imported?.entries || typeof imported.entries !== 'object') throw new Error('Некорректный файл');
    privatePriceLedger = { version: 1, entries: imported.entries };
    persistPrivatePriceLedger();
    renderPriceDashboard();
    showToast('Приватная база импортирована', 'ok');
  } catch (error) {
    showToast('Не удалось импортировать приватную базу', 'fail');
  }
}

function drawPriceHistoryChart(points, privatePoints = []) {
  const canvas = document.getElementById('priceHistoryChart');
  const empty = document.getElementById('priceChartEmpty');
  if (!canvas || !empty) return;
  const context = canvas.getContext('2d');
  const cssWidth = Math.max(canvas.clientWidth, 320);
  const cssHeight = 250;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = cssWidth * ratio;
  canvas.height = cssHeight * ratio;
  context.scale(ratio, ratio);
  context.clearRect(0, 0, cssWidth, cssHeight);

  if (!points.length && !privatePoints.length) {
    empty.hidden = false;
    empty.textContent = 'Для этого товара указана цена по запросу. Числовой график пока недоступен.';
    return;
  }
  empty.hidden = true;
  const padding = { top: 22, right: 18, bottom: 34, left: 48 };
  const chartWidth = cssWidth - padding.left - padding.right;
  const chartHeight = cssHeight - padding.top - padding.bottom;
  const values = [...points, ...privatePoints].map(point => point.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  const spread = max - min || Math.max(max * .08, .5);
  min -= spread * .22;
  max += spread * .22;
  const xAt = (index, length) => padding.left + (length === 1 ? chartWidth / 2 : (index / (length - 1)) * chartWidth);
  const yAt = value => padding.top + chartHeight - ((value - min) / (max - min)) * chartHeight;

  context.strokeStyle = '#e6ecef';
  context.lineWidth = 1;
  context.fillStyle = '#8a98a5';
  context.font = '10px Jost, sans-serif';
  context.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartHeight / 4) * i;
    const value = max - ((max - min) / 4) * i;
    context.beginPath(); context.moveTo(padding.left, y); context.lineTo(cssWidth - padding.right, y); context.stroke();
    context.fillText(value.toFixed(2), padding.left - 8, y + 3);
  }

  if (points.length > 1) {
    const gradient = context.createLinearGradient(0, padding.top, 0, cssHeight - padding.bottom);
    gradient.addColorStop(0, 'rgba(17,17,17,.14)');
    gradient.addColorStop(1, 'rgba(17,17,17,0)');
    context.beginPath();
    points.forEach((point, index) => index ? context.lineTo(xAt(index, points.length), yAt(point.value)) : context.moveTo(xAt(index, points.length), yAt(point.value)));
    context.lineTo(xAt(points.length - 1, points.length), cssHeight - padding.bottom);
    context.lineTo(xAt(0, points.length), cssHeight - padding.bottom);
    context.closePath(); context.fillStyle = gradient; context.fill();
  }

  const drawSeries = (series, color) => {
    if (!series.length) return;
    context.beginPath();
    series.forEach((point, index) => index
      ? context.lineTo(xAt(index, series.length), yAt(point.value))
      : context.moveTo(xAt(index, series.length), yAt(point.value)));
    context.strokeStyle = color; context.lineWidth = 2.5; context.stroke();
    series.forEach((point, index) => {
      context.beginPath(); context.arc(xAt(index, series.length), yAt(point.value), 4, 0, Math.PI * 2);
      context.fillStyle = '#fff'; context.fill(); context.strokeStyle = color; context.lineWidth = 2; context.stroke();
    });
  };
  drawSeries(points, '#2A2A2A');
  drawSeries(privatePoints, '#85C1F4');

  context.fillStyle = '#8a98a5'; context.font = '10px Jost, sans-serif';
  const datePoints = points.length ? points : privatePoints;
  context.textAlign = 'left'; context.fillText(datePoints[0].date || '', padding.left, cssHeight - 8);
  context.textAlign = 'right'; context.fillText(datePoints.at(-1).date || '', cssWidth - padding.right, cssHeight - 8);
  replayChartAnimation(canvas);
}

function replayChartAnimation(canvas) {
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  canvas.classList.remove('chart-drawing');
  void canvas.offsetWidth;
  canvas.classList.add('chart-drawing');
}

function prepareAnalyticsTab() {
  const input = document.getElementById('gaClientId');
  if (input && !input.value) input.value = localStorage.getItem(GA_CLIENT_ID_KEY) || '';
  if (gaAccessToken) loadAnalyticsDashboard();
}

function setGaStatus(message, state = '') {
  const status = document.getElementById('gaConnectStatus');
  if (!status) return;
  status.textContent = message;
  status.className = state ? `is-${state}` : '';
}

function connectGoogleAnalytics() {
  const clientId = document.getElementById('gaClientId')?.value.trim() || '';
  if (!clientId.endsWith('.apps.googleusercontent.com')) {
    setGaStatus('Введите корректный OAuth Client ID из Google Cloud.', 'error');
    return;
  }
  if (!window.google?.accounts?.oauth2) {
    setGaStatus('Сервис входа Google ещё загружается. Повторите через несколько секунд.', 'error');
    return;
  }

  localStorage.setItem(GA_CLIENT_ID_KEY, clientId);
  setGaStatus('Открываю безопасный вход Google...', 'loading');
  gaTokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: GA_SCOPE,
    callback: async response => {
      if (response.error) {
        setGaStatus(`Google не предоставил доступ: ${response.error}`, 'error');
        return;
      }
      gaAccessToken = response.access_token || '';
      setGaStatus('Analytics подключён. Загружаю статистику...', 'success');
      await loadAnalyticsDashboard();
    }
  });
  gaTokenClient.requestAccessToken({ prompt: gaAccessToken ? '' : 'consent' });
}

async function runGaReport(body) {
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY_ID}:runReport`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${gaAccessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (response.status === 401) {
    gaAccessToken = '';
    throw new Error('Сессия Google закончилась. Подключите Analytics ещё раз.');
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.message || 'Не удалось получить данные GA4.');
  }
  return response.json();
}

async function loadAnalyticsDashboard() {
  if (!gaAccessToken) return;
  const startDate = document.getElementById('gaDateRange')?.value || '30daysAgo';
  const dateRanges = [{ startDate, endDate: 'today' }];
  setGaStatus('Обновляю данные GA4...', 'loading');

  try {
    const [summary, trend, channels, pages, countries, actions] = await Promise.all([
      runGaReport({
        dateRanges,
        metrics: [
          { name: 'activeUsers' }, { name: 'newUsers' },
          { name: 'sessions' }, { name: 'screenPageViews' }
        ]
      }),
      runGaReport({
        dateRanges,
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }]
      }),
      runGaReport({
        dateRanges,
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
        limit: 7,
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
      }),
      runGaReport({
        dateRanges,
        dimensions: [{ name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }],
        limit: 6,
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }]
      }),
      runGaReport({
        dateRanges,
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }],
        limit: 7,
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }]
      }),
      runGaReport({
        dateRanges,
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            inListFilter: {
              values: ['click_whatsapp', 'click_telegram', 'click_email', 'click_phone', 'submit_contact_form', 'click_request_quote', 'open_product_modal']
            }
          }
        },
        limit: 10,
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }]
      })
    ]);

    const totals = summary.rows?.[0]?.metricValues || [];
    setDashboardText('gaActiveUsers', formatGaNumber(totals[0]?.value));
    setDashboardText('gaNewUsers', formatGaNumber(totals[1]?.value));
    setDashboardText('gaSessions', formatGaNumber(totals[2]?.value));
    setDashboardText('gaViews', formatGaNumber(totals[3]?.value));

    gaTrendRows = trend.rows || [];
    renderGaBars('gaChannels', channels.rows, 0, 0, translateChannelName);
    renderGaList('gaPages', pages.rows, 0, 0);
    renderGaBars('gaCountries', countries.rows, 0, 0);
    renderGaList('gaActions', actions.rows, 0, 0, translateActionName);
    document.getElementById('analyticsDashboard').hidden = false;
    document.getElementById('gaConnectCard').classList.add('is-connected');
    drawGaTrendChart();
    setGaStatus(`Данные обновлены: ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`, 'success');
  } catch (error) {
    document.getElementById('analyticsDashboard').hidden = true;
    setGaStatus(error.message, 'error');
  }
}

function formatGaNumber(value) {
  return Number(value || 0).toLocaleString('ru-RU');
}

function renderGaBars(id, rows = [], dimensionIndex = 0, metricIndex = 0, labelFormatter = value => value) {
  const container = document.getElementById(id);
  if (!container) return;
  if (!rows?.length) {
    container.innerHTML = `<p class="dashboard-empty">За этот период данных нет.</p>`;
    return;
  }
  const max = Math.max(...rows.map(row => Number(row.metricValues?.[metricIndex]?.value || 0)), 1);
  container.innerHTML = rows.map(row => {
    const label = labelFormatter(row.dimensionValues?.[dimensionIndex]?.value || 'Не определено');
    const value = Number(row.metricValues?.[metricIndex]?.value || 0);
    const width = Math.max(3, Math.round((value / max) * 100));
    return `<div class="analytics-bar"><div class="analytics-bar-head"><span>${esc(label)}</span><strong>${formatGaNumber(value)}</strong></div><div class="analytics-bar-track"><i style="width:${width}%"></i></div></div>`;
  }).join('');
}

function renderGaList(id, rows = [], dimensionIndex = 0, metricIndex = 0, labelFormatter = value => value) {
  const container = document.getElementById(id);
  if (!container) return;
  if (!rows?.length) {
    container.innerHTML = `<p class="dashboard-empty">За этот период данных нет.</p>`;
    return;
  }
  container.innerHTML = rows.map(row => {
    const label = labelFormatter(row.dimensionValues?.[dimensionIndex]?.value || 'Не определено');
    const value = row.metricValues?.[metricIndex]?.value || '0';
    return `<div class="analytics-list-item"><span title="${esc(label)}">${esc(label)}</span><strong>${formatGaNumber(value)}</strong></div>`;
  }).join('');
}

function translateChannelName(value) {
  const names = {
    'Direct': 'Прямые заходы',
    'Organic Search': 'Органический поиск',
    'Organic Social': 'Социальные сети',
    'Referral': 'Переходы с сайтов',
    'Unassigned': 'Не определено',
    'Email': 'Email'
  };
  return names[value] || value;
}

function translateActionName(value) {
  const names = {
    click_whatsapp: 'Нажатия WhatsApp',
    click_telegram: 'Нажатия Telegram',
    click_email: 'Нажатия Email',
    click_phone: 'Нажатия телефона',
    submit_contact_form: 'Отправленные формы',
    click_request_quote: 'Запросы предложения',
    open_product_modal: 'Открытия товаров'
  };
  return names[value] || value;
}

function drawGaTrendChart() {
  const canvas = document.getElementById('gaTrendChart');
  if (!canvas || !gaTrendRows.length || document.getElementById('analyticsDashboard')?.hidden) return;
  const context = canvas.getContext('2d');
  const cssWidth = Math.max(280, canvas.clientWidth || 700);
  const cssHeight = window.innerWidth <= 760 ? 190 : 240;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(cssWidth * ratio);
  canvas.height = Math.round(cssHeight * ratio);
  canvas.style.height = `${cssHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, cssWidth, cssHeight);

  const padding = { left: 34, right: 12, top: 14, bottom: 28 };
  const chartWidth = cssWidth - padding.left - padding.right;
  const chartHeight = cssHeight - padding.top - padding.bottom;
  const values = gaTrendRows.flatMap(row => row.metricValues.map(item => Number(item.value || 0)));
  const maxValue = Math.max(...values, 1);

  context.strokeStyle = '#e7edf1';
  context.lineWidth = 1;
  context.fillStyle = '#8a98a5';
  context.font = '10px Jost, sans-serif';
  context.textAlign = 'right';
  for (let index = 0; index <= 4; index += 1) {
    const y = padding.top + (chartHeight / 4) * index;
    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(cssWidth - padding.right, y);
    context.stroke();
    context.fillText(String(Math.round(maxValue - (maxValue / 4) * index)), padding.left - 7, y + 3);
  }

  const drawLine = (metricIndex, color) => {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    gaTrendRows.forEach((row, index) => {
      const x = padding.left + (gaTrendRows.length === 1 ? chartWidth / 2 : (chartWidth / (gaTrendRows.length - 1)) * index);
      const value = Number(row.metricValues?.[metricIndex]?.value || 0);
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();
  };
  drawLine(1, '#9aa8b3');
  drawLine(0, '#111111');

  const formatDate = raw => raw?.length === 8 ? `${raw.slice(6, 8)}.${raw.slice(4, 6)}` : raw;
  context.fillStyle = '#8a98a5';
  context.font = '10px Jost, sans-serif';
  context.textAlign = 'left';
  context.fillText(formatDate(gaTrendRows[0]?.dimensionValues?.[0]?.value), padding.left, cssHeight - 7);
  context.textAlign = 'right';
  context.fillText(formatDate(gaTrendRows.at(-1)?.dimensionValues?.[0]?.value), cssWidth - padding.right, cssHeight - 7);
  replayChartAnimation(canvas);
}

window.addEventListener('resize', () => {
  if (gaAccessToken) drawGaTrendChart();
  if (document.getElementById('tab-prices')?.classList.contains('active')) renderPriceDashboard();
});

// в”Ђв”Ђ PORTFOLIO DATA
const PF_PATH = 'public/data/portfolio.json';
let pfData = null, pfSha = '';
let pfOriginalData = null;

async function fetchPortfolio() {
  setStatus('busy', 'Loading portfolio...');
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${PF_PATH}`, {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
    });
    if (r.status === 404) {
      // Create an empty portfolio file if it does not exist yet.
      pfData = { items: [], lastUpdated: '' };
      pfOriginalData = JSON.parse(JSON.stringify(pfData));
      pfSha = '';
      renderPortfolioGrid();
      setStatus('ok', 'Ready (new portfolio file will be created on publish)');
      return;
    }
    if (!r.ok) throw new Error('Failed to load portfolio.json');
    const json = await r.json();
    pfSha = json.sha;
    const binary = atob(json.content.replace(/\n/g,''));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    pfData = JSON.parse(new TextDecoder('utf-8').decode(bytes));
    if (!pfData.items) pfData.items = [];
    normalizeLocalizedFields();
    pfOriginalData = JSON.parse(JSON.stringify(pfData));
    renderPortfolioGrid();
    setStatus('ok', 'Ready');
  } catch(e) {
    setStatus('err', e.message);
    showToast(e.message, 'fail');
  }
}

function renderPortfolioGrid() {
  const grid = document.getElementById('portfolioGrid');
  const meta = document.getElementById('pfMeta');
  if (!pfData || !Array.isArray(pfData.items)) {
    pfData = { items: [], lastUpdated: '' };
  }
  const search = (document.getElementById('portfolioSearch')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('portfolioStatusFilter')?.value || 'all';
  const entries = pfData.items
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => {
      const haystack = [
        item.title, item.title_ru, item.title_cn,
        item.desc, item.desc_ru, item.desc_cn, item.img
      ].join(' ').toLowerCase();
      const isPublished = item.published !== false;
      const matchesSearch = !search || haystack.includes(search);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && isPublished) ||
        (statusFilter === 'draft' && !isPublished);
      const matchesIssue = !dashboardIssueFilter || dashboardIssueFilter.tab !== 'portfolio' || portfolioHasIssue(item, dashboardIssueFilter.type);
      return matchesSearch && matchesStatus && matchesIssue;
    });
  meta.textContent = `${entries.length}/${pfData.items.length} items${pfData.lastUpdated ? ' - Last updated: ' + pfData.lastUpdated : ''}`;
  const publishedCount = pfData.items.filter(item => item.published !== false).length;
  const missingCnCount = pfData.items.filter(item => item.published !== false && (!item.title_cn || !item.desc_cn)).length;
  renderStats('portfolioStats', [
    { value: pfData.items.length, label: 'Всего', hint: 'Все проекты в админке' },
    { value: publishedCount, label: 'На сайте', hint: 'Показываются посетителям' },
    { value: pfData.items.length - publishedCount, label: 'Скрыто', hint: 'Черновики не видны на сайте' },
    { value: missingCnCount, label: 'Без CN', hint: 'Нет китайского текста' }
  ]);
  renderChangeLog('portfolioChangeLog', pfData.changeLog);
  grid.innerHTML = entries.map(({ item, i }) => buildPortfolioCard(item, i)).join('');
  renderDashboardIssueNotice('portfolio');
}

function buildPortfolioCard(item, i) {
  const hasImg = item.img && item.img.trim();
  const previewSrc = adminImageSrc(item.img);
  const summaryTitle = item.title || item.title_ru || item.title_cn || 'Новый проект';
  const summaryDesc = item.desc || item.desc_ru || item.desc_cn || 'Добавьте описание проекта';
  const isPublished = item.published !== false;
  return `
  <details class="portfolio-card" id="pf-card-${i}">
    <summary class="portfolio-card-summary">
      <span class="portfolio-summary-num">${String(i+1).padStart(2,'0')}</span>
      <span class="portfolio-summary-thumb">
        ${hasImg ? `<img src="${esc(previewSrc)}" alt="">` : '<span>PHOTO</span>'}
      </span>
      <span class="portfolio-summary-copy">
        <strong>${esc(summaryTitle)}</strong>
        <small>${esc(summaryDesc)}</small>
      </span>
      <span class="portfolio-summary-status ${isPublished ? '' : 'is-draft'}">${isPublished ? 'На сайте' : 'Черновик'}</span>
      <span class="portfolio-summary-caret" aria-hidden="true"></span>
    </summary>

    <div class="portfolio-editor">
      <aside class="portfolio-media-panel">
        <div class="pf-image-wrap" id="pf-img-wrap-${i}">
          ${hasImg
            ? `<img src="${esc(previewSrc)}" onerror="this.style.opacity='0.2'">`
            : `<div class="pf-image-placeholder">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                Нет фото
               </div>`}
        </div>
        <div class="pf-upload-area" id="pf-upload-area-${i}"
          ondragover="event.preventDefault();this.classList.add('dragover')"
          ondragleave="this.classList.remove('dragover')"
          ondrop="handlePfDrop(event,${i})">
          <input type="file" accept="image/*" onchange="uploadPfPhoto(this,${i})">
          <div class="pf-upload-icon">PHOTO</div>
          <div class="pf-upload-label">Заменить фото</div>
          <div class="pf-upload-sub">JPG, PNG, WEBP</div>
        </div>
        <div class="pf-upload-progress" id="pf-progress-${i}">
          <div class="pf-upload-progress-fill" id="pf-progress-fill-${i}"></div>
        </div>
        <div class="pf-upload-status" id="pf-status-${i}">${item.img ? `OK ${item.img.split('/').pop()}` : ''}</div>
        <div class="portfolio-media-actions">
          <button class="btn-mini" type="button" id="pf-restore-${i}" onclick="restorePortfolioPhoto(${i})" ${item.previousImg ? '' : 'disabled'}>Вернуть</button>
          <button class="btn-mini pf-delete-btn" type="button" onclick="deletePortfolioItem(${i})">Удалить</button>
        </div>
      </aside>

    <div class="pf-body">
      <div class="card-toolbar">
        <label class="publish-toggle">
          <input type="checkbox" ${isPublished ? 'checked' : ''}
            onchange="togglePortfolioPublished(${i},this)">
          ${isPublished ? 'Опубликовано' : 'Черновик'}
        </label>
        <button class="btn-mini" type="button" onclick="duplicatePortfolioItem(${i})">Дубль</button>
        <button class="btn-mini" type="button" onclick="toggleTranslations(this)">Переводы</button>
        <button class="btn-mini" type="button" onclick="autoTranslatePortfolioItem(${i})">RU/CN авто</button>
      </div>
      <div class="translation-note">Заполняй английский заголовок и описание. Русский и китайский будут подставляться автоматически.</div>

      <div class="card-field" style="margin-bottom:.8rem;">
        <label class="card-label">Путь к фото</label>
        <input class="card-input" value="${esc(item.img||'')}" id="pf-url-${i}"
          onfocus="rememberPortfolioPhoto(${i})"
          onchange="updPf(${i},'img',this.value);previewPfImg(${i});renderPortfolioGrid()"
          placeholder="/images/portfolio/photo.jpg">
      </div>

      <!-- Title EN / RU -->
      <div class="bilingual-row">
        <div class="card-field">
          <label class="card-label">Заголовок <span class="lang-badge en">EN</span></label>
          <input class="card-input en" value="${esc(item.title||'')}"
            oninput="updPf(${i},'title',this.value)" onblur="autoTranslatePortfolioField(${i},'title')" placeholder="e.g. Gulfood Dubai 2025">
        </div>
        <div class="card-field translation-field">
          <label class="card-label">Заголовок <span class="lang-badge ru">RU</span></label>
          <input class="card-input ru" value="${esc(item.title_ru||'')}"
            oninput="updPf(${i},'title_ru',this.value)" placeholder="например: Gulfood Dubai 2025">
        </div>
        <div class="card-field translation-field">
          <label class="card-label">Заголовок <span class="lang-badge cn">CN</span></label>
          <input class="card-input cn" value="${esc(item.title_cn||'')}"
            oninput="updPf(${i},'title_cn',this.value)" placeholder="例如：迪拜食品展 2025">
        </div>
      </div>

      <!-- Description EN / RU -->
      <div class="bilingual-row">
        <div class="card-field">
          <label class="card-label">Описание <span class="lang-badge en">EN</span></label>
          <textarea class="card-input en portfolio-description"
            oninput="updPf(${i},'desc',this.value)" onblur="autoTranslatePortfolioField(${i},'desc')"
            placeholder="Short description of the event...">${esc(item.desc||'')}</textarea>
        </div>
        <div class="card-field translation-field">
          <label class="card-label">Описание <span class="lang-badge ru">RU</span></label>
          <textarea class="card-input ru portfolio-description"
            oninput="updPf(${i},'desc_ru',this.value)"
            placeholder="Краткое описание события...">${esc(item.desc_ru||'')}</textarea>
        </div>
        <div class="card-field translation-field">
          <label class="card-label">Описание <span class="lang-badge cn">CN</span></label>
          <textarea class="card-input cn portfolio-description"
            oninput="updPf(${i},'desc_cn',this.value)"
            placeholder="活动简短说明...">${esc(item.desc_cn||'')}</textarea>
        </div>
      </div>

    </div>
    </div>
  </details>`;
}

function previewPfImg(i) {
  const url = (document.getElementById(`pf-url-${i}`)?.value || '').trim();
  if (!url) return;
  updPf(i, 'img', url);
  const previewSrc = adminImageSrc(url);
  const wrap = document.getElementById(`pf-img-wrap-${i}`);
  if (wrap) wrap.innerHTML = `
    <img src="${esc(previewSrc)}" onerror="this.style.opacity='0.15'"
      style="width:100%;height:100%;object-fit:cover;display:block;">
    <span class="pf-num">${String(i+1).padStart(2,'0')}</span>
    <button class="pf-delete-btn" onclick="deletePortfolioItem(${i})" title="Удалить проект">Удалить</button>`;
}

function rememberPortfolioPhoto(i) {
  const item = pfData?.items?.[i];
  if (!item || item.previousImg || !item.img) return;
  item.previousImg = item.img;
}

function restorePortfolioPhoto(i) {
  const item = pfData?.items?.[i];
  if (!item?.previousImg) {
    showToast('Предыдущее фото не найдено', 'fail');
    return;
  }
  item.img = item.previousImg;
  item.previousImg = '';
  renderPortfolioGrid();
  showToast('Предыдущее фото возвращено. Нажми «Опубликовать», чтобы сохранить.', 'ok');
}

function handlePfDrop(event, i) {
  event.preventDefault();
  document.getElementById(`pf-upload-area-${i}`).classList.remove('dragover');
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) uploadPfPhoto({ files: [file] }, i);
}

async function uploadPfPhoto(input, i) {
  const file = input.files[0];
  if (!file) return;
  rememberPortfolioPhoto(i);

  if (!file.type.startsWith('image/')) {
    showToast('Please choose an image file', 'fail');
    return;
  }

  if (file.size > MAX_SOURCE_IMAGE_SIZE) {
    showToast('Фото слишком большое. Максимальный исходный размер — 24 MB.', 'fail');
    return;
  }

  const statusEl   = document.getElementById(`pf-status-${i}`);
  const progressEl = document.getElementById(`pf-progress-${i}`);
  const fillEl     = document.getElementById(`pf-progress-fill-${i}`);
  const urlInput   = document.getElementById(`pf-url-${i}`);

  statusEl.className = 'pf-upload-status';
  statusEl.textContent = 'Оптимизация фото...';
  progressEl.style.display = 'block';
  fillEl.style.width = '20%';

  try {
    const optimized = await optimizeImageForUpload(file, PORTFOLIO_IMAGE_PROFILE);
    const safeName = safeFileName(optimized.fileName);
    const sourcePath = `public/images/portfolio/${safeName}`;
    const base64 = await blobToBase64(optimized.blob);

    fillEl.style.width = '60%';
    statusEl.textContent = 'Загрузка в GitHub...';

    // GitHub Pages builds dist from public, so one source upload is enough.
    await putGitHubFile(sourcePath, base64, `Upload portfolio photo: ${safeName}`);

    fillEl.style.width = '100%';

    const publicUrl = `/images/portfolio/${safeName}`;
    updPf(i, 'img', publicUrl);
    if (urlInput) urlInput.value = publicUrl;

    const wrap = document.getElementById(`pf-img-wrap-${i}`);
    if (wrap) {
      const rawUrl = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${sourcePath}`;
      wrap.innerHTML = `
        <img src="${rawUrl}?v=${Date.now()}" onerror="this.style.opacity='0.2'"
          style="width:100%;height:100%;object-fit:cover;display:block;">
        <span class="pf-num">${String(i+1).padStart(2,'0')}</span>
        <button class="pf-delete-btn" onclick="deletePortfolioItem(${i})" title="Удалить проект">Удалить</button>`;
    }

    statusEl.className = 'pf-upload-status ok';
    statusEl.textContent = buildOptimizationMessage('Фото загружено', optimized);
    showToast(statusEl.textContent, 'ok');
    setTimeout(() => { progressEl.style.display = 'none'; }, 1000);

  } catch(e) {
    fillEl.style.width = '100%';
    fillEl.style.background = 'var(--danger)';
    statusEl.className = 'pf-upload-status err';
    statusEl.textContent = 'Error: ' + e.message;
    setTimeout(() => { progressEl.style.display = 'none'; fillEl.style.background = 'var(--dark)'; }, 3000);
  }
}

function updPf(i, field, value) {
  pfData.items[i][field] = value;
}

function togglePortfolioPublished(i, input) {
  updPf(i, 'published', input.checked);
  const card = input.closest('.portfolio-card');
  const status = card?.querySelector('.portfolio-summary-status');
  const label = input.closest('.publish-toggle');
  if (status) {
    status.textContent = input.checked ? 'На сайте' : 'Черновик';
    status.classList.toggle('is-draft', !input.checked);
  }
  if (label) {
    const textNode = Array.from(label.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.textContent = input.checked ? ' Опубликовано' : ' Черновик';
  }
}

async function autoTranslatePortfolioItem(i) {
  const item = pfData?.items?.[i];
  if (!item) return;

  setStatus('busy', `Перевожу проект ${i + 1}...`);
  if (item.title) {
    const translated = await translatePairFromEnglish(item.title);
    item.title_ru = translated.ru;
    item.title_cn = translated.cn;
  }
  if (item.desc) {
    const translated = await translatePairFromEnglish(item.desc);
    item.desc_ru = translated.ru;
    item.desc_cn = translated.cn;
  }
  renderPortfolioGrid();
  setStatus('ok', 'Проект переведён');
  showToast('RU/CN поля проекта заполнены', 'ok');
}

async function autoTranslatePortfolioField(i, field) {
  const item = pfData?.items?.[i];
  const value = String(item?.[field] || '').trim();
  if (!item || !value) return;

  setStatus('busy', 'Перевожу поле портфолио...');
  const translated = await translatePairFromEnglish(value);
  item[`${field}_ru`] = translated.ru;
  item[`${field}_cn`] = translated.cn;
  renderPortfolioGrid();
  setStatus('ok', 'Поле портфолио переведено');
}

async function autoTranslateAllPortfolio() {
  if (!pfData?.items?.length) return;
  for (let i = 0; i < pfData.items.length; i++) {
    await autoTranslatePortfolioItem(i);
  }
  showToast('RU/CN поля заполнены для портфолио', 'ok');
}

function addPortfolioItem() {
  pfData.items.push({ published: false, img: '', title: '', title_ru: '', title_cn: '', desc: '', desc_ru: '', desc_cn: '' });
  renderPortfolioGrid();
  // scroll to new card
  const cards = document.querySelectorAll('.portfolio-card');
  if (cards.length) cards[cards.length-1].scrollIntoView({ behavior: 'smooth', block: 'center' });
  // focus first input of new card
  setTimeout(() => {
    const last = document.getElementById(`pf-card-${pfData.items.length-1}`);
    if (last) {
      last.open = true;
      last.querySelector('.card-input')?.focus();
    }
  }, 100);
}

function renderStats(id, stats) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'admin-stats-panel visible';
  el.innerHTML = stats.map(stat => `
    <div class="stat-tile">
      <b>${esc(stat.value)}</b>
      <span>${esc(stat.label)}</span>
      ${stat.hint ? `<small>${esc(stat.hint)}</small>` : ''}
    </div>
  `).join('');
}

function duplicatePortfolioItem(i) {
  const source = pfData.items[i];
  if (!source) return;
  const copy = JSON.parse(JSON.stringify(source));
  copy.published = false;
  copy.title = `${source.title || 'Portfolio item'} Copy`;
  pfData.items.splice(i + 1, 0, copy);
  renderPortfolioGrid();
  const duplicated = document.getElementById(`pf-card-${i + 1}`);
  if (duplicated) duplicated.open = true;
  showToast('Portfolio item duplicated as draft', 'ok');
}

function movePortfolioItem(i, direction) {
  const next = i + direction;
  if (next < 0 || next >= pfData.items.length) return;
  const [item] = pfData.items.splice(i, 1);
  pfData.items.splice(next, 0, item);
  renderPortfolioGrid();
}

function deletePortfolioItem(i) {
  if (!confirm(`Delete item "${pfData.items[i].title || 'Untitled'}"?`)) return;
  const [deleted] = pfData.items.splice(i, 1);
  rememberDeleted('portfolio', deleted, i);
  renderPortfolioGrid();
  showToast('Проект удалён. Можно вернуть кнопкой "Вернуть удалённое".', 'ok');
}

async function publishPortfolio() {
  const errors = validatePortfolioData(pfData);
  if (errors.length) {
    blockPublish(errors, 'Portfolio');
    return;
  }

  try {
    setStatus('busy', 'Проверка актуальной версии...');
    pfSha = await getGitHubFileSha(PF_PATH);

    setStatus('busy', 'Публикация портфолио...');
    pfData.lastUpdated = new Date().toISOString().split('T')[0];
    addChangeLog(pfData, `Portfolio updated: ${pfData.items.length} items`);

    const jsonStr = JSON.stringify(pfData, null, 2);
    const bytes = new TextEncoder().encode(jsonStr);
    const binStr = Array.from(bytes).map(b => String.fromCharCode(b)).join('');
    const content = btoa(binStr);
    const body = {
      message: `Update portfolio ${pfData.lastUpdated}`,
      content,
      branch: BRANCH
    };
    if (pfSha) body.sha = pfSha;

    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${PF_PATH}`, {
      method: 'PUT',
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!r.ok) {
      const error = await r.json().catch(() => ({}));
      throw new Error(error.message || 'Не удалось опубликовать портфолио');
    }
    const json = await r.json();
    pfSha = json.content.sha;
    document.getElementById('pfMeta').textContent =
      `${pfData.items.length} items - Last updated: ${pfData.lastUpdated}`;
    pfOriginalData = JSON.parse(JSON.stringify(pfData));
    renderPortfolioGrid();
    setStatus('ok', 'Portfolio published');
    showToast('Портфолио опубликовано. Сайт обновится примерно через 2 минуты.', 'ok');
  } catch(e) {
    setStatus('err', e.message);
    showToast(e.message, 'fail');
  }
}

// Override publishChanges to handle both tabs
window.pologenkiPriceImportAdmin = {
  getProducts: () => data?.products || [],
  notify: message => showToast(message, 'fail'),
  didApply(count) {
    addChangeLog(data, `Импорт цен из Excel: ${count} позиций`);
    renderGrid();
    renderDashboard();
    if (document.getElementById('tab-prices')?.classList.contains('active')) preparePricesTab();
    setStatus('ok', `Импортировано цен: ${count}. Готово к публикации.`);
    showToast('Цены из Excel применены. Нажмите «Опубликовать», чтобы сохранить их на сайте.', 'ok');
  }
};

const _origPublish = publishChanges;
window.publishChanges = async function() {
  const activeTab = document.querySelector('.tab-panel.active')?.id;
  if (activeTab === 'tab-portfolio') {
    await publishPortfolio();
  } else {
    await _origPublish();
  }
};
