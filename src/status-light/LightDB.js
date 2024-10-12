import {initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore"


  const firebaseConfig = {
    apiKey: "AIzaSyB5ov26TqTTNZeLMcfhNRQnOWspcjk2jbs",
    authDomain: "status-4b1eb.firebaseapp.com",
    projectId: "status-4b1eb",
    storageBucket: "status-4b1eb.appspot.com",
    messagingSenderId: "372657897865",
    appId: "1:372657897865:web:fa308f72e8c47b5072a158",
    measurementId: "G-DFW6WS7B6B"
  }

  const app = initializeApp(firebaseConfig);
 
  export const db = getFirestore(app);;


