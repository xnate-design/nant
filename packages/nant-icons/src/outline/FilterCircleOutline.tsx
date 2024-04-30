import { IconSvgProps } from '../types';
export const FilterCircleOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="32"
        strokeMiterlimit="10"
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192Z"
      />

      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="32"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M144 208h224m-192 64h160m-112 64h64"
      />
    </svg>
  );
};
