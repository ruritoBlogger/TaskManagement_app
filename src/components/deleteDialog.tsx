import React, { useState } from "react";

import firebase from "../firebase";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

interface IDeleteDialogProps {
  Button: string;
  msg: string;
  handleSubmit: () => void;
  isIcon: boolean;
}

/**
 * 何かを削除するダイアログを表示する関数
 * @param {Object} props - UI部分に関係する情報や削除後に発火させたいイベントを管理している
 * @param {string} props.Button - ダイアログを表示するかどうかを管理するボタンのtext
 * @param {string} props.msg - 削除する時間割の名前
 * @param {function} props.handleSubmit - 削除した後に発火させたいイベント
 * @param {boolean} props.isIcon - ボタンをIconを用いて表示するかどうか
 */
export const DeleteDialog: React.FC<IDeleteDialogProps> = (props) => {
  /** ダイアログが開かれているかどうかの状態 */
  const [open, setOpen] = useState(false);

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

  /**
   * ダイアログを表示している時に削除ボタンがクリックされた時に発火する
   * 該当のものを削除してダイアログを閉じる
   */
  function Submit(): void {
    props.handleSubmit();
    handleClose();
  }

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        {props.Button}
      </Button>
      <Dialog
        open={open}
        fullWidth={true}
        onClose={handleClose}
        maxWidth={"sm"}
        aria-labelledby="common-dialog-title"
        aria-describedby="common-dialog-description"
      >
        <DialogTitle>{props.msg}を削除する</DialogTitle>
        <DialogContent>
          <h4>本当に削除しますか？</h4>
          <DialogContentText>
            (この内容は取り消すことが出来ません)
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>中止</Button>
          <Button onClick={Submit}>削除</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
