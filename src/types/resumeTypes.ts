// Define valid template IDs
export const validTemplates = ['professional', 'modern', 'minimalist', 'creative', 'executive'] as const;

// Create a type from the array of valid template names
export type TemplateType = typeof validTemplates[number];

// Define resume data interface
export interface ResumeData {
  markdown?: string;
  leftColumn?: string;
  rightColumn?: string;
  header?: string;
  summary?: string;
  firstPage?: string;
  secondPage?: string;
  template: string;
  isTwoColumn?: boolean;
  isTwoPage?: boolean;
  paperSize?: 'A4' | 'US_LETTER';
  uploadedFileUrl?: string;
  uploadedFileName?: string;
  html?: string;
}
