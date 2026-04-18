// TODO: Replace with your actual Firebase Project Configuration!
// 1. Go to Firebase Console -> Project Settings
// 2. Add a Web App
// 3. Copy the firebaseConfig object here.
const firebaseConfig = {
  apiKey: "AIzaSyChwME6_yUHJlGN3goh7TiSqq2MFswQzwQ",
  authDomain: "scratch-150e5.firebaseapp.com",
  projectId: "scratch-150e5",
  storageBucket: "scratch-150e5.firebasestorage.app",
  messagingSenderId: "397501989792",
  appId: "1:397501989792:web:2089f0dd6a425fb90e1ac5",
  measurementId: "G-1MTLVY79T7"
};

// Initialize Firebase (Only if the API key has been replaced, to prevent local crashing)
let app, db, auth;
if (firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    try {
        app = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        console.log("Firebase Connected");
    } catch(e) {
        console.error("Firebase init error", e);
    }
} else {
    console.warn("⚠️ Firebase is using placeholder credentials! Data will not sync to the cloud.");
}

window.FB = { app, db, auth };
