
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

// Professionally redesigned template CSS with perfectly aligned decorative elements
const defaultTemplateCSS = {
  professional: `/* Professional Template - Corporate Excellence */
.template-professional {
  background: white;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.template-professional .resume-heading-1 {
  font-size: 2.5rem;
  font-weight: 400;
  color: #1a202c;
  margin-bottom: 0.75rem;
  text-align: center;
  letter-spacing: 0.02em;
  line-height: 1.2;
  position: relative;
  padding-bottom: 1rem;
}

.template-professional .resume-heading-1::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: #2d3748;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-professional .resume-heading-2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  padding-left: 20px;
  border-left: 4px solid #2d3748;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-professional .resume-heading-3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.template-professional .resume-paragraph {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.template-professional .resume-list-item::before {
  content: "▪";
  color: #2d3748;
  font-weight: bold;
  margin-right: 0.5rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}`,

  modern: `/* Modern Template - Tech Innovation */
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
  width: 6px;
  height: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-modern .resume-heading-1 {
  font-size: 2.75rem;
  font-weight: 200;
  color: #1a202c;
  margin-bottom: 1rem;
  margin-left: 2rem;
  letter-spacing: -0.02em;
  line-height: 1.1;
  position: relative;
}

.template-modern .resume-heading-1::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 80px;
  height: 2px;
  background: #667eea;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-modern .resume-heading-2 {
  font-size: 1.25rem;
  font-weight: 500;
  color: #667eea;
  margin-top: 2rem;
  margin-bottom: 1rem;
  margin-left: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
}

.template-modern .resume-heading-2::before {
  content: "";
  position: absolute;
  left: -1.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  background: #667eea;
  border-radius: 50%;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-modern .resume-heading-3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  margin-left: 2rem;
}

.template-modern .resume-paragraph {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
  margin-left: 2rem;
}

.template-modern .resume-list {
  margin-left: 2rem;
}

.template-modern .resume-list-item::before {
  content: "→";
  color: #667eea;
  font-weight: bold;
  margin-right: 0.5rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}`,

  minimalist: `/* Minimalist Template - Pure Elegance */
.template-minimalist {
  background: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.template-minimalist .resume-heading-1 {
  font-size: 2.25rem;
  font-weight: 100;
  color: #1a202c;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: 0.15em;
  line-height: 1.3;
  position: relative;
  padding-bottom: 1.5rem;
}

.template-minimalist .resume-heading-1::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 1px;
  background: #718096;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-minimalist .resume-heading-2 {
  font-size: 0.875rem;
  font-weight: 400;
  color: #718096;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  text-align: center;
  position: relative;
  padding: 0 2rem;
}

.template-minimalist .resume-heading-2::before,
.template-minimalist .resume-heading-2::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 1.5rem;
  height: 1px;
  background: #e2e8f0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-minimalist .resume-heading-2::before {
  left: 0;
}

.template-minimalist .resume-heading-2::after {
  right: 0;
}

.template-minimalist .resume-heading-3 {
  font-size: 1rem;
  font-weight: 400;
  color: #2d3748;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.02em;
}

.template-minimalist .resume-paragraph {
  color: #4a5568;
  line-height: 1.7;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.template-minimalist .resume-list-item::before {
  content: "◦";
  color: #cbd5e1;
  margin-right: 0.75rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}`,

  creative: `/* Creative Template - Bold Innovation */
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
  height: 12px;
  background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #ffeaa7 100%);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-creative .resume-heading-1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3436;
  margin-top: 2rem;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
  line-height: 1.1;
  position: relative;
}

.template-creative .resume-heading-1::after {
  content: "";
  position: absolute;
  bottom: -12px;
  left: 0;
  width: 120px;
  height: 4px;
  background: #ff6b6b;
  border-radius: 2px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-creative .resume-heading-2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4ecdc4;
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  padding-left: 2.5rem;
}

.template-creative .resume-heading-2::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: linear-gradient(180deg, #ff6b6b 0%, #4ecdc4 100%);
  border-radius: 3px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-creative .resume-heading-3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3436;
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
  background: #45b7d1;
  border-radius: 50%;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-creative .resume-paragraph {
  color: #636e72;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.template-creative .resume-list-item::before {
  content: "▸";
  color: #ff6b6b;
  font-weight: bold;
  margin-right: 0.5rem;
  font-size: 0.8rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}`,

  executive: `/* Executive Template - Leadership Excellence */
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
  height: 8px;
  background: #2c3e50;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-executive .resume-heading-1 {
  font-size: 2.75rem;
  font-weight: 300;
  color: #2c3e50;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  letter-spacing: 0.05em;
  line-height: 1.2;
  position: relative;
  padding-bottom: 1.5rem;
}

.template-executive .resume-heading-1::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 3px;
  background: #e67e22;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-executive .resume-heading-2 {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  background: #2c3e50;
  padding: 1rem 2rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-executive .resume-heading-2::after {
  content: "";
  position: absolute;
  right: -15px;
  top: 0;
  width: 0;
  height: 0;
  border-left: 15px solid #2c3e50;
  border-top: 25px solid transparent;
  border-bottom: 25px solid transparent;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-executive .resume-heading-3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  position: relative;
  padding-left: 1.25rem;
}

.template-executive .resume-heading-3::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #e67e22;
  border-radius: 50%;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.template-executive .resume-paragraph {
  color: #34495e;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.template-executive .resume-list-item::before {
  content: "▪";
  color: #e67e22;
  font-weight: bold;
  margin-right: 0.5rem;
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
