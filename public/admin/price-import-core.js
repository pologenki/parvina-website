const text = value => value == null ? '' : String(value).trim();
export const normalizeName = value => text(value).normalize('NFKC').toLowerCase().replace(/ё/g, 'е').replace(/[\p{P}\p{Z}\p{S}_]+/gu, ' ').trim();

const headers = {
  productId: ['id', 'id товара', 'product id', 'productid', 'артикул', 'код товара', 'код', 'sku'],
  productName: ['товар', 'название', 'наименование', 'название товара', 'наименование товара', 'product', 'product name', 'name', '产品', '产品名称'],
  variant: ['сорт', 'вариант', 'марка', 'тип', 'grade', 'variant', 'variety', '规格', '品种'],
  price: ['цена', 'цена usd', 'цена usd кг', 'цена usd kg', 'цена для сайта', 'цена продажи', 'продажная цена', 'price', 'price usd', 'price usd kg', 'sale price', 'selling price', '价格', '售价'],
};
const aliases = Object.fromEntries(Object.entries(headers).map(([key, values]) => [key, values.map(normalizeName)]));

export function guessColumns(row = []) {
  return Object.fromEntries(Object.entries(aliases).map(([key, values]) => [key, row.findIndex(value => values.includes(normalizeName(value)))]));
}

export function detectHeader(rows) {
  let best = { headerRow: 0, mapping: guessColumns(rows[0]), score: -1 };
  rows.slice(0, 30).forEach((row, headerRow) => {
    const mapping = guessColumns(row);
    const score = (mapping.price >= 0 ? 4 : 0) + (mapping.productId >= 0 ? 3 : 0) + (mapping.productName >= 0 ? 2 : 0) + (mapping.variant >= 0 ? 1 : 0);
    if (score > best.score) best = { headerRow, mapping, score };
  });
  return best;
}

const requests = new Set(['price on request', 'on request', 'по запросу', 'цена по запросу', 'запрос', '询价', '价格面议', '按需报价']);
export function parseImportPrice(value) {
  if (typeof value === 'boolean' || value instanceof Date || value && typeof value === 'object') return { error: 'Ожидается цена, а не дата или формула без результата.' };
  let raw = text(value);
  if (!raw) return { error: 'Цена не заполнена.' };
  if (requests.has(normalizeName(raw))) return { canonical: 'request', formatted: 'Price on request', value: null };
  raw = raw.replace(/(?:\/|\bper\b|за)?\s*(?:kg|кг)\s*$/iu, '').replace(/\bUSD\b|\$/giu, '').trim();
  if (raw.startsWith('.') || raw.startsWith(',')) raw = '0' + raw;
  if (raw.includes(',') && raw.includes('.')) {
    const decimal = raw.lastIndexOf(',') > raw.lastIndexOf('.') ? ',' : '.';
    const grouping = decimal === ',' ? '.' : ',';
    const pieces = raw.split(decimal);
    const groupPattern = grouping === '.' ? /^\d{1,3}(?:\.\d{3})+$/ : /^\d{1,3}(?:,\d{3})+$/;
    if (pieces.length !== 2 || !groupPattern.test(pieces[0])) return { error: 'Неоднозначный формат числа. Например: 5,75 или 5.75.' };
    raw = pieces[0].split(grouping).join('') + '.' + pieces[1];
  }
  if (!/^(?:\d+|\d{1,3}(?:[\s\u00a0\u202f]\d{3})+)(?:[.,]\d+)?$/u.test(raw)) return { error: 'Укажите число в USD/кг или «По запросу».' };
  const number = Number(raw.replace(/[\s\u00a0\u202f]/g, '').replace(',', '.'));
  if (!Number.isFinite(number) || number <= 0) return { error: 'Цена должна быть больше нуля.' };
  const rounded = Number(number.toFixed(6));
  if (rounded <= 0 || Math.abs(number - rounded) > 1e-9) return { error: 'Допустимо до 6 знаков после запятой.' };
  const formatted = rounded.toLocaleString('en-US', { useGrouping: false, minimumFractionDigits: 2, maximumFractionDigits: 6 }) + ' USD/kg';
  return { canonical: 'USD/kg:' + rounded, formatted, value: rounded };
}

const productNames = product => [product.name, product.name_ru, product.name_cn].filter(Boolean).map(normalizeName);
const variantNames = variant => [...new Set([variant.name, variant.name_ru, variant.name_cn, text(variant.name).split(/\s+[-–—]\s+/u)[0]].filter(Boolean).map(normalizeName))];
const mainNames = new Set(['', 'main', 'base', 'main price', 'основная', 'основная цена', 'товар', 'общая цена']);

export function buildImportPlan(rows, products, { headerRow = 0, mapping = guessColumns(rows[headerRow]) } = {}) {
  if (mapping.price < 0 || mapping.productId < 0 && mapping.productName < 0) return { rows: [], error: 'Выберите столбец цены и хотя бы один столбец: ID товара или название.' };
  const columns = Object.values(mapping).filter(index => index >= 0);
  if (new Set(columns).size !== columns.length) return { rows: [], error: 'Для разных полей нужно выбрать разные столбцы.' };
  const priceHeader = text(rows[headerRow]?.[mapping.price]);
  if (/(?:^|\s)cost(?:\s|$)|purchase|buying|закуп|себестоим|成本|采购/iu.test(priceHeader)) return { rows: [], error: 'Выбран столбец закупочной цены. Для сайта выберите цену продажи.' };
  if (/[€£₽¥%]|\b(?:EUR|GBP|RUB|CNY|RMB|JPY|CAD|AUD|CHF)\b|евро|рубл|юан/iu.test(priceHeader)) return { rows: [], error: 'Цены на сайте указаны в USD/кг. Выберите столбец с этой валютой и единицей.' };
  const quantity = priceHeader.match(/(?:\/|\bper\b|за)\s*(\d+)\s*(?:kg|кг)/iu);
  if (quantity && Number(quantity[1]) !== 1 || /(?:\/|\bper\b|за)\s*(?:t|т|тн|ton|tonne|тонн[аыу]?|lb|фунт[аыу]?|pcs|шт|штук[ауыи]?)(?=$|[\s,;])/iu.test(priceHeader)) return { rows: [], error: 'Выберите цены за один килограмм, а не за упаковку, тонну, фунт или штуку.' };
  const plan = [];
  rows.slice(headerRow + 1).forEach((cells, offset) => {
    if (!cells.some(value => text(value))) return;
    const row = { rowNumber: headerRow + offset + 2, sourceName: text(cells[mapping.productId]) || text(cells[mapping.productName]), sourceVariant: text(cells[mapping.variant]), sourcePrice: text(cells[mapping.price]), status: 'error', message: '' };
    plan.push(row);
    const fail = message => { row.message = message; };
    const id = text(cells[mapping.productId]);
    const name = text(cells[mapping.productName]);
    if (!id && !name) return fail('Не указан товар.');
    const named = name ? products.filter(product => productNames(product).includes(normalizeName(name))) : [];
    const candidates = id ? products.filter(product => normalizeName(product.id) === normalizeName(id)) : named;
    if (candidates.length !== 1) return fail(candidates.length ? 'Несколько товаров совпадают. Укажите уникальный ID.' : 'Товар не найден в каталоге.');
    const product = candidates[0];
    if (id && named.length === 1 && named[0] !== product) return fail('ID и название указывают на разные товары.');
    let variant = null;
    const variantLabel = normalizeName(row.sourceVariant);
    if (!mainNames.has(variantLabel)) {
      const matches = (product.variants || []).filter(item => variantNames(item).includes(variantLabel));
      if (matches.length !== 1) return fail(matches.length ? 'Сорт неоднозначен. Укажите полное название.' : 'Сорт не найден у этого товара.');
      variant = matches[0];
    }
    const parsed = parseImportPrice(cells[mapping.price]);
    row.productId = product.id;
    row.productName = product.name_ru || product.name;
    row.variantName = variant?.name ?? null;
    row.previousPrice = variant ? variant.price : product.mainPrice;
    row.label = row.productName + (variant ? ' / ' + variant.name : ' / Основная цена');
    if (parsed.error) return fail(parsed.error);
    row.nextPrice = parsed.formatted;
    row.canonical = parsed.canonical;
    row.key = JSON.stringify([product.id, row.variantName]);
    const previous = parseImportPrice(row.previousPrice);
    row.status = previous.canonical === parsed.canonical ? 'unchanged' : 'change';
    row.message = row.status === 'change' ? 'Готово к обновлению' : 'Цена не изменилась';
  });
  const groups = new Map();
  plan.filter(row => row.key).forEach(row => { if (!groups.has(row.key)) groups.set(row.key, []); groups.get(row.key).push(row); });
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    if (new Set(group.map(row => row.canonical)).size > 1) group.forEach(row => { row.status = 'error'; row.message = 'Разные цены для одной позиции: строки ' + group.map(item => item.rowNumber).join(', '); });
    else group.slice(1).forEach(row => { row.status = 'duplicate'; row.message = 'Повтор строки ' + group[0].rowNumber; });
  }
  return { rows: plan, error: plan.length ? '' : 'После заголовка нет строк с данными.' };
}

export function applyImportPlan(products, rows) {
  if (!rows.length) throw new Error('Не выбраны цены для обновления.');
  const seen = new Set();
  const patches = rows.map(row => {
    if (row.status !== 'change' || seen.has(row.key)) throw new Error('В списке есть неподтверждённая или повторная строка.');
    seen.add(row.key);
    const matches = products.filter(product => product.id === row.productId);
    if (matches.length !== 1) throw new Error('Каталог изменился. Обновите предпросмотр.');
    const product = matches[0];
    const variants = row.variantName === null ? [] : (product.variants || []).filter(item => item.name === row.variantName);
    if (row.variantName !== null && variants.length !== 1) throw new Error('Сорта изменились. Обновите предпросмотр.');
    const target = row.variantName === null ? product : variants[0];
    const field = row.variantName === null ? 'mainPrice' : 'price';
    if (target[field] !== row.previousPrice) throw new Error('Цена «' + row.label + '» уже изменилась. Обновите предпросмотр.');
    const parsed = parseImportPrice(row.nextPrice);
    if (parsed.error) throw new Error(parsed.error);
    return { target, field, value: parsed.formatted };
  });
  patches.forEach(patch => { patch.target[patch.field] = patch.value; });
  return patches.length;
}

export function templateRows(products) {
  const rows = [['ID товара', 'Товар', 'Сорт', 'Цена, USD/кг']];
  const value = price => { const parsed = parseImportPrice(price); return parsed.error ? text(price) : parsed.value ?? 'По запросу'; };
  products.forEach(product => {
    rows.push([product.id, product.name_ru || product.name, '', value(product.mainPrice)]);
    (product.variants || []).forEach(variant => rows.push([product.id, product.name_ru || product.name, variant.name, value(variant.price)]));
  });
  return rows;
}
