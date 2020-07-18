import React, { useState, useEffect } from "react"
import { Scrollbars } from "react-custom-scrollbars"

import firebase, { db } from "../../firebase"

import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
  TitleText: {
    "text-align": "center",
    "font-weight": "400",
  },
  ListBlock: {
    "height": "400px",
    "width": "300px",
  },
  ListContent: {
    "min-height": "50px",
  },
})

/**
 * todoListを表示する関数
 * @param {Object} props - ユーザーの情報やTodoListのsort条件を保持している
 * @param {string} props.user - Google認証した際に得られるuseridを保持している
 * @param {string} props.msg - 期限順 or 重さ順
 * @param {boolean} props.isSortDate - 期限順でソートするかどうか(trueなら期限順、falseなら重さ順)
 */
export default function ShowTodoList(props) {

  /** 既に登録されているtodolist */
  const [todoList, setTodoList] = useState([])
  /** todolistを取得しにいくべきかどうか */
  const [needLoad, setNeedLoad] = useState(true)

  /** CSSを用いたスタイル定義 */
  const classes = styles()

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
    setTodoList([])
    const colRef = db.collection("schedule")
    const snapshots = await colRef.get()
    const docs = snapshots.docs.map(doc => doc.data())
    const schedules = docs.filter((item) => item.uid === props.user)

    const result_list = []

    for(let i = 0; i < schedules.length; i++){
      const subRef = db.collection("schedule").doc(schedules[i].docId).collection("lesson")
      const subSnapshots = await subRef.get()
      const lessons = subSnapshots.docs.map(doc => doc.data())

      for(let j = 0; j < lessons.length; j++){
        const subsubRef = db.collection("schedule")
                            .doc(schedules[i].docId)
                            .collection("lesson")
                            .doc(lessons[j].docId)
                            .collection("todo")
        const subsubSnapshots = await subsubRef.get()
        subsubSnapshots.docs.map( doc => result_list.push(doc.data()) )
      }
    }
    result_list.map(todo => todoList.push(todo))
    setTodoList([...todoList])
  }

  /**
   * 呼び出されるとtodolistを更新する
   * 具体的にはtodolistを更新するかどうかを管理する状態を変更する
   */
  function handleChange() {
    setNeedLoad(!needLoad)
  }

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item>
        <h2 className={classes.TitleText}>{props.msg}</h2>
      </Grid>
      <Grid item alignItems="center" justify="center" className={classes.ListBlock}>
        <p>test</p>
        <Scrollbars className={classes.ListContent}>
          {
            todoList.map(item => (
              <Paper elevation={3}>
                <h2>{item.title}</h2>
                <p>{item.content}</p>
              </Paper>
            ))
          }
        </Scrollbars>
      </Grid>
    </Grid>
  )
}