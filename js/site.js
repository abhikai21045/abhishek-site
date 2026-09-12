// Small shared behaviour: mobile nav toggle only. No frameworks.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".topbar-toggle");
  const menu = document.querySelector(".mobile-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
});
