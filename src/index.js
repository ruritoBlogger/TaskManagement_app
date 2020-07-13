import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Introduction from './components/introduction/index';
import Main from './components/main/index';

export default function Undefined() {
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
      <Route exact path="/main/" component={Main}></Route>
      <Route component={Undefined}></Route>
    </Switch>
  </Router>,
app);