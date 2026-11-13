import "./style.css";
import { Header } from "./components/header.js";
import { Footer, initFooter } from "./components/footer.js";
import { initHeaderMenu } from "./components/header-menu.js";
import { initSectionScript } from "./components/sectionScript.js";
import {
  initLanguage,
  t,
  loadTranslations,
  getCurrentLanguage,
  getLanguageFromPath,
} from "./utils/i18n.js";
import { initContactForm } from "./utils/emailService.js";
import { Content, loadProducts, getProducts } from "./components/content.js";
import { initCatalog } from "./components/catalog.js";
import { initNutScene } from "./components/nut-scene.js";
import { initImportServices } from "./components/import-services.js";
import { initGallery } from "./components/gallery.js";
import { initContactModal } from "./components/contact.js";

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

function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, {
    page_language: getCurrentLanguage(),
    ...params,
  });
}

window.trackSiteEvent = trackEvent;

// Scroll management for modals
let modalOpenCount = 0;
let savedScrollPosition = 0;

function preventBodyScroll() {
  modalOpenCount++;
  if (modalOpenCount === 1) {
    // Save current scroll position
    savedScrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;

    // Completely block scrolling with position: fixed
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollPosition}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    // Preserve the scrollbar width to prevent layout shift
    document.body.style.paddingRight =
      window.innerWidth - document.documentElement.clientWidth + "px";
  }
}

function allowBodyScroll() {
  if (modalOpenCount > 0) {
    modalOpenCount--;
    if (modalOpenCount === 0) {
      // Restore scroll position
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      // Restore scroll position
      window.scrollTo(0, savedScrollPosition);
    }
  }
}

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

// пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅ content-en.js пїЅ content-ru.js пїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ

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

function showLanguageNotification(lang) {
  const messages = {
    en: "Language changed to English",
    ru: "Язык изменён на русский",
    cn: "语言已切换为中文",
  };

  const notification = document.createElement("div");
  notification.className = "language-notification";
  notification.textContent = messages[lang] || "Language changed";

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 10000;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease-out;
  `;

  // пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ CSS пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ
  if (!document.getElementById("language-notification-styles")) {
    const style = document.createElement("style");
    style.id = "language-notification-styles";
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease-in forwards";

      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 3000);
}

// Function to render the entire application
async function renderApp() {
  document.querySelector("#app").innerHTML = `
    ${Header()}
    ${Content()}
    ${Footer()}
  `;

  // Update texts after render
  updatePageTexts();

  // Initialize all components
  initHeaderMenu();
  initSectionScript();

  // Add small delay to ensure DOM is ready for Swiper
  await new Promise((resolve) => setTimeout(resolve, 50));
  initGallery(getCurrentLanguage());
  initContactModal({ lockPage: preventBodyScroll, unlockPage: allowBodyScroll });
  initContactForm();
  initScrollToTop();
  initCatalog(getProducts(), getCurrentLanguage());
  initNutScene(getCurrentLanguage());
  initServiceModals();
  initFooterModals();
  initEmailLinks();
  initAnalyticsTracking();

  // Initialize language switcher
  initLanguageSwitcher();
  updateLanguageSelector();

  // Add logo handlers after DOM is ready
  addLogoHandlers();

  // Set current date
  setCurrentDate();

  requestAnimationFrame(() => {
    document.documentElement.classList.remove("app-loading");
  });
}

// Application initialization
async function initApp() {
  const pathLanguage = getLanguageFromPath();
  localStorage.setItem("preferredLanguage", pathLanguage);
  await initLanguage();
  await loadProducts();
  await renderApp();
}

window.changeLanguage = async function (lang) {
  const previousLanguage = getCurrentLanguage();
  await loadTranslations(lang);
  trackEvent("change_language", {
    previous_language: previousLanguage,
    selected_language: lang,
  });
  await loadProducts();
  const appContainer = document.querySelector("#app");
  if (appContainer) {
    appContainer.innerHTML = `
      ${Header()}
      ${Content()}
      ${Footer()}
    `;
  }

  // Update texts after re-rendering
  updatePageTexts();
  updateLanguageSelector();
  // Close any open mobile menus after language change
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const overlay = document.querySelector(".menu-overlay");
  const languageDropdown = document.querySelector(".language-dropdown");

  if (menuToggle) menuToggle.classList.remove("active");
  if (navMenu) navMenu.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
  if (languageDropdown) languageDropdown.classList.remove("active");
  document.body.classList.remove("menu-open");

  await new Promise((resolve) => setTimeout(resolve, 50));
  initGallery(getCurrentLanguage());
  initContactModal({ lockPage: preventBodyScroll, unlockPage: allowBodyScroll });
  initContactForm();
  initScrollToTop();
  initCatalog(getProducts(), getCurrentLanguage());
  initNutScene(getCurrentLanguage());
  initServiceModals();
  initFooterModals();
  initEmailLinks();
  initLanguageSwitcher();
  updateLanguageSelector();
  initHeaderMenu();
  addLogoHandlers();
  setCurrentDate();
};

// Start the application
initApp().catch((error) => {
  console.error("Application initialization failed", error);
  document.documentElement.classList.remove("app-loading");
});

// Services modal and animation lifecycle (also reset when changing language).
function initServiceModals() {
  initImportServices();
}



// Current date function
function getLastTuesday() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0-6 (Sunday=0, Monday=1, Tuesday=2)

  // If today is Tuesday (2) and time is after 10:00 AM, use today's date
  // Otherwise use last Tuesday
  let lastTuesday = new Date(today);

  if (dayOfWeek === 2 && today.getHours() >= 10) {
    // Today is Tuesday and already after 10 AM - use today
    return lastTuesday;
  } else {
    // Find last Tuesday
    const daysSinceTuesday = (dayOfWeek + 5) % 7;
    lastTuesday.setDate(today.getDate() - daysSinceTuesday);
    return lastTuesday;
  }
}

function formatDate(date) {
  const currentLang = getCurrentLanguage();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅ
  return date.toLocaleDateString(
    currentLang === "ru" ? "ru-RU" : currentLang === "cn" ? "zh-CN" : "en-US",
    options,
  );
}

function setCurrentDate() {
  const dateElement = document.getElementById("current-date");
  if (dateElement) {
    dateElement.textContent = formatDate(getLastTuesday());
  }
}

function initAnalyticsTracking() {
  const sectionMap = [
    ["about", "view_about"],
    ["products", "view_products"],
    ["services", "view_services"],
    ["portfolio", "view_portfolio"],
    ["contact", "view_contact"],
  ];

  const seenSections = new Set();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const sectionId = entry.target.id;
          if (seenSections.has(sectionId)) return;
          seenSections.add(sectionId);
          const eventName =
            sectionMap.find(([id]) => id === sectionId)?.[1] || "view_section";
          trackEvent(eventName, { section_id: sectionId });
        });
      },
      { threshold: 0.45 },
    );

    sectionMap.forEach(([sectionId]) => {
      const section = document.getElementById(sectionId);
      if (section) observer.observe(section);
    });
  }

  if (!window.__pologenkiAnalyticsClickBound) {
    window.__pologenkiAnalyticsClickBound = true;
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a, button, .email-link");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      const label = (link.textContent || link.title || link.getAttribute("aria-label") || "")
        .trim()
        .slice(0, 80);

      if (href.includes("wa.me") || link.classList.contains("whatsapp")) {
        trackEvent("click_whatsapp", { link_text: label, link_url: href });
        return;
      }

      if (href.includes("t.me") || link.classList.contains("telegram")) {
        trackEvent("click_telegram", { link_text: label, link_url: href });
        return;
      }

      if (href.startsWith("mailto:") || link.hasAttribute('data-contact-open') || link.classList.contains("email-link")) {
        trackEvent("click_email", { link_text: label, link_url: href || "email_copy" });
        return;
      }

      if (href.startsWith("tel:")) {
        trackEvent("click_phone", { link_text: label, link_url: href });
        return;
      }

      if (href === "#footer" || link.dataset.modalContact !== undefined || link.dataset.serviceContact !== undefined) {
        trackEvent("click_request_quote", { link_text: label });
      }
    });

    document.addEventListener(
      "submit",
      (event) => {
        if (event.target?.id === "contact-form") {
          trackEvent("submit_contact_form", { form_id: "contact-form" });
        }
      },
      true,
    );
  }
}

// Scroll to Top Function
function initScrollToTop() {
  const scrollToTop = document.getElementById("scrollToTop");
  const pricingSection = document.querySelector(".pricing-section");

  if (!scrollToTop) return;

  let pricingSectionTop = 0;
  let hideTimeout = null;

  setTimeout(() => {
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

  window.addEventListener("scroll", checkScroll);
  scrollToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  setTimeout(checkScroll, 200);
}

// Product Modals Function
function initProductModals() {
  const pricingCards = document.querySelectorAll(".pricing-card[data-modal]");
  const pricingCardsNoModal = document.querySelectorAll(
    ".pricing-card:not([data-modal])",
  );
  const modals = document.querySelectorAll(".product-modal");
  const closeButtons = document.querySelectorAll(".close-modal");
  const clickableProducts = document.querySelectorAll(".clickable-product");
  const modalContactLinks = document.querySelectorAll("[data-modal-contact]");
  const modalCopyButtons = document.querySelectorAll("[data-copy-product]");

  // Modal navigation buttons
  const modalPrevButtons = document.querySelectorAll(".modal-prev");
  const modalNextButtons = document.querySelectorAll(".modal-next");

  // Array of all modal IDs for navigation
  const modalIds = Array.from(document.querySelectorAll(".product-modal")).map(
    (modal) => modal.id,
  );
  let currentModalIndex = 0;

  // Function to close modal window with animation
  function closeModal(modal) {
    modal.classList.add("closing");
    allowBodyScroll();

    setTimeout(() => {
      modal.classList.remove("active", "closing");
    }, 300);
  }

  // Function to switch between modals
  function switchModal(direction) {
    const activeModal = document.querySelector(".product-modal.active");
    if (!activeModal) return;

    const currentIndex = modalIds.indexOf(activeModal.id);
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % modalIds.length;
    } else {
      newIndex = (currentIndex - 1 + modalIds.length) % modalIds.length;
    }

    // Close current modal
    closeModal(activeModal);

    // Open new modal after animation
    setTimeout(() => {
      const newModal = document.getElementById(modalIds[newIndex]);
      if (newModal) {
        newModal.classList.add("active");
        preventBodyScroll();
        trackEvent("open_product_modal", {
          product_id: newModal.id.replace(/^modal-/, ""),
          open_source: `modal_${direction}`,
        });
      }
    }, 350);
  }

  // Update modal counter
  function updateModalCounter(modal) {
    const modalId = modal.id;
    const modalIndex = modalIds.indexOf(modalId) + 1;
    const counter = modal.querySelector(".modal-counter");
    if (counter) {
      counter.textContent = `${modalIndex}/${modalIds.length}`;
    }
  }

  // Handle cards WITH modal windows
  pricingCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // If clicked on "Learn More" - open modal window
      if (e.target.closest(".btn-more")) {
        e.preventDefault();
        e.stopPropagation(); // Prevent bubbling
        const modalId = this.getAttribute("data-modal");
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.add("active");
          preventBodyScroll();
          trackEvent("open_product_modal", {
            product_id: modalId.replace(/^modal-/, ""),
            open_source: "button",
          });
        }
        return;
      }

      // If clicked on the card itself (but not on the button) - also open modal window
      if (!e.target.closest(".btn-more")) {
        const modalId = this.getAttribute("data-modal");
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.add("active");
          preventBodyScroll();
          trackEvent("open_product_modal", {
            product_id: modalId.replace(/^modal-/, ""),
            open_source: "card",
          });
        }
      }
    });
  });

  // Handle cards WITHOUT modal windows
  pricingCardsNoModal.forEach((card) => {
    card.addEventListener("click", function (e) {
      // If clicked on "Learn More" - scroll to contacts
      if (e.target.closest(".btn-more")) {
        e.preventDefault();
        e.stopPropagation();
        const contactSection = document.getElementById("footer");
        trackEvent("click_product_contact", {
          product_info: this.getAttribute("data-product-info") || "",
        });
        if (contactSection) {
          contactSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
        return;
      }

      // If clicked on the card itself (but not on the button) - also scroll to contacts
      if (!e.target.closest(".btn-more")) {
        const contactSection = document.getElementById("footer");
        if (contactSection) {
          contactSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  // Close modal window with animation
  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".product-modal");
      closeModal(modal);
    });
  });

  // Close when clicking outside modal window with animation
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });

  // Handle clicks on product blocks in modal windows
  clickableProducts.forEach((product) => {
    product.addEventListener("click", function (e) {
      const modal = this.closest(".product-modal");
      trackEvent("click_request_quote", {
        product_id: modal?.id?.replace(/^modal-/, "") || "",
        source: "product_modal",
      });
      if (modal) {
        closeModal(modal);
      }

      setTimeout(() => {
        const contactSection = document.getElementById("footer");
        if (contactSection) {
          contactSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 350);
    });
  });

  modalContactLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const modal = this.closest(".product-modal");
      if (modal) {
        closeModal(modal);
      }

      setTimeout(() => {
        const contactSection = document.getElementById("footer");
        if (contactSection) {
          contactSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 350);
    });
  });

  modalCopyButtons.forEach((button) => {
    button.addEventListener("click", async function (e) {
      e.preventDefault();
      e.stopPropagation();
      const text = this.getAttribute("data-copy-product") || "";
      const originalText = this.textContent;
      trackEvent("copy_product_details", { product_info: text });

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
        }
        this.textContent = t("products.copied");
        this.classList.add("copied");
        setTimeout(() => {
          this.textContent = originalText;
          this.classList.remove("copied");
        }, 1600);
      } catch (error) {
        this.textContent = originalText;
      }
    });
  });

  // Close on Escape with animation
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      modals.forEach((modal) => {
        if (modal.classList.contains("active")) {
          closeModal(modal);
        }
      });
    }

    // Handle arrow keys for modal navigation
    if (e.key === "ArrowLeft") {
      const activeModal = document.querySelector(".product-modal.active");
      if (activeModal) {
        switchModal("prev");
      }
    }
    if (e.key === "ArrowRight") {
      const activeModal = document.querySelector(".product-modal.active");
      if (activeModal) {
        switchModal("next");
      }
    }
  });

  // Modal navigation button handlers
  modalPrevButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();
      switchModal("prev");
    });
  });

  modalNextButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();
      switchModal("next");
    });
  });

  // Touch swipe support for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  const minSwipeDistance = 50; // Minimum distance for swipe to be recognized

  modals.forEach((modal) => {
    const modalContent = modal.querySelector(".modal-content");

    modalContent.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      },
      { passive: false },
    );

    modalContent.addEventListener(
      "touchmove",
      function (e) {
        const touchX = e.changedTouches[0].screenX;
        const touchY = e.changedTouches[0].screenY;
        const diffX = touchX - touchStartX;
        const diffY = touchY - touchStartY;

        // Prevent ALL default touch behaviors inside modal
        // Only allow vertical scroll inside modal-body
        const isTouchingModalBody = e.target.closest(".modal-body");

        if (!isTouchingModalBody) {
          e.preventDefault();
        } else {
          // Inside modal-body, only allow vertical scroll
          if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal movement detected - prevent it
            e.preventDefault();
          }
        }
      },
      { passive: false },
    );

    modalContent.addEventListener(
      "touchend",
      function (e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
      },
      { passive: true },
    );

    function handleSwipe() {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      const absDiffX = Math.abs(diffX);
      const absDiffY = Math.abs(diffY);

      // Only recognize swipe if:
      // 1. Horizontal distance is greater than minimum
      // 2. Horizontal movement is significantly greater than vertical (at least 2x)
      // 3. Horizontal movement is at least 50px
      if (absDiffX > minSwipeDistance && absDiffX > absDiffY * 2) {
        // Swipe left (go to next modal)
        if (diffX < 0) {
          switchModal("next");
        }

        // Swipe right (go to previous modal)
        if (diffX > 0) {
          switchModal("prev");
        }
      }
    }
  });

  // Update counter when modal opens
  modals.forEach((modal) => {
    // Add swipe hint element if it doesn't exist
    if (!modal.querySelector(".swipe-hint")) {
      const swipeHint = document.createElement("div");
      swipeHint.className = "swipe-hint";
      const modalContent = modal.querySelector(".modal-content");
      if (modalContent) {
        modalContent.appendChild(swipeHint);
      }
    }

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          if (modal.classList.contains("active")) {
            updateModalCounter(modal);
          }
        }
      });
    });

    observer.observe(modal, {
      attributes: true,
      attributeFilter: ["class"],
    });
  });
}

// Service Cards Function
function initServiceCards() {
  const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (isMobile) {
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach((card) => {
      card.style.pointerEvents = "auto";

      card.addEventListener("touchstart", function () {
        this.classList.add("mobile-active");
      });

      card.addEventListener("touchend", function () {
        setTimeout(() => {
          this.classList.remove("mobile-active");
        }, 150);
      });
    });
  }
}

let disposeFooterModals = () => {};

// Footer documents own their focus and scroll lifecycle.
function initFooterModals() {
  disposeFooterModals();
  initFooter();
  const controller = new AbortController();
  const events = { signal: controller.signal };
  let active = null;
  let trigger = null;
  function close(restoreFocus = true) {
    if (!active) return;
    active.style.display = "none";
    active = null;
    allowBodyScroll();
    if (restoreFocus && trigger?.isConnected) trigger.focus({ preventScroll: true });
  }
  for (const [linkId, modalId] of [["privacy-policy-link", "privacyModal"], ["terms-of-service-link", "termsModal"]]) {
    const link = document.getElementById(linkId);
    const modal = document.getElementById(modalId);
    if (!link || !modal) continue;
    link.addEventListener("click", event => {
      event.preventDefault();
      if (active) close(false);
      trigger = link;
      active = modal;
      modal.style.display = "flex";
      modal.querySelector('.pf-document-body').scrollTop = 0;
      preventBodyScroll();
      modal.querySelector('.pf-document-close').focus({ preventScroll: true });
    }, events);
    modal.querySelectorAll('[data-pf-document-close]').forEach(button => button.addEventListener("click", () => close(), events));
    modal.addEventListener("click", event => { if (event.target === modal) close(); }, events);
  }
  // Capture before the old service-dialog listener hides every .modal.
  document.addEventListener("keydown", event => {
    if (!active || document.querySelector('#contactModal[open]')) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === "Tab") {
      const controls = [...active.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')].filter(control => control.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (!active.contains(document.activeElement)) { event.preventDefault(); (event.shiftKey ? last : first)?.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  }, { ...events, capture: true });
  disposeFooterModals = () => { close(false); controller.abort(); };
}

// Email Links Function
function initEmailLinks() {
  const emailLinks = document.querySelectorAll(".email-link");

  emailLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const email = "info@pologenki.eu";

      // Copy email
      copyToClipboard(email);
    });
  });
}

function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, 99999);

  try {
    const successful = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (successful) {
      showNotification("Email copied", text);
    } else {
      showNotification("Copy email", text);
    }
  } catch (err) {
    document.body.removeChild(textarea);
    showNotification("Copy email manually", text);
  }
}

function showNotification(title, detail = "") {
  document.querySelectorAll(".site-toast").forEach((toast) => toast.remove());

  const notification = document.createElement("div");
  notification.className = "site-toast";
  notification.innerHTML = `
    <span class="site-toast-mark">вњ“</span>
    <span class="site-toast-copy">
      <strong>${title}</strong>
      ${detail ? `<small>${detail}</small>` : ""}
    </span>
  `;
  document.body.appendChild(notification);

  requestAnimationFrame(() => notification.classList.add("show"));

  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.remove("show");
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 3000);
}

// Initialize service cards
document.addEventListener("DOMContentLoaded", function () {
  initServiceCards();

  // Auto-scroll to top on page load
  window.scrollTo(0, 0);

  // Handle hash navigation - scroll to element if hash exists
  if (window.location.hash) {
    const targetElement = document.querySelector(window.location.hash);
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }
});

// Function to add logo click handlers
function addLogoHandlers() {
  // Get all logo elements
  const logoElements = document.querySelectorAll(".logo, .logo-tab");

  logoElements.forEach((logoElement) => {
    // Remove any existing onclick handlers
    logoElement.onclick = null;

    // Add new click handler
    logoElement.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      sessionStorage.setItem(LOGO_SCROLL_RESET_KEY, "1");
      window.location.reload();
    });
  });
}

// Make function available globally
window.addLogoHandlers = addLogoHandlers;
