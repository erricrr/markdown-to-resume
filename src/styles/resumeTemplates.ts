// Single source of truth for all resume template styles
// This file is used by: Live Preview, PDF Export, and CSS Editor

/* -------------------------------------------------------------------------- */
/*  GLOBAL FONT IMPORTS                                                       */
/* -------------------------------------------------------------------------- */
// Centralized Google font import string so it can be reused by any consumer
// (live preview, PDF generation, etc.) without duplication.
export const fontImports = `@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Nunito:wght@300;400;600;700&family=Poppins:wght@400;500;600;700;800&family=Merriweather:wght@300;400;700&family=Ubuntu:wght@300;400;500;700&family=Work+Sans:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;600&display=swap');`;

export const baseResumeStyles = `
/* CSS Custom Properties for User Customization - Scoped to Resume Template Only */
.resume-template {
  --resume-font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --resume-font-size: 11pt;
  --resume-line-height: 1.15;
  --resume-margin-top: 0.5in;
  --resume-margin-bottom: 0.5in;
  --resume-margin-left: 0.5in;
  --resume-margin-right: 0.5in;
  --resume-h1-font-size: 28pt;
  --resume-h2-font-size: 14pt;
  --resume-h3-font-size: 12pt;
  --resume-h4-font-size: 11pt;
  --resume-section-spacing: 8pt;
  --resume-summary-spacing: 0;
  --resume-header-spacing: 0.125rem;
  --resume-contact-spacing: 0.2rem;
  /* BULLET SIZING AND ALIGNMENT */
  /* Unified across all templates for DRY maintenance */
  --resume-bullet-size: 1.3em;      /* Slightly larger for better readability */
  --resume-bullet-offset: 0.1em;    /* Fine-tuned vertical alignment */

  /* UNIFIED SPACING VARIABLES FOR CONSISTENCY */
  --resume-margin-top: 0.5in;
  --resume-margin-right: 0.5in;
  --resume-margin-bottom: 0.5in;
  --resume-margin-left: 0.5in;
  --resume-h1-margin-top: 0.5rem;
  --resume-h1-margin-bottom: 0.5rem;
  --resume-h2-margin-top: 0.5rem;
  --resume-h2-margin-bottom: 0.5rem;
  --resume-h3-margin-top: 0.5rem;
  --resume-h3-margin-bottom: 0.25rem;
  --resume-h4-margin-top: 0.5rem;
  --resume-h4-margin-bottom: 0.25rem;
  --resume-p-margin-top: 0;
  --resume-p-margin-bottom: 0.5rem;
  --resume-ul-margin-top: 0;
  --resume-ul-margin-bottom: 0.5rem;

  /* UNIFIED SUMMARY SECTION SPACING FOR TWO-COLUMN LAYOUTS */
  --resume-summary-margin-top: 0;
  --resume-summary-margin-bottom: 0.75rem;
}

/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--resume-font-family);
  background: white;
  color: #374151;
  line-height: var(--resume-line-height);
  font-size: var(--resume-font-size);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Resume template base */
.resume-template {
  /* Default to US Letter (8.5 x 11 inches) */
  width: 8.5in;
  min-height: 11in;
  margin: 0 auto;
  padding: var(--resume-margin-top) var(--resume-margin-right) var(--resume-margin-bottom) var(--resume-margin-left);
  background: white;
  box-shadow: none;
  box-sizing: border-box;
  font-family: var(--resume-font-family);
  font-size: var(--resume-font-size);
  line-height: var(--resume-line-height);

  /* Default page margins if CSS variables aren't set */
  --resume-margin-top: 0.5in;
  --resume-margin-right: 0.5in;
  --resume-margin-bottom: 0.5in;
  --resume-margin-left: 0.5in;
}

/* A4 paper size */
.resume-template.a4-paper {
  /* A4 dimensions: 210 × 297 mm (8.27 × 11.69 inches) */
  width: 8.27in;
  min-height: 11.69in;
}

/* Print-specific styles */
@media print {
  @page {
    margin: 0;
    size: auto;
  }

  /* Force A4 size in print */
  .resume-template.a4-paper {
    width: 8.27in;
    height: auto;
    min-height: 11.69in;
    page-break-after: always;
    break-after: page;
  }

  /* Force US Letter size in print */
  .resume-template:not(.a4-paper) {
    width: 8.5in;
    height: auto;
    min-height: 11in;
    page-break-after: always;
    break-after: page;
  }

  /* Two Page Layout Styles for Print */
  .resume-two-page-layout {
    display: block;
    width: 100%;
    height: auto;
    page-break-after: always;
    break-after: page;
  }

  .resume-two-page-layout .resume-page-first,
  .resume-two-page-layout .resume-page-second {
    display: block;
    width: 100%;
    min-height: 11in;
    background: white;
    padding: 0;
    margin: 0;
    page-break-after: always;
    break-after: page;
    overflow: visible;
  }

  /* Ensure the second page starts on a new page */
  .resume-two-page-layout .resume-page-first {
    page-break-after: always;
    break-after: page;
  }

  .resume-two-page-layout .resume-page-second {
    page-break-before: always;
    break-before: page;
  }
}

/* UNIFIED TYPOGRAPHY WITH CONSISTENT SPACING - DRY APPROACH */
/* These rules apply to ALL templates and override template-specific inconsistencies */

.resume-heading-1,
.resume-template h1 {
  font-size: var(--resume-h1-font-size);
  font-weight: bold;
  color: #000;
  margin-top: var(--resume-h1-margin-top);
  margin-bottom: var(--resume-h1-margin-bottom);
  font-family: var(--resume-font-family);
  line-height: 1.1;
}

.resume-heading-2,
.resume-template h2 {
  font-size: var(--resume-h2-font-size);
  font-weight: 600;
  color: #000;
  margin-top: var(--resume-h2-margin-top);
  margin-bottom: var(--resume-h2-margin-bottom);
  font-family: var(--resume-font-family);
}

.resume-heading-3,
.resume-template h3 {
  font-size: var(--resume-h3-font-size);
  font-weight: 500;
  color: #374151;
  margin-top: var(--resume-h3-margin-top);
  margin-bottom: var(--resume-h3-margin-bottom);
  font-family: var(--resume-font-family);
  line-height: 1.3;
}

/* Fix for h3 headings in two-column layout */
.resume-subheading-container {
  display: block;
  width: 100%;
  clear: both;
  margin-top: var(--resume-h3-margin-top);
  margin-bottom: var(--resume-h3-margin-bottom);
}

.resume-two-column-layout .resume-column-left .resume-subheading-container,
.resume-two-column-layout .resume-column-right .resume-subheading-container {
  width: 100%;
  clear: both;
  display: block;
}

.resume-heading-4,
.resume-template h4 {
  font-size: var(--resume-h4-font-size);
  font-weight: 500;
  color: #374151;
  margin-top: var(--resume-h4-margin-top);
  margin-bottom: var(--resume-h4-margin-bottom);
  font-family: var(--resume-font-family);
  line-height: 1.3;
}

.resume-paragraph,
.resume-template p {
  margin-top: var(--resume-p-margin-top);
  margin-bottom: var(--resume-p-margin-bottom);
  line-height: var(--resume-line-height);
  color: #374151;
  font-family: var(--resume-font-family);
}

.resume-list,
.resume-template ul,
.resume-template ol {
  list-style: none;
  padding-left: 1.25rem;  /* Increased padding to accommodate bullets */
  margin-top: var(--resume-ul-margin-top);
  margin-bottom: var(--resume-ul-margin-bottom);
}

.resume-list-item,
.resume-template li {
  position: relative;
  padding-left: 0;
  margin-bottom: 0.5rem;
  line-height: var(--resume-line-height);
  display: block;
  font-family: var(--resume-font-family);
}

.resume-list-item::before,
.resume-template li::before {
  content: "•";
  position: absolute;
  left: -1.25rem;  /* Adjusted position */
  font-size: var(--resume-bullet-size);  /* Using variable */
  font-weight: normal;
  color: inherit;
  line-height: 1.0;
  top: var(--resume-bullet-offset);  /* Using variable for consistent alignment */
  display: inline-block;  /* Ensures proper rendering */
  width: 1em;  /* Fixed width */
  text-align: center;  /* Center the bullet */
}

/* EXCEPTION: Header H1 elements need special spacing for contact info */
.resume-header .resume-heading-1,
.resume-header h1 {
  margin-bottom: var(--resume-header-spacing);
}

/* EXCEPTION: Two-column layout H2 elements need adjusted top margin */
.resume-two-column-layout .resume-column-left > .resume-heading-2:first-child,
.resume-two-column-layout .resume-column-right > .resume-heading-2:first-child,
.resume-two-column-layout .resume-column-left > h2:first-child,
.resume-two-column-layout .resume-column-right > h2:first-child {
  margin-top: 0.5rem;
}

/* FIX: Adjust spacing for templates with background elements in two-column layout */
/* Only adjust spacing - preserve all template-specific styling */
.resume-two-column-layout .template-modern .resume-heading-2,
.resume-two-column-layout .template-modern h2,
.resume-two-column-layout .template-creative .resume-heading-2,
.resume-two-column-layout .template-creative h2,
.resume-two-column-layout .template-executive .resume-heading-2,
.resume-two-column-layout .template-executive h2 {
  margin-top: 1rem;
  overflow: visible;
  /* Don't override display or width - let templates handle their own styling */
}

/* Specific spacing adjustments for first H2 elements in columns */
/* Only adjust spacing - preserve all template-specific styling */
.resume-two-column-layout.template-modern .resume-column-left > .resume-heading-2:first-child,
.resume-two-column-layout.template-modern .resume-column-right > .resume-heading-2:first-child,
.resume-two-column-layout.template-modern .resume-column-left > h2:first-child,
.resume-two-column-layout.template-modern .resume-column-right > h2:first-child,
.resume-two-column-layout.template-creative .resume-column-left > .resume-heading-2:first-child,
.resume-two-column-layout.template-creative .resume-column-right > .resume-heading-2:first-child,
.resume-two-column-layout.template-creative .resume-column-left > h2:first-child,
.resume-two-column-layout.template-creative .resume-column-right > h2:first-child,
.resume-two-column-layout.template-executive .resume-column-left > .resume-heading-2:first-child,
.resume-two-column-layout.template-executive .resume-column-right > .resume-heading-2:first-child,
.resume-two-column-layout.template-executive .resume-column-left > h2:first-child,
.resume-two-column-layout.template-executive .resume-column-right > h2:first-child {
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  /* Don't override display properties - let templates handle their own styling */
}

/* UNIFIED SUMMARY SECTION SPACING - DRY SOLUTION FOR ALL TEMPLATES */
/* This single rule replaces all scattered summary-related spacing rules */
.resume-two-column-layout .resume-summary-section {
  margin-top: var(--resume-summary-margin-top);
  margin-bottom: var(--resume-summary-margin-bottom);
  padding: 0;
  line-height: 1.2;
  text-align: left;
  page-break-after: avoid;
  break-after: avoid;
}

/* Reset all summary content to use unified spacing */
.resume-two-column-layout .resume-summary-section *,
.resume-two-column-layout .resume-summary-section p,
.resume-two-column-layout .resume-summary-section div,
.resume-two-column-layout .resume-summary-section span {
  margin: 0;
  padding: 0;
  text-align: left;
}

.resume-strong { font-weight: 600; color: #000; }
.resume-emphasis { font-style: italic; color: #374151; text-align: left; }
.resume-link {
  color: #374151;
  text-decoration: underline;
  cursor: pointer;
  pointer-events: auto !important;
}
.resume-hr { border: 0; border-top: 1px solid #d1d5db; margin: 1rem 0; }
.resume-code { background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875rem; font-family: monospace; }

/* Professional Header and Contact Styling */
.resume-header {
  margin-bottom: var(--resume-header-spacing);
  text-align: center;
}
.resume-header h1 {
  margin-bottom: var(--resume-header-spacing);
}
.resume-contact-info {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--resume-contact-spacing);
  margin-bottom: var(--resume-contact-spacing);
  font-size: 11pt;
  line-height: 1.2;
  align-items: baseline;
}
.resume-contact-item {
  white-space: nowrap;
}
.resume-contact-separator {
  color: #666;
  margin: 0 0.125rem;
  vertical-align: baseline;
  line-height: inherit;
}

/* Control spacing for BR and NBSP elements */
.resume-br, br {
  line-height: 0.25;
  margin: 0;
  padding: 0;
  display: block;
  height: 0.25rem;
}

/* Reduce excessive spacing from non-breaking spaces */
.resume-template {
  word-spacing: normal;
  letter-spacing: normal;
}

/* Tables - minimal spacing for hidden table layouts */
.resume-table {
  width: 100%;
  margin-bottom: 1rem;
  border-collapse: collapse;
}

.resume-table-header {
  padding: 0.125rem 0.25rem;
  font-weight: 600;
  text-align: left;
}

.resume-table-cell {
  padding: 0.125rem 0.25rem;
  vertical-align: top;
}

/* Style for table-based bullet points */
.resume-table-bullet-item {
  position: relative;
  padding-left: 1.25rem;  /* Increased padding to match list items */
}

.resume-table-bullet-item::before {
  content: "•";
  position: absolute;
  left: 0;
  font-size: var(--resume-bullet-size);  /* Using variable */
  font-weight: normal;
  color: inherit;
  line-height: 1.0;
  top: var(--resume-bullet-offset);  /* Using variable for consistent alignment */
  display: inline-block;  /* Ensures proper rendering */
  width: 1em;  /* Fixed width */
  text-align: center;  /* Center the bullet */
}

/* Section spacing - add 8pt breathing room between sections */
.resume-heading-2 {
  margin-bottom: var(--resume-section-spacing);
}

/* Ensure consistent spacing after each main section */
.resume-heading-2 + * {
  margin-top: 0.5rem;
}

/* Add breathing room after section content */
.resume-heading-2 ~ *:last-child {
  margin-bottom: var(--resume-section-spacing);
}

/* Two Column Layout Styles */
.resume-two-column-layout .resume-two-column {
  display: flex;
  flex-direction: column;
}

.resume-two-column-layout .resume-header {
  width: 100%;
  margin-bottom: var(--resume-contact-spacing);
  padding-bottom: 0;
  /* Don't force text-align here - let templates decide */
}

.resume-two-column-layout .resume-columns {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  margin-top: 0.125rem; /* REDUCED spacing from summary */
}

.resume-two-column-layout .resume-column-left {
  padding-right: 1rem;
}

.resume-two-column-layout .resume-header .resume-heading-1 {
  font-size: var(--resume-h1-font-size);
  margin-bottom: var(--resume-contact-spacing);
  /* Remove forced centering - let templates decide alignment */
}

.resume-two-column-layout .resume-header .resume-paragraph {
  margin-top: var(--resume-contact-spacing);
  margin-bottom: var(--resume-contact-spacing);
  font-size: 11pt;
  line-height: 1.2;
  /* Remove forced centering for contact info - let templates decide */
}

.resume-two-column-layout .resume-contact-info {
  margin-top: var(--resume-contact-spacing);
  margin-bottom: var(--resume-contact-spacing);
  /* Remove forced centering - let templates decide */
}

/* Note: Summary spacing now handled by unified rule above */

/* Remove all spacing around columns container */
.resume-two-column-layout .resume-columns {
  margin: 0;
  padding: 0;
  page-break-before: avoid;
  break-before: avoid;
}

/* TEMPLATE-SPECIFIC HEADER ALIGNMENT FOR TWO-COLUMN LAYOUTS */

/* Professional & Modern & Creative Templates: Centered headers */
.resume-two-column-layout.template-professional .resume-header,
.resume-two-column-layout.template-modern .resume-header,
.resume-two-column-layout.template-creative .resume-header {
  text-align: center;
}

.resume-two-column-layout.template-professional .resume-header .resume-heading-1,
.resume-two-column-layout.template-modern .resume-header .resume-heading-1,
.resume-two-column-layout.template-creative .resume-header .resume-heading-1 {
  text-align: center;
}

.resume-two-column-layout.template-professional .resume-header .resume-paragraph,
.resume-two-column-layout.template-modern .resume-header .resume-paragraph,
.resume-two-column-layout.template-creative .resume-header .resume-paragraph {
  text-align: center;
}

.resume-two-column-layout.template-professional .resume-contact-info,
.resume-two-column-layout.template-modern .resume-contact-info,
.resume-two-column-layout.template-creative .resume-contact-info {
  justify-content: center;
}

/* Professional template: Increase spacing around H1 border line in two-column mode */
.resume-two-column-layout.template-professional .resume-header .resume-heading-1 {
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #888888;
}

/* Note: Template-specific summary spacing now handled by unified rule */

/* Minimalist & Executive Templates: Left-aligned headers */
.resume-two-column-layout.template-minimalist .resume-header,
.resume-two-column-layout.template-executive .resume-header {
  text-align: left;
}

.resume-two-column-layout.template-minimalist .resume-header .resume-heading-1,
.resume-two-column-layout.template-executive .resume-header .resume-heading-1 {
  text-align: left;
}

.resume-two-column-layout.template-minimalist .resume-header .resume-paragraph,
.resume-two-column-layout.template-executive .resume-header .resume-paragraph {
  text-align: left;
}

.resume-two-column-layout.template-minimalist .resume-contact-info,
.resume-two-column-layout.template-executive .resume-contact-info {
  justify-content: flex-start;
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
  break-after: page;
  border: 1px solid #e5e7eb;
}

.resume-two-page-layout .resume-page-second {
  width: 100%;
  min-height: 9in;
  background: white;
  padding: 0;
  overflow: hidden;
  page-break-before: always;
  break-before: page;
  border: 1px solid #e5e7eb;
}
`;

export const templateStyles = {
  professional: `
/* Professional Template - Balanced and traditional */
.template-professional {
  background: #ffffff;
  color: #333333;
  font-family: 'Roboto', sans-serif;
  line-height: var(--resume-line-height);
}

/* Professional template styling - spacing handled by unified system */
.template-professional .resume-heading-1,
.template-professional h1 {
  font-family: 'Raleway', sans-serif;
  font-weight: 600;
  color: #222222;
  padding-bottom: var(--resume-header-spacing);
  border-bottom: 2px solid #888888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.template-professional .resume-heading-2,
.template-professional h2 {
  font-family: 'Raleway', sans-serif;
  font-weight: 600;
  color: #444444;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  display: inline-block;
}

.template-professional .resume-heading-2::after,
.template-professional h2::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40px;
  height: 2px;
  background: #888888;
}

.template-professional .resume-heading-3,
.template-professional h3 {
  font-family: 'Raleway', sans-serif;
  color: #444444;
}

.template-professional .resume-heading-4,
.template-professional h4 {
  font-family: 'Raleway', sans-serif;
  color: #444444;
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
  font-weight: 400;
}

.template-professional a {
  color: #333333;
  text-decoration: none;
  border-bottom: 1px solid #bbbbbb;
  transition: border-color 0.2s;
  cursor: pointer;
  pointer-events: auto !important;
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
  font-family: 'Poppins', sans-serif;
  line-height: var(--resume-line-height);
  position: relative;
}

/* Modern template styling - spacing handled by unified system */
.template-modern .resume-heading-1,
.template-modern h1 {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 600;
  color: #000;
  padding-bottom: 0.25rem;
  letter-spacing: -0.02em;
  position: relative;
}

.template-modern .resume-heading-1::after,
.template-modern h1::after {
  content: '';
  position: absolute;
  bottom: -0.25rem;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  display: block;
}

.template-modern .resume-heading-2,
.template-modern h2 {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
  padding-left: 1rem;
  background: linear-gradient(90deg, rgba(107, 114, 128, 0.1), transparent);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-left: none;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  /* Ensure proper spacing in two-column layout */
  margin-top: var(--resume-h2-margin-top);
  box-sizing: border-box;
}

.template-modern .resume-heading-2::before,
.template-modern h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  display: block;
}

.template-modern .resume-heading-3,
.template-modern h3 {
  font-family: 'Poppins', sans-serif;
  color: #000;
}

.template-modern .resume-heading-4,
.template-modern h4 {
  font-family: 'Poppins', sans-serif;
  color: #000;
}

.template-modern p,
.template-modern li {
  color: #4a4a4a;
  font-weight: 400;
}

.template-modern a {
  color: #333333;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
  border-bottom: 1px solid #dddddd;
  padding-bottom: 1px;
  cursor: pointer;
  pointer-events: auto !important;
}

.template-modern a:hover {
  opacity: 0.8;
  border-bottom-color: #999999;
}

.template-modern ul,
.template-modern ol {
  padding-left: 1.25rem; /* Match the unified bullet point padding */
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
  font-family: 'Nunito', sans-serif;
  line-height: var(--resume-line-height);
}

/* Minimalist template styling - spacing handled by unified system */
.template-minimalist .resume-heading-1,
.template-minimalist h1 {
  font-family: 'Nunito', sans-serif;
  font-weight: 300;
  color: #222222;
  padding-bottom: var(--resume-header-spacing);
  border-bottom: 1px solid #e5e5e5;
  letter-spacing: -0.5px;
}

.template-minimalist .resume-heading-2,
.template-minimalist h2 {
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.template-minimalist .resume-heading-3,
.template-minimalist h3 {
  font-family: 'Nunito', sans-serif;
  color: #666666;
}

.template-minimalist .resume-heading-4,
.template-minimalist h4 {
  font-family: 'Nunito', sans-serif;
  color: #666666;
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
  font-weight: 300;
}

.template-minimalist a {
  color: #555555;
  text-decoration: none;
  border-bottom: 1px solid #dddddd;
  transition: border-color 0.2s;
  cursor: pointer;
  pointer-events: auto !important;
}

.template-minimalist a:hover {
  border-bottom-color: #999999;
}
`,

  creative: `
/* Creative Template - Modern greyscale design with clean styling */
.template-creative {
  background: white;
  font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Creative template styling - spacing handled by unified system */
.template-creative .resume-heading-1,
.template-creative h1 {
  font-family: 'Work Sans', sans-serif;
  font-weight: 800;
  color: #1f2937;
  padding: var(--resume-header-spacing) 0 calc(var(--resume-header-spacing) + 0.25rem) 0;
  text-align: center;
  letter-spacing: -0.5px;
  position: relative;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Decorative line below H1 - REMOVED for cleaner two-column layout */
.template-creative .resume-heading-1::after,
.template-creative h1::after {
  display: none;
}

/* Two-column mode: Clean layout without decorative lines */
.resume-two-column-layout.template-creative .resume-heading-1::after,
.resume-two-column-layout.template-creative h1::after {
  display: none;
}

/* Clean spacing in Creative template two-column header */
.resume-two-column-layout.template-creative .resume-header .resume-heading-1,
.resume-two-column-layout.template-creative .resume-header h1 {
  padding-bottom: var(--resume-header-spacing);
  border-bottom: none; /* Remove any inherited borders */
}

/* Remove any borders from Creative template header elements in two-column mode */
.resume-two-column-layout.template-creative .resume-header,
.resume-two-column-layout.template-creative .resume-header *,
.resume-two-column-layout.template-creative .resume-summary-section {
  border: none;
  border-bottom: none;
  border-top: none;
}

/* Section headings with modern accent */
.template-creative .resume-heading-2,
.template-creative h2 {
  font-family: 'Work Sans', sans-serif;
  font-weight: 700;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
  display: inline-block;
  background: #f8f8f8;
  padding: 0.5rem 1rem 0.5rem 1.5rem;
  border-radius: 0 4px 4px 0;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
  border-left: 4px solid #1f2937;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  /* Ensure proper spacing in two-column layout */
  margin-top: var(--resume-h2-margin-top);
  box-sizing: border-box;
}

.template-creative .resume-heading-3,
.template-creative h3 {
  font-family: 'Work Sans', sans-serif;
  color: #1f2937;
}

.template-creative .resume-heading-4,
.template-creative h4 {
  font-family: 'Work Sans', sans-serif;
  color: #1f2937;
}

/* Content styling */
.template-creative p,
.template-creative li {
  color: #374151;
  font-weight: 400;
  display: block;
}

/* Enhanced list styling */
.template-creative ul,
.template-creative ol {
  padding-left: 1.25rem; /* Match the unified bullet point padding */
}

/* Links with accent styling */
.template-creative a {
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  padding-bottom: 1px;
  cursor: pointer;
  pointer-events: auto !important;
}

.template-creative a:hover {
  border-bottom-color: #6b7280;
}

/* Subtle contact info styling - REMOVED border for cleaner layout */
.template-creative .resume-paragraph:first-of-type {
  text-align: center;
  color: #6b7280;
  padding-bottom: 0;
  /* border-bottom removed for cleaner two-column header */
}

/* Hide HR in creative template */
.template-creative hr {
  display: none;
}

/* Two-column specific adjustments - REMOVED CONFLICTING OVERRIDE */
/* The Creative template now properly inherits two-column alignment from template-specific rules */

/* Ensure consistent bullet rendering across all templates */
.template-professional li::before,
.template-modern li::before,
.template-minimalist li::before,
.template-creative li::before,
.template-executive li::before {
  font-size: var(--resume-bullet-size);
  top: var(--resume-bullet-offset);
  display: inline-block;
  width: 1em;
  text-align: center;
}

/* Ensure print styles maintain bullet point consistency */
@media print {
  /* Ensure bullet points match template size */
  .resume-list-item::before,
  .resume-template li::before {
    font-size: var(--resume-bullet-size);
    font-weight: normal;
    color: inherit;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    display: inline-block;
    width: 1em;
    text-align: center;
    top: var(--resume-bullet-offset);
  }

  /* Also ensure table bullet items are consistent */
  .resume-table-bullet-item::before {
    font-size: var(--resume-bullet-size);
    font-weight: normal;
    color: inherit;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    display: inline-block;
    width: 1em;
    text-align: center;
    top: var(--resume-bullet-offset);
  }
}
`,

  executive: `
/* Executive Template - Classic and authoritative */
.template-executive {
  background: #ffffff;
  color: #333333;
  font-family: 'Ubuntu', sans-serif;
  line-height: var(--resume-line-height);
}

/* Executive template styling - spacing handled by unified system */
.template-executive .resume-heading-1,
.template-executive h1 {
  font-family: 'Merriweather', serif;
  font-weight: 700;
  color: #111111;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: var(--resume-header-spacing);
  border-bottom: 3px solid #333333;
}

.template-executive .resume-heading-2,
.template-executive h2 {
  font-family: 'Merriweather', serif;
  font-weight: 600;
  color: #333333;
  padding: 0.25rem 0 0.25rem 0.5rem;
  border-left: 3px solid #333333;
  border-bottom: 3px solid #333333;
  display: block;
  clear: both;
  line-height: 1.4;
  background-color: #f8f9fa;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  /* Ensure proper spacing in two-column layout */
  margin-top: var(--resume-h2-margin-top);
  box-sizing: border-box;
}

.template-executive .resume-heading-3,
.template-executive h3 {
  font-family: 'Merriweather', serif;
  font-weight: 600;
  color: #444444;
}

.template-executive .resume-heading-4,
.template-executive h4 {
  font-family: 'Merriweather', serif;
  font-weight: 600;
  color: #444444;
}

.template-executive p,
.template-executive li {
  color: #555555;
  font-weight: 400;
  font-family: 'Ubuntu', sans-serif;
}

.template-executive a {
  font-family: 'Ubuntu', sans-serif;
  color: #333333;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
  border-bottom: 1px solid #dddddd;
  padding-bottom: 1px;
  cursor: pointer;
  pointer-events: auto !important;
}

.template-executive a:hover {
  border-bottom-color: #999999;
}

.template-executive ul,
.template-executive ol {
  padding-left: 1.25rem; /* Match the unified bullet point padding */
  font-family: 'Ubuntu', sans-serif;
}

.template-executive li {
  font-family: 'Ubuntu', sans-serif;
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
    margin: 0;
    @top-left { content: ""; }
    @top-center { content: ""; }
    @top-right { content: ""; }
    @bottom-left { content: ""; }
    @bottom-center { content: ""; }
    @bottom-right { content: ""; }
  }

  @page :first {
    margin: 0;
    @top-left { content: ""; }
    @top-center { content: ""; }
    @top-right { content: ""; }
    @bottom-left { content: ""; }
    @bottom-center { content: ""; }
    @bottom-right { content: ""; }
  }

  body::before,
  body::after {
    display: none;
  }

  header, footer, .header, .footer {
    display: none;
  }

  body {
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color-adjust: exact;
  }

  .resume-template {
    padding: var(--resume-margin-top) var(--resume-margin-right) var(--resume-margin-bottom) var(--resume-margin-left);
    width: 8.5in;
    min-height: 11in;
    box-sizing: border-box;
    margin: 0;
    background: white;
    box-shadow: none;
    font-family: var(--resume-font-family);
    font-size: var(--resume-font-size);
    line-height: var(--resume-line-height);
  }

  /* UNIFIED SUMMARY SPACING IN PDF - MATCHES LIVE PREVIEW */
  .resume-two-column-layout .resume-summary-section {
    margin-top: var(--resume-summary-margin-top);
    margin-bottom: var(--resume-summary-margin-bottom);
    padding: 0;
    line-height: 1.2;
    text-align: left;
    page-break-after: avoid;
    break-after: avoid;
  }

  .resume-two-column-layout .resume-summary-section *,
  .resume-two-column-layout .resume-summary-section p,
  .resume-two-column-layout .resume-summary-section div,
  .resume-two-column-layout .resume-summary-section span {
    margin: 0;
    padding: 0;
    text-align: left;
  }

  /* Remove all spacing around columns container */
  .resume-two-column-layout .resume-columns {
    margin: 0;
    padding: 0;
    page-break-before: avoid;
    break-before: avoid;
  }

  /* Enhanced summary spacing control for two-column layouts */
  .resume-two-column-layout .resume-columns > *:first-child,
  .resume-two-column-layout .resume-column-left > *:first-child,
  .resume-two-column-layout .resume-column-left .resume-heading-2:first-child,
  .resume-two-column-layout .resume-columns .resume-heading-2:first-child {
    margin-top: 0;
    padding-top: 0;
  }

  /* Two-page specific styling for margins */
  .resume-two-page-layout .resume-page-first,
  .resume-two-page-layout .resume-page-second {
    padding: var(--resume-margin-top) var(--resume-margin-right) var(--resume-margin-bottom) var(--resume-margin-left);
    box-sizing: border-box;
  }

  .resume-two-page-layout .resume-page-first {
    page-break-after: always;
    margin-bottom: 0;
  }

  .resume-two-page-layout .resume-page-second {
    margin-top: 0;
    padding-top: var(--resume-margin-top);
  }

  /* Fix for two-column layout */
  .resume-two-column-layout .resume-columns {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 0.5in;
    align-items: start;
  }

  /* Note: Summary spacing now handled by unified rule above */

  /* CRITICAL: Reduce header bottom spacing in two-column layout (print styles) */
  .resume-two-column-layout .resume-header {
    margin-bottom: 0.125in;
    padding-bottom: 0;
  }

  .resume-two-column-layout .resume-header .resume-heading-1 {
    margin-bottom: 0.125in;
    padding-bottom: 0;
  }

  .resume-two-column-layout .resume-header .resume-paragraph {
    margin-bottom: 0;
    padding-bottom: 0;
  }

  /* Note: Summary spacing now handled by unified rule */

  /* CRITICAL: Reduce header bottom spacing in two-column layout */
  .resume-two-column-layout .resume-header .resume-heading-1 {
    margin-bottom: 0.25rem;
    padding-bottom: 0;
  }

  /* Override template-specific H1 margins in two-column mode */
  .resume-two-column-layout.template-professional .resume-heading-1,
  .resume-two-column-layout.template-modern .resume-heading-1,
  .resume-two-column-layout.template-minimalist .resume-heading-1,
  .resume-two-column-layout.template-creative .resume-heading-1,
  .resume-two-column-layout.template-executive .resume-heading-1 {
    margin-bottom: 0.25rem;
    padding: 0;
    page-break-after: avoid;
    break-after: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* ULTRA-AGGRESSIVE PROFESSIONAL TEMPLATE PAGE BREAK FIXES */
  .resume-two-column-layout.template-professional .resume-heading-1::after {
    page-break-after: avoid;
    break-after: avoid;
  }

  /* Force Professional template H1 border to not cause page breaks */
  .resume-two-column-layout.template-professional .resume-heading-1 {
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 0.5rem; /* Increased spacing below H1 */
    margin-bottom: 0.5rem; /* Increased spacing after border line */
    page-break-after: avoid;
    break-after: avoid;
    orphans: 3;
    widows: 3;
  }

  /* Prevent page breaks immediately after Professional H1 */
  .resume-two-column-layout.template-professional .resume-heading-1 + *,
  .resume-two-column-layout.template-professional .resume-header + *,
  .resume-two-column-layout.template-professional .resume-header .resume-heading-1 + * {
    page-break-before: avoid;
    break-before: avoid;
    margin-top: 0;
    padding-top: 0;
  }

  .resume-two-column-layout .resume-header .resume-paragraph {
    margin-bottom: 0;
    padding-bottom: 0;
  }

  /* SELECTIVE PAGE BREAK PREVENTION FOR TWO-COLUMN LAYOUTS */
  .resume-two-column-layout .resume-header,
  .resume-two-column-layout .resume-summary-section,
  .resume-two-column-layout .resume-columns {
    page-break-before: avoid;
    break-before: avoid;
    page-break-after: avoid;
    break-after: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Allow page breaks only at the very end of content */
  .resume-two-column-layout .resume-column-right > *:last-child {
    page-break-after: auto;
    break-after: auto;
  }

  /* ULTRA-COMPACT HEADER FOR TWO-COLUMN LAYOUTS */
  .resume-two-column-layout .resume-header {
    margin: 0;
    padding: 0;
    line-height: 1.1;
    page-break-after: avoid;
    break-after: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Make header content as compact as possible */
  .resume-two-column-layout .resume-header * {
    margin: 0;
    padding: 0;
    line-height: 1.1;
  }

  /* Specific Professional template header fixes */
  .resume-two-column-layout.template-professional .resume-header {
    margin: 0;
    padding: 0;
  }

  .resume-two-column-layout.template-professional .resume-header .resume-heading-1 {
    font-size: var(--resume-h1-font-size);
    line-height: 1.0;
    margin: 0 0 0.5rem 0; /* Increased margin after border line */
    padding: 0 0 0.5rem 0; /* Increased padding below H1 */
    border-bottom: 2px solid #888888; /* Consistent border with live preview */
  }

  /* Uniform summary spacing for two-column layout in print */
  .resume-two-column-layout .resume-summary-section {
    margin-top: var(--resume-summary-spacing);
    margin-bottom: 0.125rem; /* REDUCED spacing before columns in print */
    padding: 0;
    line-height: 1.2;
    font-size: 11pt;
    text-align: left; /* ALWAYS left-align summary in print */
  }

  /* Ensure all summary content is left-aligned in print */
  .resume-two-column-layout .resume-summary-section *,
  .resume-two-column-layout .resume-summary-section p {
    text-align: left;
  }

  /* TEMPLATE-SPECIFIC HEADER ALIGNMENT FOR TWO-COLUMN LAYOUTS IN PRINT */

  /* Professional & Modern & Creative Templates: Centered headers in print */
  .resume-two-column-layout.template-professional .resume-header,
  .resume-two-column-layout.template-modern .resume-header,
  .resume-two-column-layout.template-creative .resume-header {
    text-align: center;
  }

  .resume-two-column-layout.template-professional .resume-header .resume-heading-1,
  .resume-two-column-layout.template-modern .resume-header .resume-heading-1,
  .resume-two-column-layout.template-creative .resume-header .resume-heading-1 {
    text-align: center;
  }

  .resume-two-column-layout.template-professional .resume-header .resume-paragraph,
  .resume-two-column-layout.template-modern .resume-header .resume-paragraph,
  .resume-two-column-layout.template-creative .resume-header .resume-paragraph {
    text-align: center;
  }

    /* Minimalist & Executive Templates: Left-aligned headers in print */
  .resume-two-column-layout.template-minimalist .resume-header,
  .resume-two-column-layout.template-executive .resume-header {
    text-align: left;
  }

  .resume-two-column-layout.template-minimalist .resume-header .resume-heading-1,
  .resume-two-column-layout.template-executive .resume-header .resume-heading-1 {
    text-align: left;
  }

  .resume-two-column-layout.template-minimalist .resume-header .resume-paragraph,
  .resume-two-column-layout.template-executive .resume-header .resume-paragraph {
    text-align: left;
  }

  /* Creative template clean layout for print - no decorative lines */
  .resume-two-column-layout.template-creative .resume-heading-1::after {
    display: none;
  }

  .resume-two-column-layout.template-creative .resume-header .resume-heading-1 {
    padding-bottom: var(--resume-header-spacing);
    margin-bottom: var(--resume-contact-spacing);
    border-bottom: none; /* Remove any inherited borders in print */
  }

  /* Remove any borders from Creative template header elements in print */
  .resume-two-column-layout.template-creative .resume-header,
  .resume-two-column-layout.template-creative .resume-header *,
  .resume-two-column-layout.template-creative .resume-summary-section {
    border: none;
    border-bottom: none;
    border-top: none;
  }

  /* Note: Summary spacing now handled by unified rule */

  /* CRITICAL: Fix for first H2 elements getting cut off at top of columns */
  .resume-two-column-layout .resume-column-left > .resume-heading-2:first-child,
  .resume-two-column-layout .resume-column-right > .resume-heading-2:first-child,
  .resume-two-column-layout .resume-column-left > h2:first-child,
  .resume-two-column-layout .resume-column-right > h2:first-child {
    margin-top: 1rem;
    padding-top: 0.5rem;
    page-break-before: avoid;
    break-before: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Force columns to have top padding to prevent cutoff */
  .resume-two-column-layout .resume-column-left,
  .resume-two-column-layout .resume-column-right {
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }

  /* COMPREHENSIVE TWO-COLUMN LAYOUT FIXES FOR ALL TEMPLATES */

  /* Force two-column grid layout to work in PDF */
  .resume-two-column-layout .resume-columns {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 0.5in;
    align-items: start;
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }

  /* Ensure left and right columns are properly contained */
  .resume-two-column-layout .resume-column-left,
  .resume-two-column-layout .resume-column-right {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    word-wrap: break-word;
    hyphens: auto;
    margin: 0;
    padding: 0;
  }

  /* Professional template specific fixes */
  .resume-two-column-layout.template-professional .resume-heading-2 {
    font-size: var(--resume-h2-font-size);
    margin: 0 0 0.5rem 0;
    padding: 0.25rem 0 0 0;
    border-bottom: none;
    text-transform: uppercase;
    font-weight: 600;
    page-break-after: avoid;
    break-after: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Professional template - first H2 in columns */
  .resume-two-column-layout.template-professional .resume-column-left > .resume-heading-2:first-child,
  .resume-two-column-layout.template-professional .resume-column-right > .resume-heading-2:first-child,
  .resume-two-column-layout.template-professional .resume-column-left > h2:first-child,
  .resume-two-column-layout.template-professional .resume-column-right > h2:first-child {
    margin-top: 1.25rem;
    padding-top: 0.75rem;
  }

  .resume-two-column-layout.template-professional .resume-heading-2::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 30px;
    height: 2px;
    background: #888888;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Modern template specific fixes */
  .resume-two-column-layout.template-modern .resume-heading-2 {
    font-size: var(--resume-h2-font-size);
    margin: 1rem 0 0.75rem 0;
    padding: 0.5rem 0.75rem 0.3rem 1rem;
    background: #f8f8f8;
    border-left: 3px solid #333333;
    border-radius: 0 3px 3px 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    page-break-after: avoid;
    break-after: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Modern template - first H2 in columns */
  .resume-two-column-layout.template-modern .resume-column-left > .resume-heading-2:first-child,
  .resume-two-column-layout.template-modern .resume-column-right > .resume-heading-2:first-child,
  .resume-two-column-layout.template-modern .resume-column-left > h2:first-child,
  .resume-two-column-layout.template-modern .resume-column-right > h2:first-child {
    margin-top: 1.25rem;
    padding-top: 0.75rem;
  }

  /* Minimalist template specific fixes */
  .resume-two-column-layout.template-minimalist .resume-heading-2 {
    font-size: var(--resume-h2-font-size);
    margin: 1rem 0 1rem 0;
    padding: 0.25rem 0 0.25rem 0;
    font-weight: 300;
    border-bottom: 1px solid #ddd;
    page-break-after: avoid;
    break-after: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Minimalist template - first H2 in columns */
  .resume-two-column-layout.template-minimalist .resume-column-left > .resume-heading-2:first-child,
  .resume-two-column-layout.template-minimalist .resume-column-right > .resume-heading-2:first-child,
  .resume-two-column-layout.template-minimalist .resume-column-left > h2:first-child,
  .resume-two-column-layout.template-minimalist .resume-column-right > h2:first-child {
    margin-top: 1.25rem;
    padding-top: 0.75rem;
  }

  /* Creative template specific fixes */
  .resume-two-column-layout.template-creative .resume-heading-2 {
    font-size: var(--resume-h2-font-size);
    margin: 1rem 0 0.75rem 0;
    padding: 0.25rem 0 0 0;
    color: #1f2937;
    font-weight: 600;
    position: relative;
    page-break-after: avoid;
    break-after: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Creative template - first H2 in columns */
  .resume-two-column-layout.template-creative .resume-column-left > .resume-heading-2:first-child,
  .resume-two-column-layout.template-creative .resume-column-right > .resume-heading-2:first-child,
  .resume-two-column-layout.template-creative .resume-column-left > h2:first-child,
  .resume-two-column-layout.template-creative .resume-column-right > h2:first-child {
    margin-top: 1.25rem;
    padding-top: 0.75rem;
  }

  .resume-two-column-layout.template-creative .resume-heading-2::before {
    content: '';
    position: absolute;
    left: -15px;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background: linear-gradient(45deg, #4b5563, #6b7280);
    border-radius: 50%;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Executive template specific fixes */
  .resume-two-column-layout.template-executive .resume-heading-2 {
    font-size: var(--resume-h2-font-size);
    margin: 1rem 0 0.75rem 0;
    padding: 0.25rem 0 0 0;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    page-break-after: avoid;
    break-after: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Executive template - first H2 in columns */
  .resume-two-column-layout.template-executive .resume-column-left > .resume-heading-2:first-child,
  .resume-two-column-layout.template-executive .resume-column-right > .resume-heading-2:first-child,
  .resume-two-column-layout.template-executive .resume-column-left > h2:first-child,
  .resume-two-column-layout.template-executive .resume-column-right > h2:first-child {
    margin-top: 1.25rem;
    padding-top: 0.75rem;
  }

  /* Force all template content to fit within columns */
  .resume-two-column-layout .resume-column-left *,
  .resume-two-column-layout .resume-column-right * {
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }

  /* Prevent column content from overflowing */
  .resume-two-column-layout .resume-column-left {
    overflow: hidden;
  }

  .resume-two-column-layout .resume-column-right {
    overflow: hidden;
  }

  /* Force proper spacing between sections in columns */
  .resume-two-column-layout .resume-column-left > *:not(:last-child),
  .resume-two-column-layout .resume-column-right > *:not(:last-child) {
    margin-bottom: var(--resume-section-spacing);
  }

  /* Ensure lists and paragraphs fit properly in columns */
  .resume-two-column-layout .resume-list,
  .resume-two-column-layout ul,
  .resume-two-column-layout ol {
    margin: 0.5rem 0;
    padding-left: 1.25rem; /* Match the unified bullet point padding */
    max-width: 100%;
  }

  .resume-two-column-layout .resume-list-item,
  .resume-two-column-layout li {
    margin-bottom: 0.25rem;
    line-height: var(--resume-line-height);
    max-width: 100%;
    word-wrap: break-word;
  }

  /* Force proper paragraph spacing in columns */
  .resume-two-column-layout .resume-paragraph,
  .resume-two-column-layout p {
    margin: 0.5rem 0;
    line-height: var(--resume-line-height);
    max-width: 100%;
    word-wrap: break-word;
  }

  /* COMPREHENSIVE FONT AND STYLING CONSISTENCY FOR PDF */

  /* Force identical font rendering in PDF */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color-adjust: exact;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  /* Ensure bullet points match template size */
  .resume-list-item::before,
  .resume-template li::before {
    font-size: var(--resume-bullet-size);
    font-weight: normal;
    color: inherit;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    display: inline-block;
    width: 1em;
    text-align: center;
    top: var(--resume-bullet-offset);
  }

  /* Also ensure table bullet items are consistent */
  .resume-table-bullet-item::before {
    font-size: var(--resume-bullet-size);
    font-weight: normal;
    color: inherit;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    display: inline-block;
    width: 1em;
    text-align: center;
    top: var(--resume-bullet-offset);
  }

  /* Force consistent font sizes across all templates in PDF */
  .resume-template {
    font-family: var(--resume-font-family);
    font-size: var(--resume-font-size);
    line-height: var(--resume-line-height);
  }

  /* UNIFIED SPACING IN PDF - OVERRIDE ANY TEMPLATE INCONSISTENCIES */
  .resume-heading-1,
  .resume-template h1 {
    font-size: var(--resume-h1-font-size);
    font-weight: bold;
    line-height: 1.1;
    margin-top: var(--resume-h1-margin-top);
    margin-bottom: var(--resume-h1-margin-bottom);
  }

  .resume-heading-2,
  .resume-template h2 {
    font-size: var(--resume-h2-font-size);
    font-weight: 600;
    line-height: 1.3;
    margin-top: var(--resume-h2-margin-top);
    margin-bottom: var(--resume-h2-margin-bottom);
  }

  .resume-heading-3,
  .resume-template h3 {
    font-size: var(--resume-h3-font-size);
    font-weight: 500;
    line-height: 1.3;
    margin-top: var(--resume-h3-margin-top);
    margin-bottom: var(--resume-h3-margin-bottom);
  }

  .resume-heading-4,
  .resume-template h4 {
    font-size: var(--resume-h4-font-size);
    font-weight: 500;
    line-height: 1.3;
    margin-top: var(--resume-h4-margin-top);
    margin-bottom: var(--resume-h4-margin-bottom);
  }

  .resume-paragraph,
  .resume-template p {
    font-size: var(--resume-font-size);
    line-height: var(--resume-line-height);
    margin-top: var(--resume-p-margin-top);
    margin-bottom: var(--resume-p-margin-bottom);
  }

  .resume-list,
  .resume-template ul,
  .resume-template ol {
    margin-top: var(--resume-ul-margin-top);
    margin-bottom: var(--resume-ul-margin-bottom);
  }

  .resume-list-item,
  .resume-template li {
    font-size: var(--resume-font-size);
    line-height: var(--resume-line-height);
    margin-bottom: 0.5rem;
  }

  /* EXCEPTION: Header H1 elements need special spacing for contact info in PDF */
  .resume-header .resume-heading-1,
  .resume-header h1 {
    margin-bottom: var(--resume-header-spacing);
  }

  /* EXCEPTION: Two-column layout H2 elements need adjusted top margin in PDF */
  .resume-two-column-layout .resume-column-left > .resume-heading-2:first-child,
  .resume-two-column-layout .resume-column-right > .resume-heading-2:first-child,
  .resume-two-column-layout .resume-column-left > h2:first-child,
  .resume-two-column-layout .resume-column-right > h2:first-child {
    margin-top: 0.5rem;
  }

  /* Control spacing for BR and NBSP elements in PDF */
  .resume-br, br {
    line-height: 0.25;
    margin: 0;
    padding: 0;
    display: block;
    height: 0.25rem;
  }

  /* Reduce excessive spacing from non-breaking spaces in PDF */
  .resume-template {
    word-spacing: normal;
    letter-spacing: normal;
  }

  /* Ensure all links are clickable in print preview */
  .resume-link, a {
    color-adjust: exact;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color: inherit;
    text-decoration: underline;
    cursor: pointer;
    pointer-events: auto !important;
  }
}
`;

/* Add specific styling for two-column executive template */
export const executiveSpecificStyles = `
.resume-two-column-layout.template-executive {
  font-family: 'Ubuntu', sans-serif;
}

.resume-two-column-layout.template-executive .resume-header .resume-heading-1 {
  font-family: 'Merriweather', serif;
  font-weight: 700;
  color: #111111;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #333333;
}

.resume-two-column-layout.template-executive .resume-column-left *,
.resume-two-column-layout.template-executive .resume-column-right * {
  font-family: 'Ubuntu', sans-serif;
}

.resume-two-column-layout.template-executive .resume-heading-2 {
  font-family: 'Merriweather', serif;
  font-weight: 600;
  color: #333333;
}

.resume-two-column-layout.template-executive .resume-strong {
  font-family: 'Ubuntu', sans-serif;
  font-weight: 600;
}
`;

// Function to get all styles for a specific template
export const getTemplateStyles = (templateName: string): string => {
  const template = templateStyles[templateName as keyof typeof templateStyles];
  if (!template) {
    console.warn(`Template "${templateName}" not found, using professional as fallback`);
    return templateStyles.professional;
  }

  // Add executive specific styles for executive template
  if (templateName === 'executive') {
    return template + executiveSpecificStyles;
  }

  return template;
};

// Function to get complete CSS for PDF export
export const getCompleteCSS = (templateName?: string): string => {
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
