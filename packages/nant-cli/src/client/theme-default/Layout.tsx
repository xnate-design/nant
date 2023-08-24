import React, { useEffect } from 'react';
import { useParams, useLocation, Outlet, useNavigate } from 'react-router-dom';

import Home from './Home';

interface ILayout {
  children?: React.ReactElement;
}

const Layout = (props: ILayout) => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  console.log(pathname, 'pathname');

  let content = null;

  if (pathname === '/') {
    content = <Home />;
  } else {
    content = (
      <>
        <div></div>
      </>
    );
  }

  return (
    <>
      <div className="">
        layout nant ui
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
