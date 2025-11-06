import './style.css'
import { Header } from './components/header.js'
import { Content } from './components/content.js'
import { Footer } from './components/footer.js'
import { initHeaderMenu } from './components/headerScript.js';
import { initSectionScript } from './components/sectionScript.js';
import { initLanguage, t, loadTranslations } from './utils/i18n.js';
import { initContactForm } from './utils/emailService.js';

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
  // Update all elements with data-i18n attribute
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key);
  });
  
  // Update placeholders
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = t(key);
  });
}

// Function to render the entire application
function renderApp() {
  document.querySelector('#app').innerHTML = `
    ${Header()}
    ${Content()}
    ${Footer()}
  `;

  // Update texts after render
  updatePageTexts();
  
  // Initialize all components
  initHeaderMenu();
  initSectionScript();
  initSwiper();
  initContactForm();
  initScrollToTop();
  initProductModals();
  initServiceModals();
  initPortfolioGallery(); // ← ADD THIS LINE
  // Update active language in dropdown
  updateLanguageSelector();
    initEmailLinks();
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
    
    console.log('✅ Portfolio Swiper initialized successfully!');
  }
}

// Global function for language change
window.changeLanguage = async function(lang) {
  await loadTranslations(lang);
  updatePageTexts();
  updateLanguageSelector();
};

// Start the application
initApp();

// services.js or component.js
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
            modal.classList.remove('active');
            document.body.style.overflow = '';
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

// And call in main file
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
    
    // Define hide time depending on device
    const hideDelay = window.innerWidth >= 768 ? 3000 : 500; // 3 seconds for desktop, 0.5 for mobile
    
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

    // Function to close modal window with animation
    function closeModal(modal) {
        modal.classList.add('closing');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            modal.classList.remove('active', 'closing');
        }, 300);
    }

    // Handle cards WITH modal windows (first 8 blocks)
    pricingCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // If clicked on "Learn More" - open modal window
            if (e.target.closest('.btn-more')) {
                e.preventDefault();
                e.stopPropagation(); // Prevent bubbling
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
                return;
            }
            
            // If clicked on the card itself (but not on the button) - also open modal window
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

    // Handle cards WITHOUT modal windows (last 2 blocks)
    pricingCardsNoModal.forEach(card => {
        card.addEventListener('click', function(e) {
            // If clicked on "Learn More" - scroll to contacts
            if (e.target.closest('.btn-more')) {
                e.preventDefault();
                e.stopPropagation(); // Prevent bubbling
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                return;
            }
            
            // If clicked on the card itself (but not on the button) - also scroll to contacts
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

    // Close modal window with animation
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.product-modal');
            closeModal(modal);
        });
    });

    // Close when clicking outside modal window with animation
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    // Handle clicks on product blocks in modal windows
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

    // Close on Escape with animation
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

  // Collect all images from cards
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

  // Update counter
  totalImagesSpan.textContent = images.length;

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
    
    galleryImage.src = currentImage.src;
    galleryImage.alt = currentImage.alt;
    imageTitle.textContent = currentImage.title;
    imageDescription.textContent = currentImage.description;
    currentImageSpan.textContent = currentImageIndex + 1;
    
    // Update navigation button states
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

  // Events
  closeGalleryBtn.addEventListener('click', closeGallery);
  prevBtn.addEventListener('click', prevImage);
  nextBtn.addEventListener('click', nextImage);

  // Close by clicking outside image
  galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
      closeGallery();
    }
  });

  // Keyboard navigation
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

// Add to main.js
function initEmailLinks() {
  const emailLinks = document.querySelectorAll('.email-link');
  
  emailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const email = 'info@pologenki.eu';
      
      // Copy email
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
      showNotification('✓ Email copied: ' + text + '\nPlease paste it in your email client');
    } else {
      showNotification('📧 Please copy: ' + text);
    }
  } catch (err) {
    document.body.removeChild(textarea);
    showNotification('📧 Email: ' + text + '\nPlease copy it manually');
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
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 3000);
}

/** */
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Set last Tuesday date
document.getElementById('current-date').textContent = formatDate(getLastTuesday());