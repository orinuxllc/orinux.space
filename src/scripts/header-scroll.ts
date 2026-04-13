const header = document.querySelector("header");
if (header) {
  let lastY = 0;

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      header.classList.toggle("scrolled", y > 20);
      header.classList.toggle("header-hide", y > lastY && y > 200);
      lastY = y;
    },
    { passive: true }
  );
}
