import React, { useState, useEffect } from "react"

import firebase, { db } from "../../firebase"

import Header from "../Header"

import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import { getDefaultNormalizer } from "@testing-library/react"

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
})

/**
 * todoページを表示する関数
 * @param {Object} props - ユーザーの情報を保持している
 * @param {string} props.user - Google認証した際に得られるuseridを保持している
 */
export default function Todo(props) {

  /** 既に登録されているtodolist */
  const [todoList, setTodoList] = useState([])
  /** todolistを取得しにいくべきかどうか */
  const [needLoad, setNeedLoad] = useState(true)

  /** CSSを用いたスタイル定義 */
  const classes = styles();

  /**
   * 既に登録されているtodoを取得している
   */
  useEffect(() => {
    const data = async () => {
      await getData()
    }
    data()
  }, [needLoad])

  /**
   * firestoreに存在しているtodoを取得している
   * 取得した時間割の中で、ログイン中のユーザーが登録した時間割のみ時間割listに追加している
   */
  async function getData() {
    /*
    const colRef = db.collection("schedule")
    const snapshots = await colRef.get()
    const docs = snapshots.docs.map(doc => doc.data())
    const tmp = docs.filter((item) => item.uid === props.user)
    const result_data = [...tmp]
    setTodoList(result_data)
    */
  }

  /**
   * 呼び出されるとtodolistを更新する
   * 具体的にはtodolistを更新するかどうかを管理する状態を変更する
   */
  function handleChange() {
    setNeedLoad(!needLoad)
  }

  return (
    <Grid>
      <Header />
      <p>todo page</p>
    </Grid>
  )
}