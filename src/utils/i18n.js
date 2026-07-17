let currentLanguage = "en";
let translations = {};
const translationsCache = {};
const supportedLanguages = ["en", "ru", "cn"];

export function getLanguageFromPath(pathname = window.location.pathname) {
  const normalized = `/${String(pathname || "").replace(/^\/+|\/+$/g, "").toLowerCase()}/`;
  if (normalized === "/ru/" || normalized.startsWith("/ru/")) return "ru";
  if (normalized === "/zh-cn/" || normalized.startsWith("/zh-cn/")) return "cn";
  return "en";
}

export async function initLanguage() {
  const pathLanguage = getLanguageFromPath();
  const savedLanguage = localStorage.getItem("preferredLanguage");
  const browserLanguage = navigator.language.startsWith("zh")
    ? "cn"
    : navigator.language.split("-")[0];

  let lang = "en";

  if (pathLanguage && supportedLanguages.includes(pathLanguage)) {
    lang = pathLanguage;
  } else if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
    lang = savedLanguage;
  } else if (supportedLanguages.includes(browserLanguage)) {
    lang = browserLanguage;
  }

  await loadTranslations(lang);
  return lang;
}

export async function loadTranslations(lang) {
  const targetLang = supportedLanguages.includes(lang) ? lang : "en";

  try {
    if (!translationsCache[targetLang]) {
      const module = await import(`../locales/${targetLang}.json`);
      translationsCache[targetLang] = module.default;
    }

    translations = translationsCache[targetLang];
    currentLanguage = targetLang;

    localStorage.setItem("preferredLanguage", targetLang);
    document.documentElement.lang = targetLang === "cn" ? "zh-CN" : targetLang;

    return true;
  } catch (error) {
    console.error("Error loading translations:", error);

    if (targetLang !== "en") {
      return await loadTranslations("en");
    }
    return false;
  }
}

export function t(key, params = {}) {
  const keys = key.split(".");
  let value = translations;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
  }

  if (typeof value === "string" && Object.keys(params).length > 0) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] || match;
    });
  }

  return value || key;
}

export function getCurrentLanguage() {
  return currentLanguage;
}

window.t = t;
