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
  isTwoPage = false
}: PrintPreviewProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
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
        isTwoPage
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
      className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 flex items-center gap-2"    >
      <Download className="h-4 w-4" />
      {isExporting ? 'Generating...' : 'Generate PDF'}
    </Button>
  );
};
