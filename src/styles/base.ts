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
  --resume-bullet-size: 1.7em;      /* Larger size for better visibility */
  --resume-bullet-offset: -0.15em;    /* Adjusted for larger bullet alignment */

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

/* Two-column layout for live preview */
.resume-two-column-layout .resume-columns {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0.5in;
  align-items: start;
}

.resume-two-column-layout .resume-column-left,
.resume-two-column-layout .resume-column-right {
  width: 100%;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

/* Remove unwanted border from header in two-column layout */
.resume-two-column-layout .resume-header .resume-heading-1 {
  border-bottom: none;
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

.resume-heading-1 strong, .resume-template h1 strong,
.resume-heading-2 strong, .resume-template h2 strong,
.resume-heading-3 strong, .resume-template h3 strong,
.resume-heading-4 strong, .resume-template h4 strong {
  font-family: inherit !important;
  font-weight: bold; /* Ensures consistent bolding */
}

.resume-heading-1 em, .resume-template h1 em,
.resume-heading-1 i, .resume-template h1 i,
.resume-heading-2 em, .resume-template h2 em,
.resume-heading-2 i, .resume-template h2 i,
.resume-heading-3 em, .resume-template h3 em,
.resume-heading-3 i, .resume-template h3 i,
.resume-heading-4 em, .resume-template h4 em,
.resume-heading-4 i, .resume-template h4 i {
  font-family: inherit !important;
  font-style: italic; /* Ensures consistent italics */
  color: inherit; /* Ensures color is inherited from heading */
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
  padding-left: 1.5rem;  /* Increased padding for more space between bullets and text */
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
  left: -1.5rem;  /* Adjusted position for increased padding */
  font-size: var(--resume-bullet-size);  /* Using variable */
  font-weight: normal;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;  /* Force consistent font for bullets */
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
  padding-left: 1.5rem;  /* Increased padding to match list items */
}

.resume-table-bullet-item::before {
  content: "•";
  position: absolute;
  left: 0;
  font-size: var(--resume-bullet-size);  /* Using variable */
  font-weight: normal;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;  /* Force consistent font for bullets */
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

/* TWO-COLUMN LAYOUT - APPLIES TO ALL TEMPLATES */
.resume-two-column-layout {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--resume-column-gap, 0.5in); /* Default gap */
  page-break-inside: avoid; /* Prevents breaking inside the column container */
}

.resume-two-column-layout .resume-header {
  width: 100%;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
  border-bottom: none; /* Removed border to fix horizontal line issue */
  flex: 0 0 100%; /* Header spans full width */
  page-break-after: avoid; /* Prevents a page break right after the header */
}

.resume-two-column-layout .resume-column-left {
  flex: var(--resume-left-column-width, 1); /* Default width ratio */
  padding-right: 0.25in;
}

.resume-two-column-layout .resume-column-right {
  flex: var(--resume-right-column-width, 2);
  padding-left: 0.25in;
}

/* Clear floats and ensure proper layout flow in two-column setup */
.resume-two-column-layout .resume-section {
  clear: both;
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
}

.resume-two-column-layout .resume-contact-info {
  margin-top: var(--resume-contact-spacing);
  margin-bottom: var(--resume-contact-spacing);
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
  border-bottom: none; /* Removed border to fix horizontal line issue */
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
