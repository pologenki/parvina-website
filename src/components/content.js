import { personalEn } from "../content/content-en.js";
import { personalRu } from "../content/content-ru.js";
import { personalCn } from "../content/content-cn.js";
import { getCurrentLanguage, t } from "../utils/i18n.js";
import { responsiveImagePath, responsiveImageSrcset } from "../utils/responsiveImage.js";
import { renderCatalog } from "./catalog.js";
import { NutScene } from "./nut-scene.js";
import { renderImportServices } from "./import-services.js";
import { renderGallery } from "./gallery.js";

function getPersonalData() {
  const lang = localStorage.getItem("preferredLanguage") || "en";
  if (lang === "ru") return personalRu;
  if (lang === "cn") return personalCn;
  return personalEn;
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

export function getProducts() {
  return productsData?.products || [];
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
  return personal?.contacts?.socials?.[key] || "#footer";
}

function withMessage(link, message) {
  if (!link || link === "#footer") return link;
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
              <a class="modal-cta modal-cta-secondary" href="#footer" data-modal-contact data-i18n="products.requestQuote">${t("products.requestQuote")}</a>
              <button class="modal-cta modal-cta-copy" type="button" data-copy-product="${productInfo}" data-i18n="products.copyDetails">${t("products.copyDetails")}</button>
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

  return `
  ${NutScene(lang)}
  ${renderCatalog(products, lang)}

    
  ${renderImportServices(lang)}




${renderGallery(lang)}

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

  <div class="scroll-to-top" id="scrollToTop">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  </div>
  `;
}
