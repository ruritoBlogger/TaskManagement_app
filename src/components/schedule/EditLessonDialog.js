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
    "width": "119px",
    "height": "50px",
    "margin" : "0px",
    "background": "#FFFFFF",
  },
  ButtonText: {
    "margin": "0px",
    "text-align": "center",
    "overflow": "hidden",
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
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
 * 授業情報を編集・todoを表示するダイアログを表示する関数
 * @param {Object} props - 時間割や授業情報や時間割を更新するイベントを管理
 * @param {string} props.schedule_docId - 編集したい授業が登録されている時間割のdocId
 * @param {Object} props.lesson - 編集したい授業
 * @param {string} props.lesson.docId - 編集したい授業のdocId
 * @param {int} props.lesson.date - クリックされた授業がどの時間帯か
 * @param {function} props.handleSubmit - 呼び出すと授業listを取得し直す
 */
export default function EditLessonDialog(props) {

  /** ダイアログが開かれているかどうかの状態 */
  const [open, setOpen] = useState(false)

  /** firestoreから持ってきた色データを管理する */
  const [colors, setColors] = useState([])

  /** 選ばれた色を管理 */
  const [color, setColor] = useState("")

  /** react hook formで用意された変数群 */
  const { register, handleSubmit, control, errors } = useForm()

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
  function  handleChange(event) {
    setColor(event.target.value)
  }

  /**
   * ダイアログを表示している時に更新ボタンがクリックされた時に発火する
   * 入力された情報を元に授業を更新してダイアログを閉じる
   *
   * @param {Object} value - 入力された情報を保持している
   * @param {string} value.title - 時間割のタイトル
   */
  function Update(value) {
    if (value.title) {
      db.collection("schedule").doc(props.schedule_docId).collection("lesson").doc(props.lesson.docId).update({
        title: value.title,
        classroom: value.classroom,
        color: color,
      })
      props.handleSubmit()
      handleClose()
    }
  }

  return (
    <div>
      <Button variant="contained" onClick={handleOpen} className={classes.button}>
        <p className={classes.ButtonText}>{props.lesson.title}</p>
        <p className={classes.ButtonText}>{props.lesson.classroom}</p>
      </Button>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={"xs"}
        onClose={handleClose}
        aria-labelledby="common-dialog-title"
        aria-describedby="common-dialog-description"
      >
        <DialogTitle>{props.lesson.title}を編集する</DialogTitle>
        <form onSubmit={handleSubmit(Update)}>
          <DialogContent>
            <Grid direction="column">
              <Grid className={classes.Content}>
                <TextField name="title" label="授業名" defaultValue={props.lesson.title} inputRef={register} />
              </Grid>
              <Grid className={classes.Content}>
                <TextField name="classroom" label="教室名" defaultValue={props.lesson.classroom} inputRef={register} />
              </Grid>
              <Grid className={classes.Content}>
                <FormControl>
                  <InputLabel id="color-label">色</InputLabel>
                  <Select
                    labelId="color-label"
                    value={color}
                    onChange={handleChange}
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
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>中止</Button>
            <Button onClick={Update} type="submit" className={classes.SubmitButton}>更新</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}
