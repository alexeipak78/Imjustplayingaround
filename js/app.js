// Minimal JS to manage modal, steps, and mock submission
document.addEventListener('DOMContentLoaded', () => {
  // header CTAs
  const openBooking = document.getElementById('openBooking');
  const openBookingHero = document.getElementById('openBookingHero');
  const openBookingFromCard = document.getElementById('openBookingFromCard');
  const bookingModal = document.getElementById('bookingModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const closeModal = document.getElementById('closeModal');
  const cancelBooking = document.getElementById('cancelBooking');
  const bookingForm = document.getElementById('bookingForm');

  const stepEls = Array.from(bookingForm.querySelectorAll('.step'));
  let currentStep = 1;

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function showModal() {
    bookingModal.setAttribute('aria-hidden','false');
    // show first step
    goToStep(1);
    // focus
    bookingModal.querySelector('[data-step="1"] select, [data-step="1"] input')?.focus();
    document.body.style.overflow = 'hidden';
  }
  function hideModal() {
    bookingModal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  [openBooking, openBookingHero, openBookingFromCard].forEach(btn => {
    btn && btn.addEventListener('click', (e) => { e.preventDefault(); showModal(); });
  });

  [closeModal, modalBackdrop, cancelBooking].forEach(el => {
    el && el.addEventListener('click', () => hideModal());
  });

  // step navigation
  function goToStep(n) {
    currentStep = n;
    stepEls.forEach(s => s.hidden = true);
    const target = bookingForm.querySelector(`.step[data-step="${n}"]`);
    if (target) target.hidden = false;
  }

  // Step controls
  const nextToDate = document.getElementById('nextToDate');
  const backToService = document.getElementById('backToService');
  const nextToConfirm = document.getElementById('nextToConfirm');
  const backToDate = document.getElementById('backToDate');

  nextToDate && nextToDate.addEventListener('click', () => {
    const service = document.getElementById('serviceSelect');
    if (!service.value) {
      service.focus();
      service.setCustomValidity('Please select a service');
      service.reportValidity();
      return;
    }
    service.setCustomValidity('');
    goToStep(2);
  });

  backToService && backToService.addEventListener('click', () => goToStep(1));

  nextToConfirm && nextToConfirm.addEventListener('click', () => {
    const date = document.getElementById('date');
    const time = document.getElementById('time');
    if (!date.value) { date.focus(); date.setCustomValidity('Please pick a date'); date.reportValidity(); return; }
    if (!time.value) { time.focus(); time.setCustomValidity('Please pick a time'); time.reportValidity(); return; }
    document.getElementById('confirmService').textContent = document.getElementById('serviceSelect').selectedOptions[0].textContent;
    document.getElementById('confirmDate').textContent = new Date(date.value).toLocaleDateString();
    document.getElementById('confirmTime').textContent = time.value;
    goToStep(3);
  });

  backToDate && backToDate.addEventListener('click', () => goToStep(2));

  // Submit booking (mock)
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('bookerEmail');
    if (!email.checkValidity()) {
      email.reportValidity();
      email.focus();
      return;
    }
    // Show loading state
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Booking...';

    // Mock network latency
    await new Promise(r => setTimeout(r, 900));

    // In production: call your API here, then handle errors.
    // Example:
    // await fetch('/api/book', {method:'POST', body: JSON.stringify(payload)});

    // Show success step
    stepEls.forEach(s => s.hidden = true);
    const success = bookingForm.querySelector('.step[data-step="success"]');
    if (success) {
      success.hidden = false;
    }
    confirmBtn.disabled = false;
    confirmBtn.textContent = 'Confirm booking';
  });

  // Done button to close modal
  const doneBtn = document.getElementById('doneBtn');
  doneBtn && doneBtn.addEventListener('click', () => hideModal());

  // Quick contact form in footer
  const contactForm = document.getElementById('contactForm');
  contactForm && contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('contactEmail');
    if (!email.checkValidity()) { email.reportValidity(); return; }
    // Mock UX: show toast or simple alert
    email.value = '';
    alert('Thanks — we will reach out shortly.');
  });

  // Keyboard handling
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.getAttribute('aria-hidden') === 'false') hideModal();
  });

  // Small CTA: start trial hooks
  const startTrial = document.getElementById('startTrial');
  startTrial && startTrial.addEventListener('click', () => {
    // For now open booking modal and pre-select lightweight plan
    showModal();
    const sel = document.getElementById('serviceSelect');
    if (sel) sel.value = 'intro-15';
  });
});
