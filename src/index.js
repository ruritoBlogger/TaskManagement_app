import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/Header.js';
import Footer from './components/Footer.js';

import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';

const styles = makeStyles({
  top: {
    backgroundColor: '#33DFEA',
    margin: '0px',
    border: 'opx',
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
      </Box>
      <Box className={classes.bottom}>
        <Footer />
      </Box>
    </Box>
  );
}

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);