import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Code, Download, RotateCcw, Eye, Bug } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

// Default CSS for resume templates
export const defaultTemplateCSS: Record<string, string> = {
  modern: `/* Modern Template - Clean and contemporary */
.template-modern {
  background: #ffffff;
  color: #333333;
  font-family: 'Inter', sans-serif;
  padding: 2.5rem 3rem;
  line-height: 1.6;
  position: relative;
}

.template-modern .resume-heading-1 {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.8rem;
  font-weight: 800;
  color: #111111;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  position: relative;
  display: inline-block;
  line-height: 1.1;
}

.template-modern .resume-heading-1::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
  opacity: 0.2;
}

.template-modern .resume-heading-2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #333333;
  margin: 2.5rem 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
  display: inline-block;
  background: #f8f8f8;
  padding: 0.5rem 1rem 0.5rem 1.5rem;
  border-radius: 0 4px 4px 0;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
  border-left: 4px solid #333333;
}

.template-modern p, 
.template-modern li {
  color: #4a4a4a;
  margin: 0.5rem 0;
  font-weight: 400;
  font-size: 1.05rem;
  line-height: 1.7;
}

.template-modern a {
  color: #333333;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
  border-bottom: 1px solid #dddddd;
  padding-bottom: 1px;
}

.template-modern a:hover {
  opacity: 0.8;
  border-bottom-color: #999999;
}

.template-modern ul, 
.template-modern ol {
  padding-left: 1.5rem;
}

.template-modern li {
  margin-bottom: 0.5rem;
}

/* Hide HR in modern template */
.template-modern hr {
  display: none;
}`,

  minimalist: `/* Minimalist Template - Maximum whitespace, minimum fuss */
.template-minimalist {
  background: #ffffff;
  color: #333333;
  font-family: 'Source Sans Pro', sans-serif;
  padding: 3rem 3.5rem;
  line-height: 1.7;
}

.template-minimalist .resume-heading-1 {
  font-size: 2.2rem;
  font-weight: 300;
  color: #222222;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e5e5;
  letter-spacing: -0.5px;
}

.template-minimalist .resume-heading-2 {
  font-size: 1.1rem;
  font-weight: 400;
  color: #666666;
  margin: 2.5rem 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
}

.template-minimalist hr {
  border: none;
  height: 1px;
  background-color: #f0f0f0;
  margin: 2rem 0;
}

.template-minimalist p, 
.template-minimalist li {
  color: #555555;
  margin: 0.25rem 0;
  font-weight: 300;
  font-size: 1.05rem;
}

.template-minimalist a {
  color: #555555;
  text-decoration: none;
  border-bottom: 1px solid #dddddd;
  transition: border-color 0.2s;
}

.template-minimalist a:hover {
  border-bottom-color: #999999;
}`,

  creative: `/* Creative Template - Modern and clean */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.template-creative {
  background: #ffffff;
  color: #2d2d2d;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  padding: 2.5rem 3rem 3rem 3rem;
  line-height: 1.7;
  position: relative;
  overflow: visible;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.template-creative .resume-content {
  position: relative;
  z-index: 1;
}

/* Left accent using border instead of pseudo-element */
.template-creative .resume-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0.5rem;
  height: 100%;
  background: #f0f0f0;
  z-index: -1;
}

.template-creative .resume-heading-1 {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #111111;
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  position: relative;
  padding-left: 1.5rem;
  line-height: 1.2;
}

.template-creative .resume-heading-2 {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #333333;
  margin: 2.5rem 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  padding-left: 2rem;
  display: flex;
  align-items: center;
}

.template-creative .resume-heading-2::before {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #333333;
  margin-right: 0.75rem;
  flex-shrink: 0;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

@media print {
  .template-creative .resume-heading-2 {
    display: flex !important;
    align-items: center !important;
  }
  
  .template-creative .resume-heading-2::before {
    display: inline-block !important;
    width: 12px !important;
    height: 12px !important;
    margin-right: 0.75rem !important;
  }
}

/* Creative Template - Base Text Styles */
.template-creative p, 
.template-creative li {
  color: #4a4a4a;
  margin: 0.5rem 0 0.5rem 2rem !important;
  font-weight: 400;
  padding: 0 !important;
  font-size: 1rem;
  line-height: 1.6;
  display: block;
}

/* Ensure consistent bullet alignment */
.template-creative ul,
.template-creative ol {
  margin: 0.5rem 0 0.5rem 2rem !important;
  padding: 0 !important;
}

.template-creative .resume-heading-2 {
  padding-left: 2rem !important;
  margin-left: 0 !important;
  display: flex !important;
  align-items: center !important;
}

.template-creative .resume-heading-2::before {
  content: '' !important;
  display: inline-block !important;
  width: 12px !important;
  height: 12px !important;
  background-color: #333333 !important;
  margin-right: 0.75rem !important;
  margin-left: 0 !important;
  flex-shrink: 0;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.template-creative a {
  color: #333333;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid #dddddd;
  transition: all 0.2s ease;
  padding-bottom: 1px;
}

.template-creative a:hover {
  border-bottom-color: #999999;
}

.template-creative ul, 
.template-creative ol {
  padding-left: 3rem;
  margin: 0.75rem 0;
}

.template-creative li {
  margin-bottom: 0.5rem;
  position: relative;
}

/* Fix for PDF generation */
@media print {
  /* Reset all margins and padding first */
  .template-creative * {
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Then apply specific styles */
  .template-creative {
    padding: 2rem !important;
    font-size: 11pt !important;
  }
  
  .template-creative .resume-heading-1 {
    font-size: 1.8rem !important;
    margin-bottom: 1rem !important;
    padding-left: 0 !important;
    margin-left: 0 !important;
  }
  
  .template-creative .resume-heading-2 {
    font-size: 1.1rem !important;
    margin: 1.5rem 0 0.75rem 0 !important;
    padding-left: 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    display: flex !important;
    align-items: center !important;
  }
  
  .template-creative p,
  .template-creative ul,
  .template-creative ol,
  .template-creative li {
    padding-left: 2rem !important;
    margin-left: 0 !important;
    margin-top: 0.5rem !important;
    margin-bottom: 0.5rem !important;
  }
  
  .template-creative .resume-heading-2::before {
    content: '' !important;
    display: inline-block !important;
    width: 12px !important;
    height: 12px !important;
    background-color: #333333 !important;
    margin-right: 0.75rem !important;
    margin-left: 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    flex-shrink: 0;
  }
  
  .template-creative p, 
  .template-creative li {
    font-size: 11pt !important;
    line-height: 1.5 !important;
  }
  
  .template-creative .resume-content::before {
    display: block !important;
  }
}

/* Hide HR in creative template */
.template-creative hr {
  display: none;
}`,

  executive: `/* Executive Template - Classic and authoritative */
.template-executive {
  background: #ffffff;
  color: #333333;
  font-family: 'Lato', sans-serif;
  padding: 2.5rem 3.5rem 3.5rem;
  line-height: 1.7;
}

.template-executive .resume-heading-1 {
  font-family: 'Playfair Display', serif;
  font-size: 2.6rem;
  font-weight: 700;
  color: #111111;
  margin: 0 0 1.5rem 0;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

/* Executive Template - Simple H2 Style */
.template-executive .resume-heading-2 {
  font-family: 'Lato', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333333;
  margin: 2rem 0 1rem 0;
  padding: 0.25rem 0 0.25rem 0.5rem;
  border-left: 3px solid #333333;
  border-bottom: 3px solid #333333;
  display: block;
  clear: both;
  line-height: 1.4;
}

/* Print styles */
@media print {
  .template-executive .resume-heading-2 {
    color: #333333 !important;
    border-left: 3px solid #333333 !important;
    border-bottom: 3px solid #333333 !important;
    border-top: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    background-color: transparent !important;
    margin: 2rem 0 1rem 0 !important;
    padding: 0.25rem 0 0.25rem 0.5rem !important;
  }
}

/* Ensure consistent styling in print */
@media print {
  .template-executive .resume-heading-2 {
    color: #333333 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  .template-executive .resume-heading-2::before {
    background-color: #666666 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  .template-executive .resume-heading-2::after {
    background-color: #e0e0e0 !important;
  }
}

.template-executive p, 
.template-executive li {
  color: #555555;
  margin: 0.5rem 0;
  font-weight: 400;
  font-size: 1.05rem;
  line-height: 1.7;
}

.template-executive a {
  color: #333333;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
  border-bottom: 1px solid #dddddd;
  padding-bottom: 1px;
}

.template-executive a:hover {
  border-bottom-color: #999999;
}

.template-executive ul, 
.template-executive ol {
  padding-left: 1.5rem;
}

.template-executive li {
  margin-bottom: 0.5rem;
}

/* Hide HR in executive template */
.template-executive hr {
  display: none;
}
`,

  professional: `/* Professional Template - Balanced and traditional */
.template-professional {
  background: #ffffff;
  color: #333333;
  font-family: 'Lato', sans-serif;
  padding: 2.5rem 3rem 3rem;
  line-height: 1.6;
}

.template-professional .resume-heading-1 {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.4rem;
  font-weight: 600;
  color: #222222;
  margin: 0 0 0.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e0e0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.template-professional .resume-heading-2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #444444;
  margin: 2rem 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  display: inline-block;
}

.template-professional .resume-heading-2::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40px;
  height: 2px;
  background: #888888;
}

.template-professional hr {
  border: none;
  height: 1px;
  background-color: #e0e0e0;
  margin: 1.5rem 0;
}

.template-professional p, 
.template-professional li {
  color: #4a4a4a;
  margin: 0.5rem 0;
  font-weight: 400;
}

.template-professional a {
  color: #333333;
  text-decoration: none;
  border-bottom: 1px solid #bbbbbb;
  transition: border-color 0.2s;
}

.template-professional a:hover {
  border-bottom-color: #666666;
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
