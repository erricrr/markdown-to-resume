import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Printer } from 'lucide-react';
import { exportToPDF, printToPDF } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';

interface PrintPreviewProps {
  markdown: string;
  leftColumn?: string;
  rightColumn?: string;
  header?: string;
  summary?: string;
  firstPage?: string;
  secondPage?: string;
  template: string;
  isTwoColumn?: boolean;
  isTwoPage?: boolean;
  paperSize?: 'A4' | 'US_LETTER';
  uploadedFileUrl?: string;
  uploadedFileName?: string;
  showPreviewButton?: boolean;
}

export const PrintPreview = ({
  markdown,
  leftColumn = '',
  rightColumn = '',
  header = '',
  summary = '',
  firstPage = '',
  secondPage = '',
  template,
  isTwoColumn = false,
  isTwoPage = false,
  paperSize = 'A4',
  uploadedFileUrl = '',
  uploadedFileName = '',
  showPreviewButton = true
}: PrintPreviewProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handlePreview = async () => {
    setIsExporting(true);
    try {
      console.log(`Opening preview with paper size: ${paperSize}`);
      await exportToPDF({
        markdown,
        leftColumn,
        rightColumn,
        header,
        summary,
        firstPage,
        secondPage,
        template,
        isTwoColumn,
        isTwoPage,
        paperSize,
        uploadedFileUrl,
        uploadedFileName
      });
      toast({ title: 'Preview Ready', description: 'Your resume preview has opened in a new tab. Use Ctrl+P (or Cmd+P) to print.' });
    } catch (error) {
      console.error('Preview error:', error);
      toast({ title: 'Preview Failed', description: 'Could not open preview. Please try again.', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDirectPrint = async () => {
    setIsExporting(true);
    try {
      await printToPDF({
        markdown,
        leftColumn,
        rightColumn,
        header,
        summary,
        firstPage,
        secondPage,
        template,
        isTwoColumn,
        isTwoPage,
        paperSize,
        uploadedFileUrl,
        uploadedFileName
      });
    } catch (error) {
      console.error('Direct print error:', error);
      toast({ title: 'Print Failed', description: 'Could not open the print dialog. We opened a preview window as a fallback.', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleDirectPrint}
        disabled={isExporting}
        className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-bold flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
      >
        <Printer className="h-4 w-4" />
        <span className="hidden sm:inline">Print</span>
      </Button>
    </>
  );
};
