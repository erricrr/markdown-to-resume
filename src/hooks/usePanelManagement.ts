import { useState, useEffect } from 'react';

export const usePanelManagement = (storageKey: string) => {
  const [leftPanelSize, setLeftPanelSize] = useState(() => {
    const savedSize = localStorage.getItem(`${storageKey}-left-panel-size`);
    return savedSize ? parseInt(savedSize, 10) : 50;
  });

  const [shouldUseCompactUI, setShouldUseCompactUI] = useState(false);

  // Update compact UI state whenever left panel size changes
  useEffect(() => {
    // When panel size is less than 35%, switch to compact UI
    setShouldUseCompactUI(leftPanelSize < 35);
  }, [leftPanelSize]);

  const handlePanelResize = (sizes: number[]) => {
    const newLeftPanelSize = sizes[0];
    setLeftPanelSize(newLeftPanelSize);
    localStorage.setItem(`${storageKey}-left-panel-size`, newLeftPanelSize.toString());

    // Update compact UI state
    setShouldUseCompactUI(newLeftPanelSize < 35);
  };

  return {
    leftPanelSize,
    handlePanelResize,
    shouldUseCompactUI
  };
};
