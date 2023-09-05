import { useState, useEffect } from 'react';
import cn from 'clsx';
import type { Toc } from '@nant/vite-plugins';
import { lowerCase } from 'lodash-es';

interface TocProps {
  toc: Toc;
  depth?: number;
}

const useActiveId = (idList: string[]) => {
  const [activeId, setActiveId] = useState('el');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0% -80% 0%' },
    );
    idList.forEach((id) => {
      const idx = document.getElementById(`${lowerCase(id)}`);
      console.log(idx);
      if (!idx) return;
      observer.observe(idx);
    });

    return () => {
      idList.forEach((id) => {
        const idNode = document.getElementById(id);
        idNode && observer.unobserve(idNode);
      });
    };
  }, [idList]);
  return activeId;
};

export function TableContent({ toc, depth = 2 }: TocProps) {
  const headings = toc[0].children ?? [];
  const tocIds = headings.map((e) => e.value);
  const activeId = useActiveId(tocIds);
  return (
    <>
      <nav className="">
        <h2 className="">TABLE OF CONTENT</h2>
        <ul className="">
          {headings.map((head) => {
            const headCls = cn('text-pre', 'hover:text-hover-color', {
              'pl-2': head.depth > depth,
              'text-hover-color': head.value === `${activeId}`,
            });
            return (
              <li key={head.value} className="mt-2">
                <a href={`#${head.value}`} className={headCls}>
                  {head.value}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
