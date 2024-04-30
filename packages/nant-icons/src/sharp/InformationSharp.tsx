import React from 'react';
export const InformationSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path
        d="M196 220h64v172m-73 4h138"
        fill="none"
        stroke={fill}
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="40"
      />

      <path d="M256 160a32 32 0 1 1 32-32 32 32 0 0 1-32 32Z" />
    </svg>
  );
};
