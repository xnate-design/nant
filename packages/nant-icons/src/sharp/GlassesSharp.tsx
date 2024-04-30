import React from 'react';
export const GlassesSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M496 176H16v64h21.24l12.44 112h171.87L240 241.32V240a16 16 0 0 1 32 0v1.32L290.45 352h171.87l12.44-112H496Z" />
    </svg>
  );
};
