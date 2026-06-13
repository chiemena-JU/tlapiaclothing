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

// Cart functionality
document.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    alert("Added to cart: " + e.target.parentElement.querySelector("h3").textContent);
  }
});
