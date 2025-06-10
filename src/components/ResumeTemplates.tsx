import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ResumeTemplatesProps {
  htmlContent: string;
  template: string;
  isTwoColumn?: boolean;
  isTwoPage?: boolean;
  isPreview?: boolean;
  containerWidth?: number;
  paperSize?: 'A4' | 'US_LETTER';
}

// List of valid template IDs
const validTemplates = ['professional', 'modern', 'minimalist', 'creative', 'executive'];

export const ResumeTemplates = ({
  htmlContent,
  template: propTemplate,
  isTwoColumn = false,
  isTwoPage = false,
  isPreview = true,
  containerWidth = 0,
  paperSize = 'A4'
}: ResumeTemplatesProps) => {
  // Calculate scaling factor based on container width
  const [scale, setScale] = useState(0.75); // Default scale

  useEffect(() => {
    if (containerWidth && containerWidth > 0) {
      // Calculate document width based on paper size
      // A4 width = 8.27in = 794px at 96dpi
      // US Letter width = 8.5in = 816px at 96dpi
      const documentWidth = paperSize === 'A4' ? 794 : 816;

      // Calculate scale with max of 0.95 and min of 0.45
      const newScale = Math.min(0.95, Math.max(0.45, containerWidth / documentWidth * 0.95));
      setScale(newScale);
    }
  }, [containerWidth, paperSize]);

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
    // Get paper size class
    const paperSizeClass = paperSize === 'A4' ? 'a4-paper' : '';

    console.log(`Using paper size: ${paperSize}, class: ${paperSizeClass}`);

    if (isPreview) {
      // For preview: scale to fit container width but maintain PDF proportions and margins
      return cn(
        'resume-template resume-preview-container w-full bg-white shadow-lg',
        'transform-gpu origin-top print-accurate',
        paperSizeClass,
        getTemplateClasses()
      );
    } else {
      // For PDF/print: maintain original size
      return cn(
        'resume-template w-full max-w-4xl mx-auto bg-white shadow-lg',
        paperSizeClass,
        getTemplateClasses()
      );
    }
  };

  // Get width and height based on paper size
  const getPaperDimensions = () => {
    if (paperSize === 'A4') {
      return {
        width: '8.27in',
        height: '11.69in'
      };
    } else {
      return {
        width: '8.5in',
        height: '11in'
      };
    }
  };

  const { width, height } = getPaperDimensions();

  return (
    <div className="w-full h-full overflow-auto flex flex-col">
      <div
        className={getContainerClasses()}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={isPreview ? {
          width: width,
          minHeight: height,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          margin: '0 auto',
          padding: '0.5in',
          boxSizing: 'border-box',
        } : undefined}
      />
      {isPreview && (
        <div className="text-xs text-center text-muted-foreground mt-3 px-4">
          <p className="mb-1">Preview uses 0.5 inch margins on all sides. Font size 11pt with 1.15 line spacing.</p>
          <p className="mb-1">Paper size: {paperSize === 'A4' ? 'A4 (210 × 297 mm)' : 'US Letter (8.5 × 11 in)'}</p>
          <p>Section spacing of 8pt creates professional "breathing room" between content.</p>
        </div>
      )}
    </div>
  );
};
