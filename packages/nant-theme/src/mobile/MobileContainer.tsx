import { LazyExoticComponent, Suspense } from 'react';

interface WrapperMobileProps {
  lazyChildren?: any | LazyExoticComponent<() => JSX.Element>;
}

export default function MobileContainer(props: WrapperMobileProps) {
  return (
    <Suspense fallback={null}>
      <props.lazyChildren />
    </Suspense>
  );
}
