import { useContext, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import SiteContext from '../../SiteContext';
import { useActiveSection } from '../../hooks';
import { ChevronForwardOutline as ArrowRight } from '@nant/nant-icons/dist/react/ChevronForwardOutline';

import { DefaultTheme } from 'nant/theme';

export const SideBar = () => {
  const { sideBar = {} } = useContext(SiteContext);
  const section = useActiveSection();

  const sideBarGroup = useMemo(() => {
    return sideBar[section] ?? [];
  }, [sideBar, section]);

  const sideClass = clsx(
    'fixed top-0 bottom-0 left-0 px-8 pt-8 pb-24 width-side-bar max-w-xs opacity-0 lg:bg-alt lg:dark:bg=al-dark lg:translate-x-0 lg:w-72',
    '2xl:pl-nav-title 2xl:width-top-nav lg:pt-16 lg:pb-32 lg:max-w-full lg:opacity-100 lg:bg-alt lg:dark:bg-alt-dark overflow-x-hidden overflow-y-auto -translate-x-full transition-side-bar overscroll-contain',
  );

  const curtainClass = clsx('lg:sticky lg:-t-16 lg:-mt-16 lg:left-0 lg:h-16 lg:-mx-8 lg:bg-alt lg:dark:bg-alt-dark');

  return (
    <aside className={sideClass}>
      <div className={curtainClass}></div>
      <div className="">
        {sideBarGroup.map((sideBar: DefaultTheme.NavItem, id: number) => {
          return (
            <div
              key={id}
              className="lg:(pt-3 width-side-group) border-b-1 border-divider dark:border-divider-dark last:border-b-0 group"
            >
              <SideGroupItem item={sideBar} level={0} />
            </div>
          );
        })}
      </div>
    </aside>
  );
};

interface SideGroupProps {
  item: DefaultTheme.NavItem;
  level: number;
}

const SideGroupItem = ({ item = {}, level = 0 }: SideGroupProps) => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const itemClass = clsx(
    item.link === pathname ? 'text-link dark:text-link-dark' : 'text-secondary dark:text-secondary-dark',
    'flex items-center text-[14px] flex-grow py-1 font-medium capitalize hover:text-link hover:dark:text-link-dark',
  );

  const itemsClass = clsx('items', {
    hidden: collapsed,
  });

  const iconClass = clsx('text-sm transition-transform', collapsed ? 'rotate-0' : 'rotate-90');

  const sideItem = () => {
    if (item.text) {
      if (item.link)
        return (
          <div className="item relative w-full flex ">
            <Link className={itemClass} to={item.link}>
              {item.text}
            </Link>
          </div>
        );

      return (
        <div className="relative w-full flex cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
          <h2 className="flex items-center flex-grow font-bold h-8 text-primary text-[15px] py-1 dark:text-primary-dark">
            {item.text}
          </h2>
          <button className="h-8 w-8 text-tertiary dark:text-tertiary-dark flex justify-center items-center -mr-2 cursor-pointer">
            <ArrowRight className={iconClass} />
          </button>
        </div>
      );
    }
  };

  const sideItems = () => {
    if (item.items && item.items.length) {
      return (
        <div className={itemsClass}>
          {item.items.map((subItem, sIdx) => {
            return <SideGroupItem key={sIdx} item={subItem} level={level + 1} />;
          })}
        </div>
      );
    }
  };

  const sectionClass = clsx('barItem ', {
    'pb-6': !level,
  });

  return (
    <section className={sectionClass}>
      {sideItem()}
      {sideItems()}
    </section>
  );
};
