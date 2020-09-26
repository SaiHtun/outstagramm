import firebase from 'firebase';


var firebaseConfig = {
  apiKey: "AIzaSyAcHm-sxzfGHxdyVLLUVEU3GUiKc_6_hDo",
  authDomain: "outstagramm-2bbb5.firebaseapp.com",
  databaseURL: "https://outstagramm-2bbb5.firebaseio.com",
  projectId: "outstagramm-2bbb5",
  storageBucket: "outstagramm-2bbb5.appspot.com",
  messagingSenderId: "1570837939",
  appId: "1:1570837939:web:b68b5e5a565121569c67c6",
  measurementId: "G-8CGY2FKWZ1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {
  db, auth, storage
};

