import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Columns2, Code, Eye, Home, Info } from "lucide-react";
import { ResumePreview } from "@/components/ResumePreview";
import { openPreviewWindow, printToPDF } from "@/utils/pdfExport";
import { ExternalLink, Printer } from "lucide-react";
import { TemplateSelector } from "@/components/TemplateSelector";
import { PaperSizeSelector } from "@/components/PaperSizeSelector";
import { FileUpload } from "@/components/FileUpload";
import { CSSEditor } from "@/components/CSSEditor";
import { useDynamicCSS } from "@/hooks/useDynamicCSS";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useFileUpload } from '@/contexts/FileUploadContext';
import { splitMarkdownForTwoColumn } from '@/utils/markdownParser';
import { TipTooltip } from '@/components/UsageTips';
import { EditorLayout } from '@/components/EditorLayout';
import { EditorHeader } from '@/components/EditorHeader';
import { usePanelManagement } from '@/hooks/usePanelManagement';
import { useImageReferenceDetection } from '@/hooks/useImageReferenceDetection';

const defaultMarkdown = `# Jane Doe
**Software Engineer** | jane.doe@email.com | (555) 123-4567 | linkedin.com/in/janedoe

## Summary
Experienced software engineer with 5+ years developing scalable web applications and microservices architecture. Proven track record of leading high-impact projects serving 1M+ users, mentoring development teams, and implementing CI/CD solutions that improve deployment efficiency by 60%. Expertise in full-stack development with React, Node.js, and cloud technologies, combined with strong problem-solving skills and a passion for optimizing performance and user experience.

## Experience

### Senior Software Engineer | TechCorp Inc.
*January 2022 - Present*
- Led development of microservices architecture serving 1M+ users
- Mentored junior developers and conducted code reviews
- Implemented CI/CD pipelines reducing deployment time by 60%

### Software Engineer | StartupXYZ
*June 2019 - December 2021*
- Built responsive web applications using React and Node.js
- Collaborated with design team to improve user experience
- Optimized database queries improving performance by 40%

## Education

### Bachelor of Science in Computer Science
*University of Technology | 2015 - 2019*
- GPA: 3.8/4.0
- Relevant Coursework: Data Structures, Algorithms, Web Development

## Skills
- **Languages:** JavaScript, TypeScript, Python, Java
- **Frameworks:** React, Node.js, Express, Django
- **Databases:** PostgreSQL, MongoDB, Redis
- **Tools:** Git, Docker, AWS, Jenkins

## Projects

### E-commerce Platform
- Built full-stack e-commerce solution with payment integration
- Technologies: React, Node.js, Stripe API, PostgreSQL

### Task Management App
- Developed collaborative task management application
- Technologies: Vue.js, Firebase, PWA`;

const getTemplateSpecificDefaultCSS = (template: string) => {
  const templateDefaults = {
    professional: `/*
 * Professional Template Default Styles
 * Clean, traditional fonts with Raleway headings and Roboto body text
 */

h1, h2, h3 {
  font-family: 'Raleway', sans-serif;
}

body {
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
}`,

    modern: `/*
 * Modern Template Default Styles
 * Contemporary styling with Poppins font family
 */

h1, h2, h3 {
  font-family: 'Poppins', sans-serif;
}

body {
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
}`,

    minimalist: `/*
 * Minimalist Template Default Styles
 * Clean, lightweight design with Nunito font family
 */

h1, h2, h3 {
  font-family: 'Nunito', sans-serif;
}

body {
  font-family: 'Nunito', sans-serif;
  line-height: 1.6;
}`,

    creative: `/*
 * Creative Template Default Styles
 * Modern, bold design with Work Sans font family
 */

h1, h2, h3 {
 font-family: 'Nunito', sans-serif;
}

body {
  font-family: 'Work Sans', sans-serif;
  line-height: 1.6;
}`,

    executive: `/*
 * Executive Template Default Styles
 * Professional serif headings with Merriweather, Ubuntu body text
 */

h1, h2, h3 {
  font-family: 'Merriweather', serif;
}

body {
  font-family: 'Ubuntu', sans-serif;
  line-height: 1.6;
}`
  };

  return templateDefaults[template as keyof typeof templateDefaults] || templateDefaults.professional;
};

const defaultInitialCSS = `/*
 * Welcome to the Custom CSS Editor!
 *
 * You can style standard HTML elements like h1, p, a, etc.
 * Your styles will be applied only to the resume preview.
 *
 * Example: Make all links red
 * a {
 *   color: red;
 * }
 */

/* Template-specific fonts will be loaded based on your selected template */`;

const MarkdownEditor = () => {
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState(() => localStorage.getItem('markdown-editor-content') || defaultMarkdown);

  const [header, setHeader] = useState(() => localStorage.getItem('markdown-editor-header') || '');
  const [summary, setSummary] = useState(() => localStorage.getItem('markdown-editor-summary') || '');
  const [leftColumn, setLeftColumn] = useState(() => localStorage.getItem('markdown-editor-left-column') || '');
  const [rightColumn, setRightColumn] = useState(() => localStorage.getItem('markdown-editor-right-column') || '');

  const [selectedTemplate, setSelectedTemplate] = useState<string>(() => localStorage.getItem('selected-template') || 'professional');
  const [isTwoColumn, setIsTwoColumn] = useState(false);
  const [paperSize, setPaperSize] = useState<'A4' | 'US_LETTER'>(() => {
    return (localStorage.getItem('paper-size') as 'A4' | 'US_LETTER') || 'A4';
  });
  const [activeTab, setActiveTab] = useState('editor');
  const previewRef = useRef<HTMLDivElement>(null);

  const [customCSS, setCustomCSS] = useState(() => {
    const savedCSS = localStorage.getItem('custom-css-content');
    const savedTemplate = localStorage.getItem('selected-template') || 'professional';

    // If no saved CSS exists, use template-specific default
    if (!savedCSS) {
      return getTemplateSpecificDefaultCSS(savedTemplate);
    }

    // If saved CSS is the old generic default, replace with template-specific
    if (savedCSS.includes("font-family: 'Merriweather', serif") &&
        savedCSS.includes("font-family: 'Lato', sans-serif")) {
      return getTemplateSpecificDefaultCSS(savedTemplate);
    }

    return savedCSS;
  });

  // The hook now manages template styles and custom overrides
  useDynamicCSS(selectedTemplate, customCSS);

  const { leftPanelSize, handlePanelResize, shouldUseCompactUI } = usePanelManagement('markdown-editor');
  const { uploadedFileUrl, uploadedFileName, refreshTimestamp } = useImageReferenceDetection(markdown, { detectMarkdown: true });

  // Update CSS to template-specific default when template changes
  useEffect(() => {
    const currentCSS = customCSS;

    // Get all template default CSS patterns to check against
    const allTemplateDefaults = [
      { name: 'professional', css: getTemplateSpecificDefaultCSS('professional') },
      { name: 'modern', css: getTemplateSpecificDefaultCSS('modern') },
      { name: 'minimalist', css: getTemplateSpecificDefaultCSS('minimalist') },
      { name: 'creative', css: getTemplateSpecificDefaultCSS('creative') },
      { name: 'executive', css: getTemplateSpecificDefaultCSS('executive') }
    ];

    // Check if current CSS is using generic fonts or is a template default (but not the current template)
    const isGenericCSS = currentCSS.includes("font-family: 'Merriweather', serif") &&
                        currentCSS.includes("font-family: 'Lato', sans-serif");
    const isDefaultCSS = currentCSS === defaultInitialCSS;
    const isEmpty = !currentCSS.trim();

    // Check if current CSS matches any template default (including different templates)
    const matchesOtherTemplateDefault = allTemplateDefaults.some(template =>
      template.name !== selectedTemplate &&
      currentCSS.trim() === template.css.trim()
    );

    // Check if current CSS already matches the selected template
    const currentTemplateCSS = getTemplateSpecificDefaultCSS(selectedTemplate);
    const alreadyMatchesCurrentTemplate = currentCSS.trim() === currentTemplateCSS.trim();

    if ((isGenericCSS || isDefaultCSS || isEmpty || matchesOtherTemplateDefault) &&
        !alreadyMatchesCurrentTemplate) {
      setCustomCSS(currentTemplateCSS);
    }
  }, [selectedTemplate]);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('markdown-editor-content', markdown);
  }, [markdown]);
  useEffect(() => {
    localStorage.setItem('markdown-editor-header', header);
  }, [header]);
  useEffect(() => {
    localStorage.setItem('markdown-editor-summary', summary);
  }, [summary]);
  useEffect(() => {
    localStorage.setItem('markdown-editor-left-column', leftColumn);
  }, [leftColumn]);
  useEffect(() => {
    localStorage.setItem('markdown-editor-right-column', rightColumn);
  }, [rightColumn]);
  useEffect(() => {
    localStorage.setItem('custom-css-content', customCSS);
  }, [customCSS]);
   useEffect(() => {
    localStorage.setItem('selected-template', selectedTemplate);
  }, [selectedTemplate]);
  useEffect(() => {
    localStorage.setItem('paper-size', paperSize);
  }, [paperSize]);

  const handleTwoColumnToggle = (checked: boolean) => {
    setIsTwoColumn(checked);
    if (checked && markdown.trim() && markdown.length > 50) {
      import('@/utils/markdownParser').then(({ splitMarkdownForTwoColumn }) => {
        try {
          const splitContent = splitMarkdownForTwoColumn(markdown);
          setHeader(splitContent.header || '');
          setSummary(splitContent.summary || '');
          setLeftColumn(splitContent.leftColumn || '');
          setRightColumn(splitContent.rightColumn || '');
        } catch (error) {
          console.warn('Error parsing markdown for two-column layout:', error);
        }
      });
    } else if (!checked) {
      // When switching back to single column, combine all content back into markdown
      // Only if there's actual content in the two-column fields
      if (header.trim() || summary.trim() || leftColumn.trim() || rightColumn.trim()) {
        const combinedMarkdown = [
          header.trim(),
          summary.trim(),
          leftColumn.trim(),
          rightColumn.trim()
        ].filter(Boolean).join('\n\n');

        if (combinedMarkdown.trim()) {
          setMarkdown(combinedMarkdown);
        }
      }
    }
  };

  const renderInputSection = () => (
    <Card className="border-0 bg-white overflow-hidden flex flex-col h-full max-h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary shrink-0" />
            <h2 className="text-base font-semibold text-foreground truncate">Markdown Editor</h2>
          </div>
          <div className="flex items-center gap-3">
            <FileUpload compact={shouldUseCompactUI} />
            <TipTooltip type="markdown" compact={shouldUseCompactUI} />
          </div>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <Switch
              id="two-column"
              checked={isTwoColumn}
              onCheckedChange={handleTwoColumnToggle}
              className="h-4 w-8 sm:h-5 sm:w-10 data-[state=unchecked]:bg-gray-200"
            />
                <label htmlFor="two-column" className="text-xs sm:text-sm font-medium pl-1 pr-2 sm:pl-0 truncate">Two Column</label>
            </div>
            <TemplateSelector selectedTemplate={selectedTemplate} onTemplateChange={setSelectedTemplate} />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="px-4 border-b">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="editor" className="flex-1">Editor</TabsTrigger>
              <TabsTrigger value="css" className="flex-1">CSS</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="editor" className="h-[calc(100%-40px)] mt-0 p-4">
            {!isTwoColumn ? (
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="h-full resize-none"
                placeholder="Enter your markdown content..."
              />
            ) : (
              <div className="flex flex-col gap-3 h-full overflow-y-auto pb-2 pr-1">
                <div className="flex items-center justify-between bg-blue-50 p-2.5 rounded-md border border-blue-100 text-blue-700">
                  <div className="flex items-center gap-2">
                    <Columns2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Two-Column Resume Editor</span>
                  </div>
                  <TipTooltip type="two-column" compact={shouldUseCompactUI} />
                </div>

                <div className="bg-gray-50 p-2.5 rounded-md border border-gray-100">
                  <label className="text-sm font-medium mb-1.5 block text-gray-700">Header</label>
                  <Textarea
                    value={header}
                    onChange={(e) => setHeader(e.target.value)}
                    className="resize-y min-h-[70px] focus:ring-1 focus:ring-primary"
                    placeholder="Enter header content (name, title, contact info)..."
                  />
                </div>
                <div className="bg-gray-50 p-2.5 rounded-md border border-gray-100">
                  <label className="text-sm font-medium mb-1.5 block text-gray-700">Summary</label>
                  <Textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="resize-y min-h-[70px] focus:ring-1 focus:ring-primary"
                    placeholder="Enter summary or profile section..."
                  />
                </div>
                <div className="flex-1 grid grid-cols-1 gap-3">
                  <div className="bg-gray-50 p-2.5 rounded-md border border-gray-100">
                    <label className="text-sm font-medium mb-1.5 block text-gray-700">Left Column</label>
                    <Textarea
                      value={leftColumn}
                      onChange={(e) => setLeftColumn(e.target.value)}
                      className="resize-y min-h-[170px] focus:ring-1 focus:ring-primary"
                      placeholder="Enter left column content (skills, education, etc)..."
                    />
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-md border border-gray-100">
                    <label className="text-sm font-medium mb-1.5 block text-gray-700">Right Column</label>
                    <Textarea
                      value={rightColumn}
                      onChange={(e) => setRightColumn(e.target.value)}
                      className="resize-y min-h-[170px] focus:ring-1 focus:ring-primary"
                      placeholder="Enter right column content (experience, projects, etc)..."
                    />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="css" className="h-[calc(100%-40px)] mt-0">
            <CSSEditor
              initialCSS={customCSS}
              defaultCSS={getTemplateSpecificDefaultCSS(selectedTemplate)}
              onCSSChange={setCustomCSS}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <EditorHeader
        title="Markdown Resume Editor"
        description="Transform markdown into professional resumes"
        icon={<FileText className="h-6 w-6 text-white" />}
        iconBgColor="bg-gradient-to-br from-green-500 to-teal-600"
        alternateEditorPath="/html"
        alternateEditorIcon={<Code className="h-4 w-4" />}
        alternateEditorLabel="HTML Editor"
        alternateEditorColor="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
      >
        <PaperSizeSelector selectedPaperSize={paperSize} onPaperSizeChange={setPaperSize} />
        <div className="flex items-center gap-2">
          <Button
            onClick={async () => {
              await printToPDF({
                markdown,
                leftColumn,
                rightColumn,
                header,
                summary,
                firstPage: '',
                secondPage: '',
                template: selectedTemplate,
                isTwoColumn,
                isTwoPage: false,
                paperSize,
                uploadedFileUrl,
                uploadedFileName
              });
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>

        </div>
      </EditorHeader>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EditorLayout
          leftPanel={renderInputSection()}
          rightPanel={
            <Card className="border-0 bg-white overflow-hidden flex flex-col h-full max-h-full">
              <div className="p-4 border-b shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Eye className="h-4 w-4 text-primary shrink-0" />
                    <h2 className="text-base font-semibold text-foreground truncate">Live Preview</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={async () => {
                        await openPreviewWindow({
                          markdown,
                          leftColumn,
                          rightColumn,
                          header,
                          summary,
                          firstPage: '',
                          secondPage: '',
                          template: selectedTemplate,
                          isTwoColumn,
                          isTwoPage: false,
                          paperSize,
                          uploadedFileUrl,
                          uploadedFileName
                        });
                      }}
                      className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Open in New Window</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-gray-50">
                <div className="w-full">
                  <ResumePreview
                    ref={previewRef}
                    markdown={isTwoColumn ? '' : markdown}
                    leftColumn={isTwoColumn ? leftColumn : ''}
                    rightColumn={isTwoColumn ? rightColumn : ''}
                    header={isTwoColumn ? header : ''}
                    summary={isTwoColumn ? summary : ''}
                    template={selectedTemplate}
                    isTwoColumn={isTwoColumn}
                    paperSize={paperSize}
                    uploadedFileUrl={uploadedFileUrl}
                    uploadedFileName={uploadedFileName}
                    key={refreshTimestamp}
                  />
                </div>
              </div>
            </Card>
          }
          leftPanelSize={leftPanelSize}
          onPanelResize={handlePanelResize}
          storageKey="markdown-editor"
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;
