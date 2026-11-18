import './style.css';
import { Header } from './components/header.js';
import { Footer, initFooter } from './components/footer.js';
import { Content, loadProducts, getProducts } from './components/content.js';
import { initHeaderMenu } from './components/header-menu.js';
import { initCatalog } from './components/catalog.js';
import { initNutScene } from './components/nut-scene.js';
import { initImportServices } from './components/import-services.js';
import { initGallery } from './components/gallery.js';
import { initContactModal } from './components/contact.js';
import { initLegalDialogs } from './components/legal-dialogs.js';
import { initLanguage, t, loadTranslations, getCurrentLanguage, getLanguageFromPath } from './utils/i18n.js';
import { initContactForm } from './utils/emailService.js';
import { preventBodyScroll, allowBodyScroll } from './utils/scroll-lock.js';
import { trackEvent, initAnalyticsTracking } from './utils/analytics.js';

const LOGO_SCROLL_RESET_KEY = "pologenkiForceScrollTop";

function applyLogoScrollReset() {
  if (sessionStorage.getItem(LOGO_SCROLL_RESET_KEY) !== "1") return;

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const resetPosition = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  resetPosition();
  document.addEventListener("DOMContentLoaded", resetPosition, { once: true });
  window.addEventListener("pageshow", resetPosition, { once: true });
  window.addEventListener("load", () => {
    resetPosition();
    requestAnimationFrame(resetPosition);
    setTimeout(() => {
      resetPosition();
      sessionStorage.removeItem(LOGO_SCROLL_RESET_KEY);
    }, 100);
  }, { once: true });
}

applyLogoScrollReset();

// Function to update texts on the page
function updatePageTexts() {
  // Update all elements with data-i18n attribute
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const text = t(key);

    if (text && text !== key) {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.value = text;
      } else if (element.hasAttribute("placeholder")) {
        element.placeholder = text;
      } else {
        element.textContent = text;
      }
    }
  });

  // Update placeholders
  const placeholderElements = document.querySelectorAll(
    "[data-i18n-placeholder]",
  );
  placeholderElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    const text = t(key);

    if (text && text !== key) {
      element.placeholder = text;
    }
  });

  // Update titles
  const titleElements = document.querySelectorAll("[data-i18n-title]");
  titleElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-title");
    const text = t(key);

    if (text && text !== key) {
      element.title = text;
    }
  });

  // Update alt attributes
  const altElements = document.querySelectorAll("[data-i18n-alt]");
  altElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-alt");
    const text = t(key);

    if (text && text !== key) {
      element.alt = text;
    }
  });

  // Update aria-label attributes
  const ariaLabelElements = document.querySelectorAll("[data-i18n-aria-label]");
  ariaLabelElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-aria-label");
    const text = t(key);

    if (text && text !== key) {
      element.setAttribute("aria-label", text);
    }
  });

}

// Language selector update function
function updateLanguageSelector() {
  const current = getCurrentLanguage();
  document.querySelectorAll('.pv-language-option').forEach(option => {
    if (option.dataset.lang === current) option.setAttribute('aria-current', 'page');
    else option.removeAttribute('aria-current');
  });
}

let disposeLanguageSwitcher = () => {};
function initLanguageSwitcher() {
  disposeLanguageSwitcher();
  const controller = new AbortController();
  document.querySelectorAll('.pv-language-option').forEach(option => {
    option.addEventListener('click', async event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const lang = option.dataset.lang;
      localStorage.setItem('langChosen', '1');
      localStorage.setItem('preferredLanguage', lang);
      const path = { en: '/', ru: '/ru/', cn: '/zh-cn/' }[lang] || '/';
      if (location.pathname !== path) {
        location.assign(path + location.search + location.hash);
      } else if (getCurrentLanguage() !== lang) {
        await window.changeLanguage(lang);
      }
    }, { signal: controller.signal });
  });
  disposeLanguageSwitcher = () => controller.abort();
}

let disposeScrollToTop = () => {};

// Scroll to Top Function
function initScrollToTop() {
  disposeScrollToTop();
  const controller = new AbortController();
  const events = { signal: controller.signal };
  const scrollToTop = document.getElementById("scrollToTop");
  const pricingSection = document.querySelector(".pricing-section");

  if (!scrollToTop) return;

  let pricingSectionTop = 0;
  let hideTimeout = null;

  const positionTimer = setTimeout(() => {
    if (pricingSection) {
      pricingSectionTop = pricingSection.offsetTop;
    }
  }, 100);

  function showScrollButton() {
    scrollToTop.classList.add("show");

    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }

    // Define hide time depending on device
    const hideDelay = window.innerWidth >= 768 ? 3000 : 500; // 3 seconds for desktop, 0.5 for mobile

    hideTimeout = setTimeout(() => {
      scrollToTop.classList.remove("show");
    }, hideDelay);
  }

  function checkScroll() {
    if (window.pageYOffset > pricingSectionTop - 100) {
      showScrollButton();
    } else {
      scrollToTop.classList.remove("show");
    }
  }

  window.addEventListener("scroll", checkScroll, { ...events, passive: true });
  scrollToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, events);

  const initialTimer = setTimeout(checkScroll, 200);
  disposeScrollToTop = () => {
    controller.abort();
    clearTimeout(positionTimer);
    clearTimeout(initialTimer);
    clearTimeout(hideTimeout);
  };
}

function renderApp() {
  document.querySelector('#app').innerHTML = `${Header()}${Content()}${Footer()}`;
  updatePageTexts();
  initHeaderMenu();
  initGallery(getCurrentLanguage());
  initContactModal({ lockPage: preventBodyScroll, unlockPage: allowBodyScroll });
  initContactForm();
  initScrollToTop();
  initCatalog(getProducts(), getCurrentLanguage());
  initNutScene(getCurrentLanguage());
  initImportServices();
  initFooter();
  initLegalDialogs();
  initAnalyticsTracking();
  initLanguageSwitcher();
  updateLanguageSelector();
  requestAnimationFrame(() => document.documentElement.classList.remove('app-loading'));
}

async function initApp() {
  localStorage.setItem('preferredLanguage', getLanguageFromPath());
  await initLanguage();
  await loadProducts();
  renderApp();
}

window.changeLanguage = async function (lang) {
  const previousLanguage = getCurrentLanguage();
  await loadTranslations(lang);
  trackEvent('change_language', { previous_language: previousLanguage, selected_language: lang });
  await loadProducts();
  renderApp();
};

initApp().catch(error => {
  console.error('Application initialization failed', error);
  document.documentElement.classList.remove('app-loading');
});

// Preserve anchor navigation when opening a link from another page.
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
  }
});
