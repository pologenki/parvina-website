let currentLanguage = 'en';
let translations = {};
const translationsCache = {};
const supportedLanguages = ['en', 'ru']; // cn отсутствует, чтобы не ломать загрузку

// Инициализация языка
export async function initLanguage() {
  const savedLanguage = localStorage.getItem('preferredLanguage');
  const browserLanguage = navigator.language.split('-')[0];

  // Определяем язык по приоритету: сохраненный -> браузер -> английский
  let lang = 'en';

  if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
    lang = savedLanguage;
  } else if (supportedLanguages.includes(browserLanguage)) {
    lang = browserLanguage;
  }

  await loadTranslations(lang);
  return lang;
}

// Загрузка переводов через bundler, без fetch по /locales
export async function loadTranslations(lang) {
  const targetLang = supportedLanguages.includes(lang) ? lang : 'en';

  try {
    if (!translationsCache[targetLang]) {
      const module = await import(`../locales/${targetLang}.json`);
      translationsCache[targetLang] = module.default;
    }

    translations = translationsCache[targetLang];
    currentLanguage = targetLang;

    localStorage.setItem('preferredLanguage', targetLang);
    document.documentElement.lang = targetLang;

    console.log(`✅ Language switched to: ${targetLang}`);
    return true;
  } catch (error) {
    console.error('❌ Error loading translations:', error);

    // Загружаем английский как запасной вариант
    if (targetLang !== 'en') {
      return await loadTranslations('en');
    }
    return false;
  }
}

// Получение перевода по ключу
export function t(key, params = {}) {
  const keys = key.split('.');
  let value = translations;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`⚠️ Translation missing for key: ${key}`);
      return key; // Возвращаем ключ, если перевод не найден
    }
  }

  // Заменяем параметры если есть
  if (typeof value === 'string' && Object.keys(params).length > 0) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] || match;
    });
  }

  return value || key;
}

// Получение текущего языка
export function getCurrentLanguage() {
  return currentLanguage;
}

// Экспортируем глобально для использования в HTML
window.t = t;