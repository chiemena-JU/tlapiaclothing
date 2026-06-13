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
