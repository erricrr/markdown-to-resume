import { useState, useRef, useEffect } from "react";
import { Code, Eye, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { HtmlPreview } from "@/components/HtmlPreview";
import { HtmlPrintPreview } from "@/components/HtmlPrintPreview";
import { FileUpload } from "@/components/FileUpload";
import { PaperSizeSelector } from "@/components/PaperSizeSelector";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { TipTooltip } from '@/components/UsageTips';
import { EditorLayout } from '@/components/EditorLayout';
import { EditorHeader } from '@/components/EditorHeader';
import { usePanelManagement } from '@/hooks/usePanelManagement';
import { useImageReferenceDetection } from '@/hooks/useImageReferenceDetection';

const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Jane Doe - Resume</title>

  <!-- Google Font: Work Sans -->
  <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 1.5cm 2cm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Work Sans', sans-serif;
      color: #333;
      background: #f5f5f5;
      margin: 0;
      padding: 0;
    }

    .resume {
      display: flex;
      max-width: 100%;
      min-height: 100vh;
      background: white;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      margin: auto;
    }

    .left-column {
      flex: 0 0 35%;
      max-width: 35%;
      background-color: #f0f0f0;
      padding: 40px 30px 40px 40px;
      border-right: 4px solid #1976d2; /* Blue Accent */
    }

    .right-column {
      flex: 0 0 65%;
      max-width: 65%;
      padding: 40px 40px;
    }

    h1 {
      margin-top: 5px;
      font-size: 36px;
      font-weight: 700;
      color: #222;
    }

    h2 {
      font-size: 18px;
      margin-bottom: 8px;
      color: #1976d2;
      font-weight: 600;
      border-bottom: 1px solid #1976d2;
      padding-bottom: 4px;
    }

    h3 {
      margin: 10px 0 4px;
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }

    .section {
      margin-bottom: 30px;
    }

    .job-title {
      font-style: italic;
      color: #555;
      font-size: 13px;
      margin-bottom: 4px;
    }

    ul {
      margin: 5px 0 10px 20px;
      padding-left: 0;
    }

    ul li {
      margin-bottom: 5px;
      font-size: 13px;
    }

    p, li {
      font-size: 14px;
      line-height: 1.6;
    }

    .subheading {
      font-weight: 600;
      margin-top: 15px;
      margin-bottom: 8px;
      color: #444;
      font-size: 14px;
    }

    .contact-info {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 30px;
    }

    .contact-info p {
      margin-bottom: 8px;
    }

    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin: 0 0 0.9375rem -0.625rem;
    }

    .skill {
      background: #e3f2fd;
      color: #1976d2;
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .interactive-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 10px;
      margin: 30px 0;
      text-align: center;
    }

    .interactive-button {
      background: rgba(255,255,255,0.2);
      color: white;
      border: 2px solid white;
      padding: 10px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    .interactive-button:hover {
      background: white;
      color: #667eea;
    }

    @media print {
      body {
        background: none !important;
      }

      .resume {
        box-shadow: none !important;
        margin: 0 !important;
      }

      .interactive-section {
        display: none !important;
      }

      .skill {
        background: #e3f2fd !important;
        color: #1976d2 !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }

      .left-column {
        background-color: #f0f0f0 !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  <div class="resume">
    <!-- LEFT COLUMN -->
    <div class="left-column">
      <h1>Jane Doe</h1>
      <div class="contact-info">
        <p><strong>Email:</strong> <a href="mailto:jane.doe@email.com">jane.doe@email.com</a></p>
        <p><strong>Phone:</strong> (555) 123-4567</p>
        <p><strong>Location:</strong> San Francisco, CA</p>
        <p><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/janedoe" target="_blank">linkedin.com/in/janedoe</a></p>
      </div>

      <div class="section">
        <h2>Skills</h2>
        <div class="subheading">Technical</div>
        <div class="skills">
          <span class="skill">JavaScript</span>
          <span class="skill">TypeScript</span>
          <span class="skill">React</span>
          <span class="skill">Node.js</span>
          <span class="skill">Python</span>
          <span class="skill">PostgreSQL</span>
          <span class="skill">MongoDB</span>
        </div>
        <div class="subheading">Platforms & Tools</div>
        <div class="skills">
          <span class="skill">Docker</span>
          <span class="skill">AWS</span>
          <span class="skill">Git</span>
        </div>
        <div class="subheading">Languages</div>
        <p>English (Native), Spanish (Conversational), French (Basic)</p>
      </div>

      <div class="section">
        <h2>Education</h2>
        <p><strong>University of Technology</strong><br>Bachelor of Science in Computer Science – 2015-2019</p>
        <p><strong>GPA:</strong> 3.8/4.0</p>
      </div>
    </div>

    <!-- RIGHT COLUMN -->
    <div class="right-column">
      <div class="section">
        <h2>Professional Summary</h2>
        <p>
          Experienced software engineer with 5+ years developing scalable web applications. Passionate about clean code, user experience, and mentoring junior developers. Proven track record of leading teams and delivering high-impact projects.
        </p>
      </div>

      <div class="section">
        <h2>Professional Experience</h2>

        <h3>TechCorp Inc.</h3>
        <div class="job-title">Senior Software Engineer | January 2022 - Present</div>
        <ul>
          <li>Led development of microservices architecture serving 1M+ users</li>
          <li>Mentored junior developers and conducted code reviews</li>
          <li>Implemented CI/CD pipelines reducing deployment time by 60%</li>
          <li>Designed and built real-time analytics dashboard using React and WebSocket</li>
        </ul>

        <h3>StartupXYZ</h3>
        <div class="job-title">Software Engineer | June 2019 - December 2021</div>
        <ul>
          <li>Built responsive web applications using React and Node.js</li>
          <li>Collaborated with design team to improve user experience</li>
          <li>Optimized database queries improving performance by 40%</li>
          <li>Integrated payment systems and third-party APIs</li>
        </ul>
      </div>

      <div class="section">
        <h2>Notable Projects</h2>
        <h3>E-commerce Platform</h3>
        <div class="job-title">2023</div>
        <ul>
          <li>Built full-stack e-commerce solution with payment integration</li>
          <li>Technologies: React, Node.js, Stripe API, PostgreSQL</li>
          <li>Served 10,000+ daily active users</li>
        </ul>

        <h3>Task Management App</h3>
        <div class="job-title">2022</div>
        <ul>
          <li>Developed collaborative task management application with real-time sync</li>
          <li>Technologies: Vue.js, Firebase, PWA</li>
          <li>Featured offline capabilities</li>
        </ul>
      </div>

      <div class="interactive-section">
        <h3>Interactive Features Demo</h3>
        <p>This resume demonstrates HTML, CSS, and JavaScript capabilities:</p>
        <button class="interactive-button" onclick="toggleHighlight()">
          Toggle Highlight Mode
        </button>
        <p id="demo-text" style="margin-top: 15px;">Click the button to see JavaScript in action!</p>
      </div>
    </div>
  </div>

  <script>
    // JavaScript functionality example
    function toggleHighlight() {
      const text = document.getElementById('demo-text');
      const skills = document.querySelectorAll('.skill');

      if (text.style.backgroundColor === 'yellow') {
        text.style.backgroundColor = '';
        text.textContent = 'Click the button to see JavaScript in action!';
        skills.forEach(skill => {
          skill.style.background = '#e3f2fd';
          skill.style.transform = 'scale(1)';
        });
      } else {
        text.style.backgroundColor = 'yellow';
        text.style.color = '#333333';
        text.style.padding = '10px';
        text.style.borderRadius = '5px';
        text.textContent = 'JavaScript is working! Skills are now highlighted and animated.';
        skills.forEach(skill => {
          skill.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
          skill.style.color = 'white';
          skill.style.transform = 'scale(1.1)';
          skill.style.transition = 'all 0.3s ease';
        });
      }
    }

    // Add some interactive features on load
    document.addEventListener('DOMContentLoaded', function() {
      console.log('HTML Resume loaded with JavaScript support!');

      // Add hover effects to skills
      const skills = document.querySelectorAll('.skill');
      skills.forEach(skill => {
        skill.addEventListener('mouseenter', function() {
          this.style.transform = 'scale(1.05) translateY(-2px)';
          this.style.transition = 'transform 0.2s ease';
          this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
        skill.addEventListener('mouseleave', function() {
          this.style.transform = 'scale(1) translateY(0)';
          this.style.boxShadow = 'none';
        });
      });

      // Add smooth scroll animation for sections
      const sections = document.querySelectorAll('.section');
      sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        setTimeout(() => {
          section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          section.style.opacity = '1';
          section.style.transform = 'translateY(0)';
        }, index * 100);
      });
    });
  </script>
</body>
</html>`;

const HtmlEditor = () => {
  const [html, setHtml] = useState(() => {
    const saved = localStorage.getItem('html-editor-content');
    return saved || defaultHtml;
  });
  const [paperSize, setPaperSize] = useState<'A4' | 'US_LETTER'>(() => {
    return (localStorage.getItem('paper-size') as 'A4' | 'US_LETTER') || 'A4';
  });
  const previewRef = useRef<HTMLDivElement>(null);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  // Use shared hooks
  const { leftPanelSize, handlePanelResize, shouldUseCompactUI } = usePanelManagement('html-editor');
  const { uploadedFileUrl, uploadedFileName, refreshTimestamp } = useImageReferenceDetection(html, { detectHtml: true });

  // Auto-save effect
  useEffect(() => {
    localStorage.setItem('html-editor-content', html);
  }, [html]);

  useEffect(() => {
    localStorage.setItem('paper-size', paperSize);
  }, [paperSize]);

  const handlePaperSizeChange = (size: 'A4' | 'US_LETTER') => {
    setPaperSize(size);
  };

  const renderHtmlEditor = () => (
    <Card className="border-0 bg-white overflow-hidden flex flex-col h-full max-h-full">
      <div className="pl-4 pt-3 -mb-1 px-1">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-primary shrink-0" />
            <h2 className="text-base font-semibold text-foreground truncate">
              HTML Editor
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <FileUpload compact={shouldUseCompactUI} />
            </div>
            <TipTooltip type="html" compact={shouldUseCompactUI} />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          className="h-full w-full font-mono text-sm resize-none overflow-y-auto p-4"
          placeholder="Enter your HTML content with embedded CSS and JavaScript..."
        />
      </div>
    </Card>
  );

  const renderPreview = () => (
    <Card className="border-0 bg-white overflow-hidden flex flex-col h-full max-h-full">
      <div className="p-4 border-b shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Eye className="h-4 w-4 text-primary shrink-0" />
            <h2 className="text-base font-semibold text-foreground truncate">
              Live Preview
            </h2>
          </div>
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 shrink-0">
            Interactive & PDF-ready
          </Badge>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 bg-gray-50">
        <div className="w-full h-full flex items-start justify-center">
          <HtmlPreview
            ref={previewRef}
            html={html}
            paperSize={paperSize}
            uploadedFileUrl={uploadedFileUrl}
            uploadedFileName={uploadedFileName}
            key={refreshTimestamp}
          />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <EditorHeader
        title="HTML Resume Editor"
        description="Create interactive resumes with HTML, CSS, and JavaScript"
        icon={<Code className="h-6 w-6 text-white" />}
        iconBgColor="bg-gradient-to-br from-orange-500 to-red-600"
        alternateEditorPath="/markdown"
        alternateEditorIcon={<FileText className="h-4 w-4" />}
        alternateEditorLabel="Markdown Editor"
      >
        <PaperSizeSelector
          selectedPaperSize={paperSize}
          onPaperSizeChange={handlePaperSizeChange}
        />
        <HtmlPrintPreview
          html={html}
          paperSize={paperSize}
          uploadedFileUrl={uploadedFileUrl}
          uploadedFileName={uploadedFileName}
          key={refreshTimestamp}
        />
      </EditorHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
        <EditorLayout
          leftPanel={renderHtmlEditor()}
          rightPanel={renderPreview()}
          leftPanelSize={leftPanelSize}
          onPanelResize={handlePanelResize}
          storageKey="html-editor"
        />
      </div>
    </div>
  );
};

export default HtmlEditor;
