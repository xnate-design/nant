import { IconSvgProps } from '../types';
export const CompassOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <path
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192Z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
      />

      <path d="m350.67 150.93-117.2 46.88a64 64 0 0 0-35.66 35.66l-46.88 117.2a8 8 0 0 0 10.4 10.4l117.2-46.88a64 64 0 0 0 35.66-35.66l46.88-117.2a8 8 0 0 0-10.4-10.4ZM256 280a24 24 0 1 1 24-24 24 24 0 0 1-24 24Z" />
    </svg>
  );
};
