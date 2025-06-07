
import { forwardRef, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import { ResumePreview } from '@/components/ResumePreview';
import { exportToPDF } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';

interface PrintPreviewProps {
  markdown: string;
  leftColumn?: string;
  rightColumn?: string;
  firstPage?: string;
  secondPage?: string;
  template: string;
  isTwoColumn?: boolean;
  isTwoPage?: boolean;
}

export const PrintPreview = ({ 
  markdown, 
  leftColumn = '', 
  rightColumn = '', 
  firstPage = '', 
  secondPage = '', 
  template, 
  isTwoColumn = false, 
  isTwoPage = false 
}: PrintPreviewProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    
    setIsExporting(true);
    try {
      await exportToPDF(previewRef.current, 'resume.pdf');
      toast({
        title: "PDF Downloaded!",
        description: "Your resume has been saved as a PDF file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

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
          <DialogTitle className="flex items-center justify-between">
            <span>Print Preview</span>
            <Button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Generating...' : 'Download PDF'}
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="print-preview-container">
          <ResumePreview
            ref={previewRef}
            markdown={markdown}
            leftColumn={leftColumn}
            rightColumn={rightColumn}
            firstPage={firstPage}
            secondPage={secondPage}
            template={template}
            isTwoColumn={isTwoColumn}
            isTwoPage={isTwoPage}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
