let currentLanguage = 'en';

// Все переводы в одном файле (временно)
const allTranslations = {
  en: {
    header: { home: "Home", about: "About", services: "Services", portfolio: "Portfolio", contact: "Contact" },
    about: { title: "Hello! I'm Parvina", subtitle: "Product Designer", description: "Lorem ipsum dolor sit amet...", principles: "Get In Touch:" },
    services: { title: "Amazing services", productDesign: "Product Design", uxDesign: "U/LX Design", visualDesign: "Visual Design", businessAnalysis: "Business Analysis", webDevelopment: "Web Development", contentDesign: "Content Design", readMore: "Read More" },
    portfolio: { title: "My Portfolio" },
    contact: { title: "Get In Touch", firstName: "First Name", lastName: "Last Name", email: "Email", message: "How can we help you?", sendMessage: "Send Message", connectWithMe: "Connect With Me", firstNamePlaceholder: "Enter your first name...", lastNamePlaceholder: "Enter your last name...", emailPlaceholder: "Enter your email address...", messagePlaceholder: "Enter your message..." },
    footer: { navigation: "Navigation", services: "Services", connect: "Connect", copyright: "Created by developer Pologenki. All rights reserved.", privacy: "Privacy Policy", terms: "Terms of Service" }
  },
  ru: {
    header: { home: "Главная", about: "Обо мне", services: "Услуги", portfolio: "Портфолио", contact: "Контакты" },
    about: { title: "Привет! Я Парвина", subtitle: "Продуктовый дизайнер", description: "Lorem ipsum dolor sit amet...", principles: "Свяжитесь со мной:" },
    services: { title: "Потрясающие услуги", productDesign: "Дизайн продукта", uxDesign: "U/LX дизайн", visualDesign: "Визуальный дизайн", businessAnalysis: "Бизнес-анализ", webDevelopment: "Веб-разработка", contentDesign: "Дизайн контента", readMore: "Подробнее" },
    portfolio: { title: "Мое портфолио" },
    contact: { title: "Свяжитесь со мной", firstName: "Имя", lastName: "Фамилия", email: "Email", message: "Как мы можем вам помочь?", sendMessage: "Отправить сообщение", connectWithMe: "Свяжитесь со мной", firstNamePlaceholder: "Введите ваше имя...", lastNamePlaceholder: "Введите вашу фамилию...", emailPlaceholder: "Введите ваш email...", messagePlaceholder: "Введите ваше сообщение..." },
    footer: { navigation: "Навигация", services: "Услуги", connect: "Связь", copyright: "Создано разработчиком Pologenki. Все права защищены.", privacy: "Политика конфиденциальности", terms: "Условия использования" }
  },
  cn: {
    header: { home: "首页", about: "关于", services: "服务", portfolio: "作品集", contact: "联系" },
    about: { title: "你好！我是帕尔维娜", subtitle: "产品设计师", description: "Lorem ipsum dolor sit amet...", principles: "联系我：" },
    services: { title: "精彩服务", productDesign: "产品设计", uxDesign: "U/LX设计", visualDesign: "视觉设计", businessAnalysis: "业务分析", webDevelopment: "网站开发", contentDesign: "内容设计", readMore: "了解更多" },
    portfolio: { title: "我的作品集" },
    contact: { title: "联系我", firstName: "名字", lastName: "姓氏", email: "邮箱", message: "我们如何帮助您？", sendMessage: "发送消息", connectWithMe: "与我联系", firstNamePlaceholder: "输入您的名字...", lastNamePlaceholder: "输入您的姓氏...", emailPlaceholder: "输入您的邮箱地址...", messagePlaceholder: "输入您的消息..." },
    footer: { navigation: "导航", services: "服务", connect: "联系", copyright: "由开发者Pologenki创建。保留所有权利。", privacy: "隐私政策", terms: "服务条款" }
  }
};

let translations = allTranslations.en;

export async function loadTranslations(lang) {
  translations = allTranslations[lang] || allTranslations.en;
  currentLanguage = lang;
  localStorage.setItem('preferredLanguage', lang);
  console.log(`✅ Language changed to: ${lang}`);
  return translations;
}

export function t(key) {
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && value[k] !== undefined) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }
  
  return value;
}

export function getCurrentLanguage() {
  return currentLanguage;
}

export async function initLanguage() {
  const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
  return await loadTranslations(savedLanguage);
}