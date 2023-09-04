import React from 'react';
import { MdxContainer } from './components/Layout';
import siteData from '@siteData';
import Layout from './Layout';

export const getRouterConfig = () => {
  const { pages } = siteData;
  const router = [
    {
      path: '/',
      element: <Layout />,
      children: pages.map((page: any) => ({
        path: page.path,
        element: <MdxContainer lazyChildren={React.lazy(() => import(`/* @vite-ignore */${page.filePath}`))} />,
      })),
    },
  ];
  return router;
};
