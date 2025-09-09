[![Netlify Status](https://api.netlify.com/api/v1/badges/51bfdabf-5c1c-414c-b869-1e9ff89d10bc/deploy-status)](https://app.netlify.com/projects/paste-to-pdf/deploys)

# Paste to PDF

A web application that converts Markdown and HTML content into PDF documents. Perfect for creating resumes, reports, and other documents from AI-generated content or existing markup.

## Features

- **Dual Editors**: Markdown editor with templates or full HTML editor with Monaco
- **Markdown Templates**: Choose from Professional, Modern, Minimalist, Creative, and Executive styles
- **Custom CSS**: Fine-tune styling with built-in CSS editor
- **Image Support**: Upload and reference images (JPG, PNG, GIF, WebP)
- **Print Preview**: Real-time preview with automatic updates
- **PDF Export**: Direct PDF generation with print optimization
- **Paper Sizes**: A4, Letter, and custom paper size support

## ⚠️ Important Print Notes

- **Live Preview Accuracy**: The live preview may not always be 100% accurate in terms of page sizing and layout
- **Print Button vs Browser Print**: Using the "Print" button may yield different results compared to opening the Live Preview in a new window and printing from there
- **Browser Differences**: Chrome, Firefox, and Safari will produce different print results due to varying rendering engines
- **Best Practice**: For most accurate results, open the Live Preview in a new window and use your browser's native print function

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Editors**: Monaco Editor (HTML) + Custom Markdown editor
- **PDF Generation**: jsPDF with html2canvas

## Quick Start

**Prerequisites**: Node.js 18+ and npm

```bash
# Clone and setup
git clone <YOUR_REPOSITORY_URL>
cd markdown-to-resume
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

## How to Use

1. Choose Markdown or HTML editor
2. Write/paste your content and upload images
3. Select a template and customize styling
4. Preview and export to PDF

## Development

**Available Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

```bash
npm run build
```

Deploy the `dist/` folder to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## License

MIT License - see LICENSE file for details.
