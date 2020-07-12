import React from 'react';

import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

const styles = makeStyles({
  container: {
    'max-width': '740px',
    color: '#484848',
  },
  bottomText: {
    'text-align': 'center',
    margin: '30px 0px',
    'font-weight': '300',
  }
});

export default function Footer() {
  const classes = styles();
  return (
    <Container className={classes.container}>
      <Grid container direction="column">
        <Grid item>
          <h2 className={classes.bottomText}>
            大学の課題を消化することによる<br />
            メリットを提供します
          </h2>
        </Grid>
      </Grid>
    </Container>
  )
}