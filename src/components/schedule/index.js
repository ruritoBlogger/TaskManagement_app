import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import firebase, { db } from '../../firebase';

import DefaultDialog from '../dialog';

import Button from '@material-ui/core/Button';
import { getDefaultNormalizer } from '@testing-library/react';

export default function Schedule(props) {

  const [scheduleList, setScheduleList] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const data = async () => {
      await getData();
    };
    data();
  });

  async function getData() {
    const colRef = db.collection("schedule");
    const snapshots = await colRef.get();
    const docs = snapshots.docs.map(doc => doc.data());
    var result_data = [];
    for (let i = 0; i < docs.length; i++) {
      if( docs[i] && docs[i].uid === props.user ) {
        result_data.push(docs[i]);
      }
    }
    setScheduleList(result_data);
  }

  function MoveMain() {
    history.push("/main")
  }

  function Debug() {
    console.log(props.user);
  }

  return (
    <div>
      <h1>ここは時間割ページ</h1>
      <table>
        <tbody>
          {
            scheduleList.map(item => (
              <tr>
                <td>{item.docId}</td>
                <td>{item.title}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <Button variant="contained" onClick={MoveMain}>ホームページ</Button>
      <Button variant="contained" onClick={Debug}>デバッグ</Button>
      <DefaultDialog user={props.user} />
    </div>
  );
}