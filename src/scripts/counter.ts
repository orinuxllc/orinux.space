const counters = document.querySelectorAll<HTMLElement>("[data-count]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      const target = parseInt(el.dataset.count || "0", 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1800;
      const start = performance.now();

      function step(now: number) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

counters.forEach((el) => observer.observe(el));
