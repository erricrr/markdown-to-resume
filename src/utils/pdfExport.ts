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
      return dynamicStyleElement.textContent;
    } else {
      console.warn('⚠️ No dynamic CSS found, using fallback styles');
      return '';
    }
  };

  // NEW: Get ALL styles from the live preview to ensure exact consistency
  const getAllLivePreviewStyles = () => {
    console.log('🔍 Capturing ALL live preview styles for PDF consistency...');

    // Get all style elements from the page
    const allStyleElements = Array.from(document.querySelectorAll('style'));
    let allCSS = '';

    allStyleElements.forEach((styleEl, index) => {
      if (styleEl.textContent) {
        const source = styleEl.id || styleEl.getAttribute('data-source') || `style-${index}`;
        allCSS += `\n/* CAPTURED FROM: ${source} */\n${styleEl.textContent}\n`;
      }
    });

    // Also capture any inline styles from stylesheet links (though these should be in CSS files)
    const linkElements = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    linkElements.forEach((link) => {
      const href = (link as HTMLLinkElement).href;
      allCSS += `\n/* EXTERNAL STYLESHEET: ${href} */\n`;
    });

    console.log('📊 Captured total CSS for PDF:', allCSS.length, 'characters');
    return allCSS;
  };

  // NEW: Function to get print styles without @media print wrapper
  const getPrintStylesForPDF = () => {
    // Extract the content from inside @media print { ... }
    let printCSS = printStyles;

    // Remove @media print wrapper and closing brace
    printCSS = printCSS.replace(/@media print\s*\{/, '');
    printCSS = printCSS.replace(/\}\s*$/, '');

    console.log('🖨️ Extracted print styles for PDF:', printCSS.length, 'characters');
    return printCSS;
  };

  const htmlContent = getHtmlContent();
  const templateClasses = getTemplateClasses();
  const allLivePreviewCSS = getAllLivePreviewStyles();

  console.log('📄 PDF Export Info:');
  console.log('- Template:', resumeData.template);
  console.log('- Classes:', templateClasses);
  console.log('- Two Column:', resumeData.isTwoColumn);
  console.log('- Two Page:', resumeData.isTwoPage);
  console.log('- Total captured CSS length:', allLivePreviewCSS.length);

  const cssContent = `
/* Page settings for PDF */
@page {
  size: A4;
  margin: 0.25in 0.75in;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

/* ALL CSS CAPTURED FROM LIVE PREVIEW FOR EXACT CONSISTENCY */
${allLivePreviewCSS}

/* PDF-specific overrides to ensure proper printing */
body {
  margin: 0 !important;
  padding: 0 !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

/* Hide elements that shouldn't appear in PDF */
header, footer, .header, .footer {
  display: none !important;
}

body::before, body::after {
  display: none !important;
}

/* Final override with maximum specificity to ensure PDF matches preview exactly */
html body .resume-template {
  padding: 0.25in 0.75in !important;
  margin: 0 !important;
  box-shadow: none !important;
  background: white !important;
  width: 8.5in !important;
  min-height: 11in !important;
  box-sizing: border-box !important;
}

/* Force exact font rendering to match preview */
html body .resume-template * {
  -webkit-font-smoothing: auto !important;
  -moz-osx-font-smoothing: auto !important;
  text-rendering: optimizeLegibility !important;
}
`;

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
           COMPLETE CSS FROM SINGLE SOURCE OF TRUTH
           ======================================== */
        ${cssContent}
      </style>
    </head>
    <body>
      <div class="resume-template ${templateClasses}">
        ${htmlContent}
      </div>
      <script>
        // Auto-open print dialog after page loads
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
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
