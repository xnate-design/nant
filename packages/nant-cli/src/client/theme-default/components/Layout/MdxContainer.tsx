import type { Toc } from '@nant/vite-plugins';
import React, { LazyExoticComponent } from 'react';
import { useLoaderData } from 'react-router-dom';
import { MDXComponents } from '../MDX/MDXComponents';

import clsx from 'clsx';

interface WrapperMdxProps {
  lazyChildren?: any | LazyExoticComponent<() => JSX.Element>;
}

export function MdxContainer(props: WrapperMdxProps) {
  const toc = useLoaderData() as Toc;

  const { lazyChildren } = props;
  console.log(lazyChildren);

  const mainClass = clsx('w-full px-6 pt-8 pb-28', 'lg:(pt-8) md:(pt-12 pb-32)');

  const boxClass = clsx('m-auto w-full', 'xl:(flex justify-center)');

  const articleClass = clsx('break-words  font-normal text-primary dark:text-primary-dark');

  const asideClass = clsx('relative hidden order-2 flex-grow pl-4 w-full max-w-64', 'xl:block');

  const contentClass = clsx('relative m-auto w-full', 'xl:(order-1 m-0 ) lg:( pb-32)');

  return (
    <React.Suspense fallback={null}>
      <div className={boxClass}>
        <section className={contentClass}>
          <div className="max-w-4xl	m-auto">
            <article className={articleClass}>
              <props.lazyChildren components={MDXComponents} />
            </article>
          </div>
        </section>
        <aside className={asideClass}></aside>
      </div>
    </React.Suspense>
  );
}
