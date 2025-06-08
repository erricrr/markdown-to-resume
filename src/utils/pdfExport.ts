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

  // Get any custom CSS that has been applied via the CSS editor
  const getDynamicCSS = () => {
    const dynamicStyleElement = document.getElementById('dynamic-template-css') as HTMLStyleElement;
    return dynamicStyleElement ? dynamicStyleElement.textContent || '' : '';
  };

  const htmlContent = getHtmlContent();
  const templateClasses = getTemplateClasses();
  const dynamicCSS = getDynamicCSS();

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

        /* Base Typography */
        .resume-heading-1 { font-size: 2rem; font-weight: bold; color: #000; margin-bottom: 0.5rem; }
        .resume-heading-2 { font-size: 1.25rem; font-weight: 600; color: #000; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .resume-heading-3 { font-size: 1.125rem; font-weight: 500; color: #374151; margin-top: 1rem; margin-bottom: 0.5rem; }
        .resume-paragraph { margin-bottom: 0.75rem; line-height: 1.5; color: #374151; }
        .resume-strong { font-weight: 600; color: #000; }
        .resume-emphasis { font-style: italic; color: #374151; }
        .resume-link { color: #374151; text-decoration: underline; }
        .resume-hr { border: 0; border-top: 1px solid #d1d5db; margin: 1rem 0; }
        .resume-code { background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875rem; font-family: monospace; }

        /* Base Lists */
        .resume-list {
          list-style: none;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          margin-left: 1rem;
        }

        .resume-list-item {
          margin-bottom: 0.5rem;
          position: relative;
          padding-left: 0.8rem;
          text-indent: -0.8rem;
        }

        .resume-list-item::before {
          content: "• " !important;
          color: #000 !important;
          font-weight: bold;
          display: inline-block !important;
          width: 0.5rem;
          margin-right: 0.5rem;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Tables */
        .resume-table {
          width: 100%;
          margin-bottom: 1rem;
          border-collapse: collapse;
        }

        .resume-table-header {
          padding: 0.75rem;
          font-weight: 600;
          text-align: left;
        }

        .resume-table-cell {
          padding: 0.75rem;
          vertical-align: top;
        }

        /* PROFESSIONAL TEMPLATE - Corporate Excellence */
        .template-professional {
          background: white;
          font-family: 'Georgia', 'Times New Roman', serif;
        }

        .template-professional .resume-heading-1 {
          font-size: 2.5rem;
          font-weight: 400;
          color: #1a202c;
          margin-bottom: 0.75rem;
          text-align: center;
          letter-spacing: 0.02em;
          line-height: 1.2;
          position: relative;
          padding-bottom: 1rem;
        }

        .template-professional .resume-heading-1::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background: #2d3748 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-professional .resume-heading-2 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #2d3748;
          margin-top: 2rem;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
          padding-left: 20px;
          border-left: 4px solid #2d3748 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-professional .resume-heading-3 {
          font-size: 1rem;
          font-weight: 600;
          color: #2d3748;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .template-professional .resume-paragraph {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .template-professional .resume-list-item::before {
          content: "▪" !important;
          color: #2d3748 !important;
          font-weight: bold;
          margin-right: 0.5rem;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* MODERN TEMPLATE - Tech Innovation */
        .template-modern {
          background: white;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
        }

        .template-modern::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%) !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-modern .resume-heading-1 {
          font-size: 2.75rem;
          font-weight: 200;
          color: #1a202c;
          margin-bottom: 1rem;
          margin-left: 2rem;
          letter-spacing: -0.02em;
          line-height: 1.1;
          position: relative;
        }

        .template-modern .resume-heading-1::after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 80px;
          height: 2px;
          background: #667eea !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-modern .resume-heading-2 {
          font-size: 1.25rem;
          font-weight: 500;
          color: #667eea;
          margin-top: 2rem;
          margin-bottom: 1rem;
          margin-left: 2rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          position: relative;
        }

        .template-modern .resume-heading-2::before {
          content: "";
          position: absolute;
          left: -1.5rem;
          top: 50%;
          transform: translateY(-50%);
          width: 10px;
          height: 10px;
          background: #667eea !important;
          border-radius: 50%;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-modern .resume-heading-3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #2d3748;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          margin-left: 2rem;
        }

        .template-modern .resume-paragraph {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 1rem;
          margin-left: 2rem;
        }

        .template-modern .resume-list {
          margin-left: 2rem;
        }

        .template-modern .resume-list-item::before {
          content: "→" !important;
          color: #667eea !important;
          font-weight: bold;
          margin-right: 0.5rem;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* MINIMALIST TEMPLATE - Pure Elegance */
        .template-minimalist {
          background: white;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .template-minimalist .resume-heading-1 {
          font-size: 2.25rem;
          font-weight: 100;
          color: #1a202c;
          margin-bottom: 2rem;
          text-align: center;
          letter-spacing: 0.15em;
          line-height: 1.3;
          position: relative;
          padding-bottom: 1.5rem;
        }

        .template-minimalist .resume-heading-1::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 1px;
          background: #718096 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-minimalist .resume-heading-2 {
          font-size: 0.875rem;
          font-weight: 400;
          color: #718096;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          text-align: center;
          position: relative;
          padding: 0 2rem;
        }

        .template-minimalist .resume-heading-2::before,
        .template-minimalist .resume-heading-2::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 1.5rem;
          height: 1px;
          background: #e2e8f0 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-minimalist .resume-heading-2::before {
          left: 0;
        }

        .template-minimalist .resume-heading-2::after {
          right: 0;
        }

        .template-minimalist .resume-heading-3 {
          font-size: 1rem;
          font-weight: 400;
          color: #2d3748;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          letter-spacing: 0.02em;
        }

        .template-minimalist .resume-paragraph {
          color: #4a5568;
          line-height: 1.7;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .template-minimalist .resume-list-item::before {
          content: "◦" !important;
          color: #cbd5e1 !important;
          margin-right: 0.75rem;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* CREATIVE TEMPLATE - Bold Innovation */
        .template-creative {
          background: white;
          font-family: 'Montserrat', sans-serif;
          position: relative;
        }

        .template-creative::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 12px;
          background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #ffeaa7 100%) !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-creative .resume-heading-1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3436;
          margin-top: 2rem;
          margin-bottom: 1rem;
          letter-spacing: -0.025em;
          line-height: 1.1;
          position: relative;
        }

        .template-creative .resume-heading-1::after {
          content: "";
          position: absolute;
          bottom: -12px;
          left: 0;
          width: 120px;
          height: 4px;
          background: #ff6b6b !important;
          border-radius: 2px;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-creative .resume-heading-2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #4ecdc4;
          margin-top: 2rem;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          position: relative;
          padding-left: 2.5rem;
        }

        .template-creative .resume-heading-2::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 6px;
          background: linear-gradient(180deg, #ff6b6b 0%, #4ecdc4 100%) !important;
          border-radius: 3px;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-creative .resume-heading-3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #2d3436;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          position: relative;
          padding-left: 1.5rem;
        }

        .template-creative .resume-heading-3::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: #45b7d1 !important;
          border-radius: 50%;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-creative .resume-paragraph {
          color: #636e72;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .template-creative .resume-list-item::before {
          content: "▸" !important;
          color: #ff6b6b !important;
          font-weight: bold;
          margin-right: 0.5rem;
          font-size: 0.8rem;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* EXECUTIVE TEMPLATE - Leadership Excellence */
        .template-executive {
          background: white;
          font-family: 'Source Sans Pro', sans-serif;
          position: relative;
        }

        .template-executive::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 8px;
          background: #2c3e50 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-executive .resume-heading-1 {
          font-size: 2.75rem;
          font-weight: 300;
          color: #2c3e50;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
          text-align: center;
          letter-spacing: 0.05em;
          line-height: 1.2;
          position: relative;
          padding-bottom: 1.5rem;
        }

        .template-executive .resume-heading-1::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 3px;
          background: #e67e22 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-executive .resume-heading-2 {
          font-size: 1rem;
          font-weight: 700;
          color: white;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          background: #2c3e50 !important;
          padding: 1rem 2rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-executive .resume-heading-2::after {
          content: "";
          position: absolute;
          right: -15px;
          top: 0;
          width: 0;
          height: 0;
          border-left: 15px solid #2c3e50 !important;
          border-top: 25px solid transparent;
          border-bottom: 25px solid transparent;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-executive .resume-heading-3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #2c3e50;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          position: relative;
          padding-left: 1.25rem;
        }

        .template-executive .resume-heading-3::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          background: #e67e22 !important;
          border-radius: 50%;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-executive .resume-paragraph {
          color: #34495e;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .template-executive .resume-list-item::before {
          content: "▪" !important;
          color: #e67e22 !important;
          font-weight: bold;
          margin-right: 0.5rem;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Two Column Layout */
        .resume-two-column-layout .resume-two-column {
          display: flex;
          flex-direction: column;
        }

        .resume-two-column-layout .resume-header {
          width: 100%;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
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

        /* Custom CSS from CSS Editor */
        ${dynamicCSS}

        /* Print styles */
        @media print {
          @page {
            size: A4;
            margin: 0.75in 0.5in 0.75in 0.5in;
          }

          @page :first {
            margin: 0.75in 0.5in 0.75in 0.5in;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .resume-template {
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            width: 100% !important;
            min-height: auto !important;
          }

          /* Force all styling to print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            display: block !important;
          }

          /* Ensure all decorative elements print with exact colors */
          .template-professional .resume-heading-1::after {
            background: #2d3748 !important;
          }

          .template-professional .resume-heading-2 {
            border-left: 4px solid #2d3748 !important;
          }

          .template-modern::before {
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%) !important;
          }

          .template-modern .resume-heading-1::after {
            background: #667eea !important;
          }

          .template-modern .resume-heading-2::before {
            background: #667eea !important;
          }

          .template-minimalist .resume-heading-1::after {
            background: #718096 !important;
          }

          .template-minimalist .resume-heading-2::before,
          .template-minimalist .resume-heading-2::after {
            background: #e2e8f0 !important;
          }

          .template-creative::before {
            background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #ffeaa7 100%) !important;
          }

          .template-creative .resume-heading-1::after {
            background: #ff6b6b !important;
          }

          .template-creative .resume-heading-2::before {
            background: linear-gradient(180deg, #ff6b6b 0%, #4ecdc4 100%) !important;
          }

          .template-creative .resume-heading-3::before {
            background: #45b7d1 !important;
          }

          .template-executive::before {
            background: #2c3e50 !important;
          }

          .template-executive .resume-heading-1::after {
            background: #e67e22 !important;
          }

          .template-executive .resume-heading-2 {
            background: #2c3e50 !important;
          }

          .template-executive .resume-heading-2::after {
            border-left-color: #2c3e50 !important;
          }

          .template-executive .resume-heading-3::before {
            background: #e67e22 !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="resume-template ${templateClasses}">
        ${htmlContent}
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };

        document.addEventListener('DOMContentLoaded', function() {
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
