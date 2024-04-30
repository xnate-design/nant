import React from 'react';
export const PersonSharp = ({ width = '410', height = '404', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path d="M256 256a112 112 0 1 0-112-112 112 112 0 0 0 112 112Zm0 32c-69.42 0-208 42.88-208 128v64h416v-64c0-85.12-138.58-128-208-128Z" />
    </svg>
  );
};
