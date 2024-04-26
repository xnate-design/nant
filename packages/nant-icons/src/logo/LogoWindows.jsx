import React from 'react';
export const LogoWindows = ({ width = '410', height = '404', fill = 'url(#b)', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path d="M480 265H232v179l248 36V265Zm-264 0H32v150l184 26.7V265ZM480 32 232 67.4V249h248V32ZM216 69.7 32 96v153h184V69.7Z" />
    </svg>
  );
};
