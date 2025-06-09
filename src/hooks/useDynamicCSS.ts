import { useEffect, useRef, useCallback } from 'react';
import { templateStyles, baseResumeStyles, printStyles } from '../styles/resumeTemplates';

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

    return () => {
      // Cleanup on unmount
      if (styleElementRef.current && styleElementRef.current.parentNode) {
        styleElementRef.current.parentNode.removeChild(styleElementRef.current);
        console.log('🧹 Dynamic CSS style element removed');
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
  padding: 0.25in 0.5rem !important;
  width: 8.5in !important;
  min-height: 11in !important;
  box-sizing: border-box !important;
  background: white !important;
  margin: 0 !important;
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

/* Force consistent font sizes that match PDF exactly */
.resume-template {
  font-size: 12pt !important;
  line-height: 1.5 !important;
}

.resume-template .resume-heading-1,
.resume-template h1 {
  font-size: 24pt !important;
  font-weight: bold !important;
  line-height: 1.2 !important;
}

.resume-template .resume-heading-2,
.resume-template h2 {
  font-size: 16pt !important;
  font-weight: bold !important;
  line-height: 1.3 !important;
}

.resume-template .resume-heading-3,
.resume-template h3 {
  font-size: 14pt !important;
  font-weight: bold !important;
  line-height: 1.3 !important;
}

.resume-template .resume-paragraph,
.resume-template p {
  font-size: 12pt !important;
  line-height: 1.5 !important;
}

.resume-template .resume-list-item,
.resume-template li {
  font-size: 12pt !important;
  line-height: 1.5 !important;
}

/* Reset any template-specific padding to ensure consistent margins */
.resume-template.template-professional,
.resume-template.template-modern,
.resume-template.template-minimalist,
.resume-template.template-executive,
.resume-template.template-creative {
  padding: 0.25in 0.5rem !important;
}

/* Force all background colors and images to display/print */
* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}
`;

    // Process and add all template CSS with high specificity
    const templateCSS = Object.entries(templateCSSRef.current)
      .map(([template, css]) => {
        // Process CSS to ensure high specificity
        // 1. Increase specificity for template selectors
        let processedCSS = css.replace(
          /\.template-(\w+)\s+([^{]*){/g,
          '.resume-template.template-$1 $2{'
        );

        // 2. Add !important to properties that don't already have it
        processedCSS = processedCSS.replace(
          /:\s*([^!][^;]*);/g,
          ': $1 !important;'
        );

        return `/* DYNAMIC ${template.toUpperCase()} TEMPLATE */\n${css}\n\n/* HIGH SPECIFICITY VERSION */\n${processedCSS}\n`;
      })
      .join('\n');

    allCSS += templateCSS;

    styleElementRef.current.textContent = allCSS;
    console.log(`🎨 Updated dynamic CSS (${allCSS.length} chars):`, allCSS.substring(0, 200) + '...');

    // Log the current state of the style element
    console.log('📝 Style element content length:', styleElementRef.current.textContent?.length);
    console.log('🏷️ Style element in DOM:', document.contains(styleElementRef.current));

    // Force a style recalculation
    document.body.offsetHeight;
  }, []);

  const addTemplateCSS = useCallback((template: string, css: string) => {
    console.log(`📝 Adding CSS for template: ${template}`);
    templateCSSRef.current[template] = css;
    updateAllCSS();
  }, [updateAllCSS]);

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
    removeTemplateCSS,
    clearCSS,
    getTemplateCSS,
    debugCSS
  };
};
