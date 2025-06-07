import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileText, Printer, Columns2, FileStack } from "lucide-react";
import { ResumePreview } from "@/components/ResumePreview";
import { PrintPreview } from "@/components/PrintPreview";
import { TemplateSelector } from "@/components/TemplateSelector";

const defaultMarkdown = `# John Doe
**Software Engineer** | john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe

## Professional Summary
Experienced software engineer with 5+ years developing scalable web applications. Passionate about clean code, user experience, and emerging technologies.

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

const defaultLeftColumn = `## Contact
- Email: john.doe@email.com
- Phone: (555) 123-4567
- LinkedIn: linkedin.com/in/johndoe

## Skills
- **Languages:** JavaScript, TypeScript, Python
- **Frameworks:** React, Node.js, Express
- **Databases:** PostgreSQL, MongoDB
- **Tools:** Git, Docker, AWS

## Education
### Bachelor of Science in Computer Science
*University of Technology | 2015 - 2019*
- GPA: 3.8/4.0`;

const defaultRightColumn = `## Professional Summary
Experienced software engineer with 5+ years developing scalable web applications. Passionate about clean code, user experience, and emerging technologies.

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
  const [leftColumn, setLeftColumn] = useState(defaultLeftColumn);
  const [rightColumn, setRightColumn] = useState(defaultRightColumn);
  const [firstPage, setFirstPage] = useState(defaultMarkdown);
  const [secondPage, setSecondPage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [isTwoColumn, setIsTwoColumn] = useState(false);
  const [isTwoPage, setIsTwoPage] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrintPDF = () => {
    window.print();
  };

  const getInputMode = () => {
    if (isTwoPage) return "twoPage";
    if (isTwoColumn) return "twoColumn";
    return "single";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Markdown to Resume
                </h1>
                <p className="text-sm text-muted-foreground">
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
                  onCheckedChange={(checked) => {
                    setIsTwoColumn(checked);
                    if (checked) setIsTwoPage(false);
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <FileStack className="h-4 w-4" />
                <span className="text-sm">Two Page</span>
                <Switch
                  checked={isTwoPage}
                  onCheckedChange={(checked) => {
                    setIsTwoPage(checked);
                    if (checked) setIsTwoColumn(false);
                  }}
                />
              </div>
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />
              <PrintPreview
                markdown={markdown}
                leftColumn={leftColumn}
                rightColumn={rightColumn}
                header={header}
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
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Markdown Input */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  {isTwoPage
                    ? "Markdown Input (Two Pages)"
                    : isTwoColumn
                      ? "Markdown Input (Two Columns)"
                      : "Markdown Input"}
                </h2>
              </div>
            </div>
            <div className="flex-1 p-6 pt-0 flex flex-col gap-4">
              {isTwoPage ? (
                <>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Page 1
                    </label>
                    <Textarea
                      value={firstPage}
                      onChange={(e) => setFirstPage(e.target.value)}
                      placeholder="Enter first page content in Markdown format..."
                      className="h-full resize-none font-mono text-sm border-0 bg-white/50 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Page 2
                    </label>
                    <Textarea
                      value={secondPage}
                      onChange={(e) => setSecondPage(e.target.value)}
                      placeholder="Enter second page content in Markdown format..."
                      className="h-full resize-none font-mono text-sm border-0 bg-white/50 focus:bg-white transition-colors"
                    />
                  </div>
                </>
              ) : isTwoColumn ? (
                <>
                  <div className="flex-none">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Header
                    </label>
                    <Textarea
                      value={header}
                      onChange={(e) => setHeader(e.target.value)}
                      placeholder="Enter header content (name, contact info) in Markdown format..."
                      className="h-20 resize-none font-mono text-sm border-0 bg-white/50 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Left Column
                    </label>
                    <Textarea
                      value={leftColumn}
                      onChange={(e) => setLeftColumn(e.target.value)}
                      placeholder="Enter left column content in Markdown format..."
                      className="h-full resize-none font-mono text-sm border-0 bg-white/50 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Right Column
                    </label>
                    <Textarea
                      value={rightColumn}
                      onChange={(e) => setRightColumn(e.target.value)}
                      placeholder="Enter right column content in Markdown format..."
                      className="h-full resize-none font-mono text-sm border-0 bg-white/50 focus:bg-white transition-colors"
                    />
                  </div>
                </>
              ) : (
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="Enter your resume in Markdown format..."
                  className="h-full resize-none font-mono text-sm border-0 bg-white/50 focus:bg-white transition-colors"
                />
              )}
            </div>
          </Card>

          {/* Resume Preview */}
          <Card className="shadow-xl border-0 bg-white overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Preview
                </h2>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6 pt-0">
              <ResumePreview
                ref={previewRef}
                markdown={isTwoColumn || isTwoPage ? "" : markdown}
                leftColumn={isTwoColumn ? leftColumn : ""}
                rightColumn={isTwoColumn ? rightColumn : ""}
                header={isTwoColumn ? header : ""}
                firstPage={isTwoPage ? firstPage : ""}
                secondPage={isTwoPage ? secondPage : ""}
                template={selectedTemplate}
                isTwoColumn={isTwoColumn}
                isTwoPage={isTwoPage}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
