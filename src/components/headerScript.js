// headerScript.js
export function initHeaderMenu() {
    // Burger menu functionality
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const languageSelected = document.getElementById('languageSelected');
    const languageOptions = document.getElementById('languageOptions');
    
    if (!menuToggle || !navMenu) {
        console.log('Header elements not found');
        return;
    }
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Language dropdown
    if (languageSelected && languageOptions) {
        languageSelected.addEventListener('click', function(e) {
            e.stopPropagation();
            languageOptions.classList.toggle('active');
        });

        // Language selection
        const langOptions = languageOptions.querySelectorAll('a');
        langOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const selectedLang = this.getAttribute('data-lang');
                languageSelected.textContent = selectedLang;
                languageOptions.classList.remove('active');
                
                // Close mobile menu on language select
                if (window.innerWidth <= 768) {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });

        // Close language dropdown on outside click
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.language-dropdown')) {
                languageOptions.classList.remove('active');
            }
        });
    }

    // Close menu on overlay click
    overlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        this.classList.remove('active');
        document.body.classList.remove('menu-open');
        if (languageOptions) languageOptions.classList.remove('active');
    });

    // Close mobile menu on menu item click
    const menuItems = document.querySelectorAll('.et-hero-tab:not(.language-tab)');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}