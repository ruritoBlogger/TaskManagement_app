import * as React from "react";
import * as ReactDOM from "react-dom";

import { Root } from "./root";

interface UserProps {
  user: string;
  setUser: (active: string) => void;
}

/**
 * 所謂神クラス
 * ユーザーの情報を全ての関数からアクセス出来るようにするために用意した
 */
export const App: React.FC = () => {
  /** userの状態を管理 */
  const [user, setUser] = React.useState("");
  return (
    <div>
      <Root user={user} setUser={setUser} />
    </div>
  );
};

const app = document.getElementById("app");
ReactDOM.render(<App />, app);
