import React, { useState, useEffect } from "react"

import firebase, { db } from "../../firebase"

import DefaultDialog from "./dialog"
import Content from "./Content"
import Header from "../Header"

import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import { getDefaultNormalizer } from "@testing-library/react"

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
  ContentHeader: {
    "text-align": "center",
    "max-width": "1080px",
  },
  text: {
    "text-align": "center",
    margin: "30px 0px",
    "padding-right": "150px",
    "font-weight": "400",
  },
  content: {
    "min-width": "1440px",
  },
})

/**
 * 時間割ページを表示する関数
 * @param {Object} props - ユーザーの情報を保持している
 * @param {string} props.user - Google認証した際に得られるuseridを保持している
 */
export default function Schedule(props) {

  /** 既に登録されている時間割list */
  const [scheduleList, setScheduleList] = useState([])
  /** 時間割listを取得しにいくべきかどうか */
  const [needLoad, setNeedLoad] = useState(true)

  /** CSSを用いたスタイル定義 */
  const classes = styles();

  /**
   * 既に登録されている時間割を取得している
   */
  useEffect(() => {
    const data = async () => {
      await getData()
    }
    data()
  }, [needLoad])

  /**
   * firestoreに存在している時間割を取得している
   * 取得した時間割の中で、ログイン中のユーザーが登録した時間割のみ時間割listに追加している
   */
  async function getData() {
    const colRef = db.collection("schedule")
    const snapshots = await colRef.get()
    const docs = snapshots.docs.map(doc => doc.data())
    const result_data = docs.filter((item) => item.uid === props.user)
    setScheduleList(result_data)
  }

  /**
   * 呼び出されると時間割listを更新する
   * 具体的には時間割listを更新するかどうかを管理する状態を変更する
   */
  function handleChange() {
    setNeedLoad(!needLoad)
  }

  return (
    <Grid>
      <Header />
      <Grid container alignItems="center" justify="center">
        <Grid item xs={5}>
          <h1 className={classes.text}>時間割</h1>
        </Grid>
        <Grid item xs={2}>
          <DefaultDialog user={props.user} handleSubmit={handleChange} />
        </Grid>
      </Grid>
      <Grid container alignItems="center" justify="center">
        <Grid  className={classes.content}>
          <Content scheduleList={scheduleList} />
        </Grid>
      </Grid>
    </Grid>
  )
}