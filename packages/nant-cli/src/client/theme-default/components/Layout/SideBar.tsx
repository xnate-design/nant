import { useContext, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

export const SideBar = () => {
  const { sideBar = {} } = useContext(SiteContext);
  const { pathname } = useLocation();
  const section = useActiveSection();

  const sideBarGroup = useMemo(() => {
    return sideBar[section];
  }, [sideBar, section]);

  console.log(sideBarGroup, 'sideBarGroup');

  const sideClass = clsx(
    'fixed top-0 bottom-0 left-0 px-8 pt-8 pb-24 width-side-bar max-w-xs opacity-0 lg:bg-alt lg:dark:bg=al-dark lg:translate-x-0 lg:w-72',
    '2xl:pl-nav-title 2xl:width-top-nav lg:pt-16 lg:pb-32 lg:max-w-full lg:opacity-100 lg:bg-alt lg:dark:bg-alt-dark overflow-x-hidden overflow-y-auto -translate-x-full transition-side-bar overscroll-contain',
  );

  const curtainClass = clsx('lg:sticky lg:-t-16 lg:-mt-16 lg:left-0 lg:h-16 lg:-mx-8 lg:bg-alt lg:dark:bg-alt-dark');

  return (
    <aside className={sideClass}>
      <div className={curtainClass}></div>
      <div className="">
        {sideBarGroup.map((sideBar, id) => {
          return <SideGroup key={id} item={sideBar} level={0} />;
        })}
      </div>
    </aside>
  );
};

interface SideGroupProps {
  item: DefaultTheme.NavItem;
  level: number;
}

const SideGroup = ({ item = {}, level = 0 }: SideGroupProps) => {
  const sideItem = () => {
    if (item.text) {
      if (item.link) return <Link to={item.link}>{item.text}</Link>;

      return <h2 className="">{item.text}</h2>;
    }
  };

  const sideItems = () => {
    if (item.items && item.items.length) {
      return (
        <>
          {item.items.map((subItem, sIdx) => {
            return <SideGroup key={sIdx} item={subItem} level={level + 1} />;
          })}
        </>
      );
    }
  };

  return (
    <section className="md:pt-3">
      <div className="">
        {sideItem()}
        {sideItems()}
      </div>
    </section>
  );
};
