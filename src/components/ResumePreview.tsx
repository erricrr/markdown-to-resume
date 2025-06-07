
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
    
    // Custom heading renderer - simplified approach
    renderer.heading = (text: string, level: number) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
      return `<h${level} id="${escapedText}" class="resume-heading-${level}">${text}</h${level}>`;
    };

    // Custom list renderer - simplified approach
    renderer.list = (body: string, ordered: boolean) => {
      const tag = ordered ? 'ol' : 'ul';
      return `<${tag} class="resume-list">${body}</${tag}>`;
    };

    // Custom list item renderer
    renderer.listitem = (text: string) => {
      return `<li class="resume-list-item">${text}</li>`;
    };

    // Custom paragraph renderer
    renderer.paragraph = (text: string) => {
      return `<p class="resume-paragraph">${text}</p>`;
    };

    // Custom strong/bold renderer
    renderer.strong = (text: string) => {
      return `<strong class="resume-strong">${text}</strong>`;
    };

    // Custom emphasis/italic renderer
    renderer.em = (text: string) => {
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
