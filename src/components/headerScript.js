// headerScript.js
let scrollLockCounter = 0;

function preventBodyScroll() {
  scrollLockCounter++;
  if (scrollLockCounter === 1) {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = scrollBarWidth + 'px';
  }
}

function allowBodyScroll() {
  if (scrollLockCounter > 0) {
    scrollLockCounter--;
    if (scrollLockCounter === 0) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }
}

export function initHeaderMenu() {
  // Burger menu functionality
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const languageCurrent = document.querySelector(".language-current");
  const languageDropdown = document.querySelector(".language-dropdown");

  if (!menuToggle || !navMenu) {
    console.log("Header elements not found");
    return;
  }

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  document.body.appendChild(overlay);

  // Toggle mobile menu
  menuToggle.addEventListener("click", function () {
    this.classList.toggle("active");
    navMenu.classList.toggle("active");
    overlay.classList.toggle("active");
    
    // Toggle body scroll based on menu state
    if (navMenu.classList.contains("active")) {
      preventBodyScroll();
    } else {
      allowBodyScroll();
    }
  });

  // Language dropdown functionality is handled in main.js via initLanguageSwitcher()

  // Close menu on overlay click
  overlay.addEventListener("click", function () {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("active");
    this.classList.remove("active");
    document.body.classList.remove("menu-open");
    if (languageDropdown) languageDropdown.classList.remove("active");
    
    // Allow body scroll when menu closes
    allowBodyScroll();
  });

  // Close mobile menu on menu item click
  const menuItems = document.querySelectorAll(
    ".et-hero-tab:not(.language-tab)",
  );
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
        overlay.classList.remove("active");
        document.body.classList.remove("menu-open");
        
        // Allow body scroll when menu closes
        allowBodyScroll();
      }
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}
