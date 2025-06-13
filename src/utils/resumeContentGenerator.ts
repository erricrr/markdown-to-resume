import { marked } from 'marked';
import DOMPurify from 'dompurify';

export interface ResumeContentData {
  markdown: string;
  leftColumn?: string;
  rightColumn?: string;
  header?: string;
  summary?: string;
  firstPage?: string;
  secondPage?: string;
  isTwoColumn?: boolean;
  isTwoPage?: boolean;
  uploadedFileUrl?: string;
  uploadedFileName?: string;
}

/**
 * Shared function to parse markdown to HTML with consistent styling classes
 */
export const parseMarkdown = (md: string): string => {
  if (!md || !md.trim()) return '';

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
      // Fix relative image paths to point to public root
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

    // Allow inline style attributes for custom spacing/sizing
    // @ts-ignore – ADD_ATTR may not exist on older DOMPurify typings but is supported at runtime.
    return DOMPurify.sanitize(processedHtml, { ADD_ATTR: ['style'] });
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return '<p>Error parsing markdown content</p>';
  }
};

/**
 * Process header markdown into structured HTML with contact info styling
 */
export const processHeaderMarkdown = (headerMd: string): string => {
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

/**
 * Generate HTML content for different layout modes
 */
export const generateResumeHTML = (data: ResumeContentData): string => {
  const {
    markdown = '',
    leftColumn = '',
    rightColumn = '',
    header = '',
    summary = '',
    firstPage = '',
    secondPage = '',
    isTwoColumn = false,
    isTwoPage = false
  } = data;

  if (isTwoPage && isTwoColumn) {
    // Combined mode: Two pages with two columns each
    const headerHtml = header ? processHeaderMarkdown(header) : '';
    const summaryHtml = summary ? `<div class="resume-summary-section">${parseMarkdown(summary)}</div>` : '';
    const leftHtml = parseMarkdown(leftColumn);
    const rightHtml = parseMarkdown(rightColumn);
    const secondPageLeftHtml = parseMarkdown(firstPage);
    const secondPageRightHtml = parseMarkdown(secondPage);

    return `
      <div class="resume-two-page">
        <div class="resume-page-first">
          <div class="resume-two-column">
            ${headerHtml ? `<div class="resume-header">${headerHtml}</div>` : ''}
            ${summaryHtml}
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
    const summaryHtml = summary ? `<div class="resume-summary-section">${parseMarkdown(summary)}</div>` : '';
    const leftHtml = parseMarkdown(leftColumn);
    const rightHtml = parseMarkdown(rightColumn);
    return `
      <div class="resume-two-column">
        ${headerHtml ? `<div class="resume-header">${headerHtml}</div>` : ''}
        ${summaryHtml}
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

/**
 * Process uploaded file references in HTML content
 */
export const processUploadedFileReferences = (
  htmlContent: string,
  uploadedFileUrl?: string,
  uploadedFileName?: string
): string => {
  let content = htmlContent;

  if (uploadedFileUrl && uploadedFileName) {
    // Replace filename references with the actual URL
    const escapedName = uploadedFileName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`src=([\"\'])([^\"\']*${escapedName})\\1`, 'g');
    content = content.replace(regex, (_m: string, quote: string) => {
      return `src=${quote}${uploadedFileUrl}${quote}`;
    });

    // Also try to match just the filename without path
    const filenameOnly = uploadedFileName.split('/').pop() || uploadedFileName;
    if (filenameOnly !== uploadedFileName) {
      const escapedBaseName = filenameOnly.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const baseNameRegex = new RegExp(`src=([\"\'])([^\"\']*${escapedBaseName})\\1`, 'g');
      content = content.replace(baseNameRegex, (_m: string, quote: string) => {
        return `src=${quote}${uploadedFileUrl}${quote}`;
      });
    }
  }

  // Handle non-image file attachments (append at end if not already present)
  if (uploadedFileUrl && content) {
    const imageRegex = /\.(jpe?g|png|gif|webp)$/i;
    const isImageFile = (!!uploadedFileUrl && imageRegex.test(uploadedFileUrl)) ||
                       (!!uploadedFileName && imageRegex.test(uploadedFileName));

    const alreadyInserted = content.includes(uploadedFileUrl);

    // For non-image files, append at the end once
    if (!alreadyInserted && !isImageFile) {
      content += `\n<div class="resume-uploaded-file"><img src="${uploadedFileUrl}" alt="Uploaded file" style="max-width: 100%; max-height: 300px; display: block; margin: 0.5rem 0;" /></div>`;
    }
  }

  return content;
};

/**
 * Main function to generate complete resume HTML content
 */
export const generateCompleteResumeHTML = (data: ResumeContentData): string => {
  const baseHTML = generateResumeHTML(data);
  return processUploadedFileReferences(baseHTML, data.uploadedFileUrl, data.uploadedFileName);
};
