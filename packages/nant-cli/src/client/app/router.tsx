import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React, { LazyExoticComponent, lazy } from 'react';

import theme from '@theme/index';

// console.log(theme, 'theme');

import siteData from '@siteData';
import Layout from '../theme-default/Layout';

const LazyImportComponent = (props: { lazyChildren: any }) => {
  return (
    <React.Suspense fallback={<div>...</div>}>
      <props.lazyChildren />
    </React.Suspense>
  );
};

console.log(siteData);

export const getRouterConfig = () => {
  const { pages } = siteData;
  const router = [
    {
      path: '/',
      element: <Layout />,
      children: pages.map((page: any) => ({
        path: page.path,
        element: <LazyImportComponent lazyChildren={React.lazy(() => import(page.filePath))} />,
      })),
    },
  ];

  return router;
};
