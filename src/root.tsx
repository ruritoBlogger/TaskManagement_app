import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Undefined from "./undefined";
import Introduction from "./components/introduction/index";
import Main from "./components/main/index";
import Schedule from "./components/schedule/index";
import Todo from "./components/todo/index";

interface IRootProps {
  user: string | null;
  setUser: () => void;
}

/**
 * urlによって表示する部分を切り替える部分を担当している
 * @param {Object} props - userの状態が格納されている
 * @param {string} props.user - Google認証後にはuseridが、そうでない場合はnull
 * @param {Object} props.setUser - userを更新する際に用いる
 */

export const Root: React.FC<IRootProps> = props => {
  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <Introduction user={props.user} setUser={props.setUser} />
          )}
        />
        <Route exact path="/main/" render={() => <Main user={props.user} />} />
        <Route
          exact
          path="/schedule"
          render={() => <Schedule user={props.user} />}
        />
        <Route exact path="/todo" render={() => <Todo user={props.user} />} />
        <Route component={Undefined} />
      </Switch>
    </Router>
  );
}
