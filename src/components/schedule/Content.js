import React, { useState, useEffect } from "react"
import { Scrollbars } from "react-custom-scrollbars"

import ShowSchedule from "./showSchedule"
import DeleteDialog from "../deleteDialog"

import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"

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
  FocusSchedule: {
    "margin-right": "30px",
  },
  FocusScheduleTitle: {
    "margin-left": "150px",
    "margin-right": "150px",
  },
  FocusScheduleTitleText: {
    "font-weight": "300",
  },
  FocusScheduleButton: {
    "margin-top": "20px",
  },
  FocusScheduleContent: {
    "background-color": "#CBCBCB",
    "min-height": "300px",
    "max-height": "500px",
  },
  FocusScheduleContentGraph: {
    "margin": "20px 30px",
  },
  OtherScheduleTitle: {
    "text-align": "center",
    "font-weight": "300",
  },
  OtherScheduleContent: {
    "background-color": "#CBCBCB",
    "min-height": "300px",
    "max-height": "500px",
  },
  OtherScheduleList: {
    "margin": "20px 30px",
    "min-height": "50px",
    "position": "relative",
  },
  OtherScheduleListText: {
    "text-align": "center",
    "margin": "0px",
    "position": "absolute",
    "top": "50%",
    "left": "50%",
    "transform": "translate(-50%, -50%)",
  },
})

/**
 * 時間割一覧ページの内容を表示する関数
 * @param {Object} props - 時間割listが格納されている
 * @param {list} props.scheduleList - 時間割list
 */
export default function Content(props) {

  /** メインで表示する時間割を管理 */
  const [focusSchedule, setFocusSchedule] = useState(null)

  /** CSSを用いたスタイル定義 */
  const classes = styles()

  /**
   * メインで表示する時間割を切り替える
   */

  useEffect(() => {
    setFocusSchedule(props.scheduleList[0])
  }, [props])

  useEffect(() => {
    console.log(focusSchedule)
  }, [focusSchedule])
  /**
   * 呼び出されると時間割を削除する
   */
  function deleteSchedule() {
    //setNeedLoad(!needLoad)
  }

  return (
    <Grid container row alignItems="center" justify="center">
      <Grid container item direction="column" xs={6} className={classes.FocusSchedule}>
        {
          (() => {
            if (focusSchedule) {
              return(
                <Grid container item direction="row">
                  <Grid item className={classes.FocusScheduleTitle}>
                    <h2 className={classes.FocusScheduleTitleText}>{focusSchedule.title}</h2>
                  </Grid>
                  <Grid item className={classes.FocusScheduleButton}>
                    <DeleteDialog Button="削除" msg={focusSchedule.title} handleSubmit={deleteSchedule} />
                  </Grid>
                </Grid>
              )
            } else {
              return(
                <Grid>
                  <p>読み込めてない</p>
                </Grid>
              )
            }
          })()
        }
        <Grid item className={classes.FocusScheduleContent}>
          <Paper elevation={3} className={classes.FocusScheduleContentGraph}>
            <ShowSchedule schedule={focusSchedule}  />
          </Paper>
        </Grid>
      </Grid>

      <Grid container item direction="column" xs={3}>
        <Grid item>
          <h2 className={classes.OtherScheduleTitle}>他の時間割</h2>
        </Grid>
        <Grid item direction="column" alignItems="center" justify="center" className={classes.OtherScheduleContent}>
          <Scrollbars className={classes.OtherScheduleContent}>
            {
              props.scheduleList.map(item => (
                <Paper elevation={3} className={classes.OtherScheduleList}>
                  <p className={classes.OtherScheduleListText}>{item.title}</p>
                </Paper>
              ))
            }
          </Scrollbars>
        </Grid>
      </Grid>
    </Grid>
  )
}