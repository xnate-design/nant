import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import cn from 'clsx';

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

export const TopNav = () => {
  const { nav, site } = useContext(SiteContext);
  const section = useActiveSection();

  console.log(section, 'section');

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        className={cn(
          isOpen
            ? 'h-screen sticky top-0 lg:bottom-0 lg:h-screen flex flex-col shadow-lg dark:shadow-lg z-20'
            : 'z-50 sticky top-0',
        )}
      >
        <nav
          className={cn(
            'duration-300 backdrop-filter  backdrop-blur-lg backdrop-saturate-200 transition-shadow bg-opacity-90 items-center w-full flex justify-between bg-wash dark:bg-wash-dark dark:bg-opacity-95 px-1.5 lg:pr-5 lg:pl-4 z-50',
          )}
        >
          <div className="h-16 w-full gap-0 sm:gap-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="3xl:flex-1 flex flex-row ">
                <button
                  type="button"
                  aria-label="Menu"
                  onClick={() => setIsOpen(!isOpen)}
                  className={cn(
                    'active:scale-95 transition-transform flex lg:hidden w-12 h-12 items-center justify-center hover:text-link hover:dark:text-link-dark outline-link',
                    {
                      'text-link dark:text-link-dark': isOpen,
                    },
                  )}
                >
                  {isOpen ? <CloseOutline /> : <ReorderFourOutline />}
                </button>
                <div className="3xl:flex-1 flex items-center">
                  <Link to="/">
                    <div
                      className={`active:scale-95 overflow-hidden transition-transform relative items-center text-primary dark:text-primary-dark p-1 whitespace-nowrap outline-link rounded-full 3xl:rounded-xl inline-flex text-lg font-normal gap-2`}
                    >
                      <Logo className="text-sm mr-0 w-10 h-10 text-link dark:text-link-dark flex origin-center transition-all ease-in-out" />
                      <span className="sr-only 3xl:not-sr-only">{site?.title}</span>
                      <span className="">{site?.title}</span>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="text-sm font-bold justify-center items-center gap-1.5 flex 3xl:flex-1 flex-row 3xl:justify-end">
                <div className="mx-2.5 gap-1 hidden lg:flex">
                  {nav?.map((item, idx) => (
                    <NavItem key={idx} isActive={section === lowerCase(item.text)} url={item.link}>
                      {item.text}
                    </NavItem>
                  ))}
                </div>
                <div className="flex w-full md:hidden"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center -space-x-2.5 xs:space-x-0 ">
            <div className="flex dark:hidden">
              <button
                type="button"
                aria-label="Use Dark Mode"
                onClick={() => {
                  window.__setPreferredTheme('dark');
                }}
                className="active:scale-95 transition-transform flex w-12 h-12 items-center justify-center hover:text-link hover:dark:text-link-dark outline-link"
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
                className="active:scale-95 transition-transform flex w-12 h-12 items-center justify-center hover:text-link hover:dark:text-link-dark outline-link"
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
                className="active:scale-95 transition-transform flex w-12 h-12 items-center justify-center hover:text-link hover:dark:text-link-dark outline-link"
              >
                <LogoGithub />
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

const NavItem = ({ url, isActive, target, children }: any) => {
  return (
    <div className="flex flex-auto sm:flex-1">
      <Link
        target={target}
        to={url}
        className={cn(
          'active:scale-95 transition-transform w-full text-center outline-link py-1.5 px-1.5 xs:px-3 sm:px-4 rounded-full capitalize',
          !isActive && 'hover:text-link hover:dark:text-link-dark',
          isActive && 'text-link dark:text-link-dark',
        )}
      >
        {children}
      </Link>
    </div>
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
