import { personalEn } from "../content/content-en.js";
import { personalRu } from "../content/content-ru.js";
import { personalCn } from "../content/content-cn.js";
import { getCurrentLanguage, t } from "../utils/i18n.js";
import { responsiveImagePath, responsiveImageSrcset } from "../utils/responsiveImage.js";

function getPersonalData() {
  const lang = localStorage.getItem("preferredLanguage") || "en";
  if (lang === "ru") return personalRu;
  if (lang === "cn") return personalCn;
  return personalEn;
}

const serviceSlugs = [
  "supplier-sourcing",
  "contract-negotiation",
  "logistics-coordination",
  "trade-documentation",
  "shipment-monitoring",
  "full-service-import",
];

function getServicePageUrl(index, lang) {
  const prefix = lang === "ru" ? "/ru" : lang === "cn" ? "/zh-cn" : "";
  return `${prefix}/services/${serviceSlugs[index]}/`;
}

// Load products from products.json and render
let productsData = null;

const productCn = {
  cashew: { name: "腰果", desc: "AFI 标准", origin: "越南" },
  walnuts: { name: "核桃仁", desc: "特级浅色半仁", origin: "中国" },
  dates: { name: "椰枣干", desc: "Deglet Nour 椰枣", origin: "突尼斯" },
  papaya: { name: "木瓜干丁", desc: "混色/天然色 8-10 mm", origin: "中国" },
  mango: { name: "芒果干", desc: "含糖及无糖产品", origin: "越南、中国" },
  "walnuts-shell": { name: "带壳核桃", desc: "多种规格，清洗处理", origin: "中国" },
  peanuts: { name: "生花生", desc: "规格 40/50、50/60", origin: "印度" },
  "peanuts-blanched": { name: "脱皮花生", desc: "整粒、半粒", origin: "印度" },
  "dried-fruits": { name: "果干", desc: "渗透脱水果干", origin: "中国" },
  "banana-chips": { name: "香蕉片", desc: "整片、半片、四分片", origin: "菲律宾" },
};

export async function loadProducts() {
  try {
    const response = await fetch("/data/products.json");
    productsData = await response.json();
    productsData.products = (productsData.products || []).filter((product) => product.published !== false);
  } catch (e) {
    console.error("Failed to load products.json", e);
    productsData = { products: [] };
  }
}

function getProductText(product, field, lang) {
  if (lang === "cn") {
    if (product[field + "_cn"]) return product[field + "_cn"];
    if (productCn[product.id]?.[field]) return productCn[product.id][field];
  }
  if (lang === "ru" && product[field + "_ru"]) {
    return product[field + "_ru"];
  }
  return product[field] || "";
}

function getPriceText(price, lang) {
  if (price === "Price on request") {
    return t("products.priceOnRequest");
  }
  return price;
}

function getSocialLink(personal, key) {
  return personal?.contacts?.socials?.[key] || "#contact";
}

function withMessage(link, message) {
  if (!link || link === "#contact") return link;
  const separator = link.includes("?") ? "&" : "?";
  const param = link.includes("wa.me") ? "text" : "text";
  return `${link}${separator}${param}=${encodeURIComponent(message)}`;
}

function getProductPageUrl(product, lang) {
  const languagePrefix = lang === "ru" ? "/ru" : lang === "cn" ? "/zh-cn" : "";
  const productSlug = encodeURIComponent(product.id || "product");
  return `${languagePrefix}/products/${productSlug}/`;
}

function renderProductCards(products, lang) {
  return products
    .map((product, index) => {
      const name = getProductText(product, "name", lang);
      const desc = getProductText(product, "desc", lang);
      const origin = getProductText(product, "origin", lang);
      const originLabel = t("products.origin");
      const productPageUrl = getProductPageUrl(product, lang);

      return `
      <div class="pricing-card" data-modal="modal-${product.id}">
        <div class="product-image">
          <img src="${responsiveImagePath(product.image, 480)}" srcset="${responsiveImageSrcset(product.image, [240, 480])}" sizes="(max-width: 640px) 42vw, 190px" alt="${name}" width="480" height="480" loading="lazy" decoding="async">
        </div>
        <h3>${name}</h3>
        <p class="product-desc">${desc}</p>
        <p class="product-origin">${originLabel}: ${origin}</p>
        <p class="price">${getPriceText(product.mainPrice, lang)}</p>
        <a href="${productPageUrl}" class="btn-more" data-i18n="products.viewDetails">${t("products.viewDetails")}</a>
      </div>
    `;
    })
    .join("");
}

function renderProductModals(products, lang, personal) {
  const whatsappLink = getSocialLink(personal, "whatsapp");
  const telegramLink = getSocialLink(personal, "telegram");

  return products
    .map((product, index) => {
      const name = getProductText(product, "name", lang);
      const desc = getProductText(product, "desc", lang);
      const origin = getProductText(product, "origin", lang);
      const mainPrice = getPriceText(product.mainPrice, lang);
      const total = products.length;
      const counter = `${index + 1}/${total}`;
      const originLabel = t("products.origin");
      const inquiryMessage =
        lang === "ru"
          ? `Здравствуйте! Интересует ${name}. Подскажите актуальную цену и условия поставки.`
          : lang === "cn"
            ? `您好！我对${name}感兴趣。请提供当前价格和交货条件。`
            : `Hello! I am interested in ${name}. Please share the current price and delivery terms.`;
      const productInfo = `${name} | ${originLabel}: ${origin} | ${mainPrice}`;

      const variants = product.variants
        .map((variant, variantIndex) => {
          const variantName = getProductText(variant, "name", lang);
          const variantDesc = getProductText(variant, "desc", lang);
          const variantPrice = getPriceText(variant.price, lang);

          return `
        <div class="product-type clickable-product" data-contact="true" data-product-info="${productInfo} | ${variantName} | ${variantPrice}">
          <span class="variant-index">${String(variantIndex + 1).padStart(2, "0")}</span>
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
            <div class="modal-product-hero">
              <div class="modal-product-image">
                <img src="${responsiveImagePath(product.image, 480)}" srcset="${responsiveImageSrcset(product.image, [240, 480])}" sizes="(max-width: 768px) 72vw, 300px" alt="${name}" width="480" height="480" loading="lazy" decoding="async">
              </div>
              <div class="modal-product-summary">
                <span class="modal-product-label" data-i18n="products.productSnapshot">${t("products.productSnapshot")}</span>
                <h3>${name}</h3>
                <p>${desc}</p>
                <div class="modal-product-meta">
                  <span>${originLabel}: ${origin}</span>
                  <strong>${mainPrice}</strong>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-body">
            <div class="modal-section-title">
              <span data-i18n="products.availableVariants">${t("products.availableVariants")}</span>
              <strong>${product.variants.length}</strong>
            </div>
            <div class="product-types">
              ${variants}
            </div>
            <div class="product-service-note">
              <strong data-i18n="products.serviceNoteTitle">${t("products.serviceNoteTitle")}</strong>
              <span data-i18n="products.serviceNoteText">${t("products.serviceNoteText")}</span>
            </div>
            <div class="product-modal-actions">
              <a class="modal-cta modal-cta-primary" href="${withMessage(whatsappLink, inquiryMessage)}" target="_blank" rel="noopener" data-i18n="products.contactViaWhatsapp">${t("products.contactViaWhatsapp")}</a>
              <a class="modal-cta" href="${withMessage(telegramLink, inquiryMessage)}" target="_blank" rel="noopener" data-i18n="products.contactViaTelegram">${t("products.contactViaTelegram")}</a>
              <a class="modal-cta modal-cta-secondary" href="#contact" data-modal-contact data-i18n="products.requestQuote">${t("products.requestQuote")}</a>
              <button class="modal-cta modal-cta-copy" type="button" data-copy-product="${productInfo}" data-i18n="products.copyDetails">${t("products.copyDetails")}</button>
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

function serviceIncludesHtml(serviceKey) {
  return `
    <div class="service-modal-includes">
      <strong data-i18n="services.modalIncludesTitle">${t("services.modalIncludesTitle")}</strong>
      <ul>
        <li data-i18n="services.${serviceKey}Include1">${t(`services.${serviceKey}Include1`)}</li>
        <li data-i18n="services.${serviceKey}Include2">${t(`services.${serviceKey}Include2`)}</li>
        <li data-i18n="services.${serviceKey}Include3">${t(`services.${serviceKey}Include3`)}</li>
      </ul>
    </div>
  `;
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
          <span class="about-eyebrow" data-i18n="about.heroEyebrow">${t("about.heroEyebrow")}</span>
          <h2 class="about-title">${personal.about.title}</h2>
          <h3 class="about-subtitle">${personal.about.subtitle}</h3>
          <p class="about-description">${personal.about.description}</p>
          <div class="about-capabilities">
            <span data-i18n="about.chipSourcing">${t("about.chipSourcing")}</span>
            <span data-i18n="about.chipPricing">${t("about.chipPricing")}</span>
            <span data-i18n="about.chipDocuments">${t("about.chipDocuments")}</span>
            <span data-i18n="about.chipDelivery">${t("about.chipDelivery")}</span>
          </div>
          <div class="about-workflow">
            <div>
              <span>01</span>
              <strong data-i18n="about.workflowSupplier">${t("about.workflowSupplier")}</strong>
            </div>
            <div>
              <span>02</span>
              <strong data-i18n="about.workflowPrice">${t("about.workflowPrice")}</strong>
            </div>
            <div>
              <span>03</span>
              <strong data-i18n="about.workflowDelivery">${t("about.workflowDelivery")}</strong>
            </div>
          </div>
          <div class="about-actions">
            <a href="#contact" class="about-cta about-cta-primary" data-i18n="about.primaryCta">${t("about.primaryCta")}</a>
            <a href="#products" class="about-cta" data-i18n="about.secondaryCta">${t("about.secondaryCta")}</a>
          </div>
          
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
          <div class="about-visual-card">
            <img src="${responsiveImagePath(personal.about.photo, 768)}" srcset="${responsiveImageSrcset(personal.about.photo, [480, 768, 1148])}" sizes="(max-width: 768px) calc(100vw - 40px), 480px" alt="${personal.about.photoAlt || personal.about.title}" class="profile-photo" id="aboutPhoto" width="1148" height="1371" fetchpriority="high" decoding="async">
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="pricing-section" id="products">
    <div class="container">
      <div class="products-heading">
        <h2 class="section-title" data-i18n="products.title">Our Products</h2>
        <p class="products-subtitle" data-i18n="products.subtitle">${t("products.subtitle")}</p>
        <div class="products-meta-row">
          <p class="price-update-date">
            <span data-i18n="products.lastUpdated">${t("products.lastUpdated")}</span>
            <strong id="current-date"></strong>
          </p>
          <span class="products-chip" data-i18n="products.originVerified">${t("products.originVerified")}</span>
          <span class="products-chip products-chip-dark" data-i18n="products.importSupportShort">${t("products.importSupportShort")}</span>
        </div>
      </div>
      
 <div class="pricing-grid">
        ${renderProductCards(products, lang)}
      </div>
    </div>
  </section>
${renderProductModals(products, lang, personal)}

    
  <!-- Services section -->
  <section id="services" class="services-section">
    <div class="services-container">
      <h2 class="services-title" data-i18n="services.title">Import Management Services</h2>
      <p class="services-subtitle" data-i18n="services.subtitle">${t("services.subtitle")}</p>
      <div class="services-grid">
        <div class="service-card" data-service-modal="modal1">
          <span class="service-card-number">01</span>
          <div class="service-icon"><i class="fas fa-search-dollar"></i></div>
          <h3 class="service-name" data-i18n="services.supplierSourcing">Supplier Sourcing</h3>
          <span class="service-outcome" data-i18n="services.sourcingOutcome">${t("services.sourcingOutcome")}</span>
          <p class="service-description" data-i18n="services.supplierDescription">Finding reliable suppliers worldwide with thorough due diligence and quality verification for nuts, dried fruits, and spices.</p>
          <a class="read-more-btn service-page-link" href="${getServicePageUrl(0, lang)}">
            <span data-i18n="services.readMore">Read More</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/></svg>
          </a>
        </div>
        
        <div class="service-card" data-service-modal="modal2">
          <span class="service-card-number">02</span>
          <div class="service-icon"><i class="fas fa-handshake"></i></div>
          <h3 class="service-name" data-i18n="services.contractNegotiation">Contract Negotiation</h3>
          <span class="service-outcome" data-i18n="services.negotiationOutcome">${t("services.negotiationOutcome")}</span>
          <p class="service-description" data-i18n="services.contractDescription">Securing optimal terms and pricing through expert negotiation while protecting client interests in international deals.</p>
          <a class="read-more-btn service-page-link" href="${getServicePageUrl(1, lang)}">
            <span data-i18n="services.readMore">Read More</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/></svg>
          </a>
        </div>
        
        <div class="service-card" data-service-modal="modal3">
          <span class="service-card-number">03</span>
          <div class="service-icon"><i class="fas fa-shipping-fast"></i></div>
          <h3 class="service-name" data-i18n="services.logisticsManagement">Logistics Management</h3>
          <span class="service-outcome" data-i18n="services.logisticsOutcome">${t("services.logisticsOutcome")}</span>
          <p class="service-description" data-i18n="services.logisticsDescription">Coordinating seamless transportation with trusted partners and optimizing supply chain routes for cost efficiency.</p>
          <a class="read-more-btn service-page-link" href="${getServicePageUrl(2, lang)}">
            <span data-i18n="services.readMore">Read More</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/></svg>
          </a>
        </div>
        
        <div class="service-card" data-service-modal="modal4">
          <span class="service-card-number">04</span>
          <div class="service-icon"><i class="fas fa-passport"></i></div>
          <h3 class="service-name" data-i18n="services.tradeDocumentation">Trade Documentation</h3>
          <span class="service-outcome" data-i18n="services.documentsOutcome">${t("services.documentsOutcome")}</span>
          <p class="service-description" data-i18n="services.documentationDescription">Handling complete customs documentation and compliance to ensure smooth customs clearance and timely delivery.</p>
          <a class="read-more-btn service-page-link" href="${getServicePageUrl(3, lang)}">
            <span data-i18n="services.readMore">Read More</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/></svg>
          </a>
        </div>
        
        <div class="service-card" data-service-modal="modal5">
          <span class="service-card-number">05</span>
          <div class="service-icon"><i class="fas fa-anchor"></i></div>
          <h3 class="service-name" data-i18n="services.shipmentMonitoring">Shipment Monitoring</h3>
          <span class="service-outcome" data-i18n="services.monitoringOutcome">${t("services.monitoringOutcome")}</span>
          <p class="service-description" data-i18n="services.monitoringDescription">Every shipment is tracked daily — from loading to final delivery. I monitor all logistics stages to ensure deadlines and product safety.</p>
          <a class="read-more-btn service-page-link" href="${getServicePageUrl(4, lang)}">
            <span data-i18n="services.readMore">Read More</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/></svg>
          </a>
        </div>
        
        <div class="service-card" data-service-modal="modal6">
          <span class="service-card-number">06</span>
          <div class="service-icon"><i class="fas fa-tasks"></i></div>
          <h3 class="service-name" data-i18n="services.fullServiceImport">Full-Service Import</h3>
          <span class="service-outcome" data-i18n="services.fullOutcome">${t("services.fullOutcome")}</span>
          <p class="service-description" data-i18n="services.importDescription">End-to-end import solutions tailored to your business needs - from sourcing to final delivery at your warehouse.</p>
          <a class="read-more-btn service-page-link" href="${getServicePageUrl(5, lang)}">
            <span data-i18n="services.readMore">Read More</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/></svg>
          </a>
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
      ${serviceIncludesHtml("sourcing")}
      <a href="#contact" class="service-modal-cta" data-service-contact data-i18n="services.discussRequest">${t("services.discussRequest")}</a>
    </div>
  </div>
  <div class="service-modal" id="modal2">
    <div class="service-modal-content">
      <div class="close-modal"></div>
      <div class="service-modal-icon"><i class="fas fa-handshake"></i></div>
      <h3 data-i18n="modals.service2.title">Contract Negotiation & Terms</h3>
      <p data-i18n="modals.service2.description">Leveraging my expertise in international trade, I negotiate favorable terms covering pricing, payment conditions, delivery schedules, and quality specifications.</p>
      ${serviceIncludesHtml("negotiation")}
      <a href="#contact" class="service-modal-cta" data-service-contact data-i18n="services.discussRequest">${t("services.discussRequest")}</a>
    </div>
  </div>
  <div class="service-modal" id="modal3">
    <div class="service-modal-content">
      <div class="close-modal"></div>
      <div class="service-modal-icon"><i class="fas fa-shipping-fast"></i></div>
      <h3 data-i18n="modals.service3.title">Logistics & Supply Chain Management</h3>
      <p data-i18n="modals.service3.description">I coordinate with trusted freight forwarders, customs brokers, and transportation providers to design optimal shipping routes.</p>
      ${serviceIncludesHtml("logistics")}
      <a href="#contact" class="service-modal-cta" data-service-contact data-i18n="services.discussRequest">${t("services.discussRequest")}</a>
    </div>
  </div>
  <div class="service-modal" id="modal4">
    <div class="service-modal-content">
      <div class="close-modal"></div>
      <div class="service-modal-icon"><i class="fas fa-passport"></i></div>
      <h3 data-i18n="modals.service4.title">International Trade Documentation</h3>
      <p data-i18n="modals.service4.description">I manage the complete documentation process including commercial invoices, packing lists, certificates of origin, phytosanitary certificates, and customs declarations.</p>
      ${serviceIncludesHtml("documents")}
      <a href="#contact" class="service-modal-cta" data-service-contact data-i18n="services.discussRequest">${t("services.discussRequest")}</a>
    </div>
  </div>
  <div class="service-modal" id="modal5">
    <div class="service-modal-content">
      <div class="close-modal"></div>
      <div class="service-modal-icon"><i class="fas fa-anchor"></i></div>
      <h3 data-i18n="modals.service5.title">Shipment Monitoring & Quality Assurance</h3>
      <p data-i18n="modals.service5.description">I provide continuous tracking and monitoring of shipments from loading to final delivery.</p>
      ${serviceIncludesHtml("monitoring")}
      <a href="#contact" class="service-modal-cta" data-service-contact data-i18n="services.discussRequest">${t("services.discussRequest")}</a>
    </div>
  </div>
  <div class="service-modal" id="modal6">
    <div class="service-modal-content">
      <div class="close-modal"></div>
      <div class="service-modal-icon"><i class="fas fa-tasks"></i></div>
      <h3 data-i18n="modals.service6.title">Comprehensive Import Solutions</h3>
      <p data-i18n="modals.service6.description">As your dedicated import manager, I provide end-to-end solutions tailored to your specific business needs.</p>
      ${serviceIncludesHtml("full")}
      <a href="#contact" class="service-modal-cta" data-service-contact data-i18n="services.discussRequest">${t("services.discussRequest")}</a>
    </div>
  </div>


<!-- Portfolio section -->
<section id="portfolio" class="portfolio-section" style="background:#f8f9fa;">
    <div class="portfolio-container">
      <div style="text-align:center;font-size:0.65rem;letter-spacing:0.3em;text-transform:uppercase;color:#66b1f1;margin-bottom:0.75rem;">Portfolio</div>
      <h2 class="portfolio-title" data-i18n="portfolio.title">Successful Import Projects</h2>

      <div class="flip-slider-wrap">
        <div class="flip-slider-track" id="portfolioTrack"></div>
        <div class="portfolio-slider-meta">
          <span id="portfolioCounter">1 / 1</span>
          <span data-i18n="portfolio.sliderHint">${t("portfolio.sliderHint")}</span>
        </div>
        <div class="flip-slider-nav">
          <button class="flip-nav-btn" id="portfolioPrev">←</button>
          <div class="flip-nav-dots" id="portfolioDots"></div>
          <button class="flip-nav-btn" id="portfolioNext">→</button>
        </div>
      </div>
    </div>
  </section>

  <section id="partners" class="partners-section" aria-label="${t("partners.title")}">
    <div class="partners-container">
      <div class="partners-copy">
        <span class="partners-eyebrow" data-i18n="partners.eyebrow">${t("partners.eyebrow")}</span>
        <h2 data-i18n="partners.title">${t("partners.title")}</h2>
        <p data-i18n="partners.subtitle">${t("partners.subtitle")}</p>
      </div>
      <div class="partners-logo-row">
        <div class="partner-logo-card">
          <span>VN</span>
          <strong data-i18n="partners.partner1">${t("partners.partner1")}</strong>
        </div>
        <div class="partner-logo-card">
          <span>CN</span>
          <strong data-i18n="partners.partner2">${t("partners.partner2")}</strong>
        </div>
        <div class="partner-logo-card">
          <span>IN</span>
          <strong data-i18n="partners.partner3">${t("partners.partner3")}</strong>
        </div>
        <div class="partner-logo-card partner-logo-card-muted">
          <span>+</span>
          <strong data-i18n="partners.moreSoon">${t("partners.moreSoon")}</strong>
        </div>
      </div>
    </div>
  </section>

  <!-- Zoom overlay -->
  <div class="zoom-overlay" id="zoomOverlay">
    <div class="zoom-backdrop" id="zoomBackdrop"></div>
    <div class="zoom-content">
      <button class="zoom-close" id="zoomClose">✕</button>
      <button class="zoom-nav zoom-prev" id="zoomPrev">←</button>
      <button class="zoom-nav zoom-next" id="zoomNext">→</button>
      <img class="zoom-img" id="zoomImg" src="" alt="">
      <div class="zoom-caption">
        <div class="zoom-caption-title" id="zoomTitle"></div>
        <div class="zoom-caption-desc" id="zoomDesc"></div>
        <div class="zoom-thumbs" id="zoomThumbs"></div>
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
      <p class="contacts-subtitle" data-i18n="contact.subtitle">${t("contact.subtitle")}</p>
      <div class="contacts-content">
        <div class="contact-form-container">
          <div class="contact-form-heading">
            <span data-i18n="contact.formEyebrow">${t("contact.formEyebrow")}</span>
            <p data-i18n="contact.formHint">${t("contact.formHint")}</p>
          </div>
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
          <div class="contact-trust-list">
            <span data-i18n="contact.replyTime">${t("contact.replyTime")}</span>
            <span data-i18n="contact.scope">${t("contact.scope")}</span>
          </div>
          <div class="contact-form-socials">
            <div class="social-icons">
              ${socialsHtml}
            </div>
          </div>
        </div>
        <div class="contact-info-container">
          <div class="contact-channel-panel">
            <span class="contact-panel-label" data-i18n="contact.preferredContact">${t("contact.preferredContact")}</span>
            <h3 data-i18n="contact.fastestWay">${t("contact.fastestWay")}</h3>
            <p data-i18n="contact.fastestWayText">${t("contact.fastestWayText")}</p>
            <div class="primary-contact-actions">
              <a href="${personal.contacts.socials.whatsapp}" class="quick-contact-card quick-contact-primary whatsapp" target="_blank" rel="noopener">
                <i class="fab fa-whatsapp"></i>
                <span>WhatsApp</span>
              </a>
              <a href="${personal.contacts.socials.telegram}" class="quick-contact-card quick-contact-primary telegram" target="_blank" rel="noopener">
                <i class="fab fa-telegram"></i>
                <span>Telegram</span>
              </a>
            </div>
            <div class="secondary-contact-grid">
              <a href="${personal.contacts.socials.facebook}" class="quick-contact-card facebook" target="_blank" rel="noopener">
                <i class="fab fa-facebook-f"></i>
                <span>Facebook</span>
              </a>
              <button type="button" class="quick-contact-card gmail email-link">
                <i class="fab fa-google"></i>
                <span>Gmail</span>
              </button>
              <a href="${personal.contacts.socials.wechat}" class="quick-contact-card wechat" target="_blank" rel="noopener">
                <i class="fab fa-weixin"></i>
                <span>WeChat</span>
              </a>
            </div>
            <div class="contact-direct-email email-link">
              <i class="far fa-envelope"></i>
              <div>
                <span data-i18n="contact.emailDirect">${t("contact.emailDirect")}</span>
                <strong>${personal.contacts.email}</strong>
              </div>
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
