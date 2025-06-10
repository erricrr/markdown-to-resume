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
          // Write the HTML content to the iframe
          iframeDoc.open();
          iframeDoc.write(html);
          iframeDoc.close();

          // Add print media query styles for better PDF rendering
          const printStyles = `
            <style>
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
              }
            </style>
          `;

          // Add the print styles to the head
          if (iframeDoc.head) {
            const styleElement = iframeDoc.createElement('div');
            styleElement.innerHTML = printStyles;
            const style = styleElement.firstChild as HTMLStyleElement;
            if (style) {
              iframeDoc.head.appendChild(style);
            }
          }

          // Handle iframe resizing to fit content
          const resizeIframe = () => {
            if (iframeDoc.body) {
              const height = Math.max(
                iframeDoc.body.scrollHeight,
                iframeDoc.body.offsetHeight,
                iframeDoc.documentElement.clientHeight,
                iframeDoc.documentElement.scrollHeight,
                iframeDoc.documentElement.offsetHeight
              );
              iframe.style.height = height + 'px';
            }
          };

          // Resize immediately and set up observer for dynamic content
          setTimeout(resizeIframe, 100);

          // Set up mutation observer to handle dynamic content changes
          const observer = new MutationObserver(resizeIframe);
          observer.observe(iframeDoc.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true
          });

          // Handle window resize
          const handleResize = () => {
            setTimeout(resizeIframe, 100);
          };
          window.addEventListener('resize', handleResize);

          // Cleanup function
          return () => {
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
          };
        }
      }
    }, [html]);

    return (
      <div ref={ref} className="w-full h-full">
        <iframe
          ref={iframeRef}
          className="w-full border-0 bg-white rounded-lg shadow-sm"
          style={{ minHeight: '600px' }}
          sandbox="allow-scripts allow-same-origin"
          title="HTML Preview"
        />
      </div>
    );
  }
);

HtmlPreview.displayName = "HtmlPreview";
