import { IconSvgProps } from '../types';
export const TvOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <rect
        x="32"
        y="96"
        width="448"
        height="272"
        rx="32.14"
        ry="32.14"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="32"
      />

      <path d="M128 416h256" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32" />
    </svg>
  );
};
