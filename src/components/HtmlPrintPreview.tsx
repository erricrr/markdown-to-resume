import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

interface HtmlPrintPreviewProps {
  html: string;
  paperSize?: 'A4' | 'US_LETTER';
  uploadedFileUrl?: string;
  uploadedFileName?: string;
}

export const HtmlPrintPreview = ({ html, paperSize = 'A4', uploadedFileUrl = '', uploadedFileName = '' }: HtmlPrintPreviewProps) => {
  const [isExporting, setIsExporting] = useState(false);

  // Preconnect and Google Fonts links for print window
  const fontLinks = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@300;400;600&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Source+Sans+Pro:wght@300;400;600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet">
  `;

  const handlePrint = () => {
    setIsExporting(true);
    console.log('Print function called with HTML length:', html.length);
    console.log('HTML preview (first 200 chars):', html.substring(0, 200));

    // Debug: Check if Contact section spacing is being modified
    if (html.includes('.section {')) {
      const sectionMatch = html.match(/\.section\s*{[^}]*}/);
      console.log('Found .section CSS rule:', sectionMatch ? sectionMatch[0] : 'Not found');
    }

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      // Add uploaded file to the HTML if available
      let processedHtml = html;
      const imageRegex = /\.(jpe?g|png|gif|webp)$/i;
      const isImageFile = (!!uploadedFileUrl && imageRegex.test(uploadedFileUrl)) || (!!uploadedFileName && imageRegex.test(uploadedFileName));

      if (uploadedFileUrl && !isImageFile && !processedHtml.includes(uploadedFileUrl)) {
        const uploadedFileHtml = `
<div style="margin-top: 20px; margin-bottom: 20px;">
  <img src="${uploadedFileUrl}" alt="Uploaded file" style="max-width: 100%; max-height: 300px; display: block; margin: 0 auto;">
</div>`;

        if (processedHtml.indexOf('</body>') !== -1) {
          processedHtml = processedHtml.replace('</body>', `${uploadedFileHtml}</body>`);
        } else {
          processedHtml = processedHtml + uploadedFileHtml;
        }
      }

      // Swap filename references to blob URL for inline images
      if (uploadedFileUrl && uploadedFileName) {
        const escapedName = uploadedFileName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
        const regex = new RegExp(`src=([\"\'])([^\"\']*${escapedName})\\1`, 'g');
        processedHtml = processedHtml.replace(regex, (_m: string, quote: string) => `src=${quote}${uploadedFileUrl}${quote}`);
      }

      // Ensure relative image sources work
      processedHtml = processedHtml.replace(/<img([^>]*)src="([^\"\']+)"([^>]*)>/g, (match: string, before: string, src: string, after: string) => {
        if (/^(https?:|data:|blob:|\/)/i.test(src)) return match;
        return `<img${before}src="/${src}"${after}>`;
      });

      // Aggressive approach - force background colors to work in print
      let enhancedHtml = processedHtml;

      // Don't modify the HTML - just rely on CSS overrides to preserve colors

      // Debug: Log what CSS we're working with
      console.log('HTML contains background styles:', html.includes('background'));
      console.log('HTML contains CSS blocks:', html.includes('<style>'));

      // More comprehensive background color preservation - catch ALL patterns
      enhancedHtml = enhancedHtml.replace(
        /(background(?:-color|-image)?:\s*[^;]+;)/gi,
        (match) => {
          console.log('Found background CSS:', match);
          return `${match} -webkit-print-color-adjust: exact !important; color-adjust: exact !important;`;
        }
      );

      // Catch inline styles in HTML elements
      enhancedHtml = enhancedHtml.replace(
        /style="([^"]*background[^"]*)"/gi,
        (match, styleContent) => {
          console.log('Found inline background style:', match);
          return `style="${styleContent}; -webkit-print-color-adjust: exact !important; color-adjust: exact !important;"`;
        }
      );

      // Add color preservation to ALL CSS rules that contain background
      enhancedHtml = enhancedHtml.replace(
        /([.#]?[a-zA-Z0-9_-]+[^{]*{[^}]*background[^}]*})/gi,
        (match) => {
          console.log('Found CSS rule with background:', match);
          if (!match.includes('print-color-adjust')) {
            return match.replace('}', ' -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }');
          }
          return match;
        }
      );

      // Catch body/html styles specifically
      enhancedHtml = enhancedHtml.replace(
        /((?:body|html)\s*{[^}]*})/gi,
        (match) => {
          console.log('Found body/html CSS rule:', match);
          if (!match.includes('print-color-adjust')) {
            return match.replace('}', ' -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }');
          }
          return match;
        }
      );

      // Add minimal print-specific CSS that preserves layouts
      const printStyles = `
        <style>
          @page {
            margin: 0;
            size: ${paperSize === 'A4' ? 'A4' : 'letter'};
          }

          /* Force colors OUTSIDE of print media query */
          html, body, * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            forced-color-adjust: none !important;
          }

          @media print {
            /* Override browser print defaults */
            @page {
              color-adjust: exact;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            /* FORCE color preservation - maximum browser support */
            html, body {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
              forced-color-adjust: none !important;
            }

            /* Preserve ALL colors and backgrounds exactly as designed */
            *, *::before, *::after {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
              forced-color-adjust: none !important;
            }

            /* Force background colors specifically */
            [style*="background"], [class*="bg"], [style*="background-color"] {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
              forced-color-adjust: none !important;
              background-attachment: local !important;
            }

            /* Target common background classes and elements */
            .left-column, .right-column, .section, .skill, .interactive-section,
            div, section, span, p, h1, h2, h3, h4, h5, h6, article, aside, main, header, footer {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
              forced-color-adjust: none !important;
            }

            /* Use box-shadow as backup for background colors */
            [style*="background: #"], [style*="background-color: #"], [style*="background:#"], [style*="background-color:#"] {
              box-shadow: inset 0 0 0 1000px currentColor !important;
            }

            /* Force specific problematic elements */
            body * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
              forced-color-adjust: none !important;
            }

            /* Remove animations and transitions for clean print */
            *, *::before, *::after {
              animation-duration: 0s !important;
              animation-delay: 0s !important;
              transition-duration: 0s !important;
              transition-delay: 0s !important;
            }

            /* Force specific grid containers to preserve their layout */
            .resume-container {
              display: grid !important;
              grid-template-columns: 350px 1fr !important;
            }

            /* Fix for two-column layouts in print */
            .content {
              display: grid !important;
              grid-template-columns: 1fr 2fr !important;
              gap: 20px !important;
              width: 100% !important;
            }

            .left-column, .right-column {
              width: 100% !important;
              overflow: hidden !important;
            }

            /* Support for flex-based column layouts */
            [class*="column-layout"],
            [class*="two-column"],
            [class*="columns"],
            [class*="col-layout"] {
              display: grid !important;
              grid-template-columns: 1fr 2fr !important;
              gap: 20px !important;
              width: 100% !important;
            }

            /* Ensure all column elements have proper display */
            [class*="column-left"],
            [class*="left-col"],
            [class*="sidebar"],
            [class*="col-1"] {
              width: 100% !important;
              overflow: hidden !important;
            }

            [class*="column-right"],
            [class*="right-col"],
            [class*="main-content"],
            [class*="col-2"] {
              width: 100% !important;
              overflow: hidden !important;
            }

            /* Preserve inline grid styles */
            *[style*="display: grid"],
            *[style*="display:grid"] {
              display: grid !important;
            }

            /* Hide interactive elements that don't make sense in print */
            button:not([class*="print"]):not([class*="visible"]),
            input[type="button"],
            input[type="submit"],
            input[type="reset"],
            .interactive-section,
            [class*="interactive"]:not([class*="print"]) {
              display: none !important;
            }
          }
        </style>

        <script>
          window.addEventListener('beforeprint', function() {
            document.title = 'Resume';
          });

          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      `;

      // Insert the print styles before closing head tag
      if (enhancedHtml.includes('</head>')) {
        enhancedHtml = enhancedHtml.replace('</head>', fontLinks + printStyles + '</head>');
      } else {
        // Fallback if no head tag
        enhancedHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Resume</title>
  ${fontLinks}
  ${printStyles}
</head>
<body>
  ${html}
</body>
</html>`;
      }

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
