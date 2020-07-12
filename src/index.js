import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/Header.js';
import Footer from './components/Footer.js';

import { makeStyles } from '@material-ui/styles';

const styles = makeStyles({
  app: {
    backgroundColor: '#33DFEA',
  },
});

export default function App() {
  const classes = styles();
  return (
    <div className={classes.app}>
      <Header />
      <h2 className={classes.app}> Hellow World!</h2>
      <Footer />
    </div>
  );
}

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);