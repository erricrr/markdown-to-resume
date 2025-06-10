import { forwardRef, useEffect, useRef, useState } from "react";

interface HtmlPreviewProps {
  html: string;
}

export const HtmlPreview = forwardRef<HTMLDivElement, HtmlPreviewProps>(
  ({ html }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const previousHtmlRef = useRef(html);
    const resizeTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
      // Debounce html updates to avoid frequent re-renders
      if (!isInitialRender && Math.abs(html.length - previousHtmlRef.current.length) < 5) {
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }

        resizeTimeoutRef.current = window.setTimeout(() => {
          previousHtmlRef.current = html;
          updateIframeContent();
        }, 500);

        return () => {
          if (resizeTimeoutRef.current) {
            clearTimeout(resizeTimeoutRef.current);
          }
        };
      }

      // For initial render or significant changes, update immediately
      previousHtmlRef.current = html;
      setIsInitialRender(false);
      updateIframeContent();
    }, [html]);

    const updateIframeContent = () => {
      console.log('HtmlPreview updateIframeContent triggered');

      if (iframeRef.current) {
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

          // If the HTML doesn't include DOCTYPE, add it along with proper meta tags
          let htmlContent = html;
          if (!html.trim().toLowerCase().startsWith('<!doctype')) {
            htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume Preview</title>
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
        body {
          margin: 0 !important;
          padding: 20px !important;
          background: white !important;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        .no-print {
          display: none !important;
        }
        .page-break-before {
          page-break-before: always !important;
        }
        .page-break-after {
          page-break-after: always !important;
        }
        .page-break-inside-avoid {
          page-break-inside: avoid !important;
        }
      }
    </style>
</head>
<body>
${html}
</body>
</html>`;
          } else {
            // If HTML already has DOCTYPE, just ensure it has proper print styles
            htmlContent = html.replace(
              /<\/head>/i,
              `<style>
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
        body {
          margin: 0 !important;
          padding: 20px !important;
          background: white !important;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        .no-print {
          display: none !important;
        }
        .page-break-before {
          page-break-before: always !important;
        }
        .page-break-after {
          page-break-after: always !important;
        }
        .page-break-inside-avoid {
          page-break-inside: avoid !important;
        }
      }
    </style>
</head>`
            );
          }

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

          // Handle iframe resizing to fit content with proper delay for CSS to load
          const resizeIframe = () => {
            if (iframeDoc.body) {
              // Wait for any CSS layouts to be calculated
              setTimeout(() => {
                // Get the content size
                const height = Math.max(
                  iframeDoc.body.scrollHeight,
                  iframeDoc.body.offsetHeight,
                  iframeDoc.documentElement.clientHeight,
                  iframeDoc.documentElement.scrollHeight,
                  iframeDoc.documentElement.offsetHeight
                );

                // Set height with max-height to prevent overflow
                iframe.style.height = Math.max(height, 400) + 'px';

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
              }, 50);
            }
          };

          // Resize after content loads and CSS is applied - longer delay for color rendering
          setTimeout(resizeIframe, 400);

          // Set up mutation observer to handle dynamic content changes
          const observer = new MutationObserver(() => {
            // Debounce resize calls
            clearTimeout(iframe.dataset.resizeTimeout as any);
            iframe.dataset.resizeTimeout = setTimeout(resizeIframe, 100) as any;
          });

          if (iframeDoc.body) {
            observer.observe(iframeDoc.body, {
              childList: true,
              subtree: true,
              attributes: true,
              characterData: true
            });
          }

          // Handle window resize
          const handleResize = () => {
            setTimeout(resizeIframe, 100);
          };
          window.addEventListener('resize', handleResize);

            // Cleanup function
            return () => {
              observer.disconnect();
              window.removeEventListener('resize', handleResize);
              clearTimeout(iframe.dataset.resizeTimeout as any);
            };
          }
        }, 50); // Close the setTimeout
      }
    };

    return (
      <div ref={ref} className="w-full h-full">
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
      </div>
    );
  }
);

HtmlPreview.displayName = "HtmlPreview";
