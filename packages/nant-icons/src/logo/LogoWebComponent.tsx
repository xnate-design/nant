import { IconSvgProps } from '../types';
export const LogoWebComponent = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <path
        d="m179.9 388-76.16-132 76.16 132zm0 0h152.21l76.15-132-76.15-132H179.9l-76.16 132 76.16 132zm-76.16-132 76.16-132-76.16 132z"
        fill="none"
      />
      <path d="M496 256 376 48H239.74l-43.84 76h136.21l76.15 132-76.15 132H195.9l43.84 76H376l120-208z" />
      <path d="m179.9 388-76.16-132 76.16-132 43.84-76H136L16 256l120 208h87.74l-43.84-76z" />
    </svg>
  );
};
