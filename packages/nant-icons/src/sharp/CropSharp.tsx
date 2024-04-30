import React from 'react';
export const CropSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M166 346V32h-44v90H32v44h90v224h224v90h44v-90h90v-44H166z" />

      <path d="M346 320h44V122H192v44h154v154z" />
    </svg>
  );
};
