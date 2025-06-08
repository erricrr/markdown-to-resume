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
          width: 0.3rem;
          margin-right: 0.3rem;
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

        /* PROFESSIONAL TEMPLATE - Modern Corporate */
        .template-professional {
          background: white;
          font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .template-professional .resume-heading-1 {
          font-size: 2.75rem;
          font-weight: 800;
          color: #000;
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 4px solid #6b7280 !important;
          letter-spacing: 0.1em;
          line-height: 1.1;
          text-transform: uppercase;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-professional .resume-heading-2 {
          font-size: 1.125rem;
          font-weight: 700;
          color: #000;
          margin-top: 2rem;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
        }

        .template-professional .resume-heading-2::after {
          content: "";
          position: absolute;
          bottom: -0.25rem;
          left: 0;
          width: 2rem;
          height: 2px;
          background-color: #6b7280 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          display: block !important;
        }

        .template-professional .resume-heading-3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #000;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .template-professional .resume-paragraph {
          font-size: 1rem;
          margin-bottom: 0.875rem;
          color: #374151;
          line-height: 1.6;
        }

        .template-professional .resume-list {
          margin-bottom: 1.25rem;
          margin-left: 1rem;
          padding-left: 0.8rem;
        }

        .template-professional .resume-list-item {
          font-size: 1rem;
          margin-bottom: 0.625rem;
          color: #374151;
          padding-left: 0.8rem;
          text-indent: -0.8rem;
          line-height: 1.5;
        }

        .template-professional .resume-strong {
          font-weight: 600;
          color: #000;
        }

        .template-professional .resume-emphasis {
          font-style: italic;
          color: #6b7280;
        }

        .template-professional .resume-hr {
          border-color: #e5e7eb;
          margin: 1.5rem 0;
        }

        /* MODERN TEMPLATE - Tech Professional */
        .template-modern {
          background: white;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .template-modern .resume-heading-1 {
          font-size: 2.25rem;
          font-weight: 600;
          color: #000;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          line-height: 1.1;
          position: relative;
        }

        .template-modern .resume-heading-1::after {
          content: "";
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          width: 4rem;
          height: 3px;
          background-color: #000 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-modern .resume-heading-2 {
          font-size: 1.125rem;
          font-weight: 700;
          color: #000;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-modern .resume-heading-3 {
          font-size: 1rem;
          font-weight: 600;
          color: #000;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .template-modern .resume-paragraph {
          font-size: 1rem;
          margin-bottom: 0.75rem;
          color: #374151;
          line-height: 1.5;
          font-weight: 400;
        }

        .template-modern .resume-list {
          margin-bottom: 1rem;
          margin-left: 1rem;
          padding-left: 0.8rem;
        }

        .template-modern .resume-list-item {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: #374151;
          padding-left: 0.8rem;
          text-indent: -0.8rem;
          line-height: 1.4;
          font-weight: 400;
        }

        .template-modern .resume-list-item::before {
          content: "▪" !important;
          color: #000 !important;
          font-weight: 700;
          margin-right: 0.5rem;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          display: inline-block !important;
        }

        .template-modern .resume-strong {
          font-weight: 600;
          color: #000;
        }

        .template-modern .resume-emphasis {
          font-weight: 500;
          color: #6b7280;
        }

        .template-modern .resume-hr {
          border: none;
          height: 2px;
          background: #000 !important;
          margin: 1.25rem 0;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* MINIMALIST TEMPLATE - Clean Professional */
        .template-minimalist {
          background: white;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .template-minimalist .resume-heading-1 {
          font-size: 2rem;
          font-weight: 500;
          color: #000;
          margin-bottom: 1.25rem;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .template-minimalist .resume-heading-2 {
          font-size: 1rem;
          font-weight: 600;
          color: #000;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .template-minimalist .resume-heading-3 {
          font-size: 1rem;
          font-weight: 600;
          color: #000;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .template-minimalist .resume-paragraph {
          font-size: 1rem;
          margin-bottom: 0.75rem;
          color: #374151;
          line-height: 1.5;
          font-weight: 400;
        }

        .template-minimalist .resume-list {
          margin-bottom: 1rem;
          margin-left: 0;
          padding-left: 0.8rem;
        }

        .template-minimalist .resume-list-item {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: #374151;
          font-weight: 400;
          padding-left: 0.8rem;
          text-indent: -0.8rem;
          line-height: 1.4;
        }

        .template-minimalist .resume-list-item::before {
          content: "–" !important;
          color: #6b7280 !important;
          font-weight: 400;
          margin-right: 0.5rem;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          display: inline-block !important;
        }

        .template-minimalist .resume-strong {
          font-weight: 600;
          color: #000;
        }

        .template-minimalist .resume-emphasis {
          font-weight: 500;
          color: #6b7280;
        }

        .template-minimalist .resume-hr {
          border: none;
          height: 1px;
          background-color: #e5e7eb !important;
          margin: 1.5rem 0;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* CREATIVE TEMPLATE - Modern Edge */
        .template-creative {
          background: white;
          border-left: 8px solid #000 !important;
          font-family: 'Montserrat', 'Helvetica Neue', sans-serif;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-creative .resume-heading-1 {
          font-size: 2.25rem;
          font-weight: 700;
          color: #000;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          line-height: 1.1;
          position: relative;
        }

        .template-creative .resume-heading-1::after {
          content: "";
          position: absolute;
          bottom: -0.25rem;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, #000, #6b7280, transparent) !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-creative .resume-heading-2 {
          font-size: 1.125rem;
          font-weight: 700;
          color: #000;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          position: relative;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding-left: 1.5rem;
        }

        .template-creative .resume-heading-2::before {
          content: "■" !important;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          color: #000 !important;
          font-size: 0.7rem !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          display: inline-block !important;
        }

        .template-creative .resume-heading-3 {
          font-size: 1rem;
          font-weight: 600;
          color: #000;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .template-creative .resume-paragraph {
          font-size: 1rem;
          margin-bottom: 0.75rem;
          color: #374151;
          line-height: 1.5;
          font-weight: 400;
        }

        .template-creative .resume-list {
          margin-bottom: 1rem;
          margin-left: 1rem;
          padding-left: 0.8rem;
        }

        .template-creative .resume-list-item {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: #374151;
          padding-left: 0.8rem;
          text-indent: -0.8rem;
          line-height: 1.4;
          font-weight: 400;
        }

        .template-creative .resume-list-item::before {
          content: "●" !important;
          color: #000 !important;
          font-weight: 700;
          margin-right: 0.5rem;
          font-size: 0.6rem;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          display: inline-block !important;
        }

        .template-creative .resume-strong {
          font-weight: 700;
          color: #000;
        }

        .template-creative .resume-emphasis {
          font-weight: 600;
          color: #6b7280;
        }

        .template-creative .resume-hr {
          border: none;
          height: 2px;
          background: #000 !important;
          margin: 1.25rem 0;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* EXECUTIVE TEMPLATE - Corporate Leadership */
        .template-executive {
          background: white;
          font-family: 'Source Sans Pro', 'Helvetica Neue', sans-serif;
        }

        .template-executive .resume-heading-1 {
          font-size: 2.25rem;
          font-weight: 600;
          color: #000;
          margin-bottom: 1rem;
          text-align: center;
          letter-spacing: -0.01em;
          line-height: 1.2;
          border-bottom: 2px solid #000 !important;
          padding-bottom: 0.75rem;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-executive .resume-heading-2 {
          font-size: 1.125rem;
          font-weight: 700;
          color: #000;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          text-align: left;
          background-color: #f8f9fa !important;
          padding: 0.5rem 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-left: 4px solid #000 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .template-executive .resume-heading-3 {
          font-size: 1rem;
          font-weight: 600;
          color: #000;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .template-executive .resume-paragraph {
          font-size: 1rem;
          margin-bottom: 0.75rem;
          color: #374151;
          line-height: 1.5;
          font-weight: 400;
        }

        .template-executive .resume-list {
          margin-bottom: 1rem;
          margin-left: 1rem;
          padding-left: 0.8rem;
        }

        .template-executive .resume-list-item {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: #374151;
          padding-left: 0.8rem;
          text-indent: -0.8rem;
          line-height: 1.4;
          font-weight: 400;
        }

        .template-executive .resume-list-item::before {
          content: "▪" !important;
          color: #000 !important;
          font-weight: 700;
          margin-right: 0.5rem;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          display: inline-block !important;
        }

        .template-executive .resume-strong {
          font-weight: 700;
          color: #000;
        }

        .template-executive .resume-emphasis {
          font-weight: 600;
          color: #6b7280;
        }

        .template-executive .resume-hr {
          border: none;
          height: 1px;
          background-color: #000 !important;
          margin: 1.25rem 0;
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
          /* MAIN PAGE MARGINS - All pages except first */
          @page {
            size: A4;
            margin: 0.75in 0.5in 0.75in 0.5in; /* top right bottom left - second page and beyond */
            /* Hide headers and footers */
            @top-left { content: ""; }
            @top-center { content: ""; }
            @top-right { content: ""; }
            @bottom-left { content: ""; }
            @bottom-center { content: ""; }
            @bottom-right { content: ""; }
          }

          /* FIRST PAGE MARGINS - More top margin, double left/right margins */
          @page :first {
            margin: 0.5in 0.5in 0.75in 0.5in; /* top right bottom left - first page with more top margin */
            /* Hide headers and footers on first page */
            @top-left { content: ""; }
            @top-center { content: ""; }
            @top-right { content: ""; }
            @bottom-left { content: ""; }
            @bottom-center { content: ""; }
            @bottom-right { content: ""; }
          }

          /* Remove default print headers and footers */
          body::before,
          body::after {
            display: none !important;
          }

          /* Hide any potential header/footer elements */
          header, footer, .header, .footer {
            display: none !important;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .resume-template {
            margin: 0 !important;
            padding: 0 !important; /* No padding - margins handled by @page rules */
            box-shadow: none !important;
            width: 100% !important;
            min-height: auto !important;
          }

          /* Force page breaks for two-page layouts - no padding, margins handled by @page */
          .resume-two-page-layout .resume-page-first {
            padding: 0 !important;
            margin: 0 !important;
            page-break-after: always !important;
            min-height: calc(11in - 1.75in) !important; /* account for first page margins */
          }

          .resume-two-page-layout .resume-page-second {
            padding: 0 !important;
            margin: 0 !important;
            page-break-before: always !important;
            min-height: calc(11in - 1.5in) !important; /* account for second page margins */
          }

          .resume-two-column-layout .resume-columns {
            display: grid !important;
            grid-template-columns: 1fr 2fr !important;
            gap: 1.5rem !important;
          }

          .resume-two-column-layout .resume-column-left {
            padding-right: 1rem !important;
          }

          /* Force all styling to print - Enhanced */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Ensure all pseudo-elements print */
          *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            display: block !important;
          }

          /* Force all borders and backgrounds to print */
          .template-professional .resume-heading-1 {
            border-bottom: 4px solid #6b7280 !important;
          }

          .template-professional .resume-heading-2::after {
            background-color: #6b7280 !important;
          }

          .template-modern .resume-heading-2 {
            border-left: 6px solid #000 !important;
          }

          .template-modern .resume-hr {
            background: #000 !important;
          }

          .template-creative {
            border-left: 12px solid #000 !important;
          }

          .template-creative .resume-hr {
            background: #000 !important;
          }

          .template-executive .resume-heading-2 {
            background-color: #f8f9fa !important;
            border-top: 2px solid #000 !important;
            border-bottom: 2px solid #000 !important;
          }

          .template-executive .resume-hr {
            background-color: #000 !important;
          }

          .template-minimalist .resume-hr {
            background-color: #f3f4f6 !important;
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
