// Booking modal + simple interactions (keeps prior functionality, lightly enhanced)
document.addEventListener('DOMContentLoaded', () => {
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
    goToStep(1);
    bookingModal.querySelector('[data-step="1"] select, [data-step="1"] input')?.focus();
    document.body.style.overflow = 'hidden';
  }
  function hideModal() {
    bookingModal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  [openBooking, openBookingHero, openBookingFromCard].forEach(btn => {
    btn && btn.addEventListener('click', (e) => { e && e.preventDefault(); showModal(); });
  });

  [closeModal, modalBackdrop, cancelBooking].forEach(el => {
    el && el.addEventListener('click', () => hideModal());
  });

  function goToStep(n) {
    currentStep = n;
    stepEls.forEach(s => s.hidden = true);
    const target = bookingForm.querySelector(`.step[data-step="${n}"]`);
    if (target) target.hidden = false;
  }

  // step controls
  const nextToDate = document.getElementById('nextToDate');
  const backToService = document.getElementById('backToService');
  const nextToConfirm = document.getElementById('nextToConfirm');
  const backToDate = document.getElementById('backToDate');

  nextToDate && nextToDate.addEventListener('click', () => {
    const service = document.getElementById('serviceSelect');
    if (!service.value) { service.focus(); service.setCustomValidity('Please select a demo'); service.reportValidity(); return; }
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

  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('bookerEmail');
    if (!email.checkValidity()) { email.reportValidity(); email.focus(); return; }
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Booking...';

    // simulate network latency
    await new Promise(r => setTimeout(r, 900));

    // TODO: replace with real API call to schedule and send invites
    stepEls.forEach(s => s.hidden = true);
    const success = bookingForm.querySelector('.step[data-step="success"]');
    if (success) success.hidden = false;

    confirmBtn.disabled = false;
    confirmBtn.textContent = 'Confirm booking';
  });

  const doneBtn = document.getElementById('doneBtn');
  doneBtn && doneBtn.addEventListener('click', () => hideModal());

  // contact form (simple)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('contactEmail');
      if (!email.checkValidity()) { email.reportValidity(); return; }
      email.value = '';
      alert('Thanks — we will reach out shortly.');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.getAttribute('aria-hidden') === 'false') hideModal();
  });
});
