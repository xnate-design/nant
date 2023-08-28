import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getRouterConfig } from './router.jsx';
import 'virtual:uno.css';
import '@unocss/reset/tailwind.css';

const routerConfig = getRouterConfig();
const router = createBrowserRouter(routerConfig);

export default function App() {
  return <RouterProvider router={router} />;
}