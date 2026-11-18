// K1 Outdoors — shared site behavior (nav toggle, year stamp, gallery lightbox/filters)

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Gallery filters
const filterBtns = document.querySelectorAll('.filter-btn');
const photoItems = document.querySelectorAll('.photo-item');
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    photoItems.forEach((item) => {
      const match = filter === 'all' || item.getAttribute('data-category') === filter;
      item.style.display = match ? '' : 'none';
    });
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

photoItems.forEach((item) => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.photo-caption');
    if (!lightbox || !img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('open');
  });
});
if (lightboxClose) {
  lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
}
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('open');
  });
}

// Weather forecast strip (homepage only) — Edmonton, AB via Open-Meteo (free, no API key)
const weatherDaysEl = document.getElementById('weatherDays');
if (weatherDaysEl) {
  const WEATHER_ICONS = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌦️', 55: '🌦️',
    56: '🌧️', 57: '🌧️',
    61: '🌧️', 63: '🌧️', 65: '🌧️',
    66: '🌧️', 67: '🌧️',
    71: '🌨️', 73: '🌨️', 75: '🌨️', 77: '🌨️',
    80: '🌦️', 81: '🌧️', 82: '⛈️',
    85: '🌨️', 86: '🌨️',
    95: '⛈️', 96: '⛈️', 99: '⛈️',
  };
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  fetch('https://api.open-meteo.com/v1/forecast?latitude=53.5461&longitude=-113.4938&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=America%2FEdmonton&forecast_days=7')
    .then((res) => res.json())
    .then((data) => {
      const daily = data && data.daily;
      if (!daily || !daily.time) throw new Error('No forecast data');
      const html = daily.time.map((dateStr, i) => {
        const date = new Date(dateStr + 'T00:00:00');
        const dayName = i === 0 ? 'Today' : DAY_NAMES[date.getDay()];
        const icon = WEATHER_ICONS[daily.weather_code[i]] || '🌡️';
        const hi = Math.round(daily.temperature_2m_max[i]);
        const lo = Math.round(daily.temperature_2m_min[i]);
        return `<div class="weather-day">
          <span class="wd-name">${dayName}</span>
          <span class="wd-icon">${icon}</span>
          <span class="wd-temps"><span class="wd-hi">${hi}°</span> <span class="wd-lo">${lo}°</span></span>
        </div>`;
      }).join('');
      weatherDaysEl.innerHTML = html;
    })
    .catch(() => {
      weatherDaysEl.innerHTML = '<span class="weather-loading">Forecast unavailable right now.</span>';
    });
}

// Gallery viewer (featured photo + thumbnail strip)
const galleryMainImg = document.getElementById('galleryMainImg');
const galleryMainCaption = document.getElementById('galleryMainCaption');
const galleryThumbs = document.querySelectorAll('.gallery-thumb');
galleryThumbs.forEach((thumb) => {
  thumb.addEventListener('click', () => {
    galleryThumbs.forEach((t) => t.classList.remove('active'));
    thumb.classList.add('active');
    if (!galleryMainImg) return;
    galleryMainImg.src = thumb.getAttribute('data-src');
    galleryMainImg.alt = thumb.getAttribute('data-alt') || '';
    galleryMainImg.style.objectPosition = thumb.getAttribute('data-position') || 'center';
    if (galleryMainCaption) galleryMainCaption.textContent = thumb.getAttribute('data-caption') || '';
  });
});
