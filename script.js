// Perbaikan: Semua versi disamakan ke 10.7.1 agar kompatibel
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCIBOGREhE4PDeLpNSLrHRSbgvz9AO6SOA",
  authDomain: "monitor-smart-plant.firebaseapp.com",
  databaseURL:
    "https://monitor-smart-plant-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "monitor-smart-plant",
  storageBucket: "monitor-smart-plant.firebasestorage.app",
  messagingSenderId: "1093512166846",
  appId: "1:1093512166846:web:3a63bcecfd90dc03dc8def",
  measurementId: "G-QNCDLZ0P1D",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const analytics = getAnalytics(app);

// Referensi Elemen HTML
const loginForm = document.getElementById("loginForm");
const dashboard = document.getElementById("dashboard");

// Cek Status Login
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginForm.style.display = "none";
    dashboard.style.display = "block";
    listenToSensors();
  } else {
    loginForm.style.display = "block";
    dashboard.style.display = "none";
  }
});

// Event Listener Tombol Login
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      alert("Login Berhasil!");
    })
    .catch((error) => {
      alert("Login gagal: " + error.message);
    });
});

// Event Listener Tombol Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("Logout Berhasil");
    })
    .catch((error) => {
      console.error(error);
    });
});

// Fungsi Baca Sensor
function listenToSensors() {
  const sensorRef = ref(db, "greenhouse/sensors");

  onValue(sensorRef, (snapshot) => {
    const d = snapshot.val();

    if (d) {
      updateSoil(d.soilMoisture);
      updateLight(d.lightLevel);
      updateMotion(d.motion);
    }
  });
}

function updateSoil(value) {
  document.getElementById("soilMoisture").innerText = value + " %";
  const status = value < 30 ? "Kering" : value < 70 ? "Cukup" : "Basah";
  document.getElementById("soilStatus").innerText = status;
}

function updateLight(value) {
  document.getElementById("lightLevel").innerText = value + " %";
  const status = value < 30 ? "Redup" : value < 70 ? "Cukup" : "Terang";
  document.getElementById("lightStatus").innerText = status;
}

function updateMotion(value) {
  document.getElementById("motion").innerText = value
    ? "Terdeteksi"
    : "Tidak Terdeteksi";
  const status = value ? "Ada Gerakan" : "Aman";
  document.getElementById("motionStatus").innerText = status;
}
