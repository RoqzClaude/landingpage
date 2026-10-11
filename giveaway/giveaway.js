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

/* VSL: click-to-play swaps the photo stand-in for the real embedded video. */
(function vsl() {
  const playBtn = document.getElementById('vslPlay');
  const frame = document.getElementById('vslFrame');
  if (!playBtn || !frame) return;
  playBtn.addEventListener('click', () => {
    // [NEEDS K1 CONFIRMATION] — replace with the real hosted VSL embed URL.
    frame.innerHTML = `<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" title="K1 Outdoors — A Year of Glamping" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;"></iframe>`;
  });

  // Rotate the photo stand-in slides until the visitor presses play.
  const slides = frame.querySelectorAll('.vsl-slide');
  let i = 0;
  setInterval(() => {
    if (!frame.querySelector('.vsl-slide')) return; // video has replaced the slides
    slides[i].classList.remove('active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('active');
  }, 3500);
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
