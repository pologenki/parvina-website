const locales = {
  ru: { from: 'от', onRequest: 'По запросу', grade: 'Сорт', packing: 'Упаковка', delivery: 'Базис поставки', price: 'Цена', details: 'Описание', unknown: 'Уточняется', indicative: 'Ориентировочная цена', selectGrade: 'Стоимость выбранного сорта уточняется', otherGrades: 'Цены остальных сортов — в таблице ниже.', kg: 'кг', g: 'г', bag: 'пакет', vacuum: 'вакуумный пакет', carton: 'коробка', tray: 'лоток' },
  en: { from: 'From', onRequest: 'On request', grade: 'Grade', packing: 'Packing', delivery: 'Delivery basis', price: 'Price', details: 'Details', unknown: 'To be confirmed', indicative: 'Indicative price', selectGrade: 'Confirm the price of your selected grade', otherGrades: 'See the table below for other grade prices.', kg: 'kg', g: 'g', bag: 'bag', vacuum: 'vacuum bag', carton: 'carton', tray: 'tray' },
  cn: { from: '起价', onRequest: '价格面议', grade: '等级', packing: '包装', delivery: '交货条件', price: '价格', details: '详细说明', unknown: '待确认', indicative: '参考价格', selectGrade: '所选等级的价格需确认', otherGrades: '其他等级的价格请参阅下表。', kg: '公斤', g: '克', bag: '袋装', vacuum: '真空袋', carton: '纸箱', tray: '托盘' },
};

export function offerCopy(lang) {
  return locales[lang] || locales.en;
}

export function parseOfferPrice(value) {
  const match = String(value ?? '').trim().match(/^(\d+(?:[.,]\d+)?)\s*USD\s*\/\s*kg$/i);
  if (!match) return null;
  const number = Number(match[1].replace(',', '.'));
  return Number.isFinite(number) && number > 0 ? number : null;
}

// A displayed starting price must correspond to an actual priced grade when available.
export function getStartingPrice(product) {
  let starting = null;
  for (const variant of product.variants || []) {
    const value = parseOfferPrice(variant.price);
    if (value !== null && (!starting || value < starting.value)) {
      starting = { value, price: variant.price, variant, source: 'variant' };
    }
  }
  if (starting) return starting;
  const value = parseOfferPrice(product.mainPrice);
  return { value, price: product.mainPrice, variant: null, source: value === null ? 'none' : 'catalogue' };
}

export function formatOfferPrice(value, lang, starting = false) {
  const amount = parseOfferPrice(value);
  const c = offerCopy(lang);
  if (amount === null) return c.onRequest;
  const formatted = new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : lang === 'cn' ? 'zh-CN' : 'en-GB', {
    minimumFractionDigits: 2, maximumFractionDigits: 6,
  }).format(amount);
  return `${starting ? c.from + ' ' : ''}${formatted} $/${c.kg}`;
}

export function startingPriceText(product, lang) {
  return formatOfferPrice(getStartingPrice(product).price, lang, true);
}

export function variantText(variant, field, lang) {
  return String(variant[`${field}_${lang}`] || variant[field] || '');
}

// Extract only packing quantities stated in the existing specification. Missing facts stay missing.
export function variantPacking(variant, lang) {
  const c = offerCopy(lang);
  const desc = String(variant.desc || '');
  const match = desc.match(/\b(\d+(?:[.,]\d+)?(?:\s*\/\s*\d+(?:[.,]\d+)?)?)\s*(kg|gr|g)\b/i);
  if (!match) return '';
  const amount = lang === 'ru' ? match[1].replaceAll('.', ',') : match[1].replaceAll(',', '.');
  const containers = [];
  if (/\bbags?\b/i.test(desc)) containers.push(/\bvacuum\b/i.test(desc) ? c.vacuum : c.bag);
  if (/\bcartons?\b/i.test(desc)) containers.push(c.carton);
  if (/\btrays?\b/i.test(desc)) containers.push(c.tray);
  return `${amount} ${match[2].toLowerCase() === 'kg' ? c.kg : c.g}${containers.length ? ' · ' + containers.join(' / ') : ''}`;
}

export function variantDelivery(variant) {
  const match = String(variant.desc || '').match(/(?:^|[.;]\s*)(FOB|FCA|CIF|CFR|EXW|DAP|DDP|CPT|CIP|DPU|FAS)\b(?:\s+([^.;\n]+))?/i);
  if (!match || String(variant.desc || '').slice(match.index + match[0].length).replace(/[.\s]/g, '')) return '';
  return `${match[1].toUpperCase()}${match[2] ? ' ' + match[2].trim() : ''}`;
}
