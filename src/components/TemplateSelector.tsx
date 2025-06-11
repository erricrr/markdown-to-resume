import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

const templates = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Classic business format',
    color: 'bg-blue-500',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design',
    color: 'bg-purple-500',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean and simple',
    color: 'bg-gray-500',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and artistic',
    color: 'bg-green-500',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Senior-level format',
    color: 'bg-red-500',
  },
];

export const TemplateSelector = ({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) => {
  const currentTemplate = templates.find(t => t.id === selectedTemplate) || templates[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 text-xs sm:text-sm h-9 px-4">
          {/* <div className={`w-3 h-3 rounded-full ${currentTemplate.color}`} /> */}
          <span>{currentTemplate.name}</span>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 sm:w-64 p-2">
        <div className="grid gap-2">
          {templates.map((template) => (
            <DropdownMenuItem
              key={template.id}
              className="p-0"
              onSelect={() => onTemplateChange(template.id)}
            >
              <Card className={cn(
                'w-full p-3 cursor-pointer transition-all hover:shadow-md',
                selectedTemplate === template.id && 'ring-2 ring-primary'
              )}>
                <div className="flex items-center gap-3">
                  {/* <div className={`w-4 h-4 rounded-full ${template.color}`} /> */}
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </div>
              </Card>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
