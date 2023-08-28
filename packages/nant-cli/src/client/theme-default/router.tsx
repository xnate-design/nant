import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React, { LazyExoticComponent, lazy } from 'react';

import { MDXComponents } from './components/MDX/MDXComponents';

import siteData from '@siteData';
import Layout from './Layout';

const LazyImportComponent = (props: { lazyChildren: any }) => {
  return (
    <React.Suspense fallback={null}>
      <props.lazyChildren components={MDXComponents} />
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
        element: <LazyImportComponent lazyChildren={React.lazy(() => import(`/* @vite-ignore */${page.filePath}`))} />,
      })),
    },
  ];
  return router;
};
