import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"

import firebase, { db } from "../../firebase"

import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import { useRadioGroup } from "@material-ui/core"

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
  button: {
    "padding" : "7px 40px",
    "margin" : "30px",
    color: "#FFFFFF",
    background: "#EDC124",
    "text-align": "center",
    "font-size": "15px"
  },
  SubmitButton: {
    color: "#FFFFFF",
    background: "#EDC124",
  },
})


/**
 * 新しく授業を登録するダイアログを表示する関数
 * @param {Object} props - ユーザーの情報や時間割を更新するイベントを管理
 * @param {string} props.user - Google認証した際に得られるuseridを保持している
 * @param {function} props.handleSubmit - 呼び出すと授業listを取得し直す
 */
export default function LessonDialog(props) {

  /** ダイアログが開かれているかどうかの状態 */
  const [open, setOpen] = useState(false)
  /** react hook formで用意された変数群 */
  const { register, handleSubmit, control, errors } = useForm()

  /** CSSを用いたスタイル定義 */
  const classes = styles()
  /**
   * ダイアログを表示するかどうかを管理するボタンがクリックされた時に発火する
   * ダイアログを表示する
   */
  function handleOpen() {
    setOpen(true)
  }

  /**
   * ダイアログを表示している時に中止ボタンがクリックされた時に発火する
   * ダイアログを閉じる
   */
  function handleClose() {
    setOpen(false)
  }

  /**
   * ダイアログを表示している時に登録ボタンがクリックされた時に発火する
   * 入力された情報を元に授業を追加してダイアログを閉じる
   *
   * @param {Object} value - 入力された情報を保持している
   * @param {string} value.title - 時間割のタイトル
   */
  function Submit(value) {
    if (value.title && props.user) {
      const docId = db.collection("lesson").doc().id
      db.collection("lesson").doc(docId).set({
        docId: docId,
        uid: props.user,
        title: value.title,
        is_default: false,
      })
      props.handleSubmit()
      handleClose()
    } else if (value.title) {
      console.log("ユーザーデータが未定義です")
      console.log("再ログインしてください")
      handleClose()
    }
  }

  return (
    <div>
      <Button variant="contained" onClick={handleOpen} className={classes.button}>追加</Button>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
        onClose={handleClose}
        aria-labelledby="common-dialog-title"
        aria-describedby="common-dialog-description"
      >
        <DialogTitle>授業を追加する</DialogTitle>
        <form onSubmit={handleSubmit(Submit)}>
          <DialogContent>
            <Grid>
              <TextField name="title" defaultValue="数学Ⅲ" inputRef={register} />
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>中止</Button>
            <Button onClick={Submit} type="submit" className={classes.SubmitButton}>登録</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}