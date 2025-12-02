export function Content() {
  return `
  
  

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
          
<div class="contact-item email-link" style="cursor: pointer;">
  <div class="contact-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  </div>
  <div class="contact-text">info@pologenki.eu</div>
</div>
          
          <!-- Two phone numbers in one line -->
          <div class="phone-numbers">
            <a href="tel:+79534107650" class="contact-item phone-item">
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div class="contact-text">+7 953 410-76-50</div>
            </a>

            <a href="tel:+37258006670" class="contact-item phone-item">
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div class="contact-text">+372 58006670</div>
            </a>
          </div>
        </div>

        <!-- Social icons -->
        <div class="social-icons-wrapper">
          <div class="social-icons">
            <a href="https://www.facebook.com/parvina.olive.1" class="social-icon facebook" title="Facebook" target="_blank">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="https://t.me/parvinaolive" class="social-icon telegram" title="Telegram" target="_blank">
              <i class="fab fa-telegram"></i>
            </a>
            <a href="https://wa.me/37258006670" class="social-icon whatsapp" title="WhatsApp" target="_blank">
              <i class="fab fa-whatsapp"></i>
            </a>
            <a href="https://web.wechat.com/" class="social-icon wechat" title="WeChat" target="_blank">
              <i class="fab fa-weixin"></i>
            </a>
<div class="social-icon gmail email-link" title="Email" style="cursor: pointer;">
  <i class="fab fa-google"></i>
</div>
          </div>
        </div>
      </div>
      
      <div class="about-image">
        <img src="/photo4.png" alt="Parvina - Import Manager" class="profile-photo">
      </div>
    </div>
  </div>
</section>


<section class="pricing-section" id="products">
    <div class="container">
        <h2 class="section-title">Our Products</h2>
        <!-- Subtitle with update date -->
        <p class="price-update-date">Prices last updated: <span id="current-date"></span></p>
        
        <div class="pricing-grid">
            <!-- Card 1 -->
            <div class="pricing-card" data-modal="modal-cashew">
                <div class="product-image">
                    <img src="/goods/cashew.webp" alt="Cashew Nuts">
                </div>
                <h3>Cashew Nuts</h3>
                <p class="product-desc">AFI standard</p>
                <p class="product-origin">Origin: Vietnam</p>
                <p class="price">7,30 USD/kg</p>
                <a href="#" class="btn-more">Learn More</a>
            </div>

            <!-- Card 2 -->
            <div class="pricing-card" data-modal="modal-walnuts">
                <div class="product-image">
                    <img src="/goods/walnut.jpg" alt="Walnut Kernels">
                </div>
                <h3>Walnut Kernels</h3>
                <p class="product-desc">Extra Light Halves</p>
                <p class="product-origin">Origin: China</p>
                <p class="price">5,45 USD/kg</p>
                <a href="#" class="btn-more">Learn More</a>
            </div>

            <!-- Card 3 -->
            <div class="pricing-card" data-modal="modal-dates">
                <div class="product-image">
                    <img src="/goods/dates.png" alt="Deglet Nour Dates">
                </div>
                <h3>Dried Dates</h3>
                <p class="product-desc">Deglet Nour Dates</p>
                <p class="product-origin">Origin: Tunisia</p>
                <p class="price">1,85 USD/kg</p>
                <a href="#" class="btn-more">Learn More</a>
            </div>

            <!-- Card 4 -->
            <div class="pricing-card" data-modal="modal-papaya">
                <div class="product-image">
                    <img src="/goods/candied.jpg" alt="Dried Papaya Dice">
                </div>
                <h3>Dried Papaya Dice</h3>
                <p class="product-desc">Mixed/Natural 8-10 mm</p>
                <p class="product-origin">Origin: China</p>
                <p class="price">2,10 USD/kg</p>
                <a href="#" class="btn-more">Learn More</a>
            </div>

            <!-- Card 5 -->
            <div class="pricing-card" data-modal="modal-mango">
                <div class="product-image">
                    <img src="/goods/mango.jpg" alt="Dried Mango">
                </div>
                <h3>Dried Mango</h3>
                <p class="product-desc">Sugar added, sugar FREE</p>
                <p class="product-origin">Origin: Vietnam, China</p>
                <p class="price">4,50 USD/kg</p>
                <a href="#" class="btn-more">Learn More</a>
            </div>

            <!-- Card 6 -->
            <div class="pricing-card" data-modal="modal-walnuts-shell">
                <div class="product-image">
                    <img src="/goods/walnut in shell.webp" alt="Walnuts in shell">
                </div>
                <h3>Walnuts in shell</h3>
                <p class="product-desc">All sizes, washed</p>
                <p class="product-origin">Origin: China</p>
                <p class="price">2,20 USD/kg</p>
                <a href="#" class="btn-more">Learn More</a>
            </div>

            <!-- Card 7 -->
            <div class="pricing-card" data-modal="modal-peanuts">
                <div class="product-image">
                    <img src="/goods/redpeanuts.png" alt="Raw Peanuts">
                </div>
                <h3>Raw Peanuts</h3>
                <p class="product-desc">Sizes  40/50, 50/60</p>
                <p class="product-origin">Origin: India</p>
                <p class="price">1,20 USD/kg</p>
                <a href="#" class="btn-more">Learn More</a>
            </div>

            <!-- Card 8 -->
            <div class="pricing-card" data-modal="modal-peanuts-blanched">
                <div class="product-image">
                    <img src="/goods/peanutSplit.jpg" alt="Blanched Peanuts">
                </div>
                <h3>Blanched Peanuts</h3>
                <p class="product-desc">Whole,Splits</p>
                <p class="product-origin">Origin: India</p>
                <p class="price">1,4 USD/kg</p>
                <a href="#" class="btn-more">Learn More</a>
            </div>

            <!-- Card 9 -->
            <div class="pricing-card" data-modal="modal-dried-fruits">
                <div class="product-image">
                    <img src="/goods/driedFruits.webp" alt="Dried Fruits Mix">
                </div>
                <h3>Dried Fruits</h3>
                <p class="product-desc"> Osmotically dehydrated fruits</p>
                <p class="product-origin">Origin: China</p>
                <p class="price">2,90 USD/kg</p>
                <a href="#" class="btn-more">Learn More</a>
            </div>

            <!-- Card 10 -->
            <div class="pricing-card" data-modal="modal-banana-chips">
                <div class="product-image">
                    <img src="/goods/test.jpg" alt="Banana Chips">
                </div>
                <h3>Banana Chips</h3>
                <p class="product-desc">Whole,Halves,Quarters</p>
                <p class="product-origin">Origin: Philipins</p>
                <p class="price">2,80 USD/kg</p>
                <a href="#" class="btn-more">Learn More</a>
            </div>
        </div>
    </div>
</section>

<!-- Modal window for Cashew Nuts -->
<div class="product-modal" id="modal-cashew">
    <div class="modal-content">
        <span class="close-modal"></span>
        <div class="modal-counter">1/10</div>
        <div class="modal-navigation">
            <button class="modal-prev">‹</button>
            <button class="modal-next">›</button>
        </div>
        <div class="modal-header">
            <h3>Cashew Nuts - Premium Quality</h3>
        </div>
        <div class="modal-body">
            <div class="product-types">
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>WW320 - Whole White</h4>
                        <span class="type-price">7,30 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Quality AFI standart. 20/22.68 kg PE vacuum bag/carton packing. FOB HCM</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>WW450 - Whole White</h4>
                        <span class="type-price">7,25 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Quality AFI standart. 20/22.68 kg PE vacuum bag/carton packing. FOB HCM.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>WS - White Split</h4>
                        <span class="type-price">6,20 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Quality AFI standart. 20/22.68 kg PE vacuum bag/carton packing. FOB HCM.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Other grades</h4>
                        <span class="type-price">Price on request</span>
                    </div>
                    <div class="product-description">
                        <p>WW210, WW240, WW320, WW450, WS, LWP, LP, DW and etc.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal window for Walnuts -->
<div class="product-modal" id="modal-walnuts">
    <div class="modal-content">
        <span class="close-modal"></span>
        <div class="modal-counter">2/10</div>
        <div class="modal-navigation">
            <button class="modal-prev">‹</button>
            <button class="modal-next">›</button>
        </div>
        <div class="modal-header">
            <h3>Walnut Kernels</h3>
        </div>
        <div class="modal-body">
            <div class="product-types">
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Xingfu - ELH</h4>
                        <span class="type-price">5,45 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Xingfu type Extra Light Halves 80%, 2025 crop. 10 kg packing. FOB Tianjin port.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Yunnan - ELH</h4>
                        <span class="type-price">5,55 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Yunnan type type Extra Light Halves 80%, 2025 crop. 10 kg packing. FOB Tianjin port.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>185 - ELH</h4>
                        <span class="type-price">5,85 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>185 type type Extra Light Halves 80%, 2025 crop. 10 kg packing. FOB Tianjin port.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Xin2 - ELH</h4>
                        <span class="type-price">6,20 USDkg</span>
                    </div>
                    <div class="product-description">
                        <p>Xin2 type type Extra Light Halves 80%, 2025 crop. 10 kg packing. FOB Tianjin port.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal window for Deglet Nour Dates -->
<div class="product-modal" id="modal-dates">
    <div class="modal-content">
        <span class="close-modal"></span>
        <div class="modal-counter">3/10</div>
        <div class="modal-navigation">
            <button class="modal-prev">‹</button>
            <button class="modal-next">›</button>
        </div>
        <div class="modal-header">
            <h3>Deglet Nour - Tunisian Dates</h3>
        </div>
        <div class="modal-body">
            <div class="product-types">
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Deglet Nour - 5 kg</h4>
                        <span class="type-price">1,85 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Tunisian Dates Deglet Nour packing in 5 kg carton. FOB Tinisian port</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Deglet Nour - 200 gr</h4>
                        <span class="type-price">2,05 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Tunisian Dates Deglet Nour packing in 200 gr tray. FOB Tinisian port</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Deglet Nour - without glucose</h4>
                        <span class="type-price">2,20 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Tunisian Dates Deglet Nour packing in 200 gr tray glucose FREE. FOB Tinisian port.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal window for Dried Papaya Dice -->
<div class="product-modal" id="modal-papaya">
    <div class="modal-content">
        <span class="close-modal"></span>
        <div class="modal-counter">4/10</div>
        <div class="modal-navigation">
            <button class="modal-prev">‹</button>
            <button class="modal-next">›</button>
        </div>
        <div class="modal-header">
            <h3>Dried Papaya Dice</h3>
        </div>
        <div class="modal-body">
            <div class="product-types">
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Mixed Color - 8-10 mm</h4>
                        <span class="type-price">2,10 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Dried Papaya Dice mixed color (Green, Red, Yellow, Orange). Size 8-10 mm. FOB Shantou port.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Natural Color- 8-10 mm</h4>
                        <span class="type-price">2,20 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Dried Papaya Dice Natural color. Size 8-10 mm. FOB Shantou port</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Mixed Color - 3-5 mm</h4>
                        <span class="type-price">2,30 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Dried Papaya Dice mixed color (Green, Red, Yellow, Orange). Size 3-5 mm. FOB Shantou port.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Natural Color- 3-5 mm</h4>
                        <span class="type-price">2,40 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Dried Papaya Dice Natural color. Size 3-5 mm. FOB Shantou port.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal window for Dried Mango -->
<div class="product-modal" id="modal-mango">
    <div class="modal-content">
        <span class="close-modal"></span>
        <div class="modal-counter">5/10</div>
        <div class="modal-navigation">
            <button class="modal-prev">‹</button>
            <button class="modal-next">›</button>
        </div>
        <div class="modal-header">
            <h3>Dried Mango Quality</h3>
        </div>
        <div class="modal-body">
            <div class="product-types">
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Dried Mango - 5 kg</h4>
                        <span class="type-price">4,50 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Delicious, soft-dried mango slices. Lightly sweetened and packaged in 5 kg bulk carton. FOB HCM.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Dried Mango - 500 g</h4>
                        <span class="type-price">5,00 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Delicious soft-dried mango slices, lightly sweetened, in 500g branded bags. FOB HCM.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Dried Mango - 5 kg. Sugar FREE</h4>
                        <span class="type-price">Price on request</span>
                    </div>
                    <div class="product-description">
                        <p>Delicious, soft-dried mango slices. No sugar added and packaged in 5 kg bulk carton. FOB HCM.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Dried Mango - 500 g. Sugar FREE</h4>
                        <span class="type-price">Price on request</span>
                    </div>
                    <div class="product-description">
                        <p>Delicious soft-dried mango slices, no sugar added, in 500g branded bags. FOB HCM.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal window for Walnuts in shell -->
<div class="product-modal" id="modal-walnuts-shell">
    <div class="modal-content">
        <span class="close-modal"></span>
        <div class="modal-counter">6/10</div>
        <div class="modal-navigation">
            <button class="modal-prev">‹</button>
            <button class="modal-next">›</button>
        </div>
        <div class="modal-header">
            <h3>Walnuts in shell</h3>
        </div>
        <div class="modal-body">
            <div class="product-types">
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>33 (Sansan)</h4>
                        <span class="type-price">2,40 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Ideal Walnut (Sansan 33) features a thin, hand-crackable shell and a high yield of sweet, light-colored kernels. </p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>185</h4>
                        <span class="type-price">2,90 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Compared to the 33 variety, the 185 walnut has an even thinner, "paper-shell" that can be crushed between your fingers and an even higher kernel yield of up to 68%. A light-colored, sweet kernel.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Xin 2 (Xinjiang 2)</h4>
                        <span class="type-price">3,30 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>The Xin 2 walnut features an extremely thin shell that can be cracked by hand, yielding up to 67% of a light-colored, sweet kernel with excellent flavor.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Yunnan</h4>
                        <span class="type-price">2,80 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>The Yunnan walnut features a moderately thin shell that typically requires tools to crack, yielding about 50-55% of a kernel known for its rich, robust flavor and deep golden color.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Xinfu / Xinfeng</h4>
                        <span class="type-price">2,50 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Features a thick, hard shell requiring a cracker, with large light-colored sweet kernels and 50-55% kernel yield.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal window for Raw Peanuts -->
<div class="product-modal" id="modal-peanuts">
    <div class="modal-content">
        <span class="close-modal"></span>
        <div class="modal-counter">7/10</div>
        <div class="modal-navigation">
            <button class="modal-prev">‹</button>
            <button class="modal-next">›</button>
        </div>
        <div class="modal-header">
            <h3>Raw Peanuts</h3>
        </div>
        <div class="modal-body">
            <div class="product-types">
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Bold - 40/50</h4>
                        <span class="type-price">2,20 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Indian Bold 40/50 raw peanuts are characterized by their large, uniform kernels, mild flavor, high nutritional value, and versatility for roasting, confectionery, or producing premium peanut butter.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Bold - 50/60</h4>
                        <span class="type-price">2,10 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Indian raw peanuts of the Bold 50/60 variety are characterized by their large, uniform kernels, mild and sweet flavor, high yield, and versatility for roasting, confectionery, and peanut butter production.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>TJ - 40/50</h4>
                        <span class="type-price">2,80 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Indian TJ 40/50 raw peanuts are characterized by their large, uniform kernel size, high oleic content for better shelf life, mild flavor, and excellent suitability for roasting, confectionery, and premium peanut butter.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>TJ - 50/60</h4>
                        <span class="type-price">2,50 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Indian TJ 50/60 raw peanuts are characterized by their large, uniform kernels, high oleic acid content for superior shelf-life, a mild flavor profile, and excellent suitability for roasting, confectionery, and high-quality peanut butter.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal window for Blanched Peanuts -->
<div class="product-modal" id="modal-peanuts-blanched">
    <div class="modal-content">
        <span class="close-modal"></span>
        <div class="modal-counter">8/10</div>
        <div class="modal-navigation">
            <button class="modal-prev">‹</button>
            <button class="modal-next">›</button>
        </div>
        <div class="modal-header">
            <h3>Blanched Peanuts</h3>
        </div>
        <div class="modal-body">
            <div class="product-types">
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Whole-Bold 40/50</h4>
                        <span class="type-price">Price on request</span>
                    </div>
                    <div class="product-description">
                        <p> Large, uniform kernels with mild, sweet flavor and clean nutty aroma. Ideal for premium snacks and confectionery.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Whole-Bold 50/60</h4>
                        <span class="type-price">Price on request</span>
                    </div>
                    <div class="product-description">
                        <p>Medium-large, consistent kernels offering rich taste and roasted fragrance. Perfect for peanut butter and food processing.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Whole-Java 40/50</h4>
                        <span class="type-price">Price on request</span>
                    </div>
                    <div class="product-description">
                        <p>Extra-large selected kernels with delicate flavor and subtle sweet notes. Excellent for chocolate coating and gourmet applications.</p>
                    </div>
                </div>
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Whole-Java 50/60</h4>
                        <span class="type-price">Price on request</span>
                    </div>
                    <div class="product-description">
                        <p>Premium uniform kernels delivering superior blanching quality and well-balanced nutty profile. Optimal for high-end food manufacturing.</p>
                    </div>
                </div>
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Blanched Splits - Bold 40/50</h4>
                        <span class="type-price">Price on request</span>
                    </div>
                    <div class="product-description">
                        <p>Premium, large peanut halves from selected Bold kernels, ideal for crunchy peanut butter and high-quality confectionery where a visible nut piece is desired.</p>
                    </div>
                </div>
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Blanched Splits - Bold 50/60</h4>
                        <span class="type-price">Price on request</span>
                    </div>
                    <div class="product-description">
                        <p> Consistent, medium-large peanut halves offering excellent yield and a rich flavor, perfect for standard food manufacturing, baking, and snacks.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal window for Dried Fruits Mix -->
<div class="product-modal" id="modal-dried-fruits">
    <div class="modal-content">
        <span class="close-modal"></span>
        <div class="modal-counter">9/10</div>
        <div class="modal-navigation">
            <button class="modal-prev">‹</button>
            <button class="modal-next">›</button>
        </div>
        <div class="modal-header">
            <h3>Osmotically Dehydrated Cherry</h3>
        </div>
        <div class="modal-body">
            <div class="product-types">
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Osmotically Dehydrated Cherry</h4>
                        <span class="type-price">Price on request</span>
                    </div>
                    <div class="product-description">
                        <p> Size S
    Chinese osmotically dehydrated sour cherries with 45-55%sugar content. Small, uniform berries with balanced sweet-tart flavor, ideal for baking and confectionery.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Osmotically Dehydrated Strawberry</h4>
                        <span class="type-price">Price on request</span>
                    </div>
                    <div class="product-description">
                        <p>Osmotically dehydrated strawberries from China,45-55% sugar content. Chewy texture with intense berry flavor and natural aroma, perfect for desserts and snacks.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Osmotically Dehydrated Kumquat in Sugar Powder</h4>
                        <span class="type-price">Price on request</span>
                    </div>
                    <div class="product-description">
                        <p>Whole Chinese kumquats with 45-55%sugar content, coated in icing sugar. Characteristic sweet-tangy taste with soft texture, ready for direct consumption.</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Osmotically Dehydrated Kumquat in Sugar</h4>
                        <span class="type-price">Price on request</span>
                    </div>
                    <div class="product-description">
                        <p>Osmotically dehydrated kumquats from China,45-55% sugar content, rolled in crystal sugar. Crispy sugar coating contrasts with soft interior, excellent for decoration</p>
                    </div>
                </div>
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Dried Apple Rings</h4>
                        <span class="type-price">Price on request</span>
                    </div>
                    <div class="product-description">
                        <p>Natural dried apple rings from China with no sugar added.Chewy texture with concentrated apple flavor, perfect for healthy snacks and clean-label products</p>
                    </div>
                </div>
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4> Dried Apple Cubes/Dices</h4>
                        <span class="type-price">Price on request</span>
                    </div>
                    <div class="product-description">
                        <p>Chinese dried apple cubes containing only natural fruit sugars.Uniform pieces with pure apple taste, ideal for baking, cereals and nutritional food applications</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal window for Banana Chips -->
<div class="product-modal" id="modal-banana-chips">
    <div class="modal-content">
        <span class="close-modal"></span>
        <div class="modal-counter">10/10</div>
        <div class="modal-navigation">
            <button class="modal-prev">‹</button>
            <button class="modal-next">›</button>
        </div>
        <div class="modal-header">
            <h3>Banana Chips</h3>
        </div>
        <div class="modal-body">
            <div class="product-types">
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Banana Chips Whole, 6.8kg Carton</h4>
                        <span class="type-price">2,60 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Premium whole banana chips, vacuum-packed in a 6.8kg carton. Features golden color, crispy texture and natural banana flavor - ideal for snacks and food service</p>
                    </div>
                </div>
                
                <div class="product-type clickable-product" data-contact="true">
                    <div class="product-type-header">
                        <h4>Banana Chips Halves/Quarters</h4>
                        <span class="type-price">2,88 USD/kg</span>
                    </div>
                    <div class="product-description">
                        <p>Uniform banana chips in halves and quarters, packed in a 6.8kg carton. Perfect for confectionery, bakery and muesli applications with consistent size and crispy texture</p>
                    </div>
                </div>
              
            </div>
        </div>
    </div>
</div>
    
<!-- Services section with id -->
<section id="services" class="services-section">
  <div class="services-container">
    <h2 class="services-title">Import Management Services</h2>
    <div class="services-grid">
      <div class="service-card" data-service-modal="modal1">
        <div class="service-icon">
          <i class="fas fa-search-dollar"></i>
        </div>
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
      
      <div class="service-card" data-service-modal="modal2">
        <div class="service-icon">
          <i class="fas fa-handshake"></i>
        </div>
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
      
      <div class="service-card" data-service-modal="modal3">
        <div class="service-icon">
          <i class="fas fa-shipping-fast"></i>
        </div>
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
      
      <div class="service-card" data-service-modal="modal4">
        <div class="service-icon">
          <i class="fas fa-file-contract"></i>
        </div>
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
      
      <div class="service-card" data-service-modal="modal5">
        <div class="service-icon">
          <i class="fas fa-clipboard-check"></i>
        </div>
        <h3 class="service-name">Shipment Monitoring</h3>
        <p class="service-description">
         Every shipment is tracked daily — from loading to final delivery. I monitor all logistics stages to ensure deadlines and product safety.
        </p>
        <div class="read-more-btn">
          <span>Read More</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      
      <div class="service-card" data-service-modal="modal6">
        <div class="service-icon">
          <i class="fas fa-tasks"></i>
        </div>
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

<!-- Service Modal Windows -->
<div class="service-modal" id="modal1">
  <div class="service-modal-content">
    <div class="close-service-modal"></div>
    <div class="service-modal-icon">
      <i class="fas fa-search-dollar"></i>
    </div>
    <h3>Supplier Sourcing & Verification</h3>
    <p>I conduct comprehensive market research to identify reputable suppliers of nuts, dried fruits, spices, and coffee from key producing regions. Each potential partner undergoes rigorous verification including factory audits, quality certification checks, and reference validation to ensure they meet international standards and your specific requirements.</p>
  </div>
</div>

<div class="service-modal" id="modal2">
  <div class="service-modal-content">
    <div class="close-service-modal"></div>
    <div class="service-modal-icon">
      <i class="fas fa-handshake"></i>
    </div>
    <h3>Contract Negotiation & Terms</h3>
    <p>Leveraging my expertise in international trade, I negotiate favorable terms covering pricing, payment conditions, delivery schedules, and quality specifications. I ensure contracts include comprehensive protection clauses for quality assurance, delivery timelines, and dispute resolution while maintaining strong supplier relationships for long-term cooperation.</p>
  </div>
</div>

<div class="service-modal" id="modal3">
  <div class="service-modal-content">
    <div class="close-service-modal"></div>
    <div class="service-modal-icon">
      <i class="fas fa-shipping-fast"></i>
    </div>
    <h3>Logistics & Supply Chain Management</h3>
    <p>I coordinate with trusted freight forwarders, customs brokers, and transportation providers to design optimal shipping routes. My logistics management includes container booking, route optimization, cost analysis, and coordination between multiple parties to ensure timely and cost-effective delivery from origin to destination port.</p>
  </div>
</div>

<div class="service-modal" id="modal4">
  <div class="service-modal-content">
    <div class="close-service-modal"></div>
    <div class="service-modal-icon">
      <i class="fas fa-file-contract"></i>
    </div>
    <h3>International Trade Documentation</h3>
    <p>I manage the complete documentation process including commercial invoices, packing lists, certificates of origin, phytosanitary certificates, and customs declarations. My meticulous approach ensures compliance with both exporting and importing country regulations, preventing delays and additional costs during customs clearance.</p>
  </div>
</div>

<div class="service-modal" id="modal5">
  <div class="service-modal-content">
    <div class="close-service-modal"></div>
    <div class="service-modal-icon">
      <i class="fas fa-clipboard-check"></i>
    </div>
    <h3>Shipment Monitoring & Quality Assurance</h3>
    <p>I provide continuous tracking and monitoring of shipments from loading to final delivery. This includes regular updates, temperature control verification for sensitive products, and immediate problem-solving for any transit issues. I maintain constant communication with all parties to ensure your goods arrive in perfect condition and on schedule.</p>
  </div>
</div>

<div class="service-modal" id="modal6">
  <div class="service-modal-content">
    <div class="close-service-modal"></div>
    <div class="service-modal-icon">
      <i class="fas fa-tasks"></i>
    </div>
    <h3>Comprehensive Import Solutions</h3>
    <p>As your dedicated import manager, I provide end-to-end solutions tailored to your specific business needs. From initial market research and supplier identification to final delivery coordination, I handle every aspect of the import process. My goal is to create seamless, efficient supply chains that allow you to focus on growing your business while I manage the complexities of international trade.</p>
  </div>
</div>

<!-- Portfolio section with id -->
<section id="portfolio" class="portfolio-section">
  <div class="portfolio-container">
    <h2 class="portfolio-title">Successful Import Projects</h2>
    
    <!-- Swiper -->
    <div class="swiper portfolio-swiper">
      <div class="swiper-wrapper">
        <!-- Slide 1 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <div class="card-image" data-image-src="/img/img016.jpg" data-image-alt="Premium nuts import">
              <img src="/img/img016.jpg" alt="Premium nuts import" class="portfolio-image">
              <div class="card-overlay">
                <div class="zoom-icon">
                  <i class="fas fa-expand"></i>
                </div>
              </div>
            </div>
            <div class="portfolio-content">
              <h3>Gulfood Dubai 2023</h3>
              <p>Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
              <div class="project-stats">
                <div class="stat">
                  <span class="stat-label">Meeting with a regular supplier of dates from Tunisia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Slide 2 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <div class="card-image" data-image-src="/img/img002.jpg" data-image-alt="Premium nuts import">
              <img src="/img/img002.jpg" alt="Premium nuts import" class="portfolio-image">
              <div class="card-overlay">
                <div class="zoom-icon">
                  <i class="fas fa-expand"></i>
                </div>
              </div>
            </div>
            <div class="portfolio-content">
              <h3>Gulfood Dubai 2023</h3>
              <p>Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
              <div class="project-stats">
                <div class="stat">
                  <span class="stat-label">Discovering reliable suppliers of nuts and dried fruits worldwide.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <!-- Slide 3 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <div class="card-image" data-image-src="/img/img003.jpg" data-image-alt="Premium nuts import">
              <img src="/img/img003.jpg" alt="Premium nuts import" class="portfolio-image">
              <div class="card-overlay">
                <div class="zoom-icon">
                  <i class="fas fa-expand"></i>
                </div>
              </div>
            </div>
            <div class="portfolio-content">
              <h3>Cashew processing and packaging insight, Vietnam</h3>
              <p>Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
              <div class="project-stats">
                <div class="stat">
                  <span class="stat-label">Maintaining reliable partnerships.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Slide 4 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <div class="card-image" data-image-src="/img/img017.jpg" data-image-alt="Premium nuts import">
              <img src="/img/img017.jpg" alt="Premium nuts import" class="portfolio-image">
              <div class="card-overlay">
                <div class="zoom-icon">
                  <i class="fas fa-expand"></i>
                </div>
              </div>
            </div>
            <div class="portfolio-content">
              <h3>Gulfood Dubai 2025</h3>
              <p>Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
              <div class="project-stats">
                <div class="stat">
                  <span class="stat-label">Indian stand</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Slide 5 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <div class="card-image" data-image-src="/img/img005.jpg" data-image-alt="Premium nuts import">
              <img src="/img/img005.jpg" alt="Premium nuts import" class="portfolio-image">
              <div class="card-overlay">
                <div class="zoom-icon">
                  <i class="fas fa-expand"></i>
                </div>
              </div>
            </div>
            <div class="portfolio-content">
              <h3>Meeting with Russian Ambassador.</h3>
              <p>Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
              <div class="project-stats">
                <div class="stat">
                  <span class="stat-label">Strengthening trade relations.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Slide 6 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <div class="card-image" data-image-src="/img/img007.jpg" data-image-alt="Premium nuts import">
              <img src="/img/img007.jpg" alt="Premium nuts import" class="portfolio-image">
              <div class="card-overlay">
                <div class="zoom-icon">
                  <i class="fas fa-expand"></i>
                </div>
              </div>
            </div>
            <div class="portfolio-content">
              <h3>Gulfood Dubai 2022</h3>
              <p>Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
              <div class="project-stats">
                <div class="stat">
                  <span class="stat-label">Connecting with international nut suppliers for long-term partnerships.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Slide 7 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <div class="card-image" data-image-src="/img/img008.jpg" data-image-alt="Premium nuts import">
              <img src="/img/img008.jpg" alt="Premium nuts import" class="portfolio-image">
              <div class="card-overlay">
                <div class="zoom-icon">
                  <i class="fas fa-expand"></i>
                </div>
              </div>
            </div>
            <div class="portfolio-content">
              <h3>Gulfood Dubai 2025</h3>
              <p>Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
              <div class="project-stats">
                <div class="stat">
                  <span class="stat-label">Scouting trusted nut suppliers for global markets.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Slide 8 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <div class="card-image" data-image-src="/img/img013.jpg" data-image-alt="Premium nuts import">
              <img src="/img/img013.jpg" alt="Premium nuts import" class="portfolio-image">
              <div class="card-overlay">
                <div class="zoom-icon">
                  <i class="fas fa-expand"></i>
                </div>
              </div>
            </div>
            <div class="portfolio-content">
              <h3>Anuga Cologne 2025</h3>
              <p>Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
              <div class="project-stats">
                <div class="stat">
                  <span class="stat-label">Exploring international markets for nuts and dried fruits.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
                <!-- Slide 9 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <div class="card-image" data-image-src="/img/img014.jpg" data-image-alt="Premium nuts import">
              <img src="/img/img014.jpg" alt="Premium nuts import" class="portfolio-image">
              <div class="card-overlay">
                <div class="zoom-icon">
                  <i class="fas fa-expand"></i>
                </div>
              </div>
            </div>
            <div class="portfolio-content">
              <h3>Anuga Cologne 2025</h3>
              <p>Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
              <div class="project-stats">
                <div class="stat">
                  <span class="stat-label">Exploring international markets for nuts and dried fruits.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
                        <!-- Slide 10 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <div class="card-image" data-image-src="/img/img012.jpg" data-image-alt="Premium nuts import">
              <img src="/img/img012.jpg" alt="Premium nuts import" class="portfolio-image">
              <div class="card-overlay">
                <div class="zoom-icon">
                  <i class="fas fa-expand"></i>
                </div>
              </div>
            </div>
            <div class="portfolio-content">
              <h3>Meeting another cashew supplier and investors</h3>
              <p>Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
              <div class="project-stats">
                <div class="stat">
                  <span class="stat-label">Securing supply chain connections.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
                              <!-- Slide 10 -->
        <div class="swiper-slide">
          <div class="portfolio-card">
            <div class="card-image" data-image-src="/img/img019.jpg" data-image-alt="Premium nuts import">
              <img src="/img/img019.jpg" alt="Premium nuts import" class="portfolio-image">
              <div class="card-overlay">
                <div class="zoom-icon">
                  <i class="fas fa-expand"></i>
                </div>
              </div>
            </div>
            <div class="portfolio-content">
              <h3>Gulfood Dubai 2025</h3>
              <p>Almonds, walnuts and cashews from USA, Turkey and Vietnam</p>
              <div class="project-stats">
                <div class="stat">
                  <span class="stat-label">Life is buzzing here — ideas are born and deals are made! A true celebration of flavors and opportunities.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      
      
      <!-- Navigation -->
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
      
      <!-- Pagination -->
      <div class="swiper-pagination"></div>
    </div>
  </div>
</section>

<!-- Gallery modal window -->
<div class="gallery-modal" id="galleryModal">
  <div class="gallery-modal-content">
    <div class="close-gallery-modal">
      <i class="fas fa-times"></i>
    </div>
    
    <div class="gallery-image-container">
      <img src="" alt="" class="gallery-image" id="galleryImage">
      
      <!-- Navigation -->
      <button class="gallery-nav gallery-prev">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="gallery-nav gallery-next">
        <i class="fas fa-chevron-right"></i>
      </button>
      
      <!-- Counter -->
      <div class="gallery-counter">
        <span id="currentImage">1</span> / <span id="totalImages">10</span>
      </div>
      
      <!-- Description -->
      <div class="image-caption">
        <h3 id="imageTitle">Project Title</h3>
        <p id="imageDescription">Project description</p>
      </div>
    </div>
  </div>
</div>

    <!-- Contact section with id -->
    <section id="contact" class="contacts-section">
      <div class="contacts-container">
        <h2 class="contacts-title">Get In Touch</h2>
        
        <div class="contacts-content">
          <!-- Left part - form -->
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
          
          <!-- Right part - social media -->
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
                
                <a href="https://wa.me/37258006670" class="social-card whatsapp" target="_blank">
                  <div class="social-icon">
                    <i class="fab fa-whatsapp"></i>
                  </div>
                  <div class="social-text">
                    <span class="social-name">WhatsApp</span>
                  </div>
                </a>
                
                <a href="https://mail.google.com/mail/?view=cm&to=info@pologenki.eu" class="social-card gmail" target="_blank">
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
                
                <a href="https://web.wechat.com/" class="social-card whatsapp" target="_blank">
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

        <!-- Scroll to top arrow -->
    <div class="scroll-to-top" id="scrollToTop">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </div>

        <!-- Partners slider section 
    <section class="partners-section">
      <div class="slider">
        <div class="slide-track">
          <div class="slide">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/1.png" height="100" width="250" alt="" />
          </div>
          <div class="slide">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/2.png" height="100" width="250" alt="" />
          </div>
          <div class="slide">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/3.png" height="100" width="250" alt="" />
          </div>
          <div class="slide">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/4.png" height="100" width="250" alt="" />
          </div>
          <div class="slide">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/5.png" height="100" width="250" alt="" />
          </div>
          <div class="slide">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png" height="100" width="250" alt="" />
          </div>
          <div class="slide">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/7.png" height="100" width="250" alt="" />
          </div>
          <div class="slide">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/1.png" height="100" width="250" alt="" />
          </div>
          <div class="slide">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/2.png" height="100" width="250" alt="" />
          </div>
          <div class="slide">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/3.png" height="100" width="250" alt="" />
          </div>
          <div class="slide">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/4.png" height="100" width="250" alt="" />
          </div>
          <div class="slide">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/5.png" height="100" width="250" alt="" />
          </div>
          <div class="slide">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png" height="100" width="250" alt="" />
          </div>
          <div class="slide">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/7.png" height="100" width="250" alt="" />
          </div>
        </div>
      </div>
    </section>
-->
`
}