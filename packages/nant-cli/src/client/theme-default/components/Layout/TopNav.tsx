import { useContext, useState } from 'react';
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

interface TopContentProps {
  nav: DefaultTheme.NavItem[] | undefined;
  section?: string;
  hasSideBar?: boolean;
}

export const TopNav = ({ hasSideBar = false }) => {
  const { nav, site } = useContext(SiteContext);
  const section = useActiveSection();

  const [isOpen, setIsOpen] = useState(false);

  const headerClass = clsx('lg:fixed relative top-0 left-0 w-full z-20', {
    'h-screen sticky top-0 lg:bottom-0 lg:h-screen flex flex-col shadow-lg dark:shadow-lg z-20': isOpen,
  });

  const navClass = clsx(
    'relative border-b border-transparent h-16 whitespace-nowrap pr-2 pl-6 md:px-8',
    hasSideBar ? 'lg:p-0 ' : '',
  );

  const containerClass = clsx('flex justify-between m-auto ', hasSideBar ? 'lg:max-w-full' : 'max-width-nav');

  return (
    <>
      <header className={headerClass}>
        <div className={navClass}>
          <section className={containerClass}>
            <TopTitle hasSideBar={hasSideBar} title={site?.title} />
            <TopContent hasSideBar={hasSideBar} section={section} nav={nav} />
          </section>
        </div>
      </header>
    </>
  );
};

const TopTitle = ({ hasSideBar = false, title = '' }) => {
  const titleClass = clsx('flex-shrink height-nav-title', {
    'lg:absolute top-0 lg:left-0 lg:px-8 lg:w-72 lg:h-16 lg:bg-transparent 2xl:pl-nav-title 2xl:width-top-nav':
      hasSideBar,
  });

  const linkClass = clsx('border-b flex items-center gap-2 border-transparent h-16 w-full text-base font-bold ', {
    'lg:border-divider lg:dark:border-divider-dark': hasSideBar,
  });

  return (
    <div className={titleClass}>
      <div className="pointer-events-auto">
        <Link to="/" className={linkClass}>
          <Logo className="text-xl" />
          <span>{title}</span>
        </Link>
      </div>
    </div>
  );
};

const TopContent = ({ nav = [], section = '', hasSideBar = false }: TopContentProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const contentClass = clsx('flex-grow pointer-events-none ', {
    '2xl:pr-top-content 2xl:pl-top-content lg:pl-72 lg:pr-8': hasSideBar,
  });
  const contentBodyClass = clsx('flex flex-end items-center height-nav-title pointer-events-auto');

  const themeBtnClass = clsx('');
  return (
    <div className={contentClass}>
      <div className={contentBodyClass}>
        <div className="flex-grow"></div>
        <nav className="md:flex hidden md:pr-4">
          {nav?.map((item, idx) => (
            <NavItem key={idx} isActive={section === item.activeMatch} url={item.link}>
              {item.text}
            </NavItem>
          ))}
        </nav>
        <div className="flex dark:hidden">
          <button
            type="button"
            aria-label="Use Dark Mode"
            onClick={() => {
              window.__setPreferredTheme('dark');
            }}
            className="active:scale-95 transition-transform flex px-2 items-center justify-center hover:text-link hover:dark:text-link-dark outline-link"
          >
            <SunnyOutline />
          </button>
        </div>
        <div className="hidden dark:flex">
          <button
            type="button"
            aria-label="Use Light Mode"
            onClick={() => {
              window.__setPreferredTheme('light');
            }}
            className="active:scale-95 transition-transform flex px-2 items-center justify-center hover:text-link hover:dark:text-link-dark outline-link"
          >
            <MoonOutline />
          </button>
        </div>
        <div className="flex">
          <Link
            to="https://github.com/Wangbaoqi/nateTech"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open on GitHub"
            className="active:scale-95 transition-transform flex px-2 items-center justify-center text-primary dark:text-primary-dark hover:text-secondary hover:dark:text-secondary-dark outline-link"
          >
            <LogoGithub />
          </Link>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ url, isActive, target, children }: any) => {
  return (
    <Link
      target={target}
      to={url}
      className={clsx(
        'flex items-center px-2 text-sm font-medium capitalize h-16',
        !isActive && 'hover:text-link hover:dark:text-link-dark',
        isActive && 'text-link dark:text-link-dark',
      )}
    >
      {children}
    </Link>
  );
};

const Kbd = (props: { children?: React.ReactNode; wide?: boolean }) => {
  const { wide, ...rest } = props;
  const width = wide ? 'w-10' : 'w-5';

  return (
    <kbd
      className={`${width} h-5 border border-transparent mr-1 bg-wash dark:bg-wash-dark text-gray-30 align-middle p-0 inline-flex justify-center items-center text-xs text-center rounded-md`}
      {...rest}
    />
  );
};
