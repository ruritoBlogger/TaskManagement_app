import React from 'react';
import { useHistory } from 'react-router-dom';

import firebase from '../firebase';

import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Icon from '@material-ui/core/Icon';

const styles = makeStyles({
  root: {
    'min-height': '75px',
    backgroundColor: '#33DFEA',
  },
  container: {
    'max-width': '1200px',
    color: '#FFFFFF',
  },
  headerText: {
    margin: '0px',
    'padding-bottom': '7px',
    'padding-left' : '10px',
    'text-align': 'left',
  },
  button: {
    'padding' : '15px 10px',
    'margin' : '0px 10px',
    color: '#FFFFFF',
  }
});

export default function Header() {
  const classes = styles();
  const history = useHistory();

  function Logout() {
    firebase.auth().signOut();
    history.push("/");
  }

  return (
    <Grid container alignItems="center" justify="center" className={classes.root}>
      <Container item xs={8} className={classes.container}>
        <Grid container direction="row">
          <Grid item xs={6}>
            <h1 className={classes.headerText}>Logo</h1>
          </Grid>
          <Grid item xs={2}>
            <Button className={classes.button}>Logoとは</Button>
          </Grid>
          <Grid item xs={2}>
            <Button className={classes.button}>出来ること</Button>
          </Grid>
          <Grid item xs={2}>
            <Button onClick={Logout} className={classes.button}><Icon>settings</Icon></Button>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
}