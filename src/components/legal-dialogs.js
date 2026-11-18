import { preventBodyScroll, allowBodyScroll } from '../utils/scroll-lock.js';

let disposeLegalDialogs = () => {};

// Footer documents own their focus and scroll lifecycle.
export function initLegalDialogs() {
  disposeLegalDialogs();
  const controller = new AbortController();
  const events = { signal: controller.signal };
  let active = null;
  let trigger = null;
  function close(restoreFocus = true) {
    if (!active) return;
    active.style.display = "none";
    active = null;
    allowBodyScroll();
    if (restoreFocus && trigger?.isConnected) trigger.focus({ preventScroll: true });
  }
  for (const [linkId, modalId] of [["privacy-policy-link", "privacyModal"], ["terms-of-service-link", "termsModal"]]) {
    const link = document.getElementById(linkId);
    const modal = document.getElementById(modalId);
    if (!link || !modal) continue;
    link.addEventListener("click", event => {
      event.preventDefault();
      if (active) close(false);
      trigger = link;
      active = modal;
      modal.style.display = "flex";
      modal.querySelector('.pf-document-body').scrollTop = 0;
      preventBodyScroll();
      modal.querySelector('.pf-document-close').focus({ preventScroll: true });
    }, events);
    modal.querySelectorAll('[data-pf-document-close]').forEach(button => button.addEventListener("click", () => close(), events));
    modal.addEventListener("click", event => { if (event.target === modal) close(); }, events);
  }
  document.addEventListener("keydown", event => {
    if (!active || document.querySelector('#contactModal[open]')) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === "Tab") {
      const controls = [...active.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')].filter(control => control.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (!active.contains(document.activeElement)) { event.preventDefault(); (event.shiftKey ? last : first)?.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  }, { ...events, capture: true });
  disposeLegalDialogs = () => { close(false); controller.abort(); };
}
