import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

// --- Likes de la galería ---
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".item");

  items.forEach(item => {
    const id = item.getAttribute("data-id");
    const btn = item.querySelector(".like-btn");
    const span = btn.querySelector("span");

    const ref = doc(db, "likes", id);

    // Escuchar cambios en tiempo real
    onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        span.textContent = docSnap.data().count || 0;
      }
    });

    btn.addEventListener("click", async (e) => {
      e.stopPropagation();

      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        await updateDoc(ref, { count: (docSnap.data().count || 0) + 1 });
      } else {
        await setDoc(ref, { count: 1 });
      }
    });
  });
});

