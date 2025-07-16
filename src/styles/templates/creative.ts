export const creativeStyles = `
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
  font-family: 'Nunito', sans-serif;
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
  font-family: 'Nunito', sans-serif;
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
  /* Ensure proper spacing in two-column layout */
  margin-top: var(--resume-h2-margin-top);
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.template-creative .resume-heading-3,
.template-creative h3 {
  font-family: 'Nunito', sans-serif;
  color: #1f2937;
}

.template-creative .resume-heading-4,
.template-creative h4 {
  font-family: 'Nunito', sans-serif;
  color: #1f2937;
}

/* Content styling */
.template-creative p,
.template-creative li {
  color: #374151;
  font-weight: 400;
  display: block;
  text-align: left !important;
  text-align: left !important;
}

/* Keep contact info centered in two-column layout */
.resume-two-column-layout.template-creative .resume-header {
  text-align: center;
}

.resume-two-column-layout.template-creative .resume-header .resume-heading-1 {
  text-align: center;
}

.resume-two-column-layout.template-creative .resume-contact-info {
  justify-content: center;
  text-align: center;
}

/* Force left alignment for summary and all other content */
.resume-two-column-layout.template-creative .resume-summary-section,
.resume-two-column-layout.template-creative .resume-summary-section p,
.resume-two-column-layout.template-creative .resume-summary-section div,
.resume-two-column-layout.template-creative .resume-summary-section span,
.resume-two-column-layout.template-creative .resume-column-left p,
.resume-two-column-layout.template-creative .resume-column-right p {
  text-align: left !important;
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

/* Keep contact info centered in two-column layout */
.resume-two-column-layout.template-creative .resume-header {
  text-align: center;
}

.resume-two-column-layout.template-creative .resume-header .resume-heading-1 {
  text-align: center;
}

.resume-two-column-layout.template-creative .resume-contact-info {
  justify-content: center;
  text-align: center;
}

/* Force left alignment for summary and all other content */
.resume-two-column-layout.template-creative .resume-summary-section,
.resume-two-column-layout.template-creative .resume-summary-section p,
.resume-two-column-layout.template-creative .resume-summary-section div,
.resume-two-column-layout.template-creative .resume-summary-section span,
.resume-two-column-layout.template-creative .resume-column-left p,
.resume-two-column-layout.template-creative .resume-column-right p {
  text-align: left !important;
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
`;
