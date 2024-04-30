import React from 'react';
export const SwapVerticalSharp = ({ width = '410', height = '404', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path
        d="M464 208 352 96 240 208m112-94.87V416M48 304l112 112 112-112m-112 94V96"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
    </svg>
  );
};
