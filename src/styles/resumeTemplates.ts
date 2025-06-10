// Single source of truth for all resume template styles
// This file is used by: Live Preview, PDF Export, and CSS Editor

export const baseResumeStyles = `
/* Import Google Fonts for customization */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@300;400;600&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Source+Sans+Pro:wght@300;400;600&family=Roboto:wght@300;400;500;700&family=Georgia:wght@400;700&family=Times+New+Roman:wght@400;700&display=swap');

/* CSS Custom Properties for User Customization - Scoped to Resume Template Only */
.resume-template {
  --resume-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --resume-font-size: 11pt;
  --resume-line-height: 1.15;
  --resume-margin-top: 0.5in;
  --resume-margin-bottom: 0.5in;
  --resume-margin-left: 0.5in;
  --resume-margin-right: 0.5in;
  --resume-h1-font-size: 28pt;
  --resume-h2-font-size: 14pt;
  --resume-h3-font-size: 12pt;
  --resume-section-spacing: 8pt;
  --resume-summary-spacing: 0.75rem;
  --resume-header-spacing: 0.125rem;
  --resume-contact-spacing: 0.375rem; /* Increased spacing between H1 and contact info */
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
  padding: var(--resume-margin-top) var(--resume-margin-right) var(--resume-margin-bottom) var(--resume-margin-left) !important;
  background: white;
  box-shadow: none;
  box-sizing: border-box;
  font-family: var(--resume-font-family);
  font-size: var(--resume-font-size);
  line-height: var(--resume-line-height);
}

/* Base Typography with Professional Spacing */
.resume-heading-1 {
  font-size: var(--resume-h1-font-size);
  font-weight: bold;
  color: #000;
  margin-top: 0;
  margin-bottom: 0.25rem;
  font-family: var(--resume-font-family);
  line-height: 1.1;
}
.resume-heading-2 {
  font-size: var(--resume-h2-font-size);
  font-weight: 600;
  color: #000;
  margin-top: 1.5rem;
  margin-bottom: var(--resume-section-spacing);
  font-family: var(--resume-font-family);
}
.resume-heading-3 {
  font-size: var(--resume-h3-font-size);
  font-weight: 500;
  color: #374151;
  margin-top: 0.75rem;
  margin-bottom: 0.375rem;
  font-family: var(--resume-font-family);
  line-height: 1.3;
}
.resume-paragraph {
  margin-bottom: 0.5rem;
  line-height: var(--resume-line-height);
  color: #374151;
}
.resume-strong { font-weight: 600; color: #000; }
.resume-emphasis { font-style: italic; color: #374151; text-align: left; }
.resume-link { color: #374151; text-decoration: underline; }
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
}
.resume-contact-item {
  white-space: nowrap;
}
.resume-contact-separator {
  color: #666;
  margin: 0 0.125rem;
}

/* Control spacing for BR and NBSP elements */
.resume-br, br {
  line-height: 0.5 !important;
  margin: 0 !important;
  padding: 0 !important;
  display: block !important;
  height: 0.25rem !important;
}

/* Reduce excessive spacing from non-breaking spaces */
.resume-template {
  word-spacing: normal !important;
  letter-spacing: normal !important;
}

/* CLEAN BULLET SYSTEM - Medium sized, single bullet per item */
.resume-list {
  list-style: none;
  padding-left: 1.0rem;
  margin: 0.5rem 0;
}

.resume-list-item {
  position: relative;
  padding-left: 0;
  margin-bottom: 0.5rem;
  line-height: var(--resume-line-height);
  display: block;
}

.resume-list-item::before {
  content: "•";
  position: absolute;
  left: -1.0rem;
  font-size: 1.0em;
  font-weight: normal;
  color: inherit;
  line-height: 1.0;
  top: 0.1em;
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

/* Section spacing - add 8pt breathing room between sections */
.resume-heading-2 {
  margin-bottom: var(--resume-section-spacing);
}

/* Ensure consistent spacing after each main section */
.resume-heading-2 + * {
  margin-top: 0;
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
  font-size: var(--resume-h1-font-size) !important;
  margin-bottom: var(--resume-contact-spacing) !important;
  /* Remove forced centering - let templates decide alignment */
}

.resume-two-column-layout .resume-header .resume-paragraph {
  margin-top: var(--resume-contact-spacing) !important;
  margin-bottom: var(--resume-contact-spacing) !important;
  font-size: 11pt;
  line-height: 1.2;
  /* Remove forced centering for contact info - let templates decide */
}

.resume-two-column-layout .resume-contact-info {
  margin-top: var(--resume-contact-spacing);
  margin-bottom: var(--resume-contact-spacing);
  /* Remove forced centering - let templates decide */
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

/* Uniform summary spacing for two-column layouts */
.resume-two-column-layout .resume-summary-section {
  margin-top: var(--resume-summary-spacing) !important;
  margin-bottom: 0.125rem !important; /* REDUCED spacing before columns */
  padding: 0 !important;
  line-height: 1.2 !important;
  text-align: left !important; /* ALWAYS left-align summary text */
  page-break-after: avoid !important;
  break-after: avoid !important;
}

/* Ensure all summary content is left-aligned */
.resume-two-column-layout .resume-summary-section *,
.resume-two-column-layout .resume-summary-section p {
  text-align: left !important;
}

  /* Remove all spacing around columns container */
  .resume-two-column-layout .resume-columns {
    margin: 0 !important;
    padding: 0 !important;
    page-break-before: avoid !important;
    break-before: avoid !important;
  }

  /* TEMPLATE-SPECIFIC HEADER ALIGNMENT FOR TWO-COLUMN LAYOUTS */

  /* Professional & Modern & Creative Templates: Centered headers */
  .resume-two-column-layout.template-professional .resume-header,
  .resume-two-column-layout.template-modern .resume-header,
  .resume-two-column-layout.template-creative .resume-header {
    text-align: center !important;
  }

  .resume-two-column-layout.template-professional .resume-header .resume-heading-1,
  .resume-two-column-layout.template-modern .resume-header .resume-heading-1,
  .resume-two-column-layout.template-creative .resume-header .resume-heading-1 {
    text-align: center !important;
  }

  .resume-two-column-layout.template-professional .resume-header .resume-paragraph,
  .resume-two-column-layout.template-modern .resume-header .resume-paragraph,
  .resume-two-column-layout.template-creative .resume-header .resume-paragraph {
    text-align: center !important;
  }

  .resume-two-column-layout.template-professional .resume-contact-info,
  .resume-two-column-layout.template-modern .resume-contact-info,
  .resume-two-column-layout.template-creative .resume-contact-info {
    justify-content: center !important;
  }

  /* Professional template: Increase spacing around H1 border line in two-column mode */
  .resume-two-column-layout.template-professional .resume-header .resume-heading-1 {
    padding-bottom: 0.5rem !important;
    margin-bottom: 0.5rem !important;
    border-bottom: 2px solid #e0e0e0 !important;
  }

  /* Professional template: Match Creative template summary spacing exactly */
  .resume-two-column-layout.template-professional .resume-summary-section {
    margin-top: var(--resume-summary-spacing) !important; /* Same as Creative: 0.75rem */
    margin-bottom: 0.125rem !important; /* Same as Creative: 0.125rem */
  }

  .resume-two-column-layout.template-professional .resume-summary-section p {
    margin: 0 !important; /* Remove extra paragraph margins in summary */
    padding: 0 !important; /* Also remove any padding conflicts */
  }

  /* Minimalist template: Match Creative template summary spacing exactly */
  .resume-two-column-layout.template-minimalist .resume-summary-section {
    margin-top: var(--resume-summary-spacing) !important; /* Same as Creative: 0.75rem */
    margin-bottom: 0.125rem !important; /* Same as Creative: 0.125rem */
  }

  .resume-two-column-layout.template-minimalist .resume-summary-section p {
    margin: 0 !important; /* Remove extra paragraph margins in summary */
    padding: 0 !important; /* Also remove any padding conflicts */
  }

  /* Override any index.css conflicts for Professional and Minimalist templates */
  .resume-two-column-layout.template-professional .resume-summary-section,
  .resume-two-column-layout.template-minimalist .resume-summary-section {
    margin-top: var(--resume-summary-spacing) !important; /* Ensure consistent top spacing: 0.75rem */
    margin-bottom: 0.125rem !important; /* Force override index.css mb-2 */
    padding-bottom: 0 !important; /* Force override index.css pb-1 */
  }

  /* Minimalist & Executive Templates: Left-aligned headers */
  .resume-two-column-layout.template-minimalist .resume-header,
  .resume-two-column-layout.template-executive .resume-header {
    text-align: left !important;
  }

  .resume-two-column-layout.template-minimalist .resume-header .resume-heading-1,
  .resume-two-column-layout.template-executive .resume-header .resume-heading-1 {
    text-align: left !important;
  }

  .resume-two-column-layout.template-minimalist .resume-header .resume-paragraph,
  .resume-two-column-layout.template-executive .resume-header .resume-paragraph {
    text-align: left !important;
  }

  .resume-two-column-layout.template-minimalist .resume-contact-info,
  .resume-two-column-layout.template-executive .resume-contact-info {
    justify-content: flex-start !important;
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
  line-height: var(--resume-line-height);
}

.template-professional .resume-heading-1 {
  font-family: 'Montserrat', sans-serif;
  font-size: var(--resume-h1-font-size);
  font-weight: 600;
  color: #222222;
  margin: 0 0 var(--resume-header-spacing) 0;
  padding-bottom: var(--resume-header-spacing);
  border-bottom: 2px solid #e0e0e0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.1;
}

.template-professional .resume-heading-2 {
  font-family: 'Montserrat', sans-serif;
  font-size: var(--resume-h2-font-size);
  font-weight: 600;
  color: #444444;
  margin-top: 1.5rem;
  margin-bottom: var(--resume-section-spacing);
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
  font-size: var(--resume-font-size);
  line-height: var(--resume-line-height);
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
  line-height: var(--resume-line-height);
  position: relative;
}

.template-modern .resume-heading-1 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: var(--resume-h1-font-size);
  font-weight: 600;
  color: #000;
  margin-bottom: var(--resume-header-spacing);
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
  font-size: var(--resume-h2-font-size);
  font-weight: 700;
  color: #333333;
  margin-top: 1.5rem;
  margin-bottom: var(--resume-section-spacing);
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
  font-size: var(--resume-font-size);
  line-height: var(--resume-line-height);
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
  line-height: var(--resume-line-height);
}

.template-minimalist .resume-heading-1 {
  font-size: var(--resume-h1-font-size);
  font-weight: 300;
  color: #222222;
  margin: 0 0 var(--resume-header-spacing) 0;
  padding-bottom: var(--resume-header-spacing);
  border-bottom: 1px solid #e5e5e5;
  letter-spacing: -0.5px;
  line-height: 1.1;
}

.template-minimalist .resume-heading-2 {
  font-size: var(--resume-h2-font-size);
  font-weight: 600;
  color: #666666;
  margin-top: 1.5rem;
  margin-bottom: var(--resume-section-spacing);
  text-transform: uppercase;
  letter-spacing: 1.5px;
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
  font-size: var(--resume-font-size);
  line-height: var(--resume-line-height);
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
  position: relative;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

/* Modern greyscale header section */
.template-creative .resume-heading-1 {
  font-size: var(--resume-h1-font-size);
  font-weight: 800;
  color: #1f2937;
  margin-bottom: var(--resume-contact-spacing);
  padding: var(--resume-header-spacing) 0 calc(var(--resume-header-spacing) + 0.25rem) 0;
  text-align: center;
  letter-spacing: -0.5px;
  line-height: 1.1;
  position: relative;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

/* Decorative line below H1 - REMOVED for cleaner two-column layout */
.template-creative .resume-heading-1::after {
  display: none;
}

/* Two-column mode: Clean layout without decorative lines */
.resume-two-column-layout.template-creative .resume-heading-1::after {
  display: none !important;
}

/* Clean spacing in Creative template two-column header */
.resume-two-column-layout.template-creative .resume-header .resume-heading-1 {
  padding-bottom: var(--resume-header-spacing);
  margin-bottom: var(--resume-contact-spacing);
  border-bottom: none !important; /* Remove any inherited borders */
}

/* Remove any borders from Creative template header elements in two-column mode */
.resume-two-column-layout.template-creative .resume-header,
.resume-two-column-layout.template-creative .resume-header *,
.resume-two-column-layout.template-creative .resume-summary-section {
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
}

/* Section headings with modern accent */
.template-creative .resume-heading-2 {
  font-size: var(--resume-h2-font-size);
  font-weight: 700;
  color: #374151;
  margin-top: 1.5rem;
  margin-bottom: var(--resume-section-spacing);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
  padding-left: 1rem;
  border-left: 4px solid #6b7280;
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
  font-size: var(--resume-font-size);
  line-height: var(--resume-line-height);
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

/* Creative template uses standard bullets for consistency */

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

/* Subtle contact info styling - REMOVED border for cleaner layout */
.template-creative .resume-paragraph:first-of-type {
  text-align: center;
  color: #6b7280;
  font-size: var(--resume-font-size);
  margin-bottom: 1rem;
  padding-bottom: 0;
  /* border-bottom removed for cleaner two-column header */
}

/* Hide HR in creative template */
.template-creative hr {
  display: none;
}

/* Two-column specific adjustments - REMOVED CONFLICTING OVERRIDE */
/* The Creative template now properly inherits two-column alignment from template-specific rules */
`,

  executive: `
/* Executive Template - Classic and authoritative */
.template-executive {
  background: #ffffff;
  color: #333333;
  font-family: 'Lato', sans-serif;
  line-height: var(--resume-line-height);
}

.template-executive .resume-heading-1 {
  font-family: 'Playfair Display', serif;
  font-size: var(--resume-h1-font-size);
  font-weight: 700;
  color: #111111;
  margin: 0 0 var(--resume-header-spacing) 0;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1.1;
  position: relative;
  padding-bottom: var(--resume-header-spacing);
  border-bottom: 1px solid #e0e0e0;
}

.template-executive .resume-heading-2 {
  font-family: 'Lato', sans-serif;
  font-size: var(--resume-h2-font-size);
  font-weight: 600;
  color: #333333;
  margin-top: 1.5rem;
  margin-bottom: var(--resume-section-spacing);
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
  font-size: var(--resume-font-size);
  line-height: var(--resume-line-height);
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
    padding: var(--resume-margin-top) var(--resume-margin-right) var(--resume-margin-bottom) var(--resume-margin-left) !important;
    width: 8.5in !important;
    min-height: 11in !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    background: white !important;
    box-shadow: none !important;
    font-family: var(--resume-font-family) !important;
    font-size: var(--resume-font-size) !important;
    line-height: var(--resume-line-height) !important;
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

  /* Force summary to be compact with bottom padding */
  .resume-two-column-layout .resume-summary-section {
    margin-bottom: 0.125in !important;
    padding-bottom: 0.25rem !important;
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
    padding: var(--resume-margin-top) var(--resume-margin-right) var(--resume-margin-bottom) var(--resume-margin-left) !important;
    box-sizing: border-box !important;
  }

  .resume-two-page-layout .resume-page-first {
    page-break-after: always !important;
    margin-bottom: 0 !important;
  }

  .resume-two-page-layout .resume-page-second {
    margin-top: 0 !important;
    padding-top: var(--resume-margin-top) !important;
  }

  /* Fix for two-column layout */
  .resume-two-column-layout .resume-columns {
    display: grid !important;
    grid-template-columns: 1fr 2fr !important;
    gap: 0.5in !important;
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

  /* CRITICAL: Reduce header bottom spacing in two-column layout (print styles) */
  .resume-two-column-layout .resume-header {
    margin-bottom: 0.125in !important;
    padding-bottom: 0 !important;
  }

  .resume-two-column-layout .resume-header .resume-heading-1 {
    margin-bottom: 0.125in !important;
    padding-bottom: 0 !important;
  }

  .resume-two-column-layout .resume-header .resume-paragraph {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
  }

  /* CRITICAL: Reduce spacing ABOVE summary section */
  .resume-two-column-layout .resume-summary-section {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  /* Target any element immediately before summary */
  .resume-two-column-layout * + .resume-summary-section {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  /* Target header elements that come before summary */
  .resume-two-column-layout .resume-heading-1 + .resume-summary-section,
  .resume-two-column-layout h1 + .resume-summary-section,
  .resume-two-column-layout .resume-heading-1 + * + .resume-summary-section,
  .resume-two-column-layout .resume-header + .resume-summary-section {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  /* CRITICAL: Reduce header bottom spacing in two-column layout */
  .resume-two-column-layout .resume-header .resume-heading-1 {
    margin-bottom: 0.25rem !important;
    padding-bottom: 0 !important;
  }

  /* Override template-specific H1 margins in two-column mode */
  .resume-two-column-layout.template-professional .resume-heading-1,
  .resume-two-column-layout.template-modern .resume-heading-1,
  .resume-two-column-layout.template-minimalist .resume-heading-1,
  .resume-two-column-layout.template-creative .resume-heading-1,
  .resume-two-column-layout.template-executive .resume-heading-1 {
    margin-bottom: 0.25rem !important;
    padding: 0 !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* ULTRA-AGGRESSIVE PROFESSIONAL TEMPLATE PAGE BREAK FIXES */
  .resume-two-column-layout.template-professional .resume-heading-1::after {
    page-break-after: avoid !important;
    break-after: avoid !important;
  }

  /* Force Professional template H1 border to not cause page breaks */
  .resume-two-column-layout.template-professional .resume-heading-1 {
    border-bottom: 2px solid #e0e0e0 !important;
    padding-bottom: 0.5rem !important; /* Increased spacing below H1 */
    margin-bottom: 0.5rem !important; /* Increased spacing after border line */
    page-break-after: avoid !important;
    break-after: avoid !important;
    orphans: 3 !important;
    widows: 3 !important;
  }

  /* Prevent page breaks immediately after Professional H1 */
  .resume-two-column-layout.template-professional .resume-heading-1 + *,
  .resume-two-column-layout.template-professional .resume-header + *,
  .resume-two-column-layout.template-professional .resume-header .resume-heading-1 + * {
    page-break-before: avoid !important;
    break-before: avoid !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  .resume-two-column-layout .resume-header .resume-paragraph {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
  }

  /* SELECTIVE PAGE BREAK PREVENTION FOR TWO-COLUMN LAYOUTS */
  .resume-two-column-layout .resume-header,
  .resume-two-column-layout .resume-summary-section,
  .resume-two-column-layout .resume-columns {
    page-break-before: avoid !important;
    break-before: avoid !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Allow page breaks only at the very end of content */
  .resume-two-column-layout .resume-column-right > *:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }

  /* ULTRA-COMPACT HEADER FOR TWO-COLUMN LAYOUTS */
  .resume-two-column-layout .resume-header {
    margin: 0 !important;
    padding: 0 !important;
    line-height: 1.1 !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Make header content as compact as possible */
  .resume-two-column-layout .resume-header * {
    margin: 0 !important;
    padding: 0 !important;
    line-height: 1.1 !important;
  }

  /* Specific Professional template header fixes */
  .resume-two-column-layout.template-professional .resume-header {
    margin: 0 !important;
    padding: 0 !important;
  }

  .resume-two-column-layout.template-professional .resume-header .resume-heading-1 {
    font-size: var(--resume-h1-font-size) !important;
    line-height: 1.0 !important;
    margin: 0 0 0.5rem 0 !important; /* Increased margin after border line */
    padding: 0 0 0.5rem 0 !important; /* Increased padding below H1 */
    border-bottom: 2px solid #e0e0e0 !important; /* Consistent border with live preview */
  }

  /* Uniform summary spacing for two-column layout in print */
  .resume-two-column-layout .resume-summary-section {
    margin-top: var(--resume-summary-spacing) !important;
    margin-bottom: 0.125rem !important; /* REDUCED spacing before columns in print */
    padding: 0 !important;
    line-height: 1.2 !important;
    font-size: 11pt !important;
    text-align: left !important; /* ALWAYS left-align summary in print */
  }

  /* Ensure all summary content is left-aligned in print */
  .resume-two-column-layout .resume-summary-section *,
  .resume-two-column-layout .resume-summary-section p {
    text-align: left !important;
  }

  /* TEMPLATE-SPECIFIC HEADER ALIGNMENT FOR TWO-COLUMN LAYOUTS IN PRINT */

  /* Professional & Modern & Creative Templates: Centered headers in print */
  .resume-two-column-layout.template-professional .resume-header,
  .resume-two-column-layout.template-modern .resume-header,
  .resume-two-column-layout.template-creative .resume-header {
    text-align: center !important;
  }

  .resume-two-column-layout.template-professional .resume-header .resume-heading-1,
  .resume-two-column-layout.template-modern .resume-header .resume-heading-1,
  .resume-two-column-layout.template-creative .resume-header .resume-heading-1 {
    text-align: center !important;
  }

  .resume-two-column-layout.template-professional .resume-header .resume-paragraph,
  .resume-two-column-layout.template-modern .resume-header .resume-paragraph,
  .resume-two-column-layout.template-creative .resume-header .resume-paragraph {
    text-align: center !important;
  }

    /* Minimalist & Executive Templates: Left-aligned headers in print */
  .resume-two-column-layout.template-minimalist .resume-header,
  .resume-two-column-layout.template-executive .resume-header {
    text-align: left !important;
  }

  .resume-two-column-layout.template-minimalist .resume-header .resume-heading-1,
  .resume-two-column-layout.template-executive .resume-header .resume-heading-1 {
    text-align: left !important;
  }

  .resume-two-column-layout.template-minimalist .resume-header .resume-paragraph,
  .resume-two-column-layout.template-executive .resume-header .resume-paragraph {
    text-align: left !important;
  }

  /* Creative template clean layout for print - no decorative lines */
  .resume-two-column-layout.template-creative .resume-heading-1::after {
    display: none !important;
  }

  .resume-two-column-layout.template-creative .resume-header .resume-heading-1 {
    padding-bottom: var(--resume-header-spacing) !important;
    margin-bottom: var(--resume-contact-spacing) !important;
    border-bottom: none !important; /* Remove any inherited borders in print */
  }

  /* Remove any borders from Creative template header elements in print */
  .resume-two-column-layout.template-creative .resume-header,
  .resume-two-column-layout.template-creative .resume-header *,
  .resume-two-column-layout.template-creative .resume-summary-section {
    border: none !important;
    border-bottom: none !important;
    border-top: none !important;
  }

  /* REDUCED spacing between summary and columns */
  .resume-two-column-layout .resume-summary-section + .resume-columns {
    margin-top: -0.25rem !important; /* Negative margin to reduce gap */
    padding-top: 0 !important;
  }

  /* Reduce bottom margin of summary section in two-column layout */
  .resume-two-column-layout .resume-summary-section {
    margin-bottom: 0.125rem !important; /* Reduced from default summary spacing */
  }

  /* Professional and Minimalist template: Match Creative template summary spacing in print */
  .resume-two-column-layout.template-professional .resume-summary-section,
  .resume-two-column-layout.template-minimalist .resume-summary-section {
    margin-top: var(--resume-summary-spacing) !important; /* Same as Creative: 0.75rem */
    margin-bottom: 0.125rem !important; /* Same as Creative: 0.125rem */
  }

  /* Remove template-specific paragraph margins from summary sections in print */
  .resume-two-column-layout.template-professional .resume-summary-section p,
  .resume-two-column-layout.template-minimalist .resume-summary-section p {
    margin: 0 !important; /* Remove extra paragraph margins that conflict */
    padding: 0 !important; /* Also remove any padding conflicts */
  }

  /* Override any base CSS conflicts for Professional and Minimalist templates in print */
  .resume-two-column-layout.template-professional .resume-summary-section,
  .resume-two-column-layout.template-minimalist .resume-summary-section {
    margin-top: var(--resume-summary-spacing) !important; /* Same as Creative: 0.75rem */
    margin-bottom: 0.125rem !important; /* Same as Creative: 0.125rem */
    padding-bottom: 0 !important; /* Override any base CSS padding */
  }

  /* CRITICAL: Fix for first H2 elements getting cut off at top of columns */
  .resume-two-column-layout .resume-column-left > .resume-heading-2:first-child,
  .resume-two-column-layout .resume-column-right > .resume-heading-2:first-child,
  .resume-two-column-layout .resume-column-left > h2:first-child,
  .resume-two-column-layout .resume-column-right > h2:first-child {
    margin-top: 1rem !important;
    padding-top: 0.5rem !important;
    page-break-before: avoid !important;
    break-before: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Force columns to have top padding to prevent cutoff */
  .resume-two-column-layout .resume-column-left,
  .resume-two-column-layout .resume-column-right {
    padding-top: 0.5rem !important;
    margin-top: 0 !important;
  }

  /* COMPREHENSIVE TWO-COLUMN LAYOUT FIXES FOR ALL TEMPLATES */

  /* Force two-column grid layout to work in PDF */
  .resume-two-column-layout .resume-columns {
    display: grid !important;
    grid-template-columns: 1fr 2fr !important;
    gap: 0.5in !important;
    align-items: start !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Ensure left and right columns are properly contained */
  .resume-two-column-layout .resume-column-left,
  .resume-two-column-layout .resume-column-right {
    width: 100% !important;
    max-width: 100% !important;
    overflow: hidden !important;
    word-wrap: break-word !important;
    hyphens: auto !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Professional template specific fixes */
  .resume-two-column-layout.template-professional .resume-heading-2 {
    font-size: var(--resume-h2-font-size) !important;
    margin: 1rem 0 0.5rem 0 !important;
    padding: 0.25rem 0 0 0 !important;
    border-bottom: none !important;
    text-transform: uppercase !important;
    font-weight: 600 !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Professional template - first H2 in columns */
  .resume-two-column-layout.template-professional .resume-column-left > .resume-heading-2:first-child,
  .resume-two-column-layout.template-professional .resume-column-right > .resume-heading-2:first-child,
  .resume-two-column-layout.template-professional .resume-column-left > h2:first-child,
  .resume-two-column-layout.template-professional .resume-column-right > h2:first-child {
    margin-top: 1.25rem !important;
    padding-top: 0.75rem !important;
  }

  .resume-two-column-layout.template-professional .resume-heading-2::after {
    content: '' !important;
    position: absolute !important;
    bottom: -3px !important;
    left: 0 !important;
    width: 30px !important;
    height: 2px !important;
    background: #888888 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Modern template specific fixes */
  .resume-two-column-layout.template-modern .resume-heading-2 {
    font-size: var(--resume-h2-font-size) !important;
    margin: 1rem 0 0.75rem 0 !important;
    padding: 0.5rem 0.75rem 0.3rem 1rem !important;
    background: #f8f8f8 !important;
    border-left: 3px solid #333333 !important;
    border-radius: 0 3px 3px 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Modern template - first H2 in columns */
  .resume-two-column-layout.template-modern .resume-column-left > .resume-heading-2:first-child,
  .resume-two-column-layout.template-modern .resume-column-right > .resume-heading-2:first-child,
  .resume-two-column-layout.template-modern .resume-column-left > h2:first-child,
  .resume-two-column-layout.template-modern .resume-column-right > h2:first-child {
    margin-top: 1.25rem !important;
    padding-top: 0.75rem !important;
  }

  /* Minimalist template specific fixes */
  .resume-two-column-layout.template-minimalist .resume-heading-2 {
    font-size: var(--resume-h2-font-size) !important;
    margin: 1rem 0 1rem 0 !important;
    padding: 0.25rem 0 0.25rem 0 !important;
    font-weight: 300 !important;
    border-bottom: 1px solid #ddd !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Minimalist template - first H2 in columns */
  .resume-two-column-layout.template-minimalist .resume-column-left > .resume-heading-2:first-child,
  .resume-two-column-layout.template-minimalist .resume-column-right > .resume-heading-2:first-child,
  .resume-two-column-layout.template-minimalist .resume-column-left > h2:first-child,
  .resume-two-column-layout.template-minimalist .resume-column-right > h2:first-child {
    margin-top: 1.25rem !important;
    padding-top: 0.75rem !important;
  }

  /* Creative template specific fixes */
  .resume-two-column-layout.template-creative .resume-heading-2 {
    font-size: var(--resume-h2-font-size) !important;
    margin: 1rem 0 0.75rem 0 !important;
    padding: 0.25rem 0 0 0 !important;
    color: #1f2937 !important;
    font-weight: 600 !important;
    position: relative !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Creative template - first H2 in columns */
  .resume-two-column-layout.template-creative .resume-column-left > .resume-heading-2:first-child,
  .resume-two-column-layout.template-creative .resume-column-right > .resume-heading-2:first-child,
  .resume-two-column-layout.template-creative .resume-column-left > h2:first-child,
  .resume-two-column-layout.template-creative .resume-column-right > h2:first-child {
    margin-top: 1.25rem !important;
    padding-top: 0.75rem !important;
  }

  .resume-two-column-layout.template-creative .resume-heading-2::before {
    content: '' !important;
    position: absolute !important;
    left: -15px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    width: 8px !important;
    height: 8px !important;
    background: linear-gradient(45deg, #4b5563, #6b7280) !important;
    border-radius: 50% !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Executive template specific fixes */
  .resume-two-column-layout.template-executive .resume-heading-2 {
    font-size: var(--resume-h2-font-size) !important;
    margin: 1rem 0 0.75rem 0 !important;
    padding: 0.25rem 0 0 0 !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Executive template - first H2 in columns */
  .resume-two-column-layout.template-executive .resume-column-left > .resume-heading-2:first-child,
  .resume-two-column-layout.template-executive .resume-column-right > .resume-heading-2:first-child,
  .resume-two-column-layout.template-executive .resume-column-left > h2:first-child,
  .resume-two-column-layout.template-executive .resume-column-right > h2:first-child {
    margin-top: 1.25rem !important;
    padding-top: 0.75rem !important;
  }

  /* Force all template content to fit within columns */
  .resume-two-column-layout .resume-column-left *,
  .resume-two-column-layout .resume-column-right * {
    max-width: 100% !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    hyphens: auto !important;
  }

  /* Prevent column content from overflowing */
  .resume-two-column-layout .resume-column-left {
    overflow: hidden !important;
  }

  .resume-two-column-layout .resume-column-right {
    overflow: hidden !important;
  }

  /* Force proper spacing between sections in columns */
  .resume-two-column-layout .resume-column-left > *:not(:last-child),
  .resume-two-column-layout .resume-column-right > *:not(:last-child) {
    margin-bottom: var(--resume-section-spacing) !important;
  }

  /* Ensure lists and paragraphs fit properly in columns */
  .resume-two-column-layout .resume-list,
  .resume-two-column-layout ul,
  .resume-two-column-layout ol {
    margin: 0.5rem 0 !important;
    padding-left: 1rem !important;
    max-width: 100% !important;
  }

  .resume-two-column-layout .resume-list-item,
  .resume-two-column-layout li {
    margin-bottom: 0.25rem !important;
    line-height: var(--resume-line-height) !important;
    max-width: 100% !important;
    word-wrap: break-word !important;
  }

  /* Force proper paragraph spacing in columns */
  .resume-two-column-layout .resume-paragraph,
  .resume-two-column-layout p {
    margin: 0.5rem 0 !important;
    line-height: var(--resume-line-height) !important;
    max-width: 100% !important;
    word-wrap: break-word !important;
  }

  /* COMPREHENSIVE FONT AND STYLING CONSISTENCY FOR PDF */

  /* Force identical font rendering in PDF */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    text-rendering: optimizeLegibility !important;
  }

  /* Ensure bullet points match Modern template size */
  .resume-list-item::before {
    font-size: 1.0em !important;
    font-weight: normal !important;
    color: inherit !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Force consistent font sizes across all templates */
  .resume-template {
    font-family: var(--resume-font-family) !important;
    font-size: var(--resume-font-size) !important;
    line-height: var(--resume-line-height) !important;
  }

  /* Ensure heading fonts are consistent */
  .resume-heading-1, h1 {
    font-size: var(--resume-h1-font-size) !important;
    font-weight: bold !important;
    line-height: 1.2 !important;
    font-family: var(--resume-font-family) !important;
  }

  .resume-heading-2, h2 {
    font-size: var(--resume-h2-font-size) !important;
    font-weight: bold !important;
    line-height: 1.3 !important;
    font-family: var(--resume-font-family) !important;
  }

  .resume-heading-3, h3 {
    font-size: var(--resume-h3-font-size) !important;
    font-weight: bold !important;
    line-height: 1.3 !important;
    font-family: var(--resume-font-family) !important;
  }

  /* Force paragraph and list consistency */
  .resume-paragraph, p {
    font-size: var(--resume-font-size) !important;
    line-height: var(--resume-line-height) !important;
    margin: 0.5rem 0 !important;
    font-family: var(--resume-font-family) !important;
  }

  .resume-list-item, li {
    font-size: var(--resume-font-size) !important;
    line-height: var(--resume-line-height) !important;
    font-family: var(--resume-font-family) !important;
  }

  /* Control spacing for BR and NBSP elements in PDF */
  .resume-br, br {
    line-height: 0.25 !important;
    margin: 0 !important;
    padding: 0 !important;
    display: block !important;
    height: 0.25rem !important;
  }

  /* Reduce excessive spacing from non-breaking spaces in PDF */
  .resume-template {
    word-spacing: normal !important;
    letter-spacing: normal !important;
  }

  /* Section spacing in PDF - add 8pt breathing room between sections */
  .resume-heading-2 {
    margin-bottom: var(--resume-section-spacing) !important;
  }

  /* Ensure consistent spacing after each main section in PDF */
  .resume-heading-2 + * {
    margin-top: 0 !important;
  }

  /* Add breathing room after section content in PDF */
  .resume-heading-2 ~ *:last-child {
    margin-bottom: var(--resume-section-spacing) !important;
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
