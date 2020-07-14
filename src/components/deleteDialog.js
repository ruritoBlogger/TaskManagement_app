import React, { useState } from 'react';

import firebase from '../firebase';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function DeleteDialog(props) {

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
      <Button variant="contained" onClick={handleOpen}>{props.Button}</Button>
      <Dialog
        open={open}
        fullWidth={true}
        onClose={handleClose}
        maxWidth={'sm'}
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
          <Button onClick={Exit}>中止</Button>
          <Button onClick={Submit}>削除</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}