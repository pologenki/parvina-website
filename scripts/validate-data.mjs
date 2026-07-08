import fs from "node:fs";

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const errors = [];

function required(value) {
  return String(value || "").trim().length > 0;
}

function isSafeImagePath(value) {
  const path = String(value || "").trim();
  if (!path) return false;
  if (/javascript:/i.test(path)) return false;
  if (path.includes("..")) return false;
  return /^(https?:\/\/|\/?(goods|portfolio|images\/portfolio)\/)/i.test(path);
}

function addError(message) {
  errors.push(message);
}

const productsData = readJson("public/data/products.json");
if (!Array.isArray(productsData.products)) {
  addError("products.json: products must be an array");
} else {
  productsData.products.forEach((product, index) => {
    const label = product.name || product.name_ru || `product #${index + 1}`;
    if (!required(product.id)) addError(`${label}: missing id`);
    if (!required(product.name)) addError(`${label}: missing English name`);
    if (!required(product.name_ru)) addError(`${label}: missing Russian name`);
    if (!required(product.mainPrice)) addError(`${label}: missing mainPrice`);
    if (!isSafeImagePath(product.image)) addError(`${label}: invalid image path`);

    if (!Array.isArray(product.variants) || product.variants.length === 0) {
      addError(`${label}: variants must contain at least one item`);
    } else {
      product.variants.forEach((variant, variantIndex) => {
        const variantLabel = `${label}, variant #${variantIndex + 1}`;
        if (!required(variant.name)) addError(`${variantLabel}: missing English name`);
        if (!required(variant.price)) addError(`${variantLabel}: missing price`);
        if (!required(variant.desc)) addError(`${variantLabel}: missing English description`);
        if (!required(variant.desc_ru)) addError(`${variantLabel}: missing Russian description`);
      });
    }
  });
}

const portfolioData = readJson("public/data/portfolio.json");
if (!Array.isArray(portfolioData.items)) {
  addError("portfolio.json: items must be an array");
} else {
  portfolioData.items.forEach((item, index) => {
    const label = item.title || item.title_ru || `portfolio item #${index + 1}`;
    if (!required(item.title)) addError(`${label}: missing English title`);
    if (!required(item.title_ru)) addError(`${label}: missing Russian title`);
    if (!isSafeImagePath(item.img)) addError(`${label}: invalid image URL`);
  });
}

if (errors.length) {
  console.error("Data validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Data validation passed.");
