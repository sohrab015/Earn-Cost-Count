// register.js (LOAD AS type="module")

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDT8Ef6ib0zFu6SX7ANRPnjsqXYksZphzA",
  authDomain: "earn-cost-count-7c32e.firebaseapp.com",
  projectId: "earn-cost-count-7c32e",
  storageBucket: "earn-cost-count-7c32e.appspot.com",
  messagingSenderId: "171154527862",
  appId: "1:171154527862:web:fe391111c00d439fc6f157"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM
const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");
const authBtn = document.getElementById("authBtn");
const authTitle = document.getElementById("authTitle");
const toggleAuth = document.getElementById("toggleAuth");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const logoutBtn = document.getElementById("logoutBtn");

let isLoginMode = true;

// Toggle Login / Signup
toggleAuth.addEventListener("click", () => {
  isLoginMode = !isLoginMode;
  authTitle.textContent = isLoginMode ? "Login" : "Sign Up";
  authBtn.textContent = isLoginMode ? "Login" : "Sign Up";
  toggleAuth.innerHTML = isLoginMode
    ? `Don't have an account? <span>Sign Up</span>`
    : `Already have an account? <span>Login</span>`;
});

// Login / Signup
authBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Email & password required");
    return;
  }

  try {
    if (isLoginMode) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created. You can login now.");
      isLoginMode = true;
      authTitle.textContent = "Login";
      authBtn.textContent = "Login";
    }
  } catch (err) {
    alert(err.message);
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

// Auth state observer (THIS controls UI)
onAuthStateChanged(auth, (user) => {
  if (user) {
    authSection.style.display = "none";
    appSection.style.display = "block";
  } else {
    authSection.style.display = "block";
    appSection.style.display = "none";
  }
});
