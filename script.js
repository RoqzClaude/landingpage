document.getElementById('year').textContent = new Date().getFullYear();

// Auto-rotating photo carousel standing in for the product demo video
(function carousel() {
  const root = document.getElementById('demoCarousel');
  if (!root) return;
  const slides = root.querySelectorAll('.carousel-slide');
  const dotsWrap = document.getElementById('carouselDots');
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Show photo ${i + 1}`);
    dot.addEventListener('click', () => show(i));
    dotsWrap.appendChild(dot);
  });

  function show(i) {
    slides[index].classList.remove('active');
    dotsWrap.children[index].classList.remove('active');
    index = i;
    slides[index].classList.add('active');
    dotsWrap.children[index].classList.add('active');
  }

  setInterval(() => show((index + 1) % slides.length), 4000);
})();

// Bonus countdown timer — resets each day at midnight local time to keep urgency evergreen
(function countdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  function tick() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
})();

// Pre-select the package in the claim form when a pricing CTA is clicked
document.querySelectorAll('[data-plan]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const plan = btn.getAttribute('data-plan');
    const select = document.getElementById('planSelect');
    if (select) select.value = plan;
  });
});

// Handle claim form submission (no backend wired up yet)
const claimForm = document.getElementById('claimForm');
const claimNote = document.getElementById('claimNote');

claimForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(claimForm);
  const name = data.get('name');
  const plan = data.get('plan');

  claimNote.textContent = `Thanks, ${name}! Your ${plan} request is in — check your inbox for next steps.`;
  claimForm.reset();
});
