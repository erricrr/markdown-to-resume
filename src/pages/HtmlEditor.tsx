import { useState, useRef, useEffect } from "react";
import { Code, Eye, FileText, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HtmlPreview } from "@/components/HtmlPreview";
import { HtmlPrintPreview } from "@/components/HtmlPrintPreview";
import { processHtmlForDisplay } from "@/utils/htmlProcessor";
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

  <!-- Google Font: Inter -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1a1a1a;
      background: #fafafa;
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }

    .resume {
      display: flex;
      max-width: 100%;
      min-height: 100vh;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      margin: 0;
      border-radius: 0;
      overflow: hidden;
    }

    /* A4 specific styling to ensure left column extends to bottom */
    @media screen and (min-width: 800px) {
      .resume {
        min-height: 11.69in; /* A4 height */
        max-height: 11.69in;
        margin: 0;
        border-radius: 0;
        padding: 0;
      }

      .left-column {
        min-height: 11.69in; /* Ensure left column extends to A4 height */
        height: 100%;
        border-radius: 0;
        padding-bottom: 0;
        margin-bottom: 0;
      }

      .right-column {
        min-height: 11.69in;
        height: 100%;
        border-radius: 0;
        padding-bottom: 0;
        margin-bottom: 0;
      }
    }

    .left-column {
      flex: 0 0 35%;
      max-width: 35%;
      background: #1e3a8a;
      color: white;
      padding: 40px 30px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .right-column {
      flex: 0 0 65%;
      max-width: 65%;
      padding: 40px 35px;
      background: white;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    h1 {
      margin: 0 0 20px 0;
      font-size: 36px;
      font-weight: 700;
      color: white;
      letter-spacing: -0.5px;
    }

    h2 {
      font-size: 20px;
      margin: 0 0 15px 0;
      color: white;
      font-weight: 700;
      letter-spacing: -0.3px;
      position: relative;
    }

    .left-column h2 {
      color: white;
      font-size: 22px;
      margin: 0 0 20px 0;
    }

    .right-column h2 {
      color: #1e3a8a;
    }

    h2::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 3px;
      background: currentColor;
      border-radius: 2px;
    }

    h3 {
      margin: 15px 0 6px 0;
      font-size: 15px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: -0.2px;
    }

    .section {
      margin-bottom: 25px;
      position: relative;
    }

    .job-title {
      font-style: normal;
      color: #1e3a8a;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
      letter-spacing: 0.2px;
    }

    ul {
      margin: 6px 0 12px 0;
      padding-left: 0;
      list-style: none;
    }

    ul li {
      margin-bottom: 6px;
      font-size: 14px;
      position: relative;
      padding-left: 20px;
      line-height: 1.5;
    }

    ul li::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #1e3a8a;
      font-weight: bold;
    }

    p {
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 8px 0;
    }

    .subheading {
      font-weight: 600;
      margin: 15px 0 8px 0;
      color: #1a1a1a;
      font-size: 14px;
      letter-spacing: 0.2px;
    }

    .left-column .subheading {
      color: white;
      font-size: 14px;
      font-weight: 700;
    }

    .contact-info {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 30px;
    }

    .contact-info p {
      margin-bottom: 10px;
      opacity: 0.9;
    }

    .contact-info a {
      color: white;
      text-decoration: none;
      transition: opacity 0.2s ease;
    }

    .contact-info a:hover {
      opacity: 0.8;
    }

    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 10px 0 20px 0;
    }

    .skill {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid rgba(255, 255, 255, 0.15);
      transition: all 0.2s ease;
    }

    .right-column .skill {
      background: #f1f5f9;
      color: #1e3a8a;
      border: 1px solid #e2e8f0;
    }

    .interactive-section {
      background: #1e3a8a;
      color: white;
      padding: 25px;
      border-radius: 12px;
      margin: 40px 0;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .interactive-button {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      padding: 12px 24px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      position: relative;
      z-index: 1;
    }

    .interactive-button:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    @media print {
      body {
        background: none !important;
      }

      .resume {
        box-shadow: none !important;
        margin: 0 !important;
        border-radius: 0 !important;
      }

      .interactive-section {
        display: none !important;
      }

              .skill {
          background: #f1f5f9 !important;
          color: #1e3a8a !important;
          border: 1px solid #e2e8f0 !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }

      .left-column {
        background: #1e3a8a !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        min-height: 11.69in !important;
        height: 100% !important;
        border-radius: 0 !important;
      }

      .right-column {
        min-height: 11.69in !important;
        height: 100% !important;
        border-radius: 0 !important;
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

      <!-- Spacer to push content to bottom for A4 -->
      <div style="flex-grow: 1; min-height: 2rem;"></div>
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

      <!-- Spacer to push content to bottom for A4 -->
      <div style="flex-grow: 1; min-height: 2rem;"></div>
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
          skill.style.background = skill.classList.contains('right-column') ? '#f1f5f9' : 'rgba(255, 255, 255, 0.1)';
          skill.style.color = skill.classList.contains('right-column') ? '#1e3a8a' : 'white';
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
      <div className="flex-1 min-h-0 border-t">
        <div className="h-full">
          <Editor
            height="100%"
            language="html"
            value={html}
            onChange={(value) => setHtml(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
            }}
          />
        </div>
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
          <div className="flex items-center gap-2">
            <Button
  onClick={() => {
    const processed = processHtmlForDisplay(html, {
      paperSize,
      uploadedFileUrl,
      uploadedFileName,
      forPrintWindow: true,
    });
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(processed);
      w.document.close();
    } else {
      alert(
        "Could not open preview window. Please disable your popup blocker and try again."
      );
    }
  }}
  className="bg-transparent hover:bg-transparent text-gray-600 hover:text-gray-900 font-semibold flex items-center p-1"
>
  <ExternalLink className="h-4 w-4" />
</Button>

          </div>
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
        alternateEditorColor="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
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
