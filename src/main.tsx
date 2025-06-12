import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Clear any cached template CSS to ensure fresh font loading
const clearCachedTemplateCSS = () => {
  console.log('🧹 Clearing cached template CSS to ensure fresh font loading');

  // Get all template IDs
  const templateIds = ['professional', 'modern', 'minimalist', 'creative', 'executive'];

  // Clear any locally stored CSS for these templates
  templateIds.forEach(template => {
    const cssKey = `css-editor-${template}`;
    if (localStorage.getItem(cssKey)) {
      console.log(`  - Clearing cached CSS for ${template} template`);
      localStorage.removeItem(cssKey);
    }
  });

  // Remove any dynamic style elements from previous sessions
  const oldStyles = document.querySelectorAll('style[data-source="css-editor"]');
  oldStyles.forEach(el => el.remove());

  // Force reload of Google Fonts
  const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
  fontLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      // Add a cache-busting parameter
      const newHref = href.includes('?')
        ? `${href}&_=${Date.now()}`
        : `${href}?_=${Date.now()}`;
      link.setAttribute('href', newHref);
    }
  });
};

// Run the clearing function when the app starts
clearCachedTemplateCSS();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
