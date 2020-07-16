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
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
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
  Content: {
    "margin-bottom": "20px",
  },
  SubmitButton: {
    color: "#FFFFFF",
    background: "#EDC124",
  },
})


/**
 * 新しく授業を登録するダイアログを表示する関数
 * @param {Object} props - ユーザーの情報や授業を追加する際に必要な情報・時間割を更新するイベントを管理
 * @param {string} props.user - Google認証した際に得られるuseridを保持している
 * @param {function} props.handleSubmit - 呼び出すと授業listを取得し直す
 * @param {Object} props.lesson - 授業を追加する際に必要な情報の集合体
 * @param {list} props.lesson.ColorData - 授業を追加する際に登録する色データのList
 * @param {list} props.lesson.DateData - 授業を追加する際に登録する日時のList
 */
export default function LessonDialog(props) {

  /** ダイアログが開かれているかどうかの状態 */
  const [open, setOpen] = useState(false)

  /** 選ばれた色を管理 */
  const [color, setColor] = useState("")

  /** react hook formで用意された変数群 */
  const { register, handleSubmit, control, errors } = useForm()

  let ColorData = []
  let tmp = {}
  tmp.id = 1
  tmp.ColorName = "red"
  ColorData.push(tmp)
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
   * ダイアログを表示している時に色選択部分で状態が変化発火する
   * 選択された色を状態に登録する
   */
  function  handleChange(event) {
    setColor(event.target.value)
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
      console.log(color)
      handleClose()
    }
  }

  return (
    <div>
      <Button variant="contained" onClick={handleOpen} className={classes.button}>追加</Button>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={"xs"}
        onClose={handleClose}
        aria-labelledby="common-dialog-title"
        aria-describedby="common-dialog-description"
      >
        <DialogTitle>授業を追加する</DialogTitle>
        <form onSubmit={handleSubmit(Submit)}>
          <DialogContent>
            <Grid direction="column">
              <Grid className={classes.Content}>
                <TextField name="title" label="授業名" defaultValue="数学Ⅲ" inputRef={register} />
              </Grid>
              <Grid className={classes.Content}>
                <TextField name="classroom" label="教室名" defaultValue="C301" inputRef={register} />
              </Grid>
              <Grid className={classes.Content}>
                <FormControl>
                  <InputLabel id="color-label">色</InputLabel>
                  <Select
                    labelId="color-label"
                    name="color"
                    value={color}
                    onChange={handleChange}
                  >
                    {
                      ColorData.map(item => (
                        <MenuItem value={item.id}>
                          {item.ColorName}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
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