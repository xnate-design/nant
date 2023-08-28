import React, { useContext, useEffect } from 'react';
import { useParams, useLocation, Outlet, useNavigate } from 'react-router-dom';
import SiteContext from './SiteContext';
import { TopNav } from './components/Layout';
import Home from './Home';

interface ILayout {
  children?: React.ReactElement;
}

const Layout = (props: ILayout) => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const config = useContext(SiteContext);

  const isHome = pathname === '/';

  console.log(config, 'config');

  console.log(pathname, 'pathname');

  let content = null;

  if (pathname === '/') {
    content = <Home />;
  } else {
    content = (
      <>
        <div>
          <Outlet />
        </div>
      </>
    );
  }

  return (
    <div className="">
      <TopNav />
      layout nant ui
      <main>{content}</main>
    </div>
  );
};

export default Layout;
