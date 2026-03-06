import { personalEn } from "../content/content-en.js";
import { personalRu } from "../content/content-ru.js";
import { getCurrentLanguage, t } from "../utils/i18n.js";

function getPersonalData() {
  const lang = getCurrentLanguage();
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

function getProductText(product, field) {
  const lang = getCurrentLanguage();
  if (lang === "ru" && product[field + "_ru"]) {
    return product[field + "_ru"];
  }
  return product[field] || "";
}

function getPriceText(price) {
  const lang = getCurrentLanguage();
  if (price === "Price on request") {
    return lang === "ru" ? "Цена по запросу" : "Price on request";
  }
  return price;
}

function renderProductCards(products) {
  return products.map((product, index) => {
    const name = getProductText(product, "name");
    const desc = getProductText(product, "desc");
    const origin = getProductText(product, "origin");
    const originLabel = getCurrentLanguage() === "ru" ? "Происхождение" : "Origin";

    return `
      <div class="pricing-card" data-modal="modal-${product.id}">
        <div class="product-image">
          <img src="/${product.image}" alt="${name}">
        </div>
        <h3>${name}</h3>
        <p class="product-desc">${desc}</p>
        <p class="product-origin">${originLabel}: ${origin}</p>
        <p class="price">${getPriceText(product.mainPrice)}</p>
        <a href="#" class="btn-more" data-i18n="products.learnMore">${t("products.learnMore")}</a>
      </div>
    `;
  }).join("");
}

function renderProductModals(products) {
  return products.map((product, index) => {
    const name = getProductText(product, "name");
    const total = products.length;
    const counter = `${index + 1}/${total}`;

    const variants = product.variants.map(variant => {
      const variantName = getProductText(variant, "name");
      const variantDesc = getProductText(variant, "desc");
      const variantPrice = getPriceText(variant.price);

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
    }).join("");

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
  }).join("");
}

export function Content() {
  const personal = getPersonalData();
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
        ${renderProductCards(products)}
      </div>
    </div>
  </section>

  ${renderProductModals(products)}
    
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
  <section id="portfolio" class="portfolio-section">
    <div class="portfolio-container">
      <h2 class="portfolio-title" data-i18n="portfolio.title">Successful Import Projects</h2>
      
      <div class="swiper portfolio-swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="portfolio-card">
              <div class="card-image" data-image-src="/img/img016.jpg" data-image-alt="Premium nuts import">
                <img src="/img/img016.jpg" alt="Premium nuts import" class="portfolio-image">
                <div class="card-overlay"><div class="zoom-icon"><i class="fas fa-expand"></i></div></div>
              </div>
              <div class="portfolio-content">
                <h3 data-i18n="portfolio.project1.title">Gulfood Dubai 2023</h3>
                <p data-i18n="portfolio.description1">Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
                <div class="project-stats"><div class="stat"><span class="stat-label" data-i18n="portfolio.detail1">Meeting with a regular supplier of dates from Tunisia</span></div></div>
              </div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="portfolio-card">
              <div class="card-image" data-image-src="/img/img002.jpg" data-image-alt="Premium nuts import">
                <img src="/img/img002.jpg" alt="Premium nuts import" class="portfolio-image">
                <div class="card-overlay"><div class="zoom-icon"><i class="fas fa-expand"></i></div></div>
              </div>
              <div class="portfolio-content">
                <h3 data-i18n="portfolio.project2.title">Gulfood Dubai 2023</h3>
                <p data-i18n="portfolio.description1">Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
                <div class="project-stats"><div class="stat"><span class="stat-label" data-i18n="portfolio.detail2">Discovering reliable suppliers of nuts and dried fruits worldwide.</span></div></div>
              </div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="portfolio-card">
              <div class="card-image" data-image-src="/img/img003.jpg" data-image-alt="Premium nuts import">
                <img src="/img/img003.jpg" alt="Premium nuts import" class="portfolio-image">
                <div class="card-overlay"><div class="zoom-icon"><i class="fas fa-expand"></i></div></div>
              </div>
              <div class="portfolio-content">
                <h3 data-i18n="portfolio.project3.title">Cashew processing and packaging insight, Vietnam</h3>
                <p data-i18n="portfolio.description1">Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
                <div class="project-stats"><div class="stat"><span class="stat-label" data-i18n="portfolio.detail3">Maintaining reliable partnerships.</span></div></div>
              </div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="portfolio-card">
              <div class="card-image" data-image-src="/img/img017.jpg" data-image-alt="Premium nuts import">
                <img src="/img/img017.jpg" alt="Premium nuts import" class="portfolio-image">
                <div class="card-overlay"><div class="zoom-icon"><i class="fas fa-expand"></i></div></div>
              </div>
              <div class="portfolio-content">
                <h3 data-i18n="portfolio.project4.title">Gulfood Dubai 2025</h3>
                <p data-i18n="portfolio.description1">Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
                <div class="project-stats"><div class="stat"><span class="stat-label" data-i18n="portfolio.detail4">Indian stand</span></div></div>
              </div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="portfolio-card">
              <div class="card-image" data-image-src="/img/img005.jpg" data-image-alt="Premium nuts import">
                <img src="/img/img005.jpg" alt="Premium nuts import" class="portfolio-image">
                <div class="card-overlay"><div class="zoom-icon"><i class="fas fa-expand"></i></div></div>
              </div>
              <div class="portfolio-content">
                <h3 data-i18n="portfolio.project5.title">Meeting with Russian Ambassador.</h3>
                <p data-i18n="portfolio.description1">Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
                <div class="project-stats"><div class="stat"><span class="stat-label" data-i18n="portfolio.detail5">Strengthening trade relations.</span></div></div>
              </div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="portfolio-card">
              <div class="card-image" data-image-src="/img/img007.jpg" data-image-alt="Premium nuts import">
                <img src="/img/img007.jpg" alt="Premium nuts import" class="portfolio-image">
                <div class="card-overlay"><div class="zoom-icon"><i class="fas fa-expand"></i></div></div>
              </div>
              <div class="portfolio-content">
                <h3 data-i18n="portfolio.project6.title">Gulfood Dubai 2022</h3>
                <p data-i18n="portfolio.description1">Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
                <div class="project-stats"><div class="stat"><span class="stat-label" data-i18n="portfolio.detail6">Connecting with international nut suppliers for long-term partnerships.</span></div></div>
              </div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="portfolio-card">
              <div class="card-image" data-image-src="/img/img008.jpg" data-image-alt="Premium nuts import">
                <img src="/img/img008.jpg" alt="Premium nuts import" class="portfolio-image">
                <div class="card-overlay"><div class="zoom-icon"><i class="fas fa-expand"></i></div></div>
              </div>
              <div class="portfolio-content">
                <h3 data-i18n="portfolio.project7.title">Gulfood Dubai 2025</h3>
                <p data-i18n="portfolio.description1">Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
                <div class="project-stats"><div class="stat"><span class="stat-label" data-i18n="portfolio.detail7">Scouting trusted nut suppliers for global markets.</span></div></div>
              </div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="portfolio-card">
              <div class="card-image" data-image-src="/img/img013.jpg" data-image-alt="Premium nuts import">
                <img src="/img/img013.jpg" alt="Premium nuts import" class="portfolio-image">
                <div class="card-overlay"><div class="zoom-icon"><i class="fas fa-expand"></i></div></div>
              </div>
              <div class="portfolio-content">
                <h3 data-i18n="portfolio.project8.title">Anuga Cologne 2025</h3>
                <p data-i18n="portfolio.description1">Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
                <div class="project-stats"><div class="stat"><span class="stat-label" data-i18n="portfolio.detail9">Securing supply chain connections.</span></div></div>
              </div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="portfolio-card">
              <div class="card-image" data-image-src="/img/img014.jpg" data-image-alt="Premium nuts import">
                <img src="/img/img014.jpg" alt="Premium nuts import" class="portfolio-image">
                <div class="card-overlay"><div class="zoom-icon"><i class="fas fa-expand"></i></div></div>
              </div>
              <div class="portfolio-content">
                <h3 data-i18n="portfolio.project9.title">Anuga Cologne 2025</h3>
                <p data-i18n="portfolio.description1">Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
                <div class="project-stats"><div class="stat"><span class="stat-label" data-i18n="portfolio.detail8">Exploring international markets for nuts and dried fruits.</span></div></div>
              </div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="portfolio-card">
              <div class="card-image" data-image-src="/img/img012.jpg" data-image-alt="Premium nuts import">
                <img src="/img/img012.jpg" alt="Premium nuts import" class="portfolio-image">
                <div class="card-overlay"><div class="zoom-icon"><i class="fas fa-expand"></i></div></div>
              </div>
              <div class="portfolio-content">
                <h3 data-i18n="portfolio.project10.title">Meeting another cashew supplier and investors</h3>
                <p data-i18n="portfolio.description1">Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
                <div class="project-stats"><div class="stat"><span class="stat-label" data-i18n="portfolio.detail9">Securing supply chain connections.</span></div></div>
              </div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="portfolio-card">
              <div class="card-image" data-image-src="/img/img019.jpg" data-image-alt="Premium nuts import">
                <img src="/img/img019.jpg" alt="Premium nuts import" class="portfolio-image">
                <div class="card-overlay"><div class="zoom-icon"><i class="fas fa-expand"></i></div></div>
              </div>
              <div class="portfolio-content">
                <h3 data-i18n="portfolio.project11.title">Gulfood Dubai 2025</h3>
                <p data-i18n="portfolio.description1">Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
                <div class="project-stats"><div class="stat"><span class="stat-label" data-i18n="portfolio.detail10">Life is buzzing here — ideas are born and deals are made!</span></div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </section>

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