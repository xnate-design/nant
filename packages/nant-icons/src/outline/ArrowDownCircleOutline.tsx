import { IconSvgProps } from '../types';

export const ArrowDownCircleOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <path
        d="M176 262.62 256 342l80-79.38m-80 68.35V170"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />

      <path
        d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64Z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
    </svg>
  );
};
