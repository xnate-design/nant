import React from 'react';
export const LogoUnocss = ({ width = '410', height = '404', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 220 220" {...other}>
      <path
        d="M117.444 167.888c0-27.615 22.386-50 50-50s50 22.385 50 50c0 27.614-22.386 50-50 50s-50-22.386-50-50Z"
        fill="#858585"
      />

      <path
        d="M117.444 53c0-27.614 22.386-50 50-50s50 22.386 50 50v45a5 5 0 0 1-5 5h-90a5 5 0 0 1-5-5V53Z"
        fill="#CCCCCC"
      />

      <path
        d="M102 167.888c0 27.614-22.386 50-50 50s-50-22.386-50-50v-45a5 5 0 0 1 5-5h90a5 5 0 0 1 5 5v45Z"
        fill="#4D4D4D"
      />
    </svg>
  );
};
