
import { forwardRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { ResumeTemplates } from '@/components/ResumeTemplates';

interface ResumePreviewProps {
  markdown: string;
  template: string;
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ markdown, template }, ref) => {
    const parseMarkdown = (md: string) => {
      try {
        // Configure marked with enhanced options
        marked.setOptions({
          breaks: true,
          gfm: true,
        });

        // Create a custom renderer
        const renderer = new marked.Renderer();

        // Override heading renderer to add resume classes
        renderer.heading = (text: string, level: number) => {
          const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
          return `<h${level} id="${escapedText}" class="resume-heading-${level}">${text}</h${level}>`;
        };

        // Override paragraph renderer
        renderer.paragraph = (text: string) => {
          return `<p class="resume-paragraph">${text}</p>`;
        };

        // Override list renderer
        renderer.list = (body: string, ordered: boolean) => {
          const tag = ordered ? 'ol' : 'ul';
          return `<${tag} class="resume-list">${body}</${tag}>`;
        };

        // Override list item renderer
        renderer.listitem = (text: string) => {
          return `<li class="resume-list-item">${text}</li>`;
        };

        // Override table renderer
        renderer.table = (header: string, body: string) => {
          return `<table class="resume-table">
            <thead class="resume-table-head">${header}</thead>
            <tbody class="resume-table-body">${body}</tbody>
          </table>`;
        };

        // Override table row renderer
        renderer.tablerow = (content: string) => {
          return `<tr class="resume-table-row">${content}</tr>`;
        };

        // Override table cell renderer
        renderer.tablecell = (content: string, flags: { header: boolean; align: string | null }) => {
          const tag = flags.header ? 'th' : 'td';
          const className = flags.header ? 'resume-table-header' : 'resume-table-cell';
          const align = flags.align ? ` style="text-align: ${flags.align}"` : '';
          return `<${tag} class="${className}"${align}>${content}</${tag}>`;
        };

        // Override horizontal rule renderer
        renderer.hr = () => {
          return `<hr class="resume-hr" />`;
        };

        // Override strong renderer
        renderer.strong = (text: string) => {
          return `<strong class="resume-strong">${text}</strong>`;
        };

        // Override emphasis renderer
        renderer.em = (text: string) => {
          return `<em class="resume-emphasis">${text}</em>`;
        };

        // Override link renderer
        renderer.link = (href: string, title: string | null, text: string) => {
          return `<a href="${href}" class="resume-link"${title ? ` title="${title}"` : ''}>${text}</a>`;
        };

        // Override code renderer
        renderer.code = (code: string, language?: string) => {
          return `<pre class="resume-code-block"><code>${code}</code></pre>`;
        };

        // Override codespan renderer
        renderer.codespan = (text: string) => {
          return `<code class="resume-code">${text}</code>`;
        };

        // Override line break renderer
        renderer.br = () => {
          return '<br class="resume-br" />';
        };

        const html = marked(md, { renderer });
        return DOMPurify.sanitize(html as string);
      } catch (error) {
        console.error('Error parsing markdown:', error);
        return '<p>Error parsing markdown content</p>';
      }
    };

    const htmlContent = parseMarkdown(markdown);

    return (
      <div ref={ref} className="resume-container">
        <ResumeTemplates
          htmlContent={htmlContent}
          template={template}
        />
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';
