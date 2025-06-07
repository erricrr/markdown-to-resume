
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
    
    // Helper function to parse tokens properly
    const parseTokens = (tokens: any[]): string => {
      return tokens.map(token => {
        if (token.type === 'text') {
          return token.text || '';
        } else if (token.type === 'strong') {
          return `<strong class="resume-strong">${parseTokens(token.tokens || [])}</strong>`;
        } else if (token.type === 'em') {
          return `<em class="resume-emphasis">${parseTokens(token.tokens || [])}</em>`;
        } else if (token.type === 'link') {
          return `<a href="${token.href}" class="resume-link">${parseTokens(token.tokens || [])}</a>`;
        } else if (token.type === 'code') {
          return `<code class="resume-code">${token.text}</code>`;
        }
        return token.raw || '';
      }).join('');
    };

    // Custom heading renderer
    renderer.heading = ({ tokens, depth }) => {
      const text = parseTokens(tokens);
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
      return `<h${depth} id="${escapedText}" class="resume-heading-${depth}">${text}</h${depth}>`;
    };

    // Custom list renderer
    renderer.list = (token) => {
      const body = token.items.map(item => 
        `<li class="resume-list-item">${parseTokens(item.tokens)}</li>`
      ).join('');
      const tag = token.ordered ? 'ol' : 'ul';
      return `<${tag} class="resume-list">${body}</${tag}>`;
    };

    // Custom list item renderer
    renderer.listitem = (item) => {
      const text = parseTokens(item.tokens);
      return `<li class="resume-list-item">${text}</li>`;
    };

    // Custom paragraph renderer
    renderer.paragraph = ({ tokens }) => {
      const text = parseTokens(tokens);
      return `<p class="resume-paragraph">${text}</p>`;
    };

    // Custom strong/bold renderer (this won't be called directly due to parseTokens handling)
    renderer.strong = ({ tokens }) => {
      const text = parseTokens(tokens);
      return `<strong class="resume-strong">${text}</strong>`;
    };

    // Custom emphasis/italic renderer (this won't be called directly due to parseTokens handling)
    renderer.em = ({ tokens }) => {
      const text = parseTokens(tokens);
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
