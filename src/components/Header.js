import React from 'react';

import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

const styles = makeStyles({
  container: {
    'max-width': '740px',
    color: '#FFFFFF',
  },
  headerText: {
    margin: '0px',
    'padding-bottom': '7px',
    'padding-left' : '10px',
    'text-align': 'left',
  },
  button: {
    'padding' : '15px 0px',
    color: '#FFFFFF',
    display: 'block',
    'margin': 'auto',
  }
});

export default function Header() {
  const classes = styles();
  return (
    <Container className={classes.container}>
      <Grid container direction="row">
        <Grid item xs={6}>
          <h1 className={classes.headerText}>Logo</h1>
        </Grid>
        <Grid item xs={3}>
          <Button className={classes.button}>Logoについて</Button>
        </Grid>
      </Grid>
    </Container>
  )
}