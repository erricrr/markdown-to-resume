import { forwardRef, useEffect, useRef } from "react";

interface HtmlPreviewProps {
  html: string;
}

export const HtmlPreview = forwardRef<HTMLDivElement, HtmlPreviewProps>(
  ({ html }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
      if (iframeRef.current) {
        const iframe = iframeRef.current;
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
      /* Ensure proper CSS rendering */
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: auto;
        overflow-x: hidden;
      }
      * {
        box-sizing: border-box;
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
      /* Ensure proper CSS rendering */
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: auto;
        overflow-x: hidden;
      }
      * {
        box-sizing: border-box;
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

          // Handle iframe resizing to fit content with proper delay for CSS to load
          const resizeIframe = () => {
            if (iframeDoc.body) {
              // Wait for any CSS layouts to be calculated
              setTimeout(() => {
                const height = Math.max(
                  iframeDoc.body.scrollHeight,
                  iframeDoc.body.offsetHeight,
                  iframeDoc.documentElement.clientHeight,
                  iframeDoc.documentElement.scrollHeight,
                  iframeDoc.documentElement.offsetHeight
                );
                iframe.style.height = Math.max(height, 400) + 'px';
              }, 50);
            }
          };

          // Resize after content loads and CSS is applied
          setTimeout(resizeIframe, 200);

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
      }
    }, [html]);

    return (
      <div ref={ref} className="w-full h-full">
        <iframe
          ref={iframeRef}
          className="w-full border-0 bg-white rounded-lg shadow-sm"
          style={{ minHeight: '600px', minWidth: '800px' }}
          sandbox="allow-scripts allow-same-origin"
          title="HTML Preview"
        />
      </div>
    );
  }
);

HtmlPreview.displayName = "HtmlPreview";
