import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Download, FileText, Printer, Columns2 } from 'lucide-react';
import { ResumePreview } from '@/components/ResumePreview';
import { TemplateSelector } from '@/components/TemplateSelector';
import { exportToPDF } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';

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

const defaultLeftColumn = `# John Doe
**Software Engineer**

## Contact
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
  const [leftColumn, setLeftColumn] = useState(defaultLeftColumn);
  const [rightColumn, setRightColumn] = useState(defaultRightColumn);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [isTwoColumn, setIsTwoColumn] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    
    setIsExporting(true);
    try {
      await exportToPDF(previewRef.current, 'resume.pdf');
      toast({
        title: "PDF Downloaded!",
        description: "Your resume has been saved as a PDF file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleShowPrintPreview = () => {
    setShowPrintPreview(true);
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
                <h1 className="text-2xl font-bold text-foreground">ResumeBuilder Pro</h1>
                <p className="text-sm text-muted-foreground">Transform markdown into professional resumes</p>
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
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />
              <Button 
                onClick={handleShowPrintPreview}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Preview
              </Button>
              <Button 
                onClick={handlePrintPDF}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print PDF
              </Button>
              <Button 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Generating...' : 'Download PDF'}
              </Button>
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
                  {isTwoColumn ? 'Markdown Input (Two Columns)' : 'Markdown Input'}
                </h2>
              </div>
            </div>
            <div className="flex-1 p-6 pt-0 flex flex-col gap-4">
              {isTwoColumn ? (
                <>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Left Column</label>
                    <Textarea
                      value={leftColumn}
                      onChange={(e) => setLeftColumn(e.target.value)}
                      placeholder="Enter left column content in Markdown format..."
                      className="h-full resize-none font-mono text-sm border-0 bg-white/50 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Right Column</label>
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
                <h2 className="text-lg font-semibold text-foreground">Preview</h2>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6 pt-0">
              <ResumePreview
                ref={previewRef}
                markdown={isTwoColumn ? '' : markdown}
                leftColumn={isTwoColumn ? leftColumn : ''}
                rightColumn={isTwoColumn ? rightColumn : ''}
                template={selectedTemplate}
                isTwoColumn={isTwoColumn}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Print Preview Modal */}
      <PrintPreview
        isOpen={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        markdown={isTwoColumn ? '' : markdown}
        leftColumn={isTwoColumn ? leftColumn : ''}
        rightColumn={isTwoColumn ? rightColumn : ''}
        template={selectedTemplate}
        isTwoColumn={isTwoColumn}
        onPrint={handlePrintPDF}
      />
    </div>
  );
};

export default Index;
