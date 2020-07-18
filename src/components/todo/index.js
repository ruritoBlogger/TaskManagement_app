import React, { useState, useEffect } from "react"

import firebase, { db } from "../../firebase"

import Header from "../Header"
import CreateTodoDialog from "./CreateTodoDialog"
import ShowTodoList from "./ShowTodoList"

import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import { getDefaultNormalizer } from "@testing-library/react"

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
  TitleText: {
    "text-align": "center",
    "font-weight": "400",
  },
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
    const result_list = []
    const colRef = db.collection("schedule")
    const snapshots = await colRef.get()
    const docs = snapshots.docs.map(doc => doc.data())
    const schedules = docs.filter((item) => item.uid === props.user)


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
        subsubSnapshots.docs.map( doc => {
          let tmp = {}
          tmp.todo = doc.data()
          tmp.lesson = lessons[j]
          tmp.schedule = schedules[i]
          result_list.push(tmp)
        })
      }
    }
    setTodoList([])
    setTodoList([...result_list])
  }

  /**
   * 呼び出されるとtodolistを更新する
   * 具体的にはtodolistを更新するかどうかを管理する状態を変更する
   */
  function handleChange() {
    setNeedLoad(!needLoad)
  }

  return (
    <Grid direction="column">
      <Header />
      <Grid item container row alignItems="center" justify="center">
        <Grid item xs={4}>
          <h1 className={classes.TitleText}>Todo</h1>
        </Grid>
        <Grid item xs={4}>
          <h1 className={classes.TitleText}>切り替えボタン</h1>
        </Grid>
        <Grid item xs={4}>
          <CreateTodoDialog handleSubmit={handleChange} user={props.user} />
        </Grid>
      </Grid>
      <Grid item container row spacing={10} alignItems="center" justify="center">
        <Grid item>
          <ShowTodoList
            todoList={[...todoList.sort(function(a,b){
              if(a.todo.limit.seconds<b.todo.limit.seconds) return -1
              if(a.todo.limit.seconds>b.todo.limit.seconds) return 1
              return 0
            })]}
            handleChange={handleChange}
            user={props.user}
            msg="期限順" />
        </Grid>
        <Grid item>
          <ShowTodoList
            todoList={[...todoList.sort(function(a,b){
              if(a.todo.heavy>b.todo.heavy) return -1
              if(a.todo.heavy<b.todo.heavy) return 1
              return 0
            })]}
          handleChange={handleChange}
          user={props.user}
          msg="重さ順" />
        </Grid>
      </Grid>
    </Grid>
  )
}