
let cart = JSON.parse(localStorage.getItem('toyStore_cart')) || [];


function showToast(title, message) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-title').innerText = title;
  document.getElementById('toast-message').innerText = message;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}


function addToCart(productId, productName, productPrice) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
  }

  localStorage.setItem('toyStore_cart', JSON.stringify(cart));
  updateCounts();
  showToast('Added to Cart', `${productName} added!`);
}


function updateCounts() {
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').innerText = totalCartItems;
  document.getElementById('mobile-cart-count').innerText = totalCartItems;

  const wishlist = JSON.parse(localStorage.getItem('toyStore_wishlist')) || [];
  document.getElementById('wishlist-count').innerText = wishlist.length;
  document.getElementById('mobile-wishlist-count').innerText = wishlist.length;
}


document.addEventListener('DOMContentLoaded', () => {
  updateCounts();


  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
  });
});
