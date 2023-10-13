// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);
const users = ref(db, "users");
//buttons
const logIn = document.getElementById("logIn");
const createAcc = document.getElementById("createAcc");
const returnToLogIn = document.getElementById("returnToLogIn");
const register = document.getElementById("register");
// inputs
const name = document.getElementById("name");
const surname = document.getElementById("surname");
const password = document.getElementById("password");
const email = document.getElementById("email");
const repeatPassword = document.getElementById("repeatPassword");
const toggleInputs = [name, surname, repeatPassword, returnToLogIn, register];
const toggleBack = [logIn, createAcc];
let isRegistering = false;
// errors
const errorMessage = document.getElementById("errorHandler");
const success = document.getElementById("success");
//open registration form on click
function goToRegistration() {
  if (!isRegistering) {
    toggleInputs.forEach((inp) => {
      inp.style.display = "block";
    });
    toggleBack.forEach((inp) => {
      inp.style.display = "none";
    });
    isRegistering = true;
  }
}
createAcc.addEventListener("click", goToRegistration);

// return to log in form obn click
function goToLogIn() {
  success.style.display = "none";
  if (isRegistering) {
    toggleInputs.forEach((inp) => {
      inp.style.display = "none";
    });
    toggleBack.forEach((inp) => {
      inp.style.display = "block";
    });
    isRegistering = false;
  }
}
returnToLogIn.addEventListener("click", goToLogIn);

// validations
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  return password.length >= 8 && password.length <= 22;
}

function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

async function registration() {
  const nameValue = name.value;
  const surnameValue = surname.value;
  const emailValue = email.value;
  const passValue = password.value;
  const secPassValue = repeatPassword.value;
  errorMessage.textContent = "";
  success.style.display = "none";
  if (!isValidEmail(emailValue)) {
    errorMessage.textContent = "Invalid email format.";
    return;
  }

  if (!isValidPassword(passValue)) {
    errorMessage.textContent =
      "Password should be between 8 and 22 characters.";
    return;
  }

  if (!passwordsMatch(passValue, secPassValue)) {
    errorMessage.textContent = "Passwords do not match.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      emailValue,
      passValue
    );
    const user = userCredential.user;
    console.log("User registered:", user.uid);

    const userRef = ref(db, "users/" + user.uid);
    await set(userRef, {
      name: nameValue,
      surname: surnameValue,
      email: emailValue,
    });
    console.log("User data stored in the database.");
    success.style.display = "block";
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      errorMessage.textContent = "Email is already in use";
    }
    console.error("Error registering user:", error.message);
  }
}
register.addEventListener("click", registration);

async function logInToNewsFeed() {
  const emailValue = email.value;
  const passValue = password.value;
  errorMessage.textContent = "";
  try {
    const userInfo = await signInWithEmailAndPassword(
      auth,
      emailValue,
      passValue
    );
    const user = userInfo.user;
    console.log(user);

    window.location.href = "news-feed.html";
  } catch (err) {
    console.log(err);
    if (err.code === "auth/invalid-email") {
      errorMessage.textContent = "user not found";
    } else if (err.code === "auth/invalid-login-credentials") {
      errorMessage.textContent = "password is incorrect";
    } else {
      errorMessage.textContent = "unknown error";
    }
  }
}
logIn.addEventListener("click", logInToNewsFeed);
