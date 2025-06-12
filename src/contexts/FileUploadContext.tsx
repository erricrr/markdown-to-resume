import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface FileUploadContextType {
  uploadedFileUrl: string;
  uploadedFileName: string;
  uploadedFileSize: number;
  refreshTimestamp: number; // Track when images change
  setFileData: (fileUrl: string, fileName: string, fileSize: number) => void;
  clearFileData: () => void;
  triggerRefresh: () => void; // Force refresh preview
}

const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

interface FileUploadProviderProps {
  children: ReactNode;
}

export const FileUploadProvider: React.FC<FileUploadProviderProps> = ({ children }) => {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<number>(0);
  const [refreshTimestamp, setRefreshTimestamp] = useState<number>(Date.now());

  const setFileData = useCallback((fileUrl: string, fileName: string, fileSize: number) => {
    setUploadedFileUrl(fileUrl);
    setUploadedFileName(fileName);
    setUploadedFileSize(fileSize);
    setRefreshTimestamp(Date.now()); // Update timestamp when file changes
  }, []);

  const clearFileData = useCallback(() => {
    // Revoke the blob URL to free up memory
    if (uploadedFileUrl && uploadedFileUrl.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedFileUrl);
    }
    setUploadedFileUrl('');
    setUploadedFileName('');
    setUploadedFileSize(0);
    setRefreshTimestamp(Date.now()); // Update timestamp when file is cleared
  }, [uploadedFileUrl]);

  // Method to force a refresh without changing file data
  const triggerRefresh = useCallback(() => {
    setRefreshTimestamp(Date.now());
  }, []);

  const contextValue: FileUploadContextType = {
    uploadedFileUrl,
    uploadedFileName,
    uploadedFileSize,
    refreshTimestamp,
    setFileData,
    clearFileData,
    triggerRefresh,
  };

  return (
    <FileUploadContext.Provider value={contextValue}>
      {children}
    </FileUploadContext.Provider>
  );
};

export const useFileUpload = (): FileUploadContextType => {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error('useFileUpload must be used within a FileUploadProvider');
  }
  return context;
};
