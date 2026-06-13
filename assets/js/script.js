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

// Sorting functionality
document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("sort");
  const productGrid = document.querySelector(".product-grid");

  sortSelect.addEventListener("change", () => {
    let products = Array.from(productGrid.children);
    products.sort((a, b) => {
      let priceA = parseInt(a.querySelector("p").textContent.replace(/\D/g, ""));
      let priceB = parseInt(b.querySelector("p").textContent.replace(/\D/g, ""));
      return sortSelect.value === "low-high" ? priceA - priceB : priceB - priceA;
    });
    products.forEach(p => productGrid.appendChild(p));
  });
});

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
      cart.forEach(item => {
        let div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `<strong>${item.name}</strong> - ${item.price}`;
        cartContainer.appendChild(div);
      });
    }

    document.querySelector("main").appendChild(cartContainer);
  }
});
