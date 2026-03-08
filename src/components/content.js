import { personalEn } from "../content/content-en.js";
import { personalRu } from "../content/content-ru.js";
import { getCurrentLanguage, t } from "../utils/i18n.js";

function getPersonalData() {
  const lang = localStorage.getItem("preferredLanguage") || "en";
  return lang === "ru" ? personalRu : personalEn;
}

// Load products from products.json and render
let productsData = null;

export async function loadProducts() {
  try {
    const response = await fetch("/data/products.json");
    productsData = await response.json();
  } catch (e) {
    console.error("Failed to load products.json", e);
    productsData = { products: [] };
  }
}

function getProductText(product, field, lang) {
  if (lang === "ru" && product[field + "_ru"]) {
    return product[field + "_ru"];
  }
  return product[field] || "";
}

function getPriceText(price, lang) {
  if (price === "Price on request") {
    return lang === "ru" ? "Цена по запросу" : "Price on request";
  }
  return price;
}

function renderProductCards(products, lang) {
  console.log("renderProductCards lang:", lang);
  return products
    .map((product, index) => {
      const name = getProductText(product, "name", lang);
      const desc = getProductText(product, "desc", lang);
      const origin = getProductText(product, "origin", lang);
      const originLabel = lang === "ru" ? "Происхождение" : "Origin";

      return `
      <div class="pricing-card" data-modal="modal-${product.id}">
        <div class="product-image">
          <img src="/${product.image}" alt="${name}">
        </div>
        <h3>${name}</h3>
        <p class="product-desc">${desc}</p>
        <p class="product-origin">${originLabel}: ${origin}</p>
        <p class="price">${getPriceText(product.mainPrice, lang)}</p>
        <a href="#" class="btn-more" data-i18n="products.learnMore">${t("products.learnMore")}</a>
      </div>
    `;
    })
    .join("");
}

function renderProductModals(products, lang) {
  return products
    .map((product, index) => {
      const name = getProductText(product, "name", lang);
      const total = products.length;
      const counter = `${index + 1}/${total}`;

      const variants = product.variants
        .map((variant) => {
          const variantName = getProductText(variant, "name", lang);
          const variantDesc = getProductText(variant, "desc", lang);
          const variantPrice = getPriceText(variant.price, lang);

          return `
        <div class="product-type clickable-product" data-contact="true">
          <div class="product-type-header">
            <h4>${variantName}</h4>
            <span class="type-price">${variantPrice}</span>
          </div>
          <div class="product-description">
            <p>${variantDesc}</p>
          </div>
        </div>
      `;
        })
        .join("");

      return `
      <div class="product-modal" id="modal-${product.id}">
        <div class="modal-content">
          <span class="close-modal"></span>
          <div class="modal-counter">${counter}</div>
          <div class="modal-navigation">
            <button class="modal-prev" data-i18n="modal.prev"></button>
            <button class="modal-next" data-i18n="modal.next"></button>
          </div>
          <div class="modal-header">
            <h3>${name}</h3>
          </div>
          <div class="modal-body">
            <div class="product-types">
              ${variants}
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

export function Content() {
  const personal = getPersonalData();
  const lang = localStorage.getItem("preferredLanguage") || "en";
  const products = productsData ? productsData.products : [];

  // Генерируем HTML для телефонов
  const phonesHtml = personal.contacts.phones
    .map((phone) => {
      const cleanPhone = phone.replace(/\s+/g, "");
      return `
      <a href="tel:${cleanPhone}" class="contact-item phone-item">
        <div class="contact-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </div>
        <div class="contact-text">${phone}</div>
      </a>
    `;
    })
    .join("");

  // Генерируем HTML для соцсетей
  const socialsHtml = `
    <a href="${personal.contacts.socials.facebook}" class="social-icon facebook" title="Facebook" target="_blank">
      <i class="fab fa-facebook-f"></i>
    </a>
    <a href="${personal.contacts.socials.telegram}" class="social-icon telegram" title="Telegram" target="_blank">
      <i class="fab fa-telegram"></i>
    </a>
    <a href="${personal.contacts.socials.whatsapp}" class="social-icon whatsapp" title="WhatsApp" target="_blank">
      <i class="fab fa-whatsapp"></i>
    </a>
    <a href="${personal.contacts.socials.wechat}" class="social-icon wechat" title="WeChat" target="_blank">
      <i class="fab fa-weixin"></i>
    </a>
    <div class="social-icon gmail email-link" title="Email" style="cursor: pointer;">
      <i class="fab fa-google"></i>
    </div>
  `;

  return `
  <section id="about" class="about-section">
    <div class="about-container">
      <div class="about-content">
        <div class="about-text">
          <h2 class="about-title">${personal.about.title}</h2>
          <h3 class="about-subtitle">${personal.about.subtitle}</h3>
          <p class="about-description">${personal.about.description}</p>
          
          <div class="contact-info">
            <h3 data-i18n="about.getInTouch">Get In Touch:</h3>
            
            <div class="contact-item email-link" style="cursor: pointer;">
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div class="contact-text">${personal.contacts.email}</div>
            </div>
            
            <div class="phone-numbers">
              ${phonesHtml}
            </div>
          </div>

          <div class="social-icons-wrapper">
            <div class="social-icons">
              ${socialsHtml}
            </div>
          </div>
        </div>
        
        <div class="about-image">
          <img src="${personal.about.photo}" alt="${personal.about.title}" class="profile-photo" id="aboutPhoto">
        </div>
      </div>
    </div>
  </section>

  <section class="pricing-section" id="products">
    <div class="container">
      <h2 class="section-title" data-i18n="products.title">Our Products</h2>
      <p class="price-update-date" data-i18n="products.lastUpdated">Prices last updated: <span id="current-date"></span></p>
      
 <div class="pricing-grid">
        ${renderProductCards(products, lang)}
      </div>
    </div>
  </section>
${renderProductModals(products, lang)}

    
  <!-- Services section -->
  <section id="services" class="services-section">
    <div class="services-container">
      <h2 class="services-title" data-i18n="services.title">Import Management Services</h2>
      <div class="services-grid">
        <div class="service-card" data-service-modal="modal1">
          <div class="service-icon"><i class="fas fa-search-dollar"></i></div>
          <h3 class="service-name" data-i18n="services.supplierSourcing">Supplier Sourcing</h3>
          <p class="service-description" data-i18n="services.supplierDescription">Finding reliable suppliers worldwide with thorough due diligence and quality verification for nuts, dried fruits, and spices.</p>
          <div class="read-more-btn">
            <span data-i18n="services.readMore">Read More</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/></svg>
          </div>
        </div>
        
        <div class="service-card" data-service-modal="modal2">
          <div class="service-icon"><i class="fas fa-handshake"></i></div>
          <h3 class="service-name" data-i18n="services.contractNegotiation">Contract Negotiation</h3>
          <p class="service-description" data-i18n="services.contractDescription">Securing optimal terms and pricing through expert negotiation while protecting client interests in international deals.</p>
          <div class="read-more-btn">
            <span data-i18n="services.readMore">Read More</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/></svg>
          </div>
        </div>
        
        <div class="service-card" data-service-modal="modal3">
          <div class="service-icon"><i class="fas fa-shipping-fast"></i></div>
          <h3 class="service-name" data-i18n="services.logisticsManagement">Logistics Management</h3>
          <p class="service-description" data-i18n="services.logisticsDescription">Coordinating seamless transportation with trusted partners and optimizing supply chain routes for cost efficiency.</p>
          <div class="read-more-btn">
            <span data-i18n="services.readMore">Read More</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/></svg>
          </div>
        </div>
        
        <div class="service-card" data-service-modal="modal4">
          <div class="service-icon"><i class="fas fa-file-contract"></i></div>
          <h3 class="service-name" data-i18n="services.tradeDocumentation">Trade Documentation</h3>
          <p class="service-description" data-i18n="services.documentationDescription">Handling complete customs documentation and compliance to ensure smooth customs clearance and timely delivery.</p>
          <div class="read-more-btn">
            <span data-i18n="services.readMore">Read More</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/></svg>
          </div>
        </div>
        
        <div class="service-card" data-service-modal="modal5">
          <div class="service-icon"><i class="fas fa-clipboard-check"></i></div>
          <h3 class="service-name" data-i18n="services.shipmentMonitoring">Shipment Monitoring</h3>
          <p class="service-description" data-i18n="services.monitoringDescription">Every shipment is tracked daily — from loading to final delivery. I monitor all logistics stages to ensure deadlines and product safety.</p>
          <div class="read-more-btn">
            <span data-i18n="services.readMore">Read More</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/></svg>
          </div>
        </div>
        
        <div class="service-card" data-service-modal="modal6">
          <div class="service-icon"><i class="fas fa-tasks"></i></div>
          <h3 class="service-name" data-i18n="services.fullServiceImport">Full-Service Import</h3>
          <p class="service-description" data-i18n="services.importDescription">End-to-end import solutions tailored to your business needs - from sourcing to final delivery at your warehouse.</p>
          <div class="read-more-btn">
            <span data-i18n="services.readMore">Read More</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/></svg>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Service Modals -->
  <div class="service-modal" id="modal1">
    <div class="service-modal-content">
      <div class="close-modal"></div>
      <div class="service-modal-icon"><i class="fas fa-search-dollar"></i></div>
      <h3 data-i18n="modals.service1.title">Supplier Sourcing & Verification</h3>
      <p data-i18n="modals.service1.description">I conduct comprehensive market research to identify reputable suppliers of nuts, dried fruits, spices, and coffee from key producing regions.</p>
    </div>
  </div>
  <div class="service-modal" id="modal2">
    <div class="service-modal-content">
      <div class="close-modal"></div>
      <div class="service-modal-icon"><i class="fas fa-handshake"></i></div>
      <h3 data-i18n="modals.service2.title">Contract Negotiation & Terms</h3>
      <p data-i18n="modals.service2.description">Leveraging my expertise in international trade, I negotiate favorable terms covering pricing, payment conditions, delivery schedules, and quality specifications.</p>
    </div>
  </div>
  <div class="service-modal" id="modal3">
    <div class="service-modal-content">
      <div class="close-modal"></div>
      <div class="service-modal-icon"><i class="fas fa-shipping-fast"></i></div>
      <h3 data-i18n="modals.service3.title">Logistics & Supply Chain Management</h3>
      <p data-i18n="modals.service3.description">I coordinate with trusted freight forwarders, customs brokers, and transportation providers to design optimal shipping routes.</p>
    </div>
  </div>
  <div class="service-modal" id="modal4">
    <div class="service-modal-content">
      <div class="close-modal"></div>
      <div class="service-modal-icon"><i class="fas fa-file-contract"></i></div>
      <h3 data-i18n="modals.service4.title">International Trade Documentation</h3>
      <p data-i18n="modals.service4.description">I manage the complete documentation process including commercial invoices, packing lists, certificates of origin, phytosanitary certificates, and customs declarations.</p>
    </div>
  </div>
  <div class="service-modal" id="modal5">
    <div class="service-modal-content">
      <div class="close-modal"></div>
      <div class="service-modal-icon"><i class="fas fa-clipboard-check"></i></div>
      <h3 data-i18n="modals.service5.title">Shipment Monitoring & Quality Assurance</h3>
      <p data-i18n="modals.service5.description">I provide continuous tracking and monitoring of shipments from loading to final delivery.</p>
    </div>
  </div>
  <div class="service-modal" id="modal6">
    <div class="service-modal-content">
      <div class="close-modal"></div>
      <div class="service-modal-icon"><i class="fas fa-tasks"></i></div>
      <h3 data-i18n="modals.service6.title">Comprehensive Import Solutions</h3>
      <p data-i18n="modals.service6.description">As your dedicated import manager, I provide end-to-end solutions tailored to your specific business needs.</p>
    </div>
  </div>


<!-- Portfolio section -->
<section id="portfolio" class="portfolio-section" style="background:#f8f9fa;">
    <div class="portfolio-container">
      <div style="text-align:center;font-size:0.65rem;letter-spacing:0.3em;text-transform:uppercase;color:#66b1f1;margin-bottom:0.75rem;">Portfolio</div>
      <h2 class="portfolio-title" data-i18n="portfolio.title">Successful Import Projects</h2>

      <div class="flip-slider-wrap">
        <div class="flip-slider-track" id="portfolioTrack"></div>
        <div class="flip-slider-nav">
        <p style="text-align:center;font-size:0.68rem;color:#b0b0b0;letter-spacing:0.12em;text-transform:uppercase;margin-top:1rem;padding-bottom:2rem;">Click card to flip · Click "View Photo" to zoom</p>
          <button class="flip-nav-btn" id="portfolioPrev">←</button>
          <div class="flip-nav-dots" id="portfolioDots"></div>
          <button class="flip-nav-btn" id="portfolioNext">→</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Zoom overlay -->
  <div class="zoom-overlay" id="zoomOverlay">
    <div class="zoom-backdrop" id="zoomBackdrop"></div>
    <div class="zoom-content">
      <button class="zoom-close" id="zoomClose">✕</button>
      <img class="zoom-img" id="zoomImg" src="" alt="">
      <div class="zoom-caption">
        <div class="zoom-caption-title" id="zoomTitle"></div>
        <div class="zoom-caption-desc" id="zoomDesc"></div>
      </div>
    </div>
  </div>

  <!-- Gallery modal -->
  <div class="gallery-modal" id="galleryModal">
    <div class="gallery-modal-content">
      <div class="close-gallery-modal"><i class="fas fa-times"></i></div>
      <button class="gallery-nav gallery-prev"><i class="fas fa-chevron-left"></i></button>
      <button class="gallery-nav gallery-next"><i class="fas fa-chevron-right"></i></button>
      <div class="gallery-image-container">
        <img src="" alt="" class="gallery-image" id="galleryImage">
        <div class="gallery-counter"><span id="currentImage">1</span> / <span id="totalImages">11</span></div>
        <div class="image-caption">
          <h3 id="imageTitle" data-i18n="gallery.projectTitle">Project Title</h3>
          <p id="imageDescription" data-i18n="gallery.projectDescription">Project description</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Contact section -->
  <section id="contact" class="contacts-section">
    <div class="contacts-container">
      <h2 class="contacts-title" data-i18n="contact.title">Get In Touch</h2>
      <div class="contacts-content">
        <div class="contact-form-container">
          <form class="contact-form" id="contact-form">
            <div class="name-fields">
              <div class="form-group">
                <label for="firstName" data-i18n="contact.firstName">First Name</label>
                <input type="text" id="firstName" name="first_name" data-i18n-placeholder="contact.firstNamePlaceholder" placeholder="Enter your first name" required>
              </div>
              <div class="form-group">
                <label for="lastName" data-i18n="contact.lastName">Last Name</label>
                <input type="text" id="lastName" name="last_name" data-i18n-placeholder="contact.lastNamePlaceholder" placeholder="Enter your last name" required>
              </div>
            </div>
            <div class="form-group">
              <label for="email" data-i18n="contact.email">Email</label>
              <input type="email" id="email" name="user_email" data-i18n-placeholder="contact.emailPlaceholder" placeholder="Enter your email address" required>
            </div>
            <div class="form-group">
              <label for="message" data-i18n="contact.message">How can we help you?</label>
              <textarea id="message" name="message" rows="5" data-i18n-placeholder="contact.messagePlaceholder" placeholder="Enter your message" required></textarea>
            </div>
            <button type="submit" class="send-message-btn" data-i18n="contact.sendMessage">Send Message</button>
          </form>
        </div>
        <div class="contact-info-container">
          <div class="social-section">
            <div class="social-grid">
              <a href="${personal.contacts.socials.facebook}" class="social-card facebook" target="_blank">
                <div class="social-icon"><i class="fab fa-facebook-f"></i></div>
                <div class="social-text"><span class="social-name">Facebook</span></div>
              </a>
              <a href="${personal.contacts.socials.whatsapp}" class="social-card whatsapp" target="_blank">
                <div class="social-icon"><i class="fab fa-whatsapp"></i></div>
                <div class="social-text"><span class="social-name">WhatsApp</span></div>
              </a>
              <a href="${personal.contacts.socials.gmail}" class="social-card gmail" target="_blank">
                <div class="social-icon"><i class="fab fa-google"></i></div>
                <div class="social-text"><span class="social-name">Gmail</span></div>
              </a>
              <a href="${personal.contacts.socials.telegram}" class="social-card telegram" target="_blank">
                <div class="social-icon"><i class="fab fa-telegram"></i></div>
                <div class="social-text"><span class="social-name">Telegram</span></div>
              </a>
              <a href="${personal.contacts.socials.wechat}" class="social-card whatsapp" target="_blank">
                <div class="social-icon"><i class="fab fa-weixin"></i></div>
                <div class="social-text"><span class="social-name">WeChat</span></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="scroll-to-top" id="scrollToTop">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  </div>
  `;
}
