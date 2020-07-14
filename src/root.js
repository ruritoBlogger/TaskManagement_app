import React from 'react';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Undefined from './undefined';
import Introduction from './components/introduction/index';
import Main from './components/main/index';
import Schedule from './components/schedule/index';

export default function Root(props) {
  return (
    <Router>
      <Switch>
        <Route exact path="/" render={ () => <Introduction user={props.user} setUser={props.setUser} />} />
        <Route exact path="/main/" component={Main} />
        <Route exact path="/schedule" render={ () => <Schedule user={props.user} setUser={props.setUser} />} />
        <Route component={Undefined} />
      </Switch>
    </Router>
  )
}