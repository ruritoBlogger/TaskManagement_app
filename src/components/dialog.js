import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import firebase, { db } from '../firebase';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function DefaultDialog(props) {

  const [open, setOpen] = useState(false);
  const { register, handleSubmit, watch, errors } = useForm();

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function Exit() {
    handleClose();
  }

  function typeOf(obj) {
    var toString = Object.prototype.toString;
    return toString.call(obj).slice(8, -1).toLowerCase();
  }

  function Submit(values) {
    if (values.example) {
      console.log(values);
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
              <input name="example" defaultValue="2020年春学期" ref={register} />

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