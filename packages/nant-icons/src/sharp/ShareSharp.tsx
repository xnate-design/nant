import React from 'react';
export const ShareSharp = ({ width = '410', height = '404', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path d="M272 176v161h-32V176H92a12 12 0 0 0-12 12v280a12 12 0 0 0 12 12h328a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12Zm0-83.37 64 64L358.63 134 256 31.37 153.37 134 176 156.63l64-64V176h32V92.63z" />
    </svg>
  );
};
