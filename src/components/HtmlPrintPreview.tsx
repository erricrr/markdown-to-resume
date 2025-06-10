import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Printer } from "lucide-react";

interface HtmlPrintPreviewProps {
  html: string;
}

export const HtmlPrintPreview = ({ html }: HtmlPrintPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);

        const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (printWindow) {
            // Simple approach - just preserve everything exactly as is
      let enhancedHtml = html;

      // Add minimal print-specific CSS that preserves layouts
      const printStyles = `
        <style>
          @page {
            margin: 0;
            size: A4;
          }

          @media print {
            /* Preserve ALL colors and backgrounds exactly as designed */
            *, *::before, *::after {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* Remove animations and transitions for clean print */
            *, *::before, *::after {
              animation-duration: 0s !important;
              animation-delay: 0s !important;
              transition-duration: 0s !important;
              transition-delay: 0s !important;
            }

            /* Force grid layouts to stay grid in print */
            *[style*="display: grid"],
            *[style*="display:grid"] {
              display: grid !important;
            }

            /* Hide interactive elements that don't make sense in print */
            button:not([class*="print"]):not([class*="visible"]),
            input[type="button"],
            input[type="submit"],
            input[type="reset"],
            .interactive-section,
            [class*="interactive"]:not([class*="print"]) {
              display: none !important;
            }
          }
        </style>

        <script>
          window.addEventListener('beforeprint', function() {
            document.title = 'Resume';
          });

          window.onload = function() {
            setTimeout(() => {
              window.print();
              setTimeout(() => window.close(), 1000);
            }, 500);
          };
        </script>
      `;

      // Insert the print styles before closing head tag
      if (enhancedHtml.includes('</head>')) {
        enhancedHtml = enhancedHtml.replace('</head>', printStyles + '</head>');
      } else {
        // If no head tag, add one
        enhancedHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Resume</title>
  ${printStyles}
</head>
<body>
  ${html}
</body>
</html>`;
      }

      printWindow.document.write(enhancedHtml);
      printWindow.document.close();
    }
  };



  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-white hover:bg-gray-50"
          >
            <Printer className="h-4 w-4" />
            Print PDF
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Print Resume</DialogTitle>
            <DialogDescription>
              Generate a professional PDF of your HTML resume
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={() => {
                handlePrint();
                setIsOpen(false);
              }}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Resume as PDF
            </Button>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <p className="font-medium mb-1">📋 Print Dialog Settings:</p>
            <ul className="text-xs space-y-1">
              <li>• <strong>Destination:</strong> "Save as PDF"</li>
              <li>• <strong>Paper size:</strong> A4 or Letter</li>
              <li>• <strong>Headers and footers:</strong> OFF (removes metadata)</li>
              <li>• <strong>Background graphics:</strong> ON (preserves colors)</li>
              <li>• <strong>Margins:</strong> Minimum</li>
            </ul>
          </div>

          <div className="mt-3 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
            <p className="font-medium mb-1">⚠️ Important:</p>
            <p className="text-xs">Turn off "Headers and footers" to prevent browser metadata from appearing in your PDF. This ensures a clean, professional resume without URL/date stamps.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
