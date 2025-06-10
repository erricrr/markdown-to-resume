import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code, Eye, Printer, ArrowLeft, FileText } from "lucide-react";
import { HtmlPreview } from "@/components/HtmlPreview";
import { HtmlPrintPreview } from "@/components/HtmlPrintPreview";

const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>John Doe - Resume</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .resume {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 8px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #333;
        }
        .name {
            font-size: 2.5em;
            font-weight: bold;
            margin: 0;
            color: #333;
        }
        .title {
            font-size: 1.2em;
            color: #666;
            margin: 5px 0;
        }
        .contact {
            color: #666;
            margin-top: 10px;
        }

                /* Two-column layout */
        .content {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 40px;
            margin-top: 15px;
        }

        .left-column {
            background: #f8f9fa;
            padding: 20px 25px 25px 25px;
            border-radius: 8px;
        }

        .right-column {
            padding: 0 20px;
        }

        .section {
            margin-bottom: 20px;
        }

        .section:first-child {
            margin-top: 0;
            padding-top: 0;
        }

        .section:first-child h2 {
            margin-top: 0;
        }
        .section h2 {
            color: #333;
            border-bottom: 2px solid #1976d2;
            padding-bottom: 5px;
            margin-bottom: 15px;
            font-size: 1.3em;
        }
        .left-column .section h2 {
            border-bottom: 2px solid #666;
        }

        .job {
            margin-bottom: 25px;
        }
        .job-title {
            font-weight: bold;
            color: #333;
            font-size: 1.1em;
        }
        .company {
            color: #666;
            font-style: italic;
            margin: 5px 0;
        }
        .date {
            color: #888;
            font-size: 0.9em;
        }

        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 15px;
        }
        .skill {
            background: #e3f2fd;
            color: #1976d2;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 500;
        }

        .contact-item {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .contact-icon {
            width: 16px;
            height: 16px;
            background: #1976d2;
            border-radius: 50%;
            display: inline-block;
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

        /* Responsive design */
        @media (max-width: 768px) {
            .content {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            .resume {
                padding: 20px;
            }
        }

        @media print {
            @page {
                margin: 0.5in;
                size: A4;
            }

            html, body {
                background: white !important;
                padding: 0 !important;
                margin: 0 !important;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
            }

            .resume {
                box-shadow: none;
                border-radius: 0;
                padding: 20px;
                max-width: none;
                background: white !important;
            }

            .left-column {
                background: #f8f9fa !important;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
            }

            .skill {
                background: #e3f2fd !important;
                color: #1976d2 !important;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
            }

            .interactive-section {
                display: none !important;
            }

            .content {
                display: grid !important;
                grid-template-columns: 1fr 2fr !important;
                gap: 40px !important;
            }
        }
    </style>
</head>
<body>
    <div class="resume">
        <div class="header">
            <h1 class="name">John Doe</h1>
            <div class="title">Senior Software Engineer</div>
            <div class="contact">
                john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe | San Francisco, CA
            </div>
        </div>

        <div class="content">
            <div class="left-column">
                <section class="section">
                    <h2>Contact</h2>
                    <div class="contact-item">
                        <span class="contact-icon"></span>
                        <span>john.doe@email.com</span>
                    </div>
                    <div class="contact-item">
                        <span class="contact-icon"></span>
                        <span>(555) 123-4567</span>
                    </div>
                    <div class="contact-item">
                        <span class="contact-icon"></span>
                        <span>San Francisco, CA</span>
                    </div>
                    <div class="contact-item">
                        <span class="contact-icon"></span>
                        <span>linkedin.com/in/johndoe</span>
                    </div>
                </section>

                <section class="section">
                    <h2>Skills</h2>
                    <div class="skills">
                        <span class="skill">JavaScript</span>
                        <span class="skill">TypeScript</span>
                        <span class="skill">React</span>
                        <span class="skill">Node.js</span>
                        <span class="skill">Python</span>
                        <span class="skill">PostgreSQL</span>
                        <span class="skill">Docker</span>
                        <span class="skill">AWS</span>
                        <span class="skill">Git</span>
                        <span class="skill">MongoDB</span>
                    </div>
                </section>

                <section class="section">
                    <h2>Education</h2>
                    <div class="job">
                        <div class="job-title">Bachelor of Science</div>
                        <div>Computer Science</div>
                        <div class="company">University of Technology</div>
                        <div class="date">2015 - 2019</div>
                        <p style="margin-top: 10px; font-size: 0.9em;">GPA: 3.8/4.0</p>
                    </div>
                </section>

                <section class="section">
                    <h2>Languages</h2>
                    <div style="margin-bottom: 10px;">
                        <strong>English:</strong> Native
                    </div>
                    <div style="margin-bottom: 10px;">
                        <strong>Spanish:</strong> Conversational
                    </div>
                    <div style="margin-bottom: 10px;">
                        <strong>French:</strong> Basic
                    </div>
                </section>
            </div>

            <div class="right-column">
                <section class="section">
                    <h2>Professional Summary</h2>
                    <p>Experienced software engineer with 5+ years developing scalable web applications. Passionate about clean code, user experience, and mentoring junior developers. Proven track record of leading teams and delivering high-impact projects.</p>
                </section>

                <section class="section">
                    <h2>Experience</h2>
                    <div class="job">
                        <div class="job-title">Senior Software Engineer</div>
                        <div class="company">TechCorp Inc. | <span class="date">January 2022 - Present</span></div>
                        <ul>
                            <li>Led development of microservices architecture serving 1M+ users</li>
                            <li>Mentored junior developers and conducted code reviews</li>
                            <li>Implemented CI/CD pipelines reducing deployment time by 60%</li>
                            <li>Designed and built real-time analytics dashboard using React and WebSocket</li>
                        </ul>
                    </div>
                    <div class="job">
                        <div class="job-title">Software Engineer</div>
                        <div class="company">StartupXYZ | <span class="date">June 2019 - December 2021</span></div>
                        <ul>
                            <li>Built responsive web applications using React and Node.js</li>
                            <li>Collaborated with design team to improve user experience</li>
                            <li>Optimized database queries improving performance by 40%</li>
                            <li>Integrated payment systems and third-party APIs</li>
                        </ul>
                    </div>
                </section>

                <section class="section">
                    <h2>Projects</h2>
                    <div class="job">
                        <div class="job-title">E-commerce Platform</div>
                        <div class="date">2023</div>
                        <p>Built full-stack e-commerce solution with payment integration. Technologies: React, Node.js, Stripe API, PostgreSQL. Served 10,000+ daily active users.</p>
                    </div>
                    <div class="job">
                        <div class="job-title">Task Management App</div>
                        <div class="date">2022</div>
                        <p>Developed collaborative task management application with real-time sync. Technologies: Vue.js, Firebase, PWA. Featured offline capabilities.</p>
                    </div>
                </section>
            </div>
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
  const navigate = useNavigate();
  const [html, setHtml] = useState(defaultHtml);
  const [activeTab, setActiveTab] = useState("editor");
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  HTML Resume Editor
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Create interactive resumes with HTML, CSS, and JavaScript
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2 bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/markdown")}
                className="gap-2 bg-white hover:bg-gray-50"
              >
                <FileText className="h-4 w-4" />
                Switch to Markdown
              </Button>
              <HtmlPrintPreview html={html} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[calc(100vh-200px)]">
          {/* Left Panel - HTML Editor */}
          <Card className="shadow-xl border-0 bg-white overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  HTML Editor
                </h2>
                <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                  CSS & JS Support
                </Badge>
              </div>
            </div>
            <div className="flex-1 p-6 pt-0">
              <Textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                className="min-h-[600px] font-mono text-sm resize-none"
                placeholder="Enter your HTML content with embedded CSS and JavaScript..."
              />
            </div>
          </Card>

          {/* Right Panel - Preview */}
          <Card className="shadow-xl border-0 bg-white overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Live Preview
                  </h2>
                </div>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  Interactive & PDF-ready
                </Badge>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
              <div className="w-full h-full">
                <HtmlPreview ref={previewRef} html={html} key={html.length} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HtmlEditor;
