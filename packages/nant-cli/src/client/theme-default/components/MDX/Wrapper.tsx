import clsx from 'clsx';
import { Toc } from '@nant/vite-plugins';
import { TableContent } from '../Layout';
export interface WrapperMdxProps {
  children?: React.ReactElement;
  toc?: Toc;
}

const WrapperMdx = (props: WrapperMdxProps) => {
  console.log(props, '[WrapperMdx');

  const { children = '', toc = [] } = props;

  const boxClass = clsx('m-auto w-full', 'xl:(flex justify-center)');

  const articleClass = clsx('nant-mdx break-words  font-normal text-primary dark:text-primary-dark pl-2 text-[15px]');

  const asideClass = clsx('relative hidden order-2 flex-grow pl-4 w-full max-w-64', 'xl:block');

  const contentClass = clsx('relative m-auto w-full', 'xl:(order-1 m-0 ) lg:( pb-32)');

  return (
    <div className={boxClass}>
      <section className={contentClass}>
        <div className="max-w-4xl	m-auto font-maple">
          <article className={articleClass}>{children}</article>
        </div>
      </section>
      <aside className={asideClass}>
        <TableContent toc={toc} />
      </aside>
    </div>
  );
};

export default WrapperMdx;
