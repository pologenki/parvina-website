// Utility for loading CMS data
export async function loadCMSData() {
  try {
    console.log('🔄 Loading products data from /data/products.json...');
    
    // ������� ������ ����
    const paths = [
      '/data/products.json',
      './data/products.json',
      'data/products.json'
    ];
    
    let response;
    let successfulPath = '';
    
    for (const path of paths) {
      try {
        console.log(`Trying path: ${path}`);
        response = await fetch(path);
        if (response.ok) {
          successfulPath = path;
          break;
        }
      } catch (e) {
        console.log(`Failed to load from ${path}:`, e);
        continue;
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`Failed to load products.json from any path. Status: ${response?.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Products data loaded successfully from:', successfulPath);
    return data;
  } catch (error) {
    console.error('❌ Error loading products data:', error);
    
    // Return fallback data
    console.log('🔄 Using fallback products data');
    return getFallbackProducts();
  }
}

function getFallbackProducts() {
  return {
    lastUpdated: new Date().toISOString().split('T')[0],
    products: [
      {
        id: "cashew",
        name: "Cashew Nuts",
        description: "AFI standard",
        origin: "Vietnam",
        price: "7,30 USD/kg",
        image: "/goods/cashew.webp",
        modalId: "modal-cashew",
        varieties: [
          {
            name: "WW320 - Whole White",
            price: "7,30 USD/kg",
            description: "Quality AFI standard. 20/22.68 kg PE vacuum bag/carton packing. FOB HCM"
          }
        ]
      },
      {
        id: "walnuts",
        name: "Walnut Kernels",
        description: "Extra Light Halves",
        origin: "China",
        price: "5,45 USD/kg",
        image: "/goods/walnut.jpg",
        modalId: "modal-walnuts",
        varieties: [
          {
            name: "Xingfu - ELH",
            price: "5,45 USD/kg",
            description: "Xingfu type Extra Light Halves 80%, 2025 crop. 10 kg packing. FOB Tianjin port."
          }
        ]
      },
      {
        id: "dates",
        name: "Dried Dates",
        description: "Deglet Nour Dates",
        origin: "Tunisia",
        price: "1,85 USD/kg",
        image: "/goods/dates.png",
        modalId: "modal-dates",
        varieties: [
          {
            name: "Deglet Nour - 5 kg",
            price: "1,85 USD/kg",
            description: "Tunisian Dates Deglet Nour packing in 5 kg carton. FOB Tunisian port"
          }
        ]
      },
      {
        id: "papaya",
        name: "Dried Papaya Dice",
        description: "Mixed/Natural 8-10 mm",
        origin: "China",
        price: "2,10 USD/kg",
        image: "/goods/candied.jpg",
        modalId: "modal-papaya",
        varieties: [
          {
            name: "Mixed Color - 8-10 mm",
            price: "2,10 USD/kg",
            description: "Dried Papaya Dice mixed color (Green, Red, Yellow, Orange). Size 8-10 mm. FOB Shantou port."
          }
        ]
      },
      {
        id: "mango",
        name: "Dried Mango",
        description: "Sugar added, sugar FREE",
        origin: "Vietnam, China",
        price: "4,50 USD/kg",
        image: "/goods/mango.jpg",
        modalId: "modal-mango",
        varieties: [
          {
            name: "Dried Mango - 5 kg",
            price: "4,50 USD/kg",
            description: "Delicious, soft-dried mango slices. Lightly sweetened and packaged in 5 kg bulk carton. FOB HCM."
          }
        ]
      },
      {
        id: "walnuts-shell",
        name: "Walnuts in shell",
        description: "All sizes, washed",
        origin: "China",
        price: "2,20 USD/kg",
        image: "/goods/walnut in shell.webp",
        modalId: "modal-walnuts-shell",
        varieties: [
          {
            name: "33 (Sansan)",
            price: "2,40 USD/kg",
            description: "Ideal Walnut (Sansan 33) features a thin, hand-crackable shell and a high yield of sweet, light-colored kernels."
          }
        ]
      },
      {
        id: "peanuts",
        name: "Raw Peanuts",
        description: "Sizes 40/50, 50/60",
        origin: "India",
        price: "1,20 USD/kg",
        image: "/goods/redpeanuts.png",
        modalId: "modal-peanuts",
        varieties: [
          {
            name: "Bold - 40/50",
            price: "2,20 USD/kg",
            description: "Indian Bold 40/50 raw peanuts are characterized by their large, uniform kernels, mild flavor, high nutritional value, and versatility for roasting, confectionery, or producing premium peanut butter."
          }
        ]
      },
      {
        id: "peanuts-blanched",
        name: "Blanched Peanuts",
        description: "Whole, Splits",
        origin: "India",
        price: "1,4 USD/kg",
        image: "/goods/peanutSplit.jpg",
        modalId: "modal-peanuts-blanched",
        varieties: [
          {
            name: "Whole-Bold 40/50",
            price: "Price on request",
            description: "Large, uniform kernels with mild, sweet flavor and clean nutty aroma. Ideal for premium snacks and confectionery."
          }
        ]
      },
      {
        id: "dried-fruits",
        name: "Dried Fruits",
        description: "Osmotically dehydrated fruits",
        origin: "China",
        price: "2,90 USD/kg",
        image: "/goods/driedFruits.webp",
        modalId: "modal-dried-fruits",
        varieties: [
          {
            name: "Osmotically Dehydrated Cherry",
            price: "Price on request",
            description: "Size S. Chinese osmotically dehydrated sour cherries with 45-55% sugar content. Small, uniform berries with balanced sweet-tart flavor, ideal for baking and confectionery."
          }
        ]
      },
      {
        id: "banana-chips",
        name: "Banana Chips",
        description: "Whole, Halves, Quarters",
        origin: "Philippines",
        price: "2,80 USD/kg",
        image: "/goods/test.jpg",
        modalId: "modal-banana-chips",
        varieties: [
          {
            name: "Banana Chips Whole, 6.8kg Carton",
            price: "2,60 USD/kg",
            description: "Premium whole banana chips, vacuum-packed in a 6.8kg carton. Features golden color, crispy texture and natural banana flavor - ideal for snacks and food service"
          }
        ]
      }
    ]
  };
}

// Function to render products
export function renderProducts(productsData) {
  const productsContainer = document.getElementById('products-container');
  const modalsContainer = document.getElementById('modals-container');
  
  console.log('🔄 Rendering products...', { 
    productsContainer: !!productsContainer, 
    modalsContainer: !!modalsContainer,
    productsCount: productsData?.products?.length || 0
  });
  
  if (!productsContainer) {
    console.error('❌ Products container not found!');
    return;
  }
  
  if (!modalsContainer) {
    console.error('❌ Modals container not found!');
    return;
  }
  
  // Clear containers
  productsContainer.innerHTML = '';
  modalsContainer.innerHTML = '';
  
  // Check if we have products
  if (!productsData.products || productsData.products.length === 0) {
    console.error('❌ No products data available!');
    productsContainer.innerHTML = `
      <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
        <h3>No products available at the moment.</h3>
        <p>Please check the products.json file.</p>
      </div>
    `;
    return;
  }
  
  console.log(`🔄 Rendering ${productsData.products.length} products...`);
  
  // Render product cards
  productsData.products.forEach((product, index) => {
    console.log(`Rendering product ${index + 1}:`, product.name);
    
    const productCard = `
      <div class="pricing-card" data-modal="${product.modalId}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='/goods/default.jpg'">
        </div>
        <h3>${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <p class="product-origin">Origin: ${product.origin}</p>
        <p class="price">${product.price}</p>
        <a href="#" class="btn-more">Learn More</a>
      </div>
    `;
    productsContainer.innerHTML += productCard;
  });
  
  // Render modals
  productsData.products.forEach((product, index) => {
    console.log(`Rendering modal ${index + 1} for:`, product.name);
    
    if (product.varieties && product.varieties.length > 0) {
      const varietiesHTML = product.varieties.map(variety => `
        <div class="product-type clickable-product" data-contact="true">
          <div class="product-type-header">
            <h4>${variety.name}</h4>
            <span class="type-price">${variety.price}</span>
          </div>
          <div class="product-description">
            <p>${variety.description}</p>
          </div>
        </div>
      `).join('');
      
      const modalHTML = `
        <div class="product-modal" id="${product.modalId}">
          <div class="modal-content">
            <span class="close-modal"></span>
            <div class="modal-header">
              <h3>${product.name} - Premium Quality</h3>
            </div>
            <div class="modal-body">
              <div class="product-types">
                ${varietiesHTML}
              </div>
            </div>
          </div>
        </div>
      `;
      modalsContainer.innerHTML += modalHTML;
    }
  });
  
  // Update date
  const currentDateElement = document.getElementById('current-date');
  if (currentDateElement && productsData.lastUpdated) {
    const date = new Date(productsData.lastUpdated);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    currentDateElement.textContent = date.toLocaleDateString('en-GB', options);
  }
  
  console.log('✅ Products rendered successfully! Total products:', productsData.products.length);
}

// Function to update prices in real-time
export function updateProductPrices(productsData) {
  console.log('🔄 Updating product prices...');
  
  // Update main product cards
  const productCards = document.querySelectorAll('.pricing-card');
  console.log(`Found ${productCards.length} product cards to update`);
  
  productCards.forEach(card => {
    const productName = card.querySelector('h3').textContent;
    const product = productsData.products.find(p => p.name === productName);
    if (product) {
      const priceElement = card.querySelector('.price');
      if (priceElement) {
        priceElement.textContent = product.price;
      }
    }
  });
  
  // Update modal prices
  const modals = document.querySelectorAll('.product-modal');
  modals.forEach(modal => {
    const modalId = modal.id;
    const product = productsData.products.find(p => p.modalId === modalId);
    if (product && product.varieties) {
      const varietyElements = modal.querySelectorAll('.product-type');
      varietyElements.forEach((varietyElement, index) => {
        if (product.varieties[index]) {
          const priceElement = varietyElement.querySelector('.type-price');
          if (priceElement) {
            priceElement.textContent = product.varieties[index].price;
          }
        }
      });
    }
  });
  
  console.log('✅ Prices updated successfully!');
}