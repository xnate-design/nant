import { IconSvgProps } from '../types';
export const EllipsisVerticalCircleOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <circle cx="256" cy="256" r="26" />

      <circle cx="256" cy="346" r="26" />

      <circle cx="256" cy="166" r="26" />

      <path
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192Z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
    </svg>
  );
};
