import firebase from "firebase";
import "firebase/auth"
import "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCW8EgmhbrviMiGDoHXtMZ9USyQvdyX-mk",
  authDomain: "cha-fa.firebaseapp.com",
  projectId: "cha-fa",
  storageBucket: "cha-fa.appspot.com",
  messagingSenderId: "160852048492",
  appId: "1:160852048492:web:a08d3c445e49656c19b649",
  measurementId: "G-82TZ885RNF"
};

const app = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore
export const auth = app.auth()

export default firebase;