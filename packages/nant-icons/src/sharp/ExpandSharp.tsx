import React from 'react';
export const ExpandSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path
        d="M432 320v112H320m101.8-10.23L304 304M80 192V80h112M90.2 90.23 208 208M320 80h112v112M421.77 90.2 304 208M192 432H80V320m10.23 101.8L208 304"
        fill="none"
        stroke={fill}
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
    </svg>
  );
};
