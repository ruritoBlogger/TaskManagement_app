import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Introduction from './components/introduction/index';

export default function App() {
  return (
    <div>
      <h1>未定義ページです</h1>
    </div>
  );
}

const app = document.getElementById('app');
ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={Introduction}></Route>
      <Route component={App}></Route>
    </Switch>
  </Router>,
app);