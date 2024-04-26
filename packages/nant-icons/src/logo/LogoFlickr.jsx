import React from 'react';
export const LogoFlickr = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M256 32C132.8 32 32 132.8 32 256s100.8 224 224 224 224-100.8 224-224S379.2 32 256 32Zm-82.16 280A56 56 0 1 1 228 257.84 56 56 0 0 1 173.84 312Zm168 0A56 56 0 1 1 396 257.84 56 56 0 0 1 341.84 312Z" />
    </svg>
  );
};
