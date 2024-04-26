import React from 'react';
export const LogoMarkdown = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M475 64H37C16.58 64 0 81.38 0 102.77v306.42C0 430.59 16.58 448 37 448h438c20.38 0 37-17.41 37-38.81V102.77C512 81.38 495.42 64 475 64ZM288 368h-64V256l-48 64-48-64v112H64V144h64l48 80 48-80h64Zm96 0-80-112h48.05L352 144h64v112h48Z" />
    </svg>
  );
};
