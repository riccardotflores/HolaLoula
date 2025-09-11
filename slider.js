document.addEventListener("DOMContentLoaded", () => {
  const imagenes = ["img/producto1.jpg","img/producto2.jpg","img/producto3.jpg"];
  const sliderImg = document.getElementById("slider-img");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  let index = 0;
  let intervalo;

  function mostrarImagen(i) {
    sliderImg.classList.remove("active");
    setTimeout(() => {
      sliderImg.src = imagenes[i];
      sliderImg.classList.add("active");
    }, 300);
  }

  function siguiente() { index = (index + 1) % imagenes.length; mostrarImagen(index); }
  function anterior() { index = (index - 1 + imagenes.length) % imagenes.length; mostrarImagen(index); }
  function iniciarSlider() { intervalo = setInterval(siguiente, 4000); }
  function reiniciarSlider() { clearInterval(intervalo); iniciarSlider(); }

  prevBtn?.addEventListener("click", () => { anterior(); reiniciarSlider(); });
  nextBtn?.addEventListener("click", () => { siguiente(); reiniciarSlider(); });

  sliderImg.classList.add("active");
  iniciarSlider();
});

