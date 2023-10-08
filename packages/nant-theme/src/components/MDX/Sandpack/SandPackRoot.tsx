import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackCodeViewer,
  SandpackPreview,
  SandpackTranspiledCode,
  SandpackFileExplorer,
  SandpackConsole,
  SandpackFile,
} from '@codesandbox/sandpack-react';
import { CustomTheme } from './Themes';

import { PresetWrapper } from './CodeWrapper';

export default function SandpackRoot(props: { files: Record<string, SandpackFile> }) {
  const providedFiles = Object.keys(props.files);

  return (
    <div className="sandpack w-full my-8">
      <SandpackProvider
        theme={CustomTheme}
        template="react"
        options={{
          initMode: 'user-visible',
          initModeObserverOptions: { rootMargin: '1400px 0px' },
          bundlerURL: 'https://1e4ad8f7.sandpack-bundler-4bw.pages.dev',
        }}
        {...props}
      >
        <PresetWrapper providedFiles={providedFiles} />
      </SandpackProvider>
    </div>
  );
}
