import React from 'react';
import { useHistory } from 'react-router-dom';

import firebase from '../../firebase';

import Button from '@material-ui/core/Button';



export default function Main() {
  const history = useHistory();
  
  function Logout() {
    firebase.auth().signOut();
    history.push("/");
  }

  return (
    <div>
      <h1>ここはメインページ</h1>
      <Button variant="contained" onClick={Logout}>ログアウト</Button>
    </div>
  );
}
