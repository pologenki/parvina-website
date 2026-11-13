import { t, getCurrentLanguage } from '../utils/i18n.js';
import { initDeferredImages } from '../utils/deferred-images.js';

const iconFiles = import.meta.glob('../assets/import-icons/*.svg', { query: '?raw', import: 'default', eager: true });
function icon(name, extra = '') {
  const source = iconFiles[`../assets/import-icons/${name}.svg`];
  if (!source) throw new Error(`Missing import service icon: ${name}`);
  const svg = source.replace('<svg', '<svg aria-hidden="true" focusable="false"').replace(/<(path|circle|rect|line|polyline|polygon|ellipse)\b/g, '<$1 pathLength="1"');
  return `<span class="import-icon ${extra}" aria-hidden="true">${svg}</span>`;
}
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const services = [
  { id: 'sourcing', title: 'supplierSourcing', description: 'supplierDescription', outcome: 'sourcingOutcome', slug: 'supplier-sourcing', icon: 'search', steps: ['search', 'shield-check', 'package-check'] },
  { id: 'negotiation', title: 'contractNegotiation', description: 'contractDescription', outcome: 'negotiationOutcome', slug: 'contract-negotiation', icon: 'handshake', steps: ['handshake', 'clipboard-check', 'file-check'] },
  { id: 'logistics', title: 'logisticsManagement', description: 'logisticsDescription', outcome: 'logisticsOutcome', slug: 'logistics-coordination', icon: 'truck', steps: ['route', 'ship', 'warehouse'] },
  { id: 'documents', title: 'tradeDocumentation', description: 'documentationDescription', outcome: 'documentsOutcome', slug: 'trade-documentation', icon: 'file-check', steps: ['file-text', 'shield-check', 'clipboard-check'] },
  { id: 'monitoring', title: 'shipmentMonitoring', description: 'monitoringDescription', outcome: 'monitoringOutcome', slug: 'shipment-monitoring', icon: 'radar', steps: ['package', 'truck', 'map-pin'] },
  { id: 'full', title: 'fullServiceImport', description: 'importDescription', outcome: 'fullOutcome', slug: 'full-service-import', icon: 'package-check', steps: ['search', 'file-check', 'warehouse'] },
];
export { services as importServices, icon as importServiceIcon };
const copy = {
  ru: {
    eyebrow: 'Сопровождение импорта', heading: 'Услуги по управлению', emphasis: 'импортом.', all: 'Все услуги', close: 'Закрыть услугу', previous: 'Предыдущая услуга', next: 'Следующая услуга',
    paper: 'ВАША ПОСТАВКА', included: 'Что входит', details: 'Полное описание услуги', pause: 'Приостановить анимацию услуг', play: 'Включить анимацию услуг',
    phases: [['Поиск', 'Проверка', 'Образцы'], ['Цена', 'Условия', 'Контракт'], ['Маршрут', 'Погрузка', 'Доставка'], ['Инвойс', 'Сертификаты', 'Проверка'], ['Отгрузка', 'В пути', 'Прибытие'], ['Поставщик', 'Документы', 'Склад']],
  },
  en: {
    eyebrow: 'Import support', heading: 'Import management', emphasis: 'services.', all: 'All services', close: 'Close service', previous: 'Previous service', next: 'Next service',
    paper: 'YOUR SHIPMENT', included: 'What’s included', details: 'Full service description', pause: 'Pause service animations', play: 'Play service animations',
    phases: [['Source', 'Verify', 'Samples'], ['Price', 'Terms', 'Contract'], ['Route', 'Loading', 'Delivery'], ['Invoice', 'Certificates', 'Review'], ['Dispatch', 'In transit', 'Arrival'], ['Supplier', 'Documents', 'Warehouse']],
  },
  cn: {
    eyebrow: '进口业务支持', heading: '进口管理', emphasis: '服务。', all: '所有服务', close: '关闭服务', previous: '上一项服务', next: '下一项服务',
    paper: '您的货物', included: '服务内容', details: '完整服务说明', pause: '暂停服务动画', play: '播放服务动画',
    phases: [['寻找', '核实', '样品'], ['价格', '条款', '合同'], ['路线', '装货', '交付'], ['发票', '证书', '审核'], ['发货', '在途', '到货'], ['供应商', '文件', '仓库']],
  },
};
function pageUrl(service, lang) {
  return `${lang === 'ru' ? '/ru' : lang === 'cn' ? '/zh-cn' : ''}/services/${service.slug}/`;
}
function art(service, large = false) {
  const source = `${large ? 'src' : 'data-lazy-src'}="/import-services/${service.id}-640.webp" ${large ? 'srcset' : 'data-lazy-srcset'}="/import-services/${service.id}-640.webp 640w, /import-services/${service.id}-1280.webp 1280w"`;
  return `<div class="import-art import-art--${service.id}${large ? ' import-art--large' : ''}" aria-hidden="true">
    <img class="import-art-image" ${source} sizes="${large ? '(max-width: 700px) 80vw, 500px' : '260px'}" alt="" width="1280" height="854" loading="${large ? 'eager' : 'lazy'}" decoding="async">
    <span class="import-art-detail" data-import-loop>${icon(service.icon)}</span>
    <span class="import-art-seal" data-import-loop>${icon('circle-check')}</span>
  </div>`;
}

export function renderImportServices(lang) {
  const c = copy[lang] || copy.en;
  return `<section id="services" class="services-section import-services" aria-labelledby="import-services-title">
    <div class="import-services-inner">
      <div class="import-services-heading">
        <div><p class="import-eyebrow">${c.eyebrow}</p><h2 id="import-services-title"><span>${c.heading}</span><em>${c.emphasis}</em></h2></div>
        <div class="import-services-intro"><p>${esc(t('services.subtitle'))}</p><button type="button" class="import-motion-toggle" data-import-pause aria-label="${c.pause}" aria-pressed="false">${icon('pause')}</button></div>
      </div>
      <div class="import-services-grid">${services.map((s, i) => `<a class="import-service-card" href="${pageUrl(s, lang)}" data-import-service="${s.id}" style="--import-order:${i}" aria-haspopup="dialog" aria-labelledby="import-card-title-${s.id}">
        <span class="import-service-arrow">${icon('arrow-up-right')}</span>${art(s)}
        <span class="import-service-number">${String(i + 1).padStart(2, '0')}</span><h3 id="import-card-title-${s.id}">${esc(t(`services.${s.title}`))}</h3><p>${esc(t(`services.${s.description}`))}</p>
      </a>`).join('')}</div>
    </div>
    <dialog class="import-service-dialog" aria-labelledby="import-dialog-title">
      <div class="import-dialog-toolbar"><button type="button" class="import-dialog-back" data-import-close>${icon('arrow-left')}<span>${c.all}</span></button>
        <div class="import-dialog-navigation"><span class="import-dialog-counter" aria-live="polite"></span><button type="button" data-import-direction="-1" aria-label="${c.previous}">${icon('chevron-left')}</button><button type="button" data-import-direction="1" aria-label="${c.next}">${icon('chevron-right')}</button><button type="button" class="import-dialog-close" data-import-close aria-label="${c.close}">${icon('x')}</button></div>
      </div><div class="import-dialog-body"></div>
    </dialog>
  </section>`;
}

let dispose = () => {};
export function initImportServices() {
  dispose();
  const section = document.querySelector('#services.import-services');
  if (!section) return;
  const lang = getCurrentLanguage();
  const c = copy[lang] || copy.en;
  const dialog = section.querySelector('.import-service-dialog');
  const body = dialog.querySelector('.import-dialog-body');
  const controller = new AbortController();
  const options = { signal: controller.signal };
  initDeferredImages(section, controller.signal);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pauseButton = section.querySelector('[data-import-pause]');
  let currentIndex = 0, opener = null, paused = motion.matches, exitAnimation = null, closePromise = null;
  const measure = () => section.style.setProperty('--import-viewport-width', `${document.documentElement.clientWidth}px`);
  measure();
  window.addEventListener('resize', measure, options);
  if (location.hash === '#services') {
    document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (controller.signal.aborted || location.hash !== '#services') return;
      const headerHeight = document.querySelector('.pv-site-header')?.offsetHeight || 0;
      window.scrollTo({ top: section.getBoundingClientRect().top + scrollY - headerHeight - 12, behavior: 'instant' });
    })));
  }

  function syncMotion() {
    section.classList.toggle('is-motion-paused', paused || motion.matches);
    pauseButton.setAttribute('aria-pressed', String(paused || motion.matches));
    pauseButton.setAttribute('aria-label', paused ? c.play : c.pause);
    pauseButton.innerHTML = icon(paused ? 'play' : 'pause');
    pauseButton.disabled = motion.matches;
  }
  syncMotion();
  motion.addEventListener('change', () => { paused = motion.matches; syncMotion(); }, options);
  document.addEventListener('visibilitychange', () => section.classList.toggle('is-page-hidden', document.hidden), options);
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle('is-on-screen', entry.isIntersecting);
      if (entry.isIntersecting) entry.target.classList.add('is-revealed');
    }
  }, { threshold: .01, rootMargin: '0px 0px 120px 0px' });
  section.querySelectorAll('.import-service-card').forEach(card => observer.observe(card));
  section.classList.add('is-motion-ready');

  function open(index) {
    if (closePromise) return;
    currentIndex = (index + services.length) % services.length;
    const s = services[currentIndex];
    const includes = [1, 2, 3].map(n => t(`services.${s.id}Include${n}`));
    body.innerHTML = `<div class="import-dialog-hero">
      <div class="import-dialog-copy"><p class="import-dialog-eyebrow">${c.eyebrow} / ${String(currentIndex + 1).padStart(2, '0')}</p>
        <h2 id="import-dialog-title" tabindex="-1">${esc(t(`modals.service${currentIndex + 1}.title`))}</h2>
        <p class="import-dialog-description">${esc(t(`modals.service${currentIndex + 1}.description`))}</p>
        <div class="import-dialog-actions"><a href="#footer" class="import-primary-button" data-import-contact>${esc(t('services.discussRequest'))}${icon('arrow-up-right')}</a><button type="button" class="import-outline-button" data-import-included>${c.included}${icon('arrow-right')}</button></div>
      </div>
      <div class="import-board-wrap"><div class="import-service-board"><div class="import-board-top">${icon('package')}<span>${c.paper}</span><span>${String(currentIndex + 1).padStart(2, '0')}</span></div><h3>${esc(t(`services.${s.outcome}`))}</h3>
        ${art(s, true)}<ol class="import-board-steps">${c.phases[currentIndex].map((label, i) => `<li style="--import-order:${i}">${icon(s.steps[i])}<span>${label}</span></li>`).join('')}</ol>
      </div><span class="import-board-floating" data-import-loop>${icon(currentIndex === 4 ? 'map-pin' : s.icon)}</span></div>
    </div>
    <section class="import-included" aria-labelledby="import-included-title"><div class="import-included-heading"><p class="import-eyebrow">${esc(t('services.modalIncludesTitle'))}</p><h3 id="import-included-title">${esc(t(`services.${s.title}`))}</h3></div>
      <div class="import-included-grid">${includes.map((item, i) => `<article class="import-included-card" style="--import-order:${i}">${icon(s.steps[i])}<span class="import-service-number">${String(i + 1).padStart(2, '0')}</span><p>${esc(item)}</p></article>`).join('')}</div>
      <a class="import-full-details" href="${pageUrl(s, lang)}">${c.details}${icon('external-link')}</a>
    </section>`;
    dialog.querySelector('.import-dialog-counter').textContent = `${String(currentIndex + 1).padStart(2, '0')} / 06`;
    if (!dialog.open) {
      opener = document.activeElement;
      const r = opener?.getBoundingClientRect();
      dialog.style.setProperty('--import-origin-x', r ? `${(r.left + r.width / 2) / document.documentElement.clientWidth * 100}%` : '50%');
      document.documentElement.classList.add('import-service-is-open');
      dialog.showModal();
    }
    dialog.scrollTop = 0;
    body.querySelector('#import-dialog-title').focus({ preventScroll: true });
    window.trackSiteEvent?.('open_service_modal', { service_id: s.id, service_title: t(`services.${s.title}`) });
  }

  function close() {
    if (!dialog.open) return Promise.resolve();
    if (closePromise) return closePromise;
    if (motion.matches) { dialog.close(); return Promise.resolve(); }
    dialog.classList.add('is-closing');
    exitAnimation = dialog.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(20px) scale(.99)' }], { duration: 180, easing: 'ease-in', fill: 'forwards' });
    closePromise = exitAnimation.finished.then(() => { dialog.close(); }).catch(() => {});
    return closePromise;
  }
  dialog.addEventListener('close', () => {
    exitAnimation?.cancel(); exitAnimation = null; closePromise = null;
    dialog.classList.remove('is-closing');
    document.documentElement.classList.remove('import-service-is-open');
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  }, options);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); }, options);
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close();
  }, options);
  document.addEventListener('click', event => {
    const card = event.target.closest('[data-footer-service]');
    if (!card || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const index = services.findIndex(service => service.id === card.dataset.footerService);
    if (index < 0) return;
    event.preventDefault();
    card.focus({ preventScroll: true });
    open(index);
  }, options);
  section.addEventListener('click', async event => {
    const card = event.target.closest('[data-import-service]');
    if (card && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault(); card.focus({ preventScroll: true });
      open(services.findIndex(s => s.id === card.dataset.importService));
    }
    if (event.target.closest('[data-import-close]')) close();
    const direction = event.target.closest('[data-import-direction]');
    if (direction) open(currentIndex + Number(direction.dataset.importDirection));
    if (event.target.closest('[data-import-pause]')) { paused = !paused; syncMotion(); }
    if (event.target.closest('[data-import-included]')) {
      const target = body.querySelector('.import-included');
      dialog.scrollTo({ top: target.getBoundingClientRect().top - dialog.getBoundingClientRect().top + dialog.scrollTop - 96, behavior: motion.matches ? 'instant' : 'smooth' });
    }
    if (event.target.closest('[data-import-contact]')) {
      event.preventDefault(); event.stopPropagation();
      window.trackSiteEvent?.('click_request_quote', { service_id: services[currentIndex].id, source: 'service_modal' });
      await close();
      const target = document.getElementById('footer');
      if (target) {
        const headerHeight = document.querySelector('.pv-site-header')?.offsetHeight || 0;
        window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - headerHeight - 12, behavior: motion.matches ? 'instant' : 'smooth' });
      }
    }
  }, options);
  dispose = () => {
    controller.abort(); observer.disconnect(); exitAnimation?.cancel();
    if (dialog.open) dialog.close();
    document.documentElement.classList.remove('import-service-is-open');
  };
}
