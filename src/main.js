import './style.css'
import { Header } from './components/header.js'
import { Content } from './components/content.js'
import { Footer } from './components/footer.js'
import { initHeaderMenu } from './components/headerScript.js';
import { initSectionScript } from './components/sectionScript.js';
import { initLanguage, t, loadTranslations } from './utils/i18n.js';
import { initContactForm } from './utils/emailService.js';

// Импорт Swiper
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Импорт FontAwesome
import '@fortawesome/fontawesome-free/css/all.min.css';

// Функция для обновления текстов на странице
function updatePageTexts() {
  // Обновляем все элементы с data-i18n атрибутом
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key);
  });
  
  // Обновляем плейсхолдеры
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = t(key);
  });
}

// Функция для рендеринга всего приложения
function renderApp() {
  document.querySelector('#app').innerHTML = `
    ${Header()}
    ${Content()}
    ${Footer()}
  `;

  // Обновляем тексты после рендера
  updatePageTexts();
  
  // Инициализируем все компоненты
  initHeaderMenu();
  initSectionScript();
  initSwiper();
  initContactForm();
  initScrollToTop();
  initProductModals();
  initServiceModals();
  initPortfolioGallery(); // ← ДОБАВЬ ЭТУ СТРОКУ
  // Обновляем активный язык в выпадающем списке
  updateLanguageSelector();
}

// Функция обновления селектора языка
function updateLanguageSelector() {
  const languageSelected = document.getElementById('languageSelected');
  const currentLang = localStorage.getItem('preferredLanguage') || 'en';
  
  if (languageSelected) {
    languageSelected.textContent = currentLang.toUpperCase();
  }
}

// Инициализация приложения
async function initApp() {
  await initLanguage();
  renderApp();
}

function initSwiper() {
  const swiperElement = document.querySelector('.portfolio-swiper');
  
  if (swiperElement) {
    const swiper = new Swiper('.portfolio-swiper', {
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
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
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
        }
      }
    });
    
    console.log('✅ Portfolio Swiper инициализирован успешно!');
  }
}

// Глобальная функция для смены языка
window.changeLanguage = async function(lang) {
  await loadTranslations(lang);
  updatePageTexts();
  updateLanguageSelector();
};

// Запускаем приложение
initApp();

// services.js или component.js
function initServiceModals() {
    const serviceCards = document.querySelectorAll('.service-card[data-service-modal]');
    const serviceModals = document.querySelectorAll('.service-modal');
    const closeServiceButtons = document.querySelectorAll('.close-service-modal');

    // Открытие модального окна при клике на карточку услуги
    serviceCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const modalId = this.getAttribute('data-service-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Закрытие модального окна
    closeServiceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.service-modal');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Закрытие при клике вне модального окна
    serviceModals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Закрытие на Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            serviceModals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });
}

// И вызовите в основном файле
document.addEventListener('DOMContentLoaded', function() {
  initServiceCards();
});

    // Script for automatic current date
    document.addEventListener('DOMContentLoaded', function() {
        const now = new Date();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const dateString = now.toLocaleDateString('en-GB', options); // Changed to English format
        document.getElementById('current-date').textContent = dateString;
    });

    /**ScrolToTop */

function initScrollToTop() {
  const scrollToTop = document.getElementById('scrollToTop');
  const pricingSection = document.querySelector('.pricing-section');
  
  if (!scrollToTop) return;
  
  let pricingSectionTop = 0;
  let hideTimeout = null;

  setTimeout(() => {
    if (pricingSection) {
      pricingSectionTop = pricingSection.offsetTop;
    }
  }, 100);
  
  function showScrollButton() {
    scrollToTop.classList.add('show');
    
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    
    // Определяем время скрытия в зависимости от устройства
    const hideDelay = window.innerWidth >= 768 ? 3000 : 500; // 3 секунды для десктопа, 0.5 для мобильных
    
    hideTimeout = setTimeout(() => {
      scrollToTop.classList.remove('show');
    }, hideDelay);
  }
  
  function checkScroll() {
    if (window.pageYOffset > pricingSectionTop - 100) {
      showScrollButton();
    } else {
      scrollToTop.classList.remove('show');
    }
  }
  
  window.addEventListener('scroll', checkScroll);
  scrollToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  setTimeout(checkScroll, 200);
}

/** */

function initProductModals() {
    const pricingCards = document.querySelectorAll('.pricing-card[data-modal]');
    const pricingCardsNoModal = document.querySelectorAll('.pricing-card:not([data-modal])');
    const modals = document.querySelectorAll('.product-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const clickableProducts = document.querySelectorAll('.clickable-product');

    // Функция закрытия модального окна с анимацией
    function closeModal(modal) {
        modal.classList.add('closing');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            modal.classList.remove('active', 'closing');
        }, 300);
    }

    // Обработка карточек С модальными окнами (первые 8 блоков)
    pricingCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Если кликнули на "Learn More" - открываем модальное окно
            if (e.target.closest('.btn-more')) {
                e.preventDefault();
                e.stopPropagation(); // Предотвращаем всплытие
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
                return;
            }
            
            // Если кликнули на саму карточку (но не на кнопку) - тоже открываем модальное окно
            if (!e.target.closest('.btn-more')) {
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    });

    // Обработка карточек БЕЗ модальных окон (последние 2 блока)
    pricingCardsNoModal.forEach(card => {
        card.addEventListener('click', function(e) {
            // Если кликнули на "Learn More" - прокрутка к контактам
            if (e.target.closest('.btn-more')) {
                e.preventDefault();
                e.stopPropagation(); // Предотвращаем всплытие
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                return;
            }
            
            // Если кликнули на саму карточку (но не на кнопку) - тоже прокрутка к контактам
            if (!e.target.closest('.btn-more')) {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Закрытие модального окна с анимацией
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.product-modal');
            closeModal(modal);
        });
    });

    // Закрытие при клике вне модального окна с анимацией
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    // Обработка кликов по блокам продуктов в модальных окнах
    clickableProducts.forEach(product => {
        product.addEventListener('click', function(e) {
            const modal = this.closest('.product-modal');
            if (modal) {
                closeModal(modal);
            }
            
            setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 350);
        });
    });

    // Закрытие на Escape с анимацией
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });
}

/** Gallery Modal Function */
function initPortfolioGallery() {
  const galleryModal = document.getElementById('galleryModal');
  const galleryImage = document.getElementById('galleryImage');
  const imageTitle = document.getElementById('imageTitle');
  const imageDescription = document.getElementById('imageDescription');
  const currentImageSpan = document.getElementById('currentImage');
  const totalImagesSpan = document.getElementById('totalImages');
  const closeGalleryBtn = document.querySelector('.close-gallery-modal');
  const prevBtn = document.querySelector('.gallery-prev');
  const nextBtn = document.querySelector('.gallery-next');
  
  const cardImages = document.querySelectorAll('.card-image');
  let currentImageIndex = 0;
  let images = [];

  // Собираем все изображения из карточек
  cardImages.forEach((card, index) => {
    const imgSrc = card.getAttribute('data-image-src');
    const imgAlt = card.getAttribute('data-image-alt');
    const cardContent = card.closest('.portfolio-card').querySelector('.portfolio-content');
    const title = cardContent.querySelector('h3').textContent;
    const description = cardContent.querySelector('p').textContent;
    
    images.push({
      src: imgSrc,
      alt: imgAlt,
      title: title,
      description: description,
      index: index
    });
  });

  // Обновляем счетчик
  totalImagesSpan.textContent = images.length;

  // Открытие галереи при клике на изображение
  cardImages.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('project-badge')) {
        openGallery(index);
      }
    });
  });

  function openGallery(index) {
    currentImageIndex = index;
    updateGallery();
    galleryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeGallery() {
    galleryModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateGallery() {
    const currentImage = images[currentImageIndex];
    
    galleryImage.src = currentImage.src;
    galleryImage.alt = currentImage.alt;
    imageTitle.textContent = currentImage.title;
    imageDescription.textContent = currentImage.description;
    currentImageSpan.textContent = currentImageIndex + 1;
    
    // Обновляем состояние кнопок навигации
    prevBtn.disabled = currentImageIndex === 0;
    nextBtn.disabled = currentImageIndex === images.length - 1;
  }

  function nextImage() {
    if (currentImageIndex < images.length - 1) {
      currentImageIndex++;
      updateGallery();
    }
  }

  function prevImage() {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      updateGallery();
    }
  }

  // События
  closeGalleryBtn.addEventListener('click', closeGallery);
  prevBtn.addEventListener('click', prevImage);
  nextBtn.addEventListener('click', nextImage);

  // Закрытие по клику вне изображения
  galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
      closeGallery();
    }
  });

  // Навигация клавишами
  document.addEventListener('keydown', (e) => {
    if (!galleryModal.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape':
        closeGallery();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
    }
  });
}

// Service Cards Function
function initServiceCards() {
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (isMobile) {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
      card.style.pointerEvents = 'auto';
      
      card.addEventListener('touchstart', function() {
        this.classList.add('mobile-active');
      });
      
      card.addEventListener('touchend', function() {
        setTimeout(() => {
          this.classList.remove('mobile-active');
        }, 150);
      });
    });
  }
}

/**Footer-Privacy Policy */
document.addEventListener('DOMContentLoaded', function() {
        // Privacy Policy Modal
        const privacyModal = document.getElementById('privacyModal');
        const termsModal = document.getElementById('termsModal');
        const closeButtons = document.querySelectorAll('.close-modal');
        
        // Privacy Policy
        document.querySelector('a[href="#privacy-policy"]').addEventListener('click', function(e) {
          e.preventDefault();
          privacyModal.style.display = 'block';
          document.body.style.overflow = 'hidden';
        });
        
        // Terms of Service
        document.querySelector('a[href="#terms-of-service"]').addEventListener('click', function(e) {
          e.preventDefault();
          termsModal.style.display = 'block';
          document.body.style.overflow = 'hidden';
        });
        
        // Close modals
        closeButtons.forEach(button => {
          button.addEventListener('click', function() {
            privacyModal.style.display = 'none';
            termsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
          });
        });
        
        // Close on background click
        window.addEventListener('click', function(e) {
          if (e.target === privacyModal) {
            privacyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
          }
          if (e.target === termsModal) {
            termsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
          }
        });
      });

      /** */

      