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
  uploadedFileName = ''
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
    <div className="flex items-center gap-2">
      <Button
        onClick={handleDirectPrint}
        disabled={isExporting}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
      >
        <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">{isExporting ? 'Printing…' : 'Print'}</span>
      </Button>
      <Button
        onClick={handlePreview}
        disabled={isExporting}
        className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
      >
        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">{isExporting ? 'Generating…' : 'Preview'}</span>
      </Button>
    </div>
  );
};
