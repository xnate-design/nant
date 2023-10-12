import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getRouterConfig } from './router.jsx';

import './styles/index.css';
import 'uno.css';
import '@unocss/reset/tailwind.css';
import '@docsearch/css';
import Layout from './Layout';
import { MdxContainer } from './components/Layout/MdxContainer.jsx';

const routerConfig = getRouterConfig();

console.log(routerConfig, 'routerConfig');

const router = createBrowserRouter(routerConfig);

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     children: [
//       // {
//       //   index: true,
//       //   element: <Home />
//       // },
//       {
//         path: 'docs/intro',
//         // element: <div>about</div>,
//         element: <MdxContainer lazyChildren={React.lazy(() => import(`/* @vite-ignore */ ${'../docs/intro.md'}`))} />,

//         // Single route in lazy file
//       },

//       {
//         path: '*',
//         element: <div>no data</div>,
//       },
//     ],
//   },
// ]);
console.log(router, 'router');

export default function App() {
  return <RouterProvider router={router} />;
}
