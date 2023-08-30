import { useContext, useState, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import SiteContext from '../../SiteContext';
import { useActiveSection } from '../../hooks';
import { Logo } from '../Logo';
import { CloseOutline } from '@nant/nant-icons/dist/react/CloseOutline';
import { ReorderFourOutline } from '@nant/nant-icons/dist/react/ReorderFourOutline';
import { SearchOutline } from '@nant/nant-icons/dist/react/SearchOutline';
import { SunnyOutline } from '@nant/nant-icons/dist/react/SunnyOutline';
import { MoonOutline } from '@nant/nant-icons/dist/react/MoonOutline';
import { LogoGithub } from '@nant/nant-icons/dist/react/LogoGithub';
import { lowerCase } from 'lodash-es';

import { DefaultTheme } from 'nant/theme';

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
