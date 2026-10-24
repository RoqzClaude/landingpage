/**
 * K1 Outdoors — reusable lead form behavior.
 *
 * Every industry page includes the same form markup (see
 * festival-tent-rentals/index.html for the reference copy) and just
 * changes the hidden "industry" and "landingPage" field values.
 * This script is shared unchanged across every page.
 *
 * Submission target is intentionally NOT wired to a real endpoint yet —
 * see K1_LEAD_ENDPOINT below and ARCHITECTURE.md section "Integration".
 */

// [NEEDS K1 CONFIRMATION] — replace with the real Make.com webhook (or
// HubSpot Forms API endpoint) once K1 provides it. Until then, submissions
// are only logged to the console and shown a success state, so the page
// can be demoed/tested without losing real leads to a dead endpoint.
const K1_LEAD_ENDPOINT = null;

(function () {
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  function captureUtms(form) {
    const params = new URLSearchParams(window.location.search);
    UTM_KEYS.forEach((key) => {
      const field = form.querySelector(`[name="${key}"]`);
      if (field) field.value = params.get(key) || '';
    });
    const sourceField = form.querySelector('[name="leadSource"]');
    if (sourceField && !sourceField.value) {
      sourceField.value = document.referrer ? new URL(document.referrer).hostname : 'direct';
    }
  }

  function initForm(form) {
    captureUtms(form);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      const payload = Object.fromEntries(new FormData(form).entries());
      payload.pageUrl = window.location.href;
      payload.submittedAt = new Date().toISOString();

      try {
        if (K1_LEAD_ENDPOINT) {
          await fetch(K1_LEAD_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } else {
          console.info('[K1 lead form] No endpoint configured yet — logging payload instead:', payload);
        }
        showSuccess(form);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
        const errorNote = form.querySelector('.k1-form-error');
        if (errorNote) errorNote.hidden = false;
        console.error('[K1 lead form] Submission failed:', err);
      }
    });
  }

  function showSuccess(form) {
    const card = form.closest('.k1-form-card');
    const success = card.querySelector('.k1-form-success');
    form.style.display = 'none';
    if (success) success.style.display = 'block';
  }

  document.querySelectorAll('form[data-k1-lead-form]').forEach(initForm);
})();
