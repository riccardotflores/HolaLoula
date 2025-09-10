// ------------------------------
// 🔹 Importar Firebase
// ------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  query,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// ------------------------------
// 🔹 Configuración Firebase
// ------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAQu6ydhaq6KA5T60Ed5IJZ-Rv0Qwu2utU",
  authDomain: "holaloula-a422d.firebaseapp.com",
  projectId: "holaloula-a422d",
  storageBucket: "holaloula-a422d.firebasestorage.app",
  messagingSenderId: "237483600621",
  appId: "1:237483600621:web:8e81c515b5d09de6347ae4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ------------------------------
// 🔹 Definir correo de administrador
// ------------------------------
const adminEmail = "riccardotflores@gmail.com";

// ------------------------------
// 🔹 SLIDER DE PRODUCTOS
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const imagenes = ["img/producto1.jpg", "img/producto2.jpg", "img/producto3.jpg"];
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

  function siguiente() {
    index = (index + 1) % imagenes.length;
    mostrarImagen(index);
  }
  function anterior() {
    index = (index - 1 + imagenes.length) % imagenes.length;
    mostrarImagen(index);
  }
  function iniciarSlider() {
    intervalo = setInterval(siguiente, 4000);
  }
  function reiniciarSlider() {
    clearInterval(intervalo);
    iniciarSlider();
  }

  prevBtn?.addEventListener("click", () => {
    anterior();
    reiniciarSlider();
  });
  nextBtn?.addEventListener("click", () => {
    siguiente();
    reiniciarSlider();
  });

  sliderImg.classList.add("active");
  iniciarSlider();
});

// ------------------------------
// 🔹 COMENTARIOS CON FIRESTORE
// ------------------------------
const form = document.getElementById("comentario-form");
const lista = document.getElementById("lista-comentarios");
const comentariosRef = collection(db, "comentarios");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (nombre && mensaje) {
      await addDoc(comentariosRef, {
        nombre,
        mensaje,
        fecha: serverTimestamp()
      });
      form.reset();
    }
  });

  // Escuchar cambios en tiempo real
  const q = query(comentariosRef, orderBy("fecha", "desc"));
  onSnapshot(q, (snapshot) => {
    lista.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const li = document.createElement("li");

      let botones = "";
      if (document.body.classList.contains("admin")) {
        botones = `<button class="eliminar" data-id="${docSnap.id}">🗑 Eliminar</button>`;
      }

      li.innerHTML = `<strong>${data.nombre}:</strong> ${data.mensaje} ${botones}`;
      lista.appendChild(li);
    });
  });
}

// Manejar eliminación de comentarios
if (lista) {
  lista.addEventListener("click", async (e) => {
    if (e.target.classList.contains("eliminar")) {
      const id = e.target.getAttribute("data-id");
      await deleteDoc(doc(db, "comentarios", id));
    }
  });
}

// ------------------------------
// 🔹 LOGIN CON FIREBASE AUTH
// ------------------------------
const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout-btn");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Sesión iniciada:", email);
      loginForm.reset();
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    console.log("👋 Sesión cerrada");
  });
}

// ------------------------------
// 🔹 DETECTAR CAMBIOS EN EL LOGIN
// ------------------------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario logueado:", user.email);

    if (user.email === adminEmail) {
      console.log("✅ Usuario administrador detectado");
      document.body.classList.add("admin");
    } else {
      console.log("👤 Usuario normal");
      document.body.classList.remove("admin");
    }

    // Mostrar botón de logout, ocultar login
    document.getElementById("login-section").style.display = "none";
    document.getElementById("logout-btn").style.display = "inline-block";
  } else {
    console.log("No hay usuario logueado");
    document.body.classList.remove("admin");

    // Mostrar login, ocultar logout
    document.getElementById("login-section").style.display = "block";
    document.getElementById("logout-btn").style.display = "none";
  }
});

// ------------------------------
// 🔹 MENÚ HAMBURGUESA
// ------------------------------
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

