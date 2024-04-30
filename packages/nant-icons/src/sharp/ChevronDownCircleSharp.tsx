import React from 'react';
export const ChevronDownCircleSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M256 464c114.87 0 208-93.13 208-208S370.87 48 256 48 48 141.13 48 256s93.13 208 208 208Zm-96-270.63 96 96 96-96L374.63 216 256 334.63 137.37 216Z" />
    </svg>
  );
};
