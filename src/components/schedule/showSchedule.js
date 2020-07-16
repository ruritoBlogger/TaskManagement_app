import React, { useState, useEffect } from "react"

import LessonDialog from "./LessonDialog"
import DeleteDialog from "../deleteDialog"
import firebase, { db } from "../../firebase"

import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
  DayBlock: {
    "margin": "0px",
  },
  LessonBlock: {
    "width": "132px",
    "margin": "0px",
  },
  LessonBlockText: {
    "margin": "0px",
  },
})

/**
 * 時間割の内容を表示する関数
 * @param {Object} props - 表示したい時間割などが格納されている
 * @param {list} props.schedule - 表示したい時間割
 */
export default function ShowSchedule(props) {

  /** 時間割に登録されている授業list */
  const [lessonList, setLessonList] = useState([])

  /** 授業listを更新するかどうかの状態 */
  const [needLoad, setNeedLoad] = useState(false)

  /** CSSを用いたスタイル定義 */
  const classes = styles()

  /** 曜日の順番 */
  const day_list = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"]

  /** 時間帯の順番 */
  const time_list = ["1限目", "2限目", "3限目", "4限目", "5限目", "6限目"]

  /**
   * firestoreに存在する色データを取得している
   */
  useEffect(() => {
    const data = async () => {
      await getData()
    }
    data()
  }, [needLoad || props])

  /**
   * firestoreに存在している色データを取得している
   * ダイアログが開いた時に取得するようにしている
   */
  async function getData() {
    let colRef = db.collection("lesson")
    if( props.schedule ) {
      colRef = db.collection("schedule").doc(props.schedule.docId).collection("lesson")
    }
    const snapshots = await colRef.get()
    const docs = snapshots.docs.map(doc => doc.data())



    let tmp_list = new Array(30).fill(null)
    for(let i = 0; i < 30; i++) {
      let tmp_lesson = {}
      tmp_lesson.title = "未登録"
      tmp_lesson.classroom = "未登録"
      tmp_lesson.color="#FFFFFF"
      tmp_lesson.date = i
      tmp_list[i] = tmp_lesson
    }

    docs.map(item => (
      tmp_list[item.date] = item
    ))
    setLessonList(tmp_list)
  }

  /**
   * 呼び出されると授業listを更新する
   * 具体的には授業listを更新するかどうかを管理する状態を変更する
   */
  function handleChange() {
    //setNeedLoad(!needLoad)
  }

  return (
    <Grid>
      <Grid container>
        {
          (() => {
            if( lessonList[29] ) {
              let result_data = []
              for(let i = 0; i < 5; i++) {
                  result_data.push(
                    <Grid item direction="column" className={classes.DayBlock}>
                      <Grid item className={classes.LessonBlock}>
                        <h4 className={classes.LessonBlockText}>{lessonList[i].title}</h4>
                        <p className={classes.LessonBlockText}>{lessonList[i].classroom}</p>
                      </Grid>
                      <Grid item className={classes.LessonBlock}>
                        <h4 className={classes.LessonBlockText}>{lessonList[i+1].title}</h4>
                        <p className={classes.LessonBlockText}>{lessonList[i+1].classroom}</p>
                      </Grid>
                      <Grid item className={classes.LessonBlock}>
                        <h4 className={classes.LessonBlockText}>{lessonList[i+2].title}</h4>
                        <p className={classes.LessonBlockText}>{lessonList[i+2].classroom}</p>
                      </Grid>
                      <Grid item className={classes.LessonBlock}>
                        <h4 className={classes.LessonBlockText}>{lessonList[i+3].title}</h4>
                        <p className={classes.LessonBlockText}>{lessonList[i+3].classroom}</p>
                      </Grid>
                      <Grid item className={classes.LessonBlock}>
                        <h4 className={classes.LessonBlockText}>{lessonList[i+4].title}</h4>
                        <p className={classes.LessonBlockText}>{lessonList[i+4].classroom}</p>
                      </Grid>
                    </Grid>
                  )
              }
              return result_data
            }
          })()
        }
      </Grid>
      <LessonDialog schedule={props.schedule} handleSubmit={handleChange} />
    </Grid>
  )
}