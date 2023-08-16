import siteData from '@siteData';

export const initData = () => {
  console.log(siteData, 'siteData');

  return `${siteData.title}`;
};
