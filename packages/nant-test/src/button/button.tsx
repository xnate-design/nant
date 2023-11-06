import React from 'react';

import './index.less';

type ButtonProps = {
  children?: React.ReactNode;
};

export default function Button(props: ButtonProps) {
  const { children } = props;
  return (
    <button type="button" className="btn btn-primary">
      {children}
    </button>
  );
}
