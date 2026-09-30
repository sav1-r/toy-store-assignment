// JSON Product Data matching user specifications
const productsData = [
  {
    "id": 1,
    "name": "Green Tyrannosaurus Rex Figurine",
    "image": "img/trex.jpg",
    "price": 3900,
    "color": "#3399ff"
  },
  {
    "id": 2,
    "name": "Colorful Plastic Building Bricks",
    "image": "img/bricks.jpg",
    "price": 6000,
    "color": "#5a4dff"
  },
  {
    "id": 3,
    "name": "Classic Plush Teddy Bear with Bow",
    "image": "img/teddy.jpg",
    "price": 4650,
    "color": "#3399ff"
  },
  {
    "id": 4,
    "name": "Vintage Wind-Up Metal Robot",
    "image": "img/robot.jpg",
    "price": 7500,
    "color": "#3399ff"
  },
  {
    "id": 5,
    "name": "Rainbow Plush Unicorn Toy",
    "image": "img/unicorn.jpg",
    "price": 5500,
    "color": "#5a4dff"
  },
  {
    "id": 6,
    "name": "Rainbow Stacking Rings Toy",
    "image": "img/ringstack.jpg",
    "price": 3000,
    "color": "#3399ff"
  },
  {
    "id": 7,
    "name": "Colorful Wooden Toy Train",
    "image": "img/train.jpg",
    "price": 4200,
    "color": "#3399ff"
  },
  {
    "id": 8,
    "name": "Red Wooden Toy Aeroplane",
    "image": "img/plane.jpg",
    "price": 3800,
    "color": "#5a4dff"
  }
];


let cart = JSON.parse(localStorage.getItem('toyStore_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('toyStore_wishlist')) || [];


function formatLKR(amount) {
  return 'LKR ' + amount.toLocaleString('en-US');
}


function generateFallback(item) {
  const initial = item.name.charAt(0).toUpperCase();
  return `
    <div class="fallbackBox" style="background-color: ${item.color}">
      <span class="fallbackLetter">${initial}</span>
    </div>
  `;
}


function renderProducts(items) {
  const container = document.getElementById('products-container');
  const noResults = document.getElementById('no-results');

  if (items.length === 0) {
    container.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');
  
  container.innerHTML = items.map(item => {
    const isWishlisted = wishlist.some(w => w.id === item.id);

    return `
      <div class="card">

        <!-- Wishlist Toggle (Top-Right of Card) -->
        <button 
          onclick="toggleWishlist(${item.id})"
          class="wishlistBtn ${isWishlisted ? 'active' : ''}"
        >
          ${isWishlisted ? 'wishlisted' : 'wishlist'}
        </button>

        <!-- Image Area -->
        <div class="imgBox">
          <img 
            src="${item.image}" 
            alt="${item.name}" 
            class="productImg"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
          />
          <!-- Fallback artwork if image file not found locally -->
          <div class="svgFallback hidden">
            ${generateFallback(item)}
          </div>
        </div>

        <!-- Title & Price -->
        <div class="cardInfo">
          <h3 class="productName">${item.name}</h3>
          <p class="productPrice">${formatLKR(item.price)}</p>
        </div>

        <!-- Stock & Add to Cart -->
        <div class="cardFooter">
          <span class="stockLabel">In Stock</span>
          <button 
            onclick="addToCart(${item.id})" 
            class="btn"
          >
            Add to Cart
          </button>
        </div>

      </div>
    `;
  }).join('');
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


function addToCart(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('toyStore_cart', JSON.stringify(cart));
  updateCounts();
  showToast('Added to Cart', `${product.name} added!`);
}


function toggleWishlist(productId) {
  const product = productsData.find(p => p.id === productId);
  const index = wishlist.findIndex(w => w.id === productId);

  if (index > -1) {
    wishlist.splice(index, 1);
    showToast('Wishlist Updated', `Removed from Wishlist`);
  } else {
    wishlist.push({ ...product, status: 'Interested' });
    showToast('Wishlist Updated', `${product.name} saved!`);
  }

  localStorage.setItem('toyStore_wishlist', JSON.stringify(wishlist));
  updateCounts();
  

  filterProducts();
}


function updateCounts() {
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').innerText = totalCartItems;
  document.getElementById('mobile-cart-count').innerText = totalCartItems;

  document.getElementById('wishlist-count').innerText = wishlist.length;
  document.getElementById('mobile-wishlist-count').innerText = wishlist.length;
}


function filterProducts() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const filtered = productsData.filter(item => 
    item.name.toLowerCase().includes(query)
  );
  renderProducts(filtered);
}


document.addEventListener('DOMContentLoaded', () => {
  renderProducts(productsData);
  updateCounts();


  document.getElementById('search-input').addEventListener('input', filterProducts);
  document.getElementById('search-btn').addEventListener('click', filterProducts);


  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
  });
});