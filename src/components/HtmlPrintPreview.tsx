import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      // Set the document title for the print window
      printWindow.document.title = documentTitle;

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

      // More comprehensive background color preservation - catch ALL patterns
      enhancedHtml = enhancedHtml.replace(
        /(background(?:-color|-image)?:\s*[^;]+;)/gi,
        (match) => {
          return `${match} -webkit-print-color-adjust: exact !important; color-adjust: exact !important;`;
        }
      );

      // Catch inline styles in HTML elements
      enhancedHtml = enhancedHtml.replace(
        /style="([^"]*background[^"]*)"/gi,
        (match, styleContent) => {
          return `style="${styleContent}; -webkit-print-color-adjust: exact !important; color-adjust: exact !important;"`;
        }
      );

      // Add color preservation to ALL CSS rules that contain background
      enhancedHtml = enhancedHtml.replace(
        /([.#]?[a-zA-Z0-9_-]+[^{]*{[^}]*background[^}]*})/gi,
        (match) => {
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
          if (!match.includes('print-color-adjust')) {
            return match.replace('}', ' -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }');
          }
          return match;
        }
      );

      // Detect browser for specific fixes
      const browserDetection = `
        <script>
          // Browser detection for specific print fixes
          function detectBrowser() {
            const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            const isChrome = /chrome/i.test(navigator.userAgent) && !/edge|edg/i.test(navigator.userAgent);

            document.documentElement.setAttribute('data-browser',
              isFirefox ? 'firefox' : (isSafari ? 'safari' : (isChrome ? 'chrome' : 'other')));

            return { isFirefox, isSafari, isChrome };
          }

          const browser = detectBrowser();
          console.log('Detected browser:', browser);
        </script>
      `;

      // Add cross-browser print-specific CSS that preserves layouts
      const printStyles = `
        <style>
          /* Base page setup */
          @page {
            size: ${paperSize === 'A4' ? 'A4 portrait' : 'letter portrait'};
            margin: 0;
            padding: 0;
          }

          /* Safari-specific: Hide header and footer */
          @media print {
            @page {
              margin: 0;
            }

            /* Base styles for all browsers */
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              height: 100% !important;
              width: 100% !important;
              overflow: hidden !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }

            body {
              /* Ensure content fits within page boundaries */
              box-sizing: border-box !important;
              position: relative !important;
            }

            /* Force colors for ALL browsers */
            *, *::before, *::after {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              forced-color-adjust: none !important;
            }

            /* Firefox-specific fixes - scale content properly */
            html[data-browser="firefox"] {
              transform-origin: top left !important;
              transform: scale(1) !important;
              height: 100% !important;
            }

            /* Firefox-specific: ensure content fits in page */
            html[data-browser="firefox"] body {
              height: ${paperSize === 'A4' ? '297mm' : '11in'} !important;
              width: ${paperSize === 'A4' ? '210mm' : '8.5in'} !important;
              max-height: ${paperSize === 'A4' ? '297mm' : '11in'} !important;
              max-width: ${paperSize === 'A4' ? '210mm' : '8.5in'} !important;
            }

            /* Safari-specific fixes */
            html[data-browser="safari"] {
              -webkit-print-color-adjust: exact !important;
            }

            html[data-browser="safari"] body {
              padding: 0 !important;
              margin: 0 !important;
              height: 100% !important;
              width: 100% !important;
            }

            /* Safari: Ensure content doesn't get cut off at the top */
            html[data-browser="safari"] .resume-container,
            html[data-browser="safari"] [class*="resume"],
            html[data-browser="safari"] [id*="resume"] {
              padding-top: 5mm !important;
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
              width: 100% !important;
              height: 100% !important;
              overflow: hidden !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            /* Fix for two-column layouts in print */
            .content {
              display: grid !important;
              grid-template-columns: 1fr 2fr !important;
              gap: 20px !important;
              width: 100% !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            .left-column, .right-column {
              width: 100% !important;
              overflow: hidden !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
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
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            /* Ensure all column elements have proper display */
            [class*="column-left"],
            [class*="left-col"],
            [class*="sidebar"],
            [class*="col-1"] {
              width: 100% !important;
              overflow: hidden !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            [class*="column-right"],
            [class*="right-col"],
            [class*="main-content"],
            [class*="col-2"] {
              width: 100% !important;
              overflow: hidden !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
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

            /* Hide URL display in Safari */
            a {
              text-decoration: none !important;
            }

            a::after {
              content: "" !important;
              display: none !important;
            }
          }
        </style>

        <script>
          window.onload = function() {
            document.title = "${documentTitle}";

            // Detect browser and apply specific fixes
            const browser = detectBrowser();

            // Firefox-specific fixes
            if (browser.isFirefox) {
              // Apply Firefox-specific adjustments
              const resumeContainer = document.querySelector('.resume-container') ||
                                     document.querySelector('[class*="resume"]') ||
                                     document.querySelector('[id*="resume"]') ||
                                     document.body;

              if (resumeContainer) {
                resumeContainer.style.height = '${paperSize === 'A4' ? '297mm' : '11in'}';
                resumeContainer.style.width = '${paperSize === 'A4' ? '210mm' : '8.5in'}';
                resumeContainer.style.maxHeight = '${paperSize === 'A4' ? '297mm' : '11in'}';
                resumeContainer.style.maxWidth = '${paperSize === 'A4' ? '210mm' : '8.5in'}';
                resumeContainer.style.overflow = 'hidden';
              }
            }

            // Safari-specific fixes
            if (browser.isSafari) {
              // Apply Safari-specific adjustments
              const style = document.createElement('style');
              style.textContent = \`
                @media print {
                  @page { margin: 0; padding: 0; }
                  body { margin: 0 !important; padding: 0 !important; }
                  #safari-print-header-fix {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 0;
                    background: transparent;
                    z-index: 9999;
                  }
                }
              \`;
              document.head.appendChild(style);

              // Add invisible element to prevent Safari header/footer
              const headerFix = document.createElement('div');
              headerFix.id = 'safari-print-header-fix';
              document.body.prepend(headerFix);
            }

            // Delay printing slightly to ensure all styles are applied
            setTimeout(() => {
              window.print();
            }, 800);
          };
        </script>
      `;

      // Insert the print styles before closing head tag
      if (enhancedHtml.includes('</head>')) {
        enhancedHtml = enhancedHtml.replace('</head>', fontLinks + browserDetection + printStyles + '</head>');
      } else {
        // Fallback if no head tag
        enhancedHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentTitle}</title>
  ${fontLinks}
  ${browserDetection}
  ${printStyles}
</head>
<body>
  ${enhancedHtml}
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
