import React from 'react';
export const RefreshSharp = ({ width = '410', height = '404', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path
        d="M320 146s24.36-12-64-12a160 160 0 1 0 160 160"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="32"
      />

      <path
        d="m256 58 80 80-80 80"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
    </svg>
  );
};
