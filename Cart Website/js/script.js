const products = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, image: './wireless.jpg', category: 'Electronics' },
  { id: 2, name: 'Smart Watch', price: 199.99, image: './smartwatch.jpg', category: 'Electronics' },
  { id: 3, name: 'Cotton T-Shirt', price: 19.99, image: './tshirt.jpg', category: 'Clothing' },
  { id: 4, name: 'Leather Wallet', price: 39.99, image: './wallet.jpg', category: 'Accessories' },
  { id: 5, name: 'Gaming Mouse', price: 49.99, image: './mouse.png', category: 'Electronics' },
  { id: 6, name: 'Sneakers', price: 89.99, image: './sneakers.jpg', category: 'Clothing' }
];

let cart = JSON.parse(localStorage.getItem('swiftcart_cart')) || [];

function saveCart() {
  localStorage.setItem('swiftcart_cart', JSON.stringify(cart));
}

function addToCart(productId, name, price, image) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, name, price, image, quantity: 1 });
  }
  saveCart();
  updateCartBadge();
  alert(`${name} added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartBadge();
  renderCart();
}

function updateQuantity(productId, qty) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = Math.max(1, qty);
    if (item.quantity === 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      updateCartBadge();
      renderCart();
    }
  }
}

function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems || 0;
    badge.style.display = totalItems ? 'flex' : 'none';
  }
}

function renderCart() {
  const cartEl = document.getElementById('cart-items');
  const summaryEl = document.getElementById('order-summary');
  if (!cartEl || !summaryEl) return;

  if (cart.length === 0) {
    cartEl.innerHTML = '<p>Your cart is empty. <a href="index.html">Continue shopping</a></p>';
    summaryEl.innerHTML = '';
    return;
  }

  cartEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>$${item.price}</p>
        <div class="quantity">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
      </div>
      <button class="btn-secondary" onclick="removeFromCart(${item.id})">Remove</button>
    </div>
  `).join('');

  const subtotal = getCartTotal();
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  summaryEl.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>$${shipping.toFixed(2)}</span></div>
    <div class="summary-row"><span>Tax</span><span>$${tax.toFixed(2)}</span></div>
    <hr>
    <div class="summary-row" style="font-size:1.2rem; font-weight:bold;"><span>Total</span><span>$${total.toFixed(2)}</span></div>
  `;
}

const ADMIN_CREDENTIALS = { email: 'admin@swiftcart.com', password: 'admin123' };

function login(email, password, role) {
  if (role === 'admin' && email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem('userRole', 'admin');
  } else {
    localStorage.setItem('userRole', 'user');
  }
  return localStorage.getItem('userRole');
}

function logout() {
  localStorage.removeItem('userRole');
  window.location.href = 'login.html';
}

function getRole() {
  return localStorage.getItem('userRole');
}

function updateNav() {
  const role = getRole();
  const adminLink = document.getElementById('admin-link');
  const logoutBtn = document.getElementById('logout-btn');
  if (adminLink) adminLink.style.display = role === 'admin' ? 'block' : 'none';
  if (logoutBtn) logoutBtn.style.display = role ? 'block' : 'none';
  
  if (!role && !window.location.pathname.includes('login.html')) {
    window.location.href = 'login.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  updateNav();

  const filters = document.querySelectorAll('input[name="category"]');
  filters.forEach(filter => {
    filter.addEventListener('change', () => {
      console.log('Filter applied:', filter.value);
    });
  });

  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Order placed successfully! (Mock)');
    });
  }

  if (document.getElementById('cart-items')) {
    renderCart();
  }
});

window.login = login;
window.logout = logout;
window.getRole = getRole;
window.updateNav = updateNav;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.renderCart = renderCart;
