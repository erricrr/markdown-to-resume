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
  .resume-two-column-layout.template-creative .resume-heading-1 {
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
  .resume-two-column-layout.template-modern .resume-heading-2,
  .resume-two-column-layout.template-modern h2 {
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
    margin-top: var(--resume-h2-margin-top);
    box-sizing: border-box;
    page-break-after: avoid;
    break-after: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .resume-two-column-layout.template-modern .resume-heading-2::before,
  .resume-two-column-layout.template-modern h2::before {
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
  .resume-two-column-layout.template-creative .resume-heading-2,
  .resume-two-column-layout.template-creative h2 {
    font-family: 'Work Sans', sans-serif;
    font-weight: 700;
    color: #1f2937;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    position: relative;
    display: block;
    width: 100%;
    background: #f8f8f8;
    padding: 0.5rem 1rem 0.5rem 1rem;
    border-radius: 4px;
    border-left: 4px solid #1f2937;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    margin-top: var(--resume-h2-margin-top);
    margin-bottom: 1rem;
    box-sizing: border-box;
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

  /* Executive template specific fixes */
  .resume-two-column-layout.template-executive .resume-heading-2,
  .resume-two-column-layout.template-executive h2 {
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
    margin-top: var(--resume-h2-margin-top);
    box-sizing: border-box;
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
