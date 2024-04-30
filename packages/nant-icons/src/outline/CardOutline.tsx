import { IconSvgProps } from '../types';
export const CardOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <rect
        x="48"
        y="96"
        width="416"
        height="320"
        rx="56"
        ry="56"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />

      <path
        d="M48 192h416M128 300h48v20h-48z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="60"
      />
    </svg>
  );
};
