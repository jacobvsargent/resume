// Firebase configuration (config.js)
// ✅ Firebase Security Rules are now protecting your database
// The API key can be public for client-side Firebase apps when rules are properly configured
const firebaseConfig = {
    apiKey: "AIzaSyDcuGP9MQDjKLcLjHR2TI8TrKRiG31nHF4",
    authDomain: "common-sense-28b23.firebaseapp.com",
    projectId: "common-sense-28b23",
    storageBucket: "common-sense-28b23.firebasestorage.app",
    messagingSenderId: "343190251506",
    appId: "1:343190251506:web:8636048879ef422a74ed6b",
    measurementId: "G-NZP8ZQZCWZ"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
