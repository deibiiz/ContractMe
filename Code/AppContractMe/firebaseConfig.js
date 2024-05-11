
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyApRPWlqORs5uz6OGQoAcC8vOu62M0ywuM",
    authDomain: "contractmedb.firebaseapp.com",
    projectId: "contractmedb",
    storageBucket: "contractmedb.appspot.com",
    messagingSenderId: "1004630196034",
    appId: "1:1004630196034:web:2aab707df884e2d80612db",
    measurementId: "G-V9ZDV7R27C"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

export { auth, db, doc, setDoc };