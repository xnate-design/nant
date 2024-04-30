import React from 'react';
export const FunnelSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="m0 48 192 240v128l128 48V288L512 48H0z" />
    </svg>
  );
};
