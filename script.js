document.getElementById('year').textContent = new Date().getFullYear();

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
