// DOM rectangles use viewport pixels; layout sizes and scrollable elements use
// their own CSS pixels. Keep the two coordinate systems aligned on desktop.
export function getLayoutScale() {
  return Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-scale')) || 1;
}

export function toLayoutPixels(value) {
  return value / getLayoutScale();
}

export function getLayoutViewportWidth() {
  return toLayoutPixels(document.documentElement.clientWidth);
}

export function getHeaderHeight() {
  return document.querySelector('.pv-site-header')?.getBoundingClientRect().height || 0;
}
