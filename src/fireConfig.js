
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBggk9YzH6oj-PR0Lpgao2_ZIDxq2v9tUs",
  authDomain: "firecommerce-9ed2f.firebaseapp.com",
  projectId: "firecommerce-9ed2f",
  storageBucket: "firecommerce-9ed2f.appspot.com",
  messagingSenderId: "896438075300",
  appId: "1:896438075300:web:8d28a69a1d33f19ee9cb31",
  measurementId: "G-MYHJDR4H46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app)

export default fireDB