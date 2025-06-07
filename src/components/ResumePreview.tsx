
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
    
    // Custom heading renderer - using correct API
    renderer.heading = ({ tokens, depth }) => {
      const text = this.parser.parseInline(tokens);
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
      return `<h${depth} id="${escapedText}" class="resume-heading-${depth}">${text}</h${depth}>`;
    };

    // Custom list renderer - using correct API
    renderer.list = (token) => {
      const body = this.parser.parse(token.items);
      const tag = token.ordered ? 'ol' : 'ul';
      return `<${tag} class="resume-list">${body}</${tag}>`;
    };

    // Custom list item renderer
    renderer.listitem = (item) => {
      const text = this.parser.parseInline(item.tokens);
      return `<li class="resume-list-item">${text}</li>`;
    };

    // Custom paragraph renderer
    renderer.paragraph = ({ tokens }) => {
      const text = this.parser.parseInline(tokens);
      return `<p class="resume-paragraph">${text}</p>`;
    };

    // Custom strong/bold renderer
    renderer.strong = ({ tokens }) => {
      const text = this.parser.parseInline(tokens);
      return `<strong class="resume-strong">${text}</strong>`;
    };

    // Custom emphasis/italic renderer
    renderer.em = ({ tokens }) => {
      const text = this.parser.parseInline(tokens);
      return `<em class="resume-emphasis">${text}</em>`;
    };

    const parseMarkdown = (md: string) => {
      try {
        // Use the configured renderer
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
