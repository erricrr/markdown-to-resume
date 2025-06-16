export const modernStyles = `
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
`;
