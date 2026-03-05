export function Header() {
  const BASE = import.meta.env.BASE_URL;
  return `
  <section class="et-hero-tabs">
        <div class="logo" onclick="window.location.reload()" style="cursor: pointer;">
            <img src="${BASE}Logo2.png" alt="Logo">
        </div>

        <div class="menu-toggle" id="menuToggle">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <div class="et-hero-tabs-container" id="navMenu">
            <a class="et-hero-tab" href="#products">Our Products</a>
            <a class="et-hero-tab" href="#services">Services</a>
            <a class="et-hero-tab" href="#portfolio">My Portfolio</a>
            <a class="et-hero-tab" href="#contact">Get In Touch</a>

            <div class="et-hero-tab logo-tab" onclick="window.location.reload()" style="cursor: pointer;">
                <img src="${BASE}Logo2.png" alt="Logo" class="header-logo">
            </div>
        </div>
    </section>
  `
}

