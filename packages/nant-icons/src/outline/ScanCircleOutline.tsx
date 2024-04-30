import { IconSvgProps } from '../types';
export const ScanCircleOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <path
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192Z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
      />

      <path
        d="M296 352h28a28 28 0 0 0 28-28v-28m0-80v-28a28 28 0 0 0-28-28h-28m-80 192h-28a28 28 0 0 1-28-28v-28m0-80v-28a28 28 0 0 1 28-28h28"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  );
};
