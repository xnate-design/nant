import React from 'react';
export const ChevronForwardCircleSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48Zm-40 326.63L193.37 352l96-96-96-96L216 137.37 334.63 256Z" />
    </svg>
  );
};
