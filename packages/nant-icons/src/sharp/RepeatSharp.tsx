import { IconSvgProps } from '../types';
export const RepeatSharp = (props: IconSvgProps) => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512" {...props}>
      <path
        d="m320 120 48 48-48 48"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="32"
      />

      <path
        d="M352 168H64v96m128 128-48-48 48-48"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="32"
      />

      <path
        d="M160 344h288v-96"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
    </svg>
  );
};
