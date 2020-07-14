import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Root from './root';

export default function God() {
  const [user, setUser] = useState(null);
  return (
  <div>
    <Root
      user={user}
      setUser={setUser} />
  </div>
  );
}

const app = document.getElementById('app');
ReactDOM.render(
  <God />,
app);