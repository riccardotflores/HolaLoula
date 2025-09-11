import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

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
export const auth = getAuth(app);

