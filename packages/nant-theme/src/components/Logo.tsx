import siteDate from '@siteData';

const { themeConfig = {} } = siteDate;
export function Logo({ className = '' }) {
  return <img src={themeConfig.logo} className={className} alt="React logo" />;
}
