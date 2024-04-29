import { cn } from '@/utils/cn';
import siteDate from '@/config/site';

export const FeaturesGrid = () => {
  return (
    <section className={cn('max-w-8xl m-auto')}>
      <div className={cn('lg:(px-16) sm:(px-12) px-6 relative py-16')}>
        <div className="grid lg:(grid-cols-4) sm:(grid-cols-2) -m-1.5 gap-6">
          {siteDate.featureLists.map((feature, idx) => {
            return (
              <div className="flex-1" key={idx}>
                <div className="border border-soft dark:border-soft-dark h-full rounded-lg bg-soft dark:bg-soft-dark">
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
  );
};
