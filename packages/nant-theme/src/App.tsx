import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { getRouterConfig } from './router.jsx';

import './styles/index.css';
import 'uno.css';
import '@unocss/reset/tailwind.css';
import '@docsearch/css';

const routerConfig = getRouterConfig();

const router = createHashRouter(routerConfig);

export default function App() {
  return <RouterProvider router={router} />;
}
