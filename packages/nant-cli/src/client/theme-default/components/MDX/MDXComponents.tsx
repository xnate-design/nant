import InlineCode from './InlineCode';
import CodeBlock from './CodeBlock';
import { H1 } from './Heading';

export const MDXComponents = {
  pre: CodeBlock,
  code: InlineCode,
  h1: H1,
};
