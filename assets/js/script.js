// ==========================
// TLAPIA CLOTHING - SCRIPT
// ==========================

// --------------------------
// LOAD HEADER & FOOTER
// --------------------------
async function loadComponent(id, file) {
try {
const response = await fetch(file);

```
if (!response.ok) {
  throw new Error(`Failed to load ${file}`);
}

const html = await response.text();
document.getElementById(id).innerHTML = html;

// Initialize menu after header loads
if (id === "header") {
  initMobileMenu();
}
```

} catch (error) {
console.error(error);
}
}

window.addEventListener("load", () => {
loadComponent("header", "partials/header.html");
loadComponent("footer", "partials/footer.html");
});

// --------------------------
// MOBILE MENU
// --------------------------
function initMobileMenu() {
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (!menuToggle || !navMenu) return;

menuToggle.addEventListener("click", () => {
navMenu.classList.toggle("show");

```
navMenu.style.maxHeight =
  navMenu.classList.contains("show")
    ? navMenu.scrollHeight + "px"
    : "0px";
```

});
}

// --------------------------
// STORAGE
// --------------------------
function getCart() {
return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
localStorage.setItem("cart", JSON.stringify(cart));
}

function getFavorites() {
return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
localStorage.setItem("favorites", JSON.stringify(favorites));
}

// --------------------------
// COUNTERS
// --------------------------
function updateCartCount() {
const counter = document.getElementById("cart-count");

if (counter) {
counter.textContent = getCart().length;
}
}

function updateFavoritesCount() {
const counter = document.getElementById("favorites-count");

if (counter) {
counter.textContent = getFavorites().length;
}
}

document.addEventListener("DOMContentLoaded", () => {
updateCartCount();
updateFavoritesCount();
});

// --------------------------
// ADD TO CART
// --------------------------
document.addEventListener("click", (e) => {

if (!e.target.classList.contains("add-to-cart")) return;

const card = e.target.closest(".product-card");
const selector = card.querySelector(".size-selector");

if (selector) {
selector.style.display = "block";
}

});

// --------------------------
// CONFIRM SIZE & ADD PRODUCT
// --------------------------
document.addEventListener("click", (e) => {

if (!e.target.classList.contains("confirm-size")) return;

const card = e.target.closest(".product-card");

const name =
card.querySelector("h3")?.textContent || "Product";

const price =
card.querySelector("p")?.textContent || "₦0";

const size =
card.querySelector(".size")?.value;

if (!size) {
alert("Please select a size.");
return;
}

const cart = getCart();

cart.push({
name,
price,
size
});

saveCart(cart);

updateCartCount();

alert(`${name} (${size}) added to cart!`);

card.querySelector(".size-selector").style.display = "none";

});

// --------------------------
// ADD TO FAVORITES
// --------------------------
document.addEventListener("click", (e) => {

if (
e.target.classList.contains("add-to-favorites")
) {

```
const card =
  e.target.closest(".product-card");

const name =
  card.querySelector("h3").textContent;

const price =
  card.querySelector("p").textContent;

const favorites = getFavorites();

favorites.push({
  name,
  price
});

saveFavorites(favorites);

updateFavoritesCount();

alert(`${name} added to favorites!`);
```

}

});

// --------------------------
// SEARCH
// --------------------------
document.addEventListener("DOMContentLoaded", () => {

const searchInput =
document.getElementById("searchInput");

const searchBtn =
document.getElementById("searchBtn");

if (searchBtn && searchInput) {

```
searchBtn.addEventListener("click", () => {

  const query =
    searchInput.value.trim().toLowerCase();

  if (!query) {
    alert("Enter a search term.");
    return;
  }

  localStorage.setItem(
    "searchQuery",
    query
  );

  window.location.href =
    "products.html";
});
```

}

// Products page search filter
if (
document.body.classList.contains(
"products-page"
)
) {

```
const query =
  localStorage.getItem("searchQuery");

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
```

}

});
// ==========================
// PRODUCT SORTING
// ==========================
document.addEventListener("DOMContentLoaded", () => {

const sortSelect =
document.getElementById("sort");

const productGrid =
document.querySelector(".product-grid");

if (!sortSelect || !productGrid) return;

sortSelect.addEventListener("change", () => {

```
const products =
  Array.from(productGrid.children);

products.sort((a, b) => {

  const priceA = parseFloat(
    a.querySelector("p")
      .textContent
      .replace(/₦|,/g, "")
  );

  const priceB = parseFloat(
    b.querySelector("p")
      .textContent
      .replace(/₦|,/g, "")
  );

  return sortSelect.value === "low-high"
    ? priceA - priceB
    : priceB - priceA;
});

products.forEach(product => {
  productGrid.appendChild(product);
});
```

});

});

// ==========================
// CART PAGE
// ==========================
document.addEventListener("DOMContentLoaded", () => {

if (!document.title.includes("Shopping Bag"))
return;

const cart = getCart();

const container =
document.createElement("div");

container.classList.add("cart-items");

if (cart.length === 0) {

```
container.innerHTML =
  "<p>Your cart is empty.</p>";
```

} else {

```
let total = 0;

cart.forEach((item, index) => {

  const div =
    document.createElement("div");

  div.classList.add("cart-item");

  div.innerHTML = `
    <strong>${item.name}</strong><br>
    Size: ${item.size}<br>
    ${item.price}
    <button class="remove"
            data-index="${index}">
      Remove
    </button>
  `;

  container.appendChild(div);

  total += parseFloat(
    item.price.replace(/₦|,/g, "")
  );

});

const totalDiv =
  document.createElement("div");

totalDiv.classList.add("cart-total");

totalDiv.innerHTML = `
  <h3>
    Total: ₦${total.toLocaleString()}
  </h3>
`;

container.appendChild(totalDiv);
```

}

document
.querySelector("main")
.appendChild(container);

container.addEventListener("click", (e) => {

```
if (!e.target.classList.contains("remove"))
  return;

const index =
  Number(
    e.target.getAttribute("data-index")
  );

const cart = getCart();

cart.splice(index, 1);

saveCart(cart);

updateCartCount();

location.reload();
```

});

});

// ==========================
// FAVORITES PAGE
// ==========================
document.addEventListener("DOMContentLoaded", () => {

if (!document.title.includes("Favorites"))
return;

const favorites =
getFavorites();

const container =
document.createElement("div");

container.classList.add("fav-items");

if (favorites.length === 0) {

```
container.innerHTML =
  "<p>No favorites added yet.</p>";
```

} else {

```
favorites.forEach((item, index) => {

  const div =
    document.createElement("div");

  div.classList.add("fav-item");

  div.innerHTML = `
    <strong>${item.name}</strong>
    - ${item.price}
    <button class="remove-fav"
            data-index="${index}">
      Remove
    </button>
  `;

  container.appendChild(div);

});
```

}

document
.querySelector("main")
.appendChild(container);

container.addEventListener("click", (e) => {

```
if (
  !e.target.classList.contains(
    "remove-fav"
  )
) return;

const index =
  Number(
    e.target.getAttribute("data-index")
  );

const favorites =
  getFavorites();

favorites.splice(index, 1);

saveFavorites(favorites);

updateFavoritesCount();

location.reload();
```

});

});

// ==========================
// CHECKOUT BUTTON
// ==========================
document.addEventListener("DOMContentLoaded", () => {

const checkoutBtn =
document.getElementById(
"checkoutBtn"
);

if (!checkoutBtn) return;

checkoutBtn.addEventListener(
"click",
() => {
window.location.href =
"checkout.html";
}
);

});

// ==========================
// CHECKOUT PAGE
// ==========================
document.addEventListener("DOMContentLoaded", () => {

if (!document.title.includes("Checkout"))
return;

const cart = getCart();

const summary =
document.getElementById(
"order-summary"
);

if (!summary) return;

if (cart.length === 0) {

```
summary.innerHTML =
  "<p>Your cart is empty.</p>";

return;
```

}

let total = 0;

cart.forEach(item => {

```
const div =
  document.createElement("div");

div.innerHTML = `
  <strong>${item.name}</strong>
  (Size: ${item.size})
  - ${item.price}
`;

summary.appendChild(div);

total += parseFloat(
  item.price.replace(/₦|,/g, "")
);
```

});

const totalDiv =
document.createElement("div");

totalDiv.innerHTML = `     <h3>
      Total:
      ₦${total.toLocaleString()}     </h3>
  `;

summary.appendChild(totalDiv);

const placeOrderBtn =
document.getElementById(
"placeOrderBtn"
);

if (!placeOrderBtn) return;

placeOrderBtn.addEventListener(
"click",
() => {

```
  const selectedPayment =
    document.querySelector(
      'input[name="payment"]:checked'
    );

  if (!selectedPayment) {

    alert(
      "Please select a payment method."
    );

    return;
  }

  localStorage.setItem(
    "lastOrder",
    JSON.stringify({
      cart,
      paymentMethod:
        selectedPayment.value
    })
  );

  localStorage.removeItem("cart");

  window.location.href =
    "confirmation.html";

}
```

);

});

// ==========================
// ORDER CONFIRMATION PAGE
// ==========================
document.addEventListener("DOMContentLoaded", () => {

if (
!document.title.includes(
"Order Confirmation"
)
) return;

const details =
document.getElementById(
"confirmation-details"
);

const order =
JSON.parse(
localStorage.getItem("lastOrder")
);

if (!order) {

```
details.innerHTML =
  "<p>No order found.</p>";

return;
```

}

order.cart.forEach(item => {

```
const div =
  document.createElement("div");

div.innerHTML = `
  <strong>${item.name}</strong>
  (Size: ${item.size})
  - ${item.price}
`;

details.appendChild(div);
```

});

const payment =
document.createElement("div");

payment.innerHTML = `     <p>
      Payment Method:       <strong>
        ${
          order.paymentMethod ===
          "delivery"
            ? "Pay on Delivery"
            : "Card Payment"
        }       </strong>     </p>
  `;

details.appendChild(payment);

localStorage.removeItem("lastOrder");

});

// ==========================
// GALLERY SLIDER
// ==========================
document.addEventListener("DOMContentLoaded", () => {

const track =
document.querySelector(
".gallery-track"
);

const prevBtn =
document.querySelector(
".gallery-button.prev"
);

const nextBtn =
document.querySelector(
".gallery-button.next"
);

if (
!track ||
!prevBtn ||
!nextBtn
) return;

let position = 0;

const step = 300;

nextBtn.addEventListener(
"click",
() => {

```
  position -= step;

  track.style.transform =
    `translateX(${position}px)`;

}
```

);

prevBtn.addEventListener(
"click",
() => {

```
  position += step;

  if (position > 0) {
    position = 0;
  }

  track.style.transform =
    `translateX(${position}px)`;

}
```

);

});

// ==========================
// SMOOTH SCROLL LINKS
// ==========================
document.addEventListener(
"DOMContentLoaded",
() => {

```
document
  .querySelectorAll(
    '.dropdown-menu a'
  )
  .forEach(link => {

    link.addEventListener(
      "click",
      function (e) {

        e.preventDefault();

        const targetId =
          this.getAttribute(
            "href"
          );

        const target =
          document.querySelector(
            targetId
          );

        if (target) {

          target.scrollIntoView({
            behavior: "smooth"
          });

        }

      }
    );

  });
```

}
);
