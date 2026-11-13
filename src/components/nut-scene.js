const translations = {
  ru: { catalogue: "Перейти в каталог", pause: "Остановить анимацию", play: "Включить анимацию", scene: "Pologenki — орехи и сухофрукты", jar: "Стеклянная банка со смесью кешью, миндаля, грецких орехов, кураги, манго и клюквы" },
  en: { catalogue: "Explore the catalogue", pause: "Pause animation", play: "Play animation", scene: "Pologenki — nuts and dried fruits", jar: "A glass jar of cashews, almonds, walnuts, dried apricots, mango and cranberries" },
  cn: { catalogue: "浏览产品目录", pause: "暂停动画", play: "播放动画", scene: "Pologenki — 坚果与干果", jar: "装有腰果、杏仁、核桃、杏干、芒果干和蔓越莓的玻璃罐" },
};

// Positions and stacking recreate the reference's layered composition with our own assets.
const ingredients = [
  { kind: "walnut", x: 26, y: 20, size: 18, angle: -24, depth: -.65, phase: .2, front: false },
  { kind: "apricot", x: 73, y: 17, size: 12, angle: 38, depth: .65, phase: 1.7, front: false },
  { kind: "mango", x: 12, y: 47, size: 17, angle: 65, depth: -.35, phase: 2.9, front: false },
  { kind: "cashew", x: 81, y: 69, size: 20, angle: -32, depth: .4, phase: 4.1, front: false },
  { kind: "mango", x: 30, y: 70, size: 20, angle: 42, depth: .8, phase: 5.8, front: true },
  { kind: "cranberries", x: 84, y: 35, size: 10, angle: 14, depth: -.9, phase: 7.3, front: true },
  { kind: "apricot", x: 57, y: 85, size: 10, angle: -52, depth: .5, phase: 8.9, front: true },
  { kind: "cashew", x: 44, y: 9, size: 8, angle: -42, depth: -.3, phase: 10.2, front: false },
  { kind: "cranberries", x: 73, y: 86, size: 10, angle: 24, depth: .55, phase: 11.6, front: false },
];

export function NutScene(lang = "en") {
  const c = translations[lang] || translations.en;
  return `<section id="nut-scene" class="nut-scene-section" aria-label="${c.scene}">
    <div class="nut-scene-inner">
      <div class="nut-scene-stage">
        ${ingredients.map((nut, i) => {
          const layer = (transmission = false) => `<div class="nut-scene-object nut-scene-ingredient nut-scene-ingredient-${i + 1}${nut.front ? " nut-scene-foreground" : ""}${transmission ? " nut-scene-transmission" : ""}" data-nut-depth="${nut.depth}" data-nut-phase="${nut.phase}" data-nut-amplitude="9" style="--nut-x:${nut.x}%;--nut-y:${nut.y}%;--nut-size:${nut.size}%;--nut-angle:${nut.angle}deg" aria-hidden="true"><img src="/nut-scene/${nut.kind}.webp" width="640" height="640" alt="" loading="eager" fetchpriority="high" decoding="async" draggable="false"></div>`;
          return layer() + (nut.front ? layer(true) : "");
        }).join("")}
        <div class="nut-scene-object nut-scene-jar" data-nut-depth="0.17" data-nut-phase="1.1" data-nut-amplitude="3" style="--nut-x:51%;--nut-y:47%;--nut-size:29%;--nut-angle:-4deg">
          <img src="/nut-scene/mix-jar.webp" srcset="/nut-scene/mix-jar-480.webp 480w, /nut-scene/mix-jar-960.webp 960w, /nut-scene/mix-jar.webp 1024w" sizes="(max-width: 700px) 59vw, 440px" width="1024" height="1536" alt="${c.jar}" loading="eager" fetchpriority="high" decoding="async" draggable="false">
        </div>
        <h1 class="nut-scene-wordmark">POLOGENKI</h1>
      </div>
      <div class="nut-scene-footer"><a class="nut-scene-catalogue" href="#products" aria-label="${c.catalogue}"><i class="fa-solid fa-arrow-down-long" aria-hidden="true"></i></a>
        <button class="nut-scene-toggle" type="button" aria-label="${c.pause}" aria-pressed="false"><i class="fa-solid fa-pause" aria-hidden="true"></i></button>
      </div>
    </div>
  </section>`;
}

let dispose = () => {};

export function initNutScene(lang = "en") {
  dispose();
  const section = document.getElementById("nut-scene");
  if (!section) return;
  const c = translations[lang] || translations.en;
  const stage = section.querySelector(".nut-scene-stage");
  const toggle = section.querySelector(".nut-scene-toggle");
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const controller = new AbortController();
  const events = { signal: controller.signal };
  const layers = [...section.querySelectorAll("[data-nut-depth]")].map(element => ({
    element,
    depth: Number(element.dataset.nutDepth),
    phase: Number(element.dataset.nutPhase),
    amplitude: Number(element.dataset.nutAmplitude),
  }));
  let paused = false;
  let imagesReady = false;
  let visible = false;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let pointer = { x: 0, y: 0 };
  let smooth = { x: 0, y: 0 };
  let bounds;
  let scrollOffset = 0;

  function measure() {
    section.style.setProperty("--nut-scene-width", `${document.documentElement.clientWidth}px`);
    bounds = stage.getBoundingClientRect();
    const centre = bounds.top + bounds.height / 2;
    scrollOffset = Math.max(-1, Math.min(1, (innerHeight / 2 - centre) / innerHeight));
  }

  function paint(time) {
    if (controller.signal.aborted || !section.isConnected) { frame = 0; return; }
    const dt = lastTime ? Math.min(time - lastTime, 40) : 0;
    lastTime = time;
    elapsed += dt / 1000;
    smooth.x += (pointer.x - smooth.x) * .065;
    smooth.y += (pointer.y - smooth.y) * .065;
    for (const layer of layers) {
      const { element, depth, phase, amplitude } = layer;
      const x = Math.sin(elapsed * .43 + phase) * amplitude + smooth.x * depth * 32;
      const y = Math.cos(elapsed * .37 + phase) * amplitude + smooth.y * depth * 22 - scrollOffset * depth * 40;
      const rock = Math.sin(elapsed * .31 + phase) * (amplitude > 3 ? 2.4 : .75) + smooth.x * depth * 3;
      element.style.setProperty("--nut-dx", `${x.toFixed(2)}px`);
      element.style.setProperty("--nut-dy", `${y.toFixed(2)}px`);
      element.style.setProperty("--nut-rock", `${rock.toFixed(2)}deg`);
    }
    frame = 0;
    const active = imagesReady && visible && !paused && !media.matches && !document.hidden;
    section.dataset.motion = active ? "running" : "paused";
    if (active) frame = requestAnimationFrame(paint);
  }

  function schedule() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    const active = imagesReady && visible && !paused && !media.matches && !document.hidden;
    section.dataset.motion = active ? "running" : "paused";
    if (active) frame = requestAnimationFrame(paint);
  }

  function updateControl() {
    toggle.hidden = media.matches;
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.setAttribute("aria-label", paused ? c.play : c.pause);
    toggle.innerHTML = `<i class="fa-solid fa-${paused ? "play" : "pause"}" aria-hidden="true"></i>`;
  }

  toggle.addEventListener("click", () => { paused = !paused; updateControl(); schedule(); }, events);
  stage.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse" || media.matches || paused) return;
    bounds = stage.getBoundingClientRect();
    pointer.x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    pointer.y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
  }, events);
  stage.addEventListener("pointerleave", () => { pointer = { x: 0, y: 0 }; }, events);
  window.addEventListener("resize", measure, { ...events, passive: true });
  window.addEventListener("scroll", () => { if (visible) measure(); }, { ...events, passive: true });
  document.addEventListener("visibilitychange", schedule, events);
  function onMotionPreference() {
    if (media.matches) for (const { element } of layers) {
      element.style.removeProperty("--nut-dx");
      element.style.removeProperty("--nut-dy");
      element.style.removeProperty("--nut-rock");
    }
    updateControl(); schedule();
  }
  media.addEventListener("change", onMotionPreference);
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    measure(); schedule();
  }, { rootMargin: "60px", threshold: 0 });
  observer.observe(stage);
  measure();
  updateControl();
  // The hero's transparent layers must be decoded before animated GPU layers
  // are enabled, including after a language navigation or an in-place render.
  section.setAttribute("aria-busy", "true");
  schedule();
  const images = [...stage.querySelectorAll("img")];
  Promise.allSettled(images.map(image => {
    if (typeof image.decode === "function") return image.decode();
    if (image.complete) return Promise.resolve();
    return new Promise(resolve => {
      image.addEventListener("load", resolve, { ...events, once: true });
      image.addEventListener("error", resolve, { ...events, once: true });
    });
  })).then(() => {
    if (controller.signal.aborted || !section.isConnected) return;
    imagesReady = true;
    section.setAttribute("aria-busy", "false");
    measure(); schedule();
  });
  dispose = () => {
    controller.abort();
    media.removeEventListener("change", onMotionPreference);
    observer.disconnect();
    if (frame) cancelAnimationFrame(frame);
  };
}
