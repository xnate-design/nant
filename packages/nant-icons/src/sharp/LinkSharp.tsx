import React from 'react';
export const LinkSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path
        d="M200.66 352H144a96 96 0 0 1 0-192h55.41m113.18 0H368a96 96 0 0 1 0 192h-56.66m-142.27-96h175.86"
        fill="none"
        stroke={fill}
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth="48"
      />
    </svg>
  );
};
