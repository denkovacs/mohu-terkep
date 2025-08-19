document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".menu-toggle");
  const dropdown = document.querySelector(".dropdown-menu");

  toggleBtn.addEventListener("click", () => {
    dropdown.classList.toggle("show");
    toggleBtn.textContent = dropdown.classList.contains("show") ? "✖" : "☰";
  });
});