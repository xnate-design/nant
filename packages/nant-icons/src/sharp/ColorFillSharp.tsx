import React from 'react';
export const ColorFillSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M416 320s-64 48-64 99.84c0 33.28 28.67 60.16 64 60.16s64-27 64-60.16C480 368 416 320 416 320ZM144 32l-76 76 70 70L32 280l176 184 152.8-148.3L416 304Zm24 116-39.6-41 15.88-15.89L184 132Z" />
    </svg>
  );
};
