import React from 'react';
import { MdxContainer } from './components/Layout';
import siteData from '@siteData';
import Layout from './Layout';
import ErrorPage from './Error';

import pcRoutes from '@pcRoute';

export const getRouterConfig = () => {
  console.log(pcRoutes, 'pcRoutes');

  const router = [
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: pcRoutes.map((page: any) => ({
        path: page.path,
        element: <MdxContainer lazyChildren={React.lazy(page.component)} />,
      })),
    },
  ];
  return router;
};
