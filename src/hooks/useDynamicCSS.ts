import { useEffect, useRef, useCallback } from 'react';
import { templateStyles, baseResumeStyles } from '../styles/resumeTemplates';

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

    // Add all template CSS with high specificity
    const templateCSS = Object.entries(templateCSSRef.current)
      .map(([template, css]) => {
        // Add high specificity to ensure our CSS overrides the default styles
        // Apply the same specificity boost as in PDF export
        const processedCSS = css.replace(
          /\.template-(\w+)/g,
          '.resume-template.template-$1'
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
