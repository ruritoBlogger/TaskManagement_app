import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';

import firebase from '../firebase';

export default function Auth(props) {
  const history = useHistory();
  //const classes = styles();

  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [signinCheck, setSiginCheck] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    firebase.auth().onAuthStateChanged(user => {
      setUser(user);
      setSiginCheck(true);
    });

    return function cleanup() {
        setIsMounted(false);
    }
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

  if( !signinCheck )
  {
    return(
      <LoadingOverlay
        active={true}
        spinner
        text='Loading...'
    >
      <div style={{ height: '100vh', width: '100vw' }}></div>
    </LoadingOverlay>
    )
  } else {
    return props.children;
  }
}