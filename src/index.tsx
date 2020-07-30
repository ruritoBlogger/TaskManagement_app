import React, { useState } from "react"
import ReactDOM from "react-dom"

import Root from "./root"

/**
 * 所謂神クラス
 * ユーザーの情報を全ての関数からアクセス出来るようにするために用意した
 */
export const App: React.FC = () => {
  /** userの状態を管理 */
  const [user, setUser] = useState(null)
  return (
    <div>
      <Root
        user={user}
        setUser={setUser} />
    </div>
  )
}

const app = document.getElementById("app")
ReactDOM.render(
  <App />,
  app)