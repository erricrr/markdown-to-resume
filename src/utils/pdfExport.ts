import { getCompleteCSS, baseResumeStyles, templateStyles, fontImports } from '../styles/resumeTemplates';
import { generateCompleteResumeHTML, type ResumeContentData } from './resumeContentGenerator';

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

  // --- Replicate the exact style generation logic from useDynamicCSS ---
  // 1. Start with the base styles for all resumes.
  const baseCSS = baseResumeStyles;
  // 2. Add the styles for the currently selected template.
  const selectedTemplateCSS = templateStyles[template] || '';
  // 3. Add the user's custom CSS, processed to have higher specificity.
  const scopedUserCSS = processAndScopeUserCSS(customCSS);
  // --- End of replicated logic ---

  const fullCss = `
    ${fontImports}
    ${baseCSS}
    ${selectedTemplateCSS}
    ${scopedUserCSS}

    /* PDF-specific overrides */
    @page {
      size: ${paperSize === 'A4' ? 'A4' : 'letter'};
      margin: 0;
    }
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
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
      ${headLinks}
      <title>Resume - ${paperSize === 'A4' ? 'A4' : 'US Letter'} Format</title>
      <style id="pdf-styles">${fullCss}</style>
    </head>
    <body>
      <div class="resume-template ${templateClasses}" data-paper-size="${paperSize}">
        ${bodyHtml}
      </div>
      <script>
        window.onload = () => {
          setTimeout(() => window.print(), 500); // Delay to ensure fonts and styles render
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
