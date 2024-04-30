import { IconSvgProps } from '../types';
export const LaptopOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <rect
        x="48"
        y="96"
        width="416"
        height="304"
        rx="32.14"
        ry="32.14"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="32"
      />

      <path d="M16 416h480" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32" />
    </svg>
  );
};
