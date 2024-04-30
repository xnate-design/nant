import React from 'react';
export const FilterCircleSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48Zm48 304h-96v-32h96Zm48-64H160v-32h192Zm32-64H128v-32h256Z" />
    </svg>
  );
};
