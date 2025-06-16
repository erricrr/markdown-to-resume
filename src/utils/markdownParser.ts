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

// Configuration constants
const BALANCE_THRESHOLD_RATIO = 2;
const SHORT_SECTION_LINE_THRESHOLD = 3;

// Pre-compiled regex patterns for better performance
const HEADING_REGEX = /^(#{1,6})\s+(.+)$/;
const PHONE_REGEX = /\(\d{3}\)|\d{3}-\d{3}-\d{4}|\+\d+/;
const URL_REGEX = /https?:\/\//;
// Matches headings like "## Summary", "## **Summary**", "## _Summary_" etc.
// Allows optional emphasis characters ( * _ ` ~ ) directly after the heading markers.
const SUMMARY_HEADING_REGEX = /^##?\s*[\*\_`~]*\s*(summary|professional summary|about|profile|objective|overview|bio|introduction)/i;

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
 * Optimized function to detect header content patterns
 */
const isHeaderContent = (line: string): boolean => {
  const lowerLine = line.toLowerCase();
  return (
    line.includes('@') ||
    lowerLine.includes('phone') ||
    lowerLine.includes('linkedin') ||
    line.startsWith('**') ||
    PHONE_REGEX.test(line) ||
    URL_REGEX.test(line) ||
    (line.includes('|') && (line.includes('@') || line.includes('(') || line.includes('+')))
  );
};

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
    if (SUMMARY_HEADING_REGEX.test(line)) {
      inSummary = true;
      // Include the heading itself so that it is preserved when switching back to single-column mode
      summaryLines.push(lines[i]); // use original line with formatting/emphasis preserved
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

      if (afterHeader && !isHeaderContent(line) && !headerEnded) {
        headerEnded = true;
      }

      // Stop at first ## section
      if (line.startsWith('## ')) {
        break;
      }

      // Collect potential summary content (text after header but before sections)
      if (afterHeader && headerEnded && line && !line.startsWith('#') && !isHeaderContent(line)) {
        summaryLines.push(line);
      }
    }
  }

  return summaryLines.join('\n').trim();
};

/**
 * Parse state for tracking the markdown parsing process
 */
interface ParseState {
  currentSection: ParsedSection | null;
  currentContent: string[];
  skipSummaryContent: boolean;
  afterHeader: boolean;
  headerEnded: boolean;
  inImplicitSummary: boolean;
}

/**
 * Parses markdown into sections, excluding summary content that's already been extracted
 */
export const parseMarkdownSections = (markdown: string, extractedSummary?: string): ParsedSection[] => {
  const lines = markdown.split('\n');
  const sections: ParsedSection[] = [];

  const state: ParseState = {
    currentSection: null,
    currentContent: [],
    skipSummaryContent: false,
    afterHeader: false,
    headerEnded: false,
    inImplicitSummary: false
  };

  const addCurrentSection = () => {
    if (state.currentSection && !state.skipSummaryContent && !state.inImplicitSummary) {
      state.currentSection.content = state.currentContent.join('\n').trim();
      sections.push(state.currentSection);
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track if we're past the header
    if (line.startsWith('# ')) {
      state.afterHeader = true;
      continue;
    }

    if (state.afterHeader && !isHeaderContent(line) && !state.headerEnded) {
      state.headerEnded = true;
      // If we have an extracted summary, we should skip content until the first ## section
      if (extractedSummary && extractedSummary.trim()) {
        state.inImplicitSummary = true;
      }
    }

    // Check for heading
    const headingMatch = line.match(HEADING_REGEX);

    if (headingMatch) {
      // End implicit summary when we hit a real section
      if (state.inImplicitSummary) {
        state.inImplicitSummary = false;
      }

      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();

      // Skip main title (# Name)
      if (level === 1) {
        continue;
      }

      // If heading level is greater than 2, keep it within current section
      if (level > 2) {
        if (state.currentSection) {
          state.currentContent.push(line);
        }
        continue;
      }

      // For level 2 headings => new section
      addCurrentSection();

      // Check if this is a summary section that we should skip (to avoid duplication)
      const isSummarySection = SUMMARY_HEADING_REGEX.test(line);
      if (isSummarySection && extractedSummary && extractedSummary.trim()) {
        state.skipSummaryContent = true;
        state.currentSection = null;
        state.currentContent = [];
        continue;
      } else {
        state.skipSummaryContent = false;
      }

      state.currentSection = {
        type: title.toLowerCase(),
        content: line, // Include heading
        level: level
      };
      state.currentContent = [line];
    } else if (state.currentSection && !state.skipSummaryContent && !state.inImplicitSummary) {
      // Add content to current section (skip if we're in a summary section or implicit summary)
      state.currentContent.push(line);
    } else if (state.skipSummaryContent && line.startsWith('#')) {
      // End of summary section, stop skipping
      state.skipSummaryContent = false;
    }
  }

  // Add final section
  addCurrentSection();

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
 * Balances content between left and right columns
 */
const balanceColumns = (leftSections: string[], rightSections: string[]): void => {
  if (leftSections.length === 0 || rightSections.length === 0) {
    return;
  }

  const leftLength = leftSections.join('\n').length;
  const rightLength = rightSections.join('\n').length;

  // If left column is much longer, move last section to right
  if (leftLength > rightLength * BALANCE_THRESHOLD_RATIO && leftSections.length > 1) {
    const lastLeft = leftSections.pop();
    if (lastLeft) rightSections.unshift(lastLeft);
  }
  // If right column is much longer, move last section to left
  else if (rightLength > leftLength * BALANCE_THRESHOLD_RATIO && rightSections.length > 1) {
    const lastRight = rightSections.pop();
    if (lastRight) leftSections.push(lastRight);
  }
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

  // Classify sections
  for (const section of sections) {
    if (isLeftColumnSection(section.type)) {
      leftSections.push(section.content);
    } else if (isRightColumnSection(section.type)) {
      rightSections.push(section.content);
    } else {
      // For unclassified sections, put them in right column by default
      // but shorter sections might go to left for better balance
      const lineCount = section.content.split('\n').length;
      if (lineCount <= SHORT_SECTION_LINE_THRESHOLD && leftSections.length < rightSections.length) {
        leftSections.push(section.content);
      } else {
        rightSections.push(section.content);
      }
    }
  }

  // Balance columns if needed
  balanceColumns(leftSections, rightSections);

  return {
    header: header,
    summary: summary,
    leftColumn: leftSections.join('\n\n').trim(),
    rightColumn: rightSections.join('\n\n').trim()
  };
};
