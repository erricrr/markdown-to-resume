
import { cn } from '@/lib/utils';

interface ResumeTemplatesProps {
  htmlContent: string;
  template: string;
  isTwoColumn?: boolean;
}

export const ResumeTemplates = ({ htmlContent, template, isTwoColumn = false }: ResumeTemplatesProps) => {
  const getTemplateClasses = () => {
    const baseClass = isTwoColumn ? 'resume-two-column-layout' : '';
    switch (template) {
      case 'professional':
        return cn(baseClass, 'template-professional');
      case 'modern':
        return cn(baseClass, 'template-modern');
      case 'minimalist':
        return cn(baseClass, 'template-minimalist');
      case 'creative':
        return cn(baseClass, 'template-creative');
      case 'executive':
        return cn(baseClass, 'template-executive');
      default:
        return cn(baseClass, 'template-professional');
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
