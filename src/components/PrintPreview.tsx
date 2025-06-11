import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';
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

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      console.log(`Exporting PDF with paper size: ${paperSize}`);
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
      toast({ title: 'PDF Generated', description: 'Your resume PDF has opened in a new tab.' });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({ title: 'Export Failed', description: 'Could not generate PDF. Please try again.', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExportPDF}
      disabled={isExporting}
      className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
    >
      <Download className="h-3 w-3 sm:h-4 sm:w-4" />
      {isExporting ? 'Generating...' : 'PDF'}
    </Button>
  );
};
