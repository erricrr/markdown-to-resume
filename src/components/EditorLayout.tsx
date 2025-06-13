import { ReactNode } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface EditorLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  leftPanelSize: number;
  onPanelResize: (sizes: number[]) => void;
  storageKey: string;
}

export const EditorLayout = ({
  leftPanel,
  rightPanel,
  leftPanelSize,
  onPanelResize,
  storageKey
}: EditorLayoutProps) => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  if (isSmallScreen) {
    return (
      <div className="flex flex-col gap-6">
        <div className="w-full h-[400px] max-h-[400px]">
          {leftPanel}
        </div>
        <div className="w-full h-[500px] max-h-[500px]">
          {rightPanel}
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-auto lg:h-[calc(100vh-200px)] max-h-[calc(100vh-200px)] w-full"
      onLayout={onPanelResize}
    >
      <ResizablePanel defaultSize={leftPanelSize} minSize={25} maxSize={60}>
        {leftPanel}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60} minSize={40}>
        {rightPanel}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
