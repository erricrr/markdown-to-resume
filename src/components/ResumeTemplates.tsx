import { cn } from '@/lib/utils';

interface ResumeTemplatesProps {
  htmlContent: string;
  template: string;
  isTwoColumn?: boolean;
  isTwoPage?: boolean;
  isPreview?: boolean;
}

// List of valid template IDs
const validTemplates = ['professional', 'modern', 'minimalist', 'creative', 'executive'];

export const ResumeTemplates = ({ htmlContent, template: propTemplate, isTwoColumn = false, isTwoPage = false, isPreview = true }: ResumeTemplatesProps) => {
  // Ensure we always have a valid template
  const template = validTemplates.includes(propTemplate) ? propTemplate : 'professional';
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

  const getContainerClasses = () => {
    if (isPreview) {
      // For preview: scale to fit container width
      return cn(
        'resume-template resume-preview-container w-full bg-white shadow-lg',
        'transform-gpu origin-top',
        getTemplateClasses()
      );
    } else {
      // For PDF/print: maintain original size
      return cn(
        'resume-template w-full max-w-4xl mx-auto bg-white shadow-lg',
        getTemplateClasses()
      );
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div
        className={getContainerClasses()}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={isPreview ? {
          width: '8.5in',
          minHeight: '11in',
          transformOrigin: 'top left',
          transform: 'scale(var(--preview-scale, 0.75))',
          margin: '0 auto'
        } : undefined}
      />
    </div>
  );
};
