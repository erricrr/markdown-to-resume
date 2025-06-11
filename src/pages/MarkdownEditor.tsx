import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Printer, Columns2, FileStack, Code, Eye, Sticker, Home } from "lucide-react";
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
    // Try to load from localStorage first, fallback to default
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
  const [firstPage, setFirstPage] = useState(() => {
    const saved = localStorage.getItem('markdown-editor-first-page');
    return saved || `## Certifications
- AWS Certified Solutions Architect
- Google Cloud Professional Developer
- Certified Kubernetes Administrator

## Languages
- English (Native)
- Spanish (Conversational)
- French (Basic)`;
  });
  const [secondPage, setSecondPage] = useState(() => {
    const saved = localStorage.getItem('markdown-editor-second-page');
    return saved || `## Additional Projects

### E-commerce Platform
- Built full-stack e-commerce solution with payment integration
- Technologies: React, Node.js, Stripe API, PostgreSQL
- Served 10,000+ daily active users

### Task Management App
- Developed collaborative task management application
- Technologies: Vue.js, Firebase, PWA
- Featured real-time collaboration and offline sync

### Open Source Contributions
- Contributor to popular React libraries
- Maintained documentation for 5+ projects
- Active in developer community discussions`;
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>(() => {
    // Ensure we always start with 'professional' as the default template
    console.log('🔵 Initializing selectedTemplate with default value: professional');
    return 'professional';
  });
  const [isTwoColumn, setIsTwoColumn] = useState(false);
  const [isTwoPage, setIsTwoPage] = useState(false);
  const [paperSize, setPaperSize] = useState<'A4' | 'US_LETTER'>('A4');
  const [activeTab, setActiveTab] = useState("editor");
  const previewRef = useRef<HTMLDivElement>(null);
  const { addTemplateCSS, debugCSS } = useDynamicCSS();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const { uploadedFileUrl, uploadedFileName } = useFileUpload();

  // State for panel sizes
  const [leftPanelSize, setLeftPanelSize] = useState(() => {
    // Try to get from localStorage, default to 50
    const savedSize = localStorage.getItem("markdown-editor-left-panel-size");
    return savedSize ? parseInt(savedSize, 10) : 50;
  });

  // Handle panel resizing
  const handlePanelResize = (sizes: number[]) => {
    const newLeftPanelSize = sizes[0];
    setLeftPanelSize(newLeftPanelSize);
    localStorage.setItem("markdown-editor-left-panel-size", newLeftPanelSize.toString());
  };

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

  useEffect(() => {
    localStorage.setItem('markdown-editor-first-page', firstPage);
  }, [firstPage]);

  useEffect(() => {
    localStorage.setItem('markdown-editor-second-page', secondPage);
  }, [secondPage]);

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

  // Force re-render when template changes to ensure CSS is applied
  useEffect(() => {
    console.log(`📋 Template changed to: ${selectedTemplate}`);
    // Re-apply the CSS from localStorage when template changes
    const savedCSS = localStorage.getItem(`css-editor-${selectedTemplate}`);
    if (savedCSS) {
      console.log('🎨 Re-applying saved CSS after template change:', selectedTemplate);
      addTemplateCSS(selectedTemplate, savedCSS);
    }
  }, [selectedTemplate, addTemplateCSS]);

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
    if (isTwoPage) return "twoPage";
    if (isTwoColumn) return "twoColumn";
    return "single";
  };

  // Shared FileUpload component for all modes
  const renderSharedFileUpload = () => (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <h3 className="my-2">Add Image</h3>
        <span className="text-xs text-gray-500">Auto-saved</span>
      </div>
      <FileUpload />
    </div>
  );

  const renderInputSection = () => {
    const inputMode = getInputMode();

    if (inputMode === "twoPage") {
      return (
        <div className="grid grid-cols-1 gap-6 h-full overflow-auto pr-1">
          <Card className="border-0 bg-white overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  First Page Content
                </h2>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Textarea
                value={firstPage}
                onChange={(e) => setFirstPage(e.target.value)}
                className="h-[300px] w-full resize-none overflow-y-auto"
                placeholder="Enter content for the first page..."
              />
            </div>
          </Card>
          <Card className="border-0 bg-white overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Second Page Content
                </h2>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Textarea
                value={secondPage}
                onChange={(e) => setSecondPage(e.target.value)}
                className="h-[300px] w-full resize-none overflow-y-auto"
                placeholder="Enter content for the second page..."
              />
            </div>
          </Card>
        </div>
      );
    }

    if (inputMode === "twoColumn") {
      return (
        <div className="grid grid-cols-1 gap-6 h-full overflow-auto pr-1">
          {/* Header and Summary in single row on all screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="border-0 bg-white overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Header Section
                  </h2>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Textarea
                  value={header}
                  onChange={(e) => setHeader(e.target.value)}
                  className="h-[120px] w-full resize-none overflow-y-auto"
                  placeholder="Enter header content (name, contact info)..."
                />
              </div>
            </Card>
            <Card className="border-0 bg-white overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Summary Section
                  </h2>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="h-[120px] w-full resize-none overflow-y-auto"
                  placeholder="Enter a brief professional summary..."
                />
              </div>
            </Card>
          </div>

          {/* Left and Right Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Card className="border-0 bg-white overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Left Column
                  </h2>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Textarea
                  value={leftColumn}
                  onChange={(e) => setLeftColumn(e.target.value)}
                  className="h-[300px] w-full resize-none overflow-y-auto"
                  placeholder="Enter left column content (skills, contact, etc.)..."
                />
              </div>
            </Card>
            <Card className="border-0 bg-white overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Right Column
                  </h2>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Textarea
                  value={rightColumn}
                  onChange={(e) => setRightColumn(e.target.value)}
                  className="h-[300px] w-full resize-none overflow-y-auto"
                  placeholder="Enter right column content (experience, projects, etc.)..."
                />
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <Card className="border-0 bg-white overflow-hidden flex flex-col h-full">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Markdown Editor
            </h2>
          </div>
        </div>
        <div className="flex-1 p-6 pt-0 overflow-hidden flex flex-col">
          {renderSharedFileUpload()}
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 w-full resize-none overflow-auto min-h-[500px]"
            placeholder="Enter your resume in Markdown format..."
          />
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Markdown Resume Editor
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Transform markdown into professional resumes
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Home Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Home"
                    onClick={() => navigate("/")}
                    className="bg-white hover:bg-gray-50 hidden sm:flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Go to Home</TooltipContent>
              </Tooltip>

              {/* Mobile Home Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Home"
                    onClick={() => navigate("/")}
                    className="bg-white hover:bg-gray-50 sm:hidden"
                  >
                    <Home className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Go to Home</TooltipContent>
              </Tooltip>

              {/* Switch to HTML Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Switch to HTML"
                    onClick={() => navigate("/html")}
                    className="bg-white hover:bg-gray-50 hidden sm:flex items-center gap-2"
                  >
                    <Code className="h-4 w-4" />
                    <span>HTML Editor</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Switch to HTML Editor</TooltipContent>
              </Tooltip>

              {/* Mobile HTML Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Switch to HTML"
                    onClick={() => navigate("/html")}
                    className="bg-white hover:bg-gray-50 sm:hidden"
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Switch to HTML Editor</TooltipContent>
              </Tooltip>
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
                firstPage={firstPage}
                secondPage={secondPage}
                template={selectedTemplate}
                isTwoColumn={isTwoColumn}
                isTwoPage={isTwoPage}
                paperSize={paperSize}
                uploadedFileUrl={uploadedFileUrl}
                uploadedFileName={uploadedFileName}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isSmallScreen ? (
          <div className="flex flex-col gap-6">
                            {/* Editor Section - Small Screen */}
            <div className="w-full">
              <div className="flex flex-col h-[400px] max-h-[400px] overflow-hidden">
                {/* Control Bar */}
                <div className="flex flex-wrap items-center justify-center gap-4 w-full mb-4 py-1">
                  <div className="flex items-center gap-2">
                    <Columns2 className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Two Column</span>
                    <Switch
                      checked={isTwoColumn}
                      onCheckedChange={setIsTwoColumn}
                    />
                  </div>
                  <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={setSelectedTemplate}
                  />
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col overflow-hidden">
                  <TabsList className="flex w-full mb-4 gap-1 p-1 bg-muted rounded-lg shrink-0">
                    <TabsTrigger
                      value="editor"
                      className="flex-1 flex items-center justify-center gap-1 text-xs sm:text-sm py-1.5 px-2 rounded-md h-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 shrink-0" />
                      <span className="truncate">Content Editor</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="css"
                      className="flex-1 flex items-center justify-center gap-1 text-xs sm:text-sm py-1.5 px-2 rounded-md h-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <Code className="h-3 w-3 sm:h-4 sm:w-4 mr-1 shrink-0" />
                      <span className="truncate">CSS Editor</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="editor" className="flex-1 overflow-auto">
                    {renderInputSection()}
                  </TabsContent>

                  <TabsContent value="css" className="flex-1 overflow-hidden">
                    <CSSEditor
                      selectedTemplate={selectedTemplate}
                      onTemplateChange={setSelectedTemplate}
                      onCSSChange={handleCSSChange}
                      debugCSS={debugCSS}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Preview Section - Small Screen */}
            <div className="w-full">
              <Card className="border-0 bg-white overflow-hidden flex flex-col h-[500px] max-h-[500px]">
                <div className="p-6 border-b shrink-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">
                        Live Preview
                      </h2>
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      PDF-accurate preview
                    </Badge>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-gray-50">
                  <div className="w-full">
                    <ResumePreview
                      ref={previewRef}
                      markdown={isTwoColumn || isTwoPage ? "" : markdown}
                      leftColumn={isTwoColumn ? leftColumn : ""}
                      rightColumn={isTwoColumn ? rightColumn : ""}
                      header={isTwoColumn ? header : ""}
                      summary={isTwoColumn ? summary : ""}
                      firstPage={firstPage}
                      secondPage={secondPage}
                      template={selectedTemplate}
                      isTwoColumn={isTwoColumn}
                      isTwoPage={isTwoPage}
                      paperSize={paperSize}
                      uploadedFileUrl={uploadedFileUrl}
                      uploadedFileName={uploadedFileName}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <ResizablePanelGroup
            direction="horizontal"
            className="h-auto lg:h-[calc(100vh-200px)] max-h-[calc(100vh-200px)]"
            onLayout={handlePanelResize}
          >
            {/* Left Panel - Tabs for Editor and CSS */}
            <ResizablePanel defaultSize={leftPanelSize} minSize={30}>
              <div className="flex flex-col h-full max-h-full overflow-hidden">
                {/* Control Bar: moved from header */}
                <div className="flex flex-wrap items-center justify-center gap-4 w-full mb-4 py-1">
                  <div className="flex items-center gap-2">
                    <Columns2 className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Two Column</span>
                    <Switch
                      checked={isTwoColumn}
                      onCheckedChange={setIsTwoColumn}
                    />
                  </div>
                  <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={setSelectedTemplate}
                  />
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col overflow-hidden">
                  <TabsList className="flex w-full mb-4 gap-1 p-1 bg-muted rounded-lg shrink-0">
                    <TabsTrigger
                      value="editor"
                      className="flex-1 flex items-center justify-center gap-1 text-xs sm:text-sm py-1.5 px-2 rounded-md h-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 shrink-0" />
                      <span className="truncate">Content Editor</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="css"
                      className="flex-1 flex items-center justify-center gap-1 text-xs sm:text-sm py-1.5 px-2 rounded-md h-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <Code className="h-3 w-3 sm:h-4 sm:w-4 mr-1 shrink-0" />
                      <span className="truncate">CSS Editor</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="editor" className="flex-1 overflow-auto">
                    {renderInputSection()}
                  </TabsContent>

                  <TabsContent value="css" className="flex-1 overflow-hidden">
                    <CSSEditor
                      selectedTemplate={selectedTemplate}
                      onTemplateChange={setSelectedTemplate}
                      onCSSChange={handleCSSChange}
                      debugCSS={debugCSS}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right Panel - Preview */}
            <ResizablePanel minSize={30}>
              <Card className="border-0 bg-white overflow-hidden flex flex-col h-full max-h-full">
                <div className="p-6 border-b shrink-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">
                        Live Preview
                      </h2>
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      PDF-accurate preview
                    </Badge>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-gray-50">
                  <div className="w-full">
                    <ResumePreview
                      ref={previewRef}
                      markdown={isTwoColumn || isTwoPage ? "" : markdown}
                      leftColumn={isTwoColumn ? leftColumn : ""}
                      rightColumn={isTwoColumn ? rightColumn : ""}
                      header={isTwoColumn ? header : ""}
                      summary={isTwoColumn ? summary : ""}
                      firstPage={firstPage}
                      secondPage={secondPage}
                      template={selectedTemplate}
                      isTwoColumn={isTwoColumn}
                      isTwoPage={isTwoPage}
                      paperSize={paperSize}
                      uploadedFileUrl={uploadedFileUrl}
                      uploadedFileName={uploadedFileName}
                    />
                  </div>
                </div>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
