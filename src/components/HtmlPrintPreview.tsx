import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { processHtmlForDisplay, getBrowserDetectionScript } from "@/utils/htmlProcessor";

interface HtmlPrintPreviewProps {
  html: string;
  paperSize?: 'A4' | 'US_LETTER';
  uploadedFileUrl?: string;
  uploadedFileName?: string;
}

export const HtmlPrintPreview = ({ html, paperSize = 'A4', uploadedFileUrl = '', uploadedFileName = '' }: HtmlPrintPreviewProps) => {
  const [isExporting, setIsExporting] = useState(false);

  // Create a title variable that includes the paper size
  const documentTitle = `Resume - ${paperSize === 'A4' ? 'A4' : 'US Letter'} Format`;

  const handlePrint = () => {
    setIsExporting(true);
    console.log('Print function called with HTML length:', html.length);

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      // Set the document title for the print window
      printWindow.document.title = documentTitle;

      // Process HTML with the unified processor for print window
      const processedHtml = processHtmlForDisplay(html, {
        paperSize,
        uploadedFileUrl,
        uploadedFileName,
        forPrint: true,
        forPrintWindow: true // Enable print window specific processing
      });

      // Get browser detection script from unified processor
      const browserDetectionScript = getBrowserDetectionScript();

      // Insert the browser detection script before closing body tag
      let enhancedHtml = processedHtml;
      if (enhancedHtml.includes('</body>')) {
        enhancedHtml = enhancedHtml.replace('</body>', `${browserDetectionScript}</body>`);
      } else {
        enhancedHtml = enhancedHtml + browserDetectionScript;
      }

      // Add paper size data attribute for script access
      enhancedHtml = enhancedHtml.replace('<body>', `<body data-paper-size="${paperSize}">`);

      // Set document title
      enhancedHtml = enhancedHtml.replace('<title>Resume Preview</title>', `<title>${documentTitle}</title>`);

      printWindow.document.write(enhancedHtml);
      printWindow.document.close();

      // Add timeout to reset the button state
      setTimeout(() => {
        setIsExporting(false);
      }, 2000);
    }
  };

  // Direct PDF button without dialog
  return (
    <Button
      onClick={handlePrint}
      disabled={isExporting}
      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
    >
      <Download className="h-4 w-4" />
      {isExporting ? 'Generating...' : 'PDF'}
    </Button>
  );
};
