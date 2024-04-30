import React from 'react';
export const HourglassSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M416 32H96v112l108 112L96 368v112h320V368L308 256l108-112ZM272 224v112l91 96H148l92-96V224l-80-80h192Z" />
    </svg>
  );
};
