import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAgEgbC5sKL49R1LyldJnonMOcPWz0NoGM",
    authDomain: "classmobileprogramming.firebaseapp.com",
    // NEW: tells Firebase exactly which database to use (Singapore region)
    databaseURL: "https://classmobileprogramming-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "classmobileprogramming",
    storageBucket: "classmobileprogramming.firebasestorage.app",
    messagingSenderId: "368375936937",
    appId: "1:368375936937:web:0ddaf43b805e9d246ff6b8",
    measurementId: "G-YZ9N71VTHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// NEW: stops waiting after a set time, so the button never gets stuck
function withTimeout(promise, ms) {
    let timerId;
    const timeout = new Promise((_, reject) => {
        timerId = setTimeout(() => reject(new Error("timeout")), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timerId));
}

// Get form elements
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const statusMessage = document.getElementById("statusMessage");

// Check that the form exists
if (contactForm && submitBtn && statusMessage) {

    // NEW: remember the button's original content (text + arrow)
    const originalButtonHTML = submitBtn.innerHTML;

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Get form values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validate required fields
        if (!name || !email || !message) {
            statusMessage.textContent =
                "Please fill in all required fields.";
            return;
        }

        // Prevent repeated submissions
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        statusMessage.textContent = "";

        try {
            // Create a new contact entry with a unique key
            const contactsRef = ref(db, "contacts");
            const newContactRef = push(contactsRef);

            // Save the contact information (waits up to 10 seconds)
            await withTimeout(
                set(newContactRef, {
                    name: name,
                    email: email,
                    phone: phone,
                    message: message,
                    submittedAt: new Date().toISOString()
                }),
                10000
            );

            // NEW: shows the unique key in the console (useful for testing)
            console.log("Saved to Firebase with key:", newContactRef.key);

            // Show success message
            statusMessage.textContent =
                "Thank you! Your message was sent successfully.";

            // Clear the form
            contactForm.reset();

        } catch (error) {
            // Display detailed error in the browser console
            console.error("Firebase error:", error);

            // Display useful error information
            if (error.message === "timeout") {
                statusMessage.textContent =
                    "Sending is taking too long. Check your internet connection and try again.";
            } else {
                statusMessage.textContent =
                    "Failed to send message: " +
                    (error.code || error.message);
            }

        } finally {
            // Re-enable the button and restore its original text + arrow
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalButtonHTML;
        }
    });

} else {
    console.error(
        "Contact form elements not found. Check your HTML IDs."
    );
}