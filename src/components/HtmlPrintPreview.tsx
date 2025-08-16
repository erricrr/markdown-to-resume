import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { processHtmlForDisplay, getBrowserDetectionScript } from "@/utils/htmlProcessor";
import { getPrintHintHtml } from "@/utils/pdfExport";

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

  const handlePreview = () => {
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
        enhancedHtml = enhancedHtml.replace('</body>', `
          ${getPrintHintHtml()}
          ${browserDetectionScript}</body>`);
      } else {
        enhancedHtml = enhancedHtml + `
          ${getPrintHintHtml()}
          ${browserDetectionScript}`;
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

  const handleDirectPrint = () => {
    setIsExporting(true);
    try {
      // Create print-focused HTML without the preview hint, but include detection script
      const processedHtml = processHtmlForDisplay(html, {
        paperSize,
        uploadedFileUrl,
        uploadedFileName,
        forPrint: true,
        forPrintWindow: true
      });

      const browserDetectionScript = getBrowserDetectionScript();

      let enhancedHtml = processedHtml;
      // Ensure paper size data attribute
      enhancedHtml = enhancedHtml.replace('<body>', `<body data-paper-size="${paperSize}">`);

      // Inject auto-print script and browser detection before closing body
      const autoPrintScript = `
        <script>
          (function() {
            function triggerPrint() {
              try { window.focus(); window.print(); } catch (e) { console.log('Print trigger failed', e); }
            }
            const start = () => {
              if (document.fonts && document.fonts.ready) { document.fonts.ready.then(() => setTimeout(triggerPrint, 50)); }
              else { setTimeout(triggerPrint, 300); }
            };
            if (document.readyState === 'complete' || document.readyState === 'interactive') start();
            else window.addEventListener('load', start);
          })();
        </script>`;

      if (enhancedHtml.includes('</body>')) {
        enhancedHtml = enhancedHtml.replace('</body>', `${browserDetectionScript}${autoPrintScript}</body>`);
      } else {
        enhancedHtml = enhancedHtml + `${browserDetectionScript}${autoPrintScript}`;
      }

      // Use hidden iframe for direct print
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      const cleanup = () => {
        try { document.body.removeChild(iframe); } catch {}
        setIsExporting(false);
      };

      const win = iframe.contentWindow;
      if (!win) {
        cleanup();
        return;
      }
      win.onafterprint = () => setTimeout(cleanup, 0);

      if ('srcdoc' in iframe) {
        (iframe as HTMLIFrameElement).srcdoc = enhancedHtml;
      } else {
        const doc = win.document;
        doc.open();
        doc.write(enhancedHtml);
        doc.close();
      }

      // Match Markdown behavior: don't keep the button in a busy state during the print dialog
      // Reset the button shortly after triggering print, regardless of dialog outcome
      setTimeout(() => setIsExporting(false), 700);

      // Fallback cleanup
      setTimeout(cleanup, 60000);
    } catch (e) {
      console.error('Direct print failed for HTML preview:', e);
      setIsExporting(false);
    }
  };

  // Direct Print button only (Preview removed per requirements)
  return (
    <Button
      onClick={handleDirectPrint}
      disabled={isExporting}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
    >
      <Printer className="h-4 w-4" />
      <span className="hidden sm:inline">Print</span>
    </Button>
  );
};
