import { personalEn } from "../content/content-en.js";
import { personalRu } from "../content/content-ru.js";
import { personalCn } from "../content/content-cn.js";
import { getCurrentLanguage } from "../utils/i18n.js";

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
      <p><strong>Parvina - импорт-менеджер и торговый специалист</strong> уважает вашу конфиденциальность.</p>
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
      <p>Parvina предоставляет услуги по управлению импортом и торговой координации. Цены и спецификации продуктов могут меняться в зависимости от рынка, наличия и подтверждения поставщика.</p>
      <h3>Запросы и соглашения</h3>
      <p>Первичные запросы и сообщения не являются юридически обязывающим соглашением. Финальные цены, условия и договорённости подтверждаются официальными предложениями, счетами или контрактами.</p>
      <h3>Интеллектуальная собственность</h3>
      <p>Контент сайта, изображения, логотипы и деловая информация принадлежат Parvina или соответствующим правообладателям и не могут копироваться без разрешения.</p>
      <h3>Ограничение ответственности</h3>
      <p>Мы стремимся поддерживать точность информации, однако бизнес-решения должны подтверждаться официальными документами. Parvina не несёт ответственности за косвенные убытки, возникшие из-за использования общей информации с сайта.</p>
      <h3>Применимые условия</h3>
      <p>Коммерческое сотрудничество регулируется условиями, согласованными сторонами в письменных деловых документах.</p>
      <h3>Контакты</h3>
      <p>Parvina - импорт-менеджер и торговый специалист<br>Email: <a href="mailto:info@pologenki.eu">info@pologenki.eu</a></p>
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

  return `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-top">
          <div class="footer-brand">
            <h3 class="footer-name">${personal.footerBrand}</h3>
            <p class="footer-tagline" data-i18n="about.subtitle">Import Manager & Trade Specialist</p>
          </div>

          <div class="footer-links">
            <div class="footer-column">
              <h4 class="footer-column-title" data-i18n="footer.navigation">Navigation</h4>
              <ul class="footer-list">
                <li><a href="#products" class="footer-link" data-i18n="nav.products">Our Products</a></li>
                <li><a href="#services" class="footer-link" data-i18n="nav.services">Services</a></li>
                <li><a href="#portfolio" class="footer-link" data-i18n="nav.portfolio">Portfolio</a></li>
                <li><a href="#contact" class="footer-link" data-i18n="nav.contact">Get In Touch</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h4 class="footer-column-title" data-i18n="footer.services">Services</h4>
              <ul class="footer-list">
                <li><a href="#services" class="footer-link" data-i18n="services.supplierSourcing">Supplier Sourcing</a></li>
                <li><a href="#services" class="footer-link" data-i18n="services.contractNegotiation">Contract Negotiation</a></li>
                <li><a href="#services" class="footer-link" data-i18n="services.logisticsManagement">Logistics Management</a></li>
                <li><a href="#services" class="footer-link" data-i18n="services.tradeDocumentation">Trade Documentation</a></li>
                <li><a href="#services" class="footer-link" data-i18n="services.shipmentMonitoring">Shipment Monitoring</a></li>
                <li><a href="#services" class="footer-link" data-i18n="services.fullServiceImport">Full-Service Import</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h4 class="footer-column-title" data-i18n="footer.connect">Connect</h4>
              <ul class="footer-list">
                <li><a href="${personal.contacts.socials.facebook}" class="footer-link" target="_blank">Facebook</a></li>
                <li><a href="${personal.contacts.socials.whatsapp}" class="footer-link" target="_blank">WhatsApp</a></li>
                <li><a href="${personal.contacts.socials.gmail}" class="footer-link" target="_blank">Gmail</a></li>
                <li><a href="${personal.contacts.socials.telegram}" class="footer-link" target="_blank">Telegram</a></li>
                <li><a href="${personal.contacts.socials.wechat}" class="footer-link" target="_blank">WeChat</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-copyright">
            <p>&copy; Designed & Developed by Pologenki © ${new Date().getFullYear()} All rights reserved.</p>
          </div>

          <div class="footer-legal">
            <a href="#privacy-policy" class="footer-legal-link" id="privacy-policy-link" data-i18n="footer.privacy">Privacy Policy</a>
            <a href="#terms-of-service" class="footer-legal-link" id="terms-of-service-link" data-i18n="footer.terms">Terms of Service</a>
          </div>
        </div>
      </div>

      <div id="privacyModal" class="modal" style="display:none;">
        <div class="modal-content">
          <span class="close-modal"></span>
          <div class="modal-body">${legal.privacy}</div>
        </div>
      </div>

      <div id="termsModal" class="modal" style="display:none;">
        <div class="modal-content">
          <span class="close-modal"></span>
          <div class="modal-body">${legal.terms}</div>
        </div>
      </div>
    </footer>
  `;
}
