// 🔥 FIREBASE CONFIG (PASTE YOURS HERE)
const firebaseConfig = {
  apiKey: "AIzaSyBA4qSGPN-GQ4AwB56aSS_7enWyHePb6z8",
  authDomain: "diddysec.firebaseapp.com",
  projectId: "diddysec",
  storageBucket: "diddysec.firebasestorage.app",
  messagingSenderId: "758648114224",
  appId: "1:758648114224:web:a4c127015d6d4c6c8671f5"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let profile = {};

// ---------------- AUTH ----------------
function signup() {
  auth.createUserWithEmailAndPassword(email.value, password.value);
}

function login() {
  auth.signInWithEmailAndPassword(email.value, password.value);
}

auth.onAuthStateChanged(user => {
  if (user) {
    authBox.style.display = "none";
    app.style.display = "block";

    status.innerText = "Logged in: " + user.email;

    loadProfile();
    loadFeed();
  }
});

// ---------------- PROFILE ----------------
function saveProfile() {
  const user = auth.currentUser;
  if (!user) return;

  profile = {
    name: name.value,
    tag: tag.value,
    bio: bio.value,
    spotify: spotify.value,

    socials: {
      discord: discord.value,
      instagram: instagram.value,
      tiktok: tiktok.value,
      github: github.value
    }
  };

  db.collection("users").doc(user.uid).set({ profile });

  renderProfile();
}

function loadProfile() {
  const user = auth.currentUser;

  db.collection("users").doc(user.uid).get()
    .then(doc => {
      if (doc.exists) {
        profile = doc.data().profile;

        name.value = profile.name || "";
        tag.value = profile.tag || "";
        bio.value = profile.bio || "";
        spotify.value = profile.spotify || "";

        renderProfile();
      }
    });
}

// 🎵 SPOTIFY EMBED
function getSpotifyEmbed(url) {
  if (!url) return "";

  const match = url.match(/(track|album|playlist)\/([a-zA-Z0-9]+)/);
  if (!match) return "";

  return `
    <iframe
      style="border-radius:12px"
      src="https://open.spotify.com/embed/${match[1]}/${match[2]}"
      width="100%"
      height="152"
      frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
    </iframe>
  `;
}

// ---------------- RENDER PROFILE ----------------
function renderProfile() {
  profileDisplay.innerHTML = `
    <h3>${profile.name || ""}</h3>
    <p>${profile.tag || ""}</p>
    <p>${profile.bio || ""}</p>

    <hr/>

    ${profile.socials?.discord ? "💬 " + profile.socials.discord + "<br>" : ""}
    ${profile.socials?.instagram ? `<a href="${profile.socials.instagram}" target="_blank">📸 Instagram</a><br>` : ""}
    ${profile.socials?.tiktok ? `<a href="${profile.socials.tiktok}" target="_blank">🎵 TikTok</a><br>` : ""}
    ${profile.socials?.github ? `<a href="${profile.socials.github}" target="_blank">💻 GitHub</a><br>` : ""}

    <hr/>

    ${getSpotifyEmbed(profile.spotify)}
  `;
}

// ---------------- POSTS ----------------
function createPost() {
  const user = auth.currentUser;
  if (!user) return;

  db.collection("posts").add({
    text: postText.value,
    name: profile.name || "User",
    uid: user.uid,
    time: Date.now()
  });

  postText.value = "";
  loadFeed();
}

function loadFeed() {
  feed.innerHTML = "";

  db.collection("posts")
    .orderBy("time", "desc")
    .limit(20)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const p = doc.data();

        feed.innerHTML += `
          <div class="post">
            <b>${p.name}</b>
            <p>${p.text}</p>
          </div>
        `;
      });
    });
}