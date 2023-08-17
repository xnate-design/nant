import React, { useEffect } from 'react';
import { useParams, useLocation, Outlet, useNavigate } from 'react-router-dom';

interface ILayout {
  children?: React.ReactElement;
}

const Layout = (props: ILayout) => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="xnate-site">
      <>
        <div className="xnate-site-container">
          <Outlet />
        </div>
      </>
    </div>
  );
};

export default Layout;
