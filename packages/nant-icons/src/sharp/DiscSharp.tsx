import React from 'react';
export const DiscSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <circle cx="256" cy="256" r="32" />

      <path d="M414.39 97.61A224 224 0 1 0 97.61 414.39 224 224 0 1 0 414.39 97.61ZM256 336a80 80 0 1 1 80-80 80.09 80.09 0 0 1-80 80Z" />
    </svg>
  );
};
