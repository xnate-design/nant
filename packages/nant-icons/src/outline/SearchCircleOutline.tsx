import { IconSvgProps } from '../types';
export const SearchCircleOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <path
        d="M256 80a176 176 0 1 0 176 176A176 176 0 0 0 256 80Z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
      />

      <path
        d="M232 160a72 72 0 1 0 72 72 72 72 0 0 0-72-72Z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
      />

      <path
        d="M283.64 283.64 336 336"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
    </svg>
  );
};
