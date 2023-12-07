// firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBg6eG9UfsDNe0L2xYJeqaqI3BiB8FGCJw",
    authDomain: "fyp2023-4be5a.firebaseapp.com",
    projectId: "fyp2023-4be5a",
    storageBucket: "fyp2023-4be5a.appspot.com",
    messagingSenderId: "913892093997",
    appId: "1:913892093997:web:0afa902c847cf5ba8148a4",
    measurementId: "G-5PVB07D5MX"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore(); // Initialize Firestore instance

export { firebase, db };
