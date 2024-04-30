import React from 'react';
export const FlashlightSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="m330 16-42.68 42.7L453.3 224.68 496 182 330 16z" />

      <ellipse cx="224.68" cy="287.3" rx="20.03" ry="19.96" fill="none" />

      <path d="M429.21 243.85 268 82.59 249.65 168 16 402l94 94 234.23-233.8Zm-189 56.07a20 20 0 1 1 0-25.25 20 20 0 0 1-.02 25.25Z" />
    </svg>
  );
};
