import React from 'react';
export const CodeWorkingSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <circle cx="256" cy="256" r="26" stroke={fill} strokeLinecap="square" strokeMiterlimit="10" strokeWidth="10" />

      <circle cx="346" cy="256" r="26" stroke={fill} strokeLinecap="square" strokeMiterlimit="10" strokeWidth="10" />

      <circle cx="166" cy="256" r="26" stroke={fill} strokeLinecap="square" strokeMiterlimit="10" strokeWidth="10" />

      <path
        d="M160 368 32 256l128-112m192 224 128-112-128-112"
        fill="none"
        stroke={fill}
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="42"
      />
    </svg>
  );
};
