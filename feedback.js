
function setFieldError(fieldId, hasError) {
  const errorEl = document.getElementById(`error-${fieldId}`);
  const inputEl = document.getElementById(fieldId);
  errorEl.classList.toggle('hidden', !hasError);
  inputEl.classList.toggle('inputError', hasError);
}


function validateFeedbackForm() {
  const name = document.getElementById('fb-name').value.trim();
  const email = document.getElementById('fb-email').value.trim();
  const message = document.getElementById('fb-message').value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nameValid = name.length > 0;
  const emailValid = emailPattern.test(email);
  const messageValid = message.length > 0;

  setFieldError('fb-name', !nameValid);
  setFieldError('fb-email', !emailValid);
  setFieldError('fb-message', !messageValid);

  return nameValid && emailValid && messageValid;
}


function saveFeedback(entry) {
  const history = JSON.parse(localStorage.getItem('toyStore_feedback')) || [];
  history.push(entry);
  localStorage.setItem('toyStore_feedback', JSON.stringify(history));
}


function handleFeedbackSubmit(event) {
  event.preventDefault();

  if (!validateFeedbackForm()) {
    return;
  }

  const entry = {
    name: document.getElementById('fb-name').value.trim(),
    email: document.getElementById('fb-email').value.trim(),
    message: document.getElementById('fb-message').value.trim(),
    date: new Date().toISOString()
  };

  saveFeedback(entry);

  document.getElementById('feedback-form').classList.add('hidden');
  document.getElementById('feedback-confirmation').classList.remove('hidden');
}


function updateCounts() {
  const cart = JSON.parse(localStorage.getItem('toyStore_cart')) || [];
  const wishlist = JSON.parse(localStorage.getItem('toyStore_wishlist')) || [];

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').innerText = totalCartItems;
  document.getElementById('mobile-cart-count').innerText = totalCartItems;

  document.getElementById('wishlist-count').innerText = wishlist.length;
  document.getElementById('mobile-wishlist-count').innerText = wishlist.length;
}


function setupFaqAccordion() {
  const items = document.querySelectorAll('.faqItem');

  items.forEach(item => {
    const question = item.querySelector('.faqQuestion');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      items.forEach(other => other.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}


document.addEventListener('DOMContentLoaded', () => {
  updateCounts();
  setupFaqAccordion();

  document.getElementById('feedback-form').addEventListener('submit', handleFeedbackSubmit);


  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
  });
});
