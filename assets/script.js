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

  const pxPerSecond = 28;
  const duration = (track1.scrollWidth / pxPerSecond).toFixed(1) + "s";
  track1.style.animationDuration = duration;
  track2.style.animationDuration = duration;
})();

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
