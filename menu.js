const menuBtn = document.getElementById("menu-btn");
const navMenu = document.getElementById("nav-menu");
const overlay = document.getElementById("overlay");

if (menuBtn && navMenu && overlay) {
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("activo");
    overlay.classList.toggle("activo");
  });

  overlay.addEventListener("click", () => {
    navMenu.classList.remove("activo");
    overlay.classList.remove("activo");
  });
}

