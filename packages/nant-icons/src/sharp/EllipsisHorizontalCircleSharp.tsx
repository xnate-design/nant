import React from 'react';
export const EllipsisHorizontalCircleSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48Zm-90 234a26 26 0 1 1 26-26 26 26 0 0 1-26 26Zm90 0a26 26 0 1 1 26-26 26 26 0 0 1-26 26Zm90 0a26 26 0 1 1 26-26 26 26 0 0 1-26 26Z" />
    </svg>
  );
};
