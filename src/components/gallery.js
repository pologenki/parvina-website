import x from '../assets/import-icons/x.svg?raw';
import left from '../assets/import-icons/arrow-left.svg?raw';
import right from '../assets/import-icons/arrow-right.svg?raw';
import diagonal from '../assets/import-icons/arrow-up-right.svg?raw';
import pause from '../assets/import-icons/pause.svg?raw';
import play from '../assets/import-icons/play.svg?raw';
import { createGalleryReel } from './gallery-reel.js';

const icons = { x, left, right, diagonal, pause, play };
const icon = name => icons[name].replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const copy = {
  ru: { title: 'Галерея', intro: 'За каждой поставкой — личные встречи.', all: 'Все фото', exhibitions: 'Выставки', meetings: 'Встречи', production: 'Производство', photos: 'Фотографий', open: 'Открыть фото', prev: 'Предыдущее фото', next: 'Следующее фото', close: 'Закрыть галерею', pause: 'Остановить движение', play: 'Включить движение', event: 'Событие', place: 'Место', format: 'Направление', year: 'Год', focus: 'Продукт', cashew: 'Кешью', fullscreen: 'Фото целиком', details: 'Вернуться к описанию', scroll: 'Листайте галерею', loading: 'Загружаем фотографии…', error: 'Не удалось загрузить фотографии.', retry: 'Попробовать снова', loadError: 'Фото не загрузилось.', original: 'Открыть оригинал', gallery: 'Выбор фотографии' },
  en: { title: 'Gallery', intro: 'Behind every shipment — a personal connection.', all: 'All photos', exhibitions: 'Exhibitions', meetings: 'Meetings', production: 'Production', photos: 'Photographs', open: 'Open photo', prev: 'Previous photo', next: 'Next photo', close: 'Close gallery', pause: 'Pause motion', play: 'Resume motion', event: 'Event', place: 'Location', format: 'Focus', year: 'Year', focus: 'Product', cashew: 'Cashews', fullscreen: 'View entire photo', details: 'Back to details', scroll: 'Explore the gallery', loading: 'Loading photographs…', error: 'Unable to load photographs.', retry: 'Try again', loadError: 'Photo could not load.', original: 'Open original', gallery: 'Choose a photograph' },
  cn: { title: '影像集', intro: '每一批货物背后，都有面对面的交流。', all: '全部照片', exhibitions: '展会', meetings: '商务会面', production: '生产现场', photos: '照片', open: '查看照片', prev: '上一张照片', next: '下一张照片', close: '关闭影像集', pause: '暂停动画', play: '继续动画', event: '活动', place: '地点', format: '主题', year: '年份', focus: '产品', cashew: '腰果', fullscreen: '查看完整照片', details: '返回介绍', scroll: '浏览影像集', loading: '正在加载照片…', error: '无法加载照片。', retry: '重试', loadError: '照片加载失败。', original: '查看原图', gallery: '选择照片' },
};
// Editorial labels describe the existing photographs; their original captions remain in portfolio.json.
const captions = [
  { id: 'img002', type: 'exhibitions', title: ['Gulfood Dubai', 'Gulfood Dubai', 'Gulfood Dubai'], place: ['Дубай, ОАЭ', 'Dubai, UAE', '迪拜，阿联酋'], event: 'Gulfood', year: '2023', height: 320 },
  { id: 'img003', type: 'production', title: ['Производство кешью', 'Cashew production', '腰果生产'], place: ['Вьетнам', 'Vietnam', '越南'], event: null, height: 274 },
  { id: 'img007', type: 'meetings', title: ['Golden Sun', 'Golden Sun', 'Golden Sun'], place: ['Дубай, ОАЭ', 'Dubai, UAE', '迪拜，阿联酋'], event: 'Gulfood', height: 365 },
  { id: 'img013', type: 'meetings', title: ['Anhui Yanzhifang', 'Anhui Yanzhifang', 'Anhui Yanzhifang'], place: ['Кёльн, Германия', 'Cologne, Germany', '科隆，德国'], event: 'Anuga', year: '2025', height: 405 },
  { id: 'img014', type: 'meetings', title: ['Baschi International', 'Baschi International', 'Baschi International'], place: ['Кёльн, Германия', 'Cologne, Germany', '科隆，德国'], event: 'Anuga', year: '2025', height: 340 },
  { id: 'img008', type: 'exhibitions', title: ['Gulfood Dubai', 'Gulfood Dubai', 'Gulfood Dubai'], place: ['Дубай, ОАЭ', 'Dubai, UAE', '迪拜，阿联酋'], event: 'Gulfood', year: '2024', height: 390 },
  { id: 'img011', type: 'production', title: ['На производстве', 'At the source', '深入生产现场'], place: ["Кот-д’Ивуар", 'Côte d’Ivoire', '科特迪瓦'], event: null, height: 274 },
  { id: 'img012', type: 'production', title: ['Контроль качества', 'Quality control', '质量检验'], place: ["Кот-д’Ивуар", 'Côte d’Ivoire', '科特迪瓦'], event: null, height: 370 },
  { id: 'photo_2026-01-29_11-40-39', type: 'exhibitions', title: ['Gulfood Dubai', 'Gulfood Dubai', 'Gulfood Dubai'], place: ['Дубай, ОАЭ', 'Dubai, UAE', '迪拜，阿联酋'], event: 'Gulfood', year: '2026', height: 415 },
  { id: 'photo_2026-01-26_15-51-28', type: 'meetings', title: ['Партнёры из Туниса', 'Tunisian partners', '突尼斯合作伙伴'], place: ['Дубай, ОАЭ', 'Dubai, UAE', '迪拜，阿联酋'], event: 'Gulfood', year: '2026', height: 340 },
  { id: 'photo_2026-01-26_15-51-29', type: 'meetings', title: ['FIT Dates', 'FIT Dates', 'FIT Dates'], place: ['Дубай, ОАЭ', 'Dubai, UAE', '迪拜，阿联酋'], event: 'Gulfood', year: '2026', height: 385 },
  { id: 'photo_2026-01-26_11-39-43', type: 'meetings', title: ['Gongli International', 'Gongli International', 'Gongli International'], place: ['Дубай, ОАЭ', 'Dubai, UAE', '迪拜，阿联酋'], event: 'Gulfood', year: '2026', height: 320 },
];

export function renderGallery(lang = 'en') {
  const c = copy[lang] || copy.en;
  const titleParts = lang === 'ru' ? ['Га', 'лерея'] : lang === 'cn' ? ['影', '像集'] : ['Ga', 'llery'];
  return `<section id="portfolio" class="portfolio-section pg-section" aria-labelledby="pg-title" data-gallery-lang="${lang}">
    <div class="pg-container">
      <header class="pg-heading"><h2 id="pg-title" aria-label="${c.title}"><span class="pg-title-start" aria-hidden="true">${titleParts[0]}</span><span class="pg-title-video" aria-hidden="true"><video muted loop playsinline preload="none" poster="/gallery/video/almonds-poster.webp"><source data-src="/gallery/video/almonds-loop-small.webm" type="video/webm"><source data-src="/gallery/video/almonds-loop-small.mp4" type="video/mp4"></video></span><span class="pg-title-end" aria-hidden="true">${titleParts[1]}</span></h2><div class="pg-heading-line"><p>${c.intro}</p><span class="pg-total"></span></div></header>
      <div class="pg-shelf"><div class="pg-track" tabindex="0" role="region" aria-roledescription="carousel" aria-label="${c.title}" aria-busy="true"><p class="pg-load-status" role="status">${c.loading}</p></div><span class="pg-cursor" aria-hidden="true"><span class="pg-cursor-label">${c.open}</span>${icon('diagonal')}</span></div>
      <footer class="pg-tools"><div class="pg-filters" role="group" aria-label="${c.gallery}">${['all', 'exhibitions', 'meetings', 'production'].map((key, i) => `<button type="button" data-pg-filter="${key}" aria-pressed="${i === 0}">${c[key]}</button>`).join('')}</div><div class="pg-controls"><span class="pg-position" aria-live="polite"></span><button class="pg-control" type="button" data-pg-step="-1" aria-label="${c.prev}">${icon('left')}</button><button class="pg-control" type="button" data-pg-pause aria-pressed="false" aria-label="${c.pause}">${icon('pause')}</button><button class="pg-control" type="button" data-pg-step="1" aria-label="${c.next}">${icon('right')}</button></div></footer>
    </div>
    <dialog class="pg-dialog" aria-labelledby="pg-dialog-title">
      <div class="pg-dialog-layout"><div class="pg-dialog-panel"><button type="button" class="pg-close" data-pg-close aria-label="${c.close}">${icon('x')}</button><div class="pg-dialog-scroll"></div></div><nav class="pg-dialog-rail" aria-label="${c.gallery}"></nav></div>
    </dialog>
  </section>`;
}

let dispose;
export async function initGallery(lang = 'en') {
  dispose?.();
  const section = document.querySelector('#portfolio.pg-section');
  if (!section) return;
  const c = copy[lang] || copy.en, languageIndex = lang === 'ru' ? 0 : lang === 'cn' ? 2 : 1;
  const controller = new AbortController(), { signal } = controller, opts = { signal };
  const track = section.querySelector('.pg-track'), shelf = section.querySelector('.pg-shelf');
  const dialog = section.querySelector('.pg-dialog'), dialogBody = section.querySelector('.pg-dialog-scroll');
  const rail = section.querySelector('.pg-dialog-rail'), pauseButton = section.querySelector('[data-pg-pause]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compactCaption = matchMedia('(max-width:700px), (max-height:540px)');
  const captionLabel = lang === 'ru' ? 'Описание фотографии' : lang === 'cn' ? '照片说明' : 'About this photo';
  compactCaption.addEventListener('change', () => { const caption = dialogBody.querySelector('.pg-caption'); if (caption) caption.open = !compactCaption.matches; }, opts);
  let items = [], filtered = [], filter = 'all', current = 0, opener, paused = reduced.matches, onScreen = false;
  let reel, exitAnimation, switchingAnimation, drag = null, dragged = false;
  const video = section.querySelector('.pg-title-video video');
  const wrap = index => (index % items.length + items.length) % items.length;
  const text = (item, key) => item[`${key}_${lang}`] || item[key] || '';
  const title = item => item.editorial?.title[languageIndex] || text(item, 'title');
  const place = item => item.editorial?.place[languageIndex] || '';
  const number = index => String(index + 1).padStart(2, '0');
  const fit = () => {
    section.style.setProperty('--pg-viewport-width', `${document.documentElement.clientWidth}px`);
    const heading = section.querySelector('#pg-title'), start = heading.querySelector('.pg-title-start'), end = heading.querySelector('.pg-title-end');
    heading.style.setProperty('--pg-title-size', '100px');
    const textWidth = element => { const range = document.createRange(); range.selectNodeContents(element); return range.getBoundingClientRect().width; };
    const total = matchMedia('(max-width:767px)').matches ? textWidth(end) : textWidth(start) + textWidth(end) + 150;
    heading.style.setProperty('--pg-title-size', `${Math.floor(heading.clientWidth / total * 100 * .99)}px`);
  };
  fit(); window.addEventListener('resize', fit, opts);
  const observer = new IntersectionObserver(entries => {
    onScreen = entries[0].isIntersecting; section.classList.toggle('pg-in-view', onScreen); syncMotion();
  }, { threshold: 0.12 }); observer.observe(section);

  function syncMotion() {
    section.classList.toggle('pg-motion-paused', paused || reduced.matches || document.hidden || dialog.open);
    const stopped = paused || reduced.matches;
    pauseButton.disabled = reduced.matches;
    pauseButton.setAttribute('aria-pressed', String(stopped)); pauseButton.setAttribute('aria-label', stopped ? c.play : c.pause); pauseButton.innerHTML = icon(stopped ? 'play' : 'pause');
    const visible = onScreen && !document.hidden && !dialog.open;
    reel?.setActive(visible); reel?.sync();
    if (visible && !stopped) {
      if (!video.dataset.loaded) { video.dataset.loaded = 'true'; video.querySelectorAll('source').forEach(source => { source.src = source.dataset.src; }); video.muted = true; video.load(); }
      video.play().catch(() => {});
    } else video.pause();
  }
  reduced.addEventListener('change', () => { paused = reduced.matches; syncMotion(); }, opts);
  document.addEventListener('visibilitychange', syncMotion, opts);

  function photo(item, sizes, full = false) {
    const p = item.processed;
    const alt = esc(text(item, 'title'));
    if (!p) return `<img src="${esc(item.img)}" alt="${alt}" loading="${full ? 'eager' : 'lazy'}" decoding="async">`;
    const variants = full ? p.variants : p.variants.filter(v => v.width <= 960);
    const source = variants[variants.length - 1];
    const avif = (p.avifVariants || []).filter(v => full || v.width <= 960);
    const image = `<img src="${esc(source.src)}" srcset="${variants.map(v => `${esc(v.src)} ${v.width}w`).join(', ')}" sizes="${sizes}" width="${p.width}" height="${p.height}" alt="${alt}" loading="${full ? 'eager' : 'lazy'}" decoding="async">`;
    return avif.length ? `<picture><source type="image/avif" srcset="${avif.map(v => `${esc(v.src)} ${v.width}w`).join(', ')}" sizes="${sizes}">${image}</picture>` : image;
  }

  function renderTrack() {
    filtered = items.filter(item => filter === 'all' || item.editorial?.type === filter);
    track.innerHTML = `<div class="pg-reel">${filtered.map((item, i) => `<button type="button" class="pg-card" data-pg-index="${items.indexOf(item)}" data-pg-position="${i}" data-pg-name="${esc(title(item))}" aria-haspopup="dialog" aria-label="${esc(c.open + ': ' + text(item, 'title'))}"><span class="pg-card-label"><span>${esc(title(item))}</span>${icon('diagonal')}</span><span class="pg-card-media">${photo(item, '(max-width:767px) 92vw, 260px')}</span></button>`).join('')}</div>`;
    track.setAttribute('aria-busy', 'false');
    section.querySelector('.pg-total').textContent = `${String(filtered.length).padStart(2, '0')} / ${c.photos}`;
    section.querySelectorAll('[data-pg-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.pgFilter === filter)));
    reel?.refresh(true);
  }

  function renderThumbs() {
    rail.innerHTML = items.map((item, i) => `<button type="button" class="pg-thumb" data-pg-select="${i}" aria-label="${esc(c.open + ': ' + text(item, 'title'))}" title="${esc(text(item, 'title'))}"><span class="pg-thumb-image">${photo(item, '70px')}<span>${number(i)}</span></span></button>`).join('');
  }

  function renderDialog() {
    const item = items[current], meta = item.editorial;
    const information = [[c.place, place(item)], [c.event, meta?.event], [c.year, meta?.year]].filter(([, value]) => value);
    dialog.classList.toggle('pg-portrait', !!item.processed && item.processed.height > item.processed.width);
    dialogBody.innerHTML = `<article class="pg-story"><figure class="pg-story-photo">${photo(item, '(max-width:700px) 92vw, (max-width:1100px) 65vw, 880px', true)}<p class="pg-image-error" hidden>${c.loadError} <a href="${esc(item.img)}" target="_blank" rel="noopener">${c.original}</a></p></figure><div class="pg-story-info"><header class="pg-story-heading"><h2 id="pg-dialog-title" tabindex="-1">${esc(title(item))}</h2></header>${information.length ? `<dl class="pg-facts">${information.map(([key, value], i) => `<div${i === 0 ? ' class="pg-fact-place"' : ''}><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>` : ''}<details class="pg-caption"${compactCaption.matches ? '' : ' open'}><summary>${captionLabel}</summary><p class="pg-description">${esc(text(item, 'desc').trim())}</p></details></div><div class="pg-story-bottom"><div class="pg-story-nav"><button type="button" class="pg-control" data-pg-direction="-1" aria-label="${c.prev}">${icon('left')}</button><span aria-live="polite">${number(current)} / ${String(items.length).padStart(2, '0')}</span><button type="button" class="pg-control" data-pg-direction="1" aria-label="${c.next}">${icon('right')}</button></div></div></article>`;
    dialogBody.scrollTop = 0;
    rail.querySelectorAll('.pg-thumb').forEach((button, i) => { button.classList.toggle('is-current', i === current); if (i === current) button.setAttribute('aria-current', 'true'); else button.removeAttribute('aria-current'); });
    const active = rail.querySelector('.is-current');
    if (matchMedia('(max-width:700px)').matches) rail.scrollTo({ left: active.offsetLeft - rail.clientWidth / 2 + active.offsetWidth / 2, behavior: reduced.matches ? 'instant' : 'smooth' });
    else rail.scrollTo({ top: active.offsetTop - rail.clientHeight / 2 + active.offsetHeight / 2, behavior: reduced.matches ? 'instant' : 'smooth' });
    const image = dialogBody.querySelector('.pg-story-photo img');
    image.addEventListener('error', () => { if (image.dataset.fallback) { image.hidden = true; dialogBody.querySelector('.pg-image-error').hidden = false; } else { image.dataset.fallback = 'true'; image.removeAttribute('srcset'); image.src = item.img; } }, { once: false, signal });
  }

  function open(index, source) {
    if (!items.length) return;
    exitAnimation?.cancel(); exitAnimation = null; dialog.classList.remove('pg-closing');
    current = wrap(index); renderThumbs(); renderDialog();
    if (!dialog.open) {
      opener = source || document.activeElement;
      const rect = opener?.getBoundingClientRect();
      dialog.style.setProperty('--pg-origin', rect ? `${(rect.x + rect.width / 2) / innerWidth * 100}% ${Math.min(100, Math.max(0, (rect.y + rect.height / 2) / innerHeight * 100))}%` : '50% 70%');
      document.documentElement.classList.add('pg-gallery-open'); dialog.showModal();
    }
    dialogBody.querySelector('h2').focus({ preventScroll: true }); syncMotion();
    window.trackSiteEvent?.('open_portfolio_project', { project_title: text(items[current], 'title'), project_index: current + 1 });
  }

  function select(index) {
    if (!dialog.open) return;
    current = wrap(index); switchingAnimation?.cancel(); renderDialog();
    if (!reduced.matches) switchingAnimation = dialogBody.querySelector('.pg-story').animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' });
    // Keep a persistent navigation button focused; the replaced story heading otherwise receives focus.
    if (!dialog.contains(document.activeElement) || document.activeElement === document.body) dialogBody.querySelector('h2').focus({ preventScroll: true });
  }

  function close() {
    if (!dialog.open || dialog.classList.contains('pg-closing')) return;
    if (reduced.matches) { dialog.close(); return; }
    dialog.classList.add('pg-closing');
    exitAnimation = dialog.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(20px) scale(.985)' }], { duration: 200, easing: 'ease-in', fill: 'forwards' });
    exitAnimation.finished.then(() => { if (!signal.aborted) dialog.close(); }).catch(() => {});
  }

  dialog.addEventListener('close', () => {
    exitAnimation?.cancel(); exitAnimation = null; dialog.classList.remove('pg-closing');
    document.documentElement.classList.remove('pg-gallery-open');
    opener?.isConnected && opener.focus({ preventScroll: true }); syncMotion();
  }, opts);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); }, opts);
  dialog.addEventListener('click', event => { if (event.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close(); }, opts);
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; }
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault(); select(current + (event.key === 'ArrowRight' ? 1 : -1));
  }, opts);
  section.addEventListener('click', event => {
    const card = event.target.closest('[data-pg-index]');
    if (card) { if (dragged) { event.preventDefault(); return; } card.focus({ preventScroll: true }); open(Number(card.dataset.pgIndex), card); }
    if (event.target.closest('[data-pg-close]')) close();
    const thumb = event.target.closest('[data-pg-select]'); if (thumb) select(Number(thumb.dataset.pgSelect));
    const direction = event.target.closest('[data-pg-direction]'); if (direction) select(current + Number(direction.dataset.pgDirection));
    if (event.target.closest('[data-pg-pause]')) { paused = !paused; syncMotion(); }
    const step = event.target.closest('[data-pg-step]'); if (step) reel?.step(Number(step.dataset.pgStep));
    const filterButton = event.target.closest('[data-pg-filter]'); if (filterButton) { filter = filterButton.dataset.pgFilter; renderTrack(); }
  }, opts);
  track.addEventListener('keydown', event => {
    const card = event.target.closest('.pg-card');
    if (card && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      if (!event.repeat) open(Number(card.dataset.pgIndex), card);
      return;
    }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const cards = [...track.querySelectorAll('.pg-card')], active = cards.indexOf(document.activeElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : (active + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + cards.length) % cards.length;
    cards[next]?.focus({ preventScroll: true }); reel?.center(next);
  }, opts);
  shelf.addEventListener('pointerleave', () => { shelf.classList.remove('pg-hovering'); }, opts);
  shelf.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const card = event.target.closest('.pg-card'), r = shelf.getBoundingClientRect();
    shelf.classList.toggle('pg-hovering', !!card && !drag);
    shelf.querySelector('.pg-cursor-label').textContent = card ? `${c.open} · ${card.dataset.pgName}` : c.open;
    shelf.querySelector('.pg-cursor').style.transform = `translate3d(${event.clientX - r.left}px,${event.clientY - r.top}px,0) translate(-50%,-50%)`;
  }, opts);
  track.addEventListener('pointerdown', event => {
    dragged = false;
    if (event.pointerType === 'mouse' && event.button === 0 && innerWidth >= 768) drag = { x: event.clientX, left: track.scrollLeft, id: event.pointerId };
  }, opts);
  track.addEventListener('pointermove', event => {
    if (!drag) return; const distance = event.clientX - drag.x;
    if (Math.abs(distance) > 8) { dragged = true; track.classList.add('pg-dragging'); track.setPointerCapture(drag.id); reel?.dragTo(drag.left - distance); }
  }, opts);
  const endDrag = () => { if (dragged) reel?.settle(); drag = null; track.classList.remove('pg-dragging'); setTimeout(() => { dragged = false; }, 0); };
  track.addEventListener('pointerup', endDrag, opts); track.addEventListener('pointercancel', endDrag, opts);
  track.addEventListener('dragstart', event => event.preventDefault(), opts);
  let touch;
  dialogBody.addEventListener('touchstart', event => { if (!event.target.closest('.pg-story-photo') || event.touches.length !== 1) { touch = null; return; } touch = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }, { ...opts, passive: true });
  dialogBody.addEventListener('touchend', event => { if (!touch) return; const dx = event.changedTouches[0].clientX - touch.x, dy = event.changedTouches[0].clientY - touch.y; if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 2) select(current + (dx < 0 ? 1 : -1)); touch = null; }, { ...opts, passive: true });
  dispose = () => { controller.abort(); observer.disconnect(); reel?.dispose(); video.pause(); exitAnimation?.cancel(); switchingAnimation?.cancel(); if (dialog.open) dialog.close(); document.documentElement.classList.remove('pg-gallery-open'); };
  try {
    const [response, manifest] = await Promise.all([fetch('/data/portfolio.json', { signal }), fetch('/gallery/photos.json', { signal }).then(r => r.ok ? r.json() : {}).catch(() => ({}))]);
    if (!response.ok) throw new Error('Gallery data unavailable');
    const data = await response.json(); if (signal.aborted) return;
    items = (data.items || []).filter(item => item.published !== false && item.img).map(item => { const id = item.img.split('/').pop().replace(/\.[^.]+$/, ''); return { ...item, editorial: captions.find(e => e.id === id), processed: manifest[id] }; });
    if (!items.length) throw new Error('Gallery is empty');
    renderTrack();
    reel = createGalleryReel({ track, signal, reduced, isPaused: () => paused, onIndex: index => { section.querySelector('.pg-position').textContent = `${number(index)} / ${String(filtered.length).padStart(2, '0')}`; }, onBrowse: enabled => { section.querySelectorAll('[data-pg-step]').forEach(button => { button.disabled = !enabled; }); } });
    reel.refresh(true); section.classList.add('pg-ready'); syncMotion();
    document.fonts.ready.then(() => { if (!signal.aborted) fit(); });
    if (location.hash === '#portfolio') { await document.fonts.ready; requestAnimationFrame(() => requestAnimationFrame(() => { if (!signal.aborted) window.scrollTo({ top: section.getBoundingClientRect().top + scrollY - (document.querySelector('.pv-site-header')?.offsetHeight || 0) - 12, behavior: 'instant' }); })); }
  } catch (error) {
    if (signal.aborted) return;
    track.setAttribute('aria-busy', 'false'); track.innerHTML = `<div class="pg-load-status" role="status"><p>${c.error}</p><button type="button" class="pg-retry">${c.retry}</button></div>`;
    track.querySelector('.pg-retry').addEventListener('click', () => initGallery(lang), opts);
  }
}
