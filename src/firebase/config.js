// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFJevTUIv9k9mws242IwJpHRpyD564y4Q",
  authDomain: "vue-firebase-14764.firebaseapp.com",
  projectId: "vue-firebase-14764",
  storageBucket: "vue-firebase-14764.firebasestorage.app",
  messagingSenderId: "136899454247",
  appId: "1:136899454247:web:3f8fd765907af9d568f502"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }