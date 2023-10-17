import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useEffect } from 'react';

export const Mobile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useEffect');
  }, []);

  const componentName = 'button';

  const mobileContainer = clsx('bg-alt dark:bg-alt-dark flex flex-col overflow-hidden rounded-3xl p-3 h-[625px] w-80');

  const iframeClsx = clsx(
    'rounded-0 overflow-hidden rounded-3xl flex-1 bg-wash dark:bg-wash-dark text-primary dark:text-primary-dark',
  );

  return (
    <div className={mobileContainer}>
      <div className=""></div>
      <iframe className={iframeClsx} src={`/mobile.html#${componentName}`}></iframe>
    </div>
  );
};
