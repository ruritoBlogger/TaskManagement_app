import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import firebase, { db } from "../../firebase";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useRadioGroup } from "@material-ui/core";

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
  button: {
    padding: "7px 40px",
    margin: "30px",
    color: "#FFFFFF",
    background: "#EDC124",
    "text-align": "center",
    "font-size": "15px",
  },
  SubmitButton: {
    color: "#FFFFFF",
    background: "#EDC124",
  },
});

interface IScheduleDialogProps {
  user: string;
  handleSubmit: () => void;
}

/**
 * 新しく時間割を登録するダイアログを表示する関数
 * @param {Object} props - ユーザーの情報や時間割を更新するイベントを管理
 * @param {string} props.user - Google認証した際に得られるuseridを保持している
 * @param {function} props.handleSubmit - 呼び出すと時間割listを取得し直す
 */
export const ScheduleDialog: React.FC<IScheduleDialogProps> = (props) => {
  /** ダイアログが開かれているかどうかの状態 */
  const [open, setOpen] = useState(false);
  /** react hook formで用意された変数群 */
  const { register, handleSubmit, control, errors } = useForm();

  /** CSSを用いたスタイル定義 */
  const classes = styles();
  /**
   * ダイアログを表示するかどうかを管理するボタンがクリックされた時に発火する
   * ダイアログを表示する
   */
  function handleOpen(): void {
    setOpen(true);
  }

  /**
   * ダイアログを表示している時に中止ボタンがクリックされた時に発火する
   * ダイアログを閉じる
   */
  function handleClose(): void {
    setOpen(false);
  }

  interface ISubmitProps {
    title: string;
  }
  /**
   * ダイアログを表示している時に登録ボタンがクリックされた時に発火する
   * 入力された情報を元に時間割を追加してダイアログを閉じる
   *
   * @param {Object} value - 入力された情報を保持している
   * @param {string} value.title - 時間割のタイトル
   */
  function Submit(value: ISubmitProps): void {
    if (value.title && props.user) {
      const docId = db.collection("schedule").doc().id;
      db.collection("schedule").doc(docId).set({
        docId: docId,
        uid: props.user,
        title: value.title,
        is_default: false,
      });
      props.handleSubmit();
      handleClose();
    } else if (value.title) {
      console.log("ユーザーデータが未定義です");
      console.log("再ログインしてください");
      handleClose();
    }
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpen}
        className={classes.button}
      >
        追加
      </Button>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={"xs"}
        onClose={handleClose}
        aria-labelledby="common-dialog-title"
        aria-describedby="common-dialog-description"
      >
        <DialogTitle>時間割を追加する</DialogTitle>
        <form onSubmit={handleSubmit(Submit)}>
          <DialogContent>
            <TextField
              name="title"
              label="時間割名"
              defaultValue="2020年春学期"
              inputRef={register}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>中止</Button>
            <Button
              onClick={Submit}
              className={classes.SubmitButton}
              type="submit"
            >
              登録
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
