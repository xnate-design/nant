import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useEffect, useLayoutEffect, useMemo } from 'react';

export const Mobile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { pathname = '' } = location;
  const cleanedPath = pathname.split(/[?#]/)[0];

  const [, , componentName] = cleanedPath.split('/');

  const iframeSrc = useMemo(() => {
    return `/mobile.html#${componentName}`;
  }, [location.pathname]);

  useLayoutEffect(() => {
    console.log('useEffect');
    if (!iframeSrc) return;

    const iframe = document.querySelector<HTMLIFrameElement>(`#mobileIframe`);
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          type: 'replacePath',
          value: iframeSrc,
        },
        '*',
      );
    }
  }, [iframeSrc]);

  const initialPath = useMemo(() => `/mobile.html#${componentName}`, []);

  const mobileContainer = clsx('bg-alt dark:bg-alt-dark flex flex-col overflow-hidden rounded-3xl p-3 h-[625px] w-80');

  const iframeClsx = clsx('rounded-0 overflow-hidden rounded-3xl flex-1 text-primary dark:text-primary-dark');

  return (
    <div className={mobileContainer}>
      <div className=""></div>
      <iframe id="mobileIframe" className={iframeClsx} src={initialPath}></iframe>
    </div>
  );
};
