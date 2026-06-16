// Utility: Load header and footer
async function loadComponent(id, file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Failed to load ${file}`);
    const text = await response.text();
    document.getElementById(id).innerHTML = text;

    // Attach mobile menu toggle after header loads
    if (id === "header") {
      const menuToggle = document.getElementById("menuToggle");
      const navMenu = document.getElementById("navMenu");
      if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
          navMenu.classList.toggle("show");
          navMenu.style.maxHeight = navMenu.classList.contains("show")
            ? navMenu.scrollHeight + "px"
            : null;
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}

window.onload = () => {
  loadComponent("header", "partials/header.html");
  loadComponent("footer", "partials/footer.html");
};

// Sorting (products page)
document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("sort");
  const productGrid = document.querySelector(".product-grid");

  if (sortSelect && productGrid) {
    sortSelect.addEventListener("change", () => {
      let products = Array.from(productGrid.children);
      products.sort((a, b) => {
        let priceA = parseFloat(a.querySelector("p").textContent.replace(/₦|,/g, ""));
        let priceB = parseFloat(b.querySelector("p").textContent.replace(/₦|,/g, ""));
        return sortSelect.value === "low-high" ? priceA - priceB : priceB - priceA;
      });
      products.forEach(p => productGrid.appendChild(p));
    });
  }
});

// Cart storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to cart
document.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" && e.target.textContent.includes("Add to Cart")) {
    let productName = e.target.parentElement.querySelector("h3").textContent;
    let productPrice = e.target.parentElement.querySelector("p").textContent;
    cart.push({ name: productName, price: productPrice });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${productName} added to cart!`);
  }
});

// Show cart items (cart.html)
document.addEventListener("DOMContentLoaded", () => {
  if (document.title.includes("Shopping Bag")) {
    let cartContainer = document.createElement("div");
    cartContainer.classList.add("cart-items");

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      let total = 0;
      cart.forEach((item, index) => {
        let div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
          <strong>${item.name}</strong> - ${item.price}
          <button class="remove" data-index="${index}">Remove</button>
        `;
        cartContainer.appendChild(div);

        total += parseFloat(item.price.replace(/₦|,/g, ""));
      });

      let totalDiv = document.createElement("div");
      totalDiv.classList.add("cart-total");
      totalDiv.innerHTML = `<h3>Total: ₦${total.toLocaleString()}</h3>`;
      cartContainer.appendChild(totalDiv);
    }

    document.querySelector("main").appendChild(cartContainer);

    // Remove item instantly (no reload)
    cartContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove")) {
        let index = e.target.getAttribute("data-index");
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        e.target.parentElement.remove();
      }
    });
  }
});

// Favorites storage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Add to favorites
document.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" && e.target.textContent.includes("Add to Favorites")) {
    let productName = e.target.parentElement.querySelector("h3").textContent;
    let productPrice = e.target.parentElement.querySelector("p").textContent;
    favorites.push({ name: productName, price: productPrice });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${productName} added to favorites!`);
  }
});

// Show favorites (favorites.html)
document.addEventListener("DOMContentLoaded", () => {
  if (document.title.includes("Favorites")) {
    let favContainer = document.createElement("div");
    favContainer.classList.add("fav-items");

    if (favorites.length === 0) {
      favContainer.innerHTML = "<p>You haven’t added any favorites yet.</p>";
    } else {
      favorites.forEach((item, index) => {
        let div = document.createElement("div");
        div.classList.add("fav-item");
        div.innerHTML = `
          <strong>${item.name}</strong> - ${item.price}
          <button class="remove-fav" data-index="${index}">Remove</button>
        `;
        favContainer.appendChild(div);
      });
    }

    document.querySelector("main").appendChild(favContainer);

    // Remove favorite instantly
    favContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-fav")) {
        let index = e.target.getAttribute("data-index");
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        e.target.parentElement.remove();
      }
    });
  }
});

// Global search (header bar)
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
      let query = searchInput.value.toLowerCase().trim();
      if (query) {
        localStorage.setItem("searchQuery", query);
        window.location.href = "products.html";
      } else {
        alert("Please enter a search term.");
      }
    });
  }

  // Apply search filter on products page
  if (document.body.classList.contains("products-page")) {
    let query = localStorage.getItem("searchQuery");
    if (query) {
      let products = document.querySelectorAll(".product-card");
      products.forEach(product => {
        let name = product.querySelector("h3").textContent.toLowerCase();
        product.style.display = name.includes(query) ? "block" : "none";
      });
      localStorage.removeItem("searchQuery");
    }
  }
});

// Checkout flow
document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }

  // Checkout page summary
  if (document.title.includes("Checkout")) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let summary = document.getElementById("order-summary");

    if (cart.length === 0) {
      summary.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      let total = 0;
      cart.forEach(item => {
        let div = document.createElement("div");
        div.innerHTML = `<strong>${item.name}</strong> - ${item.price}`;
        summary.appendChild(div);

        total += parseFloat(item.price.replace(/₦|,/g, ""));
      });

      let totalDiv = document.createElement("div");
      totalDiv.innerHTML = `<h3>Total: ₦${total.toLocaleString()}</h3>`;
      summary.appendChild(totalDiv);
    }

    const placeOrderBtn = document.getElementById("placeOrderBtn");
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener("click", () => {
        let paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        localStorage.setItem("lastOrder", JSON.stringify({ cart, paymentMethod }));
        localStorage.removeItem("cart");
        window.location.href = "confirmation.html";
      });
    }
  }

  // Confirmation page
  if (document.title.includes("Order Confirmation")) {
    let details = document.getElementById("confirmation-details");
    let order = JSON.parse(localStorage.getItem("lastOrder"));

    if (order) {
      order.cart.forEach(item => {
        let div = document.createElement("div");
        div.innerHTML = `<strong>${item.name}</strong> - ${item.price}`;
        details.appendChild(div);
      });

      let paymentDiv = document.createElement("div");
      paymentDiv.innerHTML = `<p>Payment Method: <strong>${order.paymentMethod === "delivery" ? "Pay on Delivery" : "Card Payment (Simulation)"}</strong></p>`;
      details.appendChild(paymentDiv);

      // Clear last order after showing
      localStorage.removeItem("lastOrder");
    } else {
      details.innerHTML = "<p>No order found.</p>";
    }
  }
});

// Update cart count badge
function updateCartCount() {
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartCountEl.textContent = cart.length;
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", updateCartCount);

// Also update whenever an item is added to cart
document.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" && e.target.textContent.includes("Add to Cart")) {
    setTimeout(updateCartCount, 100); // slight delay to refresh count
  }
});
