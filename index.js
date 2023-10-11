import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmmEIpryPRGPXb2TfvVT6WFCS8-R6Z3SE",
  authDomain: "facebook-clone-4aab0.firebaseapp.com",
  projectId: "facebook-clone-4aab0",
  storageBucket: "facebook-clone-4aab0.appspot.com",
  messagingSenderId: "395821697382",
  appId: "1:395821697382:web:47676bbcef2e7a151720a7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

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
function registration() {
  const nameValue = name.value;
  const surnameValue = surname.value;
  const emailValue = email.value;
  const passValue = password.value;
  const secPassValue = repeatPassword.value;
  const db = app.firestore();
  const usersRef = db.collection("users");
  usersRef
    .add({
      name: nameValue,
      surname: surnameValue,
      email: emailValue,
      password: passValue,
    })
    .then((user) => {
      console.log("user registered successfully", user.id);
    })
    .catch((err) => console.log("Error => ", err));
}
register.addEventListener("click", registration);
