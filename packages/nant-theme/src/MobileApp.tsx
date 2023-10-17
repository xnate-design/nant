import React, { lazy } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import mobileRoute from '@mobileRoute';
import MobileContainer from './mobile/MobileContainer';
import MobileLayout from './mobile/MobileLayout';

import './styles/index.css';
import 'uno.css';
import '@unocss/reset/tailwind.css';
import '@docsearch/css';

const mobileRoutes = mobileRoute.map((route: any) => ({
  path: route.path,
  element: <MobileContainer lazyChildren={lazy(route.component)} />,
}));

const routerConfig = [
  {
    path: '/',
    element: <MobileLayout />,
    children: mobileRoutes,
  },
];

const router = createHashRouter(routerConfig);

export default function App() {
  return <RouterProvider router={router} />;
}
