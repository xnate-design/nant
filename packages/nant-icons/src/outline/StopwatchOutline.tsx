import { IconSvgProps } from '../types';
export const StopwatchOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <path
        d="M256 232v-80"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />

      <path
        d="M256 88V72m-124 60-12-12"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="48"
      />

      <circle cx="256" cy="272" r="32" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" />

      <path
        d="M256 96a176 176 0 1 0 176 176A176 176 0 0 0 256 96Z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
    </svg>
  );
};
