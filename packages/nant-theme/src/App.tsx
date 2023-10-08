import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getRouterConfig } from './router.jsx';

import './styles/index.css';
// import 'virtual:uno.css';
import '@unocss/reset/tailwind.css';
import 'uno.css';
import '@docsearch/css';

const routerConfig = getRouterConfig();

console.log(routerConfig, 'routerConfig');

const router = createBrowserRouter(routerConfig);

export default function App() {
  return <RouterProvider router={router} />;
}
