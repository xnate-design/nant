import React from 'react';

import { ButtonProps } from './propsType';

import './index.less';

export default function Button(props: ButtonProps) {
  const { children } = props;
  return (
    <button type="button" className="btn btn-primary">
      {children}
    </button>
  );
}
