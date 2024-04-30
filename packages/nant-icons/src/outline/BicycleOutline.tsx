import { IconSvgProps } from '../types';
export const BicycleOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <path
        d="M388 288a76 76 0 1 0 76 76 76.24 76.24 0 0 0-76-76Zm-264 0a76 76 0 1 0 76 76 76.24 76.24 0 0 0-76-76Z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
      />

      <path
        d="M256 360v-86l-64-42 80-88 40 72h56"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />

      <path d="M320 136a31.89 31.89 0 0 0 32-32.1A31.55 31.55 0 0 0 320.2 72a32 32 0 1 0-.2 64Z" />
    </svg>
  );
};
