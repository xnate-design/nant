import React from 'react';
export const DesktopSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M480 48H32a16 16 0 0 0-16 16v320a16 16 0 0 0 16 16h168v32h-72v32h256v-32h-72v-32h168a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16Zm-20 36v216H52V84ZM240.13 354.08a16 16 0 1 1 13.79 13.79 16 16 0 0 1-13.79-13.79Z" />
    </svg>
  );
};
