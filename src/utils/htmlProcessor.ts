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

  // Add print-specific skill styling directly to HTML for better compatibility
  if (forPrintWindow) {
    // Add inline styles to skill elements for print compatibility
    processedHtml = processedHtml.replace(
      /<span class="skill">/g,
      '<span class="skill" style="-webkit-print-color-adjust: exact !important; color-adjust: exact !important; print-color-adjust: exact !important; forced-color-adjust: none !important; background-attachment: local !important;">'
    );

    // Add specific styling for left column skills
    processedHtml = processedHtml.replace(
      /<span class="skill"([^>]*)>/g,
      (match, attributes) => {
        const isInLeftColumn = processedHtml.indexOf('.left-column') < processedHtml.indexOf(match);
        const isInRightColumn = processedHtml.indexOf('.right-column') < processedHtml.indexOf(match);

        if (isInLeftColumn) {
          return `<span class="skill"${attributes} style="background-color: rgba(255, 255, 255, 0.1) !important; color: white !important; border: 1px solid rgba(255, 255, 255, 0.15) !important; -webkit-print-color-adjust: exact !important; color-adjust: exact !important; print-color-adjust: exact !important; forced-color-adjust: none !important; background-attachment: local !important;">`;
        } else if (isInRightColumn) {
          return `<span class="skill"${attributes} style="background-color: #f1f5f9 !important; color: #1e3a8a !important; border: 1px solid #e2e8f0 !important; -webkit-print-color-adjust: exact !important; color-adjust: exact !important; print-color-adjust: exact !important; forced-color-adjust: none !important; background-attachment: local !important;">`;
        }
        return match;
      }
    );
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

    // Add browser detection script for both preview and print window
    const browserDetectionScript = getBrowserDetectionScript();

    processedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF Preview</title>
    ${forPrintWindow ? '<meta name="print-options" content="no-header,no-footer,no-margins">' : ''}
    ${fontLinks}
    ${baseStyles}
</head>
<body data-paper-size="${paperSize}">
    ${processedHtml}
    ${browserDetectionScript}
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
        overflow-y: auto;
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
        /* Removed overflow: hidden to prevent scrolling conflicts */
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
        /* Removed overflow: hidden to prevent scrolling conflicts */
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

                        /* Ensure scrolling works for both preview and print window */
        html {
          overflow-y: auto !important;
          overflow-x: hidden !important;
        }

        body {
          overflow-y: auto !important;
          overflow-x: hidden !important;
          min-height: 100vh !important;
        }

        .resume, body > div {
          overflow: visible !important;
          max-height: none !important;
        }

        /* Override any overflow restrictions on all elements */
        * {
          overflow: visible !important;
        }

        /* Ensure the main resume container can scroll */
        .resume {
          overflow: visible !important;
          max-height: none !important;
          height: auto !important;
          min-height: auto !important;
        }

        /* Ensure body and html can scroll */
        html, body {
          overflow-y: auto !important;
          overflow-x: hidden !important;
          height: auto !important;
          min-height: 100vh !important;
        }

        /* Remove any height restrictions that might prevent scrolling */
        .resume, body > div, [class*="resume"] {
          max-height: none !important;
          height: auto !important;
          min-height: auto !important;
        }

        /* Ensure skill badges maintain their styling */
        .skill {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          forced-color-adjust: none !important;
          background-attachment: local !important;
        }

        /* Preserve left column skill styling */
        .left-column .skill {
          background: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          forced-color-adjust: none !important;
        }

        /* Preserve right column skill styling */
        .right-column .skill {
          background: #f1f5f9 !important;
          color: #1e3a8a !important;
          border: 1px solid #e2e8f0 !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          forced-color-adjust: none !important;
        }

        /* Ensure all badge-like elements maintain styling */
        [class*="badge"], [class*="skill"], [class*="tag"] {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          forced-color-adjust: none !important;
          background-attachment: local !important;
        }

      /* Print-specific styles */
      @media print {
        @page {
          size: ${paperSize === 'A4' ? 'A4 portrait' : 'letter portrait'};
          margin: 0;
        }

        html, body {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          ${forPrintWindow ? `
          margin: 0 !important;
          padding: 0 !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          height: auto !important;
          min-height: 100vh !important;
          ` : ''}
        }

        ${forPrintWindow ? `
        /* Keep content flowing naturally on single page */
        body {
          box-sizing: border-box !important;
          position: relative !important;
          max-width: none !important;
          height: auto !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          min-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
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

        /* Preserve left column background */
        .left-column {
          background: #1e3a8a !important;
          color: white !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          forced-color-adjust: none !important;
        }

        /* Ensure skill badges maintain their styling in print */
        .skill {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          forced-color-adjust: none !important;
          background-attachment: local !important;
        }

        /* Preserve left column skill styling */
        .left-column .skill {
          background: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          forced-color-adjust: none !important;
        }

        /* Preserve right column skill styling */
        .right-column .skill {
          background: #f1f5f9 !important;
          color: #1e3a8a !important;
          border: 1px solid #e2e8f0 !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          forced-color-adjust: none !important;
        }

        /* Ensure all badge-like elements maintain styling */
        [class*="badge"], [class*="skill"], [class*="tag"] {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          forced-color-adjust: none !important;
          background-attachment: local !important;
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
          overflow: visible !important;
          max-height: none !important;
        }

        /* Ensure content fits on page and skills display correctly */
        .resume {
          max-height: ${paperSize === 'A4' ? '11.69in' : '11in'} !important;
          height: auto !important;
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Force skill colors to print correctly - more specific */
        .left-column .skill {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          forced-color-adjust: none !important;
          background-attachment: local !important;
        }

        .right-column .skill {
          background-color: #f1f5f9 !important;
          color: #1e3a8a !important;
          border: 1px solid #e2e8f0 !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          forced-color-adjust: none !important;
          background-attachment: local !important;
        }

        /* Hide print hint when actually printing */
        .print-hint,
        div[class*="print-hint"],
        div[style*="print-hint"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
        }

        /* Ensure print hint font is not overridden by any styles */
        .print-hint {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
          font-weight: 400 !important;
          font-size: 12px !important;
          line-height: 1.4 !important;
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

        // Force scrolling to work for both preview and print window
        console.log('🔧 Applying scrolling fixes...');

        // Ensure resume elements can scroll properly
        const resumeElements = document.querySelectorAll('.resume, [class*="resume"]');
        console.log('Found resume elements:', resumeElements.length);
        const paperSize = document.body.dataset.paperSize || 'A4';

        resumeElements.forEach(element => {
          element.style.overflow = 'visible';
          element.style.maxHeight = 'none';
          element.style.height = 'auto';
          element.style.margin = '0';
          element.style.padding = '0';
          console.log('Fixed resume element:', element);
        });

        // Ensure body and html can scroll
        document.documentElement.style.overflowY = 'auto';
        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowY = 'auto';
        document.body.style.overflowX = 'hidden';
        document.body.style.height = 'auto';
        document.body.style.minHeight = '100vh';
        document.body.style.margin = '0';
        document.body.style.padding = '0';

        // Remove any overflow restrictions on all elements
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
          if (element.style.overflow === 'hidden') {
            element.style.overflow = 'visible';
          }
        });

        console.log('✅ Scrolling fixes applied');

        // Force skill badges to maintain their styling with maximum specificity
        const skillElements = document.querySelectorAll('.skill, [class*="badge"], [class*="tag"]');
        console.log('Found skill elements:', skillElements.length);

        skillElements.forEach(element => {
          // Apply print color adjustments
          element.style.setProperty('-webkit-print-color-adjust', 'exact', 'important');
          element.style.setProperty('color-adjust', 'exact', 'important');
          element.style.setProperty('print-color-adjust', 'exact', 'important');
          element.style.setProperty('forced-color-adjust', 'none', 'important');
          element.style.setProperty('background-attachment', 'local', 'important');

          // Apply specific styling based on column with maximum specificity
          const isInLeftColumn = element.closest('.left-column');
          const isInRightColumn = element.closest('.right-column');

          if (isInLeftColumn) {
            element.style.setProperty('background-color', 'rgba(255, 255, 255, 0.1)', 'important');
            element.style.setProperty('color', 'white', 'important');
            element.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.15)', 'important');
            console.log('Applied left column styling to skill:', element);
          } else if (isInRightColumn) {
            element.style.setProperty('background-color', '#f1f5f9', 'important');
            element.style.setProperty('color', '#1e3a8a', 'important');
            element.style.setProperty('border', '1px solid #e2e8f0', 'important');
            console.log('Applied right column styling to skill:', element);
          }
        });

        console.log('✅ Skill badge styling fixes applied');

                // Browser-specific fixes (simplified to avoid layout issues)
        const style = document.createElement('style');
        style.textContent = \`
          @media print {
            @page {
              margin: 0 !important;
              size: \${document.body.dataset.paperSize === 'A4' ? 'A4' : 'letter'} !important;
            }
            body {
              margin: 0 !important;
              padding: 0 !important;
              transform: none !important;
            }
            html {
              margin: 0 !important;
              padding: 0 !important;
            }
            .resume {
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

        // Remove automatic print trigger - let user manually print when ready
        console.log('Preview ready. Use Ctrl+P (or Cmd+P) to print.');
      };
    </script>
  `;
}
