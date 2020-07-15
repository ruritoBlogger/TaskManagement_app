import React, { useState, useEffect } from "react"

import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"

/**
 * 時間割一覧ページの内容を表示する関数
 * @param {Object} props - 時間割listが格納されている
 * @param {list} props.scheduleList - 時間割list
 */
export default function Content(props) {

  return (
    <Grid container alignItems="center" justify="center">
      <p>ここはContent</p>
    </Grid>
  )
}