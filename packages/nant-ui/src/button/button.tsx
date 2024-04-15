import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';
import { ButtonProps, ButtonRef } from './propsType';

const clsxPrefix = 'nant-button';

const Button = forwardRef<ButtonRef, ButtonProps>((props, ref) => {
  const { className = '', block = false, type = 'default', size = 'normal', nativeType = 'button', children } = props;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const btnClsx = clsx(clsxPrefix, className, {
    [`${clsxPrefix}-block`]: block,
    [`${clsxPrefix}-${type}`]: type,
    [`${clsxPrefix}-${size}`]: size,
  });
  useImperativeHandle(ref, () => ({
    get nativeElement() {
      return buttonRef.current;
    },
  }));

  return (
    <button ref={buttonRef} type={nativeType} className={btnClsx}>
      {children}
    </button>
  );
});

export default Button;
