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

// Enhanced error handling for Firebase initialization
try {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    
    // Test connection and handle offline scenarios
    db.ref('.info/connected').on('value', (snapshot) => {
        if (snapshot.val() === true) {
            console.log('✅ Connected to Firebase');
        } else {
            console.warn('⚠️ Disconnected from Firebase');
            // Could show user notification here
        }
    });
    
} catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    // Show user-friendly error message
    document.body.innerHTML = '<div style="text-align: center; padding: 50px; font-family: Arial;"><h2>Service Temporarily Unavailable</h2><p>Please try again later.</p></div>';
}
