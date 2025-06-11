import React from 'react';
import { useFileUpload } from '@/contexts/FileUploadContext';
import { Badge } from '@/components/ui/badge';
import { FileIcon, CheckCircle, AlertCircle } from 'lucide-react';

export const SharedFileUploadDemo: React.FC = () => {
  const { uploadedFileUrl, uploadedFileName, uploadedFileSize } = useFileUpload();

  if (!uploadedFileName) {
    return (
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
        <AlertCircle className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-600">No file uploaded yet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <FileIcon className="h-4 w-4 text-green-600" />
      <span className="text-sm text-green-700 flex-1 truncate">{uploadedFileName}</span>
      <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
        {uploadedFileSize > 0 ? `${(uploadedFileSize / 1024).toFixed(0)} KB` : 'File'}
      </Badge>
      <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
        Shared
      </Badge>
    </div>
  );
};
