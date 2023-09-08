import cn from 'clsx';
import { lowerCase } from 'lodash-es';
import { DefaultTheme } from 'nant/theme';

import { useActiveId } from '../../hooks/useActiveId';
interface TocProps {
  toc: DefaultTheme.Toc;
  depth?: number;
}

export function TableContent({ toc, depth = 2 }: TocProps) {
  const headings = toc[0].children ?? [];
  const tocIds = headings.map((e) => e.value);
  const activeId = useActiveId(tocIds);
  return (
    <>
      <nav className="text-[13px] relative pl-6 font-medium ">
        <h2>On this page</h2>
        <ul>
          {headings.map((head) => {
            const idVal = lowerCase(head.value);

            const headCls = cn('text-pre', 'hover:text-primary hover:dark:text-primary-dark', {
              'pl-2': head.depth > depth,
              'text-primary dark:text-primary-dark': idVal === `${activeId}`,
            });

            return (
              <li key={head.value} className="leading-7 text-secondary dark:text-secondary-dark">
                <a href={`#${idVal}`} className={headCls}>
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
