import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getRouterConfig } from './router.jsx';
import 'virtual:uno.css';
import '@unocss/reset/tailwind.css';

const routerConfig = getRouterConfig();
const router = createBrowserRouter(routerConfig);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);

const App = (
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

root.render(App);
