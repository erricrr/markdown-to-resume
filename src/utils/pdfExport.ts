import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (element: HTMLElement, filename: string = 'resume.pdf') => {
  try {
    // Find the resume template element
    const resumeElement = element.querySelector('.resume-template');
    if (!resumeElement) {
      throw new Error('Resume template not found');
    }
    
    // Clone the resume content
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
    
    // Apply PDF-specific styling while preserving formatting
    const applyPDFStyling = (element: HTMLElement) => {
      // Add PDF export class for special styling
      element.classList.add('pdf-export');
      
      // Only apply essential PDF-specific styles
      element.style.boxShadow = 'none';
      element.style.border = 'none';
      element.style.transform = 'none';
      element.style.margin = '0';
      element.style.padding = '0.5in';
      element.style.width = '8.5in';
      element.style.minHeight = '11in';
      element.style.backgroundColor = 'white';
      
      // Get ALL elements but avoid overriding list styles
      const allElements = element.querySelectorAll('*');
      allElements.forEach(el => {
        const htmlEl = el as HTMLElement;
        const computedStyle = window.getComputedStyle(htmlEl);
        
        // For UL and OL elements - use custom bullets only
        if (htmlEl.tagName === 'UL' || htmlEl.tagName === 'OL') {
          htmlEl.style.display = 'block';
          htmlEl.style.boxShadow = 'none';
          htmlEl.style.border = 'none';
          htmlEl.style.listStyleType = 'none';
          htmlEl.style.paddingLeft = '0';
          htmlEl.style.marginLeft = '0';
        }
        
        // For LI elements - use block display with custom bullets
        if (htmlEl.tagName === 'LI') {
          htmlEl.style.display = 'block';
          htmlEl.style.boxShadow = 'none';
          htmlEl.style.border = 'none';
          htmlEl.style.transform = 'none';
          htmlEl.style.listStyleType = 'none';
          htmlEl.style.listStyle = 'none';
          htmlEl.style.paddingLeft = '1.2rem';
          htmlEl.style.marginLeft = '0';
          htmlEl.style.position = 'relative';
        }
        
        // Preserve heading styles with minimal changes
        if (htmlEl.tagName.match(/^H[1-6]$/)) {
          htmlEl.style.pageBreakAfter = 'avoid';
          htmlEl.style.boxShadow = 'none';
          htmlEl.style.border = 'none';
          htmlEl.style.transform = 'none';
        }
        
        // Preserve paragraph styles with minimal changes
        if (htmlEl.tagName === 'P') {
          htmlEl.style.pageBreakInside = 'avoid';
          htmlEl.style.boxShadow = 'none';
          htmlEl.style.border = 'none';
          htmlEl.style.transform = 'none';
        }
        
        // Remove shadows and borders from all elements for clean PDF
        htmlEl.style.boxShadow = 'none';
        htmlEl.style.textShadow = 'none';
        if (htmlEl.style.border && htmlEl.style.border !== 'none') {
          // Only remove decorative borders, keep structural ones
          if (!htmlEl.tagName.match(/^(TABLE|TD|TH|TR)$/)) {
            htmlEl.style.border = 'none';
          }
        }
      });
    };
    
    // Check if this is a two-page layout
    const isTwoPageLayout = clonedElement.querySelector('.resume-two-page');
    
    if (isTwoPageLayout) {
      // Handle two-page layout
      const firstPageElement = clonedElement.querySelector('.resume-page-first') as HTMLElement;
      const secondPageElement = clonedElement.querySelector('.resume-page-second') as HTMLElement;
      
      if (firstPageElement && secondPageElement) {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const marginInMM = 12.7; // 0.5 inch in mm
        const pageWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const contentWidth = pageWidth - (2 * marginInMM);
        const contentHeight = pageHeight - (2 * marginInMM);
        
        // Create container for first page
        const firstPageContainer = document.createElement('div');
        firstPageContainer.style.position = 'absolute';
        firstPageContainer.style.left = '-9999px';
        firstPageContainer.style.top = '0';
        firstPageContainer.style.width = `${contentWidth}mm`;
        firstPageContainer.style.height = `${contentHeight}mm`;
        firstPageContainer.style.backgroundColor = 'white';
        firstPageContainer.style.padding = '0';
        firstPageContainer.style.margin = '0';
        firstPageContainer.style.overflow = 'hidden';
        
        const firstPageClone = firstPageElement.cloneNode(true) as HTMLElement;
        firstPageClone.style.width = '100%';
        firstPageClone.style.height = '100%';
        firstPageClone.style.padding = '0';
        firstPageClone.style.margin = '0';
        applyPDFStyling(firstPageClone);
        
        firstPageContainer.appendChild(firstPageClone);
        document.body.appendChild(firstPageContainer);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const firstPageCanvas = await html2canvas(firstPageContainer, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: Math.round(contentWidth * 3.78),
          height: Math.round(contentHeight * 3.78),
          logging: false,
          removeContainer: true,
          imageTimeout: 15000,
          onclone: (clonedDoc) => {
            const listItems = clonedDoc.querySelectorAll('li');
            listItems.forEach((li) => {
              const htmlLi = li as HTMLElement;
              htmlLi.style.listStyleType = 'none';
              htmlLi.style.listStyle = 'none';
              htmlLi.style.display = 'block';
              htmlLi.style.position = 'relative';
              htmlLi.style.paddingLeft = '1.2rem';
            });
              
            const lists = clonedDoc.querySelectorAll('ul, ol');
            lists.forEach((list) => {
              const htmlList = list as HTMLElement;
              htmlList.style.listStyleType = 'none';
              htmlList.style.paddingLeft = '0';
            });
          }
        });
        
        document.body.removeChild(firstPageContainer);
        
        const firstPageImgData = firstPageCanvas.toDataURL('image/png');
        pdf.addImage(firstPageImgData, 'PNG', marginInMM, marginInMM, contentWidth, contentHeight);
        
        // Add second page if it has content
        if (secondPageElement.textContent?.trim()) {
          pdf.addPage();
          
          const secondPageContainer = document.createElement('div');
          secondPageContainer.style.position = 'absolute';
          secondPageContainer.style.left = '-9999px';
          secondPageContainer.style.top = '0';
          secondPageContainer.style.width = `${contentWidth}mm`;
          secondPageContainer.style.height = `${contentHeight}mm`;
          secondPageContainer.style.backgroundColor = 'white';
          secondPageContainer.style.padding = '0';
          secondPageContainer.style.margin = '0';
          secondPageContainer.style.overflow = 'hidden';
          
          const secondPageClone = secondPageElement.cloneNode(true) as HTMLElement;
          secondPageClone.style.width = '100%';
          secondPageClone.style.height = '100%';
          secondPageClone.style.padding = '0';
          secondPageClone.style.margin = '0';
          applyPDFStyling(secondPageClone);
          
          secondPageContainer.appendChild(secondPageClone);
          document.body.appendChild(secondPageContainer);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const secondPageCanvas = await html2canvas(secondPageContainer, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: Math.round(contentWidth * 3.78),
            height: Math.round(contentHeight * 3.78),
            logging: false,
            removeContainer: true,
            imageTimeout: 15000,
            onclone: (clonedDoc) => {
              const listItems = clonedDoc.querySelectorAll('li');
              listItems.forEach((li) => {
                const htmlLi = li as HTMLElement;
                htmlLi.style.listStyleType = 'none';
                htmlLi.style.listStyle = 'none';
                htmlLi.style.display = 'block';
                htmlLi.style.position = 'relative';
                htmlLi.style.paddingLeft = '1.2rem';
              });
              
              const lists = clonedDoc.querySelectorAll('ul, ol');
              lists.forEach((list) => {
                const htmlList = list as HTMLElement;
                htmlList.style.listStyleType = 'none';
                htmlList.style.paddingLeft = '0';
              });
            }
          });
          
          document.body.removeChild(secondPageContainer);
          
          const secondPageImgData = secondPageCanvas.toDataURL('image/png');
          pdf.addImage(secondPageImgData, 'PNG', marginInMM, marginInMM, contentWidth, contentHeight);
        }
        
        pdf.save(filename);
        return;
      }
    }
    
    // Standard single page or multi-page handling
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '8.5in';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '0';
    tempContainer.style.margin = '0';
    
    // Apply PDF styling while preserving list formatting
    applyPDFStyling(clonedElement);
    
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    // Wait for layout to complete
    await new Promise(resolve => setTimeout(resolve, 800));

    // Create canvas with higher scale for better quality
    const canvas = await html2canvas(tempContainer, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: Math.round(8.5 * 96), // 8.5 inches at 96 DPI
      height: tempContainer.scrollHeight,
      logging: false,
      removeContainer: true,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Ensure list styles use custom bullets only
        const listItems = clonedDoc.querySelectorAll('li');
        listItems.forEach((li) => {
          const htmlLi = li as HTMLElement;
          htmlLi.style.listStyleType = 'none';
          htmlLi.style.listStyle = 'none';
          htmlLi.style.display = 'block';
          htmlLi.style.position = 'relative';
          htmlLi.style.paddingLeft = '1.2rem';
        });
        
        const lists = clonedDoc.querySelectorAll('ul, ol');
        lists.forEach((list) => {
          const htmlList = list as HTMLElement;
          htmlList.style.listStyleType = 'none';
          htmlList.style.paddingLeft = '0';
        });
      }
    });

    // Clean up temporary element
    document.body.removeChild(tempContainer);

    const imgData = canvas.toDataURL('image/png');
    
    // Use 0.5 inch margins
    const marginInMM = 12.7; // 0.5 inch in mm
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const contentWidth = pageWidth - (2 * marginInMM);
    const contentHeight = pageHeight - (2 * marginInMM);

    // Calculate image dimensions maintaining aspect ratio
    const imgAspectRatio = canvas.width / canvas.height;
    
    // Scale to fit page width
    const imgWidth = contentWidth;
    const imgHeight = contentWidth / imgAspectRatio;
    
    // Position image with proper margins
    const xOffset = marginInMM;
    const yOffset = marginInMM;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', xOffset, yOffset + position, imgWidth, imgHeight);
    heightLeft -= contentHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = -contentHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', xOffset, yOffset + position, imgWidth, imgHeight);
      heightLeft -= contentHeight;
    }

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
