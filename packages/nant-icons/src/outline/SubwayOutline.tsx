import { IconSvgProps } from '../types';
export const SubwayOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <rect
        x="112"
        y="32"
        width="288"
        height="352"
        rx="48"
        ry="48"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
      />

      <path
        d="M208 80h96"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />

      <rect
        x="112"
        y="128"
        width="288"
        height="96"
        rx="32"
        ry="32"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />

      <circle cx="176" cy="320" r="16" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32" />

      <circle cx="336" cy="320" r="16" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32" />

      <path
        d="M144 464h224m-32-32 48 48m-208-48-48 48"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  );
};
