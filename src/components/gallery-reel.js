// A virtual filmstrip keeps one accessible button per photograph while wrapping
// the strip. The lens projects logical positions into a wider, sharper centre;
// photo heights stay fixed so the filmstrip never bobs vertically as it moves.
export function createGalleryReel({ track, signal, reduced, isPaused, onIndex, onBrowse }) {
  const options = { signal }, mobile = matchMedia('(max-width:767px)');
  let cards = [], bases = [], cycle = 0, width = 0, height = 0, loop = false;
  let position = 0, target = 0, previous = 0, previousTime = 0, speed = 0, frame = 0, active = true;
  let hover = null, hoverWeights = [], lastIndex = -1, snapTimer, writing = false;
  let resumeAt = 0, pointerDown = false, keyboardFocus = false;
  const autoplaySpeed = 42; // Logical pixels per second, independent of refresh rate.
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const blurAt = d => d <= .15 ? 0 : d < .35 ? (d - .15) * 5 : 1 + (d - .35) / .65 * 5;
  const space = () => track.querySelector('.pg-reel');
  const emit = index => { if (index !== lastIndex && index >= 0) { lastIndex = index; onIndex(index); } };
  const canAutoplay = time => active && loop && !mobile.matches && !signal.aborted &&
    !reduced.matches && !isPaused() && !document.hidden && !pointerDown && !keyboardFocus && time >= resumeAt;
  function suspendAutoplay(duration = 3000) {
    resumeAt = performance.now() + duration;
    request();
  }

  function draw(time = performance.now()) {
    frame = 0;
    if (signal.aborted) return;
    const dt = Math.min(40, Math.max(1, time - (previousTime || time - 16))); previousTime = time;
    if (mobile.matches || !cards.length) return;
    const instant = reduced.matches || isPaused();
    const autoplaying = canAutoplay(time);
    if (autoplaying) target += autoplaySpeed * dt / 1000;
    position = instant ? target : position + (target - position) * (1 - Math.exp(-dt / 110));
    if (Math.abs(target - position) < .06) position = target;
    if (loop && (position < cycle * .5 || position > cycle * 1.5)) {
      const shift = position < cycle * .5 ? cycle : -cycle;
      position += shift; target += shift; previous += shift;
    }
    speed += (((position - previous) / dt * 1000) - speed) * .2; previous = position;
    writing = true; track.scrollLeft = position; writing = false;
    const scroll = track.scrollLeft, spread = width * .28;
    const project = x => width / 2 + .75 * x + .25 * spread * Math.tanh(x / spread);
    let closest = 0, closestDistance = Infinity, changingHover = false;
    for (let i = 0; i < cards.length; i++) {
      const base = bases[i];
      const repeat = loop ? Math.round((position + width / 2 - base.center) / cycle) : 0;
      const x = base.center + repeat * cycle - position + (loop ? 0 : (width - cycle) / 2);
      const distance = Math.abs(x - width / 2), d = clamp(distance / (width * .45), 0, 1);
      const left = reduced.matches ? x - base.width / 2 : project(x - width / 2 - base.width / 2);
      const right = reduced.matches ? x + base.width / 2 : project(x - width / 2 + base.width / 2);
      const visible = right > -40 && left < width + 40;
      hoverWeights[i] += ((hover === cards[i] ? 0 : 1) - hoverWeights[i]) * (instant ? 1 : Math.min(1, dt / 90));
      if (Math.abs(hoverWeights[i] - (hover === cards[i] ? 0 : 1)) > .01) changingHover = true;
      const motionBlur = instant ? 0 : Math.min(Math.abs(speed) / 300, 4);
      const blur = reduced.matches ? 0 : (blurAt(d) + motionBlur) * hoverWeights[i];
      const card = cards[i];
      card.style.setProperty('--pg-lens-x', `${(scroll + left).toFixed(2)}px`);
      card.style.setProperty('--pg-lens-width', `${(right - left).toFixed(2)}px`);
      card.style.filter = visible && blur > .02 ? `blur(${blur.toFixed(2)}px)` : 'none';
      card.style.opacity = visible ? String(reduced.matches ? 1 : 1 - .1 * d) : '0';
      card.style.pointerEvents = visible ? '' : 'none';
      if (distance < closestDistance) { closest = i; closestDistance = distance; }
    }
    emit(closest);
    const waitingToResume = loop && !instant && !keyboardFocus && !pointerDown && time < resumeAt;
    if (active && (autoplaying || waitingToResume || Math.abs(target - position) > .06 || Math.abs(speed) > .5 || changingHover)) frame = requestAnimationFrame(draw);
  }
  function request() { if (!frame && active && !signal.aborted) frame = requestAnimationFrame(draw); }

  function refresh(reset = false) {
    if (signal.aborted) return;
    cancelAnimationFrame(frame); frame = 0;
    cards = [...track.querySelectorAll('.pg-card')]; hoverWeights = cards.map(() => 1); hover = null;
    width = track.clientWidth; height = track.clientHeight; lastIndex = -1; clearTimeout(snapTimer);
    if (!space()) return;
    if (mobile.matches) {
      space().style.width = ''; space().style.height = '';
      for (const card of cards) { card.style.removeProperty('--pg-lens-x'); card.style.removeProperty('--pg-lens-width'); card.style.removeProperty('--pg-lens-height'); card.style.filter = ''; card.style.opacity = ''; card.style.pointerEvents = ''; }
      if (reset) track.scrollTop = 0;
      emit(0); onBrowse(cards.length > 1); return;
    }
    let offset = 0;
    const nominal = clamp(width * .157, 184, 252), gap = 16;
    const widths = [.84, 1, .78, 1, .91, .84, 1, .9, .92, .98, .91, .88];
    const levels = [.8, .83, .62, 1, .92, .96, .79, .96, 1, .9, .96, .85];
    bases = cards.map(card => {
      const index = Number(card.dataset.pgIndex), cardWidth = nominal * widths[index % widths.length];
      const base = { center: offset + cardWidth / 2, width: cardWidth, height: (height - 37) * levels[index % levels.length] };
      // Only remeasure height on resize/filter changes, never on animation frames.
      card.style.setProperty('--pg-lens-height', `${base.height.toFixed(2)}px`);
      offset += cardWidth + gap; return base;
    });
    const wasLoop = loop; cycle = offset; loop = cycle > width * 1.12;
    onBrowse(loop);
    space().style.width = `${loop ? cycle * 3 : width}px`; space().style.height = '100%';
    if (reset || wasLoop !== loop || !position) position = target = loop ? cycle : 0;
    else if (!loop) position = target = 0;
    if (reset) resumeAt = performance.now() + 500;
    previous = position; previousTime = 0; speed = 0; draw();
  }
  function center(index, smooth = true) {
    if (!cards.length) return;
    index = (index % cards.length + cards.length) % cards.length;
    if (mobile.matches) { track.scrollTo({ top: cards[index].offsetTop, behavior: smooth && !reduced.matches && !isPaused() ? 'smooth' : 'instant' }); emit(index); return; }
    if (!loop) return;
    suspendAutoplay();
    const base = bases[index], repeat = Math.round((position + width / 2 - base.center) / cycle);
    target = base.center + repeat * cycle - width / 2;
    if (!smooth || reduced.matches || isPaused()) position = target;
    request();
  }
  function settle() { if (loop && !mobile.matches) center(Math.max(0, lastIndex)); }
  function scheduleSnap() { clearTimeout(snapTimer); snapTimer = setTimeout(settle, 450); }
  track.addEventListener('wheel', event => {
    if (mobile.matches || !loop || event.ctrlKey || (!event.shiftKey && Math.abs(event.deltaX) < Math.abs(event.deltaY) && !event.target.closest('.pg-card'))) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!delta) return; event.preventDefault();
    suspendAutoplay();
    target += clamp(delta * (event.deltaMode === 1 ? 18 : 1.1), -width, width); request(); scheduleSnap();
  }, { signal, passive: false });
  track.addEventListener('scroll', () => {
    if (writing) return;
    if (mobile.matches) { const closest = cards.reduce((best, c, i) => Math.abs(c.offsetTop - track.scrollTop) < Math.abs(cards[best].offsetTop - track.scrollTop) ? i : best, 0); emit(closest); return; }
    if (Math.abs(track.scrollLeft - position) > 2) { suspendAutoplay(); target = position = track.scrollLeft; request(); }
  }, { signal, passive: true });
  track.addEventListener('pointerover', event => { const next = event.target.closest('.pg-card'); if (hover !== next) { hover = next; request(); } }, options);
  track.addEventListener('pointerleave', () => { hover = null; request(); }, options);
  track.addEventListener('pointermove', event => {
    if (event.pointerType === 'mouse' && (event.movementX || event.movementY)) suspendAutoplay(1200);
  }, options);
  track.addEventListener('pointerdown', () => { pointerDown = true; suspendAutoplay(); }, options);
  const releasePointer = () => { if (!pointerDown) return; pointerDown = false; suspendAutoplay(); };
  window.addEventListener('pointerup', releasePointer, options);
  window.addEventListener('pointercancel', releasePointer, options);
  track.addEventListener('keydown', () => { keyboardFocus = true; suspendAutoplay(); }, options);
  track.addEventListener('focusin', event => {
    keyboardFocus = event.target.matches(':focus-visible');
    if (keyboardFocus) { target = position; speed = 0; } request();
  }, options);
  track.addEventListener('focusout', event => {
    if (!track.contains(event.relatedTarget)) { keyboardFocus = false; suspendAutoplay(1200); }
  }, options);
  document.addEventListener('visibilitychange', () => { previousTime = 0; request(); }, options);
  const resizeObserver = new ResizeObserver(() => refresh()); resizeObserver.observe(track);
  mobile.addEventListener('change', () => refresh(true), options);
  return {
    refresh, center,
    step: direction => center((lastIndex < 0 ? 0 : lastIndex) + direction),
    sync: () => { if (reduced.matches || isPaused()) { target = position; speed = 0; } previousTime = 0; request(); },
    setActive: value => { if (active !== value) previousTime = 0; active = value; if (value) request(); else { target = position; speed = 0; cancelAnimationFrame(frame); frame = 0; } },
    dragTo: value => { suspendAutoplay(); target = position = value; clearTimeout(snapTimer); request(); },
    settle: scheduleSnap,
    dispose: () => { cancelAnimationFrame(frame); clearTimeout(snapTimer); resizeObserver.disconnect(); },
  };
}
