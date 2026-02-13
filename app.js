const products = [
  { id: "gv-core-white", name: "GV Core Tee — White", price: 30, sizes: ["XS", "S", "M", "L", "XL"] },
  { id: "gv-core-black", name: "GV Core Tee — Black", price: 30, sizes: ["XS", "S", "M", "L", "XL"] },
  { id: "gv-sand", name: "GV Sand Tee", price: 30, sizes: ["XS", "S", "M", "L", "XL"] },
  { id: "gv-stone", name: "GV Stone Tee", price: 30, sizes: ["XS", "S", "M", "L", "XL"] },
  { id: "gv-olive", name: "GV Olive Tee", price: 30, sizes: ["XS", "S", "M", "L", "XL"] },
  { id: "gv-charcoal", name: "GV Charcoal Tee", price: 30, sizes: ["XS", "S", "M", "L", "XL"] },
  { id: "gv-goldmark", name: "GV Goldmark Tee", price: 30, sizes: ["XS", "S", "M", "L", "XL"] }
];

const CART_KEY = "golden-values-cart";

const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
const setCart = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items));

function addToCart(id, size = "M") {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  const cart = getCart();
  cart.push({ id: product.id, name: product.name, price: product.price, size });
  setCart(cart);
  renderCart();
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  setCart(cart);
  renderCart();
}

function renderProducts(targetId, subset = products) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.innerHTML = subset
    .map(
      (p) => `
      <article class="card product-card">
        <a href="product.html?id=${p.id}" class="media" aria-label="${p.name}"></a>
        <div class="content">
          <h3>${p.name}</h3>
          <p class="price">${p.price}€</p>
          <button class="btn" onclick="addToCart('${p.id}', 'M')">Add to cart</button>
        </div>
      </article>`
    )
    .join("");
}

function renderProductDetail() {
  const title = document.getElementById("product-title");
  if (!title) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || products[0].id;
  const product = products.find((p) => p.id === id) || products[0];

  title.textContent = product.name;
  document.getElementById("product-price").textContent = `${product.price}€`;

  const sizeWrap = document.getElementById("size-selector");
  sizeWrap.innerHTML = product.sizes
    .map((s, i) => `<button class="pill ${i === 2 ? "active" : ""}" data-size="${s}">${s}</button>`)
    .join("");

  let selectedSize = "M";
  sizeWrap.querySelectorAll(".pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeWrap.querySelectorAll(".pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSize = btn.dataset.size;
    });
  });

  const addBtn = document.getElementById("add-product-btn");
  addBtn.addEventListener("click", () => addToCart(product.id, selectedSize));
}

function renderCart() {
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const countEls = document.querySelectorAll("[data-cart-count]");
  if (!itemsEl || !totalEl) return;

  const cart = getCart();
  countEls.forEach((el) => (el.textContent = cart.length));

  if (!cart.length) {
    itemsEl.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "0€";
    return;
  }

  itemsEl.innerHTML = cart
    .map(
      (item, i) => `
      <div class="cart-item">
        <strong>${item.name}</strong>
        <p>Size ${item.size} · ${item.price}€</p>
        <button class="btn" onclick="removeFromCart(${i})">Remove</button>
      </div>`
    )
    .join("");

  totalEl.textContent = `${cart.reduce((sum, item) => sum + item.price, 0)}€`;
}

function bindCartUI() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("overlay");
  const openBtns = document.querySelectorAll("[data-open-cart]");
  const closeBtn = document.getElementById("close-cart");

  if (!drawer || !overlay) return;

  const open = () => {
    drawer.classList.add("open");
    overlay.classList.add("show");
  };

  const close = () => {
    drawer.classList.remove("open");
    overlay.classList.remove("show");
  };

  openBtns.forEach((btn) => btn.addEventListener("click", open));
  closeBtn?.addEventListener("click", close);
  overlay.addEventListener("click", close);
}

function markActiveNav() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts("home-products", products.slice(0, 3));
  renderProducts("shop-products", products);
  renderProducts("featured-products", products.slice(3, 7));
  renderProductDetail();
  renderCart();
  bindCartUI();
  markActiveNav();
});
