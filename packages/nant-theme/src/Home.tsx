import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { TopNav } from './components/Layout/index';

import { LogoVite } from '@nant-design/nant-icons/dist/react/LogoVite';
import { LogoUnocss } from '@nant-design/nant-icons/dist/react/LogoUnocss';
import { LogoMarkdown } from '@nant-design/nant-icons/dist/react/LogoMarkdown';
import { LogoReact } from '@nant-design/nant-icons/dist/react/LogoReact';
import { useMemo } from 'react';

export default function Home() {
  const homeClass = clsx('lg:pt-16 w-full max-w-full flex-shrink flex-grow m-auto');
  const contentClass = clsx('md:pb-28 pb-20 font-wotfard');
  const heroClass = clsx(
    'lg:(pt-38 px-14 pb-14) sm:(pt-18 px-12 pb-14) pt-28 px-6 pb-12 -mt-20 flex flex-col lg:flex-row justify-content',
  );
  const heroImgClass = clsx(
    'lg:(max-w-sm max-h-96) sm:(w-70 h-70) absolute top-1/2 left-1/2 rounded-full w-48 h-48 transform -translate-1/2 -translate-y-1/2)',
  );
  const heroGradientClass = clsx('bg-gradient-to-tr from-blue-40 to-green-40 ');
  const blueClass = clsx('filter blur-3xl');
  const featureClass = clsx('lg:(px-16) sm:(px-12) px-6 relative py-16');
  const containerClass = clsx('max-w-7xl m-auto');

  const featureLists = useMemo(() => {
    return [
      {
        icon: (props: any) => <LogoVite {...props} />,
        title: 'Enjoy the Vite',
        description: 'Instant server start, lightning fast hot updates, and leverage Vite ecosystem plugins.',
      },
      {
        icon: (props: any) => <LogoUnocss {...props} />,
        title: 'Use the Unocss',
        description: 'Instant On-demand Atomic CSS Engine Customizable · Powerful · Fast · Joyful',
      },
      {
        icon: (props: any) => <LogoMarkdown {...props} />,
        title: 'Custom the Content',
        description: 'Effortlessly create beautiful documentation sites with just markdown.',
      },
      {
        icon: (props: any) => <LogoReact {...props} />,
        title: 'Customize with React',
        description: 'Use JSX syntax and components directly in markdown',
      },
    ];
  }, []);

  return (
    <div className={homeClass}>
      <div className={contentClass}>
        <section className={containerClass}>
          <div className={heroClass}>
            <div className="lg:(flex-grow order-1 flex-shrink-0 max-w-3xl text-left) flex order-2 text-center justify-center flex-col items-center">
              <h1 className="text-6xl font-bold w-full">
                <span className="nant-home-title bg-clip-text bg-gradient-to-tr from-blue-40 to-green-40 decoration-black	">
                  Nant Ui
                </span>
              </h1>
              <p className="text-6xl font-bold w-full lg:(my-4)">Vite & React Powered Static Site Generator</p>
              <p className="text-lg">
                An open source mobile UI toolkit for building modern, high quality cross-platform mobile apps from a
                single code base in
              </p>
              <div className="lg:(justify-start) justify-center flex flex-wrap pt-6 w-full">
                <div className="flex-shrink p-2">
                  <Link
                    className="text-[14px] font-semibold text-primary-dark rounded-lg bg-link dark:bg-link-dark py-2 px-4 flex items-center text-center"
                    to="/docs/intro"
                  >
                    Get Start
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:(flex-grow order-2 m-0 min-h-full) sm:(mt-24 mx-6 mb-10) order-1 mt-18 mx-6 mb-14">
              <div className="lg:(flex items-center justify-center w-full h-full transform translate-x-8 translate-y-8) sm:(w-96 h-96) relative m-auto w-80 h-80">
                <div className={`${heroImgClass} ${heroGradientClass} ${blueClass}`}></div>
                <img className={heroImgClass} src="https://media.wangbaoqi.tech/assets/svg/me.webp" alt="me-logo" />
              </div>
            </div>
          </div>
        </section>
        <section className={containerClass}>
          <div className={featureClass}>
            <div className="grid lg:(grid-cols-4) sm:(grid-cols-2) -m-1.5 gap-6">
              {featureLists.map((feature, idx) => {
                return (
                  <div className="flex-1" key={idx}>
                    <div className="border border-soft dark:border-soft-dark h-full rounded-lg bg-card dark:bg-card-dark">
                      <article className="flex flex-col p-6 h-full w-full w-50 h-50">
                        <div className="flex w-12 h-12 justify-center items-center rounded-lg text-link bg-soft-g dark:bg-soft-g-dark">
                          <feature.icon className="text-lg" />
                        </div>
                        <h2 className="font-semibold py-2">{feature.title}</h2>
                        <p className="flex-grow text-secondary dark:text-secondary-dark text-sm break-all">
                          {feature.description}
                        </p>
                      </article>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
