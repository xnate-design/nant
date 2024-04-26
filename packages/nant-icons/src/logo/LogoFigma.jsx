import React from 'react';
export const LogoFigma = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M336 176a80 80 0 0 0 0-160H176a80 80 0 0 0 0 160 80 80 0 0 0 0 160 80 80 0 1 0 80 80V176Z" />

      <circle cx="336" cy="256" r="80" />
    </svg>
  );
};
