/*
  ==============================================
  PRODUCT MANAGEMENT
  ==============================================
  Add, remove, or edit products only in this array.
  The cards, filters, search, wishlist and details
  page update automatically.
*/

const products = [
  {
    id: "p1",
    name: "RGB Gaming Mouse",
    price: 549,
    oldPrice: 999,
    category: "Gaming",
    marketplace: "Amazon",
    image: "images/product1.svg",
    link: "https://www.amazon.in/",
    description: "Ergonomic RGB gaming mouse with adjustable DPI and programmable buttons."
  },
  {
    id: "p2",
    name: "Wireless Earbuds",
    price: 799,
    oldPrice: 1499,
    category: "Electronics",
    marketplace: "Flipkart",
    image: "images/product2.svg",
    link: "https://www.flipkart.com/",
    description: "Compact wireless earbuds with a charging case and everyday listening battery life."
  },
  {
    id: "p3",
    name: "Minimal Sling Bag",
    price: 699,
    oldPrice: 1299,
    category: "Fashion",
    marketplace: "Myntra",
    image: "images/product3.svg",
    link: "https://www.myntra.com/",
    description: "Clean, compact sling bag designed for phones, cards, keys and daily essentials."
  },
  {
    id: "p4",
    name: "Smart LED Desk Lamp",
    price: 899,
    oldPrice: 1599,
    category: "Home",
    marketplace: "Amazon",
    image: "images/product1.svg",
    link: "https://www.amazon.in/",
    description: "Modern LED desk lamp with adjustable brightness for study, work and bedside use."
  },
  {
    id: "p5",
    name: "Mechanical Gaming Keyboard",
    price: 1499,
    oldPrice: 2499,
    category: "Gaming",
    marketplace: "Flipkart",
    image: "images/product2.svg",
    link: "https://www.flipkart.com/",
    description: "Compact mechanical keyboard with tactile switches and RGB backlighting."
  },
  {
    id: "p6",
    name: "Magnetic Phone Stand",
    price: 399,
    oldPrice: 699,
    category: "Accessories",
    marketplace: "Amazon",
    image: "images/product3.svg",
    link: "https://www.amazon.in/",
    description: "Foldable magnetic stand for a cleaner desk and convenient hands-free viewing."
  },
  {
    id: "p7",
    name: "Smart Fitness Band",
    price: 1199,
    oldPrice: 1999,
    category: "Gadgets",
    marketplace: "Amazon",
    image: "images/product2.svg",
    link: "https://www.amazon.in/",
    description: "Lightweight fitness band with activity tracking, alerts and a bright display."
  },
  {
    id: "p8",
    name: "Everyday Oversized Tee",
    price: 499,
    oldPrice: 899,
    category: "Fashion",
    marketplace: "Myntra",
    image: "images/product1.svg",
    link: "https://www.myntra.com/",
    description: "Soft everyday oversized T-shirt with a relaxed fit and minimal styling."
  }
];

let activeCategory = "All";
let wishlist = loadWishlist();

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const productGrid = document.getElementById("productGrid");
const wishlistGrid = document.getElementById("wishlistGrid");
const wishlistEmpty = document.getElementById("wishlistEmpty");
const wishlistCount = document.getElementById("wishlistCount");
const resultsLabel = document.getElementById("resultsLabel");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const emptyState = document.getElementById("emptyState");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const themeToggle = document.getElementById("themeToggle");
const toast = document.getElementById("toast");

function calculateDiscount(price, oldPrice) {
  if (!Number.isFinite(price) || !Number.isFinite(oldPrice) || oldPrice <= 0 || price >= oldPrice) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

function uniqueCategories() {
  return [...new Set(products.map(product => product.category))].sort();
}

function populateCategoryFilter() {
  uniqueCategories().forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let list = products.filter(product => {
    const text = `${product.name} ${product.category} ${product.marketplace} ${product.description}`.toLowerCase();
    const queryMatch = !query || text.includes(query);
    const categoryMatch = activeCategory === "All" || product.category === activeCategory;
    const selectMatch = categoryFilter.value === "All" || product.category === categoryFilter.value;
    return queryMatch && categoryMatch && selectMatch;
  });

  switch (sortFilter.value) {
    case "priceLow":
      list.sort((a, b) => a.price - b.price);
      break;
    case "priceHigh":
      list.sort((a, b) => b.price - a.price);
      break;
    case "discountHigh":
      list.sort((a, b) => calculateDiscount(b.price, b.oldPrice) - calculateDiscount(a.price, a.oldPrice));
      break;
    case "nameAZ":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  renderProducts(list);
}

function renderProducts(list) {
  productGrid.innerHTML = list.map(createCard).join("");
  resultsLabel.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
  emptyState.classList.toggle("hidden", list.length > 0);
}

function createCard(product) {
  const discount = calculateDiscount(product.price, product.oldPrice);
  const isSaved = wishlist.includes(product.id);

  return `
    <article class="product-card">
      <div class="card-media">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
        ${discount ? `<span class="deal-badge">-${discount}% OFF</span>` : ""}
        <button class="wishlist-btn ${isSaved ? "active" : ""}" onclick="toggleWishlist('${product.id}')" aria-label="${isSaved ? "Remove from wishlist" : "Add to wishlist"}">
          ${isSaved ? "♥" : "♡"}
        </button>
      </div>

      <div class="card-body">
        <span class="marketplace-badge">${escapeHtml(product.marketplace)}</span>
        <h3 class="product-name">${escapeHtml(product.name)}</h3>
        <p class="card-description">${escapeHtml(product.description)}</p>

        <div class="price-row">
          <span class="current-price">${money.format(product.price)}</span>
          ${product.oldPrice > product.price ? `<span class="original-price">${money.format(product.oldPrice)}</span>` : ""}
        </div>

        <div class="card-footer">
          <button class="view-btn" onclick="openProduct('${product.id}')">View details</button>
          <a class="buy-btn btn" href="${escapeHtml(product.link)}" target="_blank" rel="noopener noreferrer">Buy ↗</a>
        </div>
      </div>
    </article>
  `;
}

function renderWishlist() {
  const savedProducts = wishlist
    .map(id => products.find(product => product.id === id))
    .filter(Boolean);

  wishlistGrid.innerHTML = savedProducts.map(createCard).join("");
  wishlistEmpty.classList.toggle("hidden", savedProducts.length > 0);
  wishlistCount.textContent = savedProducts.length;
}

function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(item => item !== id);
    showToast("Removed from wishlist");
  } else {
    wishlist = [...wishlist, id];
    showToast("Saved to wishlist");
  }

  saveWishlist();
  filterProducts();
  renderWishlist();
}

function saveWishlist() {
  localStorage.setItem("dealora-wishlist", JSON.stringify(wishlist));
}

function loadWishlist() {
  try {
    const saved = JSON.parse(localStorage.getItem("dealora-wishlist") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function openProduct(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const discount = calculateDiscount(product.price, product.oldPrice);

  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalImage").alt = product.name;
  document.getElementById("modalTitle").textContent = product.name;
  document.getElementById("modalMarketplace").textContent = product.marketplace;
  document.getElementById("modalPrice").textContent = money.format(product.price);
  document.getElementById("modalOldPrice").textContent = product.oldPrice > product.price ? money.format(product.oldPrice) : "";
  document.getElementById("modalDescription").textContent = product.description;
  document.getElementById("modalCategory").textContent = product.category;
  document.getElementById("modalDiscount").textContent = discount ? `-${discount}% OFF` : "DEAL";
  document.getElementById("modalDiscountText").textContent = discount ? `${discount}% savings` : "Special price";
  document.getElementById("modalBuyNow").href = product.link;

  document.getElementById("productModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("productModal").classList.add("hidden");
  document.body.style.overflow = "";
}

function goHome() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function clearFilters() {
  searchInput.value = "";
  activeCategory = "All";
  categoryFilter.value = "All";
  sortFilter.value = "featured";
  document.querySelectorAll(".category-pill").forEach(btn => btn.classList.toggle("active", btn.dataset.category === "All"));
  filterProducts();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", () => {
  activeCategory = "All";
  document.querySelectorAll(".category-pill").forEach(btn => btn.classList.remove("active"));
  filterProducts();
});
sortFilter.addEventListener("change", filterProducts);

document.querySelectorAll(".category-pill").forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    categoryFilter.value = "All";
    document.querySelectorAll(".category-pill").forEach(btn => btn.classList.toggle("active", btn === button));
    filterProducts();
  });
});

document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters);

document.querySelectorAll("[data-close-modal]").forEach(element => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => mobileMenu.classList.remove("open"));
});

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("dealora-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀" : "◐";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme || "light";
  applyTheme(current === "dark" ? "light" : "dark");
});

const savedTheme = localStorage.getItem("dealora-theme");
applyTheme(savedTheme === "dark" ? "dark" : "light");

populateCategoryFilter();
filterProducts();
renderWishlist();
