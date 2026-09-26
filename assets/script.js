document.querySelectorAll(".lottie-icon[data-lottie]").forEach((el) => {
  if (window.lottie) {
    lottie.loadAnimation({
      container: el,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: el.dataset.lottie,
    });
  }
});

(function () {
  const strip = document.querySelector(".offer-strip");
  if (!strip) return;
  const tracks = strip.querySelectorAll(".offer-strip-track");
  if (tracks.length < 2) return;
  const [track1, track2] = tracks;
  const groupHTML = track1.innerHTML;
  const minWidth = Math.max(window.innerWidth * 1.5, 4000);
  while (track1.scrollWidth < minWidth) {
    track1.insertAdjacentHTML("beforeend", groupHTML);
  }
  track2.innerHTML = track1.innerHTML;
})();

/**
 * Turns an auto-scrolling two-track marquee into one the user can also
 * click-and-drag (mouse) or swipe (touch) left/right, seamlessly wrapping
 * between the two identical tracks.
 */
function initDraggableMarquee(container, pxPerSecond) {
  if (!container) return;
  const track = container.children[0];
  if (!track) return;

  container.classList.add("draggable-marquee");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const speed = reduceMotion ? 0 : pxPerSecond;

  const wrapWidth = () => {
    const gap = parseFloat(getComputedStyle(container).gap) || 0;
    return track.getBoundingClientRect().width + gap;
  };

  let paused = false;
  let dragging = false;
  let startX = 0;
  let startScroll = 0;
  let lastTime = null;
  let resumeTimer = null;

  function pause() {
    paused = true;
    clearTimeout(resumeTimer);
  }
  function scheduleResume(delay) {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { paused = false; }, delay);
  }

  function tick(ts) {
    if (!paused && speed > 0 && lastTime != null) {
      const dt = (ts - lastTime) / 1000;
      const ww = wrapWidth();
      let next = container.scrollLeft + speed * dt;
      if (ww > 0 && next >= ww) next -= ww;
      container.scrollLeft = next;
    }
    lastTime = ts;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  container.addEventListener("mouseenter", pause);
  container.addEventListener("mouseleave", () => scheduleResume(300));

  container.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse") return;
    dragging = true;
    pause();
    startX = event.clientX;
    startScroll = container.scrollLeft;
    container.classList.add("is-dragging");
    container.setPointerCapture(event.pointerId);
  });
  container.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const ww = wrapWidth();
    let next = startScroll - (event.clientX - startX);
    if (ww > 0) next = ((next % ww) + ww) % ww;
    container.scrollLeft = next;
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    container.classList.remove("is-dragging");
    scheduleResume(1000);
  }
  container.addEventListener("pointerup", endDrag);
  container.addEventListener("pointercancel", endDrag);
  container.addEventListener("pointerleave", endDrag);

  container.addEventListener("touchstart", pause, { passive: true });
  container.addEventListener("touchend", () => scheduleResume(1000), { passive: true });

  container.addEventListener("scroll", () => {
    if (dragging) return;
    const ww = wrapWidth();
    if (ww <= 0) return;
    if (container.scrollLeft >= ww) container.scrollLeft -= ww;
    else if (container.scrollLeft < 0) container.scrollLeft += ww;
  });
}

initDraggableMarquee(document.querySelector(".marquee"), 60);
initDraggableMarquee(document.querySelector(".offer-strip"), 28);

(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(
    ".hero-copy, .section-head, .teo-note, .highlight-item, .price-card, .guarantee-box, .offer-kicker"
  ).forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  ScrollTrigger.batch(".benefit-card", {
    start: "top 88%",
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08 }
      ),
    onLeaveBack: (batch) =>
      gsap.to(batch, { opacity: 0, y: 28, duration: 0.4, ease: "power2.in", stagger: 0.05 }),
  });

  ScrollTrigger.batch(".faq-item", {
    start: "top 92%",
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06 }
      ),
    onLeaveBack: (batch) =>
      gsap.to(batch, { opacity: 0, y: 20, duration: 0.35, ease: "power2.in", stagger: 0.04 }),
  });
})();

(function () {
  const dialog = document.getElementById("volume-picker");
  if (!dialog) return;
  const openBtn = document.querySelector("[data-open-volume-picker]");
  const closeBtn = dialog.querySelector("[data-close-volume-picker]");

  openBtn?.addEventListener("click", () => dialog.showModal());
  closeBtn?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
})();

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-item").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});
