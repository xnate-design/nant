import React from 'react';
export const MedalSharp = ({ width = '410', height = '404', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path d="M80 32 16 160h289.11l80.22-128H80z" />

      <path d="M496 144 424 32 298 231.08a128 128 0 0 0-84 0L189.53 192H43.82l86.66 134.89a128 128 0 1 0 251 0ZM256 422a70 70 0 1 1 70-70 70.08 70.08 0 0 1-70 70Z" />

      <circle cx="256" cy="352" r="32" />
    </svg>
  );
};
