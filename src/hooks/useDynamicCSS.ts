import { useEffect, useCallback } from 'react';
import { baseResumeStyles, templateStyles } from '../styles/resumeTemplates';

// This function takes user-provided CSS and makes it more specific
// so it can reliably override the base template styles.
const processAndScopeUserCSS = (css: string): string => {
  if (!css) return '';
  // By wrapping the user's CSS in a selector that targets the resume container,
  // we increase its specificity. The ":is" pseudo-class is a modern way
  // to apply this scope without breaking selectors.
  return `.resume-template {
    ${css}
  }`;
};

export const useDynamicCSS = (template: string, customCSS: string) => {
  const updateStyles = useCallback(() => {
    let styleElement = document.getElementById('dynamic-resume-styles');

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'dynamic-resume-styles';
      document.head.appendChild(styleElement);
    }

    // 1. Start with the base styles for all resumes.
    const baseCSS = baseResumeStyles;

    // 2. Add the styles for the currently selected template.
    const selectedTemplateCSS = templateStyles[template] || '';

    // 3. Add the user's custom CSS, processed to have higher specificity.
    const scopedUserCSS = processAndScopeUserCSS(customCSS);

    // Combine all styles. The order is crucial for correct cascading.
    styleElement.textContent = `
      ${baseCSS}
      ${selectedTemplateCSS}
      ${scopedUserCSS}
    `;
  }, [template, customCSS]);

  useEffect(() => {
    updateStyles();

    return () => {
      const styleElement = document.getElementById('dynamic-resume-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [updateStyles]);
};
