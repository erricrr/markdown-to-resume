import { useEffect, useRef, useCallback } from 'react';
import { templateStyles, baseResumeStyles, printStyles, executiveSpecificStyles } from '../styles/resumeTemplates';

export const useDynamicCSS = () => {
  const styleElementRef = useRef<HTMLStyleElement | null>(null);
  const templateCSSRef = useRef<Record<string, string>>({});

  useEffect(() => {
    console.log('🔄 useDynamicCSS: Setting up dynamic CSS');

    // Remove any existing dynamic style elements
    const existingStyles = document.querySelectorAll('style[data-source="css-editor"]');
    console.log(`🔍 Found ${existingStyles.length} existing dynamic style elements to remove`);
    existingStyles.forEach(style => style.remove());

    // Create a new style element for dynamic CSS
    styleElementRef.current = document.createElement('style');
    styleElementRef.current.id = 'dynamic-template-css';
    styleElementRef.current.setAttribute('data-source', 'css-editor');
    styleElementRef.current.type = 'text/css';
    document.head.appendChild(styleElementRef.current);
    console.log('✅ Dynamic CSS style element created and added to head');

    // Initialize with default Professional template CSS
    if (templateStyles.professional) {
      console.log('🎨 Initializing with default Professional template CSS');
      templateCSSRef.current.professional = templateStyles.professional;
      updateAllCSS();
    } else {
      console.error('❌ Default Professional template CSS not found in templateStyles');
    }

    // Add a special style element for executive template fonts
    ensureExecutiveFontsApplied();

    return () => {
      // Cleanup on unmount
      if (styleElementRef.current && styleElementRef.current.parentNode) {
        styleElementRef.current.parentNode.removeChild(styleElementRef.current);
        console.log('🧹 Dynamic CSS style element removed');
      }

      // Remove the executive font styles
      const execStyles = document.getElementById('executive-font-fix');
      if (execStyles) {
        execStyles.remove();
      }
    };
  }, []);

  const updateAllCSS = useCallback(() => {
    console.log('🔄 Updating all CSS');
    if (!styleElementRef.current) {
      console.error('❌ Style element not found!');
      return;
    }

    // Start with base resume styles (includes bullets, layout, etc.)
    let allCSS = `/* BASE RESUME STYLES */\n${baseResumeStyles}\n\n`;

    // Add all default template styles from single source of truth
    allCSS += `/* DEFAULT TEMPLATE STYLES FROM SINGLE SOURCE OF TRUTH */\n`;
    Object.entries(templateStyles).forEach(([templateName, templateCSS]) => {
      allCSS += `\n/* ${templateName.toUpperCase()} TEMPLATE */\n${templateCSS}\n`;
    });

    // NEW: Add print styles directly to live preview for perfect PDF consistency
    // Extract print styles and apply them directly (not wrapped in @media print)
    const getPrintStylesForLivePreview = () => {
      let printCSS = printStyles;

      // Remove @media print wrapper and closing brace
      printCSS = printCSS.replace(/@media print\s*\{/, '');
      printCSS = printCSS.replace(/\}\s*$/, '');

      // IMPORTANT: Remove header/footer hiding rules that are only for PDF printing
      // These rules would hide the application header in the live preview
      printCSS = printCSS.replace(/header,\s*footer,\s*\.header,\s*\.footer\s*\{\s*display:\s*none\s*!\s*important;\s*\}/g, '');
      printCSS = printCSS.replace(/body::before,\s*body::after\s*\{\s*display:\s*none\s*!\s*important;\s*\}/g, '');

      console.log('🖨️ Applying print styles to live preview for PDF consistency (excluding header-hiding rules)');
      return printCSS;
    };

    const printCSSForPreview = getPrintStylesForLivePreview();
    allCSS += `\n/* PRINT STYLES APPLIED TO LIVE PREVIEW FOR PDF CONSISTENCY */\n${printCSSForPreview}\n`;

    // Add consistency CSS to ensure preview matches PDF
    allCSS += `
/* ADDITIONAL CONSISTENCY CSS FOR PREVIEW AND PDF */
.resume-template {
  padding: var(--resume-margin-top) var(--resume-margin-right) var(--resume-margin-bottom) var(--resume-margin-left) !important;
  width: 8.5in !important;
  min-height: 11in !important;
  box-sizing: border-box !important;
  background: white !important;
  margin: 0 !important;
  font-size: var(--resume-font-size) !important;
  line-height: var(--resume-line-height) !important;

  /* Default page margins if CSS variables aren't set */
  --resume-margin-top: 0.5in !important;
  --resume-margin-right: 0.5in !important;
  --resume-margin-bottom: 0.5in !important;
  --resume-margin-left: 0.5in !important;
}

/* Force exact font rendering to match PDF */
.resume-template * {
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility !important;
}

/* CRITICAL: Ensure bullets match Modern template size and appearance */
.resume-template .resume-list-item::before,
.resume-template li::before {
  content: "•" !important;
  position: absolute !important;
  left: -1.0rem !important;
  font-size: 1.0em !important;
  font-weight: normal !important;
  color: inherit !important;
  line-height: 1.0 !important;
  top: 0.1em !important;
}

/* Disable any marker bullets to prevent conflicts */
.resume-template .resume-list-item::marker,
.resume-template li::marker {
  content: none !important;
}

/* UNIFIED SPACING SYSTEM - CONSISTENT ACROSS ALL TEMPLATES */
.resume-template {
  font-size: var(--resume-font-size) !important;
  line-height: var(--resume-line-height) !important;
}

.resume-template .resume-heading-1,
.resume-template h1 {
  font-size: var(--resume-h1-font-size) !important;
  font-weight: bold !important;
  line-height: 1.1 !important;
  margin-top: var(--resume-h1-margin-top) !important;
  margin-bottom: var(--resume-h1-margin-bottom) !important;
}

.resume-template .resume-heading-2,
.resume-template h2 {
  font-size: var(--resume-h2-font-size) !important;
  font-weight: 600 !important;
  line-height: 1.3 !important;
  margin-top: var(--resume-h2-margin-top) !important;
  margin-bottom: var(--resume-h2-margin-bottom) !important;
}

.resume-template .resume-heading-3,
.resume-template h3 {
  font-size: var(--resume-h3-font-size) !important;
  font-weight: 500 !important;
  line-height: 1.3 !important;
  margin-top: var(--resume-h3-margin-top) !important;
  margin-bottom: var(--resume-h3-margin-bottom) !important;
}

.resume-template .resume-heading-4,
.resume-template h4 {
  font-size: var(--resume-h4-font-size) !important;
  font-weight: 500 !important;
  line-height: 1.3 !important;
  margin-top: var(--resume-h4-margin-top) !important;
  margin-bottom: var(--resume-h4-margin-bottom) !important;
}

.resume-template .resume-paragraph,
.resume-template p {
  font-size: var(--resume-font-size) !important;
  line-height: var(--resume-line-height) !important;
  margin-top: var(--resume-p-margin-top) !important;
  margin-bottom: var(--resume-p-margin-bottom) !important;
}

.resume-template .resume-list,
.resume-template ul,
.resume-template ol {
  margin-top: var(--resume-ul-margin-top) !important;
  margin-bottom: var(--resume-ul-margin-bottom) !important;
}

.resume-template .resume-list-item,
.resume-template li {
  font-size: var(--resume-font-size) !important;
  line-height: var(--resume-line-height) !important;
  margin-bottom: 0.5rem !important;
}

/* EXCEPTION: Header H1 elements need special spacing for contact info */
.resume-template .resume-header .resume-heading-1,
.resume-template .resume-header h1 {
  margin-bottom: var(--resume-header-spacing) !important;
}

/* EXCEPTION: Two-column layout H2 elements need adjusted top margin */
.resume-template.resume-two-column-layout .resume-column-left > .resume-heading-2:first-child,
.resume-template.resume-two-column-layout .resume-column-right > .resume-heading-2:first-child,
.resume-template.resume-two-column-layout .resume-column-left > h2:first-child,
.resume-template.resume-two-column-layout .resume-column-right > h2:first-child {
  margin-top: 0.5rem !important;
}

/* FIX: Modern and Executive templates H2 background elements in two-column layout */
/* Ensure background elements are not cut off by adding proper top spacing */
.resume-template.resume-two-column-layout.template-modern .resume-heading-2,
.resume-template.resume-two-column-layout.template-modern h2,
.resume-template.resume-two-column-layout.template-executive .resume-heading-2,
.resume-template.resume-two-column-layout.template-executive h2 {
  margin-top: 1rem !important;
  overflow: visible !important;
  /* Ensure background extends fully */
  display: block !important;
  width: 100% !important;
}

/* CREATIVE TEMPLATE: Preserve inline-block display for clip-path arrow shape */
.resume-template.resume-two-column-layout.template-creative .resume-heading-2,
.resume-template.resume-two-column-layout.template-creative h2 {
  margin-top: 1rem !important;
  overflow: visible !important;
  /* Keep inline-block for Creative template's arrow design */
  display: inline-block !important;
  /* Ensure full width while maintaining inline-block behavior */
  width: calc(100% - 0.5rem) !important;
  box-sizing: border-box !important;
}

/* Specific fixes for first H2 elements in columns - SEPARATED BY TEMPLATE */
/* Modern and Executive templates: Use block display */
.resume-template.resume-two-column-layout.template-modern .resume-column-left > .resume-heading-2:first-child,
.resume-template.resume-two-column-layout.template-modern .resume-column-right > .resume-heading-2:first-child,
.resume-template.resume-two-column-layout.template-modern .resume-column-left > h2:first-child,
.resume-template.resume-two-column-layout.template-modern .resume-column-right > h2:first-child,
.resume-template.resume-two-column-layout.template-executive .resume-column-left > .resume-heading-2:first-child,
.resume-template.resume-two-column-layout.template-executive .resume-column-right > .resume-heading-2:first-child,
.resume-template.resume-two-column-layout.template-executive .resume-column-left > h2:first-child,
.resume-template.resume-two-column-layout.template-executive .resume-column-right > h2:first-child {
  margin-top: 0.75rem !important;
  padding-top: 0.5rem !important;
}

/* Creative template: Preserve inline-block display for first H2 elements */
.resume-template.resume-two-column-layout.template-creative .resume-column-left > .resume-heading-2:first-child,
.resume-template.resume-two-column-layout.template-creative .resume-column-right > .resume-heading-2:first-child,
.resume-template.resume-two-column-layout.template-creative .resume-column-left > h2:first-child,
.resume-template.resume-two-column-layout.template-creative .resume-column-right > h2:first-child {
  margin-top: 0.75rem !important;
  padding-top: 0.5rem !important;
  /* Preserve inline-block for Creative template's arrow design */
  display: inline-block !important;
  width: calc(100% - 0.5rem) !important;
  box-sizing: border-box !important;
}

/* UNIFIED SUMMARY SECTION SPACING FOR LIVE PREVIEW - MATCHES PDF */
.resume-template.resume-two-column-layout .resume-summary-section {
  margin-top: var(--resume-summary-margin-top) !important;
  margin-bottom: var(--resume-summary-margin-bottom) !important;
  padding: 0 !important;
  line-height: 1.2 !important;
  text-align: left !important;
}

.resume-template.resume-two-column-layout .resume-summary-section *,
.resume-template.resume-two-column-layout .resume-summary-section p,
.resume-template.resume-two-column-layout .resume-summary-section div,
.resume-template.resume-two-column-layout .resume-summary-section span {
  margin: 0 !important;
  padding: 0 !important;
  text-align: left !important;
}

/* Ensure italic text is always left-aligned */
.resume-template .resume-emphasis,
.resume-template em,
.resume-template i {
  font-style: italic !important;
  text-align: left !important;
}

/* Reset any template-specific padding to ensure consistent margins */
.resume-template.template-professional,
.resume-template.template-modern,
.resume-template.template-minimalist,
.resume-template.template-executive,
.resume-template.template-creative {
  padding: var(--resume-margin-top) var(--resume-margin-right) var(--resume-margin-bottom) var(--resume-margin-left) !important;
}

/* Force all background colors and images to display/print */
* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}
`;

    // Build template CSS but only include the high-specificity (scoped) version to
    // prevent it from unintentionally overriding global application styles.
    const templateCSS = Object.entries(templateCSSRef.current)
      .map(([template, css]) => {
        console.log(`🔧 Processing CSS for template ${template}:`, css.substring(0, 100));

        // SIMPLE APPROACH: Just increase specificity with a prefix
        let processedCSS = css.replace(
          /\.template-(\w+)/g,
          '.resume-template.template-$1'
        );

        // Also handle .resume-template selectors
        processedCSS = processedCSS.replace(
          /^\.resume-template(?!\\.template-)/gm,
          '.resume-template'
        );

        console.log(`✅ Processed CSS for template ${template}:`, processedCSS.substring(0, 100));
        return `/* TEMPLATE: ${template.toUpperCase()} */\n${processedCSS}\n`;
      })
      .join('\n');

    // IMPORTANT: Template CSS comes AFTER base styles for proper cascade
    allCSS += `\n/* ===== USER TEMPLATE CUSTOMIZATIONS (HIGHEST PRIORITY) ===== */\n${templateCSS}`;

    styleElementRef.current.textContent = allCSS;
    console.log(`🎨 Updated dynamic CSS (${allCSS.length} chars):`, allCSS.substring(0, 200) + '...');

    // Log the current state of the style element
    console.log('📝 Style element content length:', styleElementRef.current.textContent?.length);
    console.log('🏷️ Style element in DOM:', document.contains(styleElementRef.current));

    // Force a style recalculation
    document.body.offsetHeight;
  }, []);

  // Ensure the Executive template's fonts are always correctly applied
  const ensureExecutiveFontsApplied = useCallback(() => {
    // Create a special style element for Executive template font fixes
    console.log('🔄 Ensuring Executive template fonts are applied correctly');

    // Remove any existing font fix first
    const existingFix = document.getElementById('executive-font-fix');
    if (existingFix) {
      existingFix.remove();
    }

    // Create a new style element with high-specificity rules
    const execFontStyles = document.createElement('style');
    execFontStyles.id = 'executive-font-fix';
    execFontStyles.setAttribute('data-source', 'css-editor');
    execFontStyles.textContent = `
      /* High priority font fixes for Executive template */
      .template-executive,
      .resume-template.template-executive {
        font-family: 'Ubuntu', sans-serif !important;
      }

      .template-executive .resume-heading-1,
      .template-executive .resume-heading-2,
      .template-executive .resume-heading-3,
      .resume-template.template-executive .resume-heading-1,
      .resume-template.template-executive .resume-heading-2,
      .resume-template.template-executive .resume-heading-3 {
        font-family: 'Merriweather', serif !important;
      }

      .template-executive p,
      .template-executive li,
      .template-executive a,
      .template-executive span,
      .template-executive div,
      .resume-template.template-executive p,
      .resume-template.template-executive li,
      .resume-template.template-executive a,
      .resume-template.template-executive span,
      .resume-template.template-executive div {
        font-family: 'Ubuntu', sans-serif !important;
      }

      /* Two-column specific fixes */
      .resume-two-column-layout.template-executive,
      .resume-template.resume-two-column-layout.template-executive {
        font-family: 'Ubuntu', sans-serif !important;
      }

      .resume-two-column-layout.template-executive .resume-heading-1,
      .resume-two-column-layout.template-executive .resume-heading-2,
      .resume-two-column-layout.template-executive .resume-heading-3,
      .resume-template.resume-two-column-layout.template-executive .resume-heading-1,
      .resume-template.resume-two-column-layout.template-executive .resume-heading-2,
      .resume-template.resume-two-column-layout.template-executive .resume-heading-3 {
        font-family: 'Merriweather', serif !important;
      }
    `;

    document.head.appendChild(execFontStyles);
    console.log('✅ High-priority Executive font fixes added to document');
  }, []);

  const addTemplateCSS = useCallback((template: string, css: string) => {
    console.log(`📝 Adding CSS for template: ${template}`);
    // Update the CSS for this template only
    templateCSSRef.current[template] = css;
    updateAllCSS();

    // If this is the executive template, ensure its fonts are applied properly
    if (template === 'executive') {
      console.log('🎨 Executive template detected, ensuring font fixes are applied');
      ensureExecutiveFontsApplied();
    }
  }, [updateAllCSS, ensureExecutiveFontsApplied]);

  const setActiveTemplate = useCallback((template: string) => {
    console.log(`🎯 Setting active template: ${template}`);
    // Only apply CSS for the active template to prevent conflicts
    updateAllCSS();

    // If this is the executive template, ensure its fonts are applied properly
    if (template === 'executive') {
      console.log('🎨 Executive template selected, ensuring font fixes are applied');
      ensureExecutiveFontsApplied();
    }
  }, [updateAllCSS, ensureExecutiveFontsApplied]);

  const removeTemplateCSS = useCallback((template: string) => {
    console.log(`🗑️ Removing CSS for template: ${template}`);
    delete templateCSSRef.current[template];
    updateAllCSS();
  }, [updateAllCSS]);

  const clearCSS = useCallback(() => {
    console.log('🧹 Clearing all dynamic CSS');
    templateCSSRef.current = {};
    if (styleElementRef.current) {
      styleElementRef.current.textContent = '';
    }
  }, []);

  const getTemplateCSS = useCallback((template: string) => {
    return templateCSSRef.current[template] || '';
  }, []);

  // Debug function to check if CSS is being applied
  const debugCSS = useCallback(() => {
    console.log('🔍 Debug CSS Info:');
    console.log('Style element exists:', !!styleElementRef.current);
    console.log('Style element in DOM:', document.contains(styleElementRef.current));
    console.log('Current CSS content:', styleElementRef.current?.textContent?.substring(0, 200));
    console.log('Template CSS cache:', Object.keys(templateCSSRef.current));

    // Check if our style element is in the head
    const dynamicStyles = document.querySelectorAll('style[data-source="css-editor"]');
    console.log('Dynamic style elements found:', dynamicStyles.length);
  }, []);

  return {
    addTemplateCSS,
    setActiveTemplate,
    removeTemplateCSS,
    clearCSS,
    getTemplateCSS,
    debugCSS,
    ensureExecutiveFontsApplied
  };
};
