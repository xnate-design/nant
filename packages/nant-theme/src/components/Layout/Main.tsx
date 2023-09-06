import { useContext, useState, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface MainProps {
  children: ReactElement;
  hasSideBar: boolean;
}

export const Main = ({ children, hasSideBar }: MainProps) => {
  const mainClass = clsx(
    'w-full flex-grow flex-shrink-0 m-0 min-h-screen',
    '2xl:pr-main-content 2xl:pl-top-content lg:pl-72 lg:pt-16',
  );

  const docClass = clsx('lg:(px-8 pt-8 pb-0) md:(pt-12 px-8 pb-32) pt-8 px-6 pb-28');

  return (
    <main className={mainClass}>
      <div className={docClass}>{children}</div>
    </main>
  );
};
