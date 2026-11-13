import { personalEn } from "../content/content-en.js";
import { personalRu } from "../content/content-ru.js";
import { personalCn } from "../content/content-cn.js";
import { getCurrentLanguage, t } from "../utils/i18n.js";
import diagonal from '../assets/import-icons/arrow-up-right.svg?raw';
import closeIcon from '../assets/import-icons/x.svg?raw';
import rightIcon from '../assets/import-icons/arrow-right.svg?raw';
import { createFooterMotion } from './footer-motion.js';
import { renderContactModal } from './contact.js';
import { importServices } from './import-services.js';

function getPersonalData() {
  const lang = getCurrentLanguage();
  if (lang === "ru") return personalRu;
  if (lang === "cn") return personalCn;
  return personalEn;
}

function getLegalBodies(lang) {
  const privacy = {
    en: `
      <h2>Privacy Policy</h2>
      <p><strong>Parvina - Import Manager & Trade Specialist</strong> is committed to protecting your privacy.</p>
      <h3>Information We Collect</h3>
      <p>We may collect the following information when you contact us:</p>
      <ul>
        <li>Name and company details</li>
        <li>Contact information including email address</li>
        <li>Product inquiries and preferences</li>
        <li>Communication history</li>
      </ul>
      <h3>How We Use Your Information</h3>
      <ul>
        <li>To respond to your business inquiries</li>
        <li>To provide product information and pricing</li>
        <li>To manage import/export transactions</li>
        <li>To improve our services</li>
      </ul>
      <h3>Data Protection</h3>
      <p>We apply appropriate security measures to protect your personal information. We do not sell or share your data with third parties for marketing purposes.</p>
      <h3>Your Rights</h3>
      <p>You may request access, correction or deletion of your personal data. Contact us for any privacy-related request.</p>
      <h3>Contact</h3>
      <p>Email: <a href="mailto:info@pologenki.eu">info@pologenki.eu</a></p>
      <p><em>Last updated: 2026</em></p>
    `,
    ru: `
      <h2>Политика конфиденциальности</h2>
      <p><strong>Парвина - импорт-менеджер и торговый специалист</strong> уважает вашу конфиденциальность.</p>
      <h3>Какие данные мы собираем</h3>
      <p>При обращении к нам мы можем собирать следующую информацию:</p>
      <ul>
        <li>Имя и данные компании</li>
        <li>Контактные данные, включая email</li>
        <li>Запросы по продуктам и предпочтения</li>
        <li>Историю деловой переписки</li>
      </ul>
      <h3>Как мы используем данные</h3>
      <ul>
        <li>Чтобы отвечать на ваши бизнес-запросы</li>
        <li>Чтобы предоставлять информацию о продуктах и ценах</li>
        <li>Чтобы сопровождать импортно-экспортные операции</li>
        <li>Чтобы улучшать наши услуги</li>
      </ul>
      <h3>Защита данных</h3>
      <p>Мы применяем разумные меры безопасности для защиты персональной информации. Мы не продаём и не передаём ваши данные третьим лицам для маркетинговых целей.</p>
      <h3>Ваши права</h3>
      <p>Вы можете запросить доступ, исправление или удаление ваших персональных данных. Для этого свяжитесь с нами.</p>
      <h3>Контакты</h3>
      <p>Email: <a href="mailto:info@pologenki.eu">info@pologenki.eu</a></p>
      <p><em>Последнее обновление: 2026</em></p>
    `,
    cn: `
      <h2>隐私政策</h2>
      <p><strong>Parvina - 进口经理与贸易专员</strong>重视并保护您的隐私。</p>
      <h3>我们收集的信息</h3>
      <p>当您联系我们时，我们可能会收集以下信息：</p>
      <ul>
        <li>姓名和公司信息</li>
        <li>联系方式，包括电子邮箱</li>
        <li>产品询价、采购需求和偏好</li>
        <li>业务沟通记录</li>
      </ul>
      <h3>我们如何使用信息</h3>
      <ul>
        <li>回复您的业务咨询</li>
        <li>提供产品信息、价格和供应细节</li>
        <li>协调进口、出口和物流相关事务</li>
        <li>改进我们的服务和沟通流程</li>
      </ul>
      <h3>数据保护</h3>
      <p>我们采取合理的安全措施保护您的个人信息。我们不会为了营销目的出售或向第三方共享您的数据。</p>
      <h3>您的权利</h3>
      <p>您可以要求访问、更正或删除您的个人信息。如有相关请求，请通过邮箱联系我们。</p>
      <h3>联系方式</h3>
      <p>Email: <a href="mailto:info@pologenki.eu">info@pologenki.eu</a></p>
      <p><em>最后更新：2026</em></p>
    `,
  };

  const terms = {
    en: `
      <h2>Terms of Service</h2>
      <h3>Business Services</h3>
      <p>Parvina provides import management and trade coordination services. Product prices and specifications may change depending on market conditions, availability and supplier confirmation.</p>
      <h3>Inquiries and Agreements</h3>
      <p>Initial inquiries and messages do not constitute a binding agreement. Final prices, terms and conditions are confirmed through official quotations, invoices or contracts.</p>
      <h3>Intellectual Property</h3>
      <p>Website content, images, logos and business information belong to Parvina or their respective rights holders and may not be copied without permission.</p>
      <h3>Limitation of Liability</h3>
      <p>We aim to keep information accurate, but business decisions should be confirmed through official documents. Parvina is not liable for indirect losses arising from use of general website information.</p>
      <h3>Governing Terms</h3>
      <p>Commercial cooperation is governed by the terms agreed in written business documents between the parties.</p>
      <h3>Contact</h3>
      <p>Parvina - Import Manager & Trade Specialist<br>Email: <a href="mailto:info@pologenki.eu">info@pologenki.eu</a></p>
      <p><em>Last updated: 2026</em></p>
    `,
    ru: `
      <h2>Условия использования</h2>
      <h3>Деловые услуги</h3>
      <p>Парвина предоставляет услуги по управлению импортом и торговой координации. Цены и спецификации продуктов могут меняться в зависимости от рынка, наличия и подтверждения поставщика.</p>
      <h3>Запросы и соглашения</h3>
      <p>Первичные запросы и сообщения не являются юридически обязывающим соглашением. Финальные цены, условия и договорённости подтверждаются официальными предложениями, счетами или контрактами.</p>
      <h3>Интеллектуальная собственность</h3>
      <p>Контент сайта, изображения, логотипы и деловая информация принадлежат Парвине или соответствующим правообладателям и не могут копироваться без разрешения.</p>
      <h3>Ограничение ответственности</h3>
      <p>Мы стремимся поддерживать точность информации, однако бизнес-решения должны подтверждаться официальными документами. Парвина не несёт ответственности за косвенные убытки, возникшие из-за использования общей информации с сайта.</p>
      <h3>Применимые условия</h3>
      <p>Коммерческое сотрудничество регулируется условиями, согласованными сторонами в письменных деловых документах.</p>
      <h3>Контакты</h3>
      <p>Парвина - импорт-менеджер и торговый специалист<br>Email: <a href="mailto:info@pologenki.eu">info@pologenki.eu</a></p>
      <p><em>Последнее обновление: 2026</em></p>
    `,
    cn: `
      <h2>服务条款</h2>
      <h3>业务服务</h3>
      <p>Parvina 提供进口管理和贸易协调服务。产品价格和规格可能会根据市场情况、库存和供应商确认而变化。</p>
      <h3>询价与协议</h3>
      <p>初步询价和沟通不构成具有约束力的协议。最终价格、条款和条件以正式报价、发票或合同确认为准。</p>
      <h3>知识产权</h3>
      <p>本网站的内容、图片、标志和业务信息归 Parvina 或相应权利人所有，未经许可不得复制或使用。</p>
      <h3>责任限制</h3>
      <p>我们努力保持网站信息准确，但所有商业决策应以正式文件确认为准。Parvina 不对因使用网站一般信息而产生的间接损失承担责任。</p>
      <h3>适用条款</h3>
      <p>商业合作以双方在书面业务文件中确认的条款为准。</p>
      <h3>联系方式</h3>
      <p>Parvina - 进口经理与贸易专员<br>Email: <a href="mailto:info@pologenki.eu">info@pologenki.eu</a></p>
      <p><em>最后更新：2026</em></p>
    `,
  };

  const key = ["en", "ru", "cn"].includes(lang) ? lang : "en";
  return { privacy: privacy[key], terms: terms[key] };
}

export function Footer() {
  const personal = getPersonalData();
  const lang = getCurrentLanguage();
  const legal = getLegalBodies(lang);
  const copy = {
    ru: { rights: 'Все права защищены.', home: 'Наверх', close: 'Закрыть документ', eyebrow: 'Обсудим вашу поставку?', request: 'Оставить запрос', response: 'Ответ в течение 1 рабочего дня', privacy: 'Политика', terms: 'Условия', brand: 'Орехи и сухофрукты · Импорт', shortServices: ['Поставщики', 'Переговоры', 'Логистика', 'Документы', 'Контроль груза', 'Импорт под ключ'] },
    en: { rights: 'All rights reserved.', home: 'Back to top', close: 'Close document', eyebrow: 'Let’s talk about your next shipment.', request: 'Send an enquiry', response: 'A reply within 1 business day', privacy: 'Privacy', terms: 'Terms', brand: 'Nuts & dried fruits · Import', shortServices: ['Sourcing', 'Negotiation', 'Logistics', 'Documents', 'Monitoring', 'Full import'] },
    cn: { rights: '保留所有权利。', home: '返回顶部', close: '关闭文档', eyebrow: '聊聊您的下一批进口货物。', request: '发送询价', response: '1 个工作日内回复', privacy: '隐私政策', terms: '服务条款', brand: '坚果与干果 · 进口', shortServices: ['寻找供应商', '商务谈判', '物流协调', '贸易单证', '货运跟踪', '全程进口服务'] },
  }[lang] || { rights: 'All rights reserved.', home: 'Pologenki — home', close: 'Close document' };
  const arrow = `<span class="pf-arrow" aria-hidden="true">${diagonal}</span>`;
  const documentCopy = {
    ru: { label: 'Документы', done: 'Закрыть' },
    en: { label: 'Documents', done: 'Close' },
    cn: { label: '文档', done: '关闭' },
  }[lang] || { label: 'Documents', done: 'Close' };
  const renderDocument = (id, html) => {
    const title = html.match(/<h2>(.*?)<\/h2>/)[1];
    const body = html.replace(/<h2>.*?<\/h2>/, '').replace(/<a href="mailto:/g, '<a data-contact-open href="mailto:');
    return `<div id="${id}" class="pf-document" role="dialog" aria-modal="true" aria-labelledby="${id}-title" style="display:none;">
      <div class="pf-document-panel">
        <header class="pf-document-header">
          <div class="pf-document-bar">
            <span class="pf-document-brand"><span>P</span>OLOGENKI</span>
            <span class="pf-document-label">${documentCopy.label}</span>
            <button type="button" class="pf-document-close" data-pf-document-close aria-label="${copy.close}">${closeIcon}</button>
          </div>
          <h2 id="${id}-title">${title}</h2>
        </header>
        <div class="pf-document-body" tabindex="0" role="document" aria-labelledby="${id}-title">${body}</div>
        <div class="pf-document-footer">
          <a class="pf-document-email" href="mailto:${personal.contacts.email}" data-contact-open aria-haspopup="dialog" aria-controls="contactModal">${personal.contacts.email}${arrow}</a>
          <button type="button" class="pf-document-done" data-pf-document-close>${documentCopy.done}</button>
        </div>
      </div>
    </div>`;
  };
  const prefix = lang === 'ru' ? '/ru' : lang === 'cn' ? '/zh-cn' : '';
  const phones = [...personal.contacts.phones].sort((a, b) => Number(b.startsWith('+372')) - Number(a.startsWith('+372')));
  const navItems = ['products', 'services', 'portfolio', 'contact'];
  const socialItems = [['facebook', 'Facebook', 'fa-brands fa-facebook-f'], ['telegram', 'Telegram', 'fa-brands fa-telegram'], ['whatsapp', 'WhatsApp', 'fa-brands fa-whatsapp'], ['wechat', 'WeChat', 'fa-brands fa-weixin'], ['zoho', 'Zoho Mail', 'fa-solid fa-envelope']];

  return `
    <footer id="footer" class="pf-footer">
      <canvas class="pf-dots" aria-hidden="true"></canvas>
      <a class="pf-totop" href="#nut-scene" aria-label="${copy.home}">${rightIcon}</a>
      <div class="pf-top pf-wrap">
        <div class="pf-cta">
          <p class="pf-eyebrow">${copy.eyebrow}</p>
          <a class="pf-mail" href="mailto:${personal.contacts.email}" data-contact-open aria-haspopup="dialog" aria-controls="contactModal"><span>${personal.contacts.email}</span>${arrow}</a>
          <div class="pf-cta-row">
            <a class="pf-inquiry" href="#contact-form" data-contact-open aria-haspopup="dialog" aria-controls="contactModal"><span>${copy.request}</span><span class="pf-arrow" aria-hidden="true">${rightIcon}</span></a>
            <span class="pf-response"><i aria-hidden="true"></i>${copy.response}</span>
          </div>
        </div>
        <div class="pf-nav">
          <nav class="pf-column pf-services" aria-labelledby="pf-services-title">
            <h2 class="pf-title" id="pf-services-title">${t('footer.services')}</h2>
            <ul class="pf-list">${importServices.map((service, index) => `<li><a class="pf-link" href="${prefix}/services/${service.slug}/" data-footer-service="${service.id}" aria-label="${t(`services.${service.title}`)}" aria-haspopup="dialog"><span class="pf-service-full">${t(`services.${service.title}`)}</span><span class="pf-service-short" aria-hidden="true">${copy.shortServices[index]}</span></a></li>`).join('')}</ul>
          </nav>
          <nav class="pf-column pf-navigation" aria-labelledby="pf-navigation-title">
            <h2 class="pf-title" id="pf-navigation-title">${t('footer.navigation')}</h2>
            <ul class="pf-list">
              ${navItems.map(key => `<li><a class="pf-link" href="#${key === 'contact' ? 'footer' : key}">${t(`nav.${key}`)}</a></li>`).join('')}
              <li><button type="button" class="pf-link pf-legal-link" id="privacy-policy-link" aria-label="${t('footer.privacy')}" aria-haspopup="dialog">${copy.privacy}</button></li>
              <li><button type="button" class="pf-link pf-legal-link" id="terms-of-service-link" aria-label="${t('footer.terms')}" aria-haspopup="dialog">${copy.terms}</button></li>
            </ul>
          </nav>
          <nav class="pf-column pf-social" aria-labelledby="pf-social-title">
            <h2 class="pf-title" id="pf-social-title">${t('footer.connect')}</h2>
            <ul class="pf-list">${socialItems.map(([key, name, icon]) => `<li><a class="pf-link" href="${personal.contacts.socials[key]}" ${key === 'zoho' ? 'data-contact-open aria-haspopup="dialog" aria-controls="contactModal"' : 'target="_blank" rel="noopener noreferrer"'}><i class="${icon}" aria-hidden="true"></i><span>${name}</span></a></li>`).join('')}</ul>
            <div class="pf-phones">${phones.map(phone => `<a href="tel:${phone.replace(/[^+\d]/g, '')}">${phone}</a>`).join('')}</div>
          </nav>
        </div>
      </div>
      <div class="pf-word-stage">
        <a class="pf-wordmark" href="#nut-scene" aria-label="POLOGENKI — ${copy.home}">${[...'POLOGENKI'].map((letter, index) => `<span class="pf-letter${index === 0 ? ' pf-letter-accent' : ''}" aria-hidden="true">${letter}</span>`).join('')}</a>
      </div>
      <div class="pf-bottom-wrap">
        <div class="pf-bottom pf-wrap">
          <span class="pf-brand-note">${copy.brand}</span>
          <p class="pf-copyright">&copy; ${new Date().getFullYear()} Pologenki. ${copy.rights}</p>
        </div>
      </div>

      ${renderDocument('privacyModal', legal.privacy)}
      ${renderDocument('termsModal', legal.terms)}
      ${renderContactModal(lang)}
    </footer>
  `;
}

let disposeFooter = () => {};

export function initFooter() {
  disposeFooter();
  const footer = document.querySelector('#footer.pf-footer');
  if (!footer) return;
  const controller = new AbortController();
  const measure = () => footer.style.setProperty('--pf-viewport-width', `${document.documentElement.clientWidth}px`);
  measure();
  window.addEventListener('resize', measure, { signal: controller.signal, passive: true });
  const stopMotion = createFooterMotion(footer, controller.signal, measure);
  footer.querySelector('.pf-wordmark').addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.replaceState(history.state, '', '#nut-scene');
    window.scrollTo({ top: 0, left: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    document.querySelector('.pv-brand')?.focus({ preventScroll: true });
  }, { signal: controller.signal });
  let anchorTimer;
  if (['#footer', '#contact'].includes(location.hash)) {
    let interacted = false;
    for (const type of ['pointerdown', 'wheel', 'touchstart', 'keydown']) window.addEventListener(type, () => { interacted = true; }, { signal: controller.signal, once: true, passive: true });
    const followAnchor = () => {
      if (interacted || controller.signal.aborted || !footer.isConnected || !['#footer', '#contact'].includes(location.hash)) return;
      const headerHeight = document.querySelector('.pv-site-header')?.offsetHeight || 0;
      window.scrollTo({ top: scrollY + footer.getBoundingClientRect().top - headerHeight - 12, behavior: 'instant' });
    };
    requestAnimationFrame(() => requestAnimationFrame(followAnchor));
    const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise(resolve => window.addEventListener('load', resolve, { signal: controller.signal, once: true }));
    Promise.all([document.fonts.ready, loaded]).then(() => { if (!controller.signal.aborted) anchorTimer = setTimeout(followAnchor, 180); });
  }
  disposeFooter = () => { controller.abort(); stopMotion(); clearTimeout(anchorTimer); };
}
