import React, { useState, useEffect } from "react"

import LessonDialog from "./LessonDialog"
import DeleteDialog from "../deleteDialog"
import firebase, { db } from "../../firebase"

import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
  DayBlock: {
    "margin": "0px",
  },
  GuideBlock: {
    "height": "50px",
    "margin": "0px 1px 5px 1px",
  },
  GuideBlockText: {
    "text-align": "center",
    "margin": "0px",
    "padding-top": "13px",
  },
  LessonBlock: {
    "width": "121px",
    "height": "50px",
    "margin": "0px 1px 5px 1px",
  },
  LessonBlockText: {
    "margin": "0px",
    "text-align": "center",
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

  /** 時間割の曜日部分 */
  const DayList = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"]

  /** CSSを用いたスタイル定義 */
  const classes = styles()

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
              result_data.push(
                <Grid item direction="column" className={classes.DayBlock}>
                  <Paper elevation={1} className={classes.GuideBlock}>
                    <p className={classes.GuideBlockText}>   </p>
                  </Paper>
                  <Paper elevation={1} className={classes.GuideBlock}>
                    <p className={classes.GuideBlockText}>1限目</p>
                  </Paper>
                  <Paper elevation={1} className={classes.GuideBlock}>
                    <p className={classes.GuideBlockText}>2限目</p>
                  </Paper>
                  <Paper elevation={1} className={classes.GuideBlock}>
                    <p className={classes.GuideBlockText}>3限目</p>
                  </Paper>
                  <Paper elevation={1} className={classes.GuideBlock}>
                    <p className={classes.GuideBlockText}>4限目</p>
                  </Paper>
                  <Paper elevation={1} className={classes.GuideBlock}>
                    <p className={classes.GuideBlockText}>5限目</p>
                  </Paper>
                  <Paper elevation={1} className={classes.GuideBlock}>
                    <p className={classes.GuideBlockText}>6限目</p>
                  </Paper>
                </Grid>
              )
              for(let i = 0; i < 5; i++) {
                  result_data.push(
                    <Grid item direction="column" className={classes.DayBlock}>
                    <Paper elevation={3} className={classes.LessonBlock}>
                        <p className={classes.GuideBlockText}>{DayList[i]}</p>
                      </Paper>
                      <Paper elevation={3} className={classes.LessonBlock}>
                        <h4 className={classes.LessonBlockText}>{lessonList[i*6].title}</h4>
                        <p className={classes.LessonBlockText}>{lessonList[i*6].classroom}</p>
                      </Paper>
                      <Paper elevation={3} item className={classes.LessonBlock}>
                        <h4 className={classes.LessonBlockText}>{lessonList[i*6+1].title}</h4>
                        <p className={classes.LessonBlockText}>{lessonList[i*6+1].classroom}</p>
                      </Paper>
                      <Paper elevation={3} item className={classes.LessonBlock}>
                        <h4 className={classes.LessonBlockText}>{lessonList[i*6+2].title}</h4>
                        <p className={classes.LessonBlockText}>{lessonList[i*6+2].classroom}</p>
                      </Paper>
                      <Paper elevation={3} item className={classes.LessonBlock}>
                        <h4 className={classes.LessonBlockText}>{lessonList[i*6+3].title}</h4>
                        <p className={classes.LessonBlockText}>{lessonList[i*6+3].classroom}</p>
                      </Paper>
                      <Paper elevation={3} item className={classes.LessonBlock}>
                        <h4 className={classes.LessonBlockText}>{lessonList[i*6+4].title}</h4>
                        <p className={classes.LessonBlockText}>{lessonList[i*6+4].classroom}</p>
                      </Paper>
                      <Paper elevation={3} item className={classes.LessonBlock}>
                        <h4 className={classes.LessonBlockText}>{lessonList[i*6+5].title}</h4>
                        <p className={classes.LessonBlockText}>{lessonList[i*6+5].classroom}</p>
                      </Paper>
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