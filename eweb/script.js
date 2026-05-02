// 🔥 Firebase config (REPLACE THIS)
const firebaseConfig = {
    apiKey: "AIzaSyAl7EzbvnOe2wZtJ4xVK09ejigrmSmk7B0",
    authDomain: "new-web-frfrfr.firebaseapp.com",
    projectId: "new-web-frfrfr",
    storageBucket: "new-web-frfrfr.firebasestorage.app",
    messagingSenderId: "777483484699",
    appId: "1:777483484699:web:2aa158081e42a2000842beD"
  };
  
  // INIT FIREBASE
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const friendsRef = db.collection("friends");
  
  let friends = [];
  
  // 📡 LOAD REAL-TIME DATA
  function loadFriends() {
    friendsRef.onSnapshot(snapshot => {
      friends = [];
      snapshot.forEach(doc => friends.push(doc.data()));
      renderFriends();
    });
  }
  
  // 🧑‍🤝‍🧑 RENDER FRIEND CARDS
  function renderFriends() {
    const container = document.getElementById("friendsContainer");
    container.innerHTML = "";
  
    friends.forEach(f => {
      container.innerHTML += `
        <div class="friend-card" onclick="openProfile('${f.id}')">
          <img src="${f.avatar}">
          <h3>${f.nickname}</h3>
          <p>❤️ ${f.likes} | 👥 ${f.followers}</p>
        </div>
      `;
    });
  }
  
  // 👤 OPEN PROFILE
  function openProfile(id) {
    const user = friends.find(f => f.id === id);
  
    const modal = document.getElementById("modal");
    modal.classList.remove("hidden");
  
    modal.querySelector(".modal-content").innerHTML = `
      <button onclick="closeModal()">✖</button>
  
      <img src="${user.banner}" class="banner">
      <img src="${user.avatar}" class="profile-avatar">
  
      <h2>${user.nickname}</h2>
      <p>${user.realName}</p>
      <p>${user.bio}</p>
  
      <button onclick="likeUser('${user.id}')">❤️ ${user.likes}</button>
      <button onclick="followUser('${user.id}')">👥 ${user.followers}</button>
      <button onclick="deleteFriend('${user.id}')">🗑 Delete</button>
    `;
  }
  
  // ❤️ LIKE
  function likeUser(id) {
    const f = friends.find(x => x.id === id);
  
    friendsRef.doc(id).update({
      likes: f.likes + 1
    });
  }
  
  // 👥 FOLLOW
  function followUser(id) {
    const f = friends.find(x => x.id === id);
  
    friendsRef.doc(id).update({
      followers: f.followers + 1
    });
  }
  
  // 🗑 DELETE
  function deleteFriend(id) {
    friendsRef.doc(id).delete();
  }
  
  // ❌ CLOSE MODAL
  function closeModal() {
    document.getElementById("modal").classList.add("hidden");
  }
  
  // 🚀 START APP
  loadFriends();