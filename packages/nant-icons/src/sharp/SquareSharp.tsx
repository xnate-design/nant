import React from 'react';
export const SquareSharp = ({ width = '410', height = '404', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path d="M48 48h416v416H48z" />
    </svg>
  );
};
