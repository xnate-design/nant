import React from 'react';
export const EllipsisHorizontalSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <circle cx="256" cy="256" r="48" />

      <circle cx="416" cy="256" r="48" />

      <circle cx="96" cy="256" r="48" />
    </svg>
  );
};
