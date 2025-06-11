import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Code, Download, RotateCcw, Eye, Bug, BookOpen } from 'lucide-react';
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

// Customization examples for each template (read-only reference)
const getCustomizationGuide = (template: string) => `/*
 * ${template.toUpperCase()} TEMPLATE - CUSTOMIZATION GUIDE
 *
 * Copy any of these examples to the "Template CSS" tab to customize your resume.
 * You can also add these directly to your Template CSS or use as inspiration.
 */

/*
 * FONT & SPACING CUSTOMIZATION
 * Copy this section to Template CSS and uncomment to change fonts and spacing
 */

.resume-template {
  /* Font customization */
  --resume-font-family: 'Georgia', serif !important;

  /* Size customization - current defaults shown */
  --resume-font-size: 11pt !important;
  --resume-line-height: 1.15 !important;
  --resume-h1-font-size: 32pt !important; /* Main name/title - try 24pt, 36pt, 40pt */
  --resume-h2-font-size: 14pt !important;
  --resume-h3-font-size: 12pt !important;

  /* Margins customization - current defaults shown */
  --resume-margin-top: 0.5in !important;
  --resume-margin-bottom: 0.5in !important;
  --resume-margin-left: 0.5in !important;
  --resume-margin-right: 0.5in !important;

  /* Spacing customization - section spacing creates "breathing room" */
  --resume-section-spacing: 10pt !important;
  --resume-summary-spacing: 0.75rem !important;
  --resume-header-spacing: 0.125rem !important; /* Space around header elements */
  --resume-contact-spacing: 0.375rem !important; /* Space between H1 and contact info */
}

/*
 * TEMPLATE-SPECIFIC CUSTOMIZATIONS
 * Copy any of these to Template CSS to customize specific elements
 */

.template-${template} {
  /* Change the main text color */
  color: #2d3748;
  background: #ffffff;
}

/*
 * HEADER CUSTOMIZATION
 */

.template-${template} .resume-heading-1 {
  /* Customize the main heading (H1) - your name/title */
  color: #1a202c;
  text-align: center;
  font-size: 32pt; /* Override default 28pt - try 24pt, 36pt, 40pt */
  font-weight: 700; /* Make it bolder */
  letter-spacing: 1px; /* Add spacing between letters */
}

.template-${template} .resume-heading-2 {
  /* Customize section headings */
  color: #2d3748;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.25rem;
}

/*
 * TWO-COLUMN HEADER ALIGNMENT CUSTOMIZATION
 * Force your preferred alignment for two-column layouts
 */

/* Force header to be left-aligned in two-column mode */
.resume-two-column-layout.template-${template} .resume-header {
  text-align: left;
}

.resume-two-column-layout.template-${template} .resume-header .resume-heading-1,
.resume-two-column-layout.template-${template} .resume-header .resume-paragraph {
  text-align: left;
}

.resume-two-column-layout.template-${template} .resume-contact-info {
  justify-content: flex-start;
}

/* OR: Force header to be centered in two-column mode */
.resume-two-column-layout.template-${template} .resume-header {
  text-align: center;
}

.resume-two-column-layout.template-${template} .resume-header .resume-heading-1,
.resume-two-column-layout.template-${template} .resume-header .resume-paragraph {
  text-align: center;
}

.resume-two-column-layout.template-${template} .resume-contact-info {
  justify-content: center;
}

/*
 * QUICK H1 FONT SIZE EXAMPLES
 * Copy one of these to Template CSS to quickly change your name size
 */

.resume-template { --resume-h1-font-size: 24pt !important; } /* Smaller name */
.resume-template { --resume-h1-font-size: 32pt !important; } /* Larger name */
.resume-template { --resume-h1-font-size: 36pt !important; } /* Very large name */

/*
 * COLOR SCHEME EXAMPLES
 * Copy these to Template CSS for different color schemes
 */

/* Blue theme */
.template-${template} .resume-heading-1 { color: #1e40af; }
.template-${template} .resume-heading-2 { color: #1e40af; border-bottom-color: #1e40af; }

/* Green theme */
.template-${template} .resume-heading-1 { color: #059669; }
.template-${template} .resume-heading-2 { color: #059669; border-bottom-color: #059669; }

/* Purple theme */
.template-${template} .resume-heading-1 { color: #7c3aed; }
.template-${template} .resume-heading-2 { color: #7c3aed; border-bottom-color: #7c3aed; }`;

export const CSSEditor = ({ selectedTemplate, onTemplateChange, onCSSChange, debugCSS }: CSSEditorProps) => {
  const [templateCSS, setTemplateCSS] = useState<Record<string, string>>(() => {
    // Try to load from localStorage first, fallback to defaults
    const savedCSS: Record<string, string> = {};
    Object.keys(defaultTemplateCSS).forEach(template => {
      const saved = localStorage.getItem(`css-editor-${template}`);
      savedCSS[template] = saved || defaultTemplateCSS[template];
    });
    return savedCSS;
  });
  const [activeTab, setActiveTab] = useState(selectedTemplate);
  const [cssEditorMode, setCssEditorMode] = useState<'template' | 'guide'>('template');
  const { toast } = useToast();

  // Auto-save effect for CSS changes
  useEffect(() => {
    console.log('💾 Auto-saving CSS changes:', Object.keys(templateCSS));
    Object.entries(templateCSS).forEach(([template, css]) => {
      localStorage.setItem(`css-editor-${template}`, css);
      console.log(`💾 Saved CSS for ${template}:`, css.substring(0, 100));
    });
  }, [templateCSS]);

  useEffect(() => {
    setActiveTab(selectedTemplate);
    // When the selected template changes, apply its CSS to the live preview
    const selectedCSS = templateCSS[selectedTemplate];
    if (selectedCSS) {
      console.log(`🔄 Selected template changed to ${selectedTemplate}, applying its CSS`);
      onCSSChange(selectedTemplate, selectedCSS);
    }
  }, [selectedTemplate, templateCSS, onCSSChange]);

  // Initialize CSS for all templates on mount - ONLY ONCE
  useEffect(() => {
    console.log('🚀 Component mounted, templateCSS keys:', Object.keys(templateCSS));

    // Apply the selected template's CSS to the live preview
    const selectedCSS = templateCSS[selectedTemplate];
    if (selectedCSS) {
      console.log('🔄 Applying CSS for template:', selectedTemplate, selectedCSS.substring(0, 100));
      onCSSChange(selectedTemplate, selectedCSS);
    } else {
      console.log('⚠️ No CSS found for template, using default:', selectedTemplate);
      onCSSChange(selectedTemplate, defaultTemplateCSS[selectedTemplate]);
    }
  }, []); // Empty dependency array - only run once on mount

  const handleCSSChange = (template: string, css: string) => {
    console.log(`✏️ CSS changed for ${template}:`, css.substring(0, 100));
    setTemplateCSS(prev => {
      const newCSS = {
        ...prev,
        [template]: css
      };
      console.log(`📝 Setting new CSS state for ${template}`);
      return newCSS;
    });
    // Only apply CSS changes for the currently selected template to the live preview
    if (template === selectedTemplate) {
      console.log(`🎯 Applying CSS changes to live preview for ${template}`);
      onCSSChange(template, css);
    }
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
    // Update the live preview when switching CSS editor tabs
    onTemplateChange(template);
  };

  const handleDebug = () => {
    if (debugCSS) {
      debugCSS();
    }

    // Also check localStorage CSS
    console.log('💾 LOCALSTORAGE CSS:');
    Object.keys(defaultTemplateCSS).forEach(template => {
      const saved = localStorage.getItem(`css-editor-${template}`);
      console.log(`Template ${template}:`, saved ? saved.substring(0, 100) : 'Not found');
    });

    // Also check if dynamic CSS element exists and log its content
    const dynamicStyleElement = document.getElementById('dynamic-template-css') as HTMLStyleElement;
    if (dynamicStyleElement) {
      console.log('🔍 Dynamic CSS Element Found:');
      console.log('- Content Length:', dynamicStyleElement.textContent?.length || 0);
      console.log('- First 500 chars:', dynamicStyleElement.textContent?.substring(0, 500));
    } else {
      console.error('❌ Dynamic CSS Element NOT Found!');
    }

    // NEW: Log all style elements for debugging
    const allStyleElements = Array.from(document.querySelectorAll('style'));
    console.log('📊 ALL STYLE ELEMENTS ON PAGE:');
    allStyleElements.forEach((styleEl, index) => {
      const source = styleEl.id || styleEl.getAttribute('data-source') || `style-${index}`;
      const length = styleEl.textContent?.length || 0;
      console.log(`  ${index + 1}. ${source}: ${length} chars`);

      // Show first 200 chars of each style element
      if (styleEl.textContent) {
        console.log(`     Preview: ${styleEl.textContent.substring(0, 200)}...`);
      }
    });

    // Check computed styles of the resume template element
    const resumeTemplate = document.querySelector('.resume-template');
    if (resumeTemplate) {
      const computedStyles = window.getComputedStyle(resumeTemplate);
      console.log('🎯 COMPUTED STYLES FOR .resume-template:');
      console.log('- Font Family:', computedStyles.fontFamily);
      console.log('- Font Size:', computedStyles.fontSize);
      console.log('- Line Height:', computedStyles.lineHeight);
      console.log('- Margin:', computedStyles.margin);
      console.log('- Padding:', computedStyles.padding);
      console.log('- Background:', computedStyles.background);

      // Check h1 styling
      const h1 = resumeTemplate.querySelector('.resume-heading-1, h1');
      if (h1) {
        const h1Styles = window.getComputedStyle(h1);
        console.log('🎯 COMPUTED STYLES FOR H1/HEADING-1:');
        console.log('- Font Family:', h1Styles.fontFamily);
        console.log('- Font Size:', h1Styles.fontSize);
        console.log('- Font Weight:', h1Styles.fontWeight);
        console.log('- Line Height:', h1Styles.lineHeight);
        console.log('- Margin:', h1Styles.margin);
        console.log('- Color:', h1Styles.color);
      }
    }

    toast({
      title: "Debug Info",
      description: "Check the browser console for detailed CSS debug information. If CSS isn't applying, try adding !important to your custom CSS properties."
    });
  };

  return (
    <Card className="border-0 bg-white overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Template CSS Editor
            </h2>
            <span className="text-xs text-gray-500">Auto-saved</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Live Preview
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDebug}
              className="flex items-center gap-1"
            >
              <Bug className="h-3 w-3" />
              Debug
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
          <div className="px-6 pt-4">
            <TabsList className="flex flex-wrap w-full p-1 gap-1 bg-muted rounded-lg justify-center">
              {templates.map((template) => (
                <TabsTrigger
                  key={template.id}
                  value={template.id}
                  className="flex-1 min-w-0 max-w-[calc(50%-0.125rem)] sm:max-w-[calc(33.333%-0.125rem)] md:max-w-[calc(20%-0.125rem)] flex items-center justify-center text-[10px] sm:text-xs py-1.5 px-1 overflow-hidden whitespace-nowrap rounded-md h-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <span className="truncate block w-full text-center">{template.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {templates.map((template) => (
            <TabsContent
              key={template.id}
              value={template.id}
              className="flex-1 px-6 pb-6 mt-4 overflow-auto"
            >
              <div className="h-full flex flex-col gap-4">
                {/* CSS Editor Mode Tabs */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Tabs value={cssEditorMode} onValueChange={(value) => setCssEditorMode(value as 'template' | 'guide')} className="w-full">
                    <div className="flex items-center justify-between">
                      <TabsList className="flex gap-1 p-1 bg-muted rounded-lg">
                        <TabsTrigger
                          value="template"
                          className="flex items-center gap-1 text-xs py-1.5 px-3 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          <Code className="h-3 w-3" />
                          Template CSS
                        </TabsTrigger>
                        <TabsTrigger
                          value="guide"
                          className="flex items-center gap-1 text-xs py-1.5 px-3 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          <BookOpen className="h-3 w-3" />
                          Customization Guide
                        </TabsTrigger>
                      </TabsList>

                      <div className="flex flex-wrap gap-2">
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

                    <TabsContent value="template" className="mt-4 flex-1">
                      <div className="h-full overflow-auto">
                        <Textarea
                          value={templateCSS[template.id]}
                          onChange={(e) => handleCSSChange(template.id, e.target.value)}
                          className="h-full min-h-[400px] resize-y font-mono text-sm"
                          placeholder={`Enter CSS for ${template.name} template...`}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded mt-2">
                        <p>💡 <strong>Template CSS:</strong> Edit the CSS for this template here. Changes apply immediately to the preview.</p>
                        <p>📖 <strong>Need examples?</strong> Switch to the "Customization Guide" tab for copy-paste examples.</p>
                        <p>⚙️ <strong>CSS Variables:</strong> Use --resume-font-family, --resume-font-size, --resume-h1-font-size, --resume-margin-* for easy customization.</p>
                        <p>🎨 <strong>Color Changes:</strong> If your CSS isn't applying, add !important to override base styles. For example: <code>.template-professional {'{'} color: #333333 !important; {'}'}</code></p>
                        <p>📐 <strong>Default Margins:</strong> The default margin is 0.5in on all sides. You can change it using the CSS variables above.</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="guide" className="mt-4 flex-1">
                      <div className="h-full overflow-auto">
                        <Textarea
                          value={getCustomizationGuide(template.id)}
                          readOnly
                          className="h-full min-h-[400px] resize-y font-mono text-sm bg-gray-50"
                          placeholder="Customization guide loading..."
                        />
                      </div>
                      <div className="text-xs text-muted-foreground bg-green-50 p-3 rounded mt-2">
                        <p>📚 <strong>Customization Guide:</strong> Copy any examples from here and paste them into the "Template CSS" tab.</p>
                        <p>✂️ <strong>How to use:</strong> Select the CSS you want, copy it (Ctrl+C), switch to Template CSS tab, and paste it (Ctrl+V).</p>
                        <p>🎨 <strong>Mix & match:</strong> Combine multiple examples to create your perfect resume style.</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Card>
  );
};
