import React from 'react';
export const LogoVercel = ({ fill = '#fff', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path fillRule="evenodd" d="m256 48 240 416H16Z" />
    </svg>
  );
};
