import { memo } from 'react';
import {
  useSandpack,
  useActiveCode,
  SandpackCodeEditor,
  SandpackCodeViewer,
  // SandpackReactDevTools,
  SandpackLayout,
  SandpackPreview,
  UnstyledOpenInCodeSandboxButton,
} from '@codesandbox/sandpack-react';

import { ShareOutline } from '@nant-design/nant-icons/dist/react/ShareOutline';

interface IPresetProps {
  providedFiles: string[];
}

export const PresetWrapper = memo(function PresetWrapper({ providedFiles }: IPresetProps) {
  const { sandpack } = useSandpack();
  const { code } = useActiveCode();
  const { activeFile } = sandpack;

  return <CodeWrapper providedFiles={providedFiles} />;
});

export const OpenInCodeSandboxButton = () => {
  return (
    <UnstyledOpenInCodeSandboxButton
      className="text-sm text-primary cursor-pointer dark:text-primary-dark inline-flex gap-1 items-center hover:text-link duration-100 ease-in transition mx-1 ml-2 md:ml-1"
      title="Open in CodeSandbox"
    >
      <ShareOutline />
      <span className="hidden md:block">Fork</span>
    </UnstyledOpenInCodeSandboxButton>
  );
};

const CodeWrapper = memo(function CodeWrapper({ providedFiles }: { providedFiles: Array<string> }) {
  const { sandpack } = useSandpack();
  // const { files, activeFile } = sandpack;

  return (
    <div className="bg-wash dark:bg-alt-dark shadow-lg border-2 border-border dark:border-border-dark rounded-lg overflow-hidden">
      <SandpackLayout>
        <div className="flex-1 max-h-[500px] min-h-[450px] flex flex-col">
          <div className="flex justify-between items-center h-10 bg-border dark:bg-border-dark px-4">
            <div className=""></div>

            <OpenInCodeSandboxButton />
          </div>
          <div className="overflow-y-auto h-full flex-1">
            <SandpackCodeViewer showTabs={false} />
          </div>
        </div>
        <div className="lg:w-82 w-full max-h-[500px] flex flex-col bg-alt dark:bg-alt-dark">
          <div className="overflow-y-auto h-full p-2 rounded flex-1">
            <SandpackPreview showRefreshButton={false} showOpenInCodeSandbox={false} />
          </div>
          {/* <div className="h-10 "></div> */}
        </div>
      </SandpackLayout>
    </div>
  );
});
