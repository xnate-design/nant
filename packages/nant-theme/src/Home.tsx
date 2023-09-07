import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { TopNav } from './components/Layout/index';

export default function Home() {
  const homeClass = clsx('lg:pt-16 w-full max-w-full flex-shrink flex-grow m-auto');
  const contentClass = clsx('md:pb-28 pb-20');
  const heroClass = clsx('');

  const featureClass = clsx('');

  const containerClass = clsx('max-w-7xl m-auto');

  return (
    <div className={homeClass}>
      <div className={contentClass}>
        <section className="py-20 px-42">
          <div className={containerClass}>
            <div className="flex justify-center flex-col items-center">
              <h1 className="text-5xl font-bold">Nant Ui Doc</h1>
              <p className="text-lg">
                An open source mobile UI toolkit for building modern, high quality cross-platform mobile apps from a
                single code base in
              </p>
              <div className=""></div>
            </div>
          </div>
        </section>
        <div className={featureClass}></div>
      </div>
    </div>
  );
}
