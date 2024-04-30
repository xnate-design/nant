import { IconSvgProps } from '../types';
export const PersonRemoveSharp = (props: IconSvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
      fill="currentColor"
      {...props}
    >
      <rect x="16" y="214" width="144" height="36" />
      <circle cx="288" cy="144" r="112" />
      <path d="M288,288c-69.42,0-208,42.88-208,128v64H496V416C496,330.88,357.42,288,288,288Z" />
    </svg>
  );
};
