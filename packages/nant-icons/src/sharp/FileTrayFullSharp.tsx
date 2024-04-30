import React from 'react';
export const FileTrayFullSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M128 128h256v38H128zm-16 64h288v38H112z" />

      <path d="M448 64H64L32 256v192h448V256Zm-12 192H320a64 64 0 0 1-128 0H76l22-150h316Z" />
    </svg>
  );
};
