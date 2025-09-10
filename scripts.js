// Importar Firebase desde el CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { 
  getFirestore, collection, addDoc, onSnapshot, serverTimestamp, orderBy, query, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { 
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// 🔹 CONFIG DE TU PROYECTO FIREBASE
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

// --- SLIDER ---
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

// --- COMENTARIOS CON FIREBASE ---
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
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const li = document.createElement("li");
      li.innerHTML = `<strong>${data.nombre}:</strong> ${data.mensaje}`;

      // 🔹 Si es admin, mostrar botón eliminar
      if (document.body.classList.contains("admin")) {
        const btn = document.createElement("button");
        btn.textContent = "Eliminar";
        btn.style.marginLeft = "10px";
        btn.onclick = async () => {
          await deleteDoc(doc(db, "comentarios", docSnap.id));
        };
        li.appendChild(btn);
      }

      lista.appendChild(li);
    });
  });
}

// --- LOGIN FIREBASE ---
// UID del administrador (copiarlo desde Firebase Authentication)
const ADMIN_UID = "HCYYr9LOgjVLEueeNVuHQ7ScfEO2"; // ⚠️ Reemplaza con tu UID real

const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout-btn");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Sesión iniciada");
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    console.log("🔒 Sesión cerrada");
  });
}

// --- VERIFICAR SESIÓN ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario logueado:", user.email, user.uid);

    if (user.uid === ADMIN_UID) {
      console.log("✅ Usuario administrador detectado");
      document.body.classList.add("admin");
    } else {
      console.log("👤 Usuario normal");
      document.body.classList.remove("admin");
    }

    document.getElementById("login-section").style.display = "none";
    document.getElementById("logout-btn").style.display = "inline-block";
  } else {
    console.log("No hay usuario logueado");
    document.body.classList.remove("admin");

    document.getElementById("login-section").style.display = "block";
    document.getElementById("logout-btn").style.display = "none";
  }
});

