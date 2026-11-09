/**
 * K1 Outdoors — shared site behavior (nav toggle, year stamp).
 * Included on every page alongside design-system.css and lead-form.js.
 */
document.querySelectorAll('[data-k1-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const navToggle = document.querySelector('.k1-nav-toggle');
const navLinks = document.querySelector('.k1-nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('k1-nav-links--open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}
