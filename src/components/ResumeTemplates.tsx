
import { cn } from '@/lib/utils';

interface ResumeTemplatesProps {
  htmlContent: string;
  template: string;
  isTwoColumn?: boolean;
  isTwoPage?: boolean;
}

export const ResumeTemplates = ({ htmlContent, template, isTwoColumn = false, isTwoPage = false }: ResumeTemplatesProps) => {
  const getTemplateClasses = () => {
    let baseClass = '';
    if (isTwoPage && isTwoColumn) {
      baseClass = 'resume-two-page-layout resume-two-column-layout';
    } else if (isTwoPage) {
      baseClass = 'resume-two-page-layout';
    } else if (isTwoColumn) {
      baseClass = 'resume-two-column-layout';
    }
    
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
