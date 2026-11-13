import { getCurrentLanguage, t } from "../utils/i18n.js";
import { personalEn } from '../content/content-en.js';
import { personalRu } from '../content/content-ru.js';
import { personalCn } from '../content/content-cn.js';

const headerCopy = {
  en: { email: "WRITE TO US:", phone: "CALL US:", inquiry: "DISCUSS YOUR REQUEST", menu: "Open navigation", language: "Select language" },
  ru: { email: "НАПИШИТЕ НАМ:", phone: "ПОЗВОНИТЕ:", inquiry: "ОБСУДИТЬ ЗАПРОС", menu: "Открыть меню", language: "Выбрать язык" },
  cn: { email: "联系我们：", phone: "致电我们：", inquiry: "咨询采购需求", menu: "打开菜单", language: "选择语言" },
};

export function Header() {
  const lang = getCurrentLanguage();
  const c = headerCopy[lang] || headerCopy.en;
  const { email, socials } = ({ en: personalEn, ru: personalRu, cn: personalCn }[lang] || personalEn).contacts;
  const channels = [['facebook', 'Facebook', 'fa-brands fa-facebook-f'], ['telegram', 'Telegram', 'fa-brands fa-telegram'], ['whatsapp', 'WhatsApp', 'fa-brands fa-whatsapp'], ['wechat', 'WeChat', 'fa-brands fa-weixin'], ['zoho', 'Zoho Mail', 'fa-solid fa-envelope']];
  return `
  <header class="pv-site-header">
    <div class="pv-contact-bar"><div class="pv-header-inner pv-contact-inner">
      <a class="pv-contact-item" href="mailto:${email}" data-contact-open aria-haspopup="dialog" aria-controls="contactModal"><span class="pv-contact-label">${c.email}</span><span>${email.toUpperCase()}</span></a>
      <nav class="pv-socials" aria-label="${t('footer.connect')}">${channels.map(([key, name, icon]) => `<a class="pv-social-link" href="${socials[key]}" aria-label="${name}" title="${name}" ${key === 'zoho' ? 'data-contact-open aria-haspopup="dialog" aria-controls="contactModal"' : 'target="_blank" rel="noopener noreferrer"'}><i class="${icon}" aria-hidden="true"></i></a>`).join('')}</nav>
    </div></div>
    <div class="pv-main-bar"><div class="pv-header-inner pv-main-inner">
      <a class="pv-brand" href="#nut-scene" aria-label="Pologenki"><img src="/logo-transparent.png" alt="Pologenki" width="720" height="188" decoding="async"></a>
      <nav class="pv-header-nav" id="navMenu" aria-label="${c.menu}">
      <a class="pv-nav-link" href="#products" data-section="products" data-i18n="nav.products">${t("nav.products")}</a>
      <a class="pv-nav-link" href="#services" data-section="services" data-i18n="nav.services">${t("nav.services")}</a>
      <a class="pv-nav-link" href="#portfolio" data-section="portfolio" data-i18n="nav.portfolio">${t("nav.portfolio")}</a>
      <a class="pv-nav-link" href="#footer" data-section="footer" data-i18n="nav.contact">${t("nav.contact")}</a>
      <a class="pv-header-cta" href="#footer">${c.inquiry}</a>
      </nav>
      <nav class="pv-language-switch" aria-label="${c.language}">${[
        ['en', 'EN', 'English', '/', 'en'],
        ['ru', 'RU', 'Русский', '/ru/', 'ru'],
        ['cn', '中文', '中文', '/zh-cn/', 'zh-CN'],
      ].map(([key, label, name, href, htmlLang]) => `<a class="pv-language-option" data-lang="${key}" href="${href}" lang="${htmlLang}" hreflang="${htmlLang}" aria-label="${name}"${lang === key ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>
      <button class="pv-menu-toggle" id="menuToggle" type="button" aria-label="${c.menu}" aria-controls="navMenu" aria-expanded="false"><i class="fa-solid fa-bars" aria-hidden="true"></i></button>
    </div></div>
  </header>
  `;
}
