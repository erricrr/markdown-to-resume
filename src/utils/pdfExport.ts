import { getCompleteCSS } from '../styles/resumeTemplates';
import {
  generateCompleteResumeHTML,
  type ResumeContentData,
} from './resumeContentGenerator';

// Shared function to generate print hint HTML with consistent styling
export const getPrintHintHtml = (): string => {
  return `
    <div class="print-hint" style="
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-weight: 400;
      line-height: 1.4;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      backdrop-filter: blur(4px);
    ">
      🖨️ Preview Mode - Press Ctrl+P (or Cmd+P) to print
    </div>
    <style>
      @media print {
        .print-hint {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
        }
      }
    </style>
  `;
};

// Helper to append !important to each declaration so user rules reliably override template styles
const addImportantToDeclarations = (css: string): string => {
  return css.replace(/:([^;{}]+);/g, (match, value) => {
    if (value.includes('!important')) return match;
    return `: ${value.trim()} !important;`;
  });
};

// This function scopes user CSS to reliably override template styles for PDF
const processAndScopeUserCSS = (css: string): string => {
  if (!css) return '';
  try {
    const scopedCss = css.replace(/(^|}|,)\s*([^{}]+)\s*(?=\{)/g, (match, prefix, selector) => {
      const scopedSelector = selector
        .split(',')
        .map(part => {
          const trimmedPart = part.trim();

          // Map :root or body selectors appropriately for PDF
          if (trimmedPart === ':root') {
            return '.resume-template';
          }
          if (trimmedPart === 'body') {
            return '.resume-template, .resume-template *';
          }

          if (trimmedPart.startsWith('@') || trimmedPart.startsWith(':') || trimmedPart.startsWith('from') || trimmedPart.startsWith('to')) {
            return trimmedPart;
          }
          return `:is(.resume-template) ${trimmedPart}`;
        })
        .join(', ');
      return `${prefix} ${scopedSelector}`;
    });

    return addImportantToDeclarations(scopedCss);
  } catch (error) {
    console.error("Failed to scope custom CSS for PDF, applying it directly:", error);
    return addImportantToDeclarations(css);
  }
};

interface ResumeData {
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

export const exportToPDF = async (resumeData: ResumeData) => {
  const bodyHtml = generateCompleteResumeHTML(resumeData as ResumeContentData);

  // Get all <link> tags from the main document's head, excluding title and styles we'll replace
  const headLinks = Array.from(document.head.children)
    .filter(el => el.tagName.toLowerCase() === 'link')
    .map(el => el.outerHTML)
    .join('\n');

  // Retrieve the user's custom CSS from localStorage
  const customCSS = localStorage.getItem('custom-css-content') || '';
  const { paperSize = 'A4', template } = resumeData;

  const processedUserCSS = processAndScopeUserCSS(customCSS);
  const fullCss = getCompleteCSS(template) + processedUserCSS;

  // FONT LOADING FIX: Use explicit font links instead of @import to ensure reliable loading
  const fontLinks = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Nunito:wght@300;400;600;700&family=Poppins:wght@400;500;600;700;800&family=Work+Sans:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Ubuntu:wght@300;400;500;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet">
  `;

  const finalCss = `
    ${fullCss}

    /* PDF-specific overrides */
    @page {
      size: ${paperSize === 'A4' ? 'A4' : 'letter'};
      margin: 0;
    }
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Hide print hint when actually printing */
    @media print {
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
    }

    /* Ensure print hint font is not overridden by resume template styles */
    .print-hint {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      font-weight: 400 !important;
      font-size: 12px !important;
      line-height: 1.4 !important;
    }

    /* Guarantee background colors span all printed pages by using a fixed pseudo-element */
    @media print {
      .resume-template::before {
        content: "";
        position: fixed;
        inset: 0;
        background: inherit !important; /* inherit background from resume wrapper */
        z-index: -1;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
    .resume-two-page-layout .resume-page-first {
      page-break-after: always !important;
    }
  `;

  const templateClasses = getTemplateClasses(resumeData);

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${fontLinks}
      <title>Resume - ${paperSize === 'A4' ? 'A4' : 'US Letter'} Format</title>
      <style id="pdf-styles">${finalCss}</style>
    </head>
    <body>
      <div class="resume-template ${templateClasses}" data-paper-size="${paperSize}">
        ${bodyHtml}
      </div>
      ${getPrintHintHtml()}
      <script>
        window.onload = () => {
          // Remove automatic print trigger - let user manually print when ready
          console.log('Preview ready. Use Ctrl+P (or Cmd+P) to print.');
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(fullHtml);
    printWindow.document.close();
  } else {
    alert('Could not open print window. Please disable your popup blocker and try again.');
  }
};

// Helper function to get template classes
const getTemplateClasses = (resumeData: ResumeData) => {
  const { template, isTwoColumn = false, isTwoPage = false, paperSize = 'A4' } = resumeData;
  let baseClass = '';
  if (isTwoPage) baseClass += ' resume-two-page-layout';
  if (isTwoColumn) baseClass += ' resume-two-column-layout';

  const paperSizeClass = paperSize === 'A4' ? 'a4-paper' : 'us-letter-paper';
  const templateClass = `template-${template}`;

  return `${baseClass} ${paperSizeClass} ${templateClass}`.trim();
};
