import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';

import firebase from '../../firebase';

import Content from './Content';

export default function Introduction(props) {
  const history = useHistory();
  //const classes = styles();


  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      props.setUser(user);
      if (user) {
        history.push("/main")
      }
    });

  });

  function Login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  };

  return(
    <Content
      Login={Login}
      >
    </Content>
  );
}