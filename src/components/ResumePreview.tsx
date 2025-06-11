import { forwardRef, useEffect, useState, useRef, MutableRefObject } from 'react';
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
  paperSize?: 'A4' | 'US_LETTER';
  uploadedFileUrl?: string;
  uploadedFileName?: string;
}

// List of valid template IDs
const validTemplates = ['professional', 'modern', 'minimalist', 'creative', 'executive'] as const;

type TemplateType = typeof validTemplates[number];

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ markdown, leftColumn = '', rightColumn = '', header = '', summary = '', firstPage = '', secondPage = '', template: propTemplate, isTwoColumn = false, isTwoPage = false, paperSize = 'A4', uploadedFileUrl = '', uploadedFileName = '' }, ref) => {
    // Ensure we always have a valid template
    const template: TemplateType = validTemplates.includes(propTemplate as TemplateType)
      ? propTemplate as TemplateType
      : 'professional';

    // Add state to force re-render on container resize
    const [containerWidth, setContainerWidth] = useState(0);
    const localRef = useRef<HTMLDivElement>(null);
    const resolvedRef = ref || localRef;

    // Log template changes for debugging
    useEffect(() => {
      console.log('🔍 ResumePreview: Template set to', template);
    }, [template]);

    // Set up resize observer to detect container width changes
    useEffect(() => {
      // Get the current element from the ref
      const element = (resolvedRef as MutableRefObject<HTMLDivElement | null>).current;
      if (!element) return;

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          if (width !== containerWidth) {
            setContainerWidth(width);
          }
        }
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    }, [resolvedRef, containerWidth]);

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
          .replace(/<br([^>]*)>/g, '<br$1 class="resume-br">')
          // If an <img> tag has a relative src (does not start with http, https, data:, or /),
          // rewrite it so it points to the public root. This prevents broken images when the
          // app is served from a nested route such as /markdown or /html.
          .replace(/<img([^>]*)src="([^\"]+)"([^>]*)>/g, (match, before, src, after) => {
            if (/^(https?:|data:|\/)/.test(src)) {
              return match; // already absolute or external
            }
            return `<img${before}src="/${src}"${after}>`;
          });

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

        // Allow inline style attributes so users can add custom spacing or sizing (e.g. padding on images)
        // The additional attributes are strictly sanitized by DOMPurify, so only safe CSS values are kept.
        // @ts-ignore – ADD_ATTR may not exist on older DOMPurify typings but is supported at runtime.
        return DOMPurify.sanitize(processedHtml, { ADD_ATTR: ['style'] });
      } catch (error) {
        console.error('Error parsing markdown:', error);
        return '<p>Error parsing markdown content</p>';
      }
    };

    // ====================
    // Header post-processing
    // ====================
    /**
     * Converts the raw header markdown into structured HTML so we can style
     * the individual contact items (role, email, phone, etc.) more elegantly.
     *
     * Expected author input (but not strictly required):
     *   # John Doe             ← name (H1)
     *   **Software Engineer** | john@email.com | (+1) 555-555-5555
     *
     * The first line becomes the H1. Everything after the first line is split
     * by the pipe character (|) and wrapped in <span class="resume-contact-item">.
     * Separators receive <span class="resume-contact-separator"> for styling.
     */
    const processHeaderMarkdown = (headerMd: string) => {
      if (!headerMd) return '';

      const lines = headerMd.trim().split('\n');
      const titleLine = lines[0] || '';
      const remaining = lines.slice(1).join(' ').trim();

      // Convert title (usually "# Name") to HTML
      const titleHtml = parseMarkdown(titleLine);

      let contactInfoHtml = '';
      if (remaining) {
        const items = remaining.split('|').map((it) => it.trim()).filter(Boolean);
        if (items.length) {
          const itemsHtml = items
            .map((it) => `<span class="resume-contact-item">${parseMarkdown(it)}</span>`)
            .join('<span class="resume-contact-separator">|</span>');

          contactInfoHtml = `<div class="resume-contact-info">${itemsHtml}</div>`;
        }
      }

      return `${titleHtml}${contactInfoHtml}`;
    };

    const getHtmlContent = () => {
      if (isTwoPage && isTwoColumn) {
        // Combined mode: Two pages with two columns each
        const headerHtml = header ? processHeaderMarkdown(header) : '';
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
        const headerHtml = header ? processHeaderMarkdown(header) : '';
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
        // Single-column, single-page mode
        return parseMarkdown(markdown);
      }
    };

    const htmlContent = getHtmlContent();

    /*
     * Smarter handling for uploaded files:
     *   • If the uploaded asset is an image (jpg / jpeg / png / gif / webp), treat it as a profile picture / avatar.
     *     – If the user already embedded this exact URL manually, do nothing (avoids duplicates).
     *     – Otherwise try to place it right after the opening header container so it appears in the expected spot.
     *   • For any other kind of file (pdf, docx, etc.) keep the old behaviour and append it to the end.
     */
    const imageRegex = /\.(jpe?g|png|gif|webp)$/i;
    const isImageFile = (!!uploadedFileUrl && imageRegex.test(uploadedFileUrl)) || (!!uploadedFileName && imageRegex.test(uploadedFileName));

    let contentWithUploadedFile = htmlContent;

    if (uploadedFileUrl && uploadedFileName) {
      const escapedName = uploadedFileName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`src=([\"\'])([^\"\']*${escapedName})\\1`, 'g');
      contentWithUploadedFile = contentWithUploadedFile.replace(regex, (_m: string, quote: string) => {
        return `src=${quote}${uploadedFileUrl}${quote}`;
      });
    }

    if (uploadedFileUrl && contentWithUploadedFile) {
      // Skip if the blob url already exists in markup (prevents duplicates)
      const alreadyInserted = contentWithUploadedFile.includes(uploadedFileUrl);

      // For non-image files we still want the attachment at the end once.
      if (!alreadyInserted && !isImageFile) {
        contentWithUploadedFile += `\n<div class="resume-uploaded-file"><img src="${uploadedFileUrl}" alt="Uploaded file" style="max-width: 100%; max-height: 300px; display: block; margin: 0.5rem 0;" /></div>`;
      }
      // For image files we do NOTHING here – user must reference it explicitly in Markdown/HTML.
    }

    // Log paper size to debug
    console.log(`ResumePreview rendering with paper size: ${paperSize}`);

    return (
      <div ref={resolvedRef as MutableRefObject<HTMLDivElement>} className="resume-container" style={{ width: '100%' }} data-paper-size={paperSize}>
        <ResumeTemplates
          htmlContent={contentWithUploadedFile}
          template={template}
          isTwoColumn={isTwoColumn}
          isTwoPage={isTwoPage}
          isPreview={true}
          containerWidth={containerWidth}
          paperSize={paperSize}
        />
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';
