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

  const menuToggle =
    document.getElementById("menuToggle");

  const navMenu =
    document.getElementById("navMenu");

  if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

      navMenu.classList.toggle("show");

    });

  }
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

   const image =
  card.querySelector("img").src;

cart.push({
  name,
  price,
  size,
  image
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
  <div class="cart-card">

    <div class="cart-image">
      <img
        src="${item.image || 'assets/images/placeholder.png'}"
        alt="${item.name}">
    </div>

    <div class="cart-details">
  <h3>${item.name}</h3>
  <p>Size: ${item.size}</p>
  <p>Qty: 1</p>
  
      <button
        class="remove"
        data-index="${index}">
        🗑 Remove
      </button>
    </div>

    <div class="cart-price">
      <h2>${item.price}</h2>
    </div>

  </div>
`;

      container.appendChild(div);
    });

    container.innerHTML += `
<div class="cart-summary">
  <h2>Cart Summary</h2>

  <p>
    Items:
    ${cart.length}
  </p>

  <h3>
    ₦${total.toLocaleString()}
  </h3>

  <button id="checkoutBtn">
    Checkout
  </button>
</div>
`;

  }

  document
  .querySelector("main")
  .appendChild(container);

const checkoutBtn =
  document.getElementById("checkoutBtn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });
}
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

/* =========================
   CHECKOUT PAGE
========================= */

document.addEventListener("DOMContentLoaded", () => {

  if (!document.title.includes("Checkout"))
    return;

  const summary =
    document.getElementById("order-summary");

  if (!summary) return;

  const cart =
    JSON.parse(localStorage.getItem("cart"))
    || [];

  let total = 0;

  cart.forEach(item => {

    const div =
      document.createElement("div");

    div.innerHTML = `
      <strong>${item.name}</strong>
      (${item.size})
      - ${item.price}
    `;

    summary.appendChild(div);

    total += parseFloat(
      item.price.replace(/₦|,/g, "")
    );

  });

  summary.innerHTML += `
    <h3>
      Total:
      ₦${total.toLocaleString()}
    </h3>
  `;

  const placeOrderBtn =
    document.getElementById("placeOrderBtn");

  if (placeOrderBtn) {

    placeOrderBtn.addEventListener(
      "click",
      () => {

        const payment =
          document.querySelector(
            'input[name="payment"]:checked'
          );

        if (!payment) {
          alert(
            "Please select a payment method."
          );
          return;
        }

        localStorage.setItem(
          "lastOrder",
          JSON.stringify({
            cart,
            paymentMethod: payment.value
          })
        );

        localStorage.removeItem("cart");
        updateCartCount();

        window.location.href =
          "confirmation.html";
      }
    );

  }

});

/* =========================
   CONFIRMATION PAGE
========================= */

document.addEventListener("DOMContentLoaded", () => {

  if (
    !document.title.includes(
      "Confirmation"
    )
  ) return;

  const details =
    document.getElementById(
      "confirmation-details"
    );

  if (!details) return;

  const order =
    JSON.parse(
      localStorage.getItem(
        "lastOrder"
      )
    );

  if (!order) {

    details.innerHTML =
      "<p>No order found.</p>";

    return;

  }

  order.cart.forEach(item => {

    const div =
      document.createElement("div");

    div.innerHTML = `
      <strong>${item.name}</strong>
      (${item.size})
      - ${item.price}
    `;

    details.appendChild(div);

  });

  const paymentDiv =
    document.createElement("div");

  paymentDiv.innerHTML = `
    <p>
      Payment Method:
      <strong>
        ${order.paymentMethod}
      </strong>
    </p>
  `;

  details.appendChild(paymentDiv);

   let total = 0;

order.cart.forEach(item => {

  total += parseFloat(
    item.price.replace(/₦|,/g, "")
  );

});
   details.innerHTML += `
  <h3>
    Total:
    ₦${total.toLocaleString()}
  </h3>
`;

});

