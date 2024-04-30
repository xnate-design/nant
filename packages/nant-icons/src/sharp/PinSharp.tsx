import React from 'react';
export const PinSharp = ({ width = '410', height = '404', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path d="M339 99a83 83 0 1 0-102 80.8V464l19 32 19-32V179.8A83.28 83.28 0 0 0 339 99Zm-59-6a21 21 0 1 1 21-21 21 21 0 0 1-21 21Z" />
    </svg>
  );
};
