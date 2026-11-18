import { offerCopy, variantText, variantPacking, variantDelivery, formatOfferPrice } from '../utils/product-offers.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

export function renderProductSpecifications(product, lang) {
  const c = offerCopy(lang);
  const rows = (product.variants || []).map(variant => ({ variant, packing: variantPacking(variant, lang), delivery: variantDelivery(variant) }));
  const showPacking = rows.some(row => row.packing);
  const showDelivery = rows.some(row => row.delivery);
  return `<div class="product-specifications">
    <table class="product-specification-table" aria-label="${esc(c.grade + ' / ' + c.price)}">
      <thead><tr><th scope="col">${c.grade}</th>${showPacking ? `<th scope="col">${c.packing}</th>` : ''}${showDelivery ? `<th scope="col">${c.delivery}</th>` : ''}<th scope="col" class="product-specification-price">${c.price}</th></tr></thead>
      <tbody>${rows.map(({ variant, packing, delivery }, index) => `<tr id="offer-grade-${index}">
        <th scope="row"><span class="product-specification-name">${esc(variantText(variant, 'name', lang))}</span>${variantText(variant, 'desc', lang) ? `<details class="product-specification-details"><summary>${c.details}</summary><p>${esc(variantText(variant, 'desc', lang))}</p></details>` : ''}</th>
        ${showPacking ? `<td data-label="${c.packing}">${esc(packing || c.unknown)}</td>` : ''}
        ${showDelivery ? `<td data-label="${c.delivery}">${esc(delivery || c.unknown)}</td>` : ''}
        <td class="product-specification-price" data-label="${c.price}"><strong>${esc(formatOfferPrice(variant.price, lang))}</strong></td>
      </tr>`).join('')}</tbody>
    </table>
  </div>`;
}
