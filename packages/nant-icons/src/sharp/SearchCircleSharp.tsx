import React from 'react';
export const SearchCircleSharp = ({ width = '410', height = '404', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path d="M256 64C150.13 64 64 150.13 64 256s86.13 192 192 192 192-86.13 192-192S361.87 64 256 64Zm80 294.63-54.15-54.15a88.08 88.08 0 1 1 22.63-22.63L358.63 336Z" />

      <circle cx="232" cy="232" r="56" />
    </svg>
  );
};
