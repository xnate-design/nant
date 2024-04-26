import React from 'react';
export const LogoHackernews = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M32 32v448h448V32Zm249.67 250.83v84H235v-84l-77-140h55l46.32 97.54 44.33-97.54h52.73Z" />
    </svg>
  );
};
