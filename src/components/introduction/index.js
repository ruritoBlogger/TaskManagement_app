import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import firebase from "../../firebase";

import Content from "./Content";

/**
 * 紹介画面の内容を表示する関数
 * @param {Object} props - userの状態が格納されている
 *                       - {user} Google認証後にはuseridが、そうでない場合はnull
 *                       - {setUser} userを更新する際に用いる
 */
export default function Introduction(props) {
  /** 画面遷移を担当 */
  const history = useHistory();

  /**
   * ユーザーの状態を監視している
   * Google認証に成功してユーザーの情報を更新出来た場合/main/に遷移させる
   */
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        props.setUser(user.uid);
        history.push("/main");
      }
    });
  });

  /**
   * Google認証を用いたログイン機能
   * firebase authを用いている
   */
  function Login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  return <Content Login={Login}></Content>;
}
