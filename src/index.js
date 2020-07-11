import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/Header.js';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <h2> Hellow World!</h2>
      </div>
    );
  }
}

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);