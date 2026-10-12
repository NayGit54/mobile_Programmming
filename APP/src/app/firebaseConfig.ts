// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC_0ionG_a7G5rdROjfz7qruiU16AGcJQg",
    authDomain: "studyai-888ea.firebaseapp.com",
    projectId: "studyai-888ea",
    storageBucket: "studyai-888ea.firebasestorage.app",
    messagingSenderId: "760507752166",
    appId: "1:760507752166:web:58afef34fc93746e266527",
    measurementId: "G-H9DSLKN6E5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);