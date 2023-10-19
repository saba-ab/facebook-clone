import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {
  getDatabase,
  ref as dbRef,
  get,
  set,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

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
const storage = getStorage(app);
document.addEventListener("DOMContentLoaded", loadProfileImage);

function loadProfileImage() {
  const savedProfilePicURL = localStorage.getItem("profilePicURL");
  if (savedProfilePicURL) {
    const profileImgs = document.querySelectorAll(".profileImg");
    profileImgs.forEach((img) => (img.src = savedProfilePicURL));
  }
}

function fetchUserData(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    const userRef = dbRef(db, `users/${user.uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) callback(snapshot.val(), user.uid);
  });
}

function setupUserInterface(user, uid) {
  const textarea = document.getElementById("textarea");
  const asideName = document.getElementById("asideName");
  asideName.textContent = `${user.name} ${user.surname}`;
  textarea.placeholder = `What's on your mind, ${user.name}?`;
  localStorage.setItem("uid", uid);
  localStorage.setItem("name", user.name);
  localStorage.setItem("surname", user.surname);
}

function uploadProfilePhoto() {
  const imageInput = document.getElementById("profileImgInput");
  imageInput.click();
  imageInput.addEventListener("change", async () => {
    const file = imageInput.files[0];
    if (!file) return;
    const imgRef = ref(storage, `profilePics/${file.name}`);
    await uploadBytes(imgRef, file);
    const url = await getDownloadURL(imgRef);
    const profileImgs = document.querySelectorAll(".profileImg");
    profileImgs.forEach((img) => {
      localStorage.setItem("profilePicURL", url);
      img.src = url;
    });
  });
}

document
  .getElementById("profile")
  .addEventListener("click", uploadProfilePhoto);

function addPost(uid, content, userName) {
  if (!uid) {
    console.error("UID is not provided.");
    return;
  }
  const postRef = dbRef(db, `posts/${uid}`);
  const newPost = push(postRef);
  set(newPost, {
    userId: uid,
    userName: userName,
    content: content,
    timeStamp: Date.now(),
    likes: 0,
    comments: {},
  });
}

function handleInputs(userData, uid) {
  const textarea = document.getElementById("textarea");
  textarea.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    addPost(uid, e.target.value, `${userData.name} ${userData.surname}`);
    textarea.value = "";
  });
}
function handleCommentInput(userData, uid) {
  const commentInputs = document.querySelectorAll(".commentInput");

  commentInputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const commentText = e.target.value;
        const userName = localStorage.getItem("name");
        const postId = e.target.getAttribute("data-post-id");
        addCommentToPost(uid, postId, userName, commentText);
        e.target.value = "";
      }
    });
  });
}

function addCommentToPost(userId, postId, userName, content) {
  const comment = {
    userName: userName,
    content: content,
    timeStamp: Date.now(),
  };
  const newCommentRef = push(dbRef(db, `posts/${postId}/${userId}/comments`));
  set(newCommentRef, comment);
}
function deletePostFromDb(event) {
  const postId = event.target.getAttribute("data-post-id");
  const uid = localStorage.getItem("uid");

  const postRef = dbRef(db, `posts/${uid}/${postId}`);
  postRef
    .remove()
    .then(() => {
      postDiv.remove();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function renderPost(postData) {
  const postsDiv = document.querySelector(".posts");
  postsDiv.innerHTML = "";
  const uid = localStorage.getItem("uid");
  if (!postData) return;
  const posts = Object.keys(postData[uid]).reverse();
  posts.forEach((post) => {
    const eachPost = postData[uid][post];
    const postDiv = document.createElement("div");
    const userPost = document.createElement("div");
    const removeBtn = document.createElement("div");
    removeBtn.className = "remove";
    removeBtn.textContent = "X";

    userPost.appendChild(removeBtn);
    userPost.className = "user-post";
    postDiv.className = "post";
    const profileImg = document.createElement("img");
    profileImg.src = localStorage.getItem("profilePicURL");
    const username = document.createElement("h3");
    const content = document.createElement("p");
    const timePassed = document.createElement("p");
    const likeCommentShare = document.createElement("div");
    likeCommentShare.className = "like-comment-share";
    const likeBtn = document.createElement("div");
    const commentBtn = document.createElement("div");
    const shareBtn = document.createElement("div");
    const commentDiv = document.createElement("div");
    const commentImg = document.createElement("img");
    commentImg.src = localStorage.getItem("profilePicURL");
    const commentInput = document.createElement("input");

    commentDiv.append(commentImg, commentInput);
    commentDiv.className = "commentInput";
    commentInput.setAttribute("data-post-id", post);
    commentInput.placeholder = "submit your comment ...";
    shareBtn.innerHTML =
      '<i data-visualcompletion="css-img" class="x1b0d499 x1d69dk1" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/yA-KngywJbh.png&quot;); background-position: 0px -441px; background-size: 21px 591px; width: 20px; height: 20px; background-repeat: no-repeat; display: inline-block;"></i>   Share';
    likeBtn.innerHTML =
      '<i data-visualcompletion="css-img" class="x1b0d499 x1d69dk1" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/yA-KngywJbh.png&quot;); background-position: 0px -336px; background-size: 21px 591px; width: 20px; height: 20px; background-repeat: no-repeat; display: inline-block;"></i>   Like';
    commentBtn.innerHTML =
      '<i data-visualcompletion="css-img" class="x1b0d499 x1d69dk1" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/yA-KngywJbh.png&quot;); background-position: 0px -168px; background-size: 21px 591px; width: 20px; height: 20px; background-repeat: no-repeat; display: inline-block;"></i> Comment';
    likeCommentShare.appendChild(likeBtn);
    likeCommentShare.appendChild(commentBtn);
    likeCommentShare.appendChild(shareBtn);
    timePassed.textContent = `${moment(eachPost.timeStamp).fromNow()} ago`;
    username.textContent = eachPost.userName;
    content.textContent = eachPost.content;
    if (eachPost.comments && typeof eachPost.comments === "object") {
      const commentsDiv = document.createElement("div");
      commentsDiv.className = "comments";
      Object.values(eachPost.comments).forEach((comment) => {
        console.log(comment);
        const commentDiv = document.createElement("div");
        commentDiv.className = "commentDiv";
        const commentAuthor = document.createElement("span");
        commentAuthor.className = "comment-author";
        commentAuthor.textContent = comment.userName;
        const commentContent = document.createElement("span");
        commentContent.className = "comment-content";
        commentContent.textContent = comment.content;
        commentDiv.appendChild(commentAuthor);
        commentDiv.appendChild(commentContent);
        commentsDiv.appendChild(commentDiv);
      });

      postDiv.appendChild(commentsDiv);
    }
    userPost.append(profileImg, username, timePassed);
    postDiv.append(userPost, content, likeCommentShare, commentDiv);
    postsDiv.appendChild(postDiv);
    removeBtn.addEventListener("click", deletePostFromDb);
  });
}
const postsRef = dbRef(db, "posts");
onValue(postsRef, (snapshot) => renderPost(snapshot.val()));

fetchUserData((userData, uid) => {
  setupUserInterface(userData, uid);
  handleInputs(userData, uid);
  handleCommentInput(userData, uid);
});
