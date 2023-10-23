import { Link, Outlet, useLocation } from 'react-router-dom';

import mobileRoute from '@mobileRoute';

const MobileHome = () => {
  return (
    <div>
      {mobileRoute.map((nav: any, idx: number) => (
        <Link to={nav.path} key={idx}>
          {nav.path}
        </Link>
      ))}
    </div>
  );
};

const MobileHeader = () => {
  return <header></header>;
};

export default function MobileLayout() {
  const { pathname } = useLocation();

  const isHome = pathname === '/';

  let content = null;

  if (isHome) {
    content = <MobileHome />;
  } else {
    content = (
      <>
        <Outlet />
      </>
    );
  }

  return (
    <div className="p-4">
      <header></header>
      {content}
    </div>
  );
}
