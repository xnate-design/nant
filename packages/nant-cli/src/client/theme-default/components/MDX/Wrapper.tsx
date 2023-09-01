export interface WrapperMdxProps {
  children?: React.ReactElement;
}

const WrapperMdx = (props: WrapperMdxProps) => {
  console.log(props);

  const { children = '' } = props;

  return <div className="kk">{children}</div>;
};

export default WrapperMdx;
