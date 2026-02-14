export function Header() {
  return `
  <section class="et-hero-tabs">
    <div class="logo">
      <img src="/Logo2.png" alt="Logo">
    </div>


    <div class="menu-toggle" id="menuToggle">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <div class="et-hero-tabs-container" id="navMenu">
      <div class="language-switcher">
        <div class="language-current" id="languageCurrent">
          <span class="language-code">EN</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="language-dropdown">
          <div class="language-option" data-lang="en">
            <span class="language-name">English</span>
          </div>
          <div class="language-option" data-lang="ru">
            <span class="language-name">Русский</span>
          </div>
        </div>
      </div>
      <a class="et-hero-tab" href="#products" data-i18n="nav.products">Our Products</a>
      <a class="et-hero-tab" href="#services" data-i18n="nav.services">Services</a>
      <a class="et-hero-tab" href="#portfolio" data-i18n="nav.portfolio">My Portfolio</a>
      <a class="et-hero-tab" href="#contact" data-i18n="nav.contact">Get In Touch</a>

      <!-- Логотип вместо выбора языка -->
      <div class="et-hero-tab logo-tab" style="cursor: pointer;">
        <img src="/Logo2.png" alt="Logo" class="header-logo">
      </div>
    </div>
  </section>
  `;
}
