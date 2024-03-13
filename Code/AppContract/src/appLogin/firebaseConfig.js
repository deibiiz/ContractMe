import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAKj7_NXneC0F6Y5NWtAlFWFDklpQKwoQ",
    authDomain: "contractme-ubu.firebaseapp.com",
    projectId: "contractme-ubu",
    storageBucket: "contractme-ubu.appspot.com",
    messagingSenderId: "539930504259",
    appId: "1:539930504259:web:406ae7acf048f950f838f6"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

