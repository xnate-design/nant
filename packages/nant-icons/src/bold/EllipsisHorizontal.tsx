import { IconSvgProps } from '../types';
export const EllipsisHorizontal = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <circle cx="256" cy="256" r="48" />

      <circle cx="416" cy="256" r="48" />

      <circle cx="96" cy="256" r="48" />
    </svg>
  );
};
