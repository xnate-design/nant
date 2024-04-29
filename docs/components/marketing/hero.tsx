import Link from 'next/link';
import siteDate from '@/config/site';
import { cn } from '@/utils/cn';

export const Hero = () => {
  return (
    <section className={cn('max-w-8xl m-auto')}>
      <div
        className={cn(
          'lg:(pt-38 pb-14 flex-row) sm:(pt-18 pb-14) pt-28 pb-12 -mt-20 flex flex-col justify-between items-center',
        )}
      >
        <div
          className={cn(
            'lg:(flex-grow order-1 flex-shrink-0 max-w-xl text-left) flex order-2 text-center justify-around flex-col items-center',
          )}
        >
          <h3 className="text-5xl font-bold mb-4">{siteDate.name}</h3>
          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-peony-500  to-croci-500 decoration-black">
            {siteDate.description}
          </p>
          <div className="lg:(justify-start) justify-center flex flex-wrap pt-6 w-full">
            <div className="flex-shrink p-2">
              <Link
                className="text-[14px] font-semibold rounded-lg bg-gradient-to-r to-peony-500  from-croci-500 py-2 px-4 flex items-center text-center"
                href={siteDate.startUrl}
              >
                Get Start
              </Link>
            </div>
          </div>
        </div>
        <div className="lg:(flex-grow order-2 m-0 min-h-full) sm:(mt-24 mx-6 mb-10) order-1 mt-18 mx-6 mb-14">
          {/* <div className="lg:(flex items-center justify-center transform ) sm:(w-96 h-96) relative m-auto w-80 h-80">
                <div className={`${heroImgClass} ${heroGradientClass} ${blueClass}`}></div>
                <img className={heroImgClass} src="./logo.png" alt="me-logo" />
              </div> */}
        </div>
      </div>
    </section>
  );
};
