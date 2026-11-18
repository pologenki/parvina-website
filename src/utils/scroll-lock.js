// Scroll management for modals
let modalOpenCount = 0;
let savedScrollPosition = 0;

export function preventBodyScroll() {
  modalOpenCount++;
  if (modalOpenCount === 1) {
    // Save current scroll position
    savedScrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;

    // Completely block scrolling with position: fixed
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollPosition}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    // Preserve the scrollbar width to prevent layout shift
    document.body.style.paddingRight =
      window.innerWidth - document.documentElement.clientWidth + "px";
  }
}

export function allowBodyScroll() {
  if (modalOpenCount > 0) {
    modalOpenCount--;
    if (modalOpenCount === 0) {
      // Restore scroll position
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      // Restore scroll position
      window.scrollTo(0, savedScrollPosition);
    }
  }
}
