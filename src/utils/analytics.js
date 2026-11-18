import { getCurrentLanguage } from './i18n.js';

let sectionObserver;

export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, {
    page_language: getCurrentLanguage(),
    ...params,
  });
}

window.trackSiteEvent = trackEvent;

export function initAnalyticsTracking() {
  sectionObserver?.disconnect();
  const sectionMap = [
    ["about", "view_about"],
    ["products", "view_products"],
    ["services", "view_services"],
    ["portfolio", "view_portfolio"],
    ["contact", "view_contact"],
  ];

  const seenSections = new Set();

  if ("IntersectionObserver" in window) {
    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const sectionId = entry.target.id;
          if (seenSections.has(sectionId)) return;
          seenSections.add(sectionId);
          const eventName =
            sectionMap.find(([id]) => id === sectionId)?.[1] || "view_section";
          trackEvent(eventName, { section_id: sectionId });
        });
      },
      { threshold: 0.45 },
    );

    sectionMap.forEach(([sectionId]) => {
      const section = document.getElementById(sectionId);
      if (section) sectionObserver.observe(section);
    });
  }

  if (!window.__pologenkiAnalyticsClickBound) {
    window.__pologenkiAnalyticsClickBound = true;
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a, button, .email-link");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      const label = (link.textContent || link.title || link.getAttribute("aria-label") || "")
        .trim()
        .slice(0, 80);

      if (href.includes("wa.me") || link.classList.contains("whatsapp")) {
        trackEvent("click_whatsapp", { link_text: label, link_url: href });
        return;
      }

      if (href.includes("t.me") || link.classList.contains("telegram")) {
        trackEvent("click_telegram", { link_text: label, link_url: href });
        return;
      }

      if (href.startsWith("mailto:") || link.hasAttribute('data-contact-open') || link.classList.contains("email-link")) {
        trackEvent("click_email", { link_text: label, link_url: href || "email_copy" });
        return;
      }

      if (href.startsWith("tel:")) {
        trackEvent("click_phone", { link_text: label, link_url: href });
        return;
      }

      if (href === "#footer" || link.dataset.modalContact !== undefined || link.dataset.serviceContact !== undefined) {
        trackEvent("click_request_quote", { link_text: label });
      }
    });

    document.addEventListener(
      "submit",
      (event) => {
        if (event.target?.id === "contact-form") {
          trackEvent("submit_contact_form", { form_id: "contact-form" });
        }
      },
      true,
    );
  }
}
