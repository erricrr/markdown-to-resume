import { useState } from 'react';

export const usePanelManagement = (storageKey: string) => {
  const [leftPanelSize, setLeftPanelSize] = useState(() => {
    const savedSize = localStorage.getItem(`${storageKey}-left-panel-size`);
    return savedSize ? parseInt(savedSize, 10) : 50;
  });

  const handlePanelResize = (sizes: number[]) => {
    const newLeftPanelSize = sizes[0];
    setLeftPanelSize(newLeftPanelSize);
    localStorage.setItem(`${storageKey}-left-panel-size`, newLeftPanelSize.toString());
  };

  return {
    leftPanelSize,
    handlePanelResize
  };
};
