// main.js
import './style.css'
import { Header } from './components/header.js'
import { Content } from './components/content.js'
import { Footer } from './components/footer.js'
import { initHeaderMenu } from './components/headerScript.js';
import { initSectionScript } from './components/sectionScript.js';
import { initLanguage, t, loadTranslations } from './utils/i18n.js';
import { initContactForm } from './utils/emailService.js';
import { loadCMSData, renderProducts, updateProductPrices } from './utils/cms-loader.js';

// Import Swiper
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import FontAwesome
import '@fortawesome/fontawesome-free/css/all.min.css';

// Function to update texts on the page
function updatePageTexts() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key);
  });
  
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = t(key);
  });
}

// Function to initialize products
async function initializeProducts() {
  console.log('🔄 Initializing products...');
  try {
    const productsData = await loadCMSData();
    if (productsData) {
      renderProducts(productsData);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  // Инициализируем модалки сразу
  initProductModals();
}

// Function to render the entire application
async function renderApp() {
  console.log('🔄 Rendering app...');
  
  document.querySelector('#app').innerHTML = `
    ${Header()}
    ${Content()}
    ${Footer()}
  `;

  // Update texts after render
  updatePageTexts();
  
  // Initialize products
  await initializeProducts();
  
  // Initialize all components
  initHeaderMenu();
  initSectionScript();
  initSwiper();
  initContactForm();
  initScrollToTop();
  initServiceModals();
  initPortfolioGallery();
  initFooterModals();
  
  // Update active language in dropdown
  updateLanguageSelector();
  initEmailLinks();
  
  console.log('✅ App rendered successfully!');
}

// Language selector update function
function updateLanguageSelector() {
  const languageSelected = document.getElementById('languageSelected');
  const currentLang = localStorage.getItem('preferredLanguage') || 'en';
  
  if (languageSelected) {
    languageSelected.textContent = currentLang.toUpperCase();
  }
}

// Application initialization
async function initApp() {
  console.log('🚀 Starting application...');
  await initLanguage();
  await renderApp();
}

function initSwiper() {
  const swiperElement = document.querySelector('.portfolio-swiper');
  
  if (swiperElement) {
    // Ждем немного чтобы DOM полностью загрузился
    setTimeout(() => {
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
        
        // Важные настройки для мобильных
        touchEventsTarget: 'container',
        simulateTouch: true,
        touchRatio: 1,
        touchAngle: 45,
        grabCursor: true,
        allowTouchMove: true,
        
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
      
      console.log('✅ Portfolio Swiper initialized successfully!');
    }, 100);
  } else {
    console.log('❌ Portfolio Swiper element not found');
  }
}

// Global function for language change
window.changeLanguage = async function(lang) {
  await loadTranslations(lang);
  updatePageTexts();
  updateLanguageSelector();
};

// Function for refreshing prices
window.refreshPrices = async function() {
  const productsData = await loadCMSData();
  if (productsData) {
    updateProductPrices(productsData);
    
    // Show notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 10000;
      font-size: 14px;
    `;
    notification.textContent = 'Prices updated successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  }
};

// Footer Modals Function
function initFooterModals() {
  const privacyLink = document.getElementById('privacy-policy-link');
  const termsLink = document.getElementById('terms-of-service-link');
  const privacyModal = document.getElementById('privacyModal');
  const termsModal = document.getElementById('termsModal');
  
  // Open modals when links are clicked
  if (privacyLink && privacyModal) {
    privacyLink.addEventListener('click', function(e) {
      e.preventDefault();
      privacyModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  }
  
  if (termsLink && termsModal) {
    termsLink.addEventListener('click', function(e) {
      e.preventDefault();
      termsModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  }
  
  // Close modals when clicking the X
  const closeButtons = document.querySelectorAll('.modal .close-modal');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  });
  
  // Close modals when clicking outside
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  });
  
  // Close modals with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.style.display === 'block') {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    }
  });
}

// Service Modals
function initServiceModals() {
    const serviceCards = document.querySelectorAll('.service-card[data-service-modal]');
    const serviceModals = document.querySelectorAll('.service-modal');
    const closeServiceButtons = document.querySelectorAll('.close-service-modal');

    // Open modal window when clicking on service card
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

    // Close modal window
    closeServiceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.service-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close when clicking outside modal window
    serviceModals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close on Escape
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

// Scroll to Top
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
    
    hideTimeout = setTimeout(() => {
      scrollToTop.classList.remove('show');
    }, 3000);
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

// Product Modals - SIMPLE AND RELIABLE VERSION
function initProductModals() {
    console.log('🔄 Init product modals - simple version');
    
    let currentModalIndex = 0;
    let productModals = [];
    
    // Собираем все модальные окна продуктов
    function updateModalsList() {
        productModals = Array.from(document.querySelectorAll('.product-modal'));
        console.log(`📦 Found ${productModals.length} product modals`);
        
        // Скрываем стрелочки на мобильных устройствах
        toggleNavigationVisibility();
    }
    
    // Проверка мобильного устройства
    function isMobileDevice() {
        return window.innerWidth <= 768;
    }
    
    // Показать/скрыть навигацию в зависимости от устройства
    function toggleNavigationVisibility() {
        const navigationElements = document.querySelectorAll('.modal-navigation');
        if (isMobileDevice()) {
            navigationElements.forEach(nav => {
                nav.style.display = 'none';
            });
        } else {
            navigationElements.forEach(nav => {
                nav.style.display = 'flex';
            });
        }
    }
    
    // Функция закрытия модального окна
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Функция переключения модального окна
    function switchModal(direction) {
        if (productModals.length === 0) return;
        
        productModals[currentModalIndex].classList.remove('active');
        
        if (direction === 'next') {
            currentModalIndex = (currentModalIndex + 1) % productModals.length;
        } else {
            currentModalIndex = (currentModalIndex - 1 + productModals.length) % productModals.length;
        }
        
        productModals[currentModalIndex].classList.add('active');
    }
    
    // ПРОСТЫЕ ОБРАБОТЧИКИ
    function initAllHandlers() {
        // 1. Открытие модальных окон
        document.querySelectorAll('.pricing-card[data-modal]').forEach(card => {
            card.addEventListener('click', function(e) {
                if (e.target.closest('.btn-more')) {
                    e.preventDefault();
                }
                
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    currentModalIndex = productModals.findIndex(m => m.id === modalId);
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // 2. Закрытие крестиком
        document.querySelectorAll('.product-modal .close-modal').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const modal = this.closest('.product-modal');
                closeModal(modal);
            });
        });
        
        // 3. Клик вне модального окна
        productModals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal(this);
                }
            });
        });
        
        // 4. Навигационные стрелки
        document.querySelectorAll('.modal-prev').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                if (!isMobileDevice()) {
                    switchModal('prev');
                }
            });
        });
        
        document.querySelectorAll('.modal-next').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                if (!isMobileDevice()) {
                    switchModal('next');
                }
            });
        });
        
        // 5. Кликабельные продукты
        document.querySelectorAll('.clickable-product').forEach(product => {
            product.addEventListener('click', function(e) {
                e.preventDefault();
                const modal = this.closest('.product-modal');
                if (modal) {
                    closeModal(modal);
                }
                
                setTimeout(() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 300);
            });
        });
        
        // 6. Escape для закрытия
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.product-modal.active');
                if (activeModal) {
                    closeModal(activeModal);
                }
            }
            
            // Навигация стрелками клавиатуры
            if (!isMobileDevice() && document.querySelector('.product-modal.active')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    switchModal('prev');
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    switchModal('next');
                }
            }
        });
        
        // 7. Свайпы для мобильных
        if (isMobileDevice()) {
            let startX = 0;
            
            productModals.forEach(modal => {
                modal.addEventListener('touchstart', function(e) {
                    startX = e.touches[0].clientX;
                }, { passive: true });
                
                modal.addEventListener('touchend', function(e) {
                    const endX = e.changedTouches[0].clientX;
                    const diffX = startX - endX;
                    
                    if (Math.abs(diffX) > 50) {
                        if (diffX > 0) {
                            switchModal('next');
                        } else {
                            switchModal('prev');
                        }
                    }
                }, { passive: true });
            });
        }
    }
    
    // Инициализация
    updateModalsList();
    initAllHandlers();
    
    // При изменении размера окна
    window.addEventListener('resize', function() {
        updateModalsList();
        toggleNavigationVisibility();
    });
}

// Gallery Modal Function
function initPortfolioGallery() {
  const galleryModal = document.getElementById('galleryModal');
  const galleryImage = document.getElementById('galleryImage');
  const galleryModalContent = document.querySelector('.gallery-modal-content');
  const closeGalleryBtn = document.querySelector('.close-gallery-modal');
  const prevBtn = document.querySelector('.gallery-prev');
  const nextBtn = document.querySelector('.gallery-next');
  
  const cardImages = document.querySelectorAll('.card-image');
  let currentImageIndex = 0;
  let images = [];

  if (!galleryModal) return;

  // Collect all images from cards
  cardImages.forEach((card, index) => {
    const imgSrc = card.getAttribute('data-image-src');
    const imgAlt = card.getAttribute('data-image-alt');
    
    images.push({
      src: imgSrc,
      alt: imgAlt,
      index: index
    });
  });

  // Open gallery when clicking on image
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
    
    if (currentImage) {
      galleryImage.src = currentImage.src;
      galleryImage.alt = currentImage.alt;
    }
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

  // Events
  if (closeGalleryBtn) closeGalleryBtn.addEventListener('click', closeGallery);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);

  // Close by clicking anywhere on the modal
  galleryModal.addEventListener('click', (e) => {
    closeGallery();
  });

  // Prevent closing when clicking on the content area (image, buttons, etc.)
  if (galleryModalContent) {
    galleryModalContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!galleryModal.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape': closeGallery(); break;
      case 'ArrowLeft': prevImage(); break;
      case 'ArrowRight': nextImage(); break;
    }
  });
}

// Email Links
function initEmailLinks() {
  const emailLinks = document.querySelectorAll('.email-link');
  
  emailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const email = 'info@pologenki.eu';
      copyToClipboard(email);
    });
  });
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, 99999);
  
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (successful) {
      showNotification('✓ Email copied: ' + text);
    } else {
      showNotification('📧 Please copy: ' + text);
    }
  } catch (err) {
    document.body.removeChild(textarea);
    showNotification('📧 Email: ' + text);
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
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
      document.body.removeChild(notification);
    }
  }, 3000);
}

// Auto-refresh prices every 5 minutes
setInterval(() => {
  window.refreshPrices();
}, 300000);

// Start the application
initApp();