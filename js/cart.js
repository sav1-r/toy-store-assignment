
let cart = JSON.parse(localStorage.getItem('toyStore_cart')) || [];


function formatLKR(amount) {
  return 'LKR ' + amount.toLocaleString('en-US');
}


function generateFallback(item) {
  const initial = item.name.charAt(0).toUpperCase();
  const color = item.color || '#3399ff';
  return `
    <div class="fallbackBox" style="background-color: ${color}">
      <span class="fallbackLetter">${initial}</span>
    </div>
  `;
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

function renderCart() {
  const itemsContainer = document.getElementById('cart-items');
  const emptyState = document.getElementById('cart-empty');
  const footer = document.getElementById('cart-footer');

  if (cart.length === 0) {
    itemsContainer.innerHTML = '';
    emptyState.classList.remove('hidden');
    footer.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  footer.classList.remove('hidden');

  itemsContainer.innerHTML = cart.map(item => `
    <div class="cartItem">
      <div class="itemImage">
        <img 
          src="${item.image || ''}" 
          alt="${item.name}" 
          class="productImg"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
        />
        <div class="svgFallback hidden">
          ${generateFallback(item)}
        </div>
      </div>

      <div class="itemDetails">
        <div class="itemInfo">
          <h3 class="itemName">${item.name}</h3>
          <p class="itemMeta">${formatLKR(item.price)} &times; ${item.quantity}</p>
          <p class="itemMeta itemLineTotal">${formatLKR(item.price * item.quantity)}</p>
        </div>

        <button onclick="removeItem(${item.id})" class="removeBtn">Remove</button>
      </div>
    </div>
  `).join('');

  updateSummary();
}


function updateSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById('cart-subtotal').innerText = formatLKR(subtotal);
  document.getElementById('cart-total').innerText = formatLKR(subtotal);
}


function updateCounts() {
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').innerText = totalCartItems;
  document.getElementById('mobile-cart-count').innerText = totalCartItems;

  const wishlist = JSON.parse(localStorage.getItem('toyStore_wishlist')) || [];
  document.getElementById('wishlist-count').innerText = wishlist.length;
  document.getElementById('mobile-wishlist-count').innerText = wishlist.length;
}


function removeItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('toyStore_cart', JSON.stringify(cart));
  renderCart();
  updateCounts();
  showToast('Cart Updated', 'Item removed from cart.');
}


function clearCart() {
  cart = [];
  localStorage.setItem('toyStore_cart', JSON.stringify(cart));
  renderCart();
  updateCounts();
  showToast('Cart Cleared', 'All items removed from your cart.');
}


document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCounts();

  document.getElementById('clear-cart-btn').addEventListener('click', clearCart);

  document.getElementById('checkout-btn').addEventListener('click', () => {
    window.location.href = 'Checkout.html';
  });


  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
  });
});