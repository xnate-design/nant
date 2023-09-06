import cn from 'clsx';
import '@nant/nant-icons/dist/css/nant-webfont.css';

interface NantIconProps {
  name: string;
  width?: string;
  height?: string;
}

const NantIcon = (props: NantIconProps) => {
  const { name = '', width = '', height = '' } = props;
  const clsx = cn('relative', 'inline-flex', 'justify-center', 'align-items-center', name, 'nant-icon--set', {});
  return <i className={clsx} {...props} />;
};

export default NantIcon;
