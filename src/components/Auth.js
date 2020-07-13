import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import firebase from '../firebase';

export default function Auth(props) {
  const history = useHistory();
  //const classes = styles();

  const [user, setUser] = useState(null);
  const [signinCheck, setSiginCheck] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user);
      setSiginCheck(true);
    });
  });

  function Login() {
    Promise.resolve()
      .then(AuthGoogle)
      .then(AfterLogin)
      .catch(err => console.log(err));
  };

  function AfterLogin() {
    history.push('/main');
    console.log("test");
  }

  function AuthGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult();
  };

  function Logout() {
    firebase.auth().signOut();
  };

  return props.children;
}