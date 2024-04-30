import { IconSvgProps } from '../types';
export const EllipsisVerticalOutline = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <circle cx="256" cy="256" r="32" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" />

      <circle cx="256" cy="416" r="32" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" />

      <circle cx="256" cy="96" r="32" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" />
    </svg>
  );
};
