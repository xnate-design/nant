import React from 'react';
export const GridSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M240 240H32V32h208Zm240 0H272V32h208ZM240 480H32V272h208Zm240 0H272V272h208Z" />
    </svg>
  );
};
