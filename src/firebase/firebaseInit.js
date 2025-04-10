// Initialisation de l'app Firebase et export des services nécessaires
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Set persistence with better error handling
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    console.log("Firebase persistence set successfully");
  })
  .catch(error => {
    console.error("Error setting persistence:", error);
  });

// Récupération des services Firestore et Auth
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

// Expose Firebase to the window object for debugging
if (process.env.NODE_ENV !== 'production') {
  window.firebase = firebase;
  window.db = db;
  window.auth = auth;
}

export { db, auth, firebase }; // Added firebase to exports