// Elements
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsList = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const productButtons = document.querySelectorAll('.product button, .featured-product button');

let cart = [];

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Toggle mobile nav menu
menuToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// Toggle cart sidebar visibility
cartIcon.addEventListener('click', () => {
  cartSidebar.classList.toggle('visible');
});

// Close cart sidebar
closeCartBtn.addEventListener('click', () => {
  cartSidebar.classList.remove('visible');
});

// Update cart UI
function updateCartUI() {
  cartItemsList.innerHTML = '';

  if (cart.length === 0) {
    cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
    cartCount.textContent = '0';
    cartTotal.textContent = '0.00';
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const li = document.createElement('li');

    li.innerHTML = `
      <span class="name">${item.name}</span>
      <div class="qty-controls">
        <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
      </div>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
      <button class="remove-btn" data-index="${index}" title="Remove item">&times;</button>
    `;

    cartItemsList.appendChild(li);
  });

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = total.toFixed(2);
}

// Add item to cart
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price: parseFloat(price), quantity: 1 });
  }
  saveCart();
  updateCartUI();
  cartSidebar.classList.add('visible'); // Open cart when adding
}

// Handle quantity and remove buttons in cart
cartItemsList.addEventListener('click', (e) => {
  const index = e.target.getAttribute('data-index');
  const action = e.target.getAttribute('data-action');

  if (index === null) return;

  if (e.target.classList.contains('qty-btn')) {
    if (action === 'increase') {
      cart[index].quantity++;
    } else if (action === 'decrease') {
      cart[index].quantity--;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
    }
  } else if (e.target.classList.contains('remove-btn')) {
    cart.splice(index, 1);
  }

  saveCart();
  updateCartUI();
});

// Checkout button
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert(`Thank you for your purchase! Total: $${cartTotal.textContent}`);
  cart = [];
  saveCart();
  updateCartUI();
  cartSidebar.classList.remove('visible');
});

// Add to Cart buttons on products (including featured)
productButtons.forEach(button => {
  button.addEventListener('click', () => {
    const name = button.getAttribute('data-name');
    const price = button.getAttribute('data-price');
    addToCart(name, price);
  });
});

// Smooth scroll for nav links and contact section fade-in
document.querySelectorAll('nav a.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    if (!targetSection) return;

    // Scroll smoothly
    targetSection.scrollIntoView({ behavior: 'smooth' });

    // If contact section, add fade-in class
    if (targetId === 'contact') {
      // Remove visible class first to restart animation if needed
      targetSection.classList.remove('visible');
      // Trigger reflow to restart CSS animation
      void targetSection.offsetWidth;
      targetSection.classList.add('visible');
    }

    // Close mobile nav if open
    nav.classList.remove('active');
  });
});

// Initialize
loadCart();
updateCartUI();
