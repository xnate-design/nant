import React from 'react';
export const OpenSharp = ({ width = '410', height = '404', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path d="m201.37 288 176-176H48v352h352V134.63l-176 176L201.37 288z" />

      <path d="M320 48v32h89.37l-32 32L400 134.63l32-32V192h32V48H320z" />
    </svg>
  );
};
