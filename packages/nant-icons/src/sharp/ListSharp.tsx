import React from 'react';
export const ListSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path
        d="M144 144h320M144 256h320M144 368h320"
        fill="none"
        stroke={fill}
        strokeLinejoin="round"
        strokeWidth="48"
      />

      <path
        d="M64 128h32v32H64zm0 112h32v32H64zm0 112h32v32H64z"
        fill="none"
        stroke={fill}
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  );
};
