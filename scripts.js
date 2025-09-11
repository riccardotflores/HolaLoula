// --- GALERÍA INSTAGRAM STYLE ---
document.addEventListener("DOMContentLoaded", () => {
  const riel = document.getElementById("riel");
  if (!riel) return;

  let scrollInterval;

  // Auto-scroll
  function iniciarRiel() {
    scrollInterval = setInterval(() => {
      riel.scrollBy({ left: 220, behavior: "smooth" });
      if (riel.scrollLeft + riel.clientWidth >= riel.scrollWidth) {
        riel.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 3000);
  }

  function detenerRiel() {
    clearInterval(scrollInterval);
  }

  iniciarRiel();

  // Modal
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const caption = document.getElementById("modal-caption");
  const cerrar = document.querySelector(".cerrar");

  riel.querySelectorAll(".item img").forEach(img => {
    img.addEventListener("click", () => {
      detenerRiel();
      modal.style.display = "block";
      modalImg.src = img.src;
      caption.textContent = img.alt;
    });
  });

  cerrar.addEventListener("click", () => {
    modal.style.display = "none";
    iniciarRiel();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      iniciarRiel();
    }
  });
});

