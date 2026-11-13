// Pointer-driven wordmark and dot field; idle, hidden and reduced-motion states do not run a loop.
export function createFooterMotion(footer, signal, measureViewport) {
  const canvas = footer.querySelector('.pf-dots');
  const context = canvas.getContext('2d');
  const stage = footer.querySelector('.pf-word-stage');
  const word = footer.querySelector('.pf-wordmark');
  const toTop = footer.querySelector('.pf-totop');
  const letters = [...word.children];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  const events = { signal };
  const pointer = { x: -1000, y: -1000, inside: false, word: false };
  let points = [], width = 0, height = 0, viewportWidth = 0, visible = false, frame = 0, previous = 0;
  let lifts = letters.map(() => 0), centers = [], fontSize = 100;
  const enabled = () => !signal.aborted && footer.isConnected && visible && !document.hidden && !reduced.matches && fine.matches;

  function resetLetters() {
    lifts.fill(0);
    letters.forEach(letter => letter.style.removeProperty('transform'));
  }
  function fitWord() {
    if (signal.aborted || !word.isConnected) return;
    resetLetters();
    word.style.fontSize = '100px';
    const measured = letters.reduce((sum, letter) => sum + letter.getBoundingClientRect().width, 0);
    const available = word.clientWidth;
    fontSize = (measured > 0 ? available * 100 / measured : 100) * .5;
    word.style.fontSize = `${fontSize}px`;
    centers = letters.map(letter => letter.offsetLeft + letter.offsetWidth / 2);
  }
  function paintDots() {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'rgba(34,34,34,.14)';
    context.beginPath();
    for (const point of points) { context.moveTo(point.x + .8, point.y); context.arc(point.x, point.y, .8, 0, Math.PI * 2); }
    context.fill();
  }
  function resizeCanvas() {
    const nextWidth = footer.clientWidth, nextHeight = footer.clientHeight;
    if (nextWidth === width && nextHeight === height) return;
    width = nextWidth; height = nextHeight;
    const density = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * density); canvas.height = Math.ceil(height * density);
    context?.setTransform(density, 0, 0, density, 0, 0);
    points = [];
    for (let y = 17; y < height; y += 26) for (let x = 17; x < width; x += 26) points.push({ bx: x, by: y, x, y });
    paintDots();
  }
  function measure() {
    if (signal.aborted || !footer.isConnected) return;
    measureViewport();
    const nextWidth = document.documentElement.clientWidth;
    if (nextWidth !== viewportWidth) { viewportWidth = nextWidth; fitWord(); }
    resizeCanvas();
    syncTopVisibility();
  }
  function syncTopVisibility() {
    const rect = toTop.getBoundingClientRect();
    const headerHeight = document.querySelector('.pv-site-header')?.offsetHeight || 0;
    document.body.classList.toggle('pf-footer-up-visible', visible && rect.top >= headerHeight && rect.bottom <= innerHeight);
  }
  window.addEventListener('scroll', syncTopVisibility, { ...events, passive: true });
  function stop() { if (frame) cancelAnimationFrame(frame); frame = 0; previous = 0; }
  function start() { if (enabled() && !frame) frame = requestAnimationFrame(tick); }
  function tick(time) {
    frame = 0;
    if (!enabled()) { previous = 0; return; }
    const amount = 1 - Math.pow(.8, Math.min(previous ? (time - previous) / 16.667 : 1, 3));
    previous = time;
    const bounds = footer.getBoundingClientRect();
    const localX = pointer.x - bounds.left, localY = pointer.y - bounds.top;
    let moving = false;
    for (const point of points) {
      const dx = point.bx - localX, dy = point.by - localY, distance = Math.hypot(dx, dy);
      const force = pointer.inside ? Math.max(0, 1 - distance / 145) ** 2 * 24 : 0;
      const tx = point.bx + dx / Math.max(distance, 1) * force;
      const ty = point.by + dy / Math.max(distance, 1) * force;
      point.x += (tx - point.x) * amount; point.y += (ty - point.y) * amount;
      if (Math.abs(tx - point.x) + Math.abs(ty - point.y) > .03) moving = true;
    }
    paintDots();
    const wordBounds = word.getBoundingClientRect();
    const peak = Math.min(58, fontSize * .18), radius = fontSize * 1.75 + 100;
    letters.forEach((letter, index) => {
      const dx = pointer.x - wordBounds.left - centers[index];
      const dy = pointer.y - wordBounds.top - wordBounds.height * .5;
      const proximity = pointer.word ? Math.max(0, 1 - Math.hypot(dx, dy) / radius) : 0;
      const target = proximity * proximity * (3 - 2 * proximity) * peak;
      lifts[index] += (target - lifts[index]) * amount;
      if (Math.abs(target - lifts[index]) > .03) moving = true;
      const tilt = (dx > 0 ? -1 : 1) * (lifts[index] / Math.max(peak, 1)) * 3.5;
      if (lifts[index] < .025 && !pointer.word) letter.style.removeProperty('transform');
      else letter.style.transform = `translate3d(0,${-lifts[index]}px,0) rotate(${tilt}deg)`;
    });
    if (moving) start(); else previous = 0;
  }
  footer.addEventListener('pointermove', event => {
    if (!enabled() || event.pointerType === 'touch') return;
    pointer.x = event.clientX; pointer.y = event.clientY; pointer.inside = true;
    pointer.word = Boolean(event.target.closest('.pf-word-stage'));
    start();
  }, { ...events, passive: true });
  footer.addEventListener('pointerleave', () => { pointer.inside = false; pointer.word = false; start(); }, events);
  function syncMotion() {
    if (!enabled()) { stop(); pointer.inside = false; pointer.word = false; resetLetters(); points.forEach(p => { p.x = p.bx; p.y = p.by; }); paintDots(); }
  }
  reduced.addEventListener('change', syncMotion, events);
  fine.addEventListener('change', syncMotion, events);
  document.addEventListener('visibilitychange', syncMotion, events);
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.target === footer) { visible = entry.isIntersecting; syncMotion(); syncTopVisibility(); }
    }
  });
  observer.observe(footer);
  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(footer); resizeObserver.observe(document.documentElement);
  measure();
  document.fonts.ready.then(() => { if (!signal.aborted && footer.isConnected) { fitWord(); resizeCanvas(); } });
  return () => { stop(); observer.disconnect(); resizeObserver.disconnect(); resetLetters(); document.body.classList.remove('pf-footer-up-visible'); };
}
