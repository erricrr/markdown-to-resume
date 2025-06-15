import { forwardRef, useEffect, useRef, useState } from "react";

interface HtmlPreviewProps {
  html: string;
  paperSize?: 'A4' | 'US_LETTER';
  uploadedFileUrl?: string;
  uploadedFileName?: string;
}

// Shared HTML processing function that will be used by both preview and print components
export function processHtmlForDisplay(html: string, options: {
  paperSize?: 'A4' | 'US_LETTER';
  uploadedFileUrl?: string;
  uploadedFileName?: string;
  forPrint?: boolean;
} = {}) {
  const {
    paperSize = 'A4',
    uploadedFileUrl = '',
    uploadedFileName = '',
    forPrint = false
  } = options;

  // Add uploaded file to the HTML if available
  let processedHtml = html;
  const imageRegex = /\.(jpe?g|png|gif|webp)$/i;
  const isImageFile = (!!uploadedFileUrl && imageRegex.test(uploadedFileUrl)) ||
                      (!!uploadedFileName && imageRegex.test(uploadedFileName));

  if (uploadedFileUrl && !isImageFile && !processedHtml.includes(uploadedFileUrl)) {
    const uploadedFileHtml = `
<div style="margin-top: 20px; margin-bottom: 20px;">
  <img src="${uploadedFileUrl}" alt="Uploaded file" style="max-width: 100%; max-height: 300px; display: block; margin: 0 auto;">
</div>`;

    if (processedHtml.indexOf('</body>') !== -1) {
      processedHtml = processedHtml.replace('</body>', `${uploadedFileHtml}</body>`);
    } else {
      processedHtml = processedHtml + uploadedFileHtml;
    }
  }

  // Replace occurrences of the uploaded file name so inline <img> tags show the blob URL
  if (uploadedFileUrl && uploadedFileName) {
    // Handle both full path and filename-only references
    const escapedName = uploadedFileName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`src=([\"\'])([^\"\']*${escapedName})\\1`, 'g');
    processedHtml = processedHtml.replace(regex, (_m: string, quote: string) => `src=${quote}${uploadedFileUrl}${quote}`);

    // Also try to handle just the filename without path
    const filenameOnly = uploadedFileName.split('/').pop() || uploadedFileName;
    if (filenameOnly !== uploadedFileName) {
      const escapedBaseName = filenameOnly.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const baseNameRegex = new RegExp(`src=([\"\'])([^\"\']*${escapedBaseName})\\1`, 'g');
      processedHtml = processedHtml.replace(baseNameRegex, (_m: string, quote: string) => `src=${quote}${uploadedFileUrl}${quote}`);
    }
  }

  // Ensure relative image URLs load from public root
  processedHtml = processedHtml.replace(/<img([^>]*)src="([^\"\']+)"([^>]*)>/g, (match: string, before: string, src: string, after: string) => {
    if (/^(https?:|data:|blob:|\/)/i.test(src)) return match;
    return `<img${before}src="/${src}"${after}>`;
  });

  // Add more complete image path matching for background-image CSS properties
  processedHtml = processedHtml.replace(/background-image\s*:\s*url\s*\(\s*['"]?([^'"\)]+)['"]?\s*\)/gi, (match, url) => {
    if (/^(https?:|data:|blob:|\/)/i.test(url)) return match;
    return match.replace(url, `/${url}`);
  });

  // Aggressive approach - force background colors to work in print
  if (forPrint) {
    // More comprehensive background color preservation - catch ALL patterns
    processedHtml = processedHtml.replace(
      /(background(?:-color|-image)?:\s*[^;]+;)/gi,
      (match) => {
        return `${match} -webkit-print-color-adjust: exact !important; color-adjust: exact !important;`;
      }
    );

    // Catch inline styles in HTML elements
    processedHtml = processedHtml.replace(
      /style="([^"]*background[^"]*)"/gi,
      (match, styleContent) => {
        return `style="${styleContent}; -webkit-print-color-adjust: exact !important; color-adjust: exact !important;"`;
      }
    );

    // Add color preservation to ALL CSS rules that contain background
    processedHtml = processedHtml.replace(
      /([.#]?[a-zA-Z0-9_-]+[^{]*{[^}]*background[^}]*})/gi,
      (match) => {
        if (!match.includes('print-color-adjust')) {
          return match.replace('}', ' -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }');
        }
        return match;
      }
    );

    // Catch body/html styles specifically
    processedHtml = processedHtml.replace(
      /((?:body|html)\s*{[^}]*})/gi,
      (match) => {
        if (!match.includes('print-color-adjust')) {
          return match.replace('}', ' -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }');
        }
        return match;
      }
    );
  }

  // Generate a complete HTML document if needed
  if (!processedHtml.trim().toLowerCase().startsWith('<!doctype')) {
    const fontLinks = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@300;400;600&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Source+Sans+Pro:wght@300;400;600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet">
    `;

    // Base styles for both preview and print
    const baseStyles = `
    <style>
      /* Ensure proper CSS rendering and color preservation */
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: auto;
        overflow-x: hidden;
        max-width: 100%;
      }
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      /* Ensure content fits within iframe */
      .resume, body > div {
        max-width: 100% !important;
        overflow-x: hidden !important;
        width: auto !important;
        margin: 0 auto !important;
      }

      /* Fix for two-column layouts */
      .content {
        display: grid !important;
        grid-template-columns: 1fr 2fr !important;
        gap: 20px !important;
        width: 100% !important;
      }

      .left-column, .right-column {
        width: 100% !important;
        overflow: hidden !important;
      }

      /* Support for flex-based column layouts */
      [class*="column-layout"],
      [class*="two-column"],
      [class*="columns"],
      [class*="col-layout"] {
        display: grid !important;
        grid-template-columns: 1fr 2fr !important;
        gap: 20px !important;
        width: 100% !important;
      }

      /* Ensure all column elements have proper display */
      [class*="column-left"],
      [class*="left-col"],
      [class*="sidebar"],
      [class*="col-1"] {
        width: 100% !important;
        overflow: hidden !important;
      }

      [class*="column-right"],
      [class*="right-col"],
      [class*="main-content"],
      [class*="col-2"] {
        width: 100% !important;
        overflow: hidden !important;
      }

      /* Scale content to fit the available width */
      @media (max-width: 1000px) {
        .resume, body > div {
          transform: scale(0.95);
          transform-origin: top center;
        }
      }
      @media (max-width: 800px) {
        .resume, body > div {
          transform: scale(0.9);
          transform-origin: top center;
        }
      }
      @media print {
        @page {
          size: ${paperSize === 'A4' ? 'A4 portrait' : 'letter portrait'};
          margin: 0.5in;
        }
        html, body {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        /* Force background colors to print */
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    </style>
    `;

    processedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume Preview</title>
    ${fontLinks}
    ${baseStyles}
</head>
<body>
    ${processedHtml}
</body>
</html>
`;
  }

  return processedHtml;
}

export const HtmlPreview = forwardRef<HTMLDivElement, HtmlPreviewProps>(
  ({ html, paperSize = 'A4', uploadedFileUrl = '', uploadedFileName = '' }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const previousHtmlRef = useRef(html);
    const resizeTimeoutRef = useRef<number | null>(null);
    const updateTimeoutRef = useRef<number | null>(null);
    const [renderedHtml, setRenderedHtml] = useState(html);

    // Track image upload state to detect changes
    const prevUploadStateRef = useRef({ url: uploadedFileUrl, name: uploadedFileName });

    // Debounce content updates
    useEffect(() => {
      // For initial render, set content immediately
      if (isInitialRender) {
        setRenderedHtml(html);
        setIsInitialRender(false);
        return;
      }

      // For subsequent updates, debounce the content change
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = window.setTimeout(() => {
        setRenderedHtml(html);
      }, 1000); // Longer debounce for typing

      return () => {
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }
      };
    }, [html, isInitialRender]);

    // Force update when image upload changes
    useEffect(() => {
      const prevUrl = prevUploadStateRef.current.url;
      const prevName = prevUploadStateRef.current.name;

      // If either URL or filename has changed
      if (prevUrl !== uploadedFileUrl || prevName !== uploadedFileName) {
        console.log('🖼️ HtmlPreview: Detected image upload change - refreshing iframe content');
        prevUploadStateRef.current = { url: uploadedFileUrl, name: uploadedFileName };

        // Force iframe content to update immediately
        updateIframeContent();
      }
    }, [uploadedFileUrl, uploadedFileName]);

    useEffect(() => {
      console.log('HtmlPreview updateIframeContent triggered for renderedHtml');
      updateIframeContent();
    }, [renderedHtml]);

    const updateIframeContent = () => {
      if (!iframeRef.current) return;

      const iframe = iframeRef.current;

      // Force iframe to completely reload to ensure clean state
      iframe.src = 'about:blank';

      // Wait for iframe to be ready
      setTimeout(() => {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

        if (iframeDoc) {
          // Clear the iframe first
          iframeDoc.open();
          iframeDoc.write('');
          iframeDoc.close();

          // Write the HTML content to the iframe
          iframeDoc.open();

          // Process HTML for consistent display
          const htmlContent = processHtmlForDisplay(renderedHtml, {
            paperSize,
            uploadedFileUrl,
            uploadedFileName
          });

          iframeDoc.write(htmlContent);
          iframeDoc.close();

          // Force background color rendering in iframe after load
          setTimeout(() => {
            if (iframeDoc && iframeDoc.body) {
              // Add aggressive color preservation CSS directly to the document
              const colorStyle = iframeDoc.createElement('style');
              colorStyle.textContent = `
                * {
                  -webkit-print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  forced-color-adjust: none !important;
                }
                [style*="background"] {
                  background-attachment: local !important;
                }
              `;
              iframeDoc.head.appendChild(colorStyle);

              // Force a repaint by modifying and reverting a style
              const body = iframeDoc.body;
              const originalDisplay = body.style.display;
              body.style.display = 'none';
              body.offsetHeight; // Trigger reflow
              body.style.display = originalDisplay;
            }
          }, 100);

          // Set a generous initial height to prevent content from being cut off during load
          iframe.style.height = '800px';
          iframe.style.opacity = '0';

          // Wait for content to be fully rendered before showing
          setTimeout(() => {
            // Quick measurement with fallback
            let attempts = 0;
            const maxAttempts = 3; // Reduced from 5

            const measureAndResize = () => {
              attempts++;

              if (iframeDoc.body) {
                // Force a reflow to ensure accurate measurements
                iframeDoc.body.offsetHeight;

                // Get the most accurate content size
                const height = Math.max(
                  iframeDoc.body.scrollHeight,
                  iframeDoc.body.offsetHeight,
                  iframeDoc.documentElement.scrollHeight,
                  iframeDoc.documentElement.offsetHeight
                );

                // More lenient criteria for showing content quickly
                if (height > 50 && height < 10000) {
                  const finalHeight = Math.max(height + 20, 400); // Add small buffer
                  iframe.style.height = finalHeight + 'px';

                  // Scale content if needed
                  if (iframeDoc.body.firstChild) {
                    const container = iframeDoc.body.firstChild as HTMLElement;
                    if (container.style) {
                      container.style.maxWidth = '100%';
                      container.style.overflowX = 'hidden';
                      container.style.margin = '0 auto';

                      // Apply additional scaling for smaller viewports
                      const parentWidth = iframe.parentElement?.clientWidth || 0;
                      if (container.offsetWidth > parentWidth && parentWidth > 0) {
                        const scale = Math.min(1, parentWidth / container.offsetWidth);
                        container.style.transform = `scale(${scale})`;
                        container.style.transformOrigin = 'top left';
                      }
                    }
                  }

                  // Show iframe with faster transition and hide loader
                  iframe.style.opacity = '1';
                  iframe.style.transition = 'opacity 0.15s ease-in-out';

                  // Hide loading indicator
                  const loader = document.getElementById('html-preview-loader');
                  if (loader) {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                      loader.style.display = 'none';
                    }, 150);
                  }
                  return;
                }
              }

              if (attempts < maxAttempts) {
                setTimeout(measureAndResize, 100); // More frequent rechecks
              } else {
                // Give up and show content anyway after max attempts
                iframe.style.height = '800px'; // Fallback height
                iframe.style.opacity = '1';
                iframe.style.transition = 'opacity 0.15s ease-in-out';

                // Hide loading indicator
                const loader = document.getElementById('html-preview-loader');
                if (loader) {
                  loader.style.opacity = '0';
                  setTimeout(() => {
                    loader.style.display = 'none';
                  }, 150);
                }
              }
            };

            // Start measuring with a shorter initial delay
            setTimeout(measureAndResize, 150); // Reduced from 800ms
          }, 200); // Reduced from 400ms to start measurement sooner

          // Simplified resize handler for window resize only
          const handleResize = () => {
            // Only handle scaling for window resize, not full iframe resize
            if (iframeDoc.body && iframeDoc.body.firstChild) {
              const container = iframeDoc.body.firstChild as HTMLElement;
              if (container.style) {
                const parentWidth = iframe.parentElement?.clientWidth || 0;
                if (container.offsetWidth > parentWidth && parentWidth > 0) {
                  const scale = Math.min(1, parentWidth / container.offsetWidth);
                  container.style.transform = `scale(${scale})`;
                  container.style.transformOrigin = 'top left';
                }
              }
            }
          };
          window.addEventListener('resize', handleResize);

          // Store observer reference for cleanup
          let observerRef: MutationObserver | null = null;

          // Set up mutation observer for dynamic content changes (but only after initial load)
          // This will only handle minor content updates, not major resizing
          setTimeout(() => {
            observerRef = new MutationObserver(() => {
              // Only handle scaling adjustments for dynamic content
              clearTimeout(iframe.dataset.resizeTimeout as any);
              iframe.dataset.resizeTimeout = setTimeout(handleResize, 100) as any;
            });

            if (iframeDoc.body && observerRef) {
              observerRef.observe(iframeDoc.body, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true
              });
            }
          }, 1000); // Delayed even more to avoid initial load conflicts

          // Cleanup function
          return () => {
            if (observerRef) {
              observerRef.disconnect();
            }
            window.removeEventListener('resize', handleResize);
            clearTimeout(iframe.dataset.resizeTimeout as any);
          };
        }
      }, 50); // Close the setTimeout
    };

    return (
      <div ref={ref} className="w-full h-full relative">
        <iframe
          ref={iframeRef}
          className="w-full border-0 bg-white rounded-lg shadow-sm"
          style={{
            height: '100%',
            width: '100%',
            maxWidth: '100%',
            overflowX: 'hidden'
          }}
          sandbox="allow-scripts allow-same-origin"
          title="HTML Preview"
        />
        {/* Loading indicator that will be hidden when iframe becomes visible */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg"
          style={{
            opacity: '1',
            transition: 'opacity 0.15s ease-in-out',
            pointerEvents: 'none'
          }}
          id="html-preview-loader"
        >
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            <span className="text-sm">Loading preview...</span>
          </div>
        </div>
      </div>
    );
  }
);

HtmlPreview.displayName = "HtmlPreview";
