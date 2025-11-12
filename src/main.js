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
    // Убедимся, что Swiper инициализируется только когда все изображения загружены
    const images = swiperElement.querySelectorAll('img');
    let imagesLoaded = 0;
    
    if (images.length === 0) {
      initializeSwiper();
      return;
    }
    
    images.forEach(img => {
      if (img.complete) {
        imagesLoaded++;
      } else {
        img.addEventListener('load', () => {
          imagesLoaded++;
          if (imagesLoaded === images.length) {
            initializeSwiper();
          }
        });
        img.addEventListener('error', () => {
          imagesLoaded++;
          if (imagesLoaded === images.length) {
            initializeSwiper();
          }
        });
      }
    });
    
    if (imagesLoaded === images.length) {
      initializeSwiper();
    }
  } else {
    console.log('❌ Portfolio Swiper element not found');
  }
  
  function initializeSwiper() {
    setTimeout(() => {
      const swiper = new Swiper('.portfolio-swiper', {
        modules: [Navigation, Pagination, Autoplay],
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: false,
        
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
          },
        },
        
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          disabledClass: 'swiper-button-disabled',
        },
        
        // Улучшенные настройки для touch
        touchEventsTarget: 'container',
        simulateTouch: true,
        touchRatio: 1,
        touchAngle: 45,
        grabCursor: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: 0.5,
        longSwipesMs: 300,
        followFinger: true,
        threshold: 5,
        
        // Предотвращение случайных кликов при свайпе
        preventClicks: true,
        preventClicksPropagation: true,
        
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
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
        },
        
        // События для отладки
        on: {
          init: function () {
            console.log('✅ Swiper initialized successfully!');
          },
          slideChange: function () {
            console.log('🔄 Slide changed to:', this.activeIndex);
          }
        }
      });
      
      // Добавим обработчики для лучшей навигации
      const nextBtn = document.querySelector('.swiper-button-next');
      const prevBtn = document.querySelector('.swiper-button-prev');
      
      if (nextBtn) {
        nextBtn.style.cursor = 'pointer';
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
      
      if (prevBtn) {
        prevBtn.style.cursor = 'pointer';
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
      
    }, 100);
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

// Product Modals - UPDATED VERSION WITH BETTER NAVIGATION
function initProductModals() {
    console.log('🔄 Init product modals - updated version');
    
    let currentModalIndex = 0;
    let productModals = [];
    
    // Собираем все модальные окна продуктов
    function updateModalsList() {
        productModals = Array.from(document.querySelectorAll('.product-modal'));
        console.log(`📦 Found ${productModals.length} product modals`);
        
        // Обновляем видимость навигации
        toggleNavigationVisibility();
    }
    
    // Проверка мобильного устройства - ОБНОВЛЕННАЯ ЛОГИКА
    function isMobileDevice() {
        return window.innerWidth < 1024; // Увеличили до 1024px для лучшей доступности
    }
    
    // Показать/скрыть навигацию в зависимости от устройства - ОБНОВЛЕННАЯ ФУНКЦИЯ
    function toggleNavigationVisibility() {
        const navigationElements = document.querySelectorAll('.modal-navigation');
        
        // Всегда показываем навигацию, но меняем стили для мобильных
        navigationElements.forEach(nav => {
            nav.style.display = 'flex';
            
            if (isMobileDevice()) {
                nav.style.opacity = '0.7';
                nav.style.transform = 'scale(0.9)';
            } else {
                nav.style.opacity = '1';
                nav.style.transform = 'scale(1)';
            }
        });
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
        
        // Добавляем анимацию перехода
        const activeModal = productModals[currentModalIndex];
        activeModal.style.animation = 'none';
        setTimeout(() => {
            activeModal.style.animation = 'fadeIn 0.3s ease-in-out';
        }, 10);
    }
    
    // УЛУЧШЕННЫЕ ОБРАБОТЧИКИ
    function initAllHandlers() {
        // 1. Открытие модальных окон
        document.querySelectorAll('.pricing-card[data-modal]').forEach(card => {
            card.addEventListener('click', function(e) {
                // Предотвращаем открытие при клике на кнопку "Learn More" (она должна работать отдельно)
                if (e.target.classList.contains('btn-more') || e.target.closest('.btn-more')) {
                    return; // Позволяем стандартному поведению ссылки
                }
                
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    currentModalIndex = productModals.findIndex(m => m.id === modalId);
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    // Добавляем анимацию
                    modal.style.animation = 'fadeIn 0.3s ease-in-out';
                }
            });
        });
        
        // 2. Отдельные обработчики для кнопок "Learn More"
        document.querySelectorAll('.btn-more').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const card = this.closest('.pricing-card');
                const modalId = card.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                
                if (modal) {
                    currentModalIndex = productModals.findIndex(m => m.id === modalId);
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    // Добавляем анимацию
                    modal.style.animation = 'fadeIn 0.3s ease-in-out';
                }
            });
        });
        
        // 3. Закрытие крестиком
        document.querySelectorAll('.product-modal .close-modal').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const modal = this.closest('.product-modal');
                closeModal(modal);
            });
        });
        
        // 4. Клик вне модального окна
        productModals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal(this);
                }
            });
        });
        
        // 5. Навигационные стрелки - УБИРАЕМ ПРОВЕРКУ НА МОБИЛЬНЫЕ УСТРОЙСТВА
        document.querySelectorAll('.modal-prev').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                switchModal('prev');
            });
        });
        
        document.querySelectorAll('.modal-next').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                switchModal('next');
            });
        });
        
        // 6. Кликабельные продукты
        document.querySelectorAll('.clickable-product').forEach(product => {
            product.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
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
        
        // 7. Escape для закрытия
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.product-modal.active');
                if (activeModal) {
                    closeModal(activeModal);
                }
            }
            
            // Навигация стрелками клавиатуры - УБИРАЕМ ПРОВЕРКУ НА МОБИЛЬНЫЕ
            if (document.querySelector('.product-modal.active')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    switchModal('prev');
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    switchModal('next');
                }
            }
        });
        
        // 8. Свайпы для мобильных устройств
        let touchStartX = 0;
        let touchStartY = 0;
        
        productModals.forEach(modal => {
            modal.addEventListener('touchstart', function(e) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }, { passive: true });
            
            modal.addEventListener('touchend', function(e) {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                
                const diffX = touchStartX - touchEndX;
                const diffY = touchStartY - touchEndY;
                
                // Проверяем, что это горизонтальный свайп (не вертикальный)
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        switchModal('next');
                    } else {
                        switchModal('prev');
                    }
                }
            }, { passive: true });
        });
    }
    
    // Инициализация
    updateModalsList();
    initAllHandlers();
    
    // При изменении размера окна
    window.addEventListener('resize', function() {
        updateModalsList();
    });
    
    // Добавляем CSS анимации
    addModalAnimations();
}

// Функция для добавления CSS анимаций
function addModalAnimations() {
    if (!document.getElementById('modalAnimations')) {
        const style = document.createElement('style');
        style.id = 'modalAnimations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .product-modal.active {
                animation: fadeIn 0.3s ease-in-out;
            }
            
            /* Улучшенные стили для мобильной навигации */
            @media (max-width: 1023px) {
                .modal-navigation {
                    opacity: 0.7 !important;
                    transform: scale(0.9) !important;
                }
                
                .modal-prev, .modal-next {
                    min-width: 44px !important;
                    min-height: 44px !important;
                    font-size: 20px !important;
                }
            }
            
            @media (max-width: 767px) {
                .modal-navigation {
                    opacity: 0.8 !important;
                    transform: scale(0.95) !important;
                    margin: 0 -5px!important;
                }
                
                .modal-prev, .modal-next {
                    min-width: 25px !important;
                    min-height: 25px !important;
                    font-size: 18px !important;

                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Gallery Modal Function
function initPortfolioGallery() {
  const galleryModal = document.getElementById('galleryModal');
  const galleryImage = document.getElementById('galleryImage');
  const galleryModalContent = document.querySelector('.gallery-modal-content');
  const closeGalleryBtn = document.querySelector('.close-gallery-modal');
  const prevBtn = document.querySelector('.gallery-prev');
  const nextBtn = document.querySelector('.gallery-next');
  const currentImageSpan = document.getElementById('currentImage');
  const totalImagesSpan = document.getElementById('totalImages');
  const imageTitle = document.getElementById('imageTitle');
  const imageDescription = document.getElementById('imageDescription');
  
  const cardImages = document.querySelectorAll('.card-image');
  let currentImageIndex = 0;
  let images = [];

  if (!galleryModal) {
    console.log('❌ Gallery modal not found');
    return;
  }

  // Собираем все данные для галереи
  cardImages.forEach((card, index) => {
    const imgElement = card.querySelector('img');
    const content = card.closest('.swiper-slide').querySelector('.portfolio-content');
    
    if (imgElement) {
      images.push({
        src: imgElement.src,
        alt: imgElement.alt,
        title: content ? content.querySelector('h3')?.textContent || 'Project Title' : 'Project Title',
        description: content ? content.querySelector('p')?.textContent || 'Project description' : 'Project description',
        index: index
      });
    }
  });

  // Обновляем счетчик общего количества
  if (totalImagesSpan) {
    totalImagesSpan.textContent = images.length;
  }

  // Открытие галереи при клике на карточку
  cardImages.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      // Проверяем, не кликнули ли мы на иконку увеличения
      if (!e.target.closest('.zoom-icon') && !e.target.classList.contains('zoom-icon')) {
        openGallery(index);
      }
    });
    
    // Отдельный обработчик для иконки увеличения
    const zoomIcon = card.querySelector('.zoom-icon');
    if (zoomIcon) {
      zoomIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        openGallery(index);
      });
    }
  });

  function openGallery(index) {
    if (index < 0 || index >= images.length) return;
    
    currentImageIndex = index;
    updateGallery();
    galleryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log(`🖼️ Opening gallery at index: ${index}`);
  }

  function closeGallery() {
    galleryModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateGallery() {
    const currentImage = images[currentImageIndex];
    
    if (!currentImage) return;
    
    // Показываем загрузку
    galleryImage.style.opacity = '0';
    
    // Предзагрузка изображения
    const img = new Image();
    img.onload = () => {
      galleryImage.src = currentImage.src;
      galleryImage.alt = currentImage.alt;
      galleryImage.style.opacity = '1';
      
      // Обновляем счетчик
      if (currentImageSpan) {
        currentImageSpan.textContent = currentImageIndex + 1;
      }
      
      // Обновляем заголовок и описание
      if (imageTitle) {
        imageTitle.textContent = currentImage.title;
      }
      if (imageDescription) {
        imageDescription.textContent = currentImage.description;
      }
    };
    
    img.onerror = () => {
      console.error('❌ Failed to load image:', currentImage.src);
      galleryImage.style.opacity = '1';
    };
    
    img.src = currentImage.src;
  }

  function nextImage() {
    if (currentImageIndex < images.length - 1) {
      currentImageIndex++;
    } else {
      currentImageIndex = 0; // Зацикливаем
    }
    updateGallery();
  }

  function prevImage() {
    if (currentImageIndex > 0) {
      currentImageIndex--;
    } else {
      currentImageIndex = images.length - 1; // Зацикливаем
    }
    updateGallery();
  }

  // Обработчики событий
  if (closeGalleryBtn) {
    closeGalleryBtn.addEventListener('click', closeGallery);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevImage();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextImage();
    });
  }

  // Закрытие по клику на фон
  galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
      closeGallery();
    }
  });

  // Предотвращаем закрытие при клике на контент
  if (galleryModalContent) {
    galleryModalContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Навигация с клавиатуры
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

  // Свайпы для мобильных устройств
  let touchStartX = 0;
  let touchEndX = 0;
  
  galleryModal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  galleryModal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diffX = touchStartX - touchEndX;
    
    if (Math.abs(diffX) > swipeThreshold) {
      if (diffX > 0) {
        nextImage(); // Свайп влево -> следующее изображение
      } else {
        prevImage(); // Свайп вправо -> предыдущее изображение
      }
    }
  }

  console.log(`✅ Gallery initialized with ${images.length} images`);
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