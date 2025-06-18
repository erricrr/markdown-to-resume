import { forwardRef, useEffect, useRef, useState } from "react";
import { processHtmlForDisplay } from "@/utils/htmlProcessor";

interface HtmlPreviewProps {
  html: string;
  paperSize?: 'A4' | 'US_LETTER';
  uploadedFileUrl?: string;
  uploadedFileName?: string;
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

          // Process HTML for consistent display using unified processor
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
          sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation"
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
