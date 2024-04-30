import React from 'react';
export const FlashSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M432 208H288l32-192L80 304h144l-32 192Z" />
    </svg>
  );
};
