import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Printer, Columns2, FileStack, Code, Eye } from "lucide-react";
import { ResumePreview } from "@/components/ResumePreview";
import { PrintPreview } from "@/components/PrintPreview";
import { TemplateSelector } from "@/components/TemplateSelector";
import { CSSEditor } from "@/components/CSSEditor";
import { useDynamicCSS } from "@/hooks/useDynamicCSS";

const defaultMarkdown = `# John Doe
**Software Engineer** | john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe

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

const defaultHeader = `# John Doe
**Software Engineer** | john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe`;

const defaultSummary = `Experienced software engineer with 5+ years developing scalable web applications. Passionate about clean code, user experience, and mentoring junior developers.`;

const defaultLeftColumn = `## Contact
- **Email:** john.doe@email.com
- **Phone:** (555) 123-4567
- **LinkedIn:** linkedin.com/in/johndoe
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

const Index = () => {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [header, setHeader] = useState(defaultHeader);
  const [summary, setSummary] = useState(defaultSummary);
  const [leftColumn, setLeftColumn] = useState(defaultLeftColumn);
  const [rightColumn, setRightColumn] = useState(defaultRightColumn);
  const [firstPage, setFirstPage] = useState(`## Certifications
- AWS Certified Solutions Architect
- Google Cloud Professional Developer
- Certified Kubernetes Administrator

## Languages
- English (Native)
- Spanish (Conversational)
- French (Basic)`);
  const [secondPage, setSecondPage] = useState(`## Additional Projects

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
- Active in developer community discussions`);
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [isTwoColumn, setIsTwoColumn] = useState(false);
  const [isTwoPage, setIsTwoPage] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const previewRef = useRef<HTMLDivElement>(null);
  const { addTemplateCSS, debugCSS } = useDynamicCSS();

  const handlePrintPDF = () => {
    window.print();
  };

  const handleCSSChange = (template: string, css: string) => {
    console.log(`🎨 Main component: CSS change for ${template}`);
    addTemplateCSS(template, css);
  };

  // Force re-render when template changes to ensure CSS is applied
  useEffect(() => {
    console.log(`📋 Template changed to: ${selectedTemplate}`);
  }, [selectedTemplate]);

  const getInputMode = () => {
    if (isTwoPage) return "twoPage";
    if (isTwoColumn) return "twoColumn";
    return "single";
  };

  const renderInputSection = () => {
    const inputMode = getInputMode();

    if (inputMode === "twoPage") {
      return (
        <div className="grid grid-cols-1 gap-6">
          <Card className="shadow-xl border-0 bg-white overflow-hidden">
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
                className="min-h-[300px] resize-none"
                placeholder="Enter content for the first page..."
              />
            </div>
          </Card>
          <Card className="shadow-xl border-0 bg-white overflow-hidden">
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
                className="min-h-[300px] resize-none"
                placeholder="Enter content for the second page..."
              />
            </div>
          </Card>
        </div>
      );
    }

    if (inputMode === "twoColumn") {
      return (
        <div className="grid grid-cols-1 gap-6">
          <Card className="shadow-xl border-0 bg-white overflow-hidden">
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
                className="min-h-[120px] resize-none"
                placeholder="Enter header content (name, contact info)..."
              />
            </div>
          </Card>
          <Card className="shadow-xl border-0 bg-white overflow-hidden">
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
                className="min-h-[100px] resize-none"
                placeholder="Enter a brief professional summary..."
              />
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-xl border-0 bg-white overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center gap-2">
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
                  className="min-h-[400px] resize-none"
                  placeholder="Enter left column content (skills, contact, etc.)..."
                />
              </div>
            </Card>
            <Card className="shadow-xl border-0 bg-white overflow-hidden">
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
                  className="min-h-[400px] resize-none"
                  placeholder="Enter right column content (experience, projects, etc.)..."
                />
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <Card className="shadow-xl border-0 bg-white overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Markdown Input
            </h2>
          </div>
        </div>
        <div className="flex-1 p-6 pt-0">
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="min-h-[600px] resize-none"
            placeholder="Enter your resume in Markdown format..."
          />
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                src="/markdown.png"
                alt="Markdown to resume icon"
                className="h-6 w-6 object-cover"
              />
            </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Markdown to Resume
                </h1>
                <p className="text-sm text-gray-600">
                  Transform markdown into professional resumes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Columns2 className="h-4 w-4" />
                <span className="text-sm">Two Column</span>
                <Switch
                  checked={isTwoColumn}
                  onCheckedChange={setIsTwoColumn}
                />
              </div>
              {/* <div className="flex items-center gap-2">
                <FileStack className="h-4 w-4" />
                <span className="text-sm">Two Page</span>
                <Switch
                  checked={isTwoPage}
                  onCheckedChange={setIsTwoPage}
                />
              </div> */}
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
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
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Left Panel - Tabs for Editor and CSS */}
          <div className="flex flex-col h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Content Editor
                </TabsTrigger>
                <TabsTrigger value="css" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  CSS Editor
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

          {/* Right Panel - Preview */}
          <Card className="shadow-xl border-0 bg-white overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Live Preview
                </h2>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
              <div className="w-full h-full flex items-start justify-center">
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
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
