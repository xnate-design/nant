import React from 'react';
export const MoveSharp = ({ width = '410', height = '404', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path
        d="m176 112 80-80 80 80m-80.02-80 .02 448m-80-80 80 80 80-80m64-224 80 80-80 80M112 176l-80 80 80 80m-80-80h448"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
    </svg>
  );
};
