let disposeHeader = () => {};

export function initHeaderMenu() {
  disposeHeader();
  const header = document.querySelector(".pv-site-header");
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navMenu");
  if (!header || !toggle || !nav) return;
  const controller = new AbortController();
  const events = { signal: controller.signal };
  const overlay = document.createElement("div");
  overlay.className = "pv-menu-overlay";
  overlay.hidden = true;
  overlay.setAttribute("aria-hidden", "true");
  document.body.appendChild(overlay);
  function setOpen(open) {
    nav.classList.toggle("active", open);
    toggle.classList.toggle("active", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.innerHTML = `<i class="fa-solid fa-${open ? "xmark" : "bars"}" aria-hidden="true"></i>`;
    overlay.hidden = !open;
    document.body.classList.toggle("pv-menu-open", open);
  }
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("active")), events);
  overlay.addEventListener("click", () => setOpen(false), events);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (nav.classList.contains("active")) { setOpen(false); toggle.focus(); }
    }
  }, events);
  window.addEventListener("resize", () => { if (innerWidth > 1120) setOpen(false); }, { ...events, passive: true });
  document.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || link.matches('[data-contact-open]') || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const id = link.getAttribute("href").slice(1);
    if (!id) return;
    const target = document.getElementById(id === 'contact' ? 'footer' : id);
    if (!target) return;
    event.preventDefault();
    setOpen(false);
    const top = scrollY + target.getBoundingClientRect().top - header.getBoundingClientRect().height - 12;
    window.scrollTo({ top: Math.max(0, top), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, events);
  disposeHeader = () => {
    controller.abort();
    overlay.remove();
    document.body.classList.remove("pv-menu-open");
  };
}
