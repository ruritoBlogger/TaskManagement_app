import React, { useState, useEffect } from "react"
import { Scrollbars } from "react-custom-scrollbars"

import ShowSchedule from "./showSchedule"

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
  const [tmpList, setTmpList] = useState([])

  /** CSSを用いたスタイル定義 */
  const classes = styles()

  /**
   * メインで表示する時間割を切り替える
   */

  useEffect(() => {
    let tmp = []
    for (let i = 0; i < 10; i++) {
      let tmp2 = {}
      tmp2.docId = "test"
      tmp2.title = "2020年度春学期"
      tmp.push(tmp2)
    }
    setTmpList(tmp)
    setFocusSchedule(tmp[0])
  }, [props])

  return (
    <Grid container row alignItems="center" justify="center">
      <Grid item xs={5} className={classes.MainSchedule}>
        <ShowSchedule schedule={focusSchedule} />
      </Grid>
      <Grid container item direction="column" xs={3}>
        <Grid item>
          <h2 className={classes.OtherScheduleTitle}>他の時間割</h2>
        </Grid>
        <Grid item direction="column" alignItems="center" justify="center" className={classes.OtherScheduleContent}>
          <Scrollbars className={classes.OtherScheduleContent}>
            {tmpList.map(item => (
              <Paper elevation={3} className={classes.OtherScheduleList}>
                <p className={classes.OtherScheduleListText}>{item.title}</p>
              </Paper>
            ))}
          </Scrollbars>
        </Grid>
      </Grid>
    </Grid>
  )
}