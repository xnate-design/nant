import { IconSvgProps } from '../types';
export const ContrastOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <circle cx="256" cy="256" r="208" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32" />

      <path d="M256 464c-114.88 0-208-93.12-208-208S141.12 48 256 48Z" />
    </svg>
  );
};
