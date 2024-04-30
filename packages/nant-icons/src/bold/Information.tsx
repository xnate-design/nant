import { IconSvgProps } from '../types';
export const Information = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <path
        d="M196 220h64v172"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="40"
      />

      <path
        d="M187 396h138"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="40"
      />

      <path d="M256 160a32 32 0 1 1 32-32 32 32 0 0 1-32 32Z" />
    </svg>
  );
};
