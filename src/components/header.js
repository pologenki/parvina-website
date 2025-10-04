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
            <a class="et-hero-tab" href="#about">Home</a>
            <a class="et-hero-tab" href="#services">Services</a>
            <a class="et-hero-tab" href="#portfolio">My Portfolio</a>
            <a class="et-hero-tab" href="#contact">Get In Touch</a>

            <!-- Логотип вместо выбора языка -->
            <div class="et-hero-tab logo-tab">
                <img src="/Logo2.png" alt="Logo" class="header-logo">
            </div>
        </div>
    </section>

  `
}