
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
        renderer.heading = (token: any) => {
          const text = this.parser.parseInline(token.tokens);
          const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
          return `<h${token.depth} id="${escapedText}" class="resume-heading-${token.depth}">${text}</h${token.depth}>`;
        };

        // Override paragraph renderer
        renderer.paragraph = (token: any) => {
          const text = this.parser.parseInline(token.tokens);
          return `<p class="resume-paragraph">${text}</p>`;
        };

        // Override list renderer
        renderer.list = (token: any) => {
          const tag = token.ordered ? 'ol' : 'ul';
          const body = token.items.map((item: any) => renderer.listitem(item)).join('');
          return `<${tag} class="resume-list">${body}</${tag}>`;
        };

        // Override list item renderer
        renderer.listitem = (token: any) => {
          const text = this.parser.parseInline(token.tokens);
          return `<li class="resume-list-item">${text}</li>`;
        };

        // Override table renderer
        renderer.table = (token: any) => {
          const header = token.header.map((cell: any) => renderer.tablecell(cell)).join('');
          const body = token.rows.map((row: any) => 
            `<tr class="resume-table-row">${row.map((cell: any) => renderer.tablecell(cell)).join('')}</tr>`
          ).join('');
          return `<table class="resume-table">
            <thead class="resume-table-head"><tr class="resume-table-row">${header}</tr></thead>
            <tbody class="resume-table-body">${body}</tbody>
          </table>`;
        };

        // Override table cell renderer
        renderer.tablecell = (token: any) => {
          const tag = token.header ? 'th' : 'td';
          const className = token.header ? 'resume-table-header' : 'resume-table-cell';
          const align = token.align ? ` style="text-align: ${token.align}"` : '';
          const text = this.parser.parseInline(token.tokens);
          return `<${tag} class="${className}"${align}>${text}</${tag}>`;
        };

        // Override horizontal rule renderer
        renderer.hr = () => {
          return `<hr class="resume-hr" />`;
        };

        // Override strong renderer
        renderer.strong = (token: any) => {
          const text = this.parser.parseInline(token.tokens);
          return `<strong class="resume-strong">${text}</strong>`;
        };

        // Override emphasis renderer
        renderer.em = (token: any) => {
          const text = this.parser.parseInline(token.tokens);
          return `<em class="resume-emphasis">${text}</em>`;
        };

        // Override link renderer
        renderer.link = (token: any) => {
          const text = this.parser.parseInline(token.tokens);
          return `<a href="${token.href}" class="resume-link"${token.title ? ` title="${token.title}"` : ''}>${text}</a>`;
        };

        // Override code renderer
        renderer.code = (token: any) => {
          return `<pre class="resume-code-block"><code>${token.text}</code></pre>`;
        };

        // Override codespan renderer
        renderer.codespan = (token: any) => {
          return `<code class="resume-code">${token.text}</code>`;
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
