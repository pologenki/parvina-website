// Limit below-the-fold downloads to images near the viewport, including dialog content.
export function initDeferredImages(root, signal) {
  const selector = 'img[data-lazy-src]';
  const images = node => [...(node.matches?.(selector) ? [node] : []), ...(node.querySelectorAll?.(selector) || [])];
  const load = image => {
    if (!image.dataset.lazySrc || signal.aborted) return;
    if (image.dataset.lazySrcset) image.srcset = image.dataset.lazySrcset;
    image.src = image.dataset.lazySrc;
    delete image.dataset.lazySrc;
    delete image.dataset.lazySrcset;
  };
  if (!('IntersectionObserver' in window)) { images(root).forEach(load); return; }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      load(entry.target);
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '240px 0px' });
  const observe = node => images(node).forEach(image => observer.observe(image));
  observe(root);
  const changes = new MutationObserver(records => {
    for (const record of records) {
      record.addedNodes.forEach(observe);
      record.removedNodes.forEach(node => images(node).forEach(image => observer.unobserve(image)));
    }
  });
  changes.observe(root, { childList: true, subtree: true });
  signal.addEventListener('abort', () => { observer.disconnect(); changes.disconnect(); }, { once: true });
}
