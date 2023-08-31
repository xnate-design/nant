import { createBrowserRouter, RouterProvider, useLoaderData } from 'react-router-dom';
import React, { LazyExoticComponent, lazy } from 'react';

import { MDXComponents } from './components/MDX/MDXComponents';
import { MdxContainer } from './components/Layout';
import siteData from '@siteData';
import Layout from './Layout';
import { Toc } from '@nant/vite-plugins';

const LazyImportComponent = (props: { lazyChildren: any }) => {
  const toc = useLoaderData() as Toc;

  console.log(toc, 'lazyChildren');

  return (
    <React.Suspense fallback={null}>
      {/* {props.lazyChildren({ components: MDXComponents })} */}
      <props.lazyChildren components={MDXComponents} />
    </React.Suspense>
  );
};

export const getRouterConfig = () => {
  const { pages } = siteData;
  const router = [
    {
      path: '/',
      element: <Layout />,
      children: pages.map((page: any) => ({
        path: page.path,
        async loader() {
          const { tableOfContents } = await import(`/* @vite-ignore */${page.filePath}`);
          console.log(tableOfContents, 'tableOfContents');
          return {
            toc: tableOfContents,
          };
        },
        element: <MdxContainer lazyChildren={React.lazy(() => import(`/* @vite-ignore */${page.filePath}`))} />,
      })),
    },
  ];
  return router;
};
