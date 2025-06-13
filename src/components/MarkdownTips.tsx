import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface TipTooltipProps {
  type: 'markdown' | 'html' | 'css' | 'custom';
  customContent?: React.ReactNode;
  className?: string;
  selectedTemplate?: string;
}

export const TipTooltip: React.FC<TipTooltipProps> = ({ type, customContent, className = "", selectedTemplate = "professional" }) => {
  let content;

  switch (type) {
    case 'markdown':
      content = (
        <div className="space-y-1">
          <p className="font-medium">💡 Markdown Tips:</p>
          <p>• Use Markdown formatting for rich text (# for headings, ** for bold, etc.)</p>
          <p>• Two-column mode will intelligently parse your content</p>
          <p>• Always review the parsed results in two-column layout</p>
          <p>• New to Markdown? Learn at: <a href="https://www.markdownguide.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">markdownguide.org</a> 🚀</p>
        </div>
      );
      break;

    case 'html':
      content = (
        <div className="space-y-1">
          <p className="font-medium">💡 HTML Tips:</p>
          <p>• Create interactive resumes with HTML, CSS, and JavaScript</p>
          <p>• Use semantic HTML elements for better structure</p>
          <p>• Always test your resume in print mode before final export</p>
          <p>• Learn HTML at: <a href="https://www.w3schools.com/html/default.asp" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">w3schools.com</a> 🚀</p>
        </div>
      );
      break;

    case 'css':
      content = (
        <div className="space-y-1">
          <p className="font-medium">💡 CSS Editor Tips:</p>
          <div><strong>CSS Variables:</strong> Use --resume-font-family, --resume-font-size, --resume-h1-font-size for easy customization</div>
          <div><strong>Colors:</strong> Target .template-{selectedTemplate} for template-specific styling</div>
          <div><strong>Priority:</strong> Add !important if styles aren't applying</div>
          <div><strong>Live Updates:</strong> Changes apply immediately to preview and PDF</div>
          <div><strong>Learn CSS:</strong> <a href="https://www.w3schools.com/css/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">W3Schools CSS Tutorial</a></div>
        </div>
      );
      break;

    case 'custom':
      content = customContent;
      break;

    default:
      content = <p>Tips not available</p>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md cursor-help ${className}`}>
          <Info className="h-3 w-3 text-blue-600" />
          <span className="text-xs text-blue-700 font-medium">Tips</span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-2xl p-3 text-sm">
        {content}
      </TooltipContent>
    </Tooltip>
  );
};
