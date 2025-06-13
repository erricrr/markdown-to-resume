import { getCompleteCSS } from '../styles/resumeTemplates';
import { generateCompleteResumeHTML, type ResumeContentData } from './resumeContentGenerator';

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
  // Use the shared utility to generate the resume's body HTML
  const bodyHtml = generateCompleteResumeHTML(resumeData as ResumeContentData);

  // Get all <link> and <style> tags from the main document's head
  const headContent = document.head.innerHTML;

  // Get any dynamic CSS that has been applied via the CSS editor
  const getDynamicCSS = () => {
    const dynamicStyleElement = document.getElementById('dynamic-template-css') as HTMLStyleElement;
    return dynamicStyleElement ? dynamicStyleElement.textContent : '';
  };

  const baseCSS = getCompleteCSS(resumeData.template);
  const dynamicCSS = getDynamicCSS();
  const { paperSize = 'A4' } = resumeData;

  // Combine base styles with dynamic (user-edited) styles
  const fullCss = `
    ${baseCSS}
    ${dynamicCSS}

    /* PDF-specific overrides */
    @page {
      size: ${paperSize === 'A4' ? 'A4' : 'letter'};
      margin: 0;
    }
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    /* Critical fixes for two-page layouts */
    .resume-two-page-layout {
      overflow: visible !important;
    }
    .resume-two-page-layout .resume-page-first {
      page-break-after: always !important;
      break-after: page !important;
      min-height: ${paperSize === 'A4' ? '11.69in' : '11in'} !important;
    }
    .resume-two-page-layout .resume-page-second {
      page-break-before: always !important;
      break-before: page !important;
      min-height: ${paperSize === 'A4' ? '11.69in' : '11in'} !important;
    }
  `;

  const templateClasses = getTemplateClasses(resumeData);

  // Create the complete HTML document for the new window
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      ${headContent}
      <title>Resume - ${paperSize === 'A4' ? 'A4' : 'US Letter'} Format</title>
      <style id="pdf-styles">
        ${fullCss}
      </style>
    </head>
    <body>
      <div class="resume-template ${templateClasses}" data-paper-size="${paperSize}">
        ${bodyHtml}
      </div>
      <script>
        window.onload = function() {
          // Wait for all resources, including fonts, to load before printing
          Promise.all(Array.from(document.fonts).map(font => font.load())).then(() => {
            setTimeout(() => {
              window.print();
            }, 800); // A small delay ensures rendering completes
          }).catch(err => {
            console.error('Error loading fonts:', err);
            window.print(); // Print anyway on error
          });
        };
      </script>
    </body>
    </html>
  `;

  // Open the HTML in a new window and trigger the print dialog
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(fullHtml);
    printWindow.document.close();
  } else {
    alert('Could not open print window. Please disable your popup blocker and try again.');
  }
};

// Helper function to get template classes (moved outside the main function)
const getTemplateClasses = (resumeData: ResumeData) => {
  const { template, isTwoColumn = false, isTwoPage = false, paperSize = 'A4' } = resumeData;
  let baseClass = '';
  if (isTwoPage && isTwoColumn) {
    baseClass = 'resume-two-page-layout resume-two-column-layout';
  } else if (isTwoPage) {
    baseClass = 'resume-two-page-layout';
  } else if (isTwoColumn) {
    baseClass = 'resume-two-column-layout';
  }

  const paperSizeClass = paperSize === 'A4' ? 'a4-paper' : '';
  const templateClass = `template-${template}`;

  return `${baseClass} ${paperSizeClass} ${templateClass}`.trim();
};
