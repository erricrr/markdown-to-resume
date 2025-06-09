import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { getCompleteCSS, printStyles } from '../styles/resumeTemplates';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
}

export const exportToPDF = async (resumeData: ResumeData) => {
  const parseMarkdown = (md: string) => {
    try {
      marked.setOptions({
        breaks: true,
        gfm: true,
      });

      const html = marked.parse(md) as string;

      // Add resume classes to the HTML elements
      const processedHtml = html
        .replace(/<h1([^>]*)>/g, '<h1$1 class="resume-heading-1">')
        .replace(/<h2([^>]*)>/g, '<h2$1 class="resume-heading-2">')
        .replace(/<h3([^>]*)>/g, '<h3$1 class="resume-heading-3">')
        .replace(/<h4([^>]*)>/g, '<h4$1 class="resume-heading-4">')
        .replace(/<h5([^>]*)>/g, '<h5$1 class="resume-heading-5">')
        .replace(/<h6([^>]*)>/g, '<h6$1 class="resume-heading-6">')
        .replace(/<p([^>]*)>/g, '<p$1 class="resume-paragraph">')
        .replace(/<ul([^>]*)>/g, '<ul$1 class="resume-list">')
        .replace(/<ol([^>]*)>/g, '<ol$1 class="resume-list">')
        .replace(/<li([^>]*)>/g, '<li$1 class="resume-list-item">')
        .replace(/<table([^>]*)>/g, '<table$1 class="resume-table">')
        .replace(/<thead([^>]*)>/g, '<thead$1 class="resume-table-head">')
        .replace(/<tbody([^>]*)>/g, '<tbody$1 class="resume-table-body">')
        .replace(/<tr([^>]*)>/g, '<tr$1 class="resume-table-row">')
        .replace(/<th([^>]*)>/g, '<th$1 class="resume-table-header">')
        .replace(/<td([^>]*)>/g, '<td$1 class="resume-table-cell">')
        .replace(/<hr([^>]*)>/g, '<hr$1 class="resume-hr">')
        .replace(/<strong([^>]*)>/g, '<strong$1 class="resume-strong">')
        .replace(/<em([^>]*)>/g, '<em$1 class="resume-emphasis">')
        .replace(/<a([^>]*)>/g, '<a$1 class="resume-link">')
        .replace(/<code([^>]*)>/g, '<code$1 class="resume-code">')
        .replace(/<pre([^>]*)>/g, '<pre$1 class="resume-code-block">')
        .replace(/<br([^>]*)>/g, '<br$1 class="resume-br">');

      return DOMPurify.sanitize(processedHtml);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return '<p>Error parsing markdown content</p>';
    }
  };

  const getHtmlContent = () => {
    const { markdown, leftColumn = '', rightColumn = '', header = '', summary = '', firstPage = '', secondPage = '', isTwoColumn = false, isTwoPage = false } = resumeData;

    if (isTwoPage && isTwoColumn) {
      // Combined mode: Two pages with two columns each
      const headerHtml = header ? parseMarkdown(header) : '';
      const summaryHtml = summary ? `<p class="resume-paragraph resume-summary">${summary}</p>` : '';
      const leftHtml = parseMarkdown(leftColumn);
      const rightHtml = parseMarkdown(rightColumn);
      const secondPageLeftHtml = parseMarkdown(firstPage);
      const secondPageRightHtml = parseMarkdown(secondPage);

      return `
        <div class="resume-two-page">
          <div class="resume-page-first">
            <div class="resume-two-column">
              ${headerHtml ? `<div class="resume-header">${headerHtml}</div>` : ''}
              ${summaryHtml ? `<div class="resume-summary-section">${summaryHtml}</div>` : ''}
              <div class="resume-columns">
                <div class="resume-column-left">
                  ${leftHtml}
                </div>
                <div class="resume-column-right">
                  ${rightHtml}
                </div>
              </div>
            </div>
          </div>
          <div class="resume-page-second">
            <div class="resume-two-column">
              <div class="resume-columns">
                <div class="resume-column-left">
                  ${secondPageLeftHtml}
                </div>
                <div class="resume-column-right">
                  ${secondPageRightHtml}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (isTwoPage) {
      const firstPageHtml = parseMarkdown(firstPage);
      const secondPageHtml = parseMarkdown(secondPage);
      return `
        <div class="resume-two-page">
          <div class="resume-page-first">
            ${firstPageHtml}
          </div>
          <div class="resume-page-second">
            ${secondPageHtml}
          </div>
        </div>
      `;
    } else if (isTwoColumn) {
      const headerHtml = header ? parseMarkdown(header) : '';
      const summaryHtml = summary ? `<p class="resume-paragraph resume-summary">${summary}</p>` : '';
      const leftHtml = parseMarkdown(leftColumn);
      const rightHtml = parseMarkdown(rightColumn);
      return `
        <div class="resume-two-column">
          ${headerHtml ? `<div class="resume-header">${headerHtml}</div>` : ''}
          ${summaryHtml ? `<div class="resume-summary-section">${summaryHtml}</div>` : ''}
          <div class="resume-columns">
            <div class="resume-column-left">
              ${leftHtml}
            </div>
            <div class="resume-column-right">
              ${rightHtml}
            </div>
          </div>
        </div>
      `;
    } else {
      return parseMarkdown(markdown);
    }
  };

  const getTemplateClasses = () => {
    const { template, isTwoColumn = false, isTwoPage = false } = resumeData;
    let baseClass = '';
    if (isTwoPage && isTwoColumn) {
      baseClass = 'resume-two-page-layout resume-two-column-layout';
    } else if (isTwoPage) {
      baseClass = 'resume-two-page-layout';
    } else if (isTwoColumn) {
      baseClass = 'resume-two-column-layout';
    }

    switch (template) {
      case 'professional':
        return `${baseClass} template-professional`;
      case 'modern':
        return `${baseClass} template-modern`;
      case 'minimalist':
        return `${baseClass} template-minimalist`;
      case 'creative':
        return `${baseClass} template-creative`;
      case 'executive':
        return `${baseClass} template-executive`;
      default:
        return `${baseClass} template-professional`;
    }
  };

  // Get any custom CSS that has been applied via the CSS editor
  const getDynamicCSS = () => {
    const dynamicStyleElement = document.getElementById('dynamic-template-css') as HTMLStyleElement;
    if (dynamicStyleElement && dynamicStyleElement.textContent) {
      console.log('🎨 Found dynamic CSS for PDF export:', dynamicStyleElement.textContent.length, 'characters');
      // Process the CSS to add !important to critical properties for PDF
      let processedCSS = dynamicStyleElement.textContent;

      // Add !important to common CSS properties that might not print
      const importantProperties = [
        'color', 'background-color', 'background', 'font-size', 'font-weight',
        'font-family', 'margin', 'padding', 'border', 'text-align', 'display',
        'grid-template-columns', 'flex-direction', 'justify-content', 'align-items'
      ];

      importantProperties.forEach(prop => {
        // Add !important if not already present
        const regex = new RegExp(`(${prop}\\s*:\\s*[^;!]+)(?!.*!important)`, 'gi');
        processedCSS = processedCSS.replace(regex, '$1 !important');
      });

      return processedCSS;
    } else {
      console.warn('⚠️ No dynamic CSS found, using fallback styles');
      return '';
    }
  };

  const htmlContent = getHtmlContent();
  const templateClasses = getTemplateClasses();
  const dynamicCSS = getDynamicCSS();

  console.log('📄 PDF Export Info:');
  console.log('- Template:', resumeData.template);
  console.log('- Classes:', templateClasses);
  console.log('- Two Column:', resumeData.isTwoColumn);
  console.log('- Two Page:', resumeData.isTwoPage);
  console.log('- Dynamic CSS length:', dynamicCSS.length);

  const cssContent = `
/* Reset and base styles */
* {
  box-sizing: border-box !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

/* Ensure custom CSS properties are honored in PDF */
@page {
  size: A4;
  margin: 0.25in 0.75in;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

/* Critical important styles that must be consistent */
.resume-template {
  padding: 0.25in 0.75in !important;
  width: 8.5in !important;
  min-height: 11in !important;
  box-sizing: border-box !important;
}

/* AGGRESSIVE SUMMARY SPACING FIXES - Override everything */
.resume-two-column-layout .resume-summary-section,
.resume-two-column-layout .resume-summary-section *,
.resume-two-column-layout .resume-heading-summary,
.resume-two-column-layout [class*="summary"] {
  margin: 0 !important;
  padding: 0 !important;
  page-break-after: avoid !important;
  break-after: avoid !important;
  page-break-before: avoid !important;
  break-before: avoid !important;
}

/* Force summary to be compact */
.resume-two-column-layout .resume-summary-section {
  margin-bottom: 0.125in !important;
  padding-bottom: 0 !important;
  line-height: 1.2 !important;
}

/* Remove all spacing around columns container */
.resume-two-column-layout .resume-columns {
  margin: 0 !important;
  padding: 0 !important;
  page-break-before: avoid !important;
  break-before: avoid !important;
  page-break-inside: auto !important;
  break-inside: auto !important;
}

/* Enhanced summary spacing control for two-column layouts */
.resume-two-column-layout .resume-columns > *:first-child,
.resume-two-column-layout .resume-column-left > *:first-child,
.resume-two-column-layout .resume-column-left .resume-heading-2:first-child,
.resume-two-column-layout .resume-columns .resume-heading-2:first-child {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

/* Two-page specific styling for margins */
.resume-two-page-layout .resume-page-first,
.resume-two-page-layout .resume-page-second {
  padding: 0.25in 0.75in !important;
  box-sizing: border-box !important;
}

.resume-two-page-layout .resume-page-first {
  page-break-after: always !important;
  margin-bottom: 0 !important;
}

.resume-two-page-layout .resume-page-second {
  margin-top: 0 !important;
  padding-top: 0.25in !important;
}

/* Fix for two-column layout */
.resume-two-column-layout .resume-columns {
  display: grid !important;
  grid-template-columns: 1fr 2fr !important;
  gap: 1in !important;
  align-items: start !important;
}

${printStyles}

/* DYNAMIC CSS FROM EDITOR - HIGHEST PRIORITY */
${dynamicCSS}

/* Override any conflicting styles with maximum specificity */
html body .resume-template {
  padding: 0.25in 0.75in !important;
  margin: 0 !important;
}
`;

  // Get the complete CSS from our single source of truth
  const baseCSS = getCompleteCSS(resumeData.template);

  // Create the complete HTML document with embedded CSS
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
      <style>
        /* ========================================
           BASE STYLES FROM SINGLE SOURCE OF TRUTH
           ======================================== */
        ${baseCSS}

/* ========================================
   DYNAMIC CSS FROM CSS EDITOR - HIGHEST PRIORITY
   This CSS comes from the live CSS editor and should override all default styles
   ======================================== */
${dynamicCSS}

/* Enhanced specificity version to ensure CSS works in PDF */
${dynamicCSS}

/* Additional PDF-specific overrides to ensure consistency */
${dynamicCSS ? `
/* Force dynamic styles to take precedence in PDF - Use correct margins */
.resume-template {
  padding: 0.25in 0.75in !important;
  width: 8.5in !important;
  min-height: 11in !important;
  box-sizing: border-box !important;
}

/* Ensure custom CSS properties are honored in PDF */
@page {
  size: A4;
  margin: 0.25in 0.75in;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

/* Two-page specific styling for margins */
.resume-two-page-layout .resume-page-first,
.resume-two-page-layout .resume-page-second {
  padding: 0.25in 0.75in !important;
  box-sizing: border-box !important;
}

.resume-two-page-layout .resume-page-first {
  page-break-after: always !important;
  margin-bottom: 0 !important;
}

.resume-two-page-layout .resume-page-second {
  page-break-before: always !important;
  margin-top: 0.25in !important;
}

/* Fix for two-column layout in PDF */
.resume-two-column-layout .resume-columns {
  display: grid !important;
  grid-template-columns: 1fr 2fr !important;
  gap: 1in !important;
}

/* Force all background colors and images to print */
* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

/* Override any template-specific paddings */
.resume-template.template-professional,
.resume-template.template-modern,
.resume-template.template-minimalist,
.resume-template.template-executive,
.resume-template.template-creative {
  padding: 0.25in 0.75in !important;
}
` : ''}

      </style>
    </head>
    <body>
      <div class="resume-template ${templateClasses}">
        ${htmlContent}
      </div>
      <script>
        // Auto-open print dialog after page loads
        window.onload = function() {
          // Try to disable headers and footers if possible
          if (window.chrome && window.chrome.webstore) {
            // Chrome-specific: attempt to set print options
            const printOptions = {
              headerFooterEnabled: false,
              marginsType: 1, // No margins
              isLandscape: false,
              shouldPrintBackgrounds: true,
              shouldPrintSelectionOnly: false
            };
          }

          setTimeout(function() {
            window.print();
          }, 500);
        };

        // Additional attempt to hide headers/footers
        document.addEventListener('DOMContentLoaded', function() {
          // Set page title to empty to minimize header content
          document.title = '';
        });
      </script>
    </body>
    </html>
  `;

    // Open in new window
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(fullHtml);
    printWindow.document.close();
  } else {
    throw new Error('Could not open print window. Please check your popup blocker settings.');
  }
};
