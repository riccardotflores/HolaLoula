import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const ADMIN_UID = "HCYYr9LOgjVLEueeNVuHQ7ScfEO2"; // reemplaza con UID real
const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout-btn");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch (err) { alert("Usuario o contraseña incorrecta"); }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.uid === ADMIN_UID) document.body.classList.add("admin");
    document.getElementById("login-section").style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    document.body.classList.remove("admin");
    document.getElementById("login-section").style.display = "block";
    logoutBtn.style.display = "none";
  }
});

