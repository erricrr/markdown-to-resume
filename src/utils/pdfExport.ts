import { marked } from 'marked';
import DOMPurify from 'dompurify';

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

  const htmlContent = getHtmlContent();
  const templateClasses = getTemplateClasses();

  // Create the complete HTML document with embedded CSS
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
      <style>
        /* Reset and base styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: white;
          color: #374151;
          line-height: 1.5;
        }

        /* Resume template base */
        .resume-template {
          width: 8.5in;
          min-height: 11in;
          margin: 0 auto;
          padding: 0.75in;
          background: white;
          box-shadow: none;
        }

        /* Typography */
        .resume-heading-1 { font-size: 2rem; font-weight: bold; color: #000; margin-bottom: 0.5rem; }
        .resume-heading-2 { font-size: 1.25rem; font-weight: 600; color: #000; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .resume-heading-3 { font-size: 1.125rem; font-weight: 500; color: #374151; margin-top: 1rem; margin-bottom: 0.5rem; }
        .resume-paragraph { margin-bottom: 0.75rem; line-height: 1.5; color: #374151; }
        .resume-strong { font-weight: 600; color: #000; }
        .resume-emphasis { font-style: italic; color: #374151; }
        .resume-link { color: #374151; text-decoration: underline; }
        .resume-hr { border: 0; border-top: 1px solid #d1d5db; margin: 1rem 0; }

        /* Lists */
        .resume-list {
          list-style: none;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }

        .resume-list-item {
          margin-bottom: 0.5rem;
          position: relative;
          padding-left: 1rem;
          text-indent: -1rem;
        }

        .resume-list-item::before {
          content: "• ";
          color: #000;
          font-weight: bold;
          display: inline-block;
          width: 0.5rem;
          margin-right: 0.5rem;
        }

        /* Two Column Layout */
        .resume-two-column-layout .resume-two-column {
          display: flex;
          flex-direction: column;
        }

        .resume-two-column-layout .resume-header {
          width: 100%;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #d1d5db;
        }

        .resume-two-column-layout .resume-header .resume-heading-1 {
          font-size: 1.5rem;
          text-align: center;
        }

        .resume-two-column-layout .resume-header .resume-paragraph {
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .resume-two-column-layout .resume-columns {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1.5rem;
        }

        .resume-two-column-layout .resume-column-left {
          padding-right: 1rem;
        }

        .resume-two-column-layout .resume-column-right {
          /* No additional padding needed */
        }

        .resume-two-column-layout .resume-column-left .resume-heading-1 {
          font-size: 1.25rem !important;
          line-height: 1.75rem !important;
        }

        .resume-two-column-layout .resume-column-left .resume-heading-2 {
          font-size: 1rem !important;
          line-height: 1.5rem !important;
          margin-top: 1rem !important;
          margin-bottom: 0.5rem !important;
        }

        .resume-two-column-layout .resume-column-left .resume-heading-3 {
          font-size: 0.875rem !important;
          line-height: 1.25rem !important;
          margin-top: 0.75rem !important;
          margin-bottom: 0.25rem !important;
        }

        .resume-two-column-layout .resume-column-right .resume-heading-2 {
          margin-top: 0 !important;
          margin-bottom: 0.75rem !important;
        }

        /* Two Page Layout */
        .resume-two-page-layout .resume-two-page {
          display: flex;
          flex-direction: column;
        }

        .resume-two-page-layout .resume-page-first {
          width: 6.5in;
          height: 9in;
          background: white;
          padding: 0;
          margin-bottom: 2rem;
          overflow: hidden;
          page-break-after: always;
          border: 1px solid #e5e7eb;
        }

        .resume-two-page-layout .resume-page-second {
          width: 6.5in;
          height: 9in;
          background: white;
          padding: 0;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        /* Template Styles */
        .template-professional .resume-heading-1 {
          border-bottom: 2px solid #d1d5db;
          padding-bottom: 0.5rem;
        }

        .template-professional .resume-heading-2 {
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .template-modern {
          background-color: #fefff3;
        }

        .template-modern .resume-heading-1 {
          font-weight: 300;
          font-size: 2.5rem;
        }

        .template-modern .resume-heading-2 {
          padding-left: 1rem;
          border-left: 4px solid #9ca3af;
        }

        .template-minimalist .resume-heading-1 {
          font-weight: 400;
          letter-spacing: 0.05em;
        }

        .template-minimalist .resume-heading-2 {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .template-creative {
          border-left: 8px solid #9ca3af;
        }

        .template-creative .resume-heading-2 {
          position: relative;
        }

        .template-creative .resume-heading-2::before {
          content: "";
          position: absolute;
          left: -1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 0.5rem;
          height: 0.5rem;
          background-color: #6b7280;
          border-radius: 50%;
        }

        .template-executive .resume-heading-1 {
          text-align: center;
        }

        .template-executive .resume-heading-2 {
          text-align: center;
          background-color: #f3f4f6;
          padding: 0.5rem;
        }

        /* Print styles */
        @media print {
          @page {
            size: A4;
            margin: 0.25in;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .resume-template {
            margin: 0 !important;
            padding: 0.25in !important;
            box-shadow: none !important;
            width: 100% !important;
            min-height: auto !important;
          }

          .resume-two-column-layout .resume-columns {
            display: grid !important;
            grid-template-columns: 1fr 2fr !important;
            gap: 1.5rem !important;
          }

          .resume-two-column-layout .resume-column-left {
            padding-right: 1rem !important;
          }
        }
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
