import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import theme from '@theme';

import Layout from './Layout';
import { initData } from './data';

const title = initData();

const newLocal = '/Users/wangbaoqi/personal/xnate-design/nant/packages/nant-test/docs/api-demo.md';
import(newLocal).then((res) => {
  console.log(res.default, 'newLocal');
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/docs',
        children: [
          {
            path: '/docs/1',
            element: <div>Hello docs one!</div>,
            // async lazy() {
            //   // Multiple routes in lazy file
            //   let MDXContent = await import(newLocal);
            //   console.log(MDXContent.default, 'MDXContent');

            //   return '';
            // },
            // element: <div>Hello docs one!</div>,
          },
          {
            path: '/docs/2',
            element: <div>Hello docs two!</div>,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <div>nant ui j</div>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
