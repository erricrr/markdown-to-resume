export const minimalistStyles = `
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
`;
