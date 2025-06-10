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
      // Add enhanced print styles
      const enhancedHtml = html.replace(
        /<\/head>/i,
        `
        <style>
          @media print {
            @page {
              margin: 0.5in;
              size: A4;
            }
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              font-size: 12pt !important;
              line-height: 1.4 !important;
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
            /* Hide interactive elements in print */
            button, input, select, textarea {
              display: none !important;
            }
            /* Ensure proper text rendering */
            h1, h2, h3, h4, h5, h6 {
              page-break-after: avoid !important;
            }
            p, li {
              orphans: 3 !important;
              widows: 3 !important;
            }
          }
        </style>
        </head>`
      );

      printWindow.document.write(enhancedHtml);
      printWindow.document.close();

      // Wait for content to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
    }
  };

  const handleDirectPrint = () => {
    // For direct printing of the current page
    window.print();
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
            <DialogTitle>Print Options</DialogTitle>
            <DialogDescription>
              Choose how you want to print your HTML resume
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
              Print in New Window
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleDirectPrint();
                setIsOpen(false);
              }}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Current View
            </Button>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <p className="font-medium mb-1">Tips for best PDF results:</p>
            <ul className="text-xs space-y-1">
              <li>• Use "Print in New Window" for better formatting</li>
              <li>• Select "Save as PDF" in your browser's print dialog</li>
              <li>• Choose A4 or Letter size for standard resumes</li>
              <li>• Enable "Background graphics" for colors</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
