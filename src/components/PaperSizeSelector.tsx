import { Check, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PaperSizeSelectorProps {
  selectedPaperSize: 'A4' | 'US_LETTER';
  onPaperSizeChange: (paperSize: 'A4' | 'US_LETTER') => void;
}

export const PaperSizeSelector = ({
  selectedPaperSize,
  onPaperSizeChange,
}: PaperSizeSelectorProps) => {
  const paperSizes = [
    { id: 'A4', name: 'A4 (210 × 297 mm)', dimensions: '210 × 297 mm' },
    { id: 'US_LETTER', name: 'US Letter (8.5 × 11 in)', dimensions: '8.5 × 11 in' },
  ];

  const getSelectedPaperSizeName = () => {
    const selected = paperSizes.find((size) => size.id === selectedPaperSize);
    return selected ? selected.name.split(' ')[0] : 'A4';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-white hover:bg-gray-50">
          <Ruler className="h-4 w-4" />
          {getSelectedPaperSizeName()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 p-2">
        <div className="text-xs font-medium text-gray-500 px-2 py-1.5">Paper Size</div>
        {paperSizes.map((size) => (
          <DropdownMenuItem
            key={size.id}
            className={`flex items-center justify-between px-2 py-1.5 cursor-pointer ${
              selectedPaperSize === size.id ? 'bg-muted' : ''
            }`}
            onClick={() => onPaperSizeChange(size.id as 'A4' | 'US_LETTER')}
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{size.name}</span>
              <span className="text-xs text-gray-500">{size.dimensions}</span>
            </div>
            {selectedPaperSize === size.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
