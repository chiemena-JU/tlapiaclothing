// Function to load header and footer into pages
async function loadComponent(id, file) {
  const response = await fetch(file);
  const text = await response.text();
  document.getElementById(id).innerHTML = text;
}

// Load them when the page opens
window.onload = () => {
  loadComponent("header", "partials/header.html");
  loadComponent("footer", "partials/footer.html");
};

// Simple cart storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to cart
document.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" && e.target.textContent.includes("Add to Cart")) {
    let productName = e.target.parentElement.querySelector("h3").textContent;
    let productPrice = e.target.parentElement.querySelector("p").textContent;
    cart.push({ name: productName, price: productPrice });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(productName + " added to cart!");
  }
});

// Show cart items if on cart.html
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

        let priceNum = parseInt(item.price.replace(/\D/g, ""));
        total += priceNum;
      });

      let totalDiv = document.createElement("div");
      totalDiv.classList.add("cart-total");
      totalDiv.innerHTML = `<h3>Total: ₦${total.toLocaleString()}</h3>`;
      cartContainer.appendChild(totalDiv);
    }

    document.querySelector("main").appendChild(cartContainer);

    // Remove item functionality
    document.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", () => {
        let index = btn.getAttribute("data-index");
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        location.reload();
      });
    });
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

        let priceNum = parseInt(item.price.replace(/\D/g, ""));
        total += priceNum;
      });

      let totalDiv = document.createElement("div");
      totalDiv.innerHTML = `<h3>Total: ₦${total.toLocaleString()}</h3>`;
      summary.appendChild(totalDiv);
    }

    // Place Order button with payment simulation + redirect
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener("click", () => {
        let paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Save order details temporarily
        localStorage.setItem("lastOrder", JSON.stringify({ cart, paymentMethod }));

        // Clear cart
        localStorage.removeItem("cart");

        // Redirect to confirmation page
        window.location.href = "confirmation.html";
      });
    }
  }

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

