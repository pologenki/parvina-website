export function Header() {
  return `
  <section class="et-hero-tabs">
    <div class="logo">
      <img src="/Logo2.png" alt="Logo">
    </div>

    <button class="menu-toggle" id="menuToggle" type="button" aria-label="Open navigation">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div class="et-hero-tabs-container" id="navMenu">
      <div class="language-switcher">
        <button class="language-current" id="languageCurrent" type="button" aria-label="Select language">
          <span class="language-code">EN</span>
          <i class="fas fa-chevron-down" aria-hidden="true"></i>
        </button>
        <div class="language-dropdown">
          <div class="language-option" data-lang="en">
            <span class="language-flag" aria-hidden="true"></span>
            <span class="language-name">English</span>
          </div>
          <div class="language-option" data-lang="ru">
            <span class="language-flag" aria-hidden="true"></span>
            <span class="language-name">Русский</span>
          </div>
          <div class="language-option" data-lang="cn">
            <span class="language-flag" aria-hidden="true"></span>
            <span class="language-name">中文</span>
          </div>
        </div>
      </div>
      <a class="et-hero-tab" href="javascript:void(0)" data-section="products" data-i18n="nav.products">Our Products</a>
      <a class="et-hero-tab" href="javascript:void(0)" data-section="services" data-i18n="nav.services">Services</a>
      <a class="et-hero-tab" href="javascript:void(0)" data-section="portfolio" data-i18n="nav.portfolio">My Portfolio</a>
      <a class="et-hero-tab" href="javascript:void(0)" data-section="contact" data-i18n="nav.contact">Get In Touch</a>

      <button class="et-hero-tab logo-tab" type="button" aria-label="Back to top">
        <img src="/Logo2.png" alt="Logo" class="header-logo">
      </button>
    </div>
  </section>
  `;
}
