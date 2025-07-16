import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
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

  return (
    <Button
      onClick={handleExportPDF}
      disabled={isExporting}
      className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
    >
      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
      {isExporting ? 'Generating...' : 'Preview'}
    </Button>
  );
};
