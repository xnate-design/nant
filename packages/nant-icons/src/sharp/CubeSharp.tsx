import React from 'react';
export const CubeSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M48 170v196.92L240 480V284L48 170zm224 310 192-113.08V170L272 284Zm176-122.36ZM448 144 256 32 64 144l192 112 192-112z" />
    </svg>
  );
};
