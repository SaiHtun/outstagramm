import firebase from 'firebase';

// var firebaseConfig = {
//   apiKey: "AIzaSyDKqWBF19ApfM8LaNkJEvLecGkK6r0I4NY",
//   authDomain: "outstagramm.firebaseapp.com",
//   databaseURL: "https://outstagramm.firebaseio.com",
//   projectId: "outstagramm",
//   storageBucket: "outstagramm.appspot.com",
//   messagingSenderId: "702086389426",
//   appId: "1:702086389426:web:e7370f48851bc53798b3ab",
//   measurementId: "G-5DHQD7C4LV"
// };
var firebaseConfig = {
  apiKey: "AIzaSyCLum0T6Ng8aE-VZ2MGMfhwQifd90JoCV8",
  authDomain: "instagram-clone-7b11f.firebaseapp.com",
  databaseURL: "https://instagram-clone-7b11f.firebaseio.com",
  projectId: "instagram-clone-7b11f",
  storageBucket: "instagram-clone-7b11f.appspot.com",
  messagingSenderId: "21432529587",
  appId: "1:21432529587:web:f471a726b0bec75ab436c6",
  measurementId: "G-SPM5MGH9MY"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {
  db, auth, storage
};