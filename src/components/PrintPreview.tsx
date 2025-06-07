
import { forwardRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { ResumePreview } from '@/components/ResumePreview';

interface PrintPreviewProps {
  markdown: string;
  leftColumn?: string;
  rightColumn?: string;
  template: string;
  isTwoColumn?: boolean;
}

export const PrintPreview = ({ markdown, leftColumn = '', rightColumn = '', template, isTwoColumn = false }: PrintPreviewProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Print Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Print Preview</DialogTitle>
        </DialogHeader>
        <div className="print-preview-container">
          <ResumePreview
            markdown={markdown}
            leftColumn={leftColumn}
            rightColumn={rightColumn}
            template={template}
            isTwoColumn={isTwoColumn}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
