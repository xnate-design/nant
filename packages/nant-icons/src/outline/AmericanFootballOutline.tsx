import { IconSvgProps } from '../types';

export const AmericanFootballOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <ellipse
        cx="256"
        cy="256"
        rx="267.57"
        ry="173.44"
        transform="rotate(-45 256 256.002)"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />

      <path
        d="M334.04 177.96 177.96 334.04M278.3 278.3l-44.6-44.6m89.19 0-44.59-44.59m178.38 22.29L300.6 55.32m-89.2 401.36L55.32 300.6m178.38 22.29-44.59-44.59"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  );
};
