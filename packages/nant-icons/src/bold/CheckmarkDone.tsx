import { IconSvgProps } from '../types';
export const CheckmarkDone = (props) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <path
        d="M464 128 240 384l-96-96m0 96-96-96m320-160L232 284"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  );
};
