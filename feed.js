import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmmEIpryPRGPXb2TfvVT6WFCS8-R6Z3SE",
  authDomain: "facebook-clone-4aab0.firebaseapp.com",
  databaseURL:
    "https://facebook-clone-4aab0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "facebook-clone-4aab0",
  storageBucket: "facebook-clone-4aab0.appspot.com",
  messagingSenderId: "395821697382",
  appId: "1:395821697382:web:47676bbcef2e7a151720a7",
};

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();
let loggedUser = {
  name: "",
  surname: "",
  email: "",
};
function fetchUserData(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      const userRef = ref(db, "users/" + uid);
      const snapshot = await get(userRef);

      if (snapshot) {
        const userData = snapshot.val();
        loggedUser.name = userData.name;
        loggedUser.surname = userData.surname;
        loggedUser.email = userData.email;
        callback(loggedUser);
      } else {
        console.log("No data available for this user.");
      }
    }
  });
}

// Usage:
fetchUserData((user) => {
  loggedUser.name = user.name;
  loggedUser.surname = user.surname;
  loggedUser.email = user.email;
});
