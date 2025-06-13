import { useState, useEffect, useRef } from 'react';
import { useFileUpload } from '@/contexts/FileUploadContext';

interface ImageDetectionOptions {
  detectMarkdown?: boolean;
  detectHtml?: boolean;
}

export const useImageReferenceDetection = (content: string, options: ImageDetectionOptions = {}) => {
  const [hasImageReference, setHasImageReference] = useState(false);
  const { uploadedFileUrl, uploadedFileName, refreshTimestamp, triggerRefresh } = useFileUpload();
  const prevUploadedFileUrlRef = useRef(uploadedFileUrl);
  const prevUploadedFileNameRef = useRef(uploadedFileName);

  const detectImageReferences = (content: string) => {
    if (options.detectMarkdown) {
      const markdownImageRegex = /!\[.*?\]\(.*?\)/;
      const htmlImageRegex = /<img.*?>/i;
      return markdownImageRegex.test(content) || htmlImageRegex.test(content);
    }

    if (options.detectHtml) {
      const imgTagRegex = /<img[^>]*>/i;
      const backgroundImageRegex = /background-image\s*:\s*url\s*\([^)]+\)/i;
      return imgTagRegex.test(content) || backgroundImageRegex.test(content);
    }

    return false;
  };

  useEffect(() => {
    const checkForImageReferences = () => {
      const hasImgReference = detectImageReferences(content);
      setHasImageReference(hasImgReference);

      if (hasImgReference && (!uploadedFileUrl || uploadedFileUrl !== prevUploadedFileUrlRef.current)) {
        console.log('🖼️ Image reference detected with upload change - refreshing preview');
        triggerRefresh();
      }

      if (!hasImgReference && prevUploadedFileUrlRef.current && uploadedFileUrl) {
        console.log('🖼️ Image reference removed but image still uploaded - refreshing preview');
        triggerRefresh();
      }
    };

    checkForImageReferences();

    prevUploadedFileUrlRef.current = uploadedFileUrl;
    prevUploadedFileNameRef.current = uploadedFileName;
  }, [content, uploadedFileUrl, uploadedFileName, triggerRefresh]);

  return {
    hasImageReference,
    uploadedFileUrl,
    uploadedFileName,
    refreshTimestamp,
    triggerRefresh
  };
};
