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
  },
  box: {
    margin: '0px 0px 0px 0px',
  },
  pictureBox: {
    display: 'block',
    margin: 'auto',
  },
  twitterPicture: {
    display: 'block',
    margin: 'auto',
    'text-align': 'center',
    width: '75%',
    height: 'auto',
  },
  googlePicture: {
    display: 'block',
    margin: 'auto',
    'text-align': 'center',
    width: '60%',
    height: 'auto',
    padding: '27px',
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
        <Grid container direction="row">
          <Grid item xs={6} direction="column" className={classes.box}>
            <Grid item className={classes.pictureBox}>
              <img className={classes.twitterPicture} src={`${window.location.origin}/pictures/Twitter_Logo_Blue.png`} />
            </Grid>
            <p>Tiwtter</p>
          </Grid>
          <Grid item xs={6} direction="column" className={classes.box}>
            <Grid item className={classes.pictureBox}>
              <img className={classes.googlePicture} src={`${window.location.origin}/pictures/calender.png`} />
            </Grid>
            <p>Google</p>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}