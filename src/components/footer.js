export function Footer() {
  return `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-top">
          <div class="footer-brand">
            <h3 class="footer-name">Parvina</h3>
            <p class="footer-tagline">Import Manager & Trade Specialist</p>
          </div>
          
          <div class="footer-links">
            <div class="footer-column">
              <h4 class="footer-column-title">Navigation</h4>
              <ul class="footer-list">
                <li><a href="#products" class="footer-link">Our Products</a></li>
                <li><a href="#about" class="footer-link">About</a></li>
                <li><a href="#services" class="footer-link">Services</a></li>
                <li><a href="#portfolio" class="footer-link">Portfolio</a></li>
                <li><a href="#contact" class="footer-link">Contact</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4 class="footer-column-title">Services</h4>
              <ul class="footer-list">
                <li><a href="#services" class="footer-link">Supplier Sourcing</a></li>
                <li><a href="#services" class="footer-link">Contract Negotiation</a></li>
                <li><a href="#services" class="footer-link">Logistics Management</a></li>
                <li><a href="#services" class="footer-link">Trade Documentation</a></li>
                <li><a href="#services" class="footer-link">Quality Control</a></li>
                <li><a href="#services" class="footer-link">Full-Service Import</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4 class="footer-column-title">Connect</h4>
              <ul class="footer-list">
                <li><a href="https://www.facebook.com/parvina.olive.1" class="footer-link" target="_blank">Facebook</a></li>
                <li><a href="https://wa.me/37258006670" class="footer-link" target="_blank">WhatsApp</a></li>
                <li><a href="https://mail.google.com/mail/?view=cm&to=info@pologenki.eu" class="footer-link" target="_blank">Gmail</a></li>
                <li><a href="https://t.me/parvinaolive" class="footer-link" target="_blank">Telegram</a></li>
                <li><a href="https://web.wechat.com/" class="footer-link" target="_blank">WeChat</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="footer-copyright">
            <p>&copy; Designed & Developed by Pologenki © 2025 All rights reserved.</p>
          </div>
          
          <div class="footer-legal">
            <a href="#privacy-policy" class="footer-legal-link" id="privacy-policy-link">Privacy Policy</a>
            <a href="#terms-of-service" class="footer-legal-link" id="terms-of-service-link">Terms of Service</a>
          </div>
        </div>
      </div>

      <!-- Modal windows -->
      <div id="privacyModal" class="modal">
        <div class="modal-content">
          <span class="close-modal"></span>
          <h2>Privacy Policy</h2>
          <div class="policy-text">
            <p><strong>Parvina - Import Manager & Trade Specialist</strong> is committed to protecting your privacy.</p>
            
            <h3>Information We Collect</h3>
            <p>We may collect the following information when you contact us:</p>
            <ul>
              <li>Name and company details</li>
              <li>Contact information including email address</li>
              <li>Product inquiries and preferences</li>
              <li>Communication history</li>
            </ul>
            
            <h3>How We Use Your Information</h3>
            <ul>
              <li>To respond to your business inquiries</li>
              <li>To provide product information and pricing</li>
              <li>To manage import/export transactions</li>
              <li>To improve our services</li>
            </ul>
            
            <h3>Data Protection</h3>
            <p>We implement appropriate security measures to protect your personal information. We do not sell or share your data with third parties for marketing purposes.</p>
            
            <h3>Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal information. Contact us for any privacy-related requests.</p>
            
            <h3>Contact Us</h3>
            <p>For privacy-related questions: info@pologenki.eu</p>
            
            <p><em>Last updated: ${new Date().getFullYear()}</em></p>
          </div>
        </div>
      </div>

      <div id="termsModal" class="modal">
        <div class="modal-content">
          <span class="close-modal"></span>
          <h2>Terms of Service</h2>
          <div class="policy-text">
            <h3>Business Services</h3>
            <p>Parvina provides import management and trade specialist services. All product prices and specifications are subject to change based on market conditions and availability.</p>
            
            <h3>Inquiries and Agreements</h3>
            <p>Initial product inquiries and communications do not constitute a binding agreement. Final prices, terms, and conditions are confirmed through official quotations and contracts.</p>
            
            <h3>Intellectual Property</h3>
            <p>All content, logos, and business information on this website are the property of Parvina and protected by intellectual property laws.</p>
            
            <h3>Limitation of Liability</h3>
            <p>While we strive for accuracy in all communications, Parvina is not liable for indirect damages resulting from the use of information provided on this website. Business decisions should be verified through official documentation.</p>
            
            <h3>Governing Law</h3>
            <p>These terms are governed by international trade laws and regulations.</p>
            
            <h3>Contact Information</h3>
            <p>Parvina - Import Manager & Trade Specialist<br>
            Email: info@pologenki.eu<br>
            <p><em>Last updated: ${new Date().getFullYear()}</em></p>
          </div>
        </div>
      </div>
    </footer>
  `;
}