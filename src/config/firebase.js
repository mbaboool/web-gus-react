// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBETnXuNpIDBO1U7ZisgRdOrIwr6i_Guqk",
  authDomain: "website-gus-baraja.firebaseapp.com",
  projectId: "website-gus-baraja",
  storageBucket: "website-gus-baraja.appspot.com",
  messagingSenderId: "1048285855159",
  appId: "1:1048285855159:web:f31a333fc14844a5b9bc32",
  measurementId: "G-X90MYXXZ5H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };