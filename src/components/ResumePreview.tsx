
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
        renderer.heading = (text, level) => {
          const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
          return `<h${level} id="${escapedText}" class="resume-heading-${level}">${text}</h${level}>`;
        };

        // Override paragraph renderer
        renderer.paragraph = (text) => {
          return `<p class="resume-paragraph">${text}</p>`;
        };

        // Override list renderer
        renderer.list = (body, ordered) => {
          const tag = ordered ? 'ol' : 'ul';
          return `<${tag} class="resume-list">${body}</${tag}>`;
        };

        // Override list item renderer
        renderer.listitem = (text) => {
          return `<li class="resume-list-item">${text}</li>`;
        };

        // Override strong renderer
        renderer.strong = (text) => {
          return `<strong class="resume-strong">${text}</strong>`;
        };

        // Override emphasis renderer
        renderer.em = (text) => {
          return `<em class="resume-emphasis">${text}</em>`;
        };

        // Override link renderer
        renderer.link = (href, title, text) => {
          return `<a href="${href}" class="resume-link"${title ? ` title="${title}"` : ''}>${text}</a>`;
        };

        // Override code renderer
        renderer.code = (code, language) => {
          return `<pre class="resume-code-block"><code>${code}</code></pre>`;
        };

        // Override codespan renderer
        renderer.codespan = (code) => {
          return `<code class="resume-code">${code}</code>`;
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
