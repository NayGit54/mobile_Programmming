
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyC_0ionG_a7G5rdROjfz7qruiU16AGcJQg",
    authDomain: "studyai-888ea.firebaseapp.com",
    databaseURL:
        "https://studyai-888ea-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "studyai-888ea",
    storageBucket: "studyai-888ea.firebasestorage.app",
    messagingSenderId: "760507752166",
    appId: "1:760507752166:web:58afef34fc93746e266527",
};

// Reuse an existing Firebase app instead of initializing it twice.
const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

export const database = getDatabase(app);
export default app;
