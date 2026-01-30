import { personalEn } from "../content/content-en.js";
import { personalRu } from "../content/content-ru.js";
import { getCurrentLanguage } from "../utils/i18n.js";

function getPersonalData() {
  const lang = getCurrentLanguage();
  return lang === "ru" ? personalRu : personalEn;
}

export function Footer() {
  const personal = getPersonalData();

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
                <li><a href="#about" class="footer-link">About</a></li>
                <li><a href="#services" class="footer-link" data-i18n="nav.services">Services</a></li>
                ${
                  personal.lang === "en"
                    ? '<li><a href="#portfolio" class="footer-link" data-i18n="nav.portfolio">Portfolio</a></li>'
                    : ""
                }
                <li><a href="#contact" class="footer-link" data-i18n="nav.contact">Contact</a></li>
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
                <li><a href="${
                  personal.contacts.socials.facebook
                }" class="footer-link" target="_blank">Facebook</a></li>
                <li><a href="${
                  personal.contacts.socials.whatsapp
                }" class="footer-link" target="_blank">WhatsApp</a></li>
                <li><a href="${
                  personal.contacts.socials.gmail
                }" class="footer-link" target="_blank">Gmail</a></li>
                <li><a href="${
                  personal.contacts.socials.telegram
                }" class="footer-link" target="_blank">Telegram</a></li>
                <li><a href="${
                  personal.contacts.socials.wechat
                }" class="footer-link" target="_blank">WeChat</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="footer-copyright">
            <p>&copy; Designed & Developed by Pologenki © 2025 All rights reserved.</p>
          </div>
          
          <div class="footer-legal">
            <a href="#privacy-policy" class="footer-legal-link" id="privacy-policy-link" data-i18n="footer.privacy">Privacy Policy</a>
            <a href="#terms-of-service" class="footer-legal-link" id="terms-of-service-link" data-i18n="footer.terms">Terms of Service</a>
          </div>
        </div>
      </div>
      
      <!-- Modal windows (оставляем как есть) -->
    </footer>
  `;
}
