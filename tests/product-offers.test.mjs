import test from 'node:test';
import assert from 'node:assert/strict';
import { parseOfferPrice, getStartingPrice, startingPriceText, formatOfferPrice, variantPacking, variantDelivery } from '../src/utils/product-offers.js';
import { buildImportPlan, applyImportPlan } from '../public/admin/price-import-core.js';
import { renderProductSpecifications } from '../src/components/product-specifications.js';

// Keep business-rule examples independent of prices the owner updates through the admin.
const cashew = () => ({
  id: 'cashew', name: 'Cashew Nuts', mainPrice: '5.75 USD/kg',
  variants: [
    { name: 'WW320 - Whole White', price: '7,40 USD/kg', desc: 'Quality AFI standard. 20/22.68 kg PE vacuum bag/carton packing. FOB HCM.' },
    { name: 'WW450 - Whole White', price: '7.1 USD/kg', desc: 'Quality AFI standard. 20/22.68 kg PE vacuum bag/carton packing. FOB HCM.' },
    { name: 'WS - White Split', price: '5.75 USD/kg', desc: 'Quality AFI standard. 20/22.68 kg PE vacuum bag/carton packing. FOB HCM.' },
    { name: 'Other grades', price: 'Price on request', desc: 'WW210, WW240, WW320, WW450, WS, LWP, LP, DW.' },
  ],
});

test('cashew starting price belongs to WS, while WW320 keeps its own price', () => {
  const p = cashew(), offer = getStartingPrice(p);
  assert.equal(offer.value, 5.75);
  assert.match(offer.variant.name, /^WS /);
  assert.equal(startingPriceText(p, 'ru'), 'от 5,75 $/кг');
  assert.equal(formatOfferPrice(p.variants[0].price, 'ru'), '7,40 $/кг');
});

test('stale summary price cannot override the real grade minimum', () => {
  const p = cashew();
  p.mainPrice = '1.00 USD/kg';
  assert.equal(getStartingPrice(p).value, 5.75);
  p.variants[0].price = '4.25 USD/kg';
  assert.equal(getStartingPrice(p).value, 4.25);
  assert.equal(getStartingPrice(p).variant.name, p.variants[0].name);
});

test('formatting supports decimal commas/dots and all site languages', () => {
  assert.equal(parseOfferPrice('5,75 USD/kg'), 5.75);
  assert.equal(parseOfferPrice('5.75USD/kg'), 5.75);
  assert.equal(formatOfferPrice('7.1 USD/kg', 'en'), '7.10 $/kg');
  assert.equal(startingPriceText(cashew(), 'en'), 'From 5.75 $/kg');
  assert.equal(startingPriceText(cashew(), 'cn'), '起价 5.75 $/公斤');
});

test('unknown, zero, non-USD and other-unit prices never become numeric offers', () => {
  for (const value of ['', null, 'Price on request', '0 USD/kg', '-2 USD/kg', '5 EUR/kg', '5 USD/ton', '5e2 USD/kg', 'NaN USD/kg']) assert.equal(parseOfferPrice(value), null);
  assert.equal(getStartingPrice({ mainPrice: 'Price on request', variants: [] }).source, 'none');
  assert.equal(startingPriceText({ mainPrice: 'Price on request' }, 'ru'), 'По запросу');
});

test('a catalogue-only indicative price is never attributed to an unpriced grade', () => {
  const p = { mainPrice: '2,90 USD/kg', variants: [{ name: 'Cherry', price: 'Price on request' }] };
  const offer = getStartingPrice(p);
  assert.equal(offer.source, 'catalogue');
  assert.equal(offer.variant, null);
  assert.equal(offer.value, 2.9);
});

test('price selection preserves data, grade order, and the first grade in a tie', () => {
  const p = cashew(), original = structuredClone(p);
  getStartingPrice(p);
  assert.deepEqual(p, original);
  const a = { name: 'A', price: '1.50 USD/kg' }, b = { name: 'B', price: '1,50 USD/kg' };
  assert.equal(getStartingPrice({ variants: [a, b] }).variant, a);
});

test('packing facts come from actual quantities and do not confuse sizes with weights', () => {
  assert.equal(variantPacking(cashew().variants[0], 'ru'), '20/22,68 кг · вакуумный пакет / коробка');
  assert.equal(variantPacking({ desc: 'Packed in 200 gr tray.' }, 'en'), '200 g · tray');
  assert.equal(variantPacking({ desc: 'A 500g branded bag.' }, 'cn'), '500 克 · 袋装');
  assert.equal(variantPacking({ desc: 'Size 8-10 mm. Sugar 45-55%.' }, 'ru'), '');
});

test('delivery basis is extracted only when explicitly stated, without a truncated port', () => {
  assert.equal(variantDelivery(cashew().variants[0]), 'FOB HCM');
  assert.equal(variantDelivery({ desc: 'Quality. FOB Tianjin port.' }), 'FOB Tianjin port');
  assert.equal(variantDelivery({ desc: 'No delivery terms have been agreed.' }), '');
  assert.equal(variantDelivery({ desc: 'FOB St. Petersburg.' }), '');
});

test('the shared comparison table pairs each grade with its own price', () => {
  const html = renderProductSpecifications(cashew(), 'ru');
  assert.match(html, /<table\b/);
  assert.match(html, /Упаковка/);
  assert.match(html, /Базис поставки/);
  assert.match(html, /WW320 - Whole White[\s\S]*?7,40 \$\/кг[\s\S]*?<\/tr>/);
  assert.match(html, /WS - White Split[\s\S]*?5,75 \$\/кг[\s\S]*?<\/tr>/);
  assert.doesNotMatch(html, /Минимальная партия|Дата предложения/);
});

test('unknown terms are not invented and specifications remain accessible and escaped', () => {
  const p = { variants: [{ name: '<img onerror=alert(1)>', desc: 'A & B', price: 'Price on request' }] };
  const html = renderProductSpecifications(p, 'en');
  assert.doesNotMatch(html, />Packing<|>Delivery basis<|<img/);
  assert.match(html, /&lt;img onerror=alert\(1\)&gt;/);
  assert.match(html, /<details[\s\S]*?A &amp; B/);
  assert.match(html, /scope="row"/);
  assert.match(html, /On request/);
});

test('Excel grade-price updates automatically change the displayed starting offer', () => {
  const p = cashew();
  const plan = buildImportPlan([['Product ID', 'Product', 'Grade', 'Price, USD/kg'], ['cashew', '', 'WW320', 4.25]], [p]);
  assert.equal(plan.error, '');
  assert.equal(applyImportPlan([p], plan.rows), 1);
  assert.match(getStartingPrice(p).variant.name, /^WW320 /);
  assert.equal(startingPriceText(p, 'ru'), 'от 4,25 $/кг');
  assert.match(renderProductSpecifications(p, 'ru'), /WW320 - Whole White[\s\S]*?4,25 \$\/кг[\s\S]*?<\/tr>/);
});
