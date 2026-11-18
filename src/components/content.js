import { getCurrentLanguage, t } from '../utils/i18n.js';
import { renderCatalog } from './catalog.js';
import { NutScene } from './nut-scene.js';
import { renderImportServices } from './import-services.js';
import { renderGallery } from './gallery.js';

let productsData = null;

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

export function Content() {
  const lang = getCurrentLanguage();
  const products = productsData ? productsData.products : [];

  return `
  ${NutScene(lang)}
  ${renderCatalog(products, lang, productsData?.lastUpdated)}

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
