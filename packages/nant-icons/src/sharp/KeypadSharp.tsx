import React from 'react';
export const KeypadSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <rect x="80" y="16" width="96" height="96" rx="8" ry="8" />

      <rect x="208" y="16" width="96" height="96" rx="8" ry="8" />

      <rect x="336" y="16" width="96" height="96" rx="8" ry="8" />

      <rect x="80" y="144" width="96" height="96" rx="8" ry="8" />

      <rect x="208" y="144" width="96" height="96" rx="8" ry="8" />

      <rect x="336" y="144" width="96" height="96" rx="8" ry="8" />

      <rect x="80" y="272" width="96" height="96" rx="8" ry="8" />

      <rect x="208" y="272" width="96" height="96" rx="8" ry="8" />

      <rect x="208" y="400" width="96" height="96" rx="8" ry="8" />

      <rect x="336" y="272" width="96" height="96" rx="8" ry="8" />
    </svg>
  );
};
