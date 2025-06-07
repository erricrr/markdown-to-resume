
import { forwardRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Printer } from 'lucide-react';
import { ResumePreview } from '@/components/ResumePreview';

interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  leftColumn?: string;
  rightColumn?: string;
  template: string;
  isTwoColumn?: boolean;
  onPrint: () => void;
}

export const PrintPreview = forwardRef<HTMLDivElement, PrintPreviewProps>(
  ({ isOpen, onClose, markdown, leftColumn = '', rightColumn = '', template, isTwoColumn = false, onPrint }, ref) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
          <DialogHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-xl font-semibold">Print Preview</DialogTitle>
            <div className="flex items-center gap-2">
              <Button onClick={onPrint} className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto bg-gray-100 p-4 rounded-lg">
            <div className="print-preview-container">
              <ResumePreview
                ref={ref}
                markdown={isTwoColumn ? '' : markdown}
                leftColumn={isTwoColumn ? leftColumn : ''}
                rightColumn={isTwoColumn ? rightColumn : ''}
                template={template}
                isTwoColumn={isTwoColumn}
              />
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground text-center pt-2">
            This preview shows how your resume will appear when printed
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

PrintPreview.displayName = 'PrintPreview';
