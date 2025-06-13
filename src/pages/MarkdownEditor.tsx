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
import { PrintPreview } from "@/components/PrintPreview";
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

h1, h2, h3 {
  font-family: 'Merriweather', serif;
}

body {
  font-family: 'Lato', sans-serif;
  line-height: 1.6;
}
`;

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

  const [customCSS, setCustomCSS] = useState(() => localStorage.getItem('custom-css-content') || defaultInitialCSS);

  // The hook now manages template styles and custom overrides
  useDynamicCSS(selectedTemplate, customCSS);

  const { leftPanelSize, handlePanelResize } = usePanelManagement('markdown-editor');
  const { uploadedFileUrl, uploadedFileName, refreshTimestamp } = useImageReferenceDetection(markdown, { detectMarkdown: true });

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
            <FileUpload />
            <TipTooltip type="markdown" />
          </div>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <Switch
              id="two-column"
              checked={isTwoColumn}
              onCheckedChange={handleTwoColumnToggle}
              className="h-4 w-8 sm:h-5 sm:w-10"
            />
                <label htmlFor="two-column" className="text-xs md:text-sm font-medium pl-1">Two Column</label>
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
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="h-full resize-none"
              placeholder="Enter your markdown content..."
            />
          </TabsContent>
          <TabsContent value="css" className="h-[calc(100%-40px)] mt-0">
            <CSSEditor
              initialCSS={customCSS}
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
      >
        <PaperSizeSelector selectedPaperSize={paperSize} onPaperSizeChange={setPaperSize} />
        <PrintPreview
          markdown={markdown}
          leftColumn={leftColumn}
          rightColumn={rightColumn}
          header={header}
          summary={summary}
          template={selectedTemplate}
          isTwoColumn={isTwoColumn}
          paperSize={paperSize}
          uploadedFileUrl={uploadedFileUrl}
          uploadedFileName={uploadedFileName}
        />
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
                   <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 shrink-0">
                      PDF-accurate preview
                    </Badge>
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
