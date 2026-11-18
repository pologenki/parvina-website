import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCatalogSearchIndex, searchCatalog } from '../src/utils/catalog-search.js';

const products = () => [
  { id: 'cashew', name: 'Cashew Nuts', name_ru: 'Орехи кешью', name_cn: '腰果', origin: 'Vietnam', origin_ru: 'Вьетнам', mainPrice: '5.75 USD/kg', variants: [
    { name: 'WW320 - Whole White', price: '7.40 USD/kg', desc: '20 kg vacuum packing. FOB HCM.', desc_ru: 'Упаковка 20 кг. FOB HCM.' },
    { name: 'WW450 - Whole White', price: '7.10 USD/kg', desc: '20 kg vacuum packing. FOB HCM.' },
    { name: 'WS - White Split', price: '5.75 USD/kg', desc: '20 kg packing. FOB HCM.' },
    { name: 'Other grades', price: 'Price on request', desc: 'WW210, WW240, WW320, WW450, WS, LWP, LP, DW.' },
  ] },
  { id: 'walnuts', name: 'Walnut Kernels', name_ru: 'Ядра грецкого ореха', origin_ru: 'Китай', mainPrice: '5.45 USD/kg', variants: [
    { name: '185 - ELH', price: '5.80 USD/kg', desc: 'Extra Light Halves 80%. 10 kg packing.' },
  ] },
  { id: 'peanuts', name: 'Raw Peanuts', name_ru: 'Сырой арахис', variants: [
    { name: 'Bold - 40/50', price: '2.20 USD/kg' },
    { name: 'Bold - 50/60', price: '2.10 USD/kg' },
    { name: 'TJ - 40/50', price: '2.80 USD/kg' },
  ] },
  { id: 'draft', name: 'Hidden Cashew', published: false, variants: [{ name: 'WW321', price: '1.00 USD/kg' }] },
];
const find = query => searchCatalog(buildCatalogSearchIndex(products()), query);

test('a grade query returns its actual grade and price, not the product summary', () => {
  const rows = find('орех ww320');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].product.id, 'cashew');
  assert.equal(rows[0].variantIndex, 0);
  assert.equal(rows[0].variant.price, '7.40 USD/kg');
});

test('grade codes ignore case and allow spaces, hyphens and common keyboard variants', () => {
  for (const query of ['WW320', 'ww 320', 'кешью WW-320', 'орех ЦЦ 320', 'орех вв320', 'Vietnam WW320']) {
    assert.equal(find(query)[0]?.variant.name, 'WW320 - Whole White', query);
  }
});

test('a grade mentioned in Other grades does not replace the exact named grade', () => {
  assert.deepEqual(find('WW320').map(e => e.variant.name), ['WW320 - Whole White']);
  assert.deepEqual(find('ws').map(e => e.variant.name), ['WS - White Split']);
});

test('query terms cannot be satisfied by two different grades of the same product', () => {
  assert.equal(find('WW320 WW450').length, 0);
  assert.equal(find('WW320 split').length, 0);
});

test('general product queries retain the product and its individual grades', () => {
  const rows = find('кешью');
  assert.equal(rows[0].variant, null);
  assert.equal(rows[0].product.id, 'cashew');
  assert.equal(rows.filter(e => e.variant).length, 4);
});

test('Russian singular and inflected names match the product data', () => {
  assert.equal(find('грецкий орех 185')[0]?.product.id, 'walnuts');
  assert.equal(find('грецкий орех 185')[0]?.variant.name, '185 - ELH');
});

test('origin, packing and delivery terms can qualify a particular grade', () => {
  assert.equal(find('Вьетнам WW320 20 кг FOB')[0]?.variantIndex, 0);
  assert.equal(find('WW320 10 kg').length, 0);
});

test('Chinese product names can be combined directly with Latin grade codes', () => {
  assert.equal(find('腰果WW320')[0]?.variantIndex, 0);
  assert.equal(find('腰果 WW 450')[0]?.variantIndex, 1);
});

test('grade sizes and names identify the specific peanut variant', () => {
  assert.equal(find('арахис Bold 40/50').length, 1);
  assert.equal(find('арахис Bold 40/50')[0].variant.name, 'Bold - 40/50');
  assert.equal(find('40/50').length, 2);
});

test('unknown codes do not turn into another grade or an unpublished product', () => {
  assert.equal(find('ww321').length, 0);
  assert.equal(find('draft').length, 0);
  assert.equal(find('ww3200').length, 0);
});

test('blank and punctuation-only queries are empty; missing variants are safe', () => {
  assert.equal(find('').length, 0);
  assert.equal(find('   / -  ').length, 0);
  assert.equal(searchCatalog(buildCatalogSearchIndex([{ id: 'coffee', name: 'Coffee' }]), 'coffee').length, 1);
});

test('category/translated labels are supplied without duplicating or mutating source data', () => {
  const source = products(), snapshot = structuredClone(source);
  const index = buildCatalogSearchIndex(source, p => ({ names: [p.name, p.name_ru], terms: ['Nuts', '坚果'] }));
  const a = searchCatalog(index, '坚果 WW320'), b = searchCatalog(index, '坚果 WW320');
  assert.equal(a[0].variantIndex, 0);
  assert.deepEqual(a, b);
  assert.deepEqual(source, snapshot);
});

test('ordinary name prefixes are not mistaken for grade codes', () => {
  const source = products();
  source.push({ id: 'dates', name: 'Dried Dates', variants: [{ name: 'Deglet Nour - 5 kg', price: '2 USD/kg' }] });
  source.push({ id: 'mango', name: 'Dried Fruit Mango', variants: [{ name: 'Mango Sugar FREE', price: '3 USD/kg' }] });
  const index = buildCatalogSearchIndex(source);
  assert.ok(searchCatalog(index, 'nu').some(row => row.product.id === 'cashew'));
  assert.ok(searchCatalog(index, 'fr').some(row => row.product.id === 'mango' && !row.variant));
});

test('a packing weight is not a grade code from an unrelated product', () => {
  const source = products();
  source.push({ id: 'dates', name: 'Dates', variants: [{ name: 'Deglet Nour - 200 gr', price: '2 USD/kg' }] });
  const index = buildCatalogSearchIndex(source);
  assert.equal(searchCatalog(index, 'WW320 20 kg')[0]?.variantIndex, 0);
  assert.equal(searchCatalog(index, 'WW320 20kg')[0]?.variantIndex, 0);
  assert.equal(searchCatalog(index, 'walnut 185 10 kg')[0]?.variant.name, '185 - ELH');
});

test('separate grade/attribute terms are not joined into invented codes', () => {
  assert.equal(find('орех ELH 185')[0]?.variant.name, '185 - ELH');
  assert.equal(find('raw 40/50').length, 2);
});

test('a product description covering several choices is not inherited by every grade', () => {
  const index = buildCatalogSearchIndex([{ id: 'mango', name: 'Dried Mango', name_ru: 'Сушеный манго', desc_ru: 'Продукция с сахаром и без сахара', variants: [
    { name: 'Mango - 5 kg', price: '4.50 USD/kg', desc_ru: 'Слегка подслащенные дольки манго. Упаковка 5 кг.' },
    { name: 'Mango - 5 kg Sugar FREE', price: 'Price on request', desc_ru: 'Без добавления сахара. Упаковка 5 кг.' },
  ] }]);
  for (const query of ['манго 5 кг без сахара', 'манго без сахара']) {
    const rows = searchCatalog(index, query);
    assert.equal(rows.length, 1, query);
    assert.equal(rows[0].variantIndex, 1);
    assert.equal(rows[0].variant.price, 'Price on request');
  }
});

test('grade numbers remain searchable when names use a space before the number', () => {
  const index = buildCatalogSearchIndex([
    { id: 'kernels', name: 'Walnut kernels', variants: [{ name: 'Xin2 - ELH', price: '5.82 USD/kg' }] },
    { id: 'shell', name: 'Walnuts in shell', variants: [{ name: 'Xin 2 (Xinjiang 2)', price: '3.30 USD/kg' }] },
  ]);
  assert.equal(searchCatalog(index, 'Xin2').length, 2);
  assert.equal(searchCatalog(index, 'Xin 2 (Xinjiang 2)')[0]?.product.id, 'shell');
});
