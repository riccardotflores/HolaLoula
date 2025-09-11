import { db } from "./firebase-config.js";
import { collection, addDoc, onSnapshot, serverTimestamp, orderBy, query, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

  const q = query(comentariosRef, orderBy("fecha", "desc"));
  onSnapshot(q, (snapshot) => {
    lista.innerHTML = "";
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const li = document.createElement("li");
      li.innerHTML = `<strong>${data.nombre}:</strong> ${data.mensaje}`;
      // Si el usuario es admin
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

