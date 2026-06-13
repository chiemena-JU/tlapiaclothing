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
      let total = 0;
      cart.forEach((item, index) => {
        let div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
          <strong>${item.name}</strong> - ${item.price}
          <button class="remove" data-index="${index}">Remove</button>
        `;
        cartContainer.appendChild(div);

        // Extract numeric price
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
        location.reload(); // refresh cart page
      });
    });
  }
});


// Simple favorites storage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Add to favorites
document.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" && e.target.textContent.includes("Add to Favorites")) {
    let productName = e.target.parentElement.querySelector("h3").textContent;
    let productPrice = e.target.parentElement.querySelector("p").textContent;
    favorites.push({ name: productName, price: productPrice });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(productName + " added to favorites!");
  }
});

// Show favorites if on favorites.html
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

    // Remove favorite functionality
    document.querySelectorAll(".remove-fav").forEach(btn => {
      btn.addEventListener("click", () => {
        let index = btn.getAttribute("data-index");
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        location.reload(); // refresh favorites page
      });
    });
  }
});

// Search functionality
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      let query = searchInput.value.toLowerCase();
      let products = document.querySelectorAll(".product-card");

      products.forEach(product => {
        let name = product.querySelector("h3").textContent.toLowerCase();
        if (name.includes(query)) {
          product.style.display = "block";
        } else {
          product.style.display = "none";
        }
      });
    });
  }
});


