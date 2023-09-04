import React, { LazyExoticComponent } from 'react';
import { MDXComponents } from '../MDX/MDXComponents';

interface WrapperMdxProps {
  lazyChildren?: any | LazyExoticComponent<() => JSX.Element>;
}

export function MdxContainer(props: WrapperMdxProps) {
  return (
    <React.Suspense fallback={null}>
      <props.lazyChildren components={MDXComponents} />
    </React.Suspense>
  );
}
