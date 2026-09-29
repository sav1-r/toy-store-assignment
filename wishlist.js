
let wishlist = JSON.parse(localStorage.getItem('toyStore_wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('toyStore_cart')) || [];
let activeFilter = 'All';


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


function updateCounts() {
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').innerText = totalCartItems;
  document.getElementById('mobile-cart-count').innerText = totalCartItems;

  document.getElementById('wishlist-count').innerText = wishlist.length;
  document.getElementById('mobile-wishlist-count').innerText = wishlist.length;
}


function persistWishlist() {
  localStorage.setItem('toyStore_wishlist', JSON.stringify(wishlist));
}


function renderWishlist() {
  const container = document.getElementById('wishlist-items');
  const emptyState = document.getElementById('wishlist-empty');

  const visibleItems = activeFilter === 'All'
    ? wishlist
    : wishlist.filter(item => item.status === activeFilter);

  if (wishlist.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    document.getElementById('wishlist-filters').classList.add('hidden');
    return;
  }

  document.getElementById('wishlist-filters').classList.remove('hidden');
  emptyState.classList.add('hidden');

  const statuses = ['Interested', 'Owned', 'Not Interested'];

  container.innerHTML = visibleItems.map(item => `
    <div class="wishlistItem">
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
          <p class="itemMeta">${formatLKR(item.price)}</p>
        </div>

        <div class="statusOptions">
          ${statuses.map(status => `
            <button 
              class="statusOption ${item.status === status ? 'selected' : ''}" 
              onclick="setStatus(${item.id}, '${status}')"
            >${status}</button>
          `).join('')}
        </div>
      </div>

      <div class="wishlistItemActions">
        <button onclick="addToCartFromWishlist(${item.id})" class="btn">Add to Cart</button>
        <button onclick="removeFromWishlist(${item.id})" class="removeBtn">Remove</button>
      </div>
    </div>
  `).join('');
}


function setStatus(productId, status) {
  const item = wishlist.find(w => w.id === productId);
  if (!item) return;

  item.status = status;
  persistWishlist();
  renderWishlist();
}


function removeFromWishlist(productId) {
  wishlist = wishlist.filter(w => w.id !== productId);
  persistWishlist();
  updateCounts();
  renderWishlist();
  showToast('Wishlist Updated', 'Item removed from wishlist.');
}


function addToCartFromWishlist(productId) {
  const item = wishlist.find(w => w.id === productId);
  if (!item) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: item.id, name: item.name, image: item.image, price: item.price, color: item.color, quantity: 1 });
  }

  localStorage.setItem('toyStore_cart', JSON.stringify(cart));
  updateCounts();
  showToast('Added to Cart', `${item.name} added!`);
}


function setupFilters() {
  const tabs = document.querySelectorAll('.filterTab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      renderWishlist();
    });
  });
}


document.addEventListener('DOMContentLoaded', () => {
  renderWishlist();
  updateCounts();
  setupFilters();


  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
  });
});
