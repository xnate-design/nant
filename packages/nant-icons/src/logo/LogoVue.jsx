import React from 'react';
export const LogoVue = ({ width = '410', height = '404', fill = 'url(#b)', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path d="m256 144.03-55.49-96.11h-79.43L256 281.61 390.92 47.92h-79.43L256 144.03z" />

      <path d="M409.4 47.92 256 313.61 102.6 47.92H15.74L256 464.08 496.26 47.92H409.4z" />
    </svg>
  );
};
