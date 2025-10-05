export function Content() {
  return `

     <!-- Секция About с id -->
    <section id="about" class="about-section">
      <div class="about-container">
        <div class="about-content">
          <div class="about-text">
            <h2 class="about-title">Hello! I'm Parvina</h2>
            <h3 class="about-subtitle">Import Manager & Trade Specialist</h3>
            <p class="about-description">
              Professional import manager specializing in nuts, dried fruits, spices, coffee and related products. 
              I help businesses establish reliable supply chains from international markets to your warehouse.
            </p>
            
                            <div class="contact-info">
                    <h3>Get In Touch:</h3>
                    <div class="contact-item">
                        <div class="contact-icon">
                            <!-- Email icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </div>
                        <div class="contact-text">pologenkip@gmail.com</div>
                    </div>
                    <div class="contact-item">
                        <div class="contact-icon">
                            <!-- Phone icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                        </div>
                        <div class="contact-text">+79534107650</div>
                    </div>
                </div>
            <!-- Социальные иконки в стиле Codepen -->
            <div class="social-icons-wrapper">
              <div class="social-icons">
                <a href="https://www.facebook.com/parvina.olive.1" class="social-icon facebook" title="Facebook" target="_blank">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="https://t.me/parvinaolive" class="social-icon telegram" title="Telegram" target="_blank">
                  <i class="fab fa-telegram"></i>
                </a>
                <a href="https://wa.me/79534107650" class="social-icon whatsapp" title="WhatsApp" target="_blank">
                  <i class="fab fa-whatsapp"></i>
                </a>
                <a href="https://web.wechat.com/" class="social-icon wechat" title="WeChat" target="_blank">
                  <i class="fab fa-weixin"></i>
                </a>
                <a href="https://mail.google.com/mail/?view=cm&to=pologenkip@gmail.com" class="social-icon gmail" title="Gmail" target="_blank">
                  <i class="fab fa-google"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div class="about-image">
            <img src="/myfoto.jpg" alt="Parvina - Import Manager" class="profile-photo">
          </div>
        </div>
      </div>
    </section>

    <!-- Секция Services с id -->
    <section id="services" class="services-section">
      <div class="services-container">
        <h2 class="services-title">Import Management Services</h2>
        <div class="services-grid">
          <div class="service-card" data-modal="modal1">
            <div class="service-icon">PS</div>
            <h3 class="service-name">Supplier Sourcing</h3>
            <p class="service-description">
              Finding reliable suppliers worldwide with thorough due diligence and quality verification for nuts, dried fruits, and spices.
            </p>
            <div class="read-more-btn">
              <span>Read More</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          
          <div class="service-card" data-modal="modal2">
            <div class="service-icon">NC</div>
            <h3 class="service-name">Contract Negotiation</h3>
            <p class="service-description">
              Securing optimal terms and pricing through expert negotiation while protecting client interests in international deals.
            </p>
            <div class="read-more-btn">
              <span>Read More</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          
          <div class="service-card" data-modal="modal3">
            <div class="service-icon">LM</div>
            <h3 class="service-name">Logistics Management</h3>
            <p class="service-description">
              Coordinating seamless transportation with trusted partners and optimizing supply chain routes for cost efficiency.
            </p>
            <div class="read-more-btn">
              <span>Read More</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          
          <div class="service-card" data-modal="modal4">
            <div class="service-icon">TD</div>
            <h3 class="service-name">Trade Documentation</h3>
            <p class="service-description">
              Handling complete customs documentation and compliance to ensure smooth customs clearance and timely delivery.
            </p>
            <div class="read-more-btn">
              <span>Read More</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          
          <div class="service-card" data-modal="modal5">
            <div class="service-icon">QC</div>
            <h3 class="service-name">Quality Control</h3>
            <p class="service-description">
              Monitoring shipments from origin to destination with proactive problem-solving for unexpected challenges.
            </p>
            <div class="read-more-btn">
              <span>Read More</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          
          <div class="service-card" data-modal="modal6">
            <div class="service-icon">FS</div>
            <h3 class="service-name">Full-Service Import</h3>
            <p class="service-description">
              End-to-end import solutions tailored to your business needs - from sourcing to final delivery at your warehouse.
            </p>
            <div class="read-more-btn">
              <span>Read More</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal Windows с иконками -->
    <div class="modal" id="modal1">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="modal-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 4.26L15.66 4.61L13.84 6.39L14.31 8.93L12 7.84L9.69 8.93L10.16 6.39L8.34 4.61L10.91 4.26L12 2Z" fill="currentColor"/>
            <path d="M20 12L17.74 10.91L17.39 8.34L15.61 10.16L13.07 9.69L14.16 12L13.07 14.31L15.61 13.84L17.39 15.66L17.74 13.09L20 12Z" fill="currentColor"/>
            <path d="M12 22L10.91 19.74L8.34 19.39L10.16 17.61L9.69 15.07L12 16.16L14.31 15.07L13.84 17.61L15.66 19.39L13.09 19.74L12 22Z" fill="currentColor"/>
            <path d="M4 12L6.26 13.09L6.61 15.66L8.39 13.84L10.93 14.31L9.84 12L10.93 9.69L8.39 10.16L6.61 8.34L6.26 10.91L4 12Z" fill="currentColor"/>
          </svg>
        </div>
        <h3>Supplier Sourcing & Verification</h3>
        <p>I conduct comprehensive market research to identify reputable suppliers of nuts, dried fruits, spices, and coffee from key producing regions. Each potential partner undergoes rigorous verification including factory audits, quality certification checks, and reference validation to ensure they meet international standards and your specific requirements.</p>
      </div>
    </div>

    <div class="modal" id="modal2">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="modal-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
          </svg>
        </div>
        <h3>Contract Negotiation & Terms</h3>
        <p>Leveraging my expertise in international trade, I negotiate favorable terms covering pricing, payment conditions, delivery schedules, and quality specifications. I ensure contracts include comprehensive protection clauses for quality assurance, delivery timelines, and dispute resolution while maintaining strong supplier relationships for long-term cooperation.</p>
      </div>
    </div>

    <div class="modal" id="modal3">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="modal-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/>
          </svg>
        </div>
        <h3>Logistics & Supply Chain Management</h3>
        <p>I coordinate with trusted freight forwarders, customs brokers, and transportation providers to design optimal shipping routes. My logistics management includes container booking, route optimization, cost analysis, and coordination between multiple parties to ensure timely and cost-effective delivery from origin to destination port.</p>
      </div>
    </div>

    <div class="modal" id="modal4">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="modal-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor"/>
          </svg>
        </div>
        <h3>International Trade Documentation</h3>
        <p>I manage the complete documentation process including commercial invoices, packing lists, certificates of origin, phytosanitary certificates, and customs declarations. My meticulous approach ensures compliance with both exporting and importing country regulations, preventing delays and additional costs during customs clearance.</p>
      </div>
    </div>

    <div class="modal" id="modal5">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="modal-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" fill="currentColor"/>
          </svg>
        </div>
        <h3>Shipment Monitoring & Quality Assurance</h3>
        <p>I provide continuous tracking and monitoring of shipments from loading to final delivery. This includes regular updates, temperature control verification for sensitive products, and immediate problem-solving for any transit issues. I maintain constant communication with all parties to ensure your goods arrive in perfect condition and on schedule.</p>
      </div>
    </div>

    <div class="modal" id="modal6">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="modal-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/>
          </svg>
        </div>
        <h3>Comprehensive Import Solutions</h3>
        <p>As your dedicated import manager, I provide end-to-end solutions tailored to your specific business needs. From initial market research and supplier identification to final delivery coordination, I handle every aspect of the import process. My goal is to create seamless, efficient supply chains that allow you to focus on growing your business while I manage the complexities of international trade.</p>
      </div>
    </div>

<!-- Секция Portfolio с id -->
<section id="portfolio" class="portfolio-section">
  <div class="portfolio-container">
    <h2 class="portfolio-title">Successful Import Projects</h2>
    
    <!-- Swiper -->
    <div class="swiper mySwiper">
      <div class="swiper-wrapper">
        <!-- Слайд 1 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <img src="/img/img001.jpg" alt="Premium nuts import" class="portfolio-image">
            <div class="portfolio-content">
              <div class="project-badge">Completed</div>
              <h3>Premium Nuts Supply Chain</h3>
              <p>Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
              <div class="project-stats">
                <span>500+ tons</span>
                <span>12 months</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Слайд 2 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <img src="/img/img002.jpg" alt="Dried fruits export" class="portfolio-image">
            <div class="portfolio-content">
              <div class="project-badge">Ongoing</div>
              <h3>Dried Fruits Global Network</h3>
              <p>Apricots, raisins, prunes and dates from Uzbekistan, Turkey and Iran</p>
              <div class="project-stats">
                <span>300+ tons</span>
                <span>8 months</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Слайд 3 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <img src="/img/img003.jpg" alt="Spices import" class="portfolio-image">
            <div class="portfolio-content">
              <div class="project-badge">Completed</div>
              <h3>Spices & Herbs Sourcing</h3>
              <p>Saffron, cinnamon, cardamom and pepper from India, Sri Lanka and Morocco</p>
              <div class="project-stats">
                <span>100+ tons</span>
                <span>6 months</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Слайд 4 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <img src="/img/img004.jpg" alt="Specialty coffee" class="portfolio-image">
            <div class="portfolio-content">
              <div class="project-badge">New Project</div>
              <h3>Specialty Coffee Beans</h3>
              <p>Premium coffee beans from Brazil, Colombia and Ethiopia</p>
              <div class="project-stats">
                <span>50+ tons</span>
                <span>4 months</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Слайд 5 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <img src="/img/img005.jpg" alt="Premium teas" class="portfolio-image">
            <div class="portfolio-content">
              <div class="project-badge">Completed</div>
              <h3>Premium Tea Selection</h3>
              <p>Green, black and herbal teas from China, India and Kenya</p>
              <div class="project-stats">
                <span>80+ tons</span>
                <span>7 months</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Слайд 7 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <img src="/img/img007.jpg" alt="Organic products" class="portfolio-image">
            <div class="portfolio-content">
              <div class="project-badge">Ongoing</div>
              <h3>Organic Certification Project</h3>
              <p>Certified organic nuts and dried fruits from European Union</p>
              <div class="project-stats">
                <span>200+ tons</span>
                <span>10 months</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Слайд 8 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <img src="/img/img008.jpg" alt="Exotic fruits" class="portfolio-image">
            <div class="portfolio-content">
              <div class="project-badge">Completed</div>
              <h3>Tropical Fruits Supply</h3>
              <p>Dried mango, papaya, pineapple from Thailand and Philippines</p>
              <div class="project-stats">
                <span>150+ tons</span>
                <span>5 months</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Слайд 9 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <img src="/img/img009.jpg" alt="Grains import" class="portfolio-image">
            <div class="portfolio-content">
              <div class="project-badge">New Project</div>
              <h3>Healthy Grains Import</h3>
              <p>Quinoa, amaranth, bulgur and other nutritious grains</p>
              <div class="project-stats">
                <span>120+ tons</span>
                <span>3 months</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Слайд 11 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <img src="/img/img011.jpg" alt="Seeds import" class="portfolio-image">
            <div class="portfolio-content">
              <div class="project-badge">Ongoing</div>
              <h3>Seeds & Superfoods</h3>
              <p>Chia seeds, flax seeds, sunflower and pumpkin seeds</p>
              <div class="project-stats">
                <span>90+ tons</span>
                <span>6 months</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Слайд 12 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <img src="/img/img012.jpg" alt="Confectionery ingredients" class="portfolio-image">
            <div class="portfolio-content">
              <div class="project-badge">Completed</div>
              <h3>Confectionery Ingredients</h3>
              <p>Cocoa beans, vanilla, coconut for pastry industry</p>
              <div class="project-stats">
                <span>180+ tons</span>
                <span>9 months</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Пагинация -->
      <div class="swiper-pagination"></div>
      

    </div>
  </div>
</section>

    <!-- Секция Contact с id -->
    <section id="contact" class="contacts-section">
      <div class="contacts-container">
        <h2 class="contacts-title">Get In Touch</h2>
        
        <div class="contacts-content">
          <!-- Левая часть - форма -->
          <div class="contact-form-container">
            <form class="contact-form" id="contact-form">
              <div class="name-fields">
                <div class="form-group">
                  <label for="firstName">First Name</label>
                  <input type="text" id="firstName" name="first_name" placeholder="Enter your first name" required>
                </div>
                <div class="form-group">
                  <label for="lastName">Last Name</label>
                  <input type="text" id="lastName" name="last_name" placeholder="Enter your last name" required>
                </div>
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="user_email" placeholder="Enter your email address" required>
              </div>
              
              <div class="form-group">
                <label for="message">How can we help you?</label>
                <textarea id="message" name="message" placeholder="Enter your message" rows="5" required></textarea>
              </div>
              
              <button type="submit" class="send-message-btn">
                Send Message
              </button>
            </form>
          </div>
          
          <!-- Правая часть - соцсети -->
          <div class="contact-info-container">
            <div class="social-section">
              <div class="social-grid">
                <a href="https://www.facebook.com/parvina.olive.1" class="social-card facebook" target="_blank">
                  <div class="social-icon">
                    <i class="fab fa-facebook-f"></i>
                  </div>
                  <div class="social-text">
                    <span class="social-name">Facebook</span>
                  </div>
                </a>
                
                <a href="https://wa.me/79534107650" class="social-card whatsapp" target="_blank">
                  <div class="social-icon">
                    <i class="fab fa-whatsapp"></i>
                  </div>
                  <div class="social-text">
                    <span class="social-name">WhatsApp</span>
                  </div>
                </a>
                
                <a href="https://mail.google.com/mail/?view=cm&to=pologenkip@gmail.com" class="social-card gmail" target="_blank">
                  <div class="social-icon">
                    <i class="fab fa-google"></i>
                  </div>
                  <div class="social-text">
                    <span class="social-name">Gmail</span>
                  </div>
                </a>
                
                <a href="https://t.me/parvinaolive" class="social-card telegram" target="_blank">
                  <div class="social-icon">
                    <i class="fab fa-telegram"></i>
                  </div>
                  <div class="social-text">
                    <span class="social-name">Telegram</span>
                  </div>
                </a>
                
                <a href="https://web.wechat.com/" class="social-card wechat" target="_blank">
                  <div class="social-icon">
                    <i class="fab fa-weixin"></i>
                  </div>
                  <div class="social-text">
                    <span class="social-name">WeChat</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

`
}