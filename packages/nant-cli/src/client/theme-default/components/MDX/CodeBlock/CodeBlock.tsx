import cn from 'clsx';
import { Highlight, themes } from 'prism-react-renderer';
import rangeParser from 'parse-numeric-range';
// import theme from '../../../../common/theme/codeTheme';
import React from 'react';
import NantIcon from '../../Icons';
import { AccessibilitySharpSvg } from '@nant/nant-icons/dist/react/AccessibilitySharpSvg';

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

export const AddCircle = () => (
  // <svg viewBox="0 0 20 20" width="1.33em" height="1.33em" className={`nant-icon`}>
  //   <path
  //     d="M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48Zm80,224H272v64a16,16,0,0,1-32,0V272H176a16,16,0,0,1,0-32h64V176a16,16,0,0,1,32,0v64h64a16,16,0,0,1,0,32Z"
  //     fillRule="evenodd"
  //   />
  // </svg>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="1.33em" height="1.33em" className="">
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z" />
  </svg>
);

const CodeBlock = (props: CodeBlockProps) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const childProps = props.children || {};
  const { className = '', children = '', live = false, file = '', light = '' } = childProps.props || {};
  const code = children.trim();
  const language = className.replace(/language-/, '');
  const highlights = calculateLinesToHighlight(light || '');
  return (
    <div className="xnate-site-md__code">
      <AccessibilitySharpSvg />
      <div className="xnate-site-md__code-tab">
        <div className="xnate-site-md__code-tab-left">{file && `${file}`}</div>
        <div className="xnate-site-md__code-tab-right">
          <span
            className="xnate-site-md__code-tab-icon"
            onClick={() => {
              copyToClipboard(code);
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 1000);
            }}
          >
            {isCopied ? '🎉 Copied!' : ''}
          </span>
        </div>
      </div>
      <div className="xnate-site-md__code-box">
        <Highlight code={code} language={language} theme={themes.nightOwl}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className="xnate-site-md__code-box-pre font-source-code">
              {tokens.map((line, i) => (
                <div
                  key={i}
                  {...getLineProps({ line, key: i })}
                  style={{
                    background: highlights(i) ? '#00f5c426' : 'transparent',
                    display: 'block',
                    lineHeight: '1.375',
                  }}
                >
                  <span className="xnate-site-md__code-box-number">{i + 1}</span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
};

export default CodeBlock;
