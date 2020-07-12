import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/Header.js';
import Footer from './components/Footer.js';

import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

const styles = makeStyles({
  top: {
    backgroundColor: '#33DFEA',
    margin: '0px',
    border: 'opx',
  },
  container: {
    'max-width': '740px',
    color: '#FFFFFF',
  },
  topText: {
    'text-align': 'center',
    margin: '5px 0px',
    'font-weight': '300',
  },
  bottom: {
    backgroundColor: '#FFFFFF',
  }
});

export default function App() {
  const classes = styles();
  return (
    <Box>
      <Box className={classes.top}>
        <Header />
        <Container className={classes.container}>
          <h1 className={classes.topText}>
            大学の課題と<br />
            楽しく付き合おう<br />
            そんな手助けをするアプリ
          </h1>
        </Container>
      </Box>
      <Box className={classes.bottom}>
        <Footer />
      </Box>
    </Box>
  );
}

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);