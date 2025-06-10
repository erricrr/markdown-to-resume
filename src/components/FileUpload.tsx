import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, File as FileIcon, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUploaded: (fileUrl: string, fileName: string) => void;
}

export const FileUpload = ({ onFileUploaded }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);

    // Create a local URL for the file (will be temporary until page reload)
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    onFileUploaded(url, file.name);
    setIsUploading(false);

    toast({
      title: 'File uploaded',
      description: `${file.name} is ready to use in your resume`,
    });
  };

  const handleRemoveFile = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setUploadedFile(null);
    setFileUrl(null);
    onFileUploaded('', '');

    toast({
      title: 'File removed',
      description: 'The uploaded file has been removed',
    });
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {!uploadedFile ? (
        <div className="flex items-center gap-2">
          <Input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            disabled={isUploading}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading}
            className="flex items-center gap-1 text-xs"
          >
            <Upload className="h-3 w-3" />
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
          <span className="text-xs text-muted-foreground">Max 5MB</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-muted/30 rounded-md p-2">
          <FileIcon className="h-4 w-4 text-primary" />
          <div className="flex-1 truncate text-xs">{uploadedFile.name}</div>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            {(uploadedFile.size / 1024).toFixed(0)} KB
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            className="h-6 w-6 p-0 rounded-full"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};
