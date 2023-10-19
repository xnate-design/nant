import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { usePrevNext } from '../../hooks';

export const PrevNext = () => {
  const { prev, next } = usePrevNext();

  const itemClsx = clsx('pt-2 sm:(flex flex-col flex-shrink-0 w-1/2)', {
    'sm:(pt-0 pl-4)': prev,
  });
  const itemLinkClsx = clsx(
    'block border border-border hover:border-link hover:dark:border-link dark:border-border-dark py-3 px-4 w-full h-full rounded-lg',
    {
      'ml-auto text-right': next,
    },
  );
  const descClsx = clsx('block leading-5 text-xs font-medium');
  const titleClsx = clsx('block leading-5 text-sm font-medium text-link dark:text-link-dark');
  return (
    <div className="border-t  border-border dark:border-border-dark pt-6 sm:flex max-w-[800px]">
      <div className={itemClsx}>
        {prev ? (
          <Link to={prev.link} className={itemLinkClsx}>
            <span className={descClsx}>Previous Page</span>
            <span className={titleClsx}>{prev.text}</span>
          </Link>
        ) : (
          ''
        )}
      </div>

      <div className={itemClsx}>
        {next ? (
          <Link to={next.link} className={itemLinkClsx}>
            <span className={descClsx}>Next Page</span>
            <span className={titleClsx}>{next.text}</span>
          </Link>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
