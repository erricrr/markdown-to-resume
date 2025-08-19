# Paste to PDF

A modern web application that converts Markdown and HTML content into professional PDF documents. Perfect for creating resumes, reports, and other documents from AI-generated content or existing markup.

## Features

### Markdown Editor
- **PDF Templates**: Multiple professional templates with CSS customization
- **Two-Column Layouts**: Easy creation of side-by-side content layouts
- **Simple Syntax**: Clean, readable Markdown with live preview
- **Template Selection**: Choose from Professional, Modern, Minimalist, Creative, and Executive styles
- **Custom CSS**: Fine-tune styling with built-in CSS editor
- **Print Preview**: WYSIWYG preview before PDF export

### HTML Editor
- **Full HTML Support**: Complete HTML, CSS, and JavaScript capabilities
- **Interactive Elements**: Support for animations and dynamic content
- **Design Freedom**: Complete control over layout and styling
- **Monaco Editor**: Professional code editing experience
- **Live Preview**: Real-time preview of HTML content
- **Print Optimization**: Automatic print-friendly styling

### Shared Features
- **Image Support**: Upload and reference images in both editors
- **Auto-Refresh**: Automatic preview updates when content changes
- **Paper Size Selection**: A4, Letter, and custom paper sizes
- **PDF Export**: Direct PDF generation with print optimization
- **File Upload**: Drag-and-drop file upload support
- **Responsive Design**: Works on desktop and mobile devices

## Supported Image Types
- JPG/JPEG
- PNG
- GIF
- WebP

## Technology Stack

This project is built with:

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Editor**: Monaco Editor for HTML, custom Markdown editor
- **PDF Generation**: jsPDF with html2canvas
- **Routing**: React Router DOM
- **State Management**: React Query and Context API

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd markdown-to-resume
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to access the application.

## Usage

1. **Choose Your Editor**: Select between Markdown or HTML editor based on your needs
2. **Write Content**: Paste or write your content in the chosen format
3. **Upload Images**: Add any images you want to include in your document
4. **Select Template**: Choose a template and customize the styling
5. **Preview**: Use the print preview to see how your document will look
6. **Export**: Generate and download your PDF

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── pages/              # Main application pages
├── styles/             # CSS and styling files
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Options
- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Use GitHub Actions for automatic deployment
- **Any Static Host**: Upload the contents of `dist/` to your preferred hosting service

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or feedback, please contact: voicevoz321@gmail.com
