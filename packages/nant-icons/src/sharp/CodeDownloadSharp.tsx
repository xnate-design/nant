import React from 'react';
export const CodeDownloadSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path
        d="M160 368 32 256l128-112m192 224 128-112-128-112M192 288.1l64 63.9 64-63.9M256 160v176.03"
        fill="none"
        stroke={fill}
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="42"
      />
    </svg>
  );
};
