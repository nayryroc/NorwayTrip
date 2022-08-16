import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCeX73UOC82E3kDZuNwu91EyZciGH7-lVA",
    authDomain: "ywam-trip.firebaseapp.com",
    projectId: "ywam-trip",
    storageBucket: "ywam-trip.appspot.com",
    messagingSenderId: "753798082045",
    appId: "1:753798082045:web:d7c4301adda431dbb77d94",
    measurementId: "G-YJ8HMY68RJ"
};

let app = firebase.initializeApp(firebaseConfig);
export const storage = getStorage();
export const db = firebase.firestore();;

