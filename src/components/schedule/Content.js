import React, { useState, useEffect } from "react"

import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"

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
      <Grid item xs={3} className={classes.OtherScedules}>
        <p>他の時間割達</p>
      </Grid>
    </Grid>
  )
}