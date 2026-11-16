import { applyImportPlan, buildImportPlan, detectHeader, guessColumns, templateRows } from './price-import-core.js';

const MAX_ROWS = 10000, MAX_COLUMNS = 100, MAX_BYTES = 10 * 1024 * 1024;
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
let libraryPromise, generation = 0, workbook = null, matrix = [], plan = null, selected = new Set(), fileName = '', opener;
const admin = () => window.pologenkiPriceImportAdmin;

document.body.insertAdjacentHTML('beforeend', `<dialog id="priceImportDialog" class="pi-dialog" aria-labelledby="pi-title">
  <header class="pi-header"><div><span class="pi-eyebrow">Товары и сорта · USD/кг</span><h2 id="pi-title">Загрузить цены из Excel</h2><p>Проверьте изменения перед применением. Цены появятся на сайте после публикации.</p></div><button type="button" class="pi-close" data-pi-close aria-label="Закрыть импорт">×</button></header>
  <div class="pi-body">
    <div class="pi-file-actions"><label class="pi-upload">Выбрать Excel-файл<input id="pi-file" type="file" accept=".xlsx,.xls,.csv" aria-label="Выбрать файл с ценами"></label><button type="button" class="pi-secondary" id="pi-template">Скачать шаблон с товарами</button><span id="pi-filename">.xlsx, .xls или .csv · до 10 МБ</span></div>
    <p class="pi-help">В шаблоне уже есть товары и сорта. Меняйте столбец «Цена»: например, <b>5,75</b> или <b>По запросу</b>. Пустой сорт означает основную цену товара.</p>
    <p id="pi-notice" class="pi-notice" role="status" aria-live="polite" hidden></p>
    <details id="pi-mapping" class="pi-mapping" hidden><summary>Столбцы файла <span id="pi-sheet-description"></span><span class="pi-configure-label">Настроить</span></summary>
      <div class="pi-sheet-fields"><label>Лист<select id="pi-sheet"></select></label><label>Строка с заголовками<input id="pi-header-row" type="number" min="1" max="10000" value="1"></label></div>
      <div class="pi-column-fields"><label>ID товара<select id="pi-productId"></select></label><label>Название товара<select id="pi-productName"></select></label><label>Сорт<select id="pi-variant"></select></label><label>Цена для сайта<select id="pi-price"></select></label></div>
      <p>Товары сопоставляются по ID или названию. Сорт — по названию или коду, например WW320. Закупочные цены не импортируются.</p>
    </details>
    <section id="pi-preview" aria-label="Предпросмотр цен" hidden><div class="pi-summary" id="pi-summary"></div><div class="pi-table-wrap" tabindex="0" aria-label="Таблица изменений"><table><thead><tr><th><input id="pi-all" type="checkbox" aria-label="Выбрать все найденные изменения"></th><th>Строка</th><th>Товар / сорт</th><th>Было</th><th>Станет</th><th>Результат</th></tr></thead><tbody id="pi-rows"></tbody></table></div></section>
  </div><footer class="pi-footer"><span id="pi-footer-note">Сначала выберите файл или скачайте шаблон.</span><button type="button" class="pi-secondary" id="pi-cancel" data-pi-close>Отмена</button><button type="button" class="pi-apply" id="pi-apply" disabled>Применить цены</button></footer>
</dialog>`);

const dialog = document.getElementById('priceImportDialog');
const field = name => document.getElementById('pi-' + name);

function notice(message, error = false) {
  field('notice').textContent = message;
  field('notice').hidden = !message;
  field('notice').classList.toggle('is-error', error);
}

function loadLibrary() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  if (!libraryPromise) libraryPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/vendor/sheetjs/xlsx.full.min.js';
    script.onload = () => window.XLSX ? resolve(window.XLSX) : reject(new Error('Не удалось загрузить обработчик Excel.'));
    script.onerror = () => { script.remove(); reject(new Error('Не удалось загрузить обработчик Excel. Попробуйте ещё раз.')); };
    document.head.append(script);
  }).catch(error => { libraryPromise = null; throw error; });
  return libraryPromise;
}

function open(button) {
  if (!admin()?.getProducts().length) { admin()?.notify('Дождитесь загрузки товаров.'); return; }
  generation++;
  workbook = null; matrix = []; plan = null; selected.clear(); fileName = '';
  field('file').value = '';
  field('filename').textContent = '.xlsx, .xls или .csv · до 10 МБ';
  field('mapping').hidden = true; field('preview').hidden = true;
  field('apply').hidden = false; field('apply').disabled = true; field('apply').textContent = 'Применить цены';
  field('cancel').textContent = 'Отмена';
  field('footer-note').textContent = 'Сначала выберите файл или скачайте шаблон.';
  dialog.removeAttribute('aria-busy'); notice(''); opener = button;
  dialog.showModal();
}

function getMapping() {
  return Object.fromEntries(['productId', 'productName', 'variant', 'price'].map(key => [key, Number(field(key).value)]));
}

function configureColumns(mapping) {
  const headerRow = Number(field('header-row').value) - 1;
  const row = matrix[headerRow] || [];
  const count = Math.min(MAX_COLUMNS, Math.max(row.length, ...matrix.slice(headerRow + 1, headerRow + 6).map(cells => cells.length), 1));
  const options = Array.from({ length: count }, (_, index) => `<option value="${index}">${escape(window.XLSX.utils.encode_col(index))} · ${escape(row[index] || 'Без заголовка')}</option>`).join('');
  for (const key of ['productId', 'productName', 'variant', 'price']) {
    field(key).innerHTML = '<option value="-1">Не выбран</option>' + options;
    field(key).value = String(mapping[key] ?? -1);
  }
}

function readSheet() {
  const XLSX = window.XLSX, sheet = workbook.Sheets[field('sheet').value];
  const range = sheet?.['!fullref'] || sheet?.['!ref'];
  if (!range) throw new Error('Выбранный лист пуст. Выберите другой лист.');
  const bounds = XLSX.utils.decode_range(range);
  if (bounds.e.r >= MAX_ROWS || bounds.e.c >= MAX_COLUMNS) throw new Error('В листе должно быть не больше 10 000 строк и 100 столбцов.');
  matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: '', blankrows: true, range: { s: { r: 0, c: 0 }, e: bounds.e } });
  const detected = detectHeader(matrix);
  field('header-row').value = detected.headerRow + 1;
  field('header-row').max = matrix.length;
  configureColumns(detected.mapping);
  field('mapping').hidden = false;
  field('mapping').open = detected.mapping.price < 0 || detected.mapping.productId < 0 && detected.mapping.productName < 0;
  preview();
}

function preview() {
  notice('');
  selected.clear();
  field('preview').hidden = true; field('apply').disabled = true;
  const headerRow = Number(field('header-row').value) - 1;
  if (!Number.isInteger(headerRow) || headerRow < 0 || headerRow >= matrix.length) { notice('Укажите существующую строку с заголовками.', true); return; }
  const mapping = getMapping(), sheet = workbook.Sheets[field('sheet').value];
  field('sheet-description').textContent = `· ${field('sheet').value}, строка ${headerRow + 1}`;
  // Preserve foreign-currency/percentage formatting instead of interpreting its
  // underlying Excel number as a USD/kg price. Cached formula results are read.
  const rows = matrix.map((cells, index) => {
    if (index <= headerRow || mapping.price < 0) return cells;
    const cell = sheet[window.XLSX.utils.encode_cell({ r: index, c: mapping.price })];
    if (cell?.t !== 'n') return cells;
    const foreignFormat = /[€£₽¥%]|\b(?:EUR|GBP|RUB|CNY|RMB|JPY|CAD|AUD|CHF)\b|евро|руб|юан|фунт/iu.test(String(cell.z || '') + ' ' + String(cell.w || ''));
    if (!foreignFormat && (!cell.w || !/[^\d.,\s+-]/.test(cell.w))) return cells;
    const copy = cells.slice(); copy[mapping.price] = foreignFormat ? String(cell.w || cell.v) + ' (не USD/кг)' : cell.w; return copy;
  });
  plan = buildImportPlan(rows, admin().getProducts(), { headerRow, mapping });
  if (plan.error) { notice(plan.error, true); field('footer-note').textContent = 'Уточните столбцы файла для сопоставления.'; return; }
  plan.rows.filter(row => row.status === 'change').forEach(row => selected.add(row.rowNumber));
  const count = status => plan.rows.filter(row => row.status === status).length;
  field('summary').innerHTML = [['К обновлению', count('change')], ['Без изменений', count('unchanged')], ['С ошибками', count('error')], ['Повторы', count('duplicate')]].map(([label, number]) => `<div><strong>${number}</strong><span>${label}</span></div>`).join('');
  field('rows').innerHTML = plan.rows.map(row => `<tr class="pi-row-${row.status}"><td><input type="checkbox" data-pi-row="${row.rowNumber}" aria-label="Обновить строку ${row.rowNumber}" ${row.status === 'change' ? 'checked' : 'disabled'}></td><td>${row.rowNumber}</td><td><strong>${escape(row.productName || row.sourceName || 'Не указан товар')}</strong><small>${escape(row.variantName || row.sourceVariant || 'Основная цена')}</small></td><td>${escape(row.previousPrice || '—')}</td><td>${escape(row.nextPrice || row.sourcePrice || '—')}</td><td>${escape(row.message)}</td></tr>`).join('');
  field('preview').hidden = false;
  syncSelection();
}

function syncSelection() {
  const eligible = plan?.rows.filter(row => row.status === 'change') || [];
  field('all').checked = eligible.length > 0 && selected.size === eligible.length;
  field('all').indeterminate = selected.size > 0 && selected.size < eligible.length;
  field('all').disabled = !eligible.length;
  field('apply').disabled = !selected.size;
  field('apply').textContent = selected.size ? `Применить цены · ${selected.size}` : 'Применить цены';
  const errors = plan?.rows.filter(row => row.status === 'error').length || 0;
  field('footer-note').textContent = `Выбрано позиций: ${selected.size}. ${errors ? 'Строки с ошибками не будут применены.' : 'Публикация — отдельной кнопкой в админке.'}`;
}

async function readFile(file) {
  const current = ++generation;
  workbook = null; matrix = []; plan = null; selected.clear();
  field('mapping').hidden = true; field('preview').hidden = true; field('apply').disabled = true;
  field('filename').textContent = file?.name || '.xlsx, .xls или .csv · до 10 МБ';
  if (!file) return;
  if (!/\.(xlsx|xls|csv)$/i.test(file.name)) { notice('Выберите файл .xlsx, .xls или .csv.', true); return; }
  if (!file.size || file.size > MAX_BYTES) { notice('Файл должен быть непустым и не больше 10 МБ.', true); return; }
  dialog.setAttribute('aria-busy', 'true'); notice('Читаем файл…');
  field('footer-note').textContent = 'Подготавливаем предпросмотр.';
  try {
    const XLSX = await loadLibrary(), bytes = await file.arrayBuffer();
    if (current !== generation || !dialog.open) return;
    const options = { type: 'array', raw: true, cellDates: true, cellNF: true, cellFormula: false, cellHTML: false, bookVBA: false, sheetRows: MAX_ROWS + 1 };
    let input = bytes;
    if (/\.csv$/i.test(file.name)) {
      try { input = new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { input = new TextDecoder('windows-1251').decode(bytes); }
      options.type = 'string';
    }
    workbook = XLSX.read(input, options);
    const sheets = workbook.SheetNames.filter(name => workbook.Sheets[name]?.['!ref']);
    if (!sheets.length) throw new Error('В файле нет заполненных листов.');
    fileName = file.name; field('filename').textContent = fileName;
    field('sheet').innerHTML = sheets.map(name => `<option>${escape(name)}</option>`).join('');
    const preferred = sheets.find(name => /^(цены|prices)$/i.test(name));
    if (preferred) field('sheet').value = preferred;
    readSheet();
  } catch (error) {
    if (current === generation) { notice('Не удалось прочитать файл. ' + (error.message || 'Сохраните обычный .xlsx без пароля.'), true); field('footer-note').textContent = 'Выберите другой файл или исправьте таблицу.'; }
  } finally { if (current === generation) dialog.removeAttribute('aria-busy'); }
}

async function downloadTemplate() {
  const button = field('template'); button.disabled = true; notice('Готовим шаблон…');
  try {
    const XLSX = await loadLibrary(), book = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet(templateRows(admin().getProducts()));
    sheet['!cols'] = [{ wch: 24 }, { wch: 34 }, { wch: 35 }, { wch: 22 }];
    sheet['!autofilter'] = { ref: sheet['!ref'] };
    for (let row = 1; row <= XLSX.utils.decode_range(sheet['!ref']).e.r; row++) { const cell = sheet[XLSX.utils.encode_cell({ r: row, c: 3 })]; if (cell?.t === 'n') cell.z = '0.00####'; }
    XLSX.utils.book_append_sheet(book, sheet, 'Цены');
    XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([
      ['Как обновить цены Pologenki'],
      ['Меняйте столбец «Цена, USD/кг» на листе «Цены». ID товара и названия сортов нужны для сопоставления.'],
      ['Пустой сорт — основная цена товара. Строки с сортами обновляют соответствующий сорт.'],
      ['Допустимы числа с точкой или запятой и текст «По запросу». Все цены — USD за килограмм.'],
      ['Лишние строки можно удалить. Отсутствующие в файле товары и сорта не изменятся.'],
      ['Загрузите файл в админку, проверьте таблицу и нажмите «Применить цены».'],
      ['Затем нажмите «Опубликовать» в админке, чтобы сохранить изменения на сайте.'],
    ]), 'Инструкция');
    XLSX.writeFile(book, 'pologenki-prices.xlsx', { compression: true }); notice('Шаблон скачан. Заполните цены и выберите этот файл.');
  } catch (error) { notice(error.message || 'Не удалось подготовить шаблон.', true); } finally { button.disabled = false; }
}

document.addEventListener('click', event => { const button = event.target.closest('[data-price-import-open]'); if (button) open(button); });
dialog.addEventListener('click', event => {
  if (event.target.closest('[data-pi-close]')) dialog.close();
  if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); }
});
dialog.addEventListener('close', () => { generation++; dialog.removeAttribute('aria-busy'); opener?.focus({ preventScroll: true }); });
field('file').addEventListener('change', event => { const file = event.target.files[0]; event.target.value = ''; readFile(file); });
field('template').addEventListener('click', downloadTemplate);
field('sheet').addEventListener('change', () => { try { readSheet(); } catch (error) { field('mapping').hidden = true; field('preview').hidden = true; field('apply').disabled = true; notice(error.message, true); } });
field('header-row').addEventListener('change', () => { configureColumns(guessColumns(matrix[Number(field('header-row').value) - 1])); preview(); });
['productId', 'productName', 'variant', 'price'].forEach(key => field(key).addEventListener('change', preview));
field('rows').addEventListener('change', event => { const row = Number(event.target.dataset.piRow); if (!row) return; event.target.checked ? selected.add(row) : selected.delete(row); syncSelection(); });
field('all').addEventListener('change', event => { selected.clear(); if (event.target.checked) plan.rows.filter(row => row.status === 'change').forEach(row => selected.add(row.rowNumber)); field('rows').querySelectorAll('input:not(:disabled)').forEach(input => { input.checked = event.target.checked; }); syncSelection(); });
field('apply').addEventListener('click', () => {
  try {
    const count = applyImportPlan(admin().getProducts(), plan.rows.filter(row => selected.has(row.rowNumber)));
    admin().didApply(count, fileName);
    field('apply').hidden = true; field('mapping').hidden = true; field('preview').hidden = true;
    notice(`Готово: обновлено позиций — ${count}. Нажмите «Опубликовать» в админке, чтобы цены появились на сайте.`);
    field('footer-note').textContent = 'Цены применены в админке и готовы к публикации.';
    field('cancel').textContent = 'Закрыть';
    workbook = null; matrix = []; plan = null; selected.clear();
  } catch (error) { notice(error.message, true); }
});
