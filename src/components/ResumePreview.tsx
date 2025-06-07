
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
          tables: true,
          sanitize: false,
        });

        // Create a custom renderer
        const renderer = new marked.Renderer();

        // Override heading renderer to add resume classes
        renderer.heading = ({ tokens, depth }) => {
          const text = tokens.map(token => token.raw || '').join('');
          const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
          return `<h${depth} id="${escapedText}" class="resume-heading-${depth}">${text}</h${depth}>`;
        };

        // Override paragraph renderer
        renderer.paragraph = ({ tokens }) => {
          const parsedContent = marked.parseInline(tokens.map(token => token.raw || '').join(''));
          return `<p class="resume-paragraph">${parsedContent}</p>`;
        };

        // Override list renderer
        renderer.list = (token) => {
          const body = token.items.map(item => {
            const itemText = item.tokens?.map(t => t.raw || '').join('') || '';
            const itemContent = marked.parseInline(itemText);
            return `<li class="resume-list-item">${itemContent}</li>`;
          }).join('');
          const tag = token.ordered ? 'ol' : 'ul';
          return `<${tag} class="resume-list">${body}</${tag}>`;
        };

        // Override table renderer
        renderer.table = ({ header, rows }) => {
          const headerRow = header.map(cell => {
            const cellContent = marked.parseInline(cell.tokens?.map(t => t.raw || '').join('') || '');
            return `<th class="resume-table-header">${cellContent}</th>`;
          }).join('');
          
          const bodyRows = rows.map(row => {
            const cells = row.map(cell => {
              const cellContent = marked.parseInline(cell.tokens?.map(t => t.raw || '').join('') || '');
              return `<td class="resume-table-cell">${cellContent}</td>`;
            }).join('');
            return `<tr class="resume-table-row">${cells}</tr>`;
          }).join('');

          return `<table class="resume-table">
            <thead class="resume-table-head">
              <tr class="resume-table-row">${headerRow}</tr>
            </thead>
            <tbody class="resume-table-body">${bodyRows}</tbody>
          </table>`;
        };

        // Override horizontal rule renderer
        renderer.hr = () => {
          return `<hr class="resume-hr" />`;
        };

        // Override strong renderer
        renderer.strong = ({ tokens }) => {
          const text = tokens.map(token => token.raw || '').join('');
          return `<strong class="resume-strong">${text}</strong>`;
        };

        // Override emphasis renderer
        renderer.em = ({ tokens }) => {
          const text = tokens.map(token => token.raw || '').join('');
          return `<em class="resume-emphasis">${text}</em>`;
        };

        // Override link renderer
        renderer.link = ({ href, title, tokens }) => {
          const text = tokens.map(token => token.raw || '').join('');
          return `<a href="${href}" class="resume-link"${title ? ` title="${title}"` : ''}>${text}</a>`;
        };

        // Override code renderer
        renderer.code = ({ text, lang }) => {
          return `<pre class="resume-code-block"><code>${text}</code></pre>`;
        };

        // Override codespan renderer
        renderer.codespan = ({ text }) => {
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
