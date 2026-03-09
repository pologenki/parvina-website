import "./style.css";
import { Header } from "./components/header.js";
import { Footer } from "./components/footer.js";
import { initHeaderMenu } from "./components/headerScript.js";
import { initSectionScript } from "./components/sectionScript.js";
import {
  initLanguage,
  t,
  loadTranslations,
  getCurrentLanguage,
} from "./utils/i18n.js";
import { initContactForm } from "./utils/emailService.js";
import { Content, loadProducts } from "./components/content.js";
// Import Swiper
import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import FontAwesome
import "@fortawesome/fontawesome-free/css/all.min.css";

// Global slider instance
let portfolioSwiper = null;

// Scroll management for modals
let modalOpenCount = 0;
let savedScrollPosition = 0;

function preventBodyScroll() {
  modalOpenCount++;
  if (modalOpenCount === 1) {
    // Save current scroll position
    savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

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

  // Update page title
  const pageTitle = document.querySelector("title");
  if (pageTitle) {
    pageTitle.textContent = t("about.title") + " - " + t("about.subtitle");
  }
}

// Персональные данные теперь берутся из content-en.js и content-ru.js при рендеринге

// Language selector update function
function updateLanguageSelector() {
  const languageCurrent = document.querySelector(".language-current");
  const languageCode = languageCurrent?.querySelector(".language-code");
  const currentLang = getCurrentLanguage();

  if (languageCode) {
    languageCode.textContent = currentLang.toUpperCase();
  }
}

// Инициализация переключателя языка
function initLanguageSwitcher() {
  const languageCurrent = document.querySelector(".language-current");
  const languageDropdown = document.querySelector(".language-dropdown");
  const languageOptions = document.querySelectorAll(".language-option");

  if (languageCurrent && languageDropdown) {
    // Открытие dropdown при клике (работает на всех устройствах)
    languageCurrent.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Toggle the dropdown
      languageDropdown.classList.toggle("active");
    });

    // Открытие dropdown при наведении мыши (только для десктопа)
    languageCurrent.addEventListener("mouseenter", (e) => {
      if (window.innerWidth > 768) {
        // Только на десктопе
        languageDropdown.classList.add("active");
      }
    });

    // Закрытие dropdown при уходе мыши (только для десктопа)
    languageCurrent.addEventListener("mouseleave", (e) => {
      if (window.innerWidth > 768) {
        // Только на десктопе
        // Задержка перед закрытием, чтобы пользователь мог навести на опцию
        setTimeout(() => {
          if (!languageDropdown.matches(":hover")) {
            languageDropdown.classList.remove("active");
          }
        }, 100);
      }
    });

    // Также закрываем при уходе с dropdown (для десктопа)
    languageDropdown.addEventListener("mouseleave", (e) => {
      if (window.innerWidth > 768) {
        // Только на десктопе
        languageDropdown.classList.remove("active");
      }
    });

    // Выбор языка
    languageOptions.forEach((option) => {
      option.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const lang = option.getAttribute("data-lang");
        await window.changeLanguage(lang);

        // Закрываем dropdown
        languageDropdown.classList.remove("active");

        // Показываем уведомление
        showLanguageNotification(lang);
      });
    });

    // Закрытие dropdown при клике вне (работает на всех устройствах)
    document.addEventListener("click", (e) => {
      if (
        !languageCurrent.contains(e.target) &&
        !languageDropdown.contains(e.target)
      ) {
        languageDropdown.classList.remove("active");
      }
    });

    // Закрытие по Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        languageDropdown.classList.remove("active");
      }
    });
  }
}

// Уведомление о смене языка
function showLanguageNotification(lang) {
  const messages = {
    en: "Language changed to English",
    ru: "Язык изменен на русский",
    cn: "语言已更改为中文",
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

  // Добавляем CSS анимацию
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
window.initFlipSlider = initFlipSlider;
initFlipSlider();
  initSwiper();
  initContactForm();
  initScrollToTop();
  initProductModals();
  initServiceModals();
  initPortfolioGallery();
  initFooterModals();
  initEmailLinks();

  // Initialize language switcher
  initLanguageSwitcher();
  updateLanguageSelector();

  // Add logo handlers after DOM is ready
  console.log("🔄 Calling addLogoHandlers() from renderApp()");
  addLogoHandlers();

  // Set current date
  setCurrentDate();
}

// Application initialization
async function initApp() {
  await initLanguage();
  await loadProducts();
  await renderApp();
}

function initSwiper() {
  // Destroy previous swiper instance if it exists
  if (portfolioSwiper) {
    portfolioSwiper.destroy();
    portfolioSwiper = null;
  }

  const swiperElement = document.querySelector(".portfolio-swiper");

  if (swiperElement) {
    portfolioSwiper = new Swiper(".portfolio-swiper", {
      modules: [Navigation, Pagination, Autoplay],
      loop: true,
      slidesPerView: 1,
      spaceBetween: 30,
      centeredSlides: true,

      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },

      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },

      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },

      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 25,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      },
    });

    console.log("✅ Portfolio Swiper initialized successfully!");
  }
}

window.changeLanguage = async function (lang) {
  await loadTranslations(lang);
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
  initFlipSlider();
  initSwiper();
  initContactForm();
  initScrollToTop();
  initProductModals();
  initServiceModals();
  initPortfolioGallery();
  initFooterModals();
  initEmailLinks();
  initLanguageSwitcher();
  updateLanguageSelector();
  addLogoHandlers();
  setCurrentDate();
};

// Start the application
initApp();

// Services Modal Function
function initServiceModals() {
  const serviceCards = document.querySelectorAll(
    ".service-card[data-service-modal]",
  );
  const serviceModals = document.querySelectorAll(".service-modal");
  const closeServiceButtons = document.querySelectorAll(".close-modal");

  // Open modal window when clicking on service card
  serviceCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      const modalId = this.getAttribute("data-service-modal");
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add("active");
        preventBodyScroll();
      }
    });
  });

  // Close modal window
  closeServiceButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".service-modal");
      modal.classList.remove("active");
      allowBodyScroll();
    });
  });

  // Close when clicking outside modal window
  serviceModals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active");
        allowBodyScroll();
      }
    });
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      serviceModals.forEach((modal) => {
        if (modal.classList.contains("active")) {
          modal.classList.remove("active");
          allowBodyScroll();
        }
      });
    }
  });
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

  // Используем язык сайта для форматирования даты
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
        const contactSection = document.getElementById("contact");
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
        const contactSection = document.getElementById("contact");
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
      if (modal) {
        closeModal(modal);
      }

      setTimeout(() => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 350);
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
        const isTouchingModalBody = e.target.closest('.modal-body');

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
    if (!modal.querySelector('.swipe-hint')) {
      const swipeHint = document.createElement('div');
      swipeHint.className = 'swipe-hint';
      const modalContent = modal.querySelector('.modal-content');
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

// Gallery Modal Function
function initPortfolioGallery() {
  const galleryModal = document.getElementById("galleryModal");
  const galleryImage = document.getElementById("galleryImage");
  const imageTitle = document.getElementById("imageTitle");
  const imageDescription = document.getElementById("imageDescription");
  const currentImageSpan = document.getElementById("currentImage");
  const totalImagesSpan = document.getElementById("totalImages");
  const closeGalleryBtn = document.querySelector(".close-gallery-modal");
  const prevBtn = document.querySelector(".gallery-prev");
  const nextBtn = document.querySelector(".gallery-next");

  const cardImages = document.querySelectorAll(".card-image");
  let currentImageIndex = 0;
  let images = [];

  // Collect all images from cards
  cardImages.forEach((card, index) => {
    const imgSrc = card.getAttribute("data-image-src");
    const imgAlt = card.getAttribute("data-image-alt");
    const cardContent = card
      .closest(".portfolio-card")
      .querySelector(".portfolio-content");
    const title = cardContent.querySelector("h3").textContent;
    const description = cardContent.querySelector("p").textContent;

    images.push({
      src: imgSrc,
      alt: imgAlt,
      title: title,
      description: description,
      index: index,
    });
  });

  // Update counter
  if (totalImagesSpan) {
    totalImagesSpan.textContent = images.length;
  }

  // Open gallery when clicking on image
  cardImages.forEach((card, index) => {
    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("project-badge")) {
        openGallery(index);
      }
    });
  });

  function openGallery(index) {
    currentImageIndex = index;
    updateGallery();
    galleryModal.classList.add("active");
    preventBodyScroll();
  }

  function closeGallery() {
    galleryModal.classList.remove("active");
    allowBodyScroll();
  }

  function updateGallery() {
    const currentImage = images[currentImageIndex];

    if (galleryImage) galleryImage.src = currentImage.src;
    if (galleryImage) galleryImage.alt = currentImage.alt;
    if (imageTitle) imageTitle.textContent = currentImage.title;
    if (imageDescription)
      imageDescription.textContent = currentImage.description;
    if (currentImageSpan) currentImageSpan.textContent = currentImageIndex + 1;
  }

  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateGallery();
  }

  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateGallery();
  }

  // Events
  if (closeGalleryBtn) {
    closeGalleryBtn.addEventListener("click", closeGallery);
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", prevImage);
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", nextImage);
  }

  // Close by clicking outside image
  if (galleryModal) {
    galleryModal.addEventListener("click", (e) => {
      if (e.target === galleryModal) {
        closeGallery();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!galleryModal || !galleryModal.classList.contains("active")) return;

    switch (e.key) {
      case "Escape":
        closeGallery();
        break;
      case "ArrowLeft":
        prevImage();
        break;
      case "ArrowRight":
        nextImage();
        break;
    }
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

// Footer Modals Function
function initFooterModals() {
  const privacyLink = document.getElementById("privacy-policy-link");
  const termsLink = document.getElementById("terms-of-service-link");
  const privacyModal = document.getElementById("privacyModal");
  const termsModal = document.getElementById("termsModal");

  if (privacyLink && privacyModal) {
    privacyLink.addEventListener("click", function (e) {
      e.preventDefault();
      privacyModal.style.display = "block";
      preventBodyScroll();
    });
  }

  if (termsLink && termsModal) {
    termsLink.addEventListener("click", function (e) {
      e.preventDefault();
      termsModal.style.display = "block";
      preventBodyScroll();
    });
  }

  const closeButtons = document.querySelectorAll(".modal .close-modal");
  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal");
      if (modal) {
        modal.style.display = "none";
        allowBodyScroll();
      }
    });
  });

  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.style.display = "none";
        allowBodyScroll();
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      modals.forEach((modal) => {
        if (modal.style.display === "block") {
          modal.style.display = "none";
          allowBodyScroll();
        }
      });
    }
  });
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
      showNotification(
        "✓ Email copied: " + text + "\nPlease paste it in your email client",
      );
    } else {
      showNotification("📧 Please copy: " + text);
    }
  } catch (err) {
    document.body.removeChild(textarea);
    showNotification("📧 Email: " + text + "\nPlease copy it manually");
  }
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.9);
    color: white;
    padding: 20px 25px;
    border-radius: 10px;
    z-index: 10000;
    font-size: 16px;
    text-align: center;
    line-height: 1.5;
    white-space: pre-line;
    max-width: 300px;
    border: 2px solid #4CAF50;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.opacity = "0";
      notification.style.transition = "opacity 0.3s";
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
  console.log("🔄 addLogoHandlers() called");

  // Get all logo elements
  const logoElements = document.querySelectorAll(".logo, .logo-tab");

  console.log("🔄 Adding logo handlers. Found elements:", logoElements.length);

  // Check if about section exists
  const aboutSection = document.querySelector("#about");
  console.log("🔍 About section found:", !!aboutSection);
  if (aboutSection) {
    console.log("📍 About section ID:", aboutSection.id);
    console.log("📍 About section class:", aboutSection.className);
  }

  logoElements.forEach((logoElement, index) => {
    // Remove any existing onclick handlers
    logoElement.onclick = null;

    console.log(
      `🎯 Adding handler to logo element ${index}:`,
      logoElement.className,
    );

    // Add new click handler
    logoElement.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      console.log("🔄 Logo clicked! Scrolling to about-section...");
      console.log("🔍 Clicked element:", this.className);

      // Find the about-section block
      const aboutSection = document.querySelector("#about");
      if (aboutSection) {
        console.log("✅ About section found, scrolling...");
        aboutSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        console.log("❌ About section not found, scrolling to top");
        // Final fallback to top of page
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
  });

  console.log("✅ Logo handlers added successfully!");
}

// Make function available globally
window.addLogoHandlers = addLogoHandlers;


// ── FLIP PORTFOLIO SLIDER ──
function initFlipSlider() {
  const slides = [
    { num: "01", title: "Gulfood Dubai 2023", title_ru: "Gulfood Дубай 2023", desc: "Meeting with a regular supplier of dates from Tunisia.", desc_ru: "Встреча с постоянным поставщиком фиников из Туниса.", img: "/img/img019.jpg" },
    { num: "02", title: "Gulfood Dubai 2023", title_ru: "Gulfood Дубай 2023", desc: "Discovering reliable suppliers of nuts and dried fruits worldwide.", desc_ru: "Поиск надёжных поставщиков орехов и сухофруктов по всему миру.", img: "/img/img002.jpg" },
    { num: "03", title: "Cashew Processing, Vietnam", title_ru: "Обработка кешью, Вьетнам", desc: "Cashew processing and packaging insight.", desc_ru: "Знакомство с производством и упаковкой кешью.", img: "/img/img003.jpg" },
    { num: "04", title: "Gulfood Dubai 2025", title_ru: "Gulfood Дубай 2025", desc: "Indian stand. Discovering new suppliers.", desc_ru: "Индийский стенд. Знакомство с новыми поставщиками.", img: "/img/img017.jpg" },
    { num: "05", title: "Meeting Russian Ambassador", title_ru: "Встреча с послом России", desc: "Strengthening trade relations.", desc_ru: "Укрепление торговых отношений.", img: "/img/img005.jpg" },
    { num: "06", title: "Gulfood Dubai 2022", title_ru: "Gulfood Дубай 2022", desc: "Connecting with international nut suppliers.", desc_ru: "Установление связей с международными поставщиками орехов.", img: "/img/img007.jpg" },
    { num: "07", title: "Gulfood Dubai 2025", title_ru: "Gulfood Дубай 2025", desc: "Scouting trusted nut suppliers for global markets.", desc_ru: "Поиск надёжных поставщиков орехов для мировых рынков.", img: "/img/img008.jpg" },
    { num: "08", title: "Anuga Cologne 2025", title_ru: "Anuga Кёльн 2025", desc: "Securing supply chain connections.", desc_ru: "Налаживание связей в цепочке поставок.", img: "/img/img013.jpg" },
    { num: "09", title: "Anuga Cologne 2025", title_ru: "Anuga Кёльн 2025", desc: "Exploring international markets for nuts and dried fruits.", desc_ru: "Изучение международных рынков орехов и сухофруктов.", img: "/img/img014.jpg" },
    { num: "10", title: "Meeting cashew supplier and investors", title_ru: "Встреча с поставщиком кешью и инвесторами", desc: "Securing supply chain connections.", desc_ru: "Обеспечение связей в цепочке поставок.", img: "/img/img012.jpg" },
    { num: "11", title: "Gulfood Dubai 2025", title_ru: "Gulfood Дубай 2025", desc: "Life is buzzing here — ideas are born and deals are made!", desc_ru: "Здесь кипит жизнь — рождаются идеи и заключаются сделки!", img: "/img/img016.jpg" },
  ];

  let current = 0;
  const perPage = 3;
  const total = Math.ceil(slides.length / perPage);

  function getLang() { return localStorage.getItem('preferredLanguage') || 'en'; }

  function renderSlider() {
    const track = document.getElementById('portfolioTrack');
    if (!track) return;
    const lang = getLang();
    const start = current * perPage;
    const visible = slides.slice(start, start + perPage);

    track.innerHTML = visible.map((s, i) => {
      const gi = start + i;
      const title = lang === 'ru' ? s.title_ru : s.title;
      const desc = lang === 'ru' ? s.desc_ru : s.desc;
      return `
        <div class="flip-card" onclick="event.currentTarget.classList.toggle('flipped')">
          <div class="flip-inner">
            <div class="flip-front">
              <img src="${s.img}" alt="${title}">
              <div class="front-overlay">
                <div class="front-num">${s.num}</div>
                <div class="front-title">${title}</div>
                <div class="front-hint">click to read →</div>
              </div>
            </div>
            <div class="flip-back">
              <div class="back-decoration"></div>
              <div class="back-num">${s.num}</div>
              <div class="back-title">${title}</div>
              <div class="back-desc">${desc}</div>
              <div class="back-actions">
                <button class="btn-zoom" onclick="event.stopPropagation();openPortfolioZoom(${gi})">⊕ View Photo</button>
                <button class="btn-flip-back" onclick="event.stopPropagation();this.closest('.flip-card').classList.remove('flipped')">← Back</button>
              </div>
            </div>
          </div>
        </div>`;
    }).join('');

    renderDots();
  }

  function renderDots() {
    const dots = document.getElementById('portfolioDots');
    if (!dots) return;
    dots.innerHTML = Array.from({length: total}, (_, i) =>
      `<div class="flip-nav-dot ${i===current?'active':''}" onclick="portfolioGoTo(${i})"></div>`
    ).join('');
  }

  window.portfolioGoTo = function(i) { current = i; renderSlider(); };

  const prevBtn = document.getElementById('portfolioPrev');
  const nextBtn = document.getElementById('portfolioNext');
  if (prevBtn) prevBtn.onclick = () => { current=(current-1+total)%total; renderSlider(); };
  if (nextBtn) nextBtn.onclick = () => { current=(current+1)%total; renderSlider(); };

  // Zoom
  window.openPortfolioZoom = function(idx) {
    const s = slides[idx];
    const lang = getLang();
    document.getElementById('zoomImg').src = s.img;
    document.getElementById('zoomTitle').textContent = lang === 'ru' ? s.title_ru : s.title;
    document.getElementById('zoomDesc').textContent = lang === 'ru' ? s.desc_ru : s.desc;
    document.getElementById('zoomOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  document.getElementById('zoomBackdrop')?.addEventListener('click', closePortfolioZoom);
  document.getElementById('zoomClose')?.addEventListener('click', closePortfolioZoom);
  document.addEventListener('keydown', e => { if(e.key==='Escape') closePortfolioZoom(); });

  function closePortfolioZoom() {
    document.getElementById('zoomOverlay')?.classList.remove('active');
    document.body.style.overflow = '';
  }

    // Autoplay
  let autoPlay = setInterval(() => { current=(current+1)%total; renderSlider(); }, 4000);
  const wrap = document.querySelector('.flip-slider-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => clearInterval(autoPlay));
    wrap.addEventListener('mouseleave', () => { autoPlay = setInterval(() => { current=(current+1)%total; renderSlider(); }, 4000); });
  }

  renderSlider();
}