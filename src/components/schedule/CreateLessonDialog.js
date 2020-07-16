import React, { useState, useEffect } from "react"
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
 * @param {Object} props - 時間割や時間割を更新するイベントを管理
 * @param {Object} props.schedule - 授業を追加したい時間割
 * @param {function} props.handleSubmit - 呼び出すと授業listを取得し直す
 */
export default function CreateLessonDialog(props) {

  /** ダイアログが開かれているかどうかの状態 */
  const [open, setOpen] = useState(false)

  /** firestoreから持ってきた色データを管理する */
  const [colors, setColors] = useState([])

  /** 選ばれた色を管理 */
  const [color, setColor] = useState("")
  /** 選ばれた時間を管理 */
  const [date, setDate] = useState("")

  /** react hook formで用意された変数群 */
  const { register, handleSubmit, control, errors } = useForm()

  let Date = []
  let tmp2 = {}
  tmp2.id = 1
  tmp2.name = "月曜3限目"
  Date.push(tmp2)
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
  }, [open])

  /**
   * firestoreに存在している色データを取得している
   * ダイアログが開いた時に取得するようにしている
   */
  async function getData() {
    const colRef = db.collection("color")
    const snapshots = await colRef.get()
    const docs = snapshots.docs.map(doc => doc.data())
    setColors(docs)
  }


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
  function  handleColorChange(event) {
    setColor(event.target.value)
  }

  /**
   * ダイアログを表示している時に時間帯選択部分で状態が変化発火する
   * 選択された時間を状態に登録する
   */
  function  handleDateChange(event) {
    setDate(event.target.value)
  }

  /**
   * ダイアログを表示している時に登録ボタンがクリックされた時に発火する
   * 入力された情報を元に授業を追加してダイアログを閉じる
   *
   * @param {Object} value - 入力された情報を保持している
   * @param {string} value.title - 時間割のタイトル
   */
  function Submit(value) {
    if (value.title && props.schedule) {
      const docId = db.collection("schedule").doc(props.schedule.docId).collection("lesson").doc().id
      db.collection("schedule").doc(props.schedule.docId).collection("lesson").doc(docId).set({
        docId: docId,
        title: value.title,
        classroom: value.classroom,
        color: color,
        date: date,
      })
      props.handleSubmit()
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
                    value={color}
                    onChange={handleColorChange}
                  >
                    {
                      colors.map(item => (
                        <MenuItem value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid className={classes.Content}>
                <FormControl>
                  <InputLabel id="date-label">時間帯</InputLabel>
                  <Select
                    labelId="date-label"
                    value={date}
                    onChange={handleDateChange}
                  >
                    {
                      Date.map(item => (
                        <MenuItem value={item.id}>
                          {item.name}
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
