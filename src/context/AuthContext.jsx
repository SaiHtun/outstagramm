import React, { useState, createContext, useEffect } from 'react';
import { auth, db } from '../firebase';
import firebase from 'firebase';

export const AuthContext = createContext();


function AuthContextProvider(props) {
  const localStorageAuth = localStorage.getItem('auth');
  const [ authUser, setAuthUser ] = useState(JSON.parse(localStorageAuth) || null); 
  const [ error, setError ] = useState(null);
  const [ closePanel, setClosePanel ] = useState(false);
  const [ dropProfilePanel, setDropProfilePanel ] = useState(false);
  const [ users, setUsers ] = useState([]);
  const [ user, setUser ] = useState({});


  // toggle drop profile panel
  const toggleDropProfilePanel = () => {
    setDropProfilePanel(!dropProfilePanel);
  }

  // drop POST/PROFILE panel
  const togglePostPanel = () => {
    setClosePanel(false);
  }

  const closeProfile = (e) => {
    if(e.target.className !== "userCircle" && e.target.className !== "dots" && e.target.className !== "comment" && e.target.className !== "commentInfo") {
      setDropProfilePanel(false);
      setClosePanel(true);
    }
  }

  useEffect(() => {
    //  listen to Auth User state changes
    let gg = auth.onAuthStateChanged((user) => {
      
      if(user) {
        // users
        db.collection("users").onSnapshot((snapshots) => {
          setUsers(snapshots.docs.map((snapshot) => {
            return snapshot.data()
          }))
        })
        // user
        db.collection("users").where("id", "==", user.uid)
        .onSnapshot((snapshots) => {
          snapshots.docs.forEach((user) => {
            setUser({
              id: user.id,
              user: user.data() 
            })
          })
      })
        localStorage.setItem('auth', JSON.stringify(user));
        setAuthUser(user);
      } else {
        localStorage.removeItem('auth');
        setAuthUser(null);
      }

      return () => {
        gg();
      };
    })
    
  }, [authUser])


  const SignUp = (email, password, username) => {
    // create user
    auth.createUserWithEmailAndPassword(email, password)
    .then(async (authUser) => {
      await db.collection("users").add({
        id: authUser.user.uid,
        username,
        imageURL: "",
        bio: "",
        timestamps: firebase.firestore.FieldValue.serverTimestamp()
      })
      if(authUser.displayName) {
        return;
      }else {
        authUser.user.updateProfile({ displayName: username })
      }
    })
    .catch((err) => alert(err.message));
  }

  const SignIn = (email, password) => {
    auth.signInWithEmailAndPassword(email, password)
      .catch((err) => setError(err));
  }

  const SignOut = () => {
    auth.signOut();
    localStorage.removeItem("auth");
  }

  return (
    <AuthContext.Provider value={{SignUp, closeProfile, SignIn, SignOut, 
    authUser, error, closePanel, togglePostPanel, dropProfilePanel, toggleDropProfilePanel, users, user}}>
      { props.children }
    </AuthContext.Provider>
  )
}

export default AuthContextProvider;
