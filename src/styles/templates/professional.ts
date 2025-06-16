export const professionalStyles = `
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
`;
