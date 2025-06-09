// Single source of truth for all resume template styles
// This file is used by: Live Preview, PDF Export, and CSS Editor

export const baseResumeStyles = `
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: white;
  color: #374151;
  line-height: 1.5;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Resume template base */
.resume-template {
  width: 8.5in;
  min-height: 11in;
  margin: 0 auto;
  padding: 0.75in;
  background: white;
  box-shadow: none;
}

/* Base Typography */
.resume-heading-1 { font-size: 2rem; font-weight: bold; color: #000; margin-bottom: 0.5rem; }
.resume-heading-2 { font-size: 1.25rem; font-weight: 600; color: #000; margin-top: 1.5rem; margin-bottom: 0.75rem; }
.resume-heading-3 { font-size: 1.125rem; font-weight: 500; color: #374151; margin-top: 1rem; margin-bottom: 0.5rem; }
.resume-paragraph { margin-bottom: 0.75rem; line-height: 1.5; color: #374151; }
.resume-strong { font-weight: 600; color: #000; }
.resume-emphasis { font-style: italic; color: #374151; }
.resume-link { color: #374151; text-decoration: underline; }
.resume-hr { border: 0; border-top: 1px solid #d1d5db; margin: 1rem 0; }
.resume-code { background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875rem; font-family: monospace; }

/* Base Lists */
.resume-list {
  list-style: none;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  margin-left: 1rem;
}

.resume-list-item {
  margin-bottom: 0.5rem;
  position: relative;
  padding-left: 0.8rem;
  text-indent: -0.8rem;
}

.resume-list-item::before {
  content: "• " !important;
  color: #000 !important;
  font-weight: bold;
  display: inline-block !important;
  width: 0.5rem;
  margin-right: 0.5rem;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

/* Tables */
.resume-table {
  width: 100%;
  margin-bottom: 1rem;
  border-collapse: collapse;
}

.resume-table-header {
  padding: 0.75rem;
  font-weight: 600;
  text-align: left;
}

.resume-table-cell {
  padding: 0.75rem;
  vertical-align: top;
}

/* Two Column Layout Styles */
.resume-two-column-layout .resume-two-column {
  display: flex;
  flex-direction: column;
}

.resume-two-column-layout .resume-header {
  width: 100%;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
}

.resume-two-column-layout .resume-columns {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
}

.resume-two-column-layout .resume-column-left {
  padding-right: 1rem;
}

.resume-two-column-layout .resume-header .resume-heading-1 {
  font-size: 1.5rem !important;
  text-align: center !important;
}

.resume-two-column-layout .resume-header .resume-paragraph {
  text-align: center !important;
  margin-bottom: 0.5rem !important;
}

/* Two Page Layout Styles */
.resume-two-page-layout .resume-two-page {
  display: flex;
  flex-direction: column;
}

.resume-two-page-layout .resume-page-first {
  width: 100%;
  min-height: 9in;
  background: white;
  padding: 0;
  margin-bottom: 2rem;
  overflow: hidden;
  page-break-after: always;
  border: 1px solid #e5e7eb;
}

.resume-two-page-layout .resume-page-second {
  width: 100%;
  min-height: 9in;
  background: white;
  padding: 0;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}
`;

export const templateStyles = {
  professional: `
/* Professional Template - Balanced and traditional */
.template-professional {
  background: #ffffff;
  color: #333333;
  font-family: 'Lato', sans-serif;
  padding: 2.5rem 3rem 3rem;
  line-height: 1.6;
}

.template-professional .resume-heading-1 {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.4rem;
  font-weight: 600;
  color: #222222;
  margin: 0 0 0.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e0e0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.template-professional .resume-heading-2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #444444;
  margin: 2rem 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  display: inline-block;
}

.template-professional .resume-heading-2::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40px;
  height: 2px;
  background: #888888;
}

.template-professional hr {
  border: none;
  height: 1px;
  background-color: #e0e0e0;
  margin: 1.5rem 0;
}

.template-professional p,
.template-professional li {
  color: #4a4a4a;
  margin: 0.5rem 0;
  font-weight: 400;
}

.template-professional a {
  color: #333333;
  text-decoration: none;
  border-bottom: 1px solid #bbbbbb;
  transition: border-color 0.2s;
}

.template-professional a:hover {
  border-bottom-color: #666666;
}
`,

  modern: `
/* Modern Template - Clean and contemporary */
.template-modern {
  background: #ffffff;
  color: #333333;
  font-family: 'Inter', sans-serif;
  padding: 2.5rem 3rem;
  line-height: 1.6;
  position: relative;
}

.template-modern .resume-heading-1 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 2.25rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  line-height: 1.1;
  position: relative;
}

.template-modern .resume-heading-1::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%) !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  display: block !important;
}

.template-modern .resume-heading-2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #333333;
  margin: 2.5rem 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
  display: inline-block;
  background: #f8f8f8;
  padding: 0.5rem 1rem 0.5rem 1.5rem;
  border-radius: 0 4px 4px 0;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
  border-left: 4px solid #333333;
}

.template-modern p,
.template-modern li {
  color: #4a4a4a;
  margin: 0.5rem 0;
  font-weight: 400;
  font-size: 1.05rem;
  line-height: 1.7;
}

.template-modern a {
  color: #333333;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
  border-bottom: 1px solid #dddddd;
  padding-bottom: 1px;
}

.template-modern a:hover {
  opacity: 0.8;
  border-bottom-color: #999999;
}

.template-modern ul,
.template-modern ol {
  padding-left: 1.5rem;
}

.template-modern li {
  margin-bottom: 0.5rem;
}

/* Hide HR in modern template */
.template-modern hr {
  display: none;
}
`,

  minimalist: `
/* Minimalist Template - Maximum whitespace, minimum fuss */
.template-minimalist {
  background: #ffffff;
  color: #333333;
  font-family: 'Source Sans Pro', sans-serif;
  padding: 3rem 3.5rem;
  line-height: 1.7;
}

.template-minimalist .resume-heading-1 {
  font-size: 2.2rem;
  font-weight: 300;
  color: #222222;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e5e5;
  letter-spacing: -0.5px;
}

.template-minimalist .resume-heading-2 {
  font-size: 1.1rem;
  font-weight: 400;
  color: #666666;
  margin: 2.5rem 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
}

.template-minimalist hr {
  border: none;
  height: 1px;
  background-color: #f0f0f0;
  margin: 2rem 0;
}

.template-minimalist p,
.template-minimalist li {
  color: #555555;
  margin: 0.25rem 0;
  font-weight: 300;
  font-size: 1.05rem;
}

.template-minimalist a {
  color: #555555;
  text-decoration: none;
  border-bottom: 1px solid #dddddd;
  transition: border-color 0.2s;
}

.template-minimalist a:hover {
  border-bottom-color: #999999;
}
`,

  creative: `
/* Creative Template - Modern and clean */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.template-creative {
  background: white;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  padding: 0.75rem 2.5rem 2.5rem 6rem;
  position: relative;
  border-left: none !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.template-creative::before {
  content: "" !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 8px !important;
  height: 100% !important;
  background-color: #000 !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.template-creative .resume-heading-1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 1rem;
  padding-left: 0;
  position: relative;
}

.template-creative .resume-heading-1::after {
  content: "";
  position: absolute;
  bottom: -0.25rem;
  left: 0;
  width: 80%;
  height: 2px;
  background: linear-gradient(to right, #000, #6b7280, transparent) !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.template-creative .resume-heading-2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #000;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-left: 1.5rem;
  position: relative;
  display: flex !important;
  align-items: center !important;
}

.template-creative .resume-heading-2::before {
  content: "■" !important;
  position: absolute;
  left: 0;
  color: #000 !important;
  font-size: 0.7rem;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.template-creative p,
.template-creative li {
  color: #4a4a4a;
  margin: 0.5rem 0 !important;
  font-weight: 400;
  padding: 0 !important;
  font-size: 1rem;
  line-height: 1.6;
  display: block;
}

.template-creative ul,
.template-creative ol {
  margin: 0.5rem 0 !important;
  padding-left: 1.5rem !important;
  margin-left: 0.5rem;
}

.template-creative li {
  position: relative;
  padding-left: 0 !important;
  margin-left: 0;
}

.template-creative a {
  color: #333333;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid #dddddd;
  transition: all 0.2s ease;
  padding-bottom: 1px;
}

.template-creative a:hover {
  border-bottom-color: #999999;
}

/* Hide HR in creative template */
.template-creative hr {
  display: none;
}
`,

  executive: `
/* Executive Template - Classic and authoritative */
.template-executive {
  background: #ffffff;
  color: #333333;
  font-family: 'Lato', sans-serif;
  padding: 2.5rem 3.5rem 3.5rem;
  line-height: 1.7;
}

.template-executive .resume-heading-1 {
  font-family: 'Playfair Display', serif;
  font-size: 2.6rem;
  font-weight: 700;
  color: #111111;
  margin: 0 0 1.5rem 0;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.template-executive .resume-heading-2 {
  font-family: 'Lato', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333333;
  margin: 2rem 0 1rem 0;
  padding: 0.25rem 0 0.25rem 0.5rem;
  border-left: 3px solid #333333;
  border-bottom: 3px solid #333333;
  display: block;
  clear: both;
  line-height: 1.4;
  background-color: #f8f9fa !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.template-executive p,
.template-executive li {
  color: #555555;
  margin: 0.5rem 0;
  font-weight: 400;
  font-size: 1.05rem;
  line-height: 1.7;
}

.template-executive a {
  color: #333333;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
  border-bottom: 1px solid #dddddd;
  padding-bottom: 1px;
}

.template-executive a:hover {
  border-bottom-color: #999999;
}

.template-executive ul,
.template-executive ol {
  padding-left: 1.5rem;
}

.template-executive li {
  margin-bottom: 0.5rem;
}

/* Hide HR in executive template */
.template-executive hr {
  display: none;
}
`
};

export const printStyles = `
/* Print styles for all templates */
@media print {
  @page {
    size: A4;
    margin: 0.75in 0.5in 0.75in 0.5in;
    @top-left { content: ""; }
    @top-center { content: ""; }
    @top-right { content: ""; }
    @bottom-left { content: ""; }
    @bottom-center { content: ""; }
    @bottom-right { content: ""; }
  }

  @page :first {
    margin: 0.75in 0.5in 0.75in 0.5in;
    @top-left { content: ""; }
    @top-center { content: ""; }
    @top-right { content: ""; }
    @bottom-left { content: ""; }
    @bottom-center { content: ""; }
    @bottom-right { content: ""; }
  }

  body::before,
  body::after {
    display: none !important;
  }

  header, footer, .header, .footer {
    display: none !important;
  }

  body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
  }

  .resume-template {
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    width: 100% !important;
    min-height: auto !important;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
    display: block !important;
  }

  /* Ensure all template-specific styles print correctly */
  .template-modern .resume-heading-1::after {
    background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%) !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    display: block !important;
  }

  .template-creative {
    padding: 0.75rem 2.5rem 2.5rem 6rem !important;
  }

  .template-creative::before {
    background-color: #000 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .template-creative .resume-heading-2::before {
    background-color: #333333 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .template-executive .resume-heading-2 {
    background-color: #f8f9fa !important;
    border-left: 3px solid #333333 !important;
    border-bottom: 3px solid #333333 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
`;

// Function to get all styles for a specific template
export const getTemplateStyles = (templateName: string): string => {
  const template = templateStyles[templateName as keyof typeof templateStyles];
  if (!template) {
    console.warn(`Template "${templateName}" not found, using professional as fallback`);
    return templateStyles.professional;
  }
  return template;
};

// Function to get complete CSS for PDF export
export const getCompleteCSS = (templateName?: string): string => {
  const fontImports = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@300;400;600&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Source+Sans+Pro:wght@300;400;600&display=swap');
  `;

  let css = fontImports + baseResumeStyles;

  if (templateName) {
    css += getTemplateStyles(templateName);
  } else {
    // Include all templates
    css += Object.values(templateStyles).join('\n');
  }

  css += printStyles;

  return css;
};
