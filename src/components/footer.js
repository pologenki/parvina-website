import { personalEn } from "../content/content-en.js";
import "../css/footer.css";
import { personalRu } from "../content/content-ru.js";
import { getCurrentLanguage } from "../utils/i18n.js";

function getPersonalData() {
  const lang = getCurrentLanguage();
  return lang === "ru" ? personalRu : personalEn;
}

export function Footer() {
  const personal = getPersonalData();

  // Privacy Policy texts (полные, уже с заголовками)
  const privacyBodyEn = `
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
    <p>We implement appropriate security measures to protect your personal information. We do not sell or share your data with third parties for marketing purposes.</p>
    <h3>Your Rights</h3>
    <p>You have the right to access, correct, or delete your personal information. Contact us for any privacy-related requests.</p>
    <h3>Contact Us</h3>
    <p>For privacy-related questions: <a href="mailto:info@pologenki.eu">info@pologenki.eu</a></p>
    <p><em>Last updated: 2026</em></p>
  `;
  
  const privacyBodyRu = `
    <h2>Политика конфиденциальности</h2>
    <p><strong>Parvina — Импорт-менеджер и торговый специалист</strong> уважает вашу конфиденциальность.</p>
    <h3>Какие данные мы собираем</h3>
    <p>Мы можем собирать следующую информацию при обращении к нам:</p>
    <ul>
      <li>Имя и данные компании</li>
      <li>Контактная информация, включая email</li>
      <li>Запросы по продуктам и предпочтения</li>
      <li>История переписки</li>
    </ul>
    <h3>Как мы используем ваши данные</h3>
    <ul>
      <li>Для ответа на ваши бизнес-запросы</li>
      <li>Для предоставления информации о продуктах и ценах</li>
      <li>Для ведения импортно-экспортных операций</li>
      <li>Для улучшения наших услуг</li>
    </ul>
    <h3>Защита данных</h3>
    <p>Мы применяем соответствующие меры безопасности для защиты ваших данных. Мы не продаём и не передаём ваши данные третьим лицам для маркетинговых целей.</p>
    <h3>Ваши права</h3>
    <p>Вы имеете право на доступ, исправление или удаление своих персональных данных. Для этого свяжитесь с нами.</p>
    <h3>Контакты</h3>
    <p>По вопросам конфиденциальности: <a href="mailto:info@pologenki.eu">info@pologenki.eu</a></p>
    <p><em>Последнее обновление: 2026</em></p>
  `;

  // Terms of Service texts (полные, уже с заголовками)
  const termsBodyEn = `
    <h2>Terms of Service</h2>
    <h3>Business Services</h3>
    <p>Parvina provides import management and trade specialist services. All product prices and specifications are subject to change based on market conditions and availability.</p>
    <h3>Inquiries and Agreements</h3>
    <p>Initial product inquiries and communications do not constitute a binding agreement. Final prices, terms, and conditions are confirmed through official quotations and contracts.</p>
    <h3>Intellectual Property</h3>
    <p>All content, logos, and business information on this website are the property of Parvina and protected by intellectual property laws.</p>
    <h3>Limitation of Liability</h3>
    <p>While we strive for accuracy in all communications, Parvina is not liable for indirect damages resulting from the use of information provided on this website. Business decisions should be verified through official documentation.</p>
    <h3>Governing Law</h3>
    <p>These terms are governed by international trade laws and regulations.</p>
    <h3>Contact Information</h3>
    <p>Parvina - Import Manager & Trade Specialist<br>Email: <a href="mailto:info@pologenki.eu">info@pologenki.eu</a></p>
    <p><em>Last updated: 2026</em></p>
  `;
  
  const termsBodyRu = `
    <h2>Условия использования</h2>
    <h3>Деловые услуги</h3>
    <p>Parvina предоставляет услуги по управлению импортом и торговым операциям. Все цены и спецификации продуктов могут меняться в зависимости от рыночных условий и наличия.</p>
    <h3>Запросы и соглашения</h3>
    <p>Первичные запросы и переписка не являются юридически обязывающим соглашением. Окончательные цены, условия и соглашения подтверждаются официальными коммерческими предложениями и контрактами.</p>
    <h3>Интеллектуальная собственность</h3>
    <p>Весь контент, логотипы и деловая информация на этом сайте принадлежат Parvina и защищены законами об интеллектуальной собственности.</p>
    <h3>Ограничение ответственности</h3>
    <p>Мы стремимся к точности информации, однако Parvina не несёт ответственности за косвенные убытки, возникшие в результате использования информации с сайта. Все бизнес-решения должны подтверждаться официальными документами.</p>
    <h3>Применимое право</h3>
    <p>Данные условия регулируются международным торговым правом.</p>
    <h3>Контактная информация</h3>
    <p>Parvina — Импорт-менеджер и торговый специалист<br>Email: <a href="mailto:info@pologenki.eu">info@pologenki.eu</a></p>
    <p><em>Последнее обновление: 2026</em></p>
  `;

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
                <li><a href="#portfolio" class="footer-link" data-i18n="nav.portfolio">My Portfolio</a></li>
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
      
      <!-- Модальные окна (БЕЗ ДУБЛИРУЮЩИХСЯ ЗАГОЛОВКОВ) -->
      <div id="privacyModal" class="modal" style="display:none;">
        <div class="modal-content">
          <span class="close-modal"></span>
          <div class="modal-body">
            ${personal.lang === "ru" ? privacyBodyRu : privacyBodyEn}
          </div>
        </div>
      </div>
      
      <div id="termsModal" class="modal" style="display:none;">
        <div class="modal-content">
          <span class="close-modal"></span>
          <div class="modal-body">
            ${personal.lang === "ru" ? termsBodyRu : termsBodyEn}
          </div>
        </div>
      </div>
    </footer>
  `;
}