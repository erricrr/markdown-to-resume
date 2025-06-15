import { useEffect, useCallback } from 'react';
import { baseResumeStyles, templateStyles } from '../styles/resumeTemplates';

// Helper to append !important to each declaration so user rules reliably override template styles
const addImportantToDeclarations = (css: string): string => {
  return css.replace(/:([^;{}]+);/g, (match, value) => {
    // If declaration already has !important, leave it untouched
    if (value.includes('!important')) return match;
    return `: ${value.trim()} !important;`;
  });
};

// This function takes user-provided CSS and makes it more specific
// so it can reliably override the base template styles.
const processAndScopeUserCSS = (css: string): string => {
  if (!css) return '';
  try {
    // This regex finds all CSS selectors and prepends the scope.
    // It's designed to avoid scoping @-rules like @keyframes or @media.
    const scopedCss = css.replace(/(^|}|,)\s*([^{}]+)\s*(?=\{)/g, (match, prefix, selector) => {
      const scopedSelector = selector
        .split(',')
        .map(part => {
          let trimmedPart = part.trim();

          // Map :root directly to the resume container so users can easily target it
          if (trimmedPart === ':root') {
            return '.resume-template';
          }

          // When users target `body`, apply styles to the template wrapper and all its children so that
          // global typography like font-family/line-height propagates even when inner elements define their own.
          if (trimmedPart === 'body') {
            return '.resume-template, .resume-template *';
          }

          if (trimmedPart.startsWith('@') || trimmedPart.startsWith('from') || trimmedPart.startsWith('to') || trimmedPart.startsWith(':')) {
            // Don't scope @-rules, pseudo-classes, or keyframe selectors
            return trimmedPart;
          }

          // Prepend the scope to make the selector more specific
          // Using :is() ensures we don't break complex selectors and increases specificity.
          return `:is(.resume-template) ${trimmedPart}`;
        })
        .join(', ');
      return `${prefix} ${scopedSelector}`;
    });

    // Ensure user declarations win by adding !important where not already present
    return addImportantToDeclarations(scopedCss);
  } catch (error) {
    console.error("Failed to scope custom CSS, applying it directly:", error);
    // Fallback to applying CSS without scoping if regex fails
    return addImportantToDeclarations(css);
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
