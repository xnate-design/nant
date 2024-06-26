import { IconSvgProps } from '../types';
export const MicCircleOutline = (props: IconSvgProps) => {
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
        d="M224 368h64m48-143.7v23.92c0 39.42-40.58 71.48-80 71.48h0c-39.42 0-80-32.06-80-71.48V224.3m80 95.7v48"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />

      <rect x="208" y="128" width="96" height="160" rx="48" ry="48" />
    </svg>
  );
};
