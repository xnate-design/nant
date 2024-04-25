'use client';

import { useContext, useState } from 'react';
// import { DocSearch } from '@docsearch/react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useActiveSection } from '@/hooks';

import { cn } from '@/utils/cn';
import siteData from '@/config/site';

import { Logo, ThemeSwitch } from '@/components/layout';
import { GithubIcon } from '@/components/icons';

export const Navbar = ({ hasSideBar = false }) => {
  const pathname = usePathname();
  const { nav, title } = siteData;
  const section = useActiveSection(pathname);

  const headerClass = cn('lg:fixed relative top-0 left-0 w-full z-20', {
    'h-screen sticky top-0 lg:bottom-0 lg:h-screen flex flex-col shadow-lg dark:shadow-lg z-20': true,
  });

  const navClass = cn(
    'relative border-b border-transparent h-16 whitespace-nowrap pr-2 pl-6 md:px-8',
    hasSideBar ? 'lg:p-0 ' : '',
  );

  const containerClass = cn('flex justify-between m-auto ', hasSideBar ? 'lg:max-w-full' : 'max-width-nav');

  return (
    <>
      <header className={headerClass}>
        <div className={navClass}>
          <section className={containerClass}>
            <TopTitle hasSideBar={hasSideBar} title={title} />
            <TopContent hasSideBar={hasSideBar} section={section} nav={nav} />
          </section>
        </div>
      </header>
    </>
  );
};

const TopTitle = ({ hasSideBar = false, title = '' }) => {
  const titleClass = cn('flex-shrink height-nav-title', {
    'lg:absolute top-0 lg:left-0 lg:px-8 lg:w-72 lg:h-16 lg:bg-transparent 2xl:pl-nav-title 2xl:width-top-nav':
      hasSideBar,
  });

  const linkClass = cn('border-b flex items-center gap-2 border-transparent h-16 w-full text-base font-bold ', {
    'lg:border-divider lg:dark:border-divider-dark': hasSideBar,
  });

  return (
    <div className={titleClass}>
      <div className="pointer-events-auto">
        <Link href="/" className={linkClass}>
          <Logo logo={siteData.logo} className="w-7" />
          <span>{title}</span>
        </Link>
      </div>
    </div>
  );
};

const TopContent = ({ nav = [], section = '', hasSideBar = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  console.log(nav, 'nav');

  const contentClass = cn('flex-grow pointer-events-none ', {
    '2xl:pr-top-content 2xl:pl-top-content lg:pl-72 lg:pr-8': hasSideBar,
  });
  const contentBodyClass = cn(
    'flex flex-end items-center height-nav-title pointer-events-auto bg-wash dark:bg-wash-dark',
  );
  const themeBtnClass = cn('');

  const searchClass = cn('search-box flex items-center flex-grow lg:pl-8 md:pl-6');

  return (
    <div className={contentClass}>
      <div className={contentBodyClass}>
        <div className={searchClass}>
          {/* <DocSearch
            appId="BOCE4DN1H2"
            apiKey="3a89b1923593fa3a67271f30c9ca1c98"
            indexName="wangbaoqi"
            placeholder="quick search"
          /> */}
        </div>
        <nav className="md:flex hidden md:pr-4">
          {nav?.map((item, idx) => (
            <NavItem key={idx} isActive={section === item.activeMatch} url={item.link}>
              {item.text}
            </NavItem>
          ))}
        </nav>
        <div className="flex">
          <ThemeSwitch />
        </div>

        <div className="flex">
          <Link
            href="https://github.com/Wangbaoqi/nateTech"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open on GitHub"
            className="active:scale-95 transition-transform flex px-2 items-center justify-center text-primary dark:text-primary-dark hover:text-secondary hover:dark:text-secondary-dark outline-link"
          >
            <GithubIcon />
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
      href={url}
      className={cn(
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
