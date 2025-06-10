import { forwardRef, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { ResumeTemplates } from '@/components/ResumeTemplates';

interface ResumePreviewProps {
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

// List of valid template IDs
const validTemplates = ['professional', 'modern', 'minimalist', 'creative', 'executive'] as const;

type TemplateType = typeof validTemplates[number];

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ markdown, leftColumn = '', rightColumn = '', header = '', summary = '', firstPage = '', secondPage = '', template: propTemplate, isTwoColumn = false, isTwoPage = false }, ref) => {
    // Ensure we always have a valid template
    const template: TemplateType = validTemplates.includes(propTemplate as TemplateType)
      ? propTemplate as TemplateType
      : 'professional';

    // Log template changes for debugging
    useEffect(() => {
      console.log('🔍 ResumePreview: Template set to', template);
    }, [template]);
    const parseMarkdown = (md: string) => {
      try {
        // Configure marked with basic options
        marked.setOptions({
          breaks: true,
          gfm: true,
        });

        // Parse markdown to HTML synchronously
        const html = marked.parse(md) as string;

        // Add resume classes to the HTML elements
        let processedHtml = html
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

        // Handle bullet points in table cells (content starting with "- " at the beginning)
        processedHtml = processedHtml.replace(
          /<td([^>]*class="resume-table-cell"[^>]*)>\s*-\s+([^<]*)<\/td>/g,
          '<td$1><span class="resume-table-bullet-item">$2</span></td>'
        );

        // Handle bullet points within paragraph tags in table cells (starting with "- ")
        processedHtml = processedHtml.replace(
          /<td([^>]*class="resume-table-cell"[^>]*)><p([^>]*)>\s*-\s+([^<]*)<\/p><\/td>/g,
          '<td$1><p$2><span class="resume-table-bullet-item">$3</span></p></td>'
        );

        return DOMPurify.sanitize(processedHtml);
      } catch (error) {
        console.error('Error parsing markdown:', error);
        return '<p>Error parsing markdown content</p>';
      }
    };

    const getHtmlContent = () => {
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

    const htmlContent = getHtmlContent();

    return (
      <div ref={ref} className="resume-container">
        <ResumeTemplates
          htmlContent={htmlContent}
          template={template}
          isTwoColumn={isTwoColumn}
          isTwoPage={isTwoPage}
          isPreview={true}
        />
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';
