import './style.css'
import { Header } from './components/header.js'
import { Content } from './components/content.js'
import { Footer } from './components/footer.js'
import { initHeaderMenu } from './components/headerScript.js';
import { initSectionScript } from './components/sectionScript.js';
import { initLanguage, t, loadTranslations } from './utils/i18n.js';
import { initContactForm } from './utils/emailService.js'; // ← ДОБАВИТЬ ЭТУ СТРОКУ

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
  initContactForm(); // ← ДОБАВИТЬ ЭТУ СТРОКУ
  
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
  const swiperElement = document.querySelector('.mySwiper');
  
  if (swiperElement) {
    const swiper = new Swiper('.mySwiper', {
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
      }
    });
    
    console.log('✅ Swiper инициализирован успешно!');
  } else {
    console.log('❌ Элемент слайдера не найден');
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