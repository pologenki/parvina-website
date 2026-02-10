import "./style.css";
import { Header } from "./components/header.js";
import { Content } from "./components/content.js";
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
    // Открытие dropdown при наведении мышки
    languageCurrent.addEventListener("mouseenter", (e) => {
      e.stopPropagation();
      languageDropdown.classList.add("active");
    });

    // Переключение видимости dropdown при клике
    languageCurrent.addEventListener("click", (e) => {
      e.stopPropagation();
      languageDropdown.classList.toggle("active");
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

    // Закрытие dropdown при уходе мышки с элементов
    languageCurrent.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!languageDropdown.matches(":hover")) {
          languageDropdown.classList.remove("active");
        }
      }, 100);
    });

    languageDropdown.addEventListener("mouseleave", () => {
      languageDropdown.classList.remove("active");
    });

    // Закрытие dropdown при клике вне
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

// Global function for language change
window.changeLanguage = async function (lang) {
  await loadTranslations(lang);
  // Перерисовываем весь контент для обновления персональных данных
  await renderApp();
  updateLanguageSelector();
};

// Start the application
initApp();

// Services Modal Function
function initServiceModals() {
  const serviceCards = document.querySelectorAll(
    ".service-card[data-service-modal]",
  );
  const serviceModals = document.querySelectorAll(".service-modal");
  const closeServiceButtons = document.querySelectorAll(".close-service-modal");

  // Open modal window when clicking on service card
  serviceCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      const modalId = this.getAttribute("data-service-modal");
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Close modal window
  closeServiceButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".service-modal");
      modal.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Close when clicking outside modal window
  serviceModals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      serviceModals.forEach((modal) => {
        if (modal.classList.contains("active")) {
          modal.classList.remove("active");
          document.body.style.overflow = "";
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
    document.body.style.overflow = "";

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
        document.body.style.overflow = "hidden";
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
          document.body.style.overflow = "hidden";
        }
        return;
      }

      // If clicked on the card itself (but not on the button) - also open modal window
      if (!e.target.closest(".btn-more")) {
        const modalId = this.getAttribute("data-modal");
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.add("active");
          document.body.style.overflow = "hidden";
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

  // Update counter when modal opens
  modals.forEach((modal) => {
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
    document.body.style.overflow = "hidden";
  }

  function closeGallery() {
    galleryModal.classList.remove("active");
    document.body.style.overflow = "";
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
      document.body.style.overflow = "hidden";
    });
  }

  if (termsLink && termsModal) {
    termsLink.addEventListener("click", function (e) {
      e.preventDefault();
      termsModal.style.display = "block";
      document.body.style.overflow = "hidden";
    });
  }

  const closeButtons = document.querySelectorAll(".modal .close-modal");
  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal");
      if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "";
      }
    });
  });

  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.style.display = "none";
        document.body.style.overflow = "";
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      modals.forEach((modal) => {
        if (modal.style.display === "block") {
          modal.style.display = "none";
          document.body.style.overflow = "";
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
