import React from 'react';
import { useHistory } from 'react-router-dom';

import firebase from '../../firebase';

import Button from '@material-ui/core/Button';

export default function Schedule() {
  const history = useHistory();

  function MoveMain() {
    history.push("/main")
  }

  return (
    <div>
      <h1>ここは時間割ページ</h1>
      <Button variant="contained" onClick={MoveMain}>ホームページ</Button>
    </div>
  );
}