import clsx from 'clsx';

import { DefaultTheme } from 'nant/theme';

import { TableContent, Mobile, PrevNext } from '../Layout';
import { useLocation } from 'react-router-dom';
export interface WrapperMdxProps {
  children?: React.ReactElement;
  toc?: DefaultTheme.Toc;
}

const WrapperMdx = (props: WrapperMdxProps) => {
  const { children = '', toc = [] } = props;
  const { pathname } = useLocation();

  const isComponent = pathname.indexOf('components') !== -1;

  const boxClass = clsx('m-auto w-full', 'xl:(flex justify-center)');

  const articleClass = clsx(
    'nant-mdx break-words font-normal text-primary dark:text-primary-dark pl-6 text-[15px]',
    isComponent ? '' : '',
  );

  const asideClass = clsx(
    'relative hidden order-2 flex-grow w-full ',
    'xl:block',
    isComponent ? 'max-w-[24rem] w-xs pl-13' : 'pl-4 max-w-64',
  );

  const asideContainerClass = clsx(
    'fixed top-0 pt-24 h-full overflow-x-hidden',
    isComponent ? 'w-xs overflow-hidden' : 'w-56 overflow-y-auto',
  );

  const asideContentClass = clsx('flex flex-col', isComponent ? 'w-full h-[620px]' : 'height-side-content pb-8');

  const contentClass = clsx('relative m-auto w-full', 'xl:(order-1 m-0 ) lg:( pb-32)');

  return (
    <div className={boxClass}>
      <section className={contentClass}>
        <div className="max-w-[800px] ">
          <article className={articleClass}>{children}</article>
        </div>
        <div className="my-4">
          <PrevNext />
        </div>
      </section>
      <aside className={asideClass}>
        <div className={asideContainerClass}>
          <div className={asideContentClass}>{isComponent ? <Mobile /> : <TableContent toc={toc} />}</div>
        </div>
      </aside>
    </div>
  );
};

export default WrapperMdx;
