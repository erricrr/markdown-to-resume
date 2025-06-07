
import { cn } from '@/lib/utils';

interface ResumeTemplatesProps {
  htmlContent: string;
  template: string;
}

export const ResumeTemplates = ({ htmlContent, template }: ResumeTemplatesProps) => {
  const getTemplateClasses = () => {
    switch (template) {
      case 'professional':
        return 'template-professional';
      case 'modern':
        return 'template-modern';
      case 'minimalist':
        return 'template-minimalist';
      case 'creative':
        return 'template-creative';
      case 'executive':
        return 'template-executive';
      default:
        return 'template-professional';
    }
  };

  return (
    <div
      className={cn(
        'resume-template w-full max-w-4xl mx-auto bg-white shadow-lg',
        getTemplateClasses()
      )}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
