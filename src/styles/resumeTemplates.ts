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
  padding: 0.75in 0.5in;
  background: white;
  box-shadow: none;
  box-sizing: border-box;
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

/* DRY APPROACH: AGGRESSIVE summary spacing fixes for ALL two-column layouts */
.resume-two-column-layout .resume-summary-section,
.resume-two-column-layout .resume-summary-section *,
.resume-two-column-layout .resume-heading-summary,
.resume-two-column-layout [class*="summary"],
.resume-two-column-layout .resume-columns > *:first-child,
.resume-two-column-layout .resume-column-left > *:first-child {
  margin: 0 !important;
  padding: 0 !important;
}

/* Force summary to be compact */
.resume-two-column-layout .resume-summary-section {
  margin-bottom: 0.125rem !important;
  padding-bottom: 0 !important;
  line-height: 1.2 !important;
  page-break-after: avoid !important;
  break-after: avoid !important;
}

/* Remove all spacing around columns container */
.resume-two-column-layout .resume-columns {
  margin: 0 !important;
  padding: 0 !important;
  page-break-before: avoid !important;
  break-before: avoid !important;
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
/* Creative Template - Modern greyscale design with clean styling */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.template-creative {
  background: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 0.5in 0.75in;
  position: relative;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

/* Modern greyscale header section */
.template-creative .resume-heading-1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
  padding: 1rem 0;
  text-align: center;
  letter-spacing: -0.5px;
  position: relative;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

/* Add a decorative line below the name */
.template-creative .resume-heading-1::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #4b5563;
  border-radius: 2px;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

/* Section headings with modern accent */
.template-creative .resume-heading-2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
  padding-left: 0;
  border-left: 4px solid #6b7280;
  padding-left: 1rem;
  background: linear-gradient(90deg, rgba(107, 114, 128, 0.1), transparent);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

/* Content styling */
.template-creative p,
.template-creative li {
  color: #374151;
  margin: 0.75rem 0;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.6;
  display: block;
}

/* Enhanced list styling */
.template-creative ul,
.template-creative ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.template-creative li {
  position: relative;
  padding-left: 0;
  margin-bottom: 0.5rem;
}

/* Custom bullet points */
.template-creative .resume-list-item::before {
  content: "▶" !important;
  color: #6b7280 !important;
  font-weight: bold;
  margin-right: 0.5rem;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

/* Links with accent styling */
.template-creative a {
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  padding-bottom: 1px;
}

.template-creative a:hover {
  border-bottom-color: #6b7280;
}

/* Subtle contact info styling */
.template-creative .resume-paragraph:first-of-type {
  text-align: center;
  color: #6b7280;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

/* Hide HR in creative template */
.template-creative hr {
  display: none;
}

/* Two-column specific adjustments */
.template-creative.resume-two-column-layout .resume-heading-1 {
  font-size: 2rem;
  text-align: left;
  padding: 0.5rem 0;
}

.template-creative.resume-two-column-layout .resume-heading-1::after {
  left: 0;
  transform: none;
  width: 40px;
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
    margin: 0.25in 0.75in;
    @top-left { content: ""; }
    @top-center { content: ""; }
    @top-right { content: ""; }
    @bottom-left { content: ""; }
    @bottom-center { content: ""; }
    @bottom-right { content: ""; }
  }

  @page :first {
    margin: 0.25in 0.75in;
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
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  .resume-template {
    padding: 0.25in 0.75in !important;
    width: 8.5in !important;
    min-height: 11in !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    background: white !important;
    box-shadow: none !important;
  }

  /* AGGRESSIVE SUMMARY SPACING FIXES - Override everything */
  .resume-two-column-layout .resume-summary-section,
  .resume-two-column-layout .resume-summary-section *,
  .resume-two-column-layout .resume-heading-summary,
  .resume-two-column-layout [class*="summary"] {
    margin: 0 !important;
    padding: 0 !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-before: avoid !important;
    break-before: avoid !important;
  }

  /* Force summary to be compact */
  .resume-two-column-layout .resume-summary-section {
    margin-bottom: 0.125in !important;
    padding-bottom: 0 !important;
    line-height: 1.2 !important;
  }

  /* Remove all spacing around columns container */
  .resume-two-column-layout .resume-columns {
    margin: 0 !important;
    padding: 0 !important;
    page-break-before: avoid !important;
    break-before: avoid !important;
    page-break-inside: auto !important;
    break-inside: auto !important;
  }

  /* Enhanced summary spacing control for two-column layouts */
  .resume-two-column-layout .resume-columns > *:first-child,
  .resume-two-column-layout .resume-column-left > *:first-child,
  .resume-two-column-layout .resume-column-left .resume-heading-2:first-child,
  .resume-two-column-layout .resume-columns .resume-heading-2:first-child {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  /* Two-page specific styling for margins */
  .resume-two-page-layout .resume-page-first,
  .resume-two-page-layout .resume-page-second {
    padding: 0.25in 0.75in !important;
    box-sizing: border-box !important;
  }

  .resume-two-page-layout .resume-page-first {
    page-break-after: always !important;
    margin-bottom: 0 !important;
  }

  .resume-two-page-layout .resume-page-second {
    margin-top: 0 !important;
    padding-top: 0.25in !important;
  }

  /* Fix for two-column layout */
  .resume-two-column-layout .resume-columns {
    display: grid !important;
    grid-template-columns: 1fr 2fr !important;
    gap: 1in !important;
    align-items: start !important;
  }

  /* ULTRA-AGGRESSIVE FIXES FOR TWO-COLUMN SUMMARY ISSUES */
  .resume-two-column-layout .resume-summary-section + * {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  .resume-two-column-layout .resume-summary-section ~ * {
    page-break-before: avoid !important;
    break-before: avoid !important;
  }

  /* Force everything after summary to stay on same page */
  .resume-two-column-layout .resume-columns,
  .resume-two-column-layout .resume-column-left,
  .resume-two-column-layout .resume-column-right {
    page-break-before: avoid !important;
    break-before: avoid !important;
    page-break-inside: auto !important;
    break-inside: auto !important;
  }

  /* Specific targeting for summary paragraph element */
  .resume-two-column-layout .resume-summary-section p,
  .resume-two-column-layout .resume-summary-section div,
  .resume-two-column-layout .resume-summary-section span {
    margin: 0 !important;
    padding: 0 !important;
    line-height: 1.2 !important;
  }

  /* Override any default spacing on summary content */
  .resume-two-column-layout .resume-summary-section * {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  /* Ensure all custom styles are applied with high specificity */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
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
