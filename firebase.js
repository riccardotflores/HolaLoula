import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

const form = document.getElementById("comentario-form");
const lista = document.getElementById("lista-comentarios");
const comentariosRef = collection(db, "comentarios");

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

  const q = query(comentariosRef, orderBy("fecha","desc"));
  onSnapshot(q, (snapshot) => {
    lista.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `<strong>${data.nombre}:</strong> ${data.mensaje}`;
      lista.appendChild(li);
    });
  });
}

