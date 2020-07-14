import React, { useState } from 'react';

import firebase from '../firebase';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function DefaultDialog() {

  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function Exit() {
    handleClose();
  }

  function Submit() {
    handleClose();
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
        <DialogTitle>登録画面</DialogTitle>
        <DialogContent>
          <h1>ここは新規時間割登録画面</h1>
        </DialogContent>

        <DialogActions>
          <Button onClick={Exit}>中止</Button>
          <Button onClick={Submit}>登録</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}