// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from "firebase/firestore"
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2EutvNcLnb1SZJ8LSppSY5SSP1waJMkw",
  authDomain: "nexadewsalesmanagement.firebaseapp.com",
  projectId: "nexadewsalesmanagement",
  storageBucket: "nexadewsalesmanagement.firebasestorage.app",
  messagingSenderId: "626635341025",
  appId: "1:626635341025:web:95cc5aa886e54822234ba0",
  measurementId: "G-W1PPW2DDHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { app, db, auth };