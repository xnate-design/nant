import React from 'react';
import ReactDOM from 'react-dom/client';

import theme from '@theme';

console.log(theme, 'theme');

import { initData } from './data';

function App() {
  const title = initData();

  return <div>nant ui j</div>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
