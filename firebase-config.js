// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKIdmJI5qJ7KiTJ-5Nws8bc82EJ8mHydM",
  authDomain: "jfsilvaconstrucoes-2e734.firebaseapp.com",
  databaseURL: "https://jfsilvaconstrucoes-2e734-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "jfsilvaconstrucoes-2e734",
  storageBucket: "jfsilvaconstrucoes-2e734.firebasestorage.app",
  messagingSenderId: "870494421183",
  appId: "1:870494421183:web:e39a7895b04f85e54e460a",
  measurementId: "G-SB4T8J8YBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
