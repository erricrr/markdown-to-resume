interface ParsedSection {
  type: string;
  content: string;
  level: number;
}

interface SplitContent {
  header: string;
  summary: string;
  leftColumn: string;
  rightColumn: string;
}

// Common section types that typically go in the left column
const LEFT_COLUMN_SECTIONS = [
  'contact',
  'skills',
  'technical skills',
  'technologies',
  'tools',
  'languages',
  'education',
  'certifications',
  'certificates',
  'awards',
  'achievements',
  'interests',
  'hobbies',
  'references',
  'personal',
  'additional information',
  'core competencies',
  'expertise',
  'qualifications'
];

// Common section types that typically go in the right column
const RIGHT_COLUMN_SECTIONS = [
  'experience',
  'work experience',
  'professional experience',
  'employment',
  'career',
  'projects',
  'portfolio',
  'publications',
  'research',
  'presentations',
  'speaking',
  'volunteering',
  'volunteer experience',
  'leadership',
  'activities',
  'accomplishments',
  'professional summary',
  'career highlights'
];

/**
 * Extracts the header section (name and contact info) from markdown
 */
export const extractHeader = (markdown: string): string => {
  const lines = markdown.split('\n');
  const headerLines: string[] = [];
  let headerStarted = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Stop at any H2+ heading, as that's definitely not the header
    if (trimmedLine.startsWith('##')) {
      break;
    }

    if (trimmedLine.startsWith('# ')) {
      headerStarted = true;
    }

    if (headerStarted) {
      // The header is the contiguous block of text after the H1.
      // The first blank line signifies the end of the header/contact block.
      if (trimmedLine === '' && headerLines.length > 0) {
        const lastLine = headerLines[headerLines.length - 1].trim();
        if (lastLine !== '') {
          // Break only if the blank line follows a non-blank line.
          break;
        }
      }
      headerLines.push(line);
    }
  }

  // Clean up any trailing blank lines that might have been captured
  while (headerLines.length > 0 && headerLines[headerLines.length - 1].trim() === '') {
    headerLines.pop();
  }

  return headerLines.join('\n');
};

/**
 * Extracts a professional summary if it exists
 */
export const extractSummary = (markdown: string): string => {
  const lines = markdown.split('\n');
  let summaryLines: string[] = [];
  let inSummary = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for summary section headings
    if (line.match(/^##?\s*(summary|professional summary|about|profile|objective|overview|bio|introduction)/i)) {
      inSummary = true;
      continue;
    }

    // Stop at next section
    if (inSummary && line.startsWith('##')) {
      break;
    }

    // Collect summary content
    if (inSummary && line) {
      summaryLines.push(line);
    }
  }

  // If no explicit summary section, look for text after header but before first ## section
  if (summaryLines.length === 0) {
    let afterHeader = false;
    let headerEnded = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if we're past the header section
      if (line.startsWith('# ')) {
        afterHeader = true;
        continue;
      }

      // Header content patterns
      const isHeaderContent = line.includes('@') ||
          line.toLowerCase().includes('phone') ||
          line.toLowerCase().includes('linkedin') ||
          line.startsWith('**') ||
          line.match(/\(\d{3}\)|\d{3}-\d{3}-\d{4}|\+\d+/) ||
          line.match(/https?:\/\//) ||
          (line.includes('|') && (line.includes('@') || line.includes('(') || line.includes('+')));

      if (afterHeader && !isHeaderContent && !headerEnded) {
        headerEnded = true;
      }

      // Stop at first ## section
      if (line.startsWith('## ')) {
        break;
      }

      // Collect potential summary content (text after header but before sections)
      if (afterHeader && headerEnded && line && !line.startsWith('#') && !isHeaderContent) {
        summaryLines.push(line);
      }
    }
  }

  return summaryLines.join('\n').trim();
};

/**
 * Parses markdown into sections, excluding summary content that's already been extracted
 */
export const parseMarkdownSections = (markdown: string, extractedSummary?: string): ParsedSection[] => {
  const lines = markdown.split('\n');
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;
  let currentContent: string[] = [];
  let skipSummaryContent = false;
  let afterHeader = false;
  let headerEnded = false;
  let inImplicitSummary = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track if we're past the header
    if (line.startsWith('# ')) {
      afterHeader = true;
      continue;
    }

    // Header content patterns
    const isHeaderContent = line.includes('@') ||
        line.toLowerCase().includes('phone') ||
        line.toLowerCase().includes('linkedin') ||
        line.startsWith('**') ||
        line.match(/\(\d{3}\)|\d{3}-\d{3}-\d{4}|\+\d+/) ||
        line.match(/https?:\/\//) ||
        (line.includes('|') && (line.includes('@') || line.includes('(') || line.includes('+')));

    if (afterHeader && !isHeaderContent && !headerEnded) {
      headerEnded = true;
      // If we have an extracted summary, we should skip content until the first ## section
      if (extractedSummary && extractedSummary.trim()) {
        inImplicitSummary = true;
      }
    }

    // Check for heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      // End implicit summary when we hit a real section
      if (inImplicitSummary) {
        inImplicitSummary = false;
      }

      // Save previous section
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        sections.push(currentSection);
      }

      // Start new section
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();

      // Skip main title (# Name)
      if (level === 1) {
        currentSection = null;
        currentContent = [];
        continue;
      }

      // Check if this is a summary section that we should skip (to avoid duplication)
      const isSummarySection = line.match(/^##?\s*(summary|professional summary|about|profile|objective|overview|bio|introduction)/i);
      if (isSummarySection && extractedSummary && extractedSummary.trim()) {
        skipSummaryContent = true;
        currentSection = null;
        currentContent = [];
        continue;
      } else {
        skipSummaryContent = false;
      }

      currentSection = {
        type: title.toLowerCase(),
        content: line, // Include the heading in content
        level: level
      };
      currentContent = [line];
    } else if (currentSection && !skipSummaryContent && !inImplicitSummary) {
      // Add content to current section (skip if we're in a summary section or implicit summary)
      currentContent.push(line);
    } else if (skipSummaryContent && line.startsWith('#')) {
      // End of summary section, stop skipping
      skipSummaryContent = false;
    }
  }

  // Add final section
  if (currentSection && !skipSummaryContent && !inImplicitSummary) {
    currentSection.content = currentContent.join('\n').trim();
    sections.push(currentSection);
  }

  return sections;
};

/**
 * Determines if a section should go in the left column
 */
const isLeftColumnSection = (sectionType: string): boolean => {
  const type = sectionType.toLowerCase().trim();
  return LEFT_COLUMN_SECTIONS.some(leftType =>
    type.includes(leftType) || leftType.includes(type)
  );
};

/**
 * Determines if a section should go in the right column
 */
const isRightColumnSection = (sectionType: string): boolean => {
  const type = sectionType.toLowerCase().trim();
  return RIGHT_COLUMN_SECTIONS.some(rightType =>
    type.includes(rightType) || rightType.includes(type)
  );
};

/**
 * Main function to split markdown content for two-column layout
 */
export const splitMarkdownForTwoColumn = (markdown: string): SplitContent => {
  if (!markdown || markdown.trim() === '') {
    return {
      header: '',
      summary: '',
      leftColumn: '',
      rightColumn: ''
    };
  }

  const header = extractHeader(markdown);
  const summary = extractSummary(markdown);
  const sections = parseMarkdownSections(markdown, summary);

  const leftSections: string[] = [];
  const rightSections: string[] = [];
  const unclassifiedSections: string[] = [];

  // Classify sections
  for (const section of sections) {
    if (isLeftColumnSection(section.type)) {
      leftSections.push(section.content);
    } else if (isRightColumnSection(section.type)) {
      rightSections.push(section.content);
    } else {
      // For unclassified sections, put them in right column by default
      // but shorter sections (< 3 lines) might go to left
      const lineCount = section.content.split('\n').length;
      if (lineCount <= 3 && leftSections.length < rightSections.length) {
        leftSections.push(section.content);
      } else {
        rightSections.push(section.content);
      }
    }
  }

  // If one column is significantly longer, try to balance
  if (leftSections.length > 0 && rightSections.length > 0) {
    const leftLength = leftSections.join('\n').length;
    const rightLength = rightSections.join('\n').length;

    // If left column is much longer, move last section to right
    if (leftLength > rightLength * 2 && leftSections.length > 1) {
      const lastLeft = leftSections.pop();
      if (lastLeft) rightSections.unshift(lastLeft);
    }
    // If right column is much longer, move last section to left
    else if (rightLength > leftLength * 2 && rightSections.length > 1) {
      const lastRight = rightSections.pop();
      if (lastRight) leftSections.push(lastRight);
    }
  }

  return {
    header: header,
    summary: summary,
    leftColumn: leftSections.join('\n\n').trim(),
    rightColumn: rightSections.join('\n\n').trim()
  };
};
