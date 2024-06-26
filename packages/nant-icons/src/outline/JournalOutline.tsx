import { IconSvgProps } from '../types';
export const JournalOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <rect
        x="96"
        y="48"
        width="320"
        height="416"
        rx="48"
        ry="48"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="32"
      />

      <path d="M320 48v416" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="60" />
    </svg>
  );
};
