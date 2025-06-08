import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Code, Download, RotateCcw, Eye, Bug } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CSSEditorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  onCSSChange: (template: string, css: string) => void;
  debugCSS?: () => void;
}

const templates = [
  {
    id: 'professional',
    name: 'Professional',
  },
  {
    id: 'modern',
    name: 'Modern',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
  },
  {
    id: 'creative',
    name: 'Creative',
  },
  {
    id: 'executive',
    name: 'Executive',
  },
];

// Redesigned template CSS with decorative elements that work in PDFs
const defaultTemplateCSS = {
  professional: `/* Professional Template */
.template-professional {
  background: white;
}

.template-professional .resume-heading-1 {
  font-size: 1.875rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.template-professional .resume-heading-2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #000;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}`,

  modern: `/* Modern Template - Tech Professional */
.template-modern {
  background: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
}

.template-modern::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-modern .resume-heading-1 {
  font-size: 2.5rem;
  font-weight: 300;
  color: #1e293b;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
  line-height: 1.1;
  position: relative;
  padding-left: 1rem;
}

.template-modern .resume-heading-1::after {
  content: "";
  position: absolute;
  bottom: -0.5rem;
  left: 1rem;
  width: 60px;
  height: 3px;
  background: #3b82f6;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-modern .resume-heading-2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #3b82f6;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-left: 1rem;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.template-modern .resume-heading-2::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-modern .resume-paragraph,
.template-modern .resume-list {
  padding-left: 1rem;
}

.template-modern .resume-list-item::before {
  content: "▸";
  color: #3b82f6;
  font-weight: bold;
  margin-right: 0.5rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}`,

  minimalist: `/* Minimalist Template - Ultra Clean */
.template-minimalist {
  background: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.template-minimalist .resume-heading-1 {
  font-size: 2rem;
  font-weight: 200;
  color: #0f172a;
  margin-bottom: 2rem;
  letter-spacing: 0.1em;
  line-height: 1.2;
  text-align: center;
  position: relative;
}

.template-minimalist .resume-heading-1::after {
  content: "";
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 1px;
  background: #64748b;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-minimalist .resume-heading-2 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  position: relative;
  padding-bottom: 0.5rem;
}

.template-minimalist .resume-heading-2::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: #e2e8f0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-minimalist .resume-heading-3 {
  font-size: 1rem;
  font-weight: 400;
  color: #0f172a;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.template-minimalist .resume-paragraph {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 1rem;
}

.template-minimalist .resume-list-item {
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 0.5rem;
}

.template-minimalist .resume-list-item::before {
  content: "•";
  color: #cbd5e1;
  margin-right: 0.75rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}`,

  creative: `/* Creative Template - Modern Edge */
.template-creative {
  background: white;
  font-family: 'Montserrat', sans-serif;
  position: relative;
}

.template-creative::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-creative .resume-heading-1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  line-height: 1.1;
  position: relative;
}

.template-creative .resume-heading-1::after {
  content: "";
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 80px;
  height: 4px;
  background: #ec4899;
  border-radius: 2px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-creative .resume-heading-2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #8b5cf6;
  margin-top: 2rem;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.template-creative .resume-heading-2::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #ec4899 0%, #8b5cf6 100%);
  border-radius: 2px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-creative .resume-heading-3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  position: relative;
  padding-left: 1.5rem;
}

.template-creative .resume-heading-3::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: #06b6d4;
  border-radius: 50%;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-creative .resume-list-item::before {
  content: "▲";
  color: #ec4899;
  font-size: 0.7rem;
  margin-right: 0.75rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}`,

  executive: `/* Executive Template - Corporate Leadership */
.template-executive {
  background: white;
  font-family: 'Source Sans Pro', sans-serif;
  position: relative;
}

.template-executive::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: #1f2937;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-executive .resume-heading-1 {
  font-size: 2.5rem;
  font-weight: 300;
  color: #1f2937;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: 0.02em;
  line-height: 1.2;
  position: relative;
  padding-bottom: 1rem;
}

.template-executive .resume-heading-1::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 2px;
  background: #d97706;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-executive .resume-heading-2 {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin-top: 2rem;
  margin-bottom: 1rem;
  background: #1f2937;
  padding: 0.75rem 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-executive .resume-heading-2::before {
  content: "";
  position: absolute;
  right: -12px;
  top: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-left: 12px solid #1f2937;
  border-top: 22px solid transparent;
  border-bottom: 22px solid transparent;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-executive .resume-heading-3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  position: relative;
  padding-left: 1rem;
}

.template-executive .resume-heading-3::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: #d97706;
  border-radius: 50%;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-executive .resume-paragraph {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.template-executive .resume-list-item::before {
  content: "■";
  color: #d97706;
  font-size: 0.6rem;
  margin-right: 0.75rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}`
};

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
    setTemplateCSS(prev => ({
      ...prev,
      [template]: defaultCSS
    }));
    onCSSChange(template, defaultCSS);
    toast({
      title: "Template Reset",
      description: `${templates.find(t => t.id === template)?.name} template has been reset to default.`
    });
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
