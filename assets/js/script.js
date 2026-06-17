/* =========================
   LOAD HEADER & FOOTER
========================= */

async function loadComponent(id, file) {
  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error(`Failed to load ${file}`);
    }

    const html = await response.text();

    document.getElementById(id).innerHTML = html;

    if (id === "header") {
      updateCartCount();
      updateFavoritesCount();
    }
  } catch (error) {
    console.error(error);
  }
}

window.addEventListener("load", () => {
  loadComponent("header", "partials/header.html");
  loadComponent("footer", "partials/footer.html");
});

/* =========================
   STORAGE
========================= */

let cart =
  JSON.parse(localStorage.getItem("cart")) || [];

let favorites =
  JSON.parse(localStorage.getItem("favorites")) || [];

/* =========================
   COUNTERS
========================= */

function updateCartCount() {
  const count = document.getElementById("cart-count");

  if (count) {
    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    count.textContent = cart.length;
  }
}

function updateFavoritesCount() {
  const count =
    document.getElementById("favorites-count");

  if (count) {
    const favorites =
      JSON.parse(localStorage.getItem("favorites")) || [];

    count.textContent = favorites.length;
  }
}

/* =========================
   CATEGORY DROPDOWN SCROLL
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const sort = document.getElementById("sort");

  if (!sort) return;

  sort.addEventListener("change", () => {
    const target =
      document.querySelector(sort.value);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});

/* =========================
   ADD TO CART
========================= */

document.addEventListener("click", (e) => {

  if (
    e.target.classList.contains(
      "add-to-cart"
    )
  ) {
    const card =
      e.target.closest(".product-card");

    const selector =
      card.querySelector(".size-selector");

    if (selector) {
      selector.style.display = "block";
    }
  }

  if (
    e.target.classList.contains(
      "confirm-size"
    )
  ) {
    const card =
      e.target.closest(".product-card");

    const name =
      card.querySelector("h3").textContent;

    const price =
      card.querySelector("p").textContent;

    const size =
      card.querySelector(".size").value;

    if (!size) {
      alert("Please select a size.");
      return;
    }

    cart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    cart.push({
      name,
      price,
      size
    });

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    updateCartCount();

    alert(`${name} (${size}) added to cart`);

    card.querySelector(
      ".size-selector"
    ).style.display = "none";
  }
});

/* =========================
   ADD TO FAVORITES
========================= */

document.addEventListener("click", (e) => {

  if (
    e.target.classList.contains(
      "add-to-favorites"
    )
  ) {
    const card =
      e.target.closest(".product-card");

    const name =
      card.querySelector("h3").textContent;

    const price =
      card.querySelector("p").textContent;

    favorites =
      JSON.parse(
        localStorage.getItem("favorites")
      ) || [];

    favorites.push({
      name,
      price
    });

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );

    updateFavoritesCount();

    alert(`${name} added to favorites`);
  }
});

/* =========================
   FAVORITES PAGE
========================= */

document.addEventListener("DOMContentLoaded", () => {

  if (!document.title.includes("Favorites"))
    return;

  const container =
    document.createElement("div");

  container.classList.add("fav-items");

  if (favorites.length === 0) {
    container.innerHTML =
      "<p>No favorites yet.</p>";
  } else {

    favorites.forEach((item, index) => {

      const div =
        document.createElement("div");

      div.classList.add("fav-item");

      div.innerHTML = `
        <strong>${item.name}</strong>
        - ${item.price}
        <button
        class="remove-fav"
        data-index="${index}">
        Remove
        </button>
      `;

      container.appendChild(div);
    });
  }

  document
    .querySelector("main")
    .appendChild(container);

  container.addEventListener(
    "click",
    (e) => {

      if (
        e.target.classList.contains(
          "remove-fav"
        )
      ) {

        const index =
          e.target.dataset.index;

        favorites.splice(index, 1);

        localStorage.setItem(
          "favorites",
          JSON.stringify(favorites)
        );

        e.target.parentElement.remove();

        updateFavoritesCount();
      }
    }
  );
});

/* =========================
   CART PAGE
========================= */

document.addEventListener("DOMContentLoaded", () => {

  if (
    !document.title.includes(
      "Shopping Bag"
    )
  )
    return;

  const container =
    document.createElement("div");

  container.classList.add("cart-items");

  let total = 0;

  if (cart.length === 0) {

    container.innerHTML =
      "<p>Your cart is empty.</p>";

  } else {

    cart.forEach((item, index) => {

      total += parseFloat(
        item.price.replace(/₦|,/g, "")
      );

      const div =
        document.createElement("div");

      div.classList.add("cart-item");

      div.innerHTML = `
        <strong>${item.name}</strong><br>
        Size: ${item.size}<br>
        ${item.price}
        <button
        class="remove"
        data-index="${index}">
        Remove
        </button>
      `;

      container.appendChild(div);
    });

    container.innerHTML += `
      <div class="cart-total">
        <h3>
          Total:
          ₦${total.toLocaleString()}
        </h3>
      </div>
    `;
  }

  document
    .querySelector("main")
    .appendChild(container);

  container.addEventListener(
    "click",
    (e) => {

      if (
        e.target.classList.contains(
          "remove"
        )
      ) {

        const index =
          e.target.dataset.index;

        cart.splice(index, 1);

        localStorage.setItem(
          "cart",
          JSON.stringify(cart)
        );

        location.reload();
      }
    }
  );
});

/* =========================
   SEARCH
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const input =
    document.getElementById("searchInput");

  const btn =
    document.getElementById("searchBtn");

  if (btn && input) {

    btn.addEventListener("click", () => {

      const query =
        input.value.toLowerCase().trim();

      if (!query) return;

      localStorage.setItem(
        "searchQuery",
        query
      );

      window.location.href =
        "products.html";
    });
  }

  if (
    document.body.classList.contains(
      "products-page"
    )
  ) {

    const query =
      localStorage.getItem(
        "searchQuery"
      );

    if (!query) return;

    document
      .querySelectorAll(".product-card")
      .forEach((card) => {

        const name =
          card
            .querySelector("h3")
            .textContent
            .toLowerCase();

        card.style.display =
          name.includes(query)
            ? "block"
            : "none";
      });

    localStorage.removeItem(
      "searchQuery"
    );
  }
});

document.addEventListener("DOMContentLoaded",()=>{

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");


  if(menuToggle && navMenu){

    menuToggle.addEventListener("click",()=>{

      navMenu.classList.toggle("show");

    });

  }


});
