import Link from 'next/link';
import { cn } from '@/utils/cn';

import { logos } from '@nant-design/nant-icons';
import { Hero } from '@/components/marketing';
import { useMemo } from 'react';

import siteDate from '@/config/site';

const logoList = Object.values(logos);

export default function Home() {
  const homeClass = cn('lg:pt-16 w-full max-w-full flex-shrink flex-grow m-auto');
  const contentClass = cn('md:pb-28 pb-20 font-wotfard');
  const heroClass = cn(
    'lg:(pt-38 pb-14) sm:(pt-18 pb-14) pt-28  pb-12 -mt-20 flex flex-col lg:flex-row justify-between items-center',
  );
  const heroImgClass = cn(
    'lg:(max-w-sm max-h-96) absolute top-1/2 left-1/2 w-[275px] h-[243px] transform -translate-1/2 -translate-y-1/2)',
  );
  const heroGradientClass = cn('bg-gradient-to-tr from-[#A6155A]  to-[#FFA930] ');
  const blueClass = cn('filter blur-3xl');
  const featureClass = cn('lg:(px-16) sm:(px-12) px-6 relative py-16');
  const containerClass = cn('max-w-8xl m-auto');

  return (
    <div className={homeClass}>
      <Hero />
      <div className={contentClass}></div>
    </div>
  );
}
