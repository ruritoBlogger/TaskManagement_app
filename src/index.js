import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/Header.js';
import Footer from './components/Footer.js';

import { makeStyles } from '@material-ui/styles';

const styles = makeStyles({
  top: {
    backgroundColor: '#33DFEA',
  },
  bottom: {
    backgroundColor: '#FFFFFF',
  }
});

export default function App() {
  const classes = styles();
  return (
    <div>
      <div className={classes.top}>
        <Header />
      </div>
      <div className={classes.bottom}>
        <Footer />
      </div>
    </div>
  );
}

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);