import React from 'react';
export const LocateSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path
        d="M256 96V56m0 400v-40m0-304a144 144 0 1 0 144 144 144 144 0 0 0-144-144Zm160 144h40m-400 0h40"
        fill="none"
        stroke={fill}
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth="48"
      />
    </svg>
  );
};
