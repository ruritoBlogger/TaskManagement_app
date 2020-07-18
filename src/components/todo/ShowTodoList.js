import React, { useState, useEffect } from "react"
import { Scrollbars } from "react-custom-scrollbars"

import firebase, { db } from "../../firebase"

import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Paper from "@material-ui/core/Paper"
import Icon from "@material-ui/core/Icon"
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

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
    "background-color": "#CBCBCB",
    "height": "600px",
    "width": "500px",
  },
  ListContent: {
    "margin": "20px 30px",
  },
  ListContentTextBlock: {
    "width": "280px",
    "margin": "10px",
  },
  ListContentTextTitle: {
    "margin": "0px 0px 30px 10px",
  },
  ListContentTextContent: {
    "margin": "0px",
  },
  ListContentButtonBlock: {
    "width": "50px",
    "margin": "0px",
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

  /**
   * 削除ボタンがクリックされると発火する
   * クリックされたTodoを削除する
   * @param {object} data - 削除したいtodoなどが格納されている
   * @param {object} data.schedule - 削除したいtodoが登録されている時間割
   * @param {object} data.lesson - 削除したいtodoが登録されている授業
   * @param {object} data.todo - 削除したいtodo
   */
  async function DeleteTodo(data){
    await db.collection("schedule")
            .doc(data.schedule.docId)
            .collection("lesson")
            .doc(data.lesson.docId)
            .collection("todo")
            .doc(data.todo.docId)
            .delete()
    handleChange()
  }

  /**
   * 引数の時間を日時に変更する
   * @param {int} secs - 1970年0月1日からの経過時間
   */
  function toDateTime(secs){
    let t = new Date(1970, 0, 1)
    t.setSeconds(secs)
    return t.toISOString()
  }

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item>
        <h2 className={classes.TitleText}>{props.msg}</h2>
      </Grid>
      <Grid item alignItems="center" justify="center" className={classes.ListBlock}>
        <Scrollbars >
          {
            todoList.map(item => (
              <Paper elevation={3} className={classes.ListContent}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>
                      <Grid container direction="row">
                        <Grid item className={classes.ListContentTextBlock}>
                          <h2 className={classes.ListContentTextTitle}>{item.todo.title}</h2>
                          <p className={classes.ListContentTextContent}>{toDateTime(item.todo.limit.seconds)}</p>
                        </Grid>
                        <Grid item container direction="column" className={classes.ListContentButtonBlock}>
                          <Grid item>
                            <IconButton aria-label="delete"><Icon>done</Icon></IconButton>
                          </Grid>
                          <Grid item>
                            <IconButton onClick={() => DeleteTodo(item)} aria-label="delete"><Icon>delete</Icon></IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid item>
                      <p className={classes.ListContentTextContent}>{item.todo.content}</p>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            ))
          }
        </Scrollbars>
      </Grid>
    </Grid>
  )
}