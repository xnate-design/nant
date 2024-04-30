import React from 'react';
export const TriangleSharp = ({ width = '410', height = '404', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path d="M256 32 20 464h472L256 32z" />
    </svg>
  );
};
