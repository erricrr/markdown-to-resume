export const executiveStyles = `
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

/* Add specific styling for two-column executive template */
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
