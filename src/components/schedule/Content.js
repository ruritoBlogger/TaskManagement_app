import React, { useState, useEffect } from "react"

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

   /*
  useEffect(() => {
    
  })
  */

  return (
    <Grid container row alignItems="center" justify="center">
      <Grid item xs={5} className={classes.MainSchedule}>
        <p>test</p>
        <table>
          <tbody>
            {
              props.scheduleList.map(item => (
                <tr>
                  <td>{item.docId}</td>
                  <td>{item.title}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </Grid>
      <Grid container item direction="column" xs={3}>
        <Grid item>
          <h2 className={classes.OtherScheduleTitle}>他の時間割</h2>
        </Grid>
        <Grid item direction="column" alignItems="center" justify="center" className={classes.OtherScheduleContent}>
          {props.scheduleList.map(item => (
            <Paper elevation={3}>
              <h3>{item.title}</h3>
            </Paper>
          ))}
          <p>中身</p>
        </Grid>
      </Grid>
    </Grid>
  )
}