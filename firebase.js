import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { 
  getFirestore, collection, addDoc, onSnapshot, serverTimestamp, orderBy, query, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { 
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAQu6ydhaq6KA5T60Ed5IJZ-Rv0Qwu2utU",
  authDomain: "holaloula-a422d.firebaseapp.com",
  projectId: "holaloula-a422d",
  storageBucket: "holaloula-a422d.firebasestorage.app",
  messagingSenderId: "237483600621",
  appId: "1:237483600621:web:8e81c515b5d09de6347ae4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- COMENTARIOS FIREBASE ---
const form = document.getElementById("comentario-form");
const lista = document.getElementById("lista-comentarios");
const comentariosRef = collection(db, "comentarios");

let unsubscribeComentarios = null; // Para controlar el listener

function renderizarComentarios() {
  if (unsubscribeComentarios) unsubscribeComentarios(); // Si ya hay un listener, lo quitamos
  const q = query(comentariosRef, orderBy("fecha", "desc"));
  unsubscribeComentarios = onSnapshot(q, (snapshot) => {
    lista.innerHTML = "";
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.justifyContent = "space-between";
      li.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      li.innerHTML = `<span><strong>${data.nombre}:</strong> ${data.mensaje}</span>`;

      // 🔹 Si es admin, mostrar icono SVG de eliminar
      if(document.body.classList.contains("admin")){
        const btn = document.createElement("span");
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="gray" viewBox="0 0 24 24">
            <path d="M3 6h18v2H3V6zm2 3h14v13H5V9zm3 3v7h2v-7H8zm4 0v7h2v-7h-2zm4 0v7h2v-7h-2z"/>
          </svg>
        `;
        btn.style.cursor = "pointer";
        btn.title = "Eliminar comentario";

        btn.onmouseover = () => btn.querySelector("svg").setAttribute("fill", "#ff6f61");
        btn.onmouseout = () => btn.querySelector("svg").setAttribute("fill", "gray");

        btn.onclick = async () => {
          if(confirm("¿Seguro quieres eliminar este comentario?")){
            // 🔹 Animación antes de borrar
            li.style.opacity = "0";
            li.style.transform = "translateX(-20px)";
            setTimeout(async () => {
              await deleteDoc(doc(db, "comentarios", docSnap.id));
            }, 400); // coincide con la transición
          }
        };
        li.appendChild(btn);
      }

      lista.appendChild(li);
    });
  });
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();
    if (nombre && mensaje) {
      await addDoc(comentariosRef, { nombre, mensaje, fecha: serverTimestamp() });
      form.reset();
    }
  });
  renderizarComentarios(); // Primera carga
}

// --- LOGIN FIREBASE ---
const ADMIN_UID = "HCYYr9LOgjVLEueeNVuHQ7ScfEO2"; // Reemplaza con tu UID real
const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout-btn");

if(loginForm){
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Sesión iniciada");
    } catch(error){
      alert("❌ Error: " + error.message);
    }
  });
}

logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  console.log("🔒 Sesión cerrada");
});

// Verificar sesión
onAuthStateChanged(auth, (user) => {
  if(user){
    if(user.uid === ADMIN_UID){
      document.body.classList.add("admin");
    } else {
      document.body.classList.remove("admin");
    }
    document.getElementById("login-section").style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    document.body.classList.remove("admin");
    document.getElementById("login-section").style.display = "block";
    logoutBtn.style.display = "none";
  }

  // 🔹 Cada vez que cambia el estado del login, re-renderizamos los comentarios
  renderizarComentarios();
});
import { 
  getFirestore, collection, doc, setDoc, getDoc, updateDoc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const likesRef = collection(db, "likes");

// --- LIKES ---
function initLikes() {
  const stories = document.querySelectorAll(".story");
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalClose = document.getElementById("modal-close");
  const modalLike = document.getElementById("modal-like");
  const modalCount = document.getElementById("modal-count");
  let currentId = null;

  // Escuchar likes en tiempo real y abrir modal
  stories.forEach(story => {
    const id = story.dataset.id;
    const likeBox = story.querySelector(".like-count");

    onSnapshot(doc(db, "likes", id), (snap) => {
      likeBox.textContent = snap.exists() ? snap.data().count : 0;
    });

    // Abrir modal al clickear en la story
    story.addEventListener("click", () => {
      currentId = id;
      modal.classList.add("show");
      modalImg.src = story.querySelector("img").src;

      onSnapshot(doc(db, "likes", id), (snap) => {
        modalCount.textContent = snap.exists() ? snap.data().count : 0;
      });
    });
  });

  // Cerrar modal con X o clic fuera
  modalClose.addEventListener("click", () => {
    modal.classList.remove("show");
    currentId = null;
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      currentId = null;
    }
  });

  // Like en modal
  modalLike.addEventListener("click", async () => {
    if (!currentId) return;
    const ref = doc(db, "likes", currentId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { count: snap.data().count + 1 });
    } else {
      await setDoc(ref, { count: 1 });
    }
  });
}

document.addEventListener("DOMContentLoaded", initLikes);

