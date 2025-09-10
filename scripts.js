// --- FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, orderBy, query, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

// --- SLIDER ---
document.addEventListener("DOMContentLoaded", () => {
  const imagenes = ["img/producto1.jpg","img/producto2.jpg","img/producto3.jpg"];
  const sliderImg = document.getElementById("slider-img");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  let index = 0;
  let intervalo;

  function mostrarImagen(i){
    sliderImg.classList.remove("active");
    setTimeout(()=>{sliderImg.src = imagenes[i]; sliderImg.classList.add("active");},300);
  }
  function siguiente(){ index=(index+1)%imagenes.length; mostrarImagen(index);}
  function anterior(){ index=(index-1+imagenes.length)%imagenes.length; mostrarImagen(index);}
  function iniciarSlider(){ intervalo=setInterval(siguiente,4000);}
  function reiniciarSlider(){ clearInterval(intervalo); iniciarSlider();}

  prevBtn?.addEventListener("click",()=>{ anterior(); reiniciarSlider(); });
  nextBtn?.addEventListener("click",()=>{ siguiente(); reiniciarSlider(); });

  sliderImg.classList.add("active");
  iniciarSlider();

  // --- MENU HAMBURGUESA ---
  const menuBtn = document.getElementById("menu-btn");
  const navMenu = document.getElementById("nav-menu");
  const overlay = document.getElementById("overlay");

  function toggleMenu(){
    navMenu.classList.toggle("activo");
    overlay.classList.toggle("activo");
  }

  menuBtn.addEventListener("click",toggleMenu);
  overlay.addEventListener("click",toggleMenu);
});

// --- COMENTARIOS ---
const form = document.getElementById("comentario-form");
const lista = document.getElementById("lista-comentarios");
const comentariosRef = collection(db, "comentarios");

if(form){
  form.addEventListener("submit", async(e)=>{
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();
    if(nombre && mensaje){
      await addDoc(comentariosRef,{nombre,mensaje,fecha:serverTimestamp()});
      form.reset();
    }
  });

  const q = query(comentariosRef, orderBy("fecha","desc"));
  onSnapshot(q, snapshot=>{
    lista.innerHTML="";
    snapshot.forEach((doc,index)=>{
      const data = doc.data();
      const li = document.createElement("li");
      li.innerHTML=`<strong>${data.nombre}:</strong> ${data.mensaje}`;
      lista.appendChild(li);
    });
  });
}

// --- LOGIN ADMIN ---
const adminForm = document.getElementById("admin-form");
const logoutBtn = document.getElementById("logout-btn");
const adminUser = "admin";
const adminPass = "1234";

function isAdmin(){ return sessionStorage.getItem("adminLogged")==="true"; }

function mostrarAdmin(){
  logoutBtn.style.display="block";
  adminForm.style.display="none";
  document.querySelectorAll("#lista-comentarios li").forEach(async(li,index)=>{
    if(!li.querySelector(".eliminar-btn")){
      const btn=document.createElement("button");
      btn.textContent="Eliminar";
      btn.className="eliminar-btn";
      btn.style.marginLeft="10px";
      btn.addEventListener("click",async()=>{
        const docs=await getDocs(query(comentariosRef, orderBy("fecha","desc")));
        const docRef=docs.docs[index].ref;
        await deleteDoc(docRef);
      });
      li.appendChild(btn);
    }
  });
}

adminForm?.addEventListener("submit",(e)=>{
  e.preventDefault();
  const user=document.getElementById("admin-user").value.trim();
  const pass=document.getElementById("admin-pass").value.trim();
  if(user===adminUser && pass===adminPass){
    sessionStorage.setItem("adminLogged","true");
    mostrarAdmin();
    adminForm.reset();
  }else{
    alert("Usuario o contraseña incorrectos");
  }
});

logoutBtn?.addEventListener("click",()=>{
  sessionStorage.removeItem("adminLogged");
  logoutBtn.style.display="none";
  adminForm.style.display="block";
  document.querySelectorAll(".eliminar-btn").forEach(btn=>btn.remove());
});

if(isAdmin()) mostrarAdmin();

