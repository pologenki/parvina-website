export function Header() {
  return `
  <section class="et-hero-tabs">
    <div class="logo">
      <img src="/optimized/Logo2-sharp-320.png" alt="Pologenki" width="320" height="320">
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
          <a class="language-option" data-lang="en" href="/" hreflang="en" lang="en">
            <span class="language-flag" aria-hidden="true"></span>
            <span class="language-name">English</span>
          </a>
          <a class="language-option" data-lang="ru" href="/ru/" hreflang="ru" lang="ru">
            <span class="language-flag" aria-hidden="true"></span>
            <span class="language-name">Русский</span>
          </a>
          <a class="language-option" data-lang="cn" href="/zh-cn/" hreflang="zh-CN" lang="zh-CN">
            <span class="language-flag" aria-hidden="true"></span>
            <span class="language-name">中文</span>
          </a>
        </div>
      </div>
      <a class="et-hero-tab" href="#products" data-section="products" data-i18n="nav.products">Our Products</a>
      <a class="et-hero-tab" href="#services" data-section="services" data-i18n="nav.services">Services</a>
      <a class="et-hero-tab" href="#portfolio" data-section="portfolio" data-i18n="nav.portfolio">My Portfolio</a>
      <a class="et-hero-tab" href="#contact" data-section="contact" data-i18n="nav.contact">Get In Touch</a>

      <button class="et-hero-tab logo-tab" type="button" aria-label="Back to top">
        <img src="/optimized/Logo2-sharp-320.png" alt="Pologenki" class="header-logo" width="320" height="320">
      </button>
    </div>
  </section>
  `;
}
