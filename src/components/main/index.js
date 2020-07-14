import React from 'react';
import { useHistory } from 'react-router-dom';

import firebase from '../../firebase';

import Button from '@material-ui/core/Button';

export default function Main() {
  const history = useHistory();

  function MoveSchedule() {
    history.push("/schedule");
  }

  function Logout() {
    firebase.auth().signOut();
    history.push("/");
  }

  return (
    <div>
      <h1>ここはメインページ</h1>
      <Button variant="contained" onClick={Logout}>ログアウト</Button>
      <Button variant="contained" onClick={MoveSchedule}>時間割ページ</Button>
    </div>
  );
}