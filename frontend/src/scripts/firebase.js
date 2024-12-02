import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAj902zsb6qPLZoo5s_p3uD9eBEYhf8ozo",
  authDomain: "ajudaconecta-633bc.firebaseapp.com",
  projectId: "ajudaconecta-633bc",
  storageBucket: "ajudaconecta-633bc.firebasestorage.app",
  messagingSenderId: "337222059315",
  appId: "1:337222059315:web:44ff4c346dc1e3b322ea46",
  measurementId: "G-3X8YPDDFSC"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword };
