
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
        // Configure marked with minimal custom rendering
        marked.setOptions({
          breaks: true,
          gfm: true,
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
          const text = tokens.map(token => token.raw || '').join('');
          return `<p class="resume-paragraph">${text}</p>`;
        };

        // Override list renderer
        renderer.list = (token) => {
          const body = token.items.map(item => 
            `<li class="resume-list-item">${item.tokens?.map(t => t.raw || '').join('') || ''}</li>`
          ).join('');
          const tag = token.ordered ? 'ol' : 'ul';
          return `<${tag} class="resume-list">${body}</${tag}>`;
        };

        // Override list item renderer
        renderer.listitem = ({ tokens }) => {
          const text = tokens.map(token => token.raw || '').join('');
          return `<li class="resume-list-item">${text}</li>`;
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
