import InlineCode from './InlineCode';
import CodeBlock from './CodeBlock';
import { H1, H2, H3, H4 } from './Heading';
import { Intro } from './Intro';
import WrapperMdx from './Wrapper';
import ConsoleBlock from './ConsoleBlock';
import ExpandableCallout from './ExpandableCallout';

const P = (p: JSX.IntrinsicElements['p']) => <p className="whitespace-pre-wrap leading-7 my-4" {...p} />;
const Strong = (strong: JSX.IntrinsicElements['strong']) => <strong className="font-bold" {...strong} />;

const OL = (p: JSX.IntrinsicElements['ol']) => <ol className="ml-6 my-3 list-decimal" {...p} />;
const LI = (p: JSX.IntrinsicElements['li']) => <li className="leading-relaxed mb-1" {...p} />;
const UL = (p: JSX.IntrinsicElements['ul']) => <ul className="ml-6 my-3 list-disc" {...p} />;
const Divider = () => <hr className="my-6 block border-b border-t-0 border-border dark:border-border-dark" />;
const Blockquote = ({ children, ...props }: JSX.IntrinsicElements['blockquote']) => {
  return (
    <blockquote
      className="py-4 px-8 my-8 bg-highlight dark:bg-highlight-dark bg-opacity-50 rounded-2xl leading-6 flex relative"
      {...props}
    >
      <span className="block relative">{children}</span>
    </blockquote>
  );
};

const Note = ({ children }: { children: React.ReactNode }) => (
  <ExpandableCallout type="note">{children}</ExpandableCallout>
);

function Image(props: any) {
  return <img className="max-w-[calc(min(700px,100%))]" {...props} />;
}

export const MDXComponents = {
  wrapper: WrapperMdx,
  blockquote: Blockquote,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  strong: Strong,
  ol: OL,
  li: LI,
  ul: UL,
  pre: CodeBlock,
  code: InlineCode,
  hr: Divider,
  img: Image,
  Intro,
  ConsoleBlock,
  Note,
};
