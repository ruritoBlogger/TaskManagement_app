import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import firebase, { db } from '../../firebase';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useRadioGroup } from '@material-ui/core';

export default function DefaultDialog(props) {

  const [open, setOpen] = useState(false);
  const { register, handleSubmit, control, errors } = useForm();

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function Exit() {
    handleClose();
  }

  function Submit(value) {
    if (value.title && props.user) {
      const docId = db.collection("schedule").doc().id;
      db.collection("schedule").doc(docId).set({
        docId: docId,
        uid: props.user,
        title: value.title,
        is_default: false,
      });
      handleClose();
    } else if (value.title) {
      console.log("ユーザーデータが未定義です");
      console.log("再ログインしてください");
      handleClose();
    }
  }

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>ダイアログ</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="common-dialog-title"
        aria-describedby="common-dialog-description"
      >
        <DialogTitle>時間割を追加する</DialogTitle>
        <form onSubmit={handleSubmit(Submit)}>
          <DialogContent>
            <TextField name="title" defaultValue="2020年春学期" inputRef={register} />
          </DialogContent>

          <DialogActions>
            <Button onClick={Exit}>中止</Button>
            <Button onClick={Submit} type="submit">登録</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}