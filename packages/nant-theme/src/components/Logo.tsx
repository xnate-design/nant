import NantLogo from '/nant.png';

export function Logo({ className = '' }) {
  return <img src={NantLogo} className={className} alt="React logo" />;
}
