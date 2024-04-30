import { IconSvgProps } from '../types';
export const ListSharp = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <path
        d="M144 144h320M144 256h320M144 368h320"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="48"
      />

      <path
        d="M64 128h32v32H64zm0 112h32v32H64zm0 112h32v32H64z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  );
};
