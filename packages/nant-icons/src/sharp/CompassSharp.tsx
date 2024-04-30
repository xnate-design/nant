import React from 'react';
export const CompassSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <circle cx="256" cy="256" r="24" />

      <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48Zm48 256-160 64 64-160 160-64Z" />
    </svg>
  );
};
