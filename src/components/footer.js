export function Footer() {
  return `
    <footer class="footer">
      <div class="footer-container">
        <!-- Верхняя часть футера -->
        <div class="footer-top">
          <div class="footer-brand">
            <h3 class="footer-name">Parvina</h3>
            <p class="footer-tagline">Product Designer</p>
          </div>
          
          <div class="footer-links">
            <div class="footer-column">
              <h4 class="footer-column-title">Navigation</h4>
              <ul class="footer-list">
                <li><a href="#home" class="footer-link">Home</a></li>
                <li><a href="#about" class="footer-link">About</a></li>
                <li><a href="#services" class="footer-link">Services</a></li>
                <li><a href="#portfolio" class="footer-link">Portfolio</a></li>
                <li><a href="#contact" class="footer-link">Contact</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4 class="footer-column-title">Services</h4>
              <ul class="footer-list">
                <li><a href="#" class="footer-link">Product Design</a></li>
                <li><a href="#" class="footer-link">UX/UI Design</a></li>
                <li><a href="#" class="footer-link">Visual Design</a></li>
                <li><a href="#" class="footer-link">Web Development</a></li>
                <li><a href="#" class="footer-link">Content Design</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4 class="footer-column-title">Connect</h4>
              <ul class="footer-list">
                <li><a href="#" class="footer-link">LinkedIn</a></li>
                <li><a href="#" class="footer-link">Dribbble</a></li>
                <li><a href="#" class="footer-link">Behance</a></li>
                <li><a href="#" class="footer-link">Instagram</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Нижняя часть футера -->
        <div class="footer-bottom">
          <div class="footer-copyright">
            <p>&copy; 2025 Created by  developer Pologenki. All rights reserved.</p>
          </div>
          
          <div class="footer-legal">
            <a href="#" class="footer-legal-link">Privacy Policy</a>
            <a href="#" class="footer-legal-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `
}