import clsx from 'clsx';
import { Highlight } from 'prism-react-renderer';
import rangeParser from 'parse-numeric-range';
// import theme from '../../../../common/theme/codeTheme';
import React from 'react';
import themes from '../../../theme';
interface CodeBlockProps {
  children: React.ReactNode & {
    props: {
      className?: string;
      children?: string;
      meta?: string;
    };
  };
  className?: string;
  noMargin?: boolean;
  noShadow?: boolean;
  onLineHover?: (lineNumber: number | null) => void;
}

const calculateLinesToHighlight = (raw: string) => {
  const lineNumbers = rangeParser(raw);
  if (lineNumbers) {
    return (index: number) => lineNumbers.includes(index + 1);
  } else {
    return () => false;
  }
};

const copyToClipboard = (str: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(str).then(
      function () {
        console.log('Copying to clipboard was successful!');
      },
      function (err) {
        console.error('Could not copy text: ', err);
      },
    );
  }
};

interface childPropsType {
  props?: any;
}

const CodeBlock = (props: CodeBlockProps) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const childProps: childPropsType = props.children || {};
  const { className = '', children = '', meta = '' } = childProps.props || {};

  const showLineNumbers = meta.match(/showLineNumber/g);
  const lightString = meta.match(/\{([^}]+)\}/g);
  const light = lightString?.[0]?.slice(1, -1);

  const code = children.trim();
  const language = className.replace(/language-/, '');
  const highlights = calculateLinesToHighlight(light ?? '');

  const blockClass = clsx('bg-alt sandpack dark:bg-alt-dark rounded-2xl overflow-x-auto my-8');
  const wrapperClass = clsx('w-full');
  const lineClass = clsx('ml-2 flex', showLineNumbers ? 'ml-2' : 'ml-4');
  return (
    <div className={blockClass}>
      <div className={wrapperClass}>
        <Highlight code={code} language={language} theme={themes}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre className=" text-[15px]">
              <code className="leading-6 py-8 font-maple block text-sm">
                {tokens.map((line, i) => (
                  <div
                    key={i}
                    {...getLineProps({ line, key: i })}
                    className={lineClass}
                    style={{
                      background: highlights(i) ? '#00f5c426' : 'transparent',
                      display: 'block',
                      lineHeight: '1.375',
                    }}
                  >
                    {showLineNumbers ? <span className="inline-block text-sm w-6 text-right mr-4">{i + 1}</span> : ''}
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
};

export default CodeBlock;
