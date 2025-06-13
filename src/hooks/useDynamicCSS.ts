import { useEffect, useCallback } from 'react';
import { baseResumeStyles, templateStyles } from '../styles/resumeTemplates';

// This function takes user-provided CSS and makes it more specific
// so it can reliably override the base template styles.
const processAndScopeUserCSS = (css: string): string => {
  if (!css) return '';
  try {
    // This regex finds all CSS selectors and prepends the scope.
    // It's designed to avoid scoping @-rules like @keyframes or @media.
    return css.replace(/(^|}|,)\s*([^{}]+)\s*(?={)/g, (match, prefix, selector) => {
      const scopedSelector = selector
        .split(',')
        .map(part => {
          const trimmedPart = part.trim();
          if (trimmedPart.startsWith('@') || trimmedPart.startsWith(':') || trimmedPart.startsWith('from') || trimmedPart.startsWith('to')) {
            // Don't scope @-rules, pseudo-classes, or keyframe selectors
            return trimmedPart;
          }
          // Prepend the scope to make the selector more specific
          return `.resume-template ${trimmedPart}`;
        })
        .join(', ');
      return `${prefix} ${scopedSelector}`;
    });
  } catch (error) {
    console.error("Failed to scope custom CSS, applying it directly:", error);
    // Fallback to applying CSS without scoping if regex fails
    return css;
  }
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
