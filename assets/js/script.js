// Load header and footer
async function loadComponent(id, file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Failed to load ${file}`);
    const text = await response.text();
    document.getElementById(id).innerHTML = text;
  } catch (err) {
    console.error(err);
  }
}

window.onload = () => {
  loadComponent("header", "partials/header.html");
  loadComponent("footer", "partials/footer.html");
};

