
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
    // Configure marked for resume-specific parsing
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    // Custom renderer for better resume formatting
    const renderer = new marked.Renderer();
    
    // Custom heading renderer - updated API
    renderer.heading = ({ tokens, depth }) => {
      const text = tokens.map(token => token.raw || '').join('');
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
      return `<h${depth} id="${escapedText}" class="resume-heading-${depth}">${text}</h${depth}>`;
    };

    // Custom list renderer - updated API
    renderer.list = (token) => {
      const tag = token.ordered ? 'ol' : 'ul';
      const body = token.items.map(item => item.raw || '').join('');
      return `<${tag} class="resume-list">${body}</${tag}>`;
    };

    // Custom list item renderer
    renderer.listitem = (token) => {
      const text = token.tokens?.map(t => t.raw || '').join('') || '';
      return `<li class="resume-list-item">${text}</li>`;
    };

    // Custom paragraph renderer
    renderer.paragraph = (token) => {
      const text = token.tokens?.map(t => t.raw || '').join('') || '';
      return `<p class="resume-paragraph">${text}</p>`;
    };

    // Custom strong/bold renderer
    renderer.strong = (token) => {
      const text = token.tokens?.map(t => t.raw || '').join('') || '';
      return `<strong class="resume-strong">${text}</strong>`;
    };

    // Custom emphasis/italic renderer
    renderer.em = (token) => {
      const text = token.tokens?.map(t => t.raw || '').join('') || '';
      return `<em class="resume-emphasis">${text}</em>`;
    };

    const parseMarkdown = (md: string) => {
      try {
        // Use synchronous marked function
        const html = marked.parse(md, { renderer });
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
