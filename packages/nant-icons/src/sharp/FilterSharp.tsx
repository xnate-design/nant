import React from 'react';
export const FilterSharp = ({ fill = 'currentColor', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill={fill} viewBox="0 0 512 512" {...other}>
      <path d="M16 120h480v48H16zm80 112h320v48H96zm96 112h128v48H192z" />
    </svg>
  );
};
