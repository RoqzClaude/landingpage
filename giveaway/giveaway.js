document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

/**
 * Countdown to the contest deadline.
 * [NEEDS K1 CONFIRMATION]: real entry deadline — placeholder below.
 */
(function countdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  const deadline = new Date('2026-11-10T23:59:59-07:00'); // placeholder — confirm with K1
  function tick() {
    const diff = deadline - new Date();
    if (diff <= 0) { el.textContent = "Entries are closed"; return; }
    const d = Math.floor(diff / 86400000);
    const h = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    el.innerHTML = `<span>${d}d</span><span>${h}h</span><span>${m}m</span><span>${s}s</span>`;
  }
  tick();
  setInterval(tick, 1000);
})();

/* Slideshow: arrows, dots, and autoplay through the gear photos. */
(function slideshow() {
  const frame = document.getElementById('slideshowFrame');
  const dotsWrap = document.getElementById('slideshowDots');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  if (!frame || !dotsWrap) return;

  const slides = frame.querySelectorAll('.slideshow-slide');
  let index = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Show photo ${i + 1}`);
    dot.addEventListener('click', () => { show(i); restart(); });
    dotsWrap.appendChild(dot);
  });

  function show(i) {
    slides[index].classList.remove('active');
    dotsWrap.children[index].classList.remove('active');
    index = (i + slides.length) % slides.length;
    slides[index].classList.add('active');
    dotsWrap.children[index].classList.add('active');
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => show(index + 1), 4500);
  }

  prevBtn?.addEventListener('click', () => { show(index - 1); restart(); });
  nextBtn?.addEventListener('click', () => { show(index + 1); restart(); });

  restart();
})();

/* Entry form — client-side only until a real endpoint is wired up (see ARCHITECTURE.md pattern). */
(function entryForm() {
  const form = document.getElementById('entryForm');
  if (!form) return;
  const counterEl = document.getElementById('entriesCount');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    data.submittedAt = new Date().toISOString();
    data.pageUrl = window.location.href;

    // [NEEDS K1 CONFIRMATION]: real submission endpoint (Make/HubSpot webhook).
    console.info('[K1 giveaway entry] No endpoint configured yet — logging entry instead:', data);

    form.style.display = 'none';
    document.getElementById('entrySuccess').style.display = 'block';

    if (counterEl) {
      const current = parseInt(counterEl.textContent.replace(/,/g, ''), 10) || 0;
      counterEl.textContent = (current + 1).toLocaleString();
    }
  });
})();
