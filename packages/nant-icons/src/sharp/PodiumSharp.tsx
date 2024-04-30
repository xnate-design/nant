import React from 'react';
export const PodiumSharp = ({ width = '410', height = '404', ...other }) => {
  return (
    <svg width="1.33em" height="1.33em" fill="currentColor" viewBox="0 0 512 512" {...other}>
      <path d="M160 32h192v448H160zm224 160h112v288H384zM16 128h112v352H16z" />
    </svg>
  );
};
