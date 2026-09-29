
let cart = JSON.parse(localStorage.getItem('toyStore_cart')) || [];
let selectedPayment = 'Card';


function formatLKR(amount) {
  return 'LKR ' + amount.toLocaleString('en-US');
}


function showToast(title, message) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-title').innerText = title;
  document.getElementById('toast-message').innerText = message;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}


function updateCounts() {
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').innerText = totalCartItems;
  document.getElementById('mobile-cart-count').innerText = totalCartItems;

  const wishlist = JSON.parse(localStorage.getItem('toyStore_wishlist')) || [];
  document.getElementById('wishlist-count').innerText = wishlist.length;
  document.getElementById('mobile-wishlist-count').innerText = wishlist.length;
}

function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}


function buildOrderLinesHTML() {
  return cart.map(item => `
    <div class="orderLine">
      <span>${item.name} &times; ${item.quantity}</span>
      <span>${formatLKR(item.price * item.quantity)}</span>
    </div>
  `).join('');
}


function renderSummary() {
  const total = calculateTotal();
  document.getElementById('checkout-subtotal').innerText = formatLKR(total);
  document.getElementById('checkout-total').innerText = formatLKR(total);
  document.getElementById('order-lines').innerHTML = buildOrderLinesHTML();
}


function checkEmptyCart() {
  const form = document.getElementById('checkout-form');
  const emptyNotice = document.getElementById('checkout-empty');

  if (cart.length === 0) {
    form.classList.add('hidden');
    emptyNotice.classList.remove('hidden');
    return true;
  }

  form.classList.remove('hidden');
  emptyNotice.classList.add('hidden');
  return false;
}

function setupPaymentOptions() {
  const options = document.querySelectorAll('.paymentOption');
  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      selectedPayment = option.dataset.method;
    });
  });
}


function setFieldError(fieldId, hasError) {
  const errorEl = document.getElementById(`error-${fieldId}`);
  const inputEl = document.getElementById(fieldId);
  errorEl.classList.toggle('hidden', !hasError);
  inputEl.classList.toggle('inputError', hasError);
}


function validateForm() {
  const fullName = document.getElementById('full-name').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nameValid = fullName.length > 0;
  const emailValid = emailPattern.test(email);
  const addressValid = address.length > 0;

  setFieldError('full-name', !nameValid);
  setFieldError('email', !emailValid);
  setFieldError('address', !addressValid);

  return nameValid && emailValid && addressValid;
}


function handleReviewOrder(event) {
  event.preventDefault();

  if (!validateForm()) {
    showToast('Missing Details', 'Please fix the highlighted fields.');
    return;
  }

  const fullName = document.getElementById('full-name').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const total = calculateTotal();

  document.getElementById('review-name').innerText = fullName;
  document.getElementById('review-email').innerText = email;
  document.getElementById('review-address').innerText = address;
  document.getElementById('review-payment').innerText = selectedPayment;
  document.getElementById('review-lines').innerHTML = buildOrderLinesHTML();
  document.getElementById('review-total').innerText = formatLKR(total);

  document.getElementById('checkout-form').classList.add('hidden');
  document.getElementById('order-review').classList.remove('hidden');
}


function handleEditOrder() {
  document.getElementById('order-review').classList.add('hidden');
  document.getElementById('checkout-form').classList.remove('hidden');
}

function saveOrderToHistory(order) {
  const history = JSON.parse(localStorage.getItem('toyStore_orders')) || [];
  history.push(order);
  localStorage.setItem('toyStore_orders', JSON.stringify(history));
}


function handleConfirmOrder() {
  const order = {
    id: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    customer: {
      name: document.getElementById('full-name').value.trim(),
      email: document.getElementById('email').value.trim(),
      address: document.getElementById('address').value.trim(),
      payment: selectedPayment
    },
    items: cart,
    total: calculateTotal()
  };

  saveOrderToHistory(order);

  cart = [];
  localStorage.setItem('toyStore_cart', JSON.stringify(cart));
  updateCounts();


  document.getElementById('order-review').classList.add('hidden');
  document.getElementById('success-overlay').classList.remove('hidden');
  requestAnimationFrame(() => {
    document.getElementById('success-overlay').classList.add('show');
  });

  setTimeout(() => {
    window.location.href = 'home.html';
  }, 3200);
}


document.addEventListener('DOMContentLoaded', () => {
  updateCounts();

  const isEmpty = checkEmptyCart();
  if (!isEmpty) {
    renderSummary();
    setupPaymentOptions();
    document.getElementById('checkout-form').addEventListener('submit', handleReviewOrder);
    document.getElementById('edit-order-btn').addEventListener('click', handleEditOrder);
    document.getElementById('confirm-order-btn').addEventListener('click', handleConfirmOrder);
  }


  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
  });
});
