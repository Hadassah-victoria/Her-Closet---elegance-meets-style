// Hamburger Toggle Script
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
}

const minRange = document.getElementById('min-price');
const maxRange = document.getElementById('max-price');
const minValue = document.getElementById('min-price-value');
const maxValue = document.getElementById('max-price-value');

const products = [
  { name: "Serene Blush Gown", price: 2999, rating: 4.8, category: "Gown", image: "dress1.jpeg" },
  { name: "Sunset Bloom Dress", price: 3450, rating: 4.6, category: "Dress", image: "dress2.jpeg" },
  { name: "Petal Whisper Midi", price: 2799, rating: 4.7, category: "Midi", image: "dress3.jpeg" },
  { name: "Blush Harmony Frock", price: 2350, rating: 4.5, category: "Frock", image: "dress4.jpeg" },
  { name: "Peach Dream Wrap", price: 3199, rating: 4.9, category: "Wrap", image: "dress5.jpeg" },
  { name: "Ivory Mist Dress", price: 2899, rating: 4.6, category: "Dress", image: "dress6.jpeg" },
  { name: "Rosé Luxe Gown", price: 3699, rating: 4.8, category: "Gown", image: "dress7.jpeg" },
  { name: "Sakura Breeze Dress", price: 2650, rating: 4.7, category: "Dress", image: "dress8.jpeg" },
  { name: "Berry Blush Slip", price: 2499, rating: 4.5, category: "Slip", image: "dress9.jpeg" },
  { name: "Velvet Blush", price: 3599, rating: 4.5, category: "Velvet", image: "dress10.jpeg" }
];

function updatePriceDisplay() {
  minValue.textContent = minRange.value;
  maxValue.textContent = maxRange.value;
}

minRange.addEventListener('input', () => {
  if (+minRange.value > +maxRange.value) minRange.value = maxRange.value;
  updatePriceDisplay();
  applyFilters();
});

maxRange.addEventListener('input', () => {
  if (+maxRange.value < +minRange.value) maxRange.value = minRange.value;
  updatePriceDisplay();
  applyFilters();
});

document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  updateCartDropdown();
  updateFavoritesDropdown();

  document.getElementById("search-input")?.addEventListener("input", applyFilters);

  document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;

    if (category === "All") {
      // If "All" clicked, deactivate all others
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    } else {
      // If any other clicked, deactivate "All"
      document.querySelector('.cat-btn[data-category="All"]')?.classList.remove("active");
      btn.classList.toggle("active");
    }

    applyFilters();
  });
});


  document.querySelectorAll(".rating-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".rating-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    });
  });

  updatePriceDisplay();
});

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exists = cart.find(item => item.name === product.name);
  if (!exists) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDropdown();
  }
}

function toggleFavorite(btn, product) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.findIndex(item => item.name === product.name);

  if (index > -1) {
    favorites.splice(index, 1);
    btn.textContent = '❤️';
    btn.classList.remove('active');
  } else {
    favorites.push(product);
    btn.textContent = '💖';
    btn.classList.add('active');
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesDropdown();
}

function updateCartDropdown() {
    const cartDropdown = document.getElementById("cart-dropdown");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cartDropdown) return;

    if (cart.length === 0) {
        cartDropdown.innerHTML = '<p>No items in cart</p>';
        return;
    }

    const items = cart.map((item, index) => `
        <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; border-radius: 5px; object-fit: cover;">
            <div style="flex-grow: 1;">
                <strong>${item.name}</strong><br>
                <small>${item.price}</small>
            </div>
            <button onclick="removeFromCart(${index})" style="background: none; border: none; font-size: 18px; cursor: pointer;">❌</button>
        </li>
    `).join('');

    cartDropdown.innerHTML = `<ul>${items}</ul>`;
}
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1); // Remove item at given index
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDropdown(); // Refresh the cart display
}


function updateFavoritesDropdown() {
  const favDropdown = document.getElementById("favorites-dropdown");
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favDropdown) return;

  if (favorites.length === 0) {
    favDropdown.innerHTML = '<p>No favorites yet</p>';
    return;
  }

  const items = favorites.map(item => `
    <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
      <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; border-radius: 5px; object-fit: cover;">
      <div>
        <strong>${item.name}</strong><br>
        <small>${item.price}</small>
      </div>
    </li>
  `).join('');

  favDropdown.innerHTML = `<ul>${items}</ul>`;
}

function clearCart() {
  localStorage.removeItem("cart");
  updateCartDropdown();
}

function clearFavorites() {
  localStorage.removeItem("favorites");
  updateFavoritesDropdown();
}

document.getElementById("favorites-icon")?.addEventListener("click", () => {
  document.getElementById("favorites-dropdown").classList.toggle("hidden");
  document.getElementById("cart-dropdown").classList.add("hidden");
});

document.getElementById("cart-icon")?.addEventListener("click", () => {
  document.getElementById("cart-dropdown").classList.toggle("hidden");
  document.getElementById("favorites-dropdown").classList.add("hidden");
});

function renderProducts(productslist) {
  const container = document.getElementById("products-list");
  container.innerHTML = "";

  if (productslist.length === 0) {
    container.innerHTML = "<p>products coming soon.</p>";
    return;
  }

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  productslist.forEach(product => {
    const isFav = favorites.find(item => item.name === product.name);
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">₹${product.price}</p>
      <p class="rating">${product.rating} ★</p>
      <div class="actions">
        <button onclick='addToCart(${JSON.stringify(product)})'>🛒</button>
        <button onclick='toggleFavorite(this, ${JSON.stringify(product)})' class='${isFav ? "active" : ""}'>${isFav ? "💖" : "❤️"}</button>
      </div>
    `;
    container.appendChild(card);
  });

  AOS.refresh(); // Call this after renderProducts()
}

function applyFilters() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase();
  const minPrice = parseInt(minRange.value);
  const maxPrice = parseInt(maxRange.value);
  const selectedRating = parseFloat(document.querySelector('.rating-btn.active')?.dataset.rating || 0);

  // Check if "All" category is selected
  const allBtn = document.querySelector('.cat-btn[data-category="All"]');
  let selectedCategories = [];

  if (allBtn?.classList.contains("active")) {
    selectedCategories = []; // No filtering by category
  } else {
    selectedCategories = [...document.querySelectorAll('.cat-btn.active')].map(btn => btn.dataset.category);
  }

  const filtered = products.filter(p => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const matchesSearch = p.name.toLowerCase().includes(searchTerm);
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
    const matchesRating = p.rating >= selectedRating;

    return matchesCategory && matchesSearch && matchesPrice && matchesRating;
  });

  renderProducts(filtered);
}


