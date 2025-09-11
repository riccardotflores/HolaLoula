import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, orderBy, query, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

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
export const db = getFirestore(app);
const auth = getAuth(app);

// LOGIN ADMIN
const ADMIN_UID = "HCYYr9LOgjVLEueeNVuHQ7ScfEO2"; // reemplaza con tu UID

const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout-btn");

loginForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  try { await signInWithEmailAndPassword(auth, email, password); }
  catch(err){ alert("❌ " + err.message); }
});

logoutBtn?.addEventListener("click", async () => { await signOut(auth); });

// DETECTAR SESIÓN
onAuthStateChanged(auth, user => {
  if(user){
    loginForm.parentElement.style.display="none";
    logoutBtn.style.display="inline-block";
    if(user.uid===ADMIN_UID) document.body.classList.add("admin");
  } else {
    loginForm.parentElement.style.display="flex";
    logoutBtn.style.display="none";
    document.body.classList.remove("admin");
  }
});

// COMENTARIOS FIREBASE
const form = document.getElementById("comentario-form");
const lista = document.getElementById("lista-comentarios");
const comentariosRef = collection(db, "comentarios");

if(form){
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();
    if(nombre && mensaje){
      await addDoc(comentariosRef, { nombre, mensaje, fecha: serverTimestamp() });
      form.reset();
    }
  });

  const q = query(comentariosRef, orderBy("fecha","desc"));
  onSnapshot(q, snapshot => {
    lista.innerHTML = "";
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const li = document.createElement("li");
      li.innerHTML = `<strong>${data.nombre}:</strong> ${data.mensaje}`;

      if(document.body.classList.contains("admin")){
        const btn = document.createElement("button");
        btn.textContent = "Eliminar";
        btn.style.marginLeft="10px";
        btn.onclick = async ()=>{ await deleteDoc(doc(db,"comentarios",docSnap.id)); };
        li.appendChild(btn);
      }

      lista.appendChild(li);
    });
  });
}

