import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { applyImportPlan, buildImportPlan, detectHeader, guessColumns, parseImportPrice, templateRows } from '../public/admin/price-import-core.js';

const fixture = () => [
  { id: 'cashew', name: 'Cashew Nuts', name_ru: 'Орехи кешью', name_cn: '腰果', mainPrice: '5,75 USD/kg', image: 'keep.webp', published: false, variants: [{ name: 'WW320 - Whole White', price: '7,40 USD/kg', desc: 'Keep specification' }, { name: 'Other grades', price: 'Price on request' }] },
  { id: 'walnuts', name: 'Walnut Kernels', name_ru: 'Ядра грецкого ореха', mainPrice: '5.45 USD/kg', variants: [{ name: 'Xingfu - ELH', price: '5.45 USD/kg' }] },
];
const header = ['ID товара', 'Товар', 'Сорт', 'Цена, USD/кг'];
const plan = (rows, products = fixture()) => buildImportPlan([header, ...rows], products);

test('numbers, decimal commas, grouping and on-request values', () => {
  for (const value of [5.75, '5,75', '5.75 USD/kg', '$5.75/кг', ' 5,7500 ']) assert.equal(parseImportPrice(value).canonical, 'USD/kg:5.75');
  for (const value of ['1 234,50', '1,234.50 USD/kg', '1.234,50']) assert.equal(parseImportPrice(value).value, 1234.5);
  assert.equal(parseImportPrice('0.1234').formatted, '0.1234 USD/kg');
  for (const value of ['По запросу', 'Price on request', '价格面议']) assert.equal(parseImportPrice(value).formatted, 'Price on request');
});

test('invalid, negative, empty, foreign currency and formula strings are rejected', () => {
  for (const value of ['', null, 0, -1, 'NaN', Infinity, true, new Date(), '=2+3', '5 75', '5,5,5', '5 EUR/kg', '10%', '5 USD/ton', '5 text', '0.1234567']) assert.ok(parseImportPrice(value).error, String(value));
});

test('detects shifted bilingual headers and does not pick procurement cost', () => {
  const result = detectHeader([['Прайс-лист'], [], ['Product ID', 'Grade', 'Cost', 'Sale price'], ['cashew', 'WW320', 4, 8]]);
  assert.equal(result.headerRow, 2);
  assert.equal(result.mapping.price, 3);
  assert.equal(guessColumns(['ID', 'Закупочная цена']).price, -1);
});

test('matches product ID and short grade, preserving every unrelated field', () => {
  const products = fixture(), original = structuredClone(products);
  const result = plan([['cashew', 'Орехи кешью', '', '6,25'], ['cashew', '', 'ww320', 8.15]], products);
  assert.equal(result.rows.filter(row => row.status === 'change').length, 2);
  assert.deepEqual(products, original, 'preview must not mutate products');
  assert.equal(applyImportPlan(products, result.rows), 2);
  assert.equal(products[0].mainPrice, '6.25 USD/kg');
  assert.equal(products[0].variants[0].price, '8.15 USD/kg');
  assert.equal(products[0].variants[0].desc, 'Keep specification');
  assert.equal(products[0].image, 'keep.webp');
  assert.equal(products[0].published, false);
  assert.deepEqual(products[1], original[1]);
  assert.equal(products[0].variants[1].price, original[0].variants[1].price);
});

test('matches Russian, English and Chinese product names without IDs', () => {
  for (const name of ['ОРЕХИ КЕШЬЮ', 'cashew nuts', '腰果']) assert.equal(plan([['', name, '', 9]]).rows[0].productId, 'cashew');
});

test('uses ID, prevents mismatched names and never falls back from an unknown ID', () => {
  assert.equal(plan([['cashew', 'Supplier wording', '', 9]]).rows[0].status, 'change');
  assert.equal(plan([['unknown-id', 'Орехи кешью', '', 9]]).rows[0].status, 'error');
  assert.equal(plan([['cashew', 'Walnut Kernels', '', 9]]).rows[0].status, 'error');
});

test('unknown products/grades and ambiguous names cannot change prices', () => {
  const products = fixture();
  const result = plan([['not-found', '', '', 9], ['cashew', '', 'Not a grade', 9], ['cashew', '', '', '']], products);
  assert.ok(result.rows.every(row => row.status === 'error'));
  products.push({ ...structuredClone(products[0]), id: 'second-cashew' });
  assert.equal(plan([['', 'Орехи кешью', '', 9]], products).rows[0].status, 'error');
});

test('same numeric prices are unchanged despite comma and precision differences', () => {
  assert.equal(plan([['cashew', '', '', 5.75]]).rows[0].status, 'unchanged');
  assert.equal(plan([['cashew', '', 'Other grades', 'По запросу']]).rows[0].status, 'unchanged');
});

test('conflicting duplicates block all rows for the target; identical ones collapse', () => {
  assert.deepEqual(plan([['cashew', '', '', 6], ['cashew', '', '', 7]]).rows.map(row => row.status), ['error', 'error']);
  assert.deepEqual(plan([['cashew', '', '', 6], ['cashew', '', '', '6.00 USD/kg']]).rows.map(row => row.status), ['change', 'duplicate']);
  assert.deepEqual(plan([['cashew', '', '', 5.75], ['cashew', '', '', 6]]).rows.map(row => row.status), ['error', 'error']);
});

test('rejects missing/shared mapped columns and non-USD prices', () => {
  assert.ok(buildImportPlan([['Товар', 'Описание'], ['Орехи кешью', 9]], fixture()).error);
  assert.ok(buildImportPlan([header], fixture(), { mapping: { productId: 0, productName: -1, variant: -1, price: 0 } }).error);
  assert.ok(buildImportPlan([['ID', 'Цена, EUR/кг'], ['cashew', 9]], fixture(), { mapping: { productId: 0, productName: -1, variant: -1, price: 1 } }).error);
  for (const column of ['Закупочная цена', 'Cost', 'Цена USD/тонна', 'Price USD/lb', 'Цена за штуку', 'Цена за 100 кг', 'Цена USD/т']) assert.ok(buildImportPlan([['ID', column], ['cashew', 9]], fixture(), { mapping: { productId: 0, productName: -1, variant: -1, price: 1 } }).error, column);
});

test('stale prices and changed grades cause atomic failure without partial application', () => {
  const products = fixture(), result = plan([['cashew', '', '', 6], ['walnuts', '', '', 7]], products);
  products[1].mainPrice = '8 USD/kg';
  assert.throws(() => applyImportPlan(products, result.rows), /уже изменилась/);
  assert.equal(products[0].mainPrice, '5,75 USD/kg');
  const variant = plan([['cashew', '', 'WW320', 9]], products);
  products[0].variants[0].name = 'New grade';
  assert.throws(() => applyImportPlan(products, variant.rows), /Сорта изменились/);
});

test('row numbers retain empty spreadsheet rows and only selected prices apply', () => {
  const products = fixture();
  const result = buildImportPlan([['Title'], header, [], ['cashew', '', '', 6], ['walnuts', '', '', 7]], products, { headerRow: 1, mapping: guessColumns(header) });
  assert.deepEqual(result.rows.map(row => row.rowNumber), [4, 5]);
  applyImportPlan(products, [result.rows[1]]);
  assert.equal(products[0].mainPrice, '5,75 USD/kg');
  assert.equal(products[1].mainPrice, '7.00 USD/kg');
});

const context = { Uint8Array, ArrayBuffer, Buffer, TextDecoder, TextEncoder, console };
runInNewContext(readFileSync(new URL('../public/vendor/sheetjs/xlsx.full.min.js', import.meta.url), 'utf8'), context);
const XLSX = context.XLSX;

test('the shipped Excel library reads generated XLSX and XLS templates end to end', () => {
  assert.equal(XLSX.version, '0.20.3');
  for (const bookType of ['xlsx', 'biff8']) {
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet(templateRows(fixture())), 'Цены');
    const bytes = XLSX.write(book, { type: 'buffer', bookType });
    const read = XLSX.read(bytes, { type: 'buffer', raw: true });
    const rows = Array.from(XLSX.utils.sheet_to_json(read.Sheets['Цены'], { header: 1, raw: true, defval: '' }), row => Array.from(row));
    const result = buildImportPlan(rows, fixture());
    assert.equal(result.error, '');
    assert.ok(result.rows.length > fixture().length);
    assert.ok(result.rows.every(row => row.status === 'unchanged'));
    rows[1][3] = 9.25;
    const updated = buildImportPlan(rows, fixture());
    assert.equal(updated.rows[0].nextPrice, '9.25 USD/kg');
    assert.equal(updated.rows[0].status, 'change');
  }
});

test('the template covers every live product and grade without changing existing prices', () => {
  const products = JSON.parse(readFileSync(new URL('../public/data/products.json', import.meta.url), 'utf8')).products;
  const rows = templateRows(products), result = buildImportPlan(rows, products);
  assert.equal(rows.length - 1, products.reduce((sum, product) => sum + 1 + (product.variants?.length || 0), 0));
  assert.ok(result.rows.every(row => row.status === 'unchanged'));
});
