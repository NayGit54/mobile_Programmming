
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAgEgbC5sKL49R1LyldJnonMOcPWz0NoGM",
    authDomain: "classmobileprogramming.firebaseapp.com",
    projectId: "classmobileprogramming",
    storageBucket: "classmobileprogramming.firebasestorage.app",
    messagingSenderId: "368375936937",
    appId: "1:368375936937:web:0ddaf43b805e9d246ff6b8",
    measurementId: "G-YZ9N71VTHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Get form elements
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const statusMessage = document.getElementById("statusMessage");

// Check that the form exists
if (contactForm && submitBtn && statusMessage) {

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
            // Create a new contact entry
            const contactsRef = ref(db, "contacts");
            const newContactRef = push(contactsRef);

            // Save the contact information
            await set(newContactRef, {
                name: name,
                email: email,
                phone: phone,
                message: message,
                submittedAt: new Date().toISOString()
            });

            // Show success message
            statusMessage.textContent =
                "Thank you! Your message was sent successfully.";

            // Clear the form
            contactForm.reset();

        } catch (error) {
            // Display detailed error in the browser console
            console.error("Firebase error:", error);

            // Display useful error information
            statusMessage.textContent =
                "Failed to send message: " +
                (error.code || error.message);

        } finally {
            // Re-enable the button
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
        }
    });

} else {
    console.error(
        "Contact form elements not found. Check your HTML IDs."
    );
}