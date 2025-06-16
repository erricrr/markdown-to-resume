// Single source of truth for all resume template styles
// This file is used by: Live Preview, PDF Export, and CSS Editor

import { baseResumeStyles } from './base';
import { printStyles } from './print';
import { creativeStyles } from './templates/creative';
import { executiveStyles } from './templates/executive';
import { minimalistStyles } from './templates/minimalist';
import { modernStyles } from './templates/modern';
import { professionalStyles } from './templates/professional';

/* -------------------------------------------------------------------------- */
/*  GLOBAL FONT IMPORTS                                                       */
/* -------------------------------------------------------------------------- */
// Centralized Google font import string so it can be reused by any consumer
// (live preview, PDF generation, etc.) without duplication.
//
// IMPORTANT: All Google Fonts are now loaded via HTML <link> tags in index.html
// to avoid @import conflicts and ensure reliable font loading in markdown templates.
// This fontImports is kept for PDF export compatibility but left empty to prevent
// duplicate loading which was causing font loading failures.
export const fontImports = `/* Google Fonts loaded via HTML <link> tags in index.html for optimal performance and reliability */`;

export { baseResumeStyles };

export const templateStyles = {
  professional: professionalStyles,
  modern: modernStyles,
  minimalist: minimalistStyles,
  creative: creativeStyles,
  executive: executiveStyles,
};

export { printStyles };

// Function to get all styles for a specific template
export const getTemplateStyles = (templateName: string): string => {
  const template = templateStyles[templateName as keyof typeof templateStyles];
  if (!template) {
    console.warn(
      `Template "${templateName}" not found, using professional as fallback`
    );
    return templateStyles.professional;
  }

  return template;
};

// Function to get complete CSS for PDF export
export const getCompleteCSS = (templateName?: string): string => {
  // Note: Google Fonts are loaded via HTML <link> tags, not CSS @import
  // This ensures reliable font loading in both live preview and PDF export
  let css = baseResumeStyles;

  if (templateName) {
    css += getTemplateStyles(templateName);
  } else {
    // Include all templates
    css += Object.values(templateStyles).join('\n');
  }

  css += printStyles;

  return css;
};
