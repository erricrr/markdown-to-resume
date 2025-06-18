/**
 * Unified HTML processing utility for both preview and PDF export
 * This ensures consistent rendering between the live preview and the PDF output
 */

/**
 * Options for processing HTML content
 */
export interface HtmlProcessorOptions {
  paperSize?: 'A4' | 'US_LETTER';
  uploadedFileUrl?: string;
  uploadedFileName?: string;
  forPrint?: boolean;
  forPrintWindow?: boolean; // New option for print window specific processing
}

/**
 * Unified HTML processor that handles both preview and print scenarios
 */
export function processHtmlForDisplay(html: string, options: HtmlProcessorOptions = {}) {
  const {
    paperSize = 'A4',
    uploadedFileUrl = '',
    uploadedFileName = '',
    forPrint = false,
    forPrintWindow = false
  } = options;

  // Add uploaded file to the HTML if available
  let processedHtml = html;
  const imageRegex = /\.(jpe?g|png|gif|webp)$/i;
  const isImageFile = (!!uploadedFileUrl && imageRegex.test(uploadedFileUrl)) ||
                      (!!uploadedFileName && imageRegex.test(uploadedFileName));

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

  // Replace occurrences of the uploaded file name so inline <img> tags show the blob URL
  if (uploadedFileUrl && uploadedFileName) {
    // Handle both full path and filename-only references
    const escapedName = uploadedFileName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`src=([\"\'])([^\"\']*${escapedName})\\1`, 'g');
    processedHtml = processedHtml.replace(regex, (_m: string, quote: string) => `src=${quote}${uploadedFileUrl}${quote}`);

    // Also try to handle just the filename without path
    const filenameOnly = uploadedFileName.split('/').pop() || uploadedFileName;
    if (filenameOnly !== uploadedFileName) {
      const escapedBaseName = filenameOnly.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const baseNameRegex = new RegExp(`src=([\"\'])([^\"\']*${escapedBaseName})\\1`, 'g');
      processedHtml = processedHtml.replace(baseNameRegex, (_m: string, quote: string) => `src=${quote}${uploadedFileUrl}${quote}`);
    }
  }

  // Ensure relative image URLs load from public root
  processedHtml = processedHtml.replace(/<img([^>]*)src="([^\"\']+)"([^>]*)>/g, (match: string, before: string, src: string, after: string) => {
    if (/^(https?:|data:|blob:|\/)/i.test(src)) return match;
    return `<img${before}src="/${src}"${after}>`;
  });

  // Add more complete image path matching for background-image CSS properties
  processedHtml = processedHtml.replace(/background-image\s*:\s*url\s*\(\s*['"]?([^'"\)]+)['"]?\s*\)/gi, (match, url) => {
    if (/^(https?:|data:|blob:|\/)/i.test(url)) return match;
    return match.replace(url, `/${url}`);
  });

  // Aggressive approach - force background colors to work in print
  if (forPrint) {
    // More comprehensive background color preservation - catch ALL patterns
    processedHtml = processedHtml.replace(
      /(background(?:-color|-image)?:\s*[^;]+;)/gi,
      (match) => {
        return `${match} -webkit-print-color-adjust: exact !important; color-adjust: exact !important;`;
      }
    );

    // Catch inline styles in HTML elements
    processedHtml = processedHtml.replace(
      /style="([^"]*background[^"]*)"/gi,
      (match, styleContent) => {
        return `style="${styleContent}; -webkit-print-color-adjust: exact !important; color-adjust: exact !important;"`;
      }
    );

    // Add color preservation to ALL CSS rules that contain background
    processedHtml = processedHtml.replace(
      /([.#]?[a-zA-Z0-9_-]+[^{]*{[^}]*background[^}]*})/gi,
      (match) => {
        if (!match.includes('print-color-adjust')) {
          return match.replace('}', ' -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }');
        }
        return match;
      }
    );

    // Catch body/html styles specifically
    processedHtml = processedHtml.replace(
      /((?:body|html)\s*{[^}]*})/gi,
      (match) => {
        if (!match.includes('print-color-adjust')) {
          return match.replace('}', ' -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }');
        }
        return match;
      }
    );
  }

  // Generate a complete HTML document if needed
  if (!processedHtml.trim().toLowerCase().startsWith('<!doctype')) {
    const fontLinks = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@300;400;600&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Source+Sans+Pro:wght@300;400;600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet">
    `;

    // Base styles for both preview and print
    const baseStyles = getUnifiedStyles(paperSize, forPrint, forPrintWindow);

    processedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume Preview</title>
    ${forPrintWindow ? '<meta name="print-options" content="no-header,no-footer,no-margins">' : ''}
    ${fontLinks}
    ${baseStyles}
</head>
<body>
    ${processedHtml}
</body>
</html>
`;
  }

  return processedHtml;
}

/**
 * Get unified styles that work for both preview and print
 */
function getUnifiedStyles(paperSize: 'A4' | 'US_LETTER', forPrint: boolean, forPrintWindow: boolean): string {
  const baseStyles = `
    <style>
      /* Ensure proper CSS rendering and color preservation */
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: auto;
        overflow-x: hidden;
        max-width: 100%;
      }
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Make sure links are clickable */
      a, a:link, a:visited {
        cursor: pointer;
        pointer-events: auto !important;
        text-decoration: underline;
      }

      /* Ensure content fits within iframe */
      .resume, body > div {
        max-width: 100% !important;
        overflow-x: hidden !important;
        width: auto !important;
        margin: 0 auto !important;
      }

      /* IDENTICAL FALLBACK STYLES FOR BOTH PREVIEW AND PDF */
      /* These styles only apply if user hasn't defined their own layout */

      /* Apply fallback grid layout only to elements that don't already have explicit styling */
      .content:not([style*="display"]):not([style*="grid"]):not([style*="flex"]) {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 20px;
        width: 100%;
      }

      /* Fallback for column elements without explicit width styling */
      .left-column:not([style*="width"]):not([style*="flex"]):not([style*="max-width"]),
      .right-column:not([style*="width"]):not([style*="flex"]):not([style*="max-width"]) {
        overflow: hidden;
      }

      /* Support for flex-based column layouts - only as fallback when no explicit styles exist */
      [class*="column-layout"]:not([style*="display"]):not([style*="grid"]):not([style*="flex"]),
      [class*="two-column"]:not([style*="display"]):not([style*="grid"]):not([style*="flex"]),
      [class*="columns"]:not([style*="display"]):not([style*="grid"]):not([style*="flex"]),
      [class*="col-layout"]:not([style*="display"]):not([style*="grid"]):not([style*="flex"]) {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 20px;
        width: 100%;
      }

      /* Fallback for column elements without explicit styling */
      [class*="column-left"]:not([style*="width"]):not([style*="flex"]):not([style*="max-width"]),
      [class*="left-col"]:not([style*="width"]):not([style*="flex"]):not([style*="max-width"]),
      [class*="sidebar"]:not([style*="width"]):not([style*="flex"]):not([style*="max-width"]),
      [class*="col-1"]:not([style*="width"]):not([style*="flex"]):not([style*="max-width"]),
      [class*="column-right"]:not([style*="width"]):not([style*="flex"]):not([style*="max-width"]),
      [class*="right-col"]:not([style*="width"]):not([style*="flex"]):not([style*="max-width"]),
      [class*="main-content"]:not([style*="width"]):not([style*="flex"]):not([style*="max-width"]),
      [class*="col-2"]:not([style*="width"]):not([style*="flex"]):not([style*="max-width"]) {
        overflow: hidden;
      }

      /* Scale content to fit the available width (only for screen preview, not print) */
      @media screen and (max-width: 1000px) {
        .resume, body > div {
          transform: scale(0.95);
          transform-origin: top center;
        }
      }
      @media screen and (max-width: 800px) {
        .resume, body > div {
          transform: scale(0.9);
          transform-origin: top center;
        }
      }

      /* Print-specific styles */
      @media print {
        @page {
          size: ${paperSize === 'A4' ? 'A4 portrait' : 'letter portrait'};
          margin: 0.5in;
        }

        html, body {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          ${forPrintWindow ? `
          margin: 0 !important;
          padding: 20px !important;
          overflow: visible !important;
          height: auto !important;
          ` : ''}
        }

        ${forPrintWindow ? `
        /* Keep content flowing naturally on single page */
        body {
          box-sizing: border-box !important;
          position: relative !important;
          max-width: none !important;
          height: auto !important;
        }

        /* Remove animations and transitions for clean print */
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
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

        /* Preserve inline grid styles */
        *[style*="display: grid"],
        *[style*="display:grid"] {
          display: grid !important;
        }

        /* Keep content together on single page */
        .resume, .resume-container, body > div {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        ` : ''}

        /* Force background colors to print */
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    </style>
  `;

  return baseStyles;
}

/**
 * Get browser detection script for print windows
 */
export function getBrowserDetectionScript(): string {
  return `
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

      window.onload = function() {
        const browser = detectBrowser();
        console.log('Detected browser:', browser);

        // Firefox-specific fixes
        if (browser.isFirefox) {
          const resumeContainer = document.querySelector('.resume-container') ||
                                 document.querySelector('[class*="resume"]') ||
                                 document.querySelector('[id*="resume"]') ||
                                 document.body;

          if (resumeContainer) {
            const paperSize = document.body.dataset.paperSize || 'A4';
            const height = paperSize === 'A4' ? '297mm' : '11in';
            const width = paperSize === 'A4' ? '210mm' : '8.5in';

            resumeContainer.style.height = height;
            resumeContainer.style.width = width;
            resumeContainer.style.maxHeight = height;
            resumeContainer.style.maxWidth = width;
            resumeContainer.style.overflow = 'hidden';
          }
        }

                // Browser-specific fixes (simplified to avoid layout issues)
        const style = document.createElement('style');
        style.textContent = \`
          @media print {
            @page {
              margin: 0.5in !important;
              size: \${document.body.dataset.paperSize === 'A4' ? 'A4' : 'letter'} !important;
            }
            body {
              margin: 0 !important;
              padding: 20px !important;
              transform: none !important;
            }
            html {
              margin: 0 !important;
              padding: 0 !important;
            }
          }
        \`;
        document.head.appendChild(style);

        // Try to programmatically set print settings (browser-dependent)
        try {
          // For browsers that support it, attempt to set print options
          if (window.chrome && window.chrome.webstore) {
            // Chrome-specific attempt to hide headers/footers
            const printSettings = {
              shouldPrintHeaderAndFooter: false,
              shouldPrintBackgrounds: true,
              marginType: 0, // NO_MARGINS
            };

            // This won't work due to security restrictions, but we try anyway
            if (window.print.settings) {
              Object.assign(window.print.settings, printSettings);
            }
          }
        } catch (e) {
          // Silently fail - this is expected due to browser security
          console.log('Cannot programmatically set print options - user must disable headers/footers manually');
        }

        // Instructions removed - no more popup!

        // Delay printing slightly to ensure all styles are applied
        setTimeout(() => {
          window.print();
        }, 800);
      };
    </script>
  `;
}
