import React from 'react';
export const LogoTwitch = ({ fill = '#fff', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path d="m80 32-32 80v304h96v64h64l64-64h80l112-112V32Zm336 256-64 64h-96l-64 64v-64h-80V80h304Z" />

      <path d="M320 143h48v129h-48zm-112 0h48v129h-48z" />
    </svg>
  );
};
