import React from 'react';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  block?: boolean;
  type?: ButtonTypes;
  size?: ButtonSize;
  nativeType?: ButtonNativeType;
  children?: React.ReactNode;
}

export type ButtonNativeType = 'button' | 'submit' | 'reset' | undefined;

export type ButtonTypes = 'primary' | 'default' | 'info' | 'success' | 'warning' | 'danger';

export type ButtonSize = 'normal' | 'large' | 'small' | 'mini';
