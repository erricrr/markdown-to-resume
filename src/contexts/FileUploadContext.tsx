import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface FileUploadContextType {
  uploadedFileUrl: string;
  uploadedFileName: string;
  uploadedFileSize: number;
  setFileData: (fileUrl: string, fileName: string, fileSize: number) => void;
  clearFileData: () => void;
}

const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

interface FileUploadProviderProps {
  children: ReactNode;
}

export const FileUploadProvider: React.FC<FileUploadProviderProps> = ({ children }) => {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<number>(0);

  const setFileData = useCallback((fileUrl: string, fileName: string, fileSize: number) => {
    setUploadedFileUrl(fileUrl);
    setUploadedFileName(fileName);
    setUploadedFileSize(fileSize);
  }, []);

  const clearFileData = useCallback(() => {
    // Revoke the blob URL to free up memory
    if (uploadedFileUrl && uploadedFileUrl.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedFileUrl);
    }
    setUploadedFileUrl('');
    setUploadedFileName('');
    setUploadedFileSize(0);
  }, [uploadedFileUrl]);

  const contextValue: FileUploadContextType = {
    uploadedFileUrl,
    uploadedFileName,
    uploadedFileSize,
    setFileData,
    clearFileData,
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
