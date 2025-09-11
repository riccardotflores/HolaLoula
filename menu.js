document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const navMenu = document.getElementById("nav-menu");
  const overlay = document.getElementById("overlay");
  const links = navMenu.querySelectorAll("a");
  const secciones = document.querySelectorAll("main > section");

  function toggleMenu() {
    navMenu.classList.toggle("activo");
    overlay.classList.toggle("activo");
  }

  menuBtn.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", toggleMenu);

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetId = link.getAttribute("href").replace(".html","");
      secciones.forEach(sec => {
        sec.style.display = sec.id === targetId ? "block" : "none";
      });
      navMenu.classList.remove("activo");
      overlay.classList.remove("activo");
    });
  });
});

