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
// Swiper removed - using custom flip slider for portfolio

// Import FontAwesome
import "@fortawesome/fontawesome-free/css/all.min.css";

// Global slider instance

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
  initPortfolioFlipSlider();
  initContactForm();
  initScrollToTop();
  initProductModals();
  initServiceModals();
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

async function initPortfolioFlipSlider() {
  const DEFAULT_SLIDES = [
    {
      num: "01",
      title: "Gulfood Dubai 2023",
      title_ru: "Gulfood Дубай 2023",
      desc: "Meeting with a regular supplier of dates from Tunisia. Exploring new opportunities for long-term partnerships.",
      desc_ru: "Встреча с постоянным поставщиком фиников из Туниса. Изучение новых возможностей для долгосрочного сотрудничества.",
      img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=85",
    },
    {
      num: "02",
      title: "Cashew Processing, Vietnam",
      title_ru: "Обработка кешью, Вьетнам",
      desc: "Insight into cashew processing and packaging. Ensuring quality standards are met at the source.",
      desc_ru: "Знакомство с производством и упаковкой кешью. Контроль соответствия стандартам качества.",
      img: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=900&q=85",
    },
    {
      num: "03",
      title: "Gulfood Dubai 2025",
      title_ru: "Gulfood Дубай 2025",
      desc: "Discovering reliable suppliers worldwide. Life is buzzing — ideas are born and deals are made.",
      desc_ru: "Поиск надёжных поставщиков по всему миру. Здесь кипит жизнь — рождаются идеи и заключаются сделки.",
      img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=900&q=85",
    },
    {
      num: "04",
      title: "Anuga Cologne 2025",
      title_ru: "Anuga Кёльн 2025",
      desc: "Exploring international markets for nuts and dried fruits. Securing supply chain connections.",
      desc_ru: "Изучение международных рынков орехов и сухофруктов. Налаживание связей в цепочке поставок.",
      img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=900&q=85",
    },
    {
      num: "05",
      title: "Meeting Russian Ambassador",
      title_ru: "Встреча с послом России",
      desc: "Strengthening trade relations between countries. Building bridges for international commerce.",
      desc_ru: "Укрепление торговых отношений между странами. Создание мостов для международной торговли.",
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=85",
    },
  ];

  // Загружаем слайды из portfolio.json, fallback на DEFAULT_SLIDES
  async function loadSlides() {
    try {
      const r = await fetch('/data/portfolio.json?v=' + Date.now());
      if (r.ok) {
        const json = await r.json();
        if (json.items && json.items.length > 0) {
          // нумеруем автоматически
          return json.items.map((item, i) => ({
            ...item,
            num: String(i + 1).padStart(2, '0')
          }));
        }
      }
    } catch(e) {}
    return DEFAULT_SLIDES;
  }

  const slides = await loadSlides();

  // Infinite carousel: always shows 3 cards, moves 1 at a time
  // current = index of the LEFT-most visible card
  const total = slides.length; // 5
  const visible = 3; // always show 3
  let current = 0;
  let isAnimating = false;

  const track = document.getElementById("portfolioTrack");
  const dotsEl = document.getElementById("portfolioDots");
  const prevBtn = document.getElementById("portfolioPrev");
  const nextBtn = document.getElementById("portfolioNext");
  const zoomOverlay = document.getElementById("zoomOverlay");
  const zoomImg = document.getElementById("zoomImg");
  const zoomTitle = document.getElementById("zoomTitle");
  const zoomDesc = document.getElementById("zoomDesc");
  const zoomClose = document.getElementById("zoomClose");
  const zoomBackdrop = document.getElementById("zoomBackdrop");

  if (!track) return;

  function getLang() {
    return (
      document.documentElement.lang ||
      localStorage.getItem("selectedLanguage") ||
      "en"
    );
  }

  function openZoom(idx, e) {
    if (e) e.stopPropagation();
    const s = slides[idx % total];
    const lang = getLang();
    zoomImg.src = s.img;
    zoomTitle.textContent = lang === "ru" ? s.title_ru : s.title;
    zoomDesc.textContent = lang === "ru" ? s.desc_ru : s.desc;
    zoomOverlay.classList.add("active");
    preventBodyScroll();
  }

  function closeZoom() {
    zoomOverlay.classList.remove("active");
    allowBodyScroll();
  }

  function buildCard(idx) {
    const s = slides[idx];
    const lang = getLang();
    const title = lang === "ru" ? s.title_ru : s.title;
    const desc = lang === "ru" ? s.desc_ru : s.desc;
    return `
    <div class="flip-card">
      <div class="flip-inner">
        <div class="flip-front">
          <img src="${s.img}" alt="${title}" loading="lazy">
          <div class="front-overlay">
            <div class="front-num">${s.num}</div>
            <div class="front-title">${title}</div>
            <div class="front-hint">hover to read →</div>
          </div>
        </div>
        <div class="flip-back">
          <div class="back-decoration"></div>
          <div class="back-num">${s.num}</div>
          <div class="back-title">${title}</div>
          <div class="back-desc">${desc}</div>
          <div class="back-actions">
            <button class="btn-zoom" onclick="portfolioOpenZoom(${idx}, event)">⊕ View Photo</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  const FADE_OUT = 200;
  const FADE_IN  = 1000;

  // ── сколько карточек показывать зависит от ширины экрана
  function visibleCount() {
    return window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
  }

  function showCards() {
    const n = slides.length;
    const cnt = visibleCount();
    const indices = [];
    for (let i = 0; i < cnt; i++) indices.push(((current + i) % n + n) % n);

    track.innerHTML = indices.map(i => buildCard(i)).join('');
    renderDots();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track.querySelectorAll('.flip-card').forEach(c => c.classList.add('pfs-visible'));
      });
    });
  }

  function goTo(newCurrent) {
    if (isAnimating) return;
    isAnimating = true;
    current = ((newCurrent % slides.length) + slides.length) % slides.length;

    // плавно гасим старые карточки
    const old = track.querySelectorAll('.flip-card');
    old.forEach(c => {
      c.style.transition = `opacity ${FADE_OUT}ms ease`;
      c.style.opacity = '0';
    });

    setTimeout(() => {
      showCards();
      setTimeout(() => { isAnimating = false; }, 500);
    }, FADE_OUT + 30);
  }

  // ── Autoplay
  let autoplayTimer = null;

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
  }

  function renderDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = slides
      .map((_, i) => `<div class="flip-nav-dot ${i === current ? "active" : ""}" onclick="portfolioGoTo(${i})"></div>`)
      .join("");
  }

  // ── Tap/click handler for mobile flip & swipe-next
  track.addEventListener('click', (e) => {
    // btn-zoom has its own onclick — don't interfere
    if (e.target.closest('.btn-zoom')) return;

    const card = e.target.closest('.flip-card');
    if (!card) return;

    if (window.innerWidth <= 600) {
      if (card.classList.contains('flipped')) {
        card.classList.remove('flipped');
        setTimeout(() => {
          stopAutoplay();
          goTo(current + 1);
          startAutoplay();
        }, 400);
      } else {
        track.querySelectorAll('.flip-card').forEach(c => c.classList.remove('flipped'));
        card.classList.add('flipped');
      }
    }
  });

  // ── Swipe (touch)
  let touchStartX = 0;
  let touchStartY = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    // только горизонтальный свайп (> 40px и не вертикальный scroll)
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      stopAutoplay();
      goTo(dx < 0 ? current + 1 : current - 1);
      startAutoplay();
    }
  }, { passive: true });

  // ── Globals
  window.portfolioOpenZoom = openZoom;
  window.portfolioGoTo = function (i) {
    stopAutoplay(); goTo(i); startAutoplay();
  };
  window._pfsPrev = () => { stopAutoplay(); goTo(current - 1); startAutoplay(); };
  window._pfsNext = () => { stopAutoplay(); goTo(current + 1); startAutoplay(); };

  if (prevBtn) prevBtn.onclick = () => { stopAutoplay(); goTo(current - 1); startAutoplay(); };
  if (nextBtn) nextBtn.onclick = () => { stopAutoplay(); goTo(current + 1); startAutoplay(); };
  if (zoomClose) zoomClose.onclick = closeZoom;
  if (zoomBackdrop) zoomBackdrop.onclick = closeZoom;

  track.addEventListener("mouseenter", stopAutoplay);
  track.addEventListener("mouseleave", startAutoplay);

  // resize — перерендер без анимации
  window.addEventListener('resize', () => { showCards(); });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeZoom();
  });

  showCards();
  startAutoplay();
  console.log("✅ Portfolio flip slider initialized!");
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
  initPortfolioFlipSlider();
  initContactForm();
  initScrollToTop();
  initProductModals();
  initServiceModals();
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