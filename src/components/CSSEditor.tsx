import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Code, Download, RotateCcw, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { templateStyles } from '../styles/resumeTemplates';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export interface CSSEditorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  onCSSChange: (template: string, css: string) => void;
  debugCSS?: () => void;
}

// Default CSS for resume templates - using single source of truth
const defaultTemplateCSS: Record<string, string> = templateStyles;

export const CSSEditor = ({ selectedTemplate, onTemplateChange, onCSSChange }: CSSEditorProps) => {
  const [templateCSS, setTemplateCSS] = useState<Record<string, string>>(() => {
    // Load from localStorage or use defaults
    const savedCSS: Record<string, string> = {};
    Object.keys(defaultTemplateCSS).forEach(template => {
      const saved = localStorage.getItem(`css-editor-${template}`);
      savedCSS[template] = saved || defaultTemplateCSS[template];
    });
    return savedCSS;
  });
  const { toast } = useToast();

  // Auto-save effect
  useEffect(() => {
    Object.entries(templateCSS).forEach(([template, css]) => {
      localStorage.setItem(`css-editor-${template}`, css);
    });
  }, [templateCSS]);

  // Apply CSS when template changes
  useEffect(() => {
    const selectedCSS = templateCSS[selectedTemplate];
    if (selectedCSS) {
      onCSSChange(selectedTemplate, selectedCSS);
    }
  }, [selectedTemplate, templateCSS, onCSSChange]);

  // Initialize CSS on mount
  useEffect(() => {
    const selectedCSS = templateCSS[selectedTemplate];
    if (selectedCSS) {
      onCSSChange(selectedTemplate, selectedCSS);
    } else {
      onCSSChange(selectedTemplate, defaultTemplateCSS[selectedTemplate]);
    }
  }, []);

  const handleCSSChange = (css: string) => {
    setTemplateCSS(prev => ({
      ...prev,
      [selectedTemplate]: css
    }));
    onCSSChange(selectedTemplate, css);
  };

  const handleReset = () => {
    const defaultCSS = defaultTemplateCSS[selectedTemplate];
    if (defaultCSS) {
      setTemplateCSS(prev => ({
        ...prev,
        [selectedTemplate]: defaultCSS
      }));
      onCSSChange(selectedTemplate, defaultCSS);
      toast({
        title: "Template Reset",
        description: "Template has been reset to default styling."
      });
    }
  };

  const handleExport = () => {
    const css = templateCSS[selectedTemplate];
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate}-template.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "CSS Exported",
      description: "Template CSS has been downloaded."
    });
  };

  return (
    <Card className="border-0 bg-white overflow-hidden flex flex-col h-full">
      {/* Consolidated Header */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              CSS Editor ({selectedTemplate})
            </h2>
            <span className="text-xs text-gray-500">Auto-saved</span>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md cursor-help">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-blue-700">Tips</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-md">
                <div className="space-y-2 text-sm">
                  <div><strong>CSS Variables:</strong> Use --resume-font-family, --resume-font-size, --resume-h1-font-size for easy customization</div>
                  <div><strong>Colors:</strong> Target .template-{selectedTemplate} for template-specific styling</div>
                  <div><strong>Priority:</strong> Add !important if styles aren't applying</div>
                  <div><strong>Live Updates:</strong> Changes apply immediately to preview and PDF</div>
                  <div><strong>Learn CSS:</strong> <a href="https://www.w3schools.com/css/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">W3Schools CSS Tutorial</a></div>
                </div>
              </TooltipContent>
            </Tooltip>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* CSS Editor */}
      <div className="flex-1 p-3 overflow-hidden">
        <Textarea
          value={templateCSS[selectedTemplate] || ''}
          onChange={(e) => handleCSSChange(e.target.value)}
          className="h-full w-full font-mono text-sm resize-none"
          placeholder={`Enter CSS for ${selectedTemplate} template...

Example:
.template-${selectedTemplate} {
  font-family: 'Arial', sans-serif;
  color: #333;
}

.template-${selectedTemplate} h1 {
  color: #000;
  font-size: 24pt;
}`}
        />
      </div>
    </Card>
  );
};
