import React from 'react';
export const ChevronExpandSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path
        d="m136 208 120-104 120 104m-240 96 120 104 120-104"
        fill="none"
        stroke={fill}
        strokeWidth="48"
        strokeLinecap="square"
      />
    </svg>
  );
};
