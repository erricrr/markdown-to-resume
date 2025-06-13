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

const defaultHeader = `# Jane Doe
**Software Engineer** | jane.doe@email.com | (555) 123-4567 | linkedin.com/in/janedoe`;

const defaultSummary = `Experienced software engineer with 5+ years developing scalable web applications. Passionate about clean code, user experience, and mentoring junior developers.`;

const defaultLeftColumn = `## Contact
- **Email:** jane.doe@email.com
- **Phone:** (555) 123-4567
- **LinkedIn:** linkedin.com/in/janedoe
- **Location:** San Francisco, CA

## Skills
- **Languages:** JavaScript, TypeScript, Python
- **Frontend:** React, Vue.js, HTML/CSS
- **Backend:** Node.js, Express, Django
- **Databases:** PostgreSQL, MongoDB
- **Tools:** Git, Docker, AWS

## Education
### Bachelor of Science in Computer Science
*University of Technology | 2015 - 2019*
- GPA: 3.8/4.0`;

const defaultRightColumn = `## Experience

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

## Projects

### E-commerce Platform
- Built full-stack e-commerce solution with payment integration
- Technologies: React, Node.js, Stripe API, PostgreSQL

### Task Management App
- Developed collaborative task management application
- Technologies: Vue.js, Firebase, PWA`;

const MarkdownEditor = () => {
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState(() => {
    const saved = localStorage.getItem('markdown-editor-content');
    return saved || defaultMarkdown;
  });
  const [header, setHeader] = useState(() => {
    const saved = localStorage.getItem('markdown-editor-header');
    return saved || defaultHeader;
  });
  const [summary, setSummary] = useState(() => {
    const saved = localStorage.getItem('markdown-editor-summary');
    return saved || defaultSummary;
  });
  const [leftColumn, setLeftColumn] = useState(() => {
    const saved = localStorage.getItem('markdown-editor-left-column');
    return saved || defaultLeftColumn;
  });
  const [rightColumn, setRightColumn] = useState(() => {
    const saved = localStorage.getItem('markdown-editor-right-column');
    return saved || defaultRightColumn;
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>(() => {
    console.log('🔵 Initializing selectedTemplate with default value: professional');
    return 'professional';
  });
  const [isTwoColumn, setIsTwoColumn] = useState(false);
  const [paperSize, setPaperSize] = useState<'A4' | 'US_LETTER'>('A4');
  const [activeTab, setActiveTab] = useState("editor");
  const previewRef = useRef<HTMLDivElement>(null);
  const { addTemplateCSS, debugCSS } = useDynamicCSS();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  // Use shared hooks
  const { leftPanelSize, handlePanelResize } = usePanelManagement('markdown-editor');
  const { uploadedFileUrl, uploadedFileName, refreshTimestamp, triggerRefresh } = useImageReferenceDetection(markdown, { detectMarkdown: true });

  // Track previous uploadedFileUrl to detect changes
  const prevUploadedFileUrlRef = useRef(uploadedFileUrl);
  const prevUploadedFileNameRef = useRef(uploadedFileName);

  // Check for image references in markdown content
  const detectImageReferences = (content: string) => {
    // Detect markdown image syntax: ![alt](url) or HTML img tags
    const markdownImageRegex = /!\[.*?\]\(.*?\)/;
    const htmlImageRegex = /<img.*?>/i;
    return markdownImageRegex.test(content) || htmlImageRegex.test(content);
  };

  // Check all content sources for image references
  useEffect(() => {
    const checkForImageReferences = () => {
      const sources = [
        markdown,
        header,
        summary,
        leftColumn,
        rightColumn
      ];

      const hasAnyImageReference = sources.some(content =>
        content && detectImageReferences(content)
      );

      // If image reference exists but no image is uploaded yet, or if image was just removed,
      // we need to refresh the preview to show the correct placeholder/empty state
      if (hasAnyImageReference && (!uploadedFileUrl || uploadedFileUrl !== prevUploadedFileUrlRef.current)) {
        console.log('🖼️ Image reference detected with upload change - refreshing preview');
        triggerRefresh();
      }

      // If image reference was just removed, refresh the preview
      if (!hasAnyImageReference && prevUploadedFileUrlRef.current && uploadedFileUrl) {
        console.log('🖼️ Image reference removed but image still uploaded - refreshing preview');
        triggerRefresh();
      }
    };

    checkForImageReferences();

    // Update refs after checking
    prevUploadedFileUrlRef.current = uploadedFileUrl;
    prevUploadedFileNameRef.current = uploadedFileName;
  }, [
    markdown,
    header,
    summary,
    leftColumn,
    rightColumn,
    uploadedFileUrl,
    uploadedFileName,
    triggerRefresh
  ]);

  // Render the preview badge with consistent styling
  const renderPreviewBadge = () => (
    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 shrink-0">
      PDF-accurate preview
    </Badge>
  );

  // Log when the selected template changes
  useEffect(() => {
    console.log('🔄 Selected template changed to:', selectedTemplate);
  }, [selectedTemplate]);

  // Auto-save effects
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

  const handlePrintPDF = () => {
    window.print();
  };

  const handleCSSChange = (template: string, css: string) => {
    console.log(`🎨 Main component: CSS change for ${template}`);
    addTemplateCSS(template, css);
  };

  const handlePaperSizeChange = (size: 'A4' | 'US_LETTER') => {
    setPaperSize(size);
  };

  // Handle Two Column toggle with pre-filling functionality
  const handleTwoColumnToggle = (checked: boolean) => {
    setIsTwoColumn(checked);

    if (checked) {
      // Always try to pre-fill when switching to Two Column mode if there's meaningful content
      if (markdown.trim() && markdown.length > 50) { // Simple check: has content and is substantial
        console.log('🔄 Pre-filling two-column layout from markdown content');
        console.log('📄 Markdown content length:', markdown.length);

        try {
          const splitContent = splitMarkdownForTwoColumn(markdown);

          console.log('🔍 Split content results:', {
            headerLength: splitContent.header.length,
            summaryLength: splitContent.summary.length,
            leftColumnLength: splitContent.leftColumn.length,
            rightColumnLength: splitContent.rightColumn.length
          });

          // Always update with parsed content when switching to two-column
          if (splitContent.header.trim()) {
            setHeader(splitContent.header);
            console.log('✅ Set header:', splitContent.header.substring(0, 50) + '...');
          }
          if (splitContent.summary.trim()) {
            setSummary(splitContent.summary);
            console.log('✅ Set summary:', splitContent.summary.substring(0, 50) + '...');
          }
          if (splitContent.leftColumn.trim()) {
            setLeftColumn(splitContent.leftColumn);
            console.log('✅ Set left column (first 50 chars):', splitContent.leftColumn.substring(0, 50) + '...');
          }
          if (splitContent.rightColumn.trim()) {
            setRightColumn(splitContent.rightColumn);
            console.log('✅ Set right column (first 50 chars):', splitContent.rightColumn.substring(0, 50) + '...');
          }

          console.log('✅ Successfully pre-filled two-column content');
        } catch (error) {
          console.warn('⚠️ Error parsing markdown for two-column layout:', error);
        }
      } else {
        console.log('ℹ️ No substantial markdown content to pre-fill');
      }

      console.log('🔄 Switched to two-column mode - re-applying CSS to fix template styling');
    } else {
      console.log('🔄 Switched back to single column mode');
    }

    // DRY SOLUTION: Re-apply current template CSS after layout change to ensure proper styling
    // This fixes the H2 styling issues in Modern and Creative templates in two-column mode
    console.log('🎨 Applying default template CSS after layout change:', selectedTemplate);
    const savedCSS = localStorage.getItem(`css-editor-${selectedTemplate}`);
    if (savedCSS) {
      console.log('📝 Re-applying saved CSS for template:', selectedTemplate);
      addTemplateCSS(selectedTemplate, savedCSS);
    } else {
      // Fall back to default template styles if no saved CSS exists
      console.log('📝 No saved CSS found, applying default template styles for:', selectedTemplate);
      import('@/styles/resumeTemplates').then(({ templateStyles, executiveSpecificStyles }) => {
        let defaultCSS = templateStyles[selectedTemplate as keyof typeof templateStyles];
        if (selectedTemplate === 'executive') {
          defaultCSS += executiveSpecificStyles;
        }
        if (defaultCSS) {
          addTemplateCSS(selectedTemplate, defaultCSS);
          console.log('✅ Applied default template CSS for:', selectedTemplate);
        }
      });
    }
  };

  // Force re-render when template changes to ensure CSS is applied
  useEffect(() => {
    console.log(`📋 Template changed to: ${selectedTemplate}`);
    // Re-apply the CSS from localStorage when template changes
    const savedCSS = localStorage.getItem(`css-editor-${selectedTemplate}`);

    // Special handling for executive template to ensure font changes take effect
    if (selectedTemplate === 'executive') {
      console.log('🎨 Applying updated Executive template CSS with new fonts');
      // Force a refresh of the executive template CSS
      import('@/styles/resumeTemplates').then(({ templateStyles, executiveSpecificStyles }) => {
        const executiveCSS = templateStyles.executive + executiveSpecificStyles;
        // Update the localStorage cache
        localStorage.setItem(`css-editor-executive`, executiveCSS);
        // Apply the updated CSS
        addTemplateCSS('executive', executiveCSS);
        // Apply high-priority font fixes
        debugCSS();
      });
    } else if (savedCSS) {
      console.log('🎨 Re-applying saved CSS after template change:', selectedTemplate);
      addTemplateCSS(selectedTemplate, savedCSS);
    }
  }, [selectedTemplate, addTemplateCSS, debugCSS]);

  // Re-apply CSS when component mounts or returns from another editor
  useEffect(() => {
    console.log('🔄 MarkdownEditor mounted, re-applying current template CSS');
    // Get the current template's CSS from localStorage and re-apply it
    const savedCSS = localStorage.getItem(`css-editor-${selectedTemplate}`);
    if (savedCSS) {
      console.log('🎨 Re-applying saved CSS for template:', selectedTemplate);
      addTemplateCSS(selectedTemplate, savedCSS);
    }
  }, []); // Run only on mount

  // Re-apply CSS when switching back to the Content Editor tab
  useEffect(() => {
    if (activeTab === "editor") {
      console.log('🔄 Switched to Content Editor tab, re-applying CSS');
      const savedCSS = localStorage.getItem(`css-editor-${selectedTemplate}`);
      if (savedCSS) {
        console.log('🎨 Re-applying saved CSS for Content Editor tab:', selectedTemplate);
        addTemplateCSS(selectedTemplate, savedCSS);
      }
    }
  }, [activeTab, selectedTemplate, addTemplateCSS]);

  const getInputMode = () => {
    if (isTwoColumn) return "twoColumn";
    return "single";
  };

  const renderInputSection = () => {
    return (
      <Card className="border-0 bg-white overflow-hidden flex flex-col h-full max-h-full">
        <div className="pl-4 pt-3 -mb-1 px-1">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              <h2 className="text-base font-semibold text-foreground truncate">
                Markdown Editor
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FileUpload />
              </div>
              <TipTooltip type="markdown" />
            </div>
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

            <TabsContent value="editor" className="h-[calc(100%-40px)] mt-0">
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="two-column"
                        checked={isTwoColumn}
                        onCheckedChange={handleTwoColumnToggle}
                      />
                      <label htmlFor="two-column" className="text-sm font-medium">
                        Two Column
                      </label>
                    </div>
                  </div>
                  <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={setSelectedTemplate}
                  />
                </div>

                {isTwoColumn ? (
                  <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
                    <div className="flex flex-col gap-4 min-h-0">
                      <div className="shrink-0">
                        <label className="text-sm font-medium mb-2 block">Header</label>
                        <Textarea
                          value={header}
                          onChange={(e) => setHeader(e.target.value)}
                          className="h-24 resize-none"
                          placeholder="Enter header content..."
                        />
                      </div>
                      <div className="shrink-0">
                        <label className="text-sm font-medium mb-2 block">Summary</label>
                        <Textarea
                          value={summary}
                          onChange={(e) => setSummary(e.target.value)}
                          className="h-24 resize-none"
                          placeholder="Enter summary content..."
                        />
                      </div>
                      <div className="flex-1 min-h-0">
                        <label className="text-sm font-medium mb-2 block">Left Column</label>
                        <Textarea
                          value={leftColumn}
                          onChange={(e) => setLeftColumn(e.target.value)}
                          className="h-full resize-none"
                          placeholder="Enter left column content..."
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-h-0">
                      <label className="text-sm font-medium mb-2 block">Right Column</label>
                      <Textarea
                        value={rightColumn}
                        onChange={(e) => setRightColumn(e.target.value)}
                        className="h-full resize-none"
                        placeholder="Enter right column content..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-h-0">
                    <Textarea
                      value={markdown}
                      onChange={(e) => setMarkdown(e.target.value)}
                      className="h-full resize-none"
                      placeholder="Enter your markdown content..."
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="css" className="h-[calc(100%-40px)] mt-0">
              <CSSEditor
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
                onCSSChange={handleCSSChange}
                debugCSS={debugCSS}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    );
  };

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
        <PaperSizeSelector
          selectedPaperSize={paperSize}
          onPaperSizeChange={handlePaperSizeChange}
        />
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
                    <h2 className="text-base font-semibold text-foreground truncate">
                      Live Preview
                    </h2>
                  </div>
                  {renderPreviewBadge()}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-gray-50">
                <div className="w-full">
                  <ResumePreview
                    ref={previewRef}
                    markdown={isTwoColumn ? "" : markdown}
                    leftColumn={isTwoColumn ? leftColumn : ""}
                    rightColumn={isTwoColumn ? rightColumn : ""}
                    header={isTwoColumn ? header : ""}
                    summary={isTwoColumn ? summary : ""}
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
