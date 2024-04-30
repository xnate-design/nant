import React from 'react';
export const EllipsisVerticalSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <circle cx="256" cy="256" r="48" />

      <circle cx="256" cy="416" r="48" />

      <circle cx="256" cy="96" r="48" />
    </svg>
  );
};
