import React from 'react';
export const LogoDropbox = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="m256.32 126.24-120.16 78.25 120.16 78.24L136.16 361 16 282.08l120.16-78.24L16 126.24 136.16 48Zm-120.8 259.52 120.16-78.25 120.16 78.25L255.68 464Zm120.8-103.68 120.16-78.24-120.16-77.6L375.84 48 496 126.24l-120.16 78.25L496 282.73 375.84 361Z" />
    </svg>
  );
};
