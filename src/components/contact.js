import diagonal from '../assets/import-icons/arrow-up-right.svg?raw';
import closeIcon from '../assets/import-icons/x.svg?raw';
import { t } from '../utils/i18n.js';

export const contactCopy = {
  ru: {
    section: 'Контакты', close: 'Закрыть форму',
    intro: 'Помогу подобрать продукт и организовать импорт. Напишите мне удобным для вас способом.',
    messenger: 'Мессенджер', social: 'Социальная сеть', emailKind: 'Электронная почта', write: 'Написать', openProfile: 'Открыть профиль',
    links: 'Контакты / Социальные сети', phone: 'Телефон', mail: 'Почта',
    name: 'Парвина Пологенки', role: 'Ваш менеджер по импорту',
    form: 'Ваш запрос', formNote: 'Расскажите, какой продукт и объём вас интересуют.',
    optional: 'необязательно', messagePlaceholder: 'Например: кешью WW320, 1 контейнер, доставка в Таллин…',
    reply: 'Обычно отвечаю в течение 1 рабочего дня.', submit: 'Отправить письмо',
    required: 'Заполните это поле.', invalidEmail: 'Укажите корректный email.',
    check: 'Проверьте выделенные поля.', sending: 'Отправляю…',
    success: 'Письмо отправлено. Спасибо! Я скоро свяжусь с вами.',
    unavailable: 'Почтовый сервис ещё загружается. Попробуйте снова или напишите на info@pologenki.eu.',
    failed: 'Не удалось отправить письмо. Попробуйте снова или напишите на info@pologenki.eu.',
  },
  en: {
    section: 'Contact', close: 'Close contact form',
    intro: 'I can help you find the right product and arrange your import. Get in touch in whichever way suits you.',
    messenger: 'Messenger', social: 'Social network', emailKind: 'Email', write: 'Write to me', openProfile: 'View profile',
    links: 'Info / Social links', phone: 'Phone', mail: 'Email',
    name: 'Parvina Pologenki', role: 'Your import manager',
    form: 'Your enquiry', formNote: 'Tell me which product and quantity you’re looking for.',
    optional: 'optional', messagePlaceholder: 'For example: WW320 cashews, 1 container, delivery to Tallinn…',
    reply: 'I usually reply within 1 business day.', submit: 'Send message',
    required: 'Please fill in this field.', invalidEmail: 'Enter a valid email address.',
    check: 'Please check the highlighted fields.', sending: 'Sending…',
    success: 'Message sent. Thank you! I’ll be in touch soon.',
    unavailable: 'The email service is still loading. Try again or write to info@pologenki.eu.',
    failed: 'Your message could not be sent. Try again or write to info@pologenki.eu.',
  },
  cn: {
    section: '联系方式', close: '关闭联系表单',
    intro: '我可以协助您寻找合适的产品并安排进口。欢迎通过您方便的方式联系我。',
    messenger: '即时通讯', social: '社交平台', emailKind: '电子邮箱', write: '发送消息', openProfile: '查看主页',
    links: '联系方式 / 社交平台', phone: '电话', mail: '邮箱',
    name: 'Parvina Pologenki', role: '您的进口经理',
    form: '您的需求', formNote: '请告诉我您需要的产品和数量。',
    optional: '选填', messagePlaceholder: '例如：WW320 腰果，1 个集装箱，运往塔林……',
    reply: '通常在 1 个工作日内回复。', submit: '发送邮件',
    required: '请填写此项。', invalidEmail: '请输入有效的电子邮箱地址。',
    check: '请检查标出的字段。', sending: '发送中……',
    success: '邮件已发送，谢谢！我会尽快与您联系。',
    unavailable: '邮件服务仍在加载，请稍后重试或发邮件至 info@pologenki.eu。',
    failed: '邮件发送失败，请重试或发邮件至 info@pologenki.eu。',
  },
};

const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const arrow = `<span class="pc-arrow" aria-hidden="true">${diagonal}</span>`;

export function renderContactModal(lang) {
  const copy = contactCopy[lang] || contactCopy.en;
  const field = (id, name, label, type, autocomplete, required = true) => `
    <div class="pc-field">
      <label for="${id}">${escape(label)}${required ? '' : ` <span>(${copy.optional})</span>`}</label>
      <input id="${id}" name="${name}" type="${type}" autocomplete="${autocomplete}" ${required ? 'required' : ''} aria-describedby="${id}-error" maxlength="${type === 'email' ? 254 : 100}" placeholder="${escape(type === 'email' ? 'you@company.com' : t(`contact.${id}Placeholder`))}">
      <span class="pc-field-error" id="${id}-error"></span>
    </div>`;

  return `<dialog id="contactModal" class="pc-dialog" aria-labelledby="pc-form-title" aria-describedby="pc-form-note" data-contact-lang="${lang}">
        <header class="pc-dialog-header">
          <div class="pc-dialog-bar">
            <span class="pc-dialog-brand"><span>P</span>OLOGENKI</span>
            <button type="button" class="pc-dialog-close" data-contact-close aria-label="${copy.close}">${closeIcon}</button>
          </div>
          <h2 id="pc-form-title">${copy.form}</h2>
          <p id="pc-form-note">${copy.formNote}</p>
        </header>
        <div class="pc-dialog-body">
          <form id="contact-form" class="pc-form" aria-labelledby="pc-form-title" novalidate>
            <div class="pc-fields-row">
              ${field('firstName', 'first_name', t('contact.firstName'), 'text', 'given-name')}
              ${field('lastName', 'last_name', t('contact.lastName'), 'text', 'family-name', false)}
            </div>
            ${field('email', 'user_email', t('contact.email'), 'email', 'email')}
            <div class="pc-field pc-message-field">
              <label for="message">${t('contact.message')}</label>
              <textarea id="message" name="message" rows="4" required maxlength="5000" placeholder="${copy.messagePlaceholder}" aria-describedby="message-error"></textarea>
              <span class="pc-field-error" id="message-error"></span>
            </div>
            <div class="pc-form-actions">
              <button type="submit" class="pc-submit"><span data-contact-submit-label>${copy.submit}</span>${arrow}</button>
              <p class="pc-form-reply">${copy.reply}</p>
            </div>
            <p class="pc-form-status" id="pc-form-status" role="status" aria-live="polite" aria-atomic="true"></p>
          </form>
        </div>
  </dialog>`;
}

let disposeContact = () => {};

export function initContactModal({ lockPage, unlockPage }) {
  disposeContact();
  const dialog = document.querySelector('#contactModal');
  if (!dialog) return;
  const controller = new AbortController();
  const events = { signal: controller.signal };
  let opener, locked = false;
  const unlock = () => { if (locked) { locked = false; unlockPage(); } };
  const open = source => {
    if (dialog.open) return;
    opener = source;
    const message = dialog.querySelector('[name="message"]');
    const inquiry = source?.dataset.contactMessage;
    if (inquiry && message && !message.value.trim()) {
      message.value = inquiry;
      message.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const menu = document.querySelector('#menuToggle');
    if (menu?.getAttribute('aria-expanded') === 'true') menu.click();
    lockPage(); locked = true;
    dialog.showModal();
    dialog.querySelector('.pc-dialog-body').scrollTop = 0;
    dialog.querySelector('[data-contact-close]').focus({ preventScroll: true });
    window.trackSiteEvent?.('open_contact_form', { source: source?.className || 'link' });
  };
  document.addEventListener('click', event => {
    const source = event.target.closest('[data-contact-open]');
    if (!source || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); open(source);
  }, { ...events, capture: true });
  dialog.querySelector('[data-contact-close]').addEventListener('click', () => dialog.close(), events);
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  }, events);
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') event.stopPropagation();
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex="0"]')].filter(control => control.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }, events);
  dialog.addEventListener('close', () => {
    unlock();
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  }, events);
  if (location.hash === '#contact-form') requestAnimationFrame(() => {
    if (!controller.signal.aborted) open(document.querySelector('.pf-mail'));
  });
  disposeContact = () => { if (dialog.open) dialog.close(); unlock(); controller.abort(); };
}
