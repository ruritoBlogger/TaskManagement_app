import React from "react"

import LessonDialog from "./LessonDialog"
import DeleteDialog from "../deleteDialog"
import firebase, { db } from "../../firebase"

import Grid from "@material-ui/core/Grid"

/**
 * 時間割の内容を表示する関数
 * @param {Object} props - 表示したい時間割などが格納されている
 * @param {list} props.schedule - 表示したい時間割
 */

export default function ShowSchedule(props) {

  /**
   * 呼び出されると授業listを更新する
   * 具体的には授業listを更新するかどうかを管理する状態を変更する
   */
  function handleChange() {
    //setNeedLoad(!needLoad)
  }

  return (
    <div>
      <LessonDialog user={props.user} handleSubmit={handleChange} />
    </div>
  )
}