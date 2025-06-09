# DRY CSS Architecture - Single Source of Truth

## Problem Solved
Previously, the resume templates had styles defined in **3 different places**:
1. `src/index.css` - for live preview
2. `src/utils/pdfExport.ts` - hardcoded CSS for PDF generation
3. `src/components/CSSEditor.tsx` - default template definitions

This led to inconsistencies between live preview and PDF output, and made maintenance difficult.

## Solution: Single Source of Truth

### New Architecture
All resume template styles are now defined in **one place**:
- **`src/styles/resumeTemplates.ts`** - TypeScript file with all template definitions
- **`src/styles/resumeTemplates.css`** - CSS file version for direct import

### How It Works

1. **Live Preview**: Uses `src/index.css` which imports `resumeTemplates.css`
2. **PDF Export**: Uses `getCompleteCSS()` function from `resumeTemplates.ts`
3. **CSS Editor**: Uses `templateStyles` object from `resumeTemplates.ts`

### Benefits

✅ **DRY (Don't Repeat Yourself)**: Styles defined once, used everywhere
✅ **Consistency**: Live preview and PDF output use identical styles
✅ **Maintainability**: Change styles in one place, updates everywhere
✅ **Type Safety**: TypeScript definitions prevent errors

### Files Modified

- `src/styles/resumeTemplates.ts` - **NEW**: Single source of truth
- `src/styles/resumeTemplates.css` - **NEW**: CSS version for imports
- `src/utils/pdfExport.ts` - Now uses `getCompleteCSS()`
- `src/components/CSSEditor.tsx` - Now imports from single source
- `src/hooks/useDynamicCSS.ts` - Updated to use single source
- `src/index.css` - Now imports from single source

### Recent Fixes Applied

1. **Modern Template**: Fixed H1 gradient underline to show in PDF
2. **Creative Template**: Increased left padding from 4.5rem to 6rem for PDF
3. **Executive Template**: Ensured light grey background prints correctly

All fixes are automatically applied to both live preview and PDF output thanks to the single source of truth architecture.
