// Initialisation de l'app Firebase et export des services nécessaires
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Récupération des services Firestore et Auth
const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };