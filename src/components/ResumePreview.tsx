import { forwardRef, useEffect, useState, useRef, MutableRefObject, useMemo } from 'react';
import { ResumeTemplates } from '@/components/ResumeTemplates';
import { generateCompleteResumeHTML, type ResumeContentData } from '@/utils/resumeContentGenerator';

interface ResumePreviewProps {
  markdown: string;
  leftColumn?: string;
  rightColumn?: string;
  header?: string;
  summary?: string;
  firstPage?: string;
  secondPage?: string;
  template: string;
  isTwoColumn?: boolean;
  isTwoPage?: boolean;
  paperSize?: 'A4' | 'US_LETTER';
  uploadedFileUrl?: string;
  uploadedFileName?: string;
}

// Import valid template types for TS checking
import { TemplateType, validTemplates } from '@/types/resumeTypes';

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ markdown, leftColumn = '', rightColumn = '', header = '', summary = '', firstPage = '', secondPage = '', template: propTemplate, isTwoColumn = false, isTwoPage = false, paperSize = 'A4', uploadedFileUrl = '', uploadedFileName = '' }, ref) => {
    // Ensure we always have a valid template
    const template: TemplateType = validTemplates.includes(propTemplate as TemplateType)
      ? propTemplate as TemplateType
      : 'professional';

    // Add state to force re-render on container resize
    const [containerWidth, setContainerWidth] = useState(0);
    const localRef = useRef<HTMLDivElement>(null);
    const resolvedRef = ref || localRef;

    // Track if image upload has changed - used to trigger content refresh
    const uploadStateRef = useRef({ url: uploadedFileUrl, name: uploadedFileName });
    const [imageProcessingVersion, setImageProcessingVersion] = useState(0);

    // Log template changes for debugging
    useEffect(() => {
      console.log('🔍 ResumePreview: Template set to', template);
    }, [template]);

    // Watch for changes to uploaded images to trigger refresh
    useEffect(() => {
      const prevUrl = uploadStateRef.current.url;
      const prevName = uploadStateRef.current.name;

      // Check if either the URL or filename has changed
      if (prevUrl !== uploadedFileUrl || prevName !== uploadedFileName) {
        console.log('🖼️ ResumePreview: Detected image upload change - reprocessing content');
        uploadStateRef.current = { url: uploadedFileUrl, name: uploadedFileName };
        setImageProcessingVersion(prev => prev + 1);
      }
    }, [uploadedFileUrl, uploadedFileName]);

    // Set up resize observer to detect container width changes
    useEffect(() => {
      // Get the current element from the ref
      const element = (resolvedRef as MutableRefObject<HTMLDivElement | null>).current;
      if (!element) return;

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          if (width !== containerWidth) {
            setContainerWidth(width);
          }
        }
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    }, [resolvedRef, containerWidth]);

    // Note: parseMarkdown logic is now handled by the shared utility

    // Use useMemo to cache HTML content based on all input fields and image processing version
    const getHtmlContent = useMemo(() => {
      const contentData: ResumeContentData = {
        markdown,
        leftColumn,
        rightColumn,
        header,
        summary,
        firstPage,
        secondPage,
        isTwoColumn,
        isTwoPage,
        uploadedFileUrl,
        uploadedFileName
      };

      return generateCompleteResumeHTML(contentData);
    }, [
      markdown,
      leftColumn,
      rightColumn,
      header,
      summary,
      firstPage,
      secondPage,
      isTwoColumn,
      isTwoPage,
      uploadedFileUrl,
      uploadedFileName,
      imageProcessingVersion // Add this to trigger re-computation when images change
    ]);

    // Note: File processing is now handled by the shared utility

    // Log paper size to debug
    useEffect(() => {
      console.log(`ResumePreview rendering with paper size: ${paperSize}`);
    }, [paperSize]);

    return (
      <div ref={resolvedRef as MutableRefObject<HTMLDivElement>} className="resume-container" style={{ width: '100%' }} data-paper-size={paperSize}>
        <ResumeTemplates
          htmlContent={getHtmlContent}
          template={template}
          isTwoColumn={isTwoColumn}
          isTwoPage={isTwoPage}
          isPreview={true}
          containerWidth={containerWidth}
          paperSize={paperSize}
        />
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';
