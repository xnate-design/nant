import React from 'react';

interface BaseTypeProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

type MergeHtmlAttributes = Omit<React.ButtonHTMLAttributes<HTMLElement>, 'type'>;

export interface ButtonBaseProps {
  block?: boolean;
  type?: ButtonTypes;
  size?: ButtonSize;
  nativeType?: ButtonNativeType;
}
export interface ButtonProps extends BaseTypeProps, ButtonBaseProps, MergeHtmlAttributes {}

export interface ButtonRef {
  nativeElement: HTMLButtonElement | null;
}

export type ButtonNativeType = 'button' | 'submit' | 'reset' | undefined;

export type ButtonTypes = 'primary' | 'default' | 'info' | 'success' | 'warning' | 'danger';

export type ButtonSize = 'normal' | 'large' | 'small' | 'mini';
