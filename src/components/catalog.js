import { responsiveImagePath, responsiveImageSrcset } from "../utils/responsiveImage.js";

const copy = {
  ru: {
    title: "Каталог", subtitle: "Продукты для<br>оптового импорта", nuts: "Орехи", dried: "Сухофрукты", snacks: "Фруктовые снеки", all: "Все товары",
    view: "Смотреть товары", open: "Открыть каталог", featured: "Товары из каталога", origin: "Происхождение", price: "Цена в каталоге", specifications: "Сорта и спецификации",
    request: "Запросить условия поставки", message: "Здравствуйте! Меня интересует", onRequest: "По запросу", close: "Закрыть каталог", back: "Назад к категории", previous: "Предыдущие товары", next: "Следующие товары", pause: "Остановить прокрутку", play: "Включить прокрутку", empty: "В этой категории пока нет товаров.",
    names: { cashew: "Кешью", "walnuts-shell": "Орехи в скорлупе", "peanuts-blanched": "Арахис бланшированный", papaya: "Папайя" },
    search: "Поиск товаров", searchPlaceholder: "Найти товар…", searchResults: "Результаты поиска", searchClear: "Очистить поиск", searchNone: "Ничего не найдено", searchTry: "Попробуйте другое название, сорт или страну.",
    count(n) { const a = n % 10, b = n % 100; return `${n} ${a === 1 && b !== 11 ? "товар" : a >= 2 && a <= 4 && (b < 12 || b > 14) ? "товара" : "товаров"}`; },
  },
  en: {
    title: "Catalogue", subtitle: "Products for<br>wholesale import", nuts: "Nuts", dried: "Dried fruits", snacks: "Fruit snacks", all: "All products",
    view: "View products", open: "Open catalogue", featured: "From the catalogue", origin: "Origin", price: "Catalogue price", specifications: "Grades and specifications",
    request: "Request delivery terms", message: "Hello! I am interested in", onRequest: "On request", close: "Close catalogue", back: "Back to category", previous: "Previous products", next: "Next products", pause: "Pause carousel", play: "Play carousel", empty: "No products in this category yet.", names: {}, count: n => `${n} ${n === 1 ? "product" : "products"}`,
    search: "Search products", searchPlaceholder: "Find a product…", searchResults: "Search results", searchClear: "Clear search", searchNone: "No products found", searchTry: "Try another name, grade or country.",
  },
  cn: {
    title: "产品目录", subtitle: "批量进口<br>产品精选", nuts: "坚果", dried: "干果", snacks: "水果零食", all: "全部产品",
    view: "查看产品", open: "打开目录", featured: "目录精选", origin: "产地", price: "目录价格", specifications: "等级与规格",
    request: "咨询交货条件", message: "您好！我对以下产品感兴趣：", onRequest: "价格面议", close: "关闭目录", back: "返回分类", previous: "上一组产品", next: "下一组产品", pause: "暂停轮播", play: "播放轮播", empty: "此分类暂无产品。", names: {}, count: n => `${n} 款产品`,
    search: "搜索产品", searchPlaceholder: "查找产品…", searchResults: "搜索结果", searchClear: "清除搜索", searchNone: "未找到产品", searchTry: "请尝试其他名称、等级或国家。",
  },
};

const cnNames = { cashew: "腰果", walnuts: "核桃仁", dates: "椰枣干", papaya: "木瓜干丁", mango: "芒果干", "walnuts-shell": "带壳核桃", peanuts: "生花生", "peanuts-blanched": "脱皮花生", "dried-fruits": "果干", "banana-chips": "香蕉片" };
const cnOrigins = { Vietnam: "越南", China: "中国", Tunisia: "突尼斯", India: "印度", Philippines: "菲律宾", "Vietnam, China": "越南、中国" };
const groups = [
  { id: "nuts", products: ["cashew", "walnuts", "walnuts-shell", "peanuts", "peanuts-blanched"], images: ["walnuts", "walnuts-shell", "cashew"] },
  { id: "dried", products: ["dates", "papaya", "mango", "dried-fruits"], images: ["dates", "mango"] },
  { id: "snacks", products: ["banana-chips"], images: ["banana-chips"] },
  { id: "all", products: null, images: ["papaya", "dried-fruits", "peanuts"] },
];

function esc(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function text(product, field, lang) {
  if (lang === "cn") return product[`${field}_cn`] || (field === "name" ? cnNames[product.id] : field === "origin" ? cnOrigins[product.origin] : "") || product[field] || "";
  return product[`${field}_${lang}`] || product[field] || "";
}

function productName(product, lang) {
  return copy[lang].names[product.id] || text(product, "name", lang);
}

function price(value, lang) {
  if (!value || /request/i.test(value)) return copy[lang].onRequest;
  const formatted = String(value).replace(/\s*USD\s*\/\s*kg/i, lang === "cn" ? " $/公斤" : lang === "ru" ? " $/кг" : " $/kg");
  return lang === "ru" ? formatted.replace(/(\d)\.(\d)/g, "$1,$2") : formatted;
}

function corners() {
  return '<span class="catalog-corners" aria-hidden="true"><span></span><span></span><span></span><span></span></span>';
}

function bowl(product, className = "", eager = false) {
  if (!product) return "";
  const image = `/catalog/products/${encodeURIComponent(product.id)}`;
  const hasCutout = groups.some(group => group.products?.includes(product.id));
  const src = hasCutout ? `${image}-480.webp` : responsiveImagePath(product.image, 480);
  const srcset = hasCutout ? `${image}-240.webp 240w, ${image}-480.webp 480w, ${image}-960.webp 960w` : responsiveImageSrcset(product.image, [240, 480]);
  return `<span class="catalog-bowl catalog-bowl--${esc(product.id)} ${className}"><img src="${src}" srcset="${srcset}" sizes="(max-width: 600px) 60vw, (max-width: 1100px) 40vw, 440px" alt="" width="960" height="960" loading="${eager ? "eager" : "lazy"}" decoding="async"></span>`;
}

function categoryProducts(products, id) {
  const group = groups.find(item => item.id === id) || groups[3];
  return group.products ? products.filter(product => group.products.includes(product.id)) : products;
}

function card(product, lang, featured = false, order = 0) {
  const prefix = lang === "ru" ? "/ru" : lang === "cn" ? "/zh-cn" : "";
  const name = productName(product, lang);
  return `<a class="catalog-tile catalog-product${featured ? " catalog-product--lead" : ""}" href="${prefix}/products/${encodeURIComponent(product.id)}/" data-catalog-product="${esc(product.id)}" style="--catalog-item-order:${order}">
    ${corners()}<div class="catalog-product-copy"><span class="catalog-product-origin">${esc(text(product, "origin", lang))}</span>
    <i class="fa-solid fa-arrow-right catalog-arrow" aria-hidden="true"></i>
    <h3 class="catalog-product-name">${esc(name)}</h3></div>
    ${bowl(product)}<span class="catalog-product-price">${esc(price(product.mainPrice, lang))}</span>
  </a>`;
}

export function renderCatalog(products, lang) {
  lang = copy[lang] ? lang : "en";
  const c = copy[lang];
  const tiles = groups.map((group, index) => {
    const items = categoryProducts(products, group.id);
    const images = group.images.map(id => products.find(product => product.id === id)).filter(Boolean);
    return `<button type="button" class="catalog-tile catalog-category catalog-category--${group.id}" data-catalog-category="${group.id}" aria-haspopup="dialog">
      ${corners()}<span class="catalog-category-count">${String(index + 1).padStart(2, "0")} / ${esc(c.count(items.length))}</span>
      <i class="fa-solid fa-arrow-right catalog-arrow" aria-hidden="true"></i>
      <h3 class="catalog-category-name">${esc(c[group.id])}</h3>
      <span class="catalog-category-images" aria-hidden="true">${images.map((product, i) => bowl(product, `catalog-bowl-layer-${i + 1}`)).join("")}</span>
      <span class="catalog-category-link">${group.id === "all" ? c.open : c.view}</span>
    </button>`;
  }).join("");
  const featuredOrder = ["papaya", "dried-fruits", "banana-chips", "cashew"];
  const ordered = [...featuredOrder.map(id => products.find(product => product.id === id)).filter(Boolean), ...products.filter(product => !featuredOrder.includes(product.id))];
  return `<section class="pricing-section catalog-section" id="products" aria-labelledby="catalog-title">
    <div class="catalog-container">
      <div class="catalog-heading"><h2 id="catalog-title">${c.title}</h2>
        <form class="catalog-search" role="search" autocomplete="off">
          <label class="catalog-search-sr-only" for="catalog-search-input">${c.search}</label>
          <div class="catalog-search-field"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input id="catalog-search-input" type="search" placeholder="${c.searchPlaceholder}" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="catalog-search-results" aria-describedby="catalog-search-status" spellcheck="false" maxlength="120">
            <button class="catalog-search-clear" type="button" aria-label="${c.searchClear}" hidden><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
            <button class="catalog-search-submit" type="submit" aria-label="${c.search}"><i class="fa-solid fa-arrow-right-long" aria-hidden="true"></i></button>
          </div>
          <div class="catalog-search-panel" hidden><div class="catalog-search-summary"><span>${c.searchResults}</span><span data-search-count></span></div>
            <ul id="catalog-search-results" role="listbox" aria-label="${c.searchResults}"></ul>
            <div class="catalog-search-empty" hidden><strong>${c.searchNone}</strong><p>${c.searchTry}</p></div>
          </div><span id="catalog-search-status" class="catalog-search-sr-only" role="status" aria-live="polite" aria-atomic="true"></span>
        </form><p>${c.subtitle}</p></div>
      <div class="catalog-categories">${tiles}</div>
      <div class="catalog-featured-heading"><h3>${c.featured}</h3><div class="catalog-carousel-controls">
        <button type="button" data-catalog-prev aria-label="${c.previous}"><i class="fa-solid fa-arrow-left-long" aria-hidden="true"></i></button>
        <button type="button" data-catalog-pause aria-label="${c.pause}" aria-pressed="false"><i class="fa-solid fa-pause" aria-hidden="true"></i></button>
        <button type="button" data-catalog-next aria-label="${c.next}"><i class="fa-solid fa-arrow-right-long" aria-hidden="true"></i></button>
      </div></div>
      <div class="catalog-carousel" aria-label="${esc(c.featured)}">${ordered.map(product => card(product, lang)).join("")}</div>
    </div>
    <dialog class="catalog-dialog" aria-labelledby="catalog-dialog-title">
      <button type="button" class="catalog-dialog-close" aria-label="${c.close}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      <div class="catalog-dialog-body"></div>
    </dialog>
  </section>`;
}

let disposeCatalog = () => {};

export function initCatalog(products, lang) {
  disposeCatalog();
  lang = copy[lang] ? lang : "en";
  const c = copy[lang];
  const section = document.getElementById("products");
  const dialog = section?.querySelector(".catalog-dialog");
  if (!dialog) return;
  const body = dialog.querySelector(".catalog-dialog-body");
  const carousel = section.querySelector(".catalog-carousel");
  const pauseButton = section.querySelector("[data-catalog-pause]");
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const searchForm = section.querySelector(".catalog-search");
  const searchInput = searchForm.querySelector("input");
  const searchPanel = searchForm.querySelector(".catalog-search-panel");
  const searchResults = searchForm.querySelector("[role=listbox]");
  const clearSearchButton = searchForm.querySelector(".catalog-search-clear");
  const searchStatus = searchForm.querySelector("[role=status]");
  const normalizeSearch = value => String(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ё/g, "е").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const searchIndex = products.map(product => {
    const categories = groups.filter(group => group.products?.includes(product.id));
    const labels = ["ru", "en", "cn"].flatMap(locale => [productName(product, locale), text(product, "name", locale), text(product, "origin", locale), text(product, "desc", locale), ...categories.map(group => copy[locale][group.id])]);
    const variants = (product.variants || []).flatMap(variant => [variant.name, variant.name_ru, variant.name_cn]);
    return { product, name: normalizeSearch(productName(product, lang)), terms: normalizeSearch([product.id, ...labels, ...variants].filter(Boolean).join(" ")) };
  });
  let searchMatches = [];
  let activeSearchIndex = -1;
  const fitViewport = () => section.style.setProperty("--catalog-viewport-width", `${document.documentElement.clientWidth}px`);
  fitViewport();
  window.addEventListener("resize", fitViewport, options);
  if (location.hash === "#products") {
    document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (controller.signal.aborted || location.hash !== "#products") return;
      const headerHeight = document.querySelector(".pv-site-header")?.offsetHeight || 0;
      window.scrollTo({ top: section.getBoundingClientRect().top + scrollY - headerHeight - 12, behavior: "instant" });
    })));
  }
  let currentCategory = "all";
  let categoryScroll = 0;
  let trigger = null;
  let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hovered = false;
  let timer;

  function closeSearch() {
    searchPanel.hidden = true;
    searchInput.setAttribute("aria-expanded", "false");
    searchInput.removeAttribute("aria-activedescendant");
    activeSearchIndex = -1;
  }

  function fitSearchResults() {
    if (searchPanel.hidden) return;
    const viewport = window.visualViewport;
    const bottom = (viewport?.offsetTop || 0) + (viewport?.height || innerHeight);
    const available = bottom - searchForm.getBoundingClientRect().bottom - searchForm.querySelector(".catalog-search-summary").offsetHeight - 28;
    searchResults.style.maxHeight = `${Math.max(96, Math.min(390, available))}px`;
  }
  window.addEventListener("scroll", fitSearchResults, { ...options, passive: true });
  window.addEventListener("resize", fitSearchResults, options);
  window.visualViewport?.addEventListener("resize", fitSearchResults, options);
  window.visualViewport?.addEventListener("scroll", fitSearchResults, options);

  function updateSearch() {
    const query = normalizeSearch(searchInput.value);
    clearSearchButton.hidden = !searchInput.value;
    activeSearchIndex = -1;
    searchInput.removeAttribute("aria-activedescendant");
    if (!query) {
      searchMatches = [];
      searchResults.innerHTML = "";
      searchStatus.textContent = "";
      closeSearch();
      return;
    }
    const words = query.split(" ");
    searchMatches = searchIndex.filter(entry => words.every(word => entry.terms.includes(word)))
      .map(entry => ({ ...entry, score: entry.name === query ? 0 : entry.name.startsWith(query) ? 1 : entry.name.includes(query) ? 2 : 3 }))
      .sort((a, b) => a.score - b.score).map(entry => entry.product);
    searchResults.innerHTML = searchMatches.map((product, index) => {
      const hasCutout = groups.some(group => group.products?.includes(product.id));
      const image = hasCutout ? `/catalog/products/${encodeURIComponent(product.id)}-240.webp` : responsiveImagePath(product.image, 240);
      return `<li class="catalog-search-result" id="catalog-search-option-${index}" role="option" aria-selected="false" data-catalog-product="${esc(product.id)}">
        <img src="${esc(image)}" width="48" height="48" alt=""><span class="catalog-search-result-copy"><strong>${esc(productName(product, lang))}</strong><span>${esc(text(product, "origin", lang))}</span></span><span class="catalog-search-price">${esc(price(product.mainPrice, lang))}</span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </li>`;
    }).join("");
    searchForm.querySelector("[data-search-count]").textContent = c.count(searchMatches.length);
    searchForm.querySelector(".catalog-search-empty").hidden = searchMatches.length > 0;
    searchStatus.textContent = searchMatches.length ? `${c.searchResults}: ${c.count(searchMatches.length)}` : c.searchNone;
    searchResults.scrollTop = 0;
    searchPanel.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
    fitSearchResults();
  }

  function activateSearchResult(index) {
    if (!searchMatches.length) return;
    activeSearchIndex = (index + searchMatches.length) % searchMatches.length;
    [...searchResults.children].forEach((item, i) => item.setAttribute("aria-selected", String(i === activeSearchIndex)));
    const selected = searchResults.children[activeSearchIndex];
    searchInput.setAttribute("aria-activedescendant", selected.id);
    const bounds = selected.getBoundingClientRect();
    const container = searchResults.getBoundingClientRect();
    if (bounds.bottom > container.bottom) searchResults.scrollTop += bounds.bottom - container.bottom;
    else if (bounds.top < container.top) searchResults.scrollTop -= container.top - bounds.top;
  }

  searchInput.addEventListener("input", event => { if (!event.isComposing) updateSearch(); }, options);
  searchInput.addEventListener("compositionend", updateSearch, options);
  searchInput.addEventListener("focus", () => { if (searchInput.value.trim()) updateSearch(); }, options);
  searchInput.addEventListener("click", () => { if (searchPanel.hidden && searchInput.value.trim()) updateSearch(); }, options);
  searchInput.addEventListener("keydown", event => {
    if (event.isComposing) return;
    if (event.key === "Enter") { event.preventDefault(); searchForm.requestSubmit(); }
    if (event.key === "Escape" && !searchPanel.hidden) { event.preventDefault(); event.stopPropagation(); closeSearch(); }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (searchPanel.hidden) updateSearch();
      activateSearchResult(activeSearchIndex < 0 ? event.key === "ArrowDown" ? 0 : searchMatches.length - 1 : activeSearchIndex + (event.key === "ArrowDown" ? 1 : -1));
    }
  }, options);
  searchResults.addEventListener("pointerdown", event => { if (event.target.closest("[role=option]")) event.preventDefault(); }, options);
  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    if (searchPanel.hidden) updateSearch();
    const product = searchMatches[activeSearchIndex < 0 ? 0 : activeSearchIndex];
    if (product) openProduct(product.id, false);
    else searchInput.focus();
  }, options);
  clearSearchButton.addEventListener("click", () => { searchInput.value = ""; updateSearch(); searchInput.focus(); }, options);
  searchForm.addEventListener("focusout", event => { if (!searchForm.contains(event.relatedTarget)) closeSearch(); }, options);
  document.addEventListener("pointerdown", event => { if (!searchForm.contains(event.target)) closeSearch(); }, options);

  function show() {
    if (!dialog.open) {
      trigger = document.activeElement;
      document.documentElement.classList.add("catalog-is-open");
      dialog.showModal();
    }
    dialog.scrollTop = 0;
  }

  function openCategory(id, restoreScroll = false) {
    closeSearch();
    currentCategory = id;
    const items = categoryProducts(products, id);
    body.dataset.view = "category";
    body.innerHTML = `<div class="catalog-breadcrumb">${c.title} / ${esc(c[id])}</div>
      <div class="catalog-dialog-heading"><h2 id="catalog-dialog-title">${esc(c[id])}</h2><span>${esc(c.count(items.length))}</span></div>
      <div class="catalog-category-grid${id === "all" ? " catalog-category-grid--all" : ""}">${items.length ? items.map((product, index) => card(product, lang, index === 0 && id !== "all", index)).join("") : `<p class="catalog-empty">${c.empty}</p>`}</div>`;
    show();
    if (restoreScroll) dialog.scrollTop = categoryScroll;
    const heading = body.querySelector("#catalog-dialog-title");
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    window.trackSiteEvent?.("view_catalog_category", { category: id });
  }

  function openProduct(id, fromCategory) {
    const product = products.find(item => item.id === id);
    if (!product) return;
    closeSearch();
    if (fromCategory) categoryScroll = dialog.scrollTop;
    else {
      currentCategory = groups.find(group => group.products?.includes(id))?.id || "all";
      categoryScroll = 0;
    }
    const name = productName(product, lang);
    const inquiry = `${c.message} ${text(product, "name", lang)}. ${c.request}.`;
    const variants = (product.variants || []).map((variant, index) => `<article class="catalog-specification" style="--catalog-item-order:${index}"><span class="catalog-spec-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><h3>${esc(text(variant, "name", lang))}</h3><p>${esc(text(variant, "desc", lang))}</p><strong>${esc(price(variant.price, lang))}</strong></article>`).join("");
    body.dataset.view = "product";
    body.innerHTML = `<button type="button" class="catalog-back" data-catalog-back aria-label="${c.back}"><i class="fa-solid fa-arrow-left-long" aria-hidden="true"></i> ${esc(c[currentCategory])}</button>
      <div class="catalog-detail-hero"><div class="catalog-detail-copy"><p class="catalog-detail-origin">${c.origin} · ${esc(text(product, "origin", lang))}</p><h2 id="catalog-dialog-title">${esc(text(product, "name", lang))}</h2><p class="catalog-detail-price"><span>${c.price}</span><strong>${esc(price(product.mainPrice, lang))}</strong></p></div>${bowl(product, "catalog-detail-image", true)}</div>
      <section class="catalog-specifications"><h2>${c.specifications}</h2><div class="catalog-specification-grid">${variants}</div></section>
      <a class="catalog-inquiry" href="mailto:info@pologenki.eu?subject=${encodeURIComponent(text(product, "name", lang))}&body=${encodeURIComponent(inquiry)}" data-contact-open data-contact-message="${esc(inquiry)}" aria-haspopup="dialog" aria-controls="contactModal">${c.request}<i class="fa-solid fa-arrow-right-long" aria-hidden="true"></i></a>`;
    show();
    const heading = body.querySelector("#catalog-dialog-title");
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    window.trackSiteEvent?.("view_product", { product_id: product.id, product_name: name });
  }

  section.addEventListener("click", event => {
    const category = event.target.closest("[data-catalog-category]");
    if (category) openCategory(category.dataset.catalogCategory);
    const product = event.target.closest("[data-catalog-product]");
    if (product && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      openProduct(product.dataset.catalogProduct, !!product.closest("dialog"));
    }
    if (event.target.closest("[data-catalog-back]")) {
      openCategory(currentCategory, true);
      body.querySelector("a")?.focus({ preventScroll: true });
    }
    if (event.target.closest(".catalog-dialog-close")) dialog.close();
  }, options);

  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }, options);
  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("catalog-is-open");
    trigger?.focus({ preventScroll: true });
  }, options);

  function move(direction, automatic = false) {
    const first = carousel.querySelector(".catalog-product");
    if (!first) return;
    const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(carousel).columnGap);
    const max = carousel.scrollWidth - carousel.clientWidth;
    const target = carousel.scrollLeft + direction * step;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    carousel.scrollTo({ left: target > max + 2 ? 0 : target < -2 ? max : target, behavior: reducedMotion || automatic && !document.hasFocus() ? "instant" : "smooth" });
  }

  function updatePause() {
    pauseButton.setAttribute("aria-pressed", String(paused));
    pauseButton.setAttribute("aria-label", paused ? c.play : c.pause);
    pauseButton.innerHTML = `<i class="fa-solid fa-${paused ? "play" : "pause"}" aria-hidden="true"></i>`;
  }

  section.querySelector("[data-catalog-prev]").addEventListener("click", () => move(-1), options);
  section.querySelector("[data-catalog-next]").addEventListener("click", () => move(1), options);
  pauseButton.addEventListener("click", () => { paused = !paused; updatePause(); }, options);
  carousel.addEventListener("pointerenter", () => { hovered = true; }, options);
  carousel.addEventListener("pointerleave", () => { hovered = false; }, options);
  updatePause();
  timer = setInterval(() => {
    const bounds = carousel.getBoundingClientRect();
    if (!paused && !hovered && !document.hidden && !dialog.open && !carousel.contains(document.activeElement) && bounds.top < innerHeight && bounds.bottom > 0) move(1, true);
  }, 6500);
  disposeCatalog = () => {
    clearInterval(timer);
    controller.abort();
    if (dialog.open) dialog.close();
    document.documentElement.classList.remove("catalog-is-open");
  };
}
