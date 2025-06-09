import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Code, Download, RotateCcw, Eye, Bug } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { templateStyles } from '../styles/resumeTemplates';

export interface CSSEditorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  onCSSChange: (template: string, css: string) => void;
  debugCSS?: () => void;
}

const templates = [
  {
    id: 'professional',
    name: 'Professional',
    // color: 'bg-blue-500',
  },
  {
    id: 'modern',
    name: 'Modern',
    // color: 'bg-purple-500',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    // color: 'bg-gray-500',
  },
  {
    id: 'creative',
    name: 'Creative',
    // color: 'bg-green-500',
  },
  {
    id: 'executive',
    name: 'Executive',
    // color: 'bg-red-500',
  },
];

// Default CSS for resume templates - now using single source of truth
export const defaultTemplateCSS: Record<string, string> = templateStyles;

export const CSSEditor = ({ selectedTemplate, onTemplateChange, onCSSChange, debugCSS }: CSSEditorProps) => {
  const [templateCSS, setTemplateCSS] = useState<Record<string, string>>(defaultTemplateCSS);
  const [activeTab, setActiveTab] = useState(selectedTemplate);
  const { toast } = useToast();

  useEffect(() => {
    setActiveTab(selectedTemplate);
  }, [selectedTemplate]);

  // Initialize CSS for all templates on mount
  useEffect(() => {
    console.log('🚀 Initializing CSS for all templates...');
    Object.entries(defaultTemplateCSS).forEach(([template, css]) => {
      onCSSChange(template, css);
    });
  }, [onCSSChange]);

  const handleCSSChange = (template: string, css: string) => {
    console.log(`✏️ CSS changed for ${template}`);
    setTemplateCSS(prev => ({
      ...prev,
      [template]: css
    }));
    // Apply immediately without debouncing
    onCSSChange(template, css);
  };

  const handleTestCSS = (template: string) => {
    const testCSS = `/* TEST CSS for ${template} */
.template-${template} {
  background: black !important;
  color: white !important;
}

.template-${template} .resume-heading-1 {
  color: red !important;
  background-color: yellow !important;
  padding: 20px !important;
  border: 5px solid blue !important;
}

.template-${template} .resume-heading-2 {
  color: green !important;
  background-color: pink !important;
  padding: 10px !important;
}`;

    console.log(`🧪 Applying test CSS to ${template}`);
    setTemplateCSS(prev => ({
      ...prev,
      [template]: testCSS
    }));
    onCSSChange(template, testCSS);

    toast({
      title: "Test CSS Applied",
      description: `Applied bright test styling to ${template} template. Check the preview!`
    });
  };

  const handleResetTemplate = (template: string) => {
    const defaultCSS = defaultTemplateCSS[template as keyof typeof defaultTemplateCSS];
    if (defaultCSS) {
      setTemplateCSS(prev => ({
        ...prev,
        [template]: defaultCSS
      }));
      onCSSChange(template, defaultCSS);
      toast({
        title: "Template Reset",
        description: `${templates.find(t => t.id === template)?.name} template has been reset to default.`
      });
    } else {
      console.warn(`No default CSS found for template: ${template}`);
    }
  };

  const handleExportCSS = (template: string) => {
    const css = templateCSS[template];
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template}-template.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "CSS Exported",
      description: `${templates.find(t => t.id === template)?.name} template CSS has been downloaded.`
    });
  };

  const handleTabChange = (template: string) => {
    setActiveTab(template);
    onTemplateChange(template);
  };

  const handleDebug = () => {
    if (debugCSS) {
      debugCSS();
    }

    // Also check if dynamic CSS element exists and log its content
    const dynamicStyleElement = document.getElementById('dynamic-template-css') as HTMLStyleElement;
    if (dynamicStyleElement) {
      console.log('🔍 Dynamic CSS Element Found:');
      console.log('- Content Length:', dynamicStyleElement.textContent?.length || 0);
      console.log('- First 500 chars:', dynamicStyleElement.textContent?.substring(0, 500));
    } else {
      console.error('❌ Dynamic CSS Element NOT Found!');
    }

    toast({
      title: "Debug Info",
      description: "Check the browser console for CSS debug information."
    });
  };

  return (
    <Card className="shadow-xl border-0 bg-white overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Template CSS Editor
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDebug}
              className="flex items-center gap-1"
            >
              <Bug className="h-3 w-3" />
              Debug
            </Button>
            <Badge variant="secondary" className="text-xs">
              Live Preview
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-5">
              {templates.map((template) => (
                <TabsTrigger
                  key={template.id}
                  value={template.id}
                  className="flex items-center gap-2 text-xs"
                >
                  {/* <div className={`w-2 h-2 rounded-full ${template.color}`} /> */}
                  {template.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {templates.map((template) => (
            <TabsContent
              key={template.id}
              value={template.id}
              className="flex-1 px-6 pb-6 mt-4 overflow-hidden"
            >
              <div className="h-full flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* <div className={`w-3 h-3 rounded-full ${template.color}`} /> */}
                    <h3 className="font-medium">{template.name} Template</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestCSS(template.id)}
                      className="flex items-center gap-1 bg-yellow-50 hover:bg-yellow-100 border-yellow-300"
                    >
                      <Eye className="h-3 w-3" />
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetTemplate(template.id)}
                      className="flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportCSS(template.id)}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <Textarea
                    value={templateCSS[template.id]}
                    onChange={(e) => handleCSSChange(template.id, e.target.value)}
                    className="h-full resize-none font-mono text-sm"
                    placeholder={`Enter CSS for ${template.name} template...`}
                  />
                </div>

                <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded">
                  <p>💡 <strong>Tip:</strong> Changes apply immediately. Try changing background colors or font sizes.</p>
                  <p>🎯 <strong>Target classes:</strong> .template-{template.id}, .resume-heading-1, .resume-heading-2, etc.</p>
                  <p>🧪 <strong>Test:</strong> Click "Test" for bright colors to verify live preview works.</p>
                  <p>🐛 <strong>Debug:</strong> Click "Debug" button to check CSS injection in console.</p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Card>
  );
};
