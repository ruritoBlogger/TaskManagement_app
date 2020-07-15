import React, { useState, useEffect } from 'react';

import firebase, { db } from '../../firebase';

import DefaultDialog from './dialog';
import Header from '../Header';

import Button from '@material-ui/core/Button';
import { getDefaultNormalizer } from '@testing-library/react';

/**
 * 時間割ページを表示する関数
 * @param {Object} props - ユーザーの情報を保持している
 * @param {string} props.user - Google認証した際に得られるuseridを保持している
 */
export default function Schedule(props) {

  /** 既に登録されている時間割list */
  const [scheduleList, setScheduleList] = useState([]);

  /**
   * 既に登録されている時間割を取得している
   */
  useEffect(() => {
    const data = async () => {
      await getData();
    };
    data();
  });

  /**
   * firestoreに存在している時間割を取得している
   * 取得した時間割の中で、ログイン中のユーザーが登録した時間割のみ時間割listに追加している
   */
  async function getData() {
    const colRef = db.collection("schedule");
    const snapshots = await colRef.get();
    const docs = snapshots.docs.map(doc => doc.data());
    const result_data = docs.filter((item) => item.uid === props.user);
    setScheduleList(result_data);
  }

  return (
    <div>
      <Header />
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
      <DefaultDialog user={props.user} />
    </div>
  );
}