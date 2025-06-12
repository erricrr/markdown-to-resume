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
  const { uploadedFileUrl, uploadedFileName, refreshTimestamp, triggerRefresh } = useFileUpload();
  const [hasImageReference, setHasImageReference] = useState(false);

  // Track previous uploadedFileUrl to detect changes
  const prevUploadedFileUrlRef = useRef(uploadedFileUrl);
  const prevUploadedFileNameRef = useRef(uploadedFileName);

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
        rightColumn,
        firstPage,
        secondPage
      ];

      const hasAnyImageReference = sources.some(content =>
        content && detectImageReferences(content)
      );

      setHasImageReference(hasAnyImageReference);

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
    firstPage,
    secondPage,
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
    } else {
      console.log('🔄 Switched back to single column mode');
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
    if (isTwoPage) return "twoPage";
    if (isTwoColumn) return "twoColumn";
    return "single";
  };

  // Shared FileUpload component for all modes (now integrated into header)

  const renderInputSection = () => {
    const inputMode = getInputMode();

    // Compact header with title, tips, and file upload in a single row
    const commonHeader = (
      <Card className="border-0 bg-white overflow-hidden shrink-0">
        <div className="pl-4 pt-3 -mb-1 px-1">
        <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                Markdown Editor
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FileUpload />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md cursor-help">
                    <Info className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-blue-700 font-medium">Tips</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm p-3 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium">💡 Markdown Tips:</p>
                    <p>• Use Markdown formatting for rich text (# for headings, ** for bold, etc.)</p>
                    <p>• Two-column mode will intelligently parse your content</p>
                    <p>• Always review the parsed results in two-column layout</p>
                    <p>• New to Markdown? Learn at: <a href="https://www.markdownguide.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">markdownguide.org</a> 🚀</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>
    );

    if (inputMode === "twoPage") {
      return (
        <div className="flex flex-col gap-2 h-full overflow-hidden">
          {!isSmallScreen && commonHeader}
          <div className="grid grid-cols-1 gap-2 flex-1 overflow-y-auto pr-1">
            <Card className="border-0 bg-white overflow-hidden">
              <div className="p-2 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-semibold text-foreground">
                      First Page Content
                    </h2>
                  </div>
                  {isSmallScreen && (
                    <div className="flex items-center gap-1">
                      <FileUpload />
                    </div>
                  )}
                </div>
              </div>
              <div className="p-2">
                <Textarea
                  value={firstPage}
                  onChange={(e) => setFirstPage(e.target.value)}
                  className={`${isSmallScreen ? 'h-[130px]' : 'h-[200px]'} w-full resize-none overflow-y-auto`}
                  placeholder="Enter content for the first page..."
                />
              </div>
            </Card>
            <Card className="border-0 bg-white overflow-hidden">
              <div className="p-2 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-semibold text-foreground">
                      Second Page Content
                    </h2>
                  </div>
                  {isSmallScreen && (
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md cursor-help">
                            <Info className="h-3 w-3 text-blue-600" />
                            <span className="text-xs text-blue-700 font-medium">Tips</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm p-3 text-sm">
                          <div className="space-y-1">
                            <p className="font-medium">💡 Markdown Tips:</p>
                            <p>• Content is automatically paginated</p>
                            <p>• Each page will be rendered separately</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-2">
                <Textarea
                  value={secondPage}
                  onChange={(e) => setSecondPage(e.target.value)}
                  className={`${isSmallScreen ? 'h-[130px]' : 'h-[200px]'} w-full resize-none overflow-y-auto`}
                  placeholder="Enter content for the second page..."
                />
              </div>
            </Card>
          </div>
        </div>
      );
    }

    if (inputMode === "twoColumn") {
      return (
        <div className="flex flex-col gap-2 h-full overflow-hidden">
          {!isSmallScreen && commonHeader}
          <div className="grid grid-cols-1 gap-2 flex-1 overflow-y-auto pr-1">
            {/* Header and Summary in single row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Card className="border-0 bg-white overflow-hidden">
                <div className="p-2 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">Header</h2>
                    {isSmallScreen && (
                      <div className="flex items-center gap-1">
                        <FileUpload />
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-2">
                  <Textarea
                    value={header}
                    onChange={(e) => setHeader(e.target.value)}
                    className={`${isSmallScreen ? 'h-[50px]' : 'h-[80px]'} w-full resize-none overflow-y-auto text-sm`}
                    placeholder="# Name | title | email | phone"
                  />
                </div>
              </Card>
              <Card className="border-0 bg-white overflow-hidden">
                <div className="p-2 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">Summary</h2>
                    {isSmallScreen && (
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md cursor-help">
                              <Info className="h-3 w-3 text-blue-600" />
                              <span className="text-xs text-blue-700 font-medium">Tips</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm p-3 text-sm">
                            <div className="space-y-1">
                              <p className="font-medium">💡 Markdown Tips:</p>
                              <p>• Use Markdown formatting for rich text</p>
                              <p>• Columns will be intelligently arranged</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-2">
                  <Textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className={`${isSmallScreen ? 'h-[50px]' : 'h-[80px]'} w-full resize-none overflow-y-auto text-sm`}
                    placeholder="Brief professional summary..."
                  />
                </div>
              </Card>
            </div>

            {/* Left and Right Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Card className="border-0 bg-white overflow-hidden">
                <div className="p-2 border-b">
                  <h2 className="text-sm font-semibold text-foreground">Left Column</h2>
                </div>
                <div className="p-2">
                  <Textarea
                    value={leftColumn}
                    onChange={(e) => setLeftColumn(e.target.value)}
                    className={`${isSmallScreen ? 'h-[70px]' : 'h-[220px]'} w-full resize-none overflow-y-auto text-sm`}
                    placeholder="Skills, contact, education..."
                  />
                </div>
              </Card>
              <Card className="border-0 bg-white overflow-hidden">
                <div className="p-2 border-b">
                  <h2 className="text-sm font-semibold text-foreground">Right Column</h2>
                </div>
                <div className="p-2">
                  <Textarea
                    value={rightColumn}
                    onChange={(e) => setRightColumn(e.target.value)}
                    className={`${isSmallScreen ? 'h-[70px]' : 'h-[220px]'} w-full resize-none overflow-y-auto text-sm`}
                    placeholder="Experience, projects..."
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    // Single column mode - integrate with common header
    return (
      <div className="flex flex-col gap-2 h-full overflow-hidden">
        {isSmallScreen ? (
          <Card className="border-0 bg-white overflow-hidden flex flex-col flex-1">
            <div className="p-2 border-b shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Main Content</h2>
                <div className="flex items-center gap-1">
                  <FileUpload />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md cursor-help">
                        <Info className="h-3 w-3 text-blue-600" />
                        <span className="text-xs text-blue-700 font-medium">Tips</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm p-3 text-sm">
                      <div className="space-y-1">
                        <p className="font-medium">💡 Markdown Tips:</p>
                        <p>• Use Markdown formatting for rich text (# for headings, ** for bold, etc.)</p>
                        <p>• Two-column mode will intelligently parse your content</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="flex-1 p-2 flex flex-col" style={{ height: 'calc(100% - 37px)' }}>
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full resize-none overflow-y-auto text-sm"
                style={{ height: '100%', paddingBottom: '8px' }}
                placeholder="Enter your resume in Markdown format..."
              />
            </div>
          </Card>
        ) : (
          <>
            {commonHeader}
            <Card className="border-0 bg-white overflow-hidden flex flex-col flex-1">
              <div className="p-3 border-b">
                <h2 className="text-sm font-semibold text-foreground">Main Content</h2>
              </div>
              <div className="flex-1 p-3 flex flex-col">
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="flex-1 w-full resize-none overflow-y-auto text-sm"
                  placeholder="Enter your resume in Markdown format..."
                />
              </div>
            </Card>
          </>
        )}
      </div>
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
                    className="bg-white hover:bg-gray-50 hover:text-gray-900 hidden sm:flex items-center gap-2 font-medium"
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
                    className="bg-white hover:bg-gray-50 hover:text-gray-900 sm:hidden font-medium"
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
                    className="bg-white hover:bg-gray-50 hover:text-gray-900 hidden sm:flex items-center gap-2 font-medium"
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
                    className="bg-white hover:bg-gray-50 hover:text-gray-900 sm:hidden font-medium"
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
            <div className="w-full h-[400px]">
              <div className="flex flex-col h-full overflow-hidden">
                {/* Control Bar */}
                <div className="flex flex-wrap items-center justify-center gap-4 w-full mb-2 py-1 shrink-0">
                  <div className="flex items-center gap-2">
                    <Columns2 className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Two Column</span>
                    <Switch
                      checked={isTwoColumn}
                      onCheckedChange={handleTwoColumnToggle}
                    />
                  </div>
                  <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={setSelectedTemplate}
                  />
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100%-40px)] flex flex-col overflow-hidden">
                  <TabsList className="flex w-full mb-2 gap-1 p-1 bg-muted rounded-lg shrink-0">
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

                  <TabsContent value="editor" className="flex-1 overflow-y-auto">
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
            <div className="w-full h-[350px]">
              <Card className="border-0 bg-white overflow-hidden flex flex-col h-full">
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
                      key={refreshTimestamp}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <ResizablePanelGroup
            direction="horizontal"
            className="h-[calc(100vh-220px)] max-h-[calc(100vh-220px)]"
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
                      onCheckedChange={handleTwoColumnToggle}
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

                  <TabsContent value="editor" className="flex-1 overflow-y-auto">
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
                      key={refreshTimestamp}
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
