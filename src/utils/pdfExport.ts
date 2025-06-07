
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (element: HTMLElement, filename: string = 'resume.pdf') => {
  try {
    // Create a temporary container for clean PDF rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '8.5in';
    tempContainer.style.background = 'white';
    tempContainer.style.padding = '1in'; // Standard 1 inch margins
    tempContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    tempContainer.style.fontSize = '12pt';
    tempContainer.style.lineHeight = '1.4';
    tempContainer.style.color = '#000';
    
    // Clone the resume content without the preview styling
    const resumeElement = element.querySelector('.resume-template');
    if (!resumeElement) {
      throw new Error('Resume template not found');
    }
    
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
    
    // Remove preview-specific classes and styling
    clonedElement.classList.remove('shadow-lg', 'border', 'border-gray-200');
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.border = 'none';
    clonedElement.style.transform = 'none';
    clonedElement.style.width = '100%';
    clonedElement.style.minHeight = 'auto';
    clonedElement.style.padding = '0';
    clonedElement.style.margin = '0';
    
    // Ensure list styling is preserved for PDF
    const lists = clonedElement.querySelectorAll('ul, ol');
    lists.forEach(list => {
      list.style.listStyleType = list.tagName === 'UL' ? 'disc' : 'decimal';
      list.style.paddingLeft = '1.5em';
      list.style.marginLeft = '0';
    });
    
    const listItems = clonedElement.querySelectorAll('li');
    listItems.forEach(item => {
      item.style.display = 'list-item';
      item.style.listStyleType = 'inherit';
      item.style.listStylePosition = 'outside';
      item.style.marginBottom = '0.25em';
    });
    
    // Check if this is a two-page layout
    const isTwoPageLayout = clonedElement.querySelector('.resume-two-page');
    
    if (isTwoPageLayout) {
      // Handle two-page layout specially
      const firstPageElement = clonedElement.querySelector('.resume-page-first') as HTMLElement;
      const secondPageElement = clonedElement.querySelector('.resume-page-second') as HTMLElement;
      
      if (firstPageElement && secondPageElement) {
        // Apply list styling to both pages
        [firstPageElement, secondPageElement].forEach(pageElement => {
          const pageLists = pageElement.querySelectorAll('ul, ol');
          pageLists.forEach(list => {
            list.style.listStyleType = list.tagName === 'UL' ? 'disc' : 'decimal';
            list.style.paddingLeft = '1.5em';
            list.style.marginLeft = '0';
          });
          
          const pageListItems = pageElement.querySelectorAll('li');
          pageListItems.forEach(item => {
            item.style.display = 'list-item';
            item.style.listStyleType = 'inherit';
            item.style.listStylePosition = 'outside';
            item.style.marginBottom = '0.25em';
          });
        });
        
        // Create PDF with proper page breaks
        const pdf = new jsPDF('p', 'mm', 'a4');
        const marginInMM = 25.4; // 1 inch in mm
        const pageWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const contentWidth = pageWidth - (2 * marginInMM);
        const contentHeight = pageHeight - (2 * marginInMM);
        
        // Render first page
        const firstPageContainer = document.createElement('div');
        firstPageContainer.style.position = 'absolute';
        firstPageContainer.style.left = '-9999px';
        firstPageContainer.style.top = '0';
        firstPageContainer.style.width = '6.5in'; // 8.5 - 2 inch margins
        firstPageContainer.style.height = '9in'; // 11 - 2 inch margins
        firstPageContainer.style.background = 'white';
        firstPageContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        firstPageContainer.style.fontSize = '12pt';
        firstPageContainer.style.lineHeight = '1.4';
        firstPageContainer.style.color = '#000';
        firstPageContainer.style.overflow = 'hidden';
        
        const clonedFirstPage = firstPageElement.cloneNode(true) as HTMLElement;
        clonedFirstPage.style.width = '100%';
        clonedFirstPage.style.height = '100%';
        clonedFirstPage.style.overflow = 'hidden';
        firstPageContainer.appendChild(clonedFirstPage);
        document.body.appendChild(firstPageContainer);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const firstPageCanvas = await html2canvas(firstPageContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: Math.round(6.5 * 96),
          height: Math.round(9 * 96),
          logging: false,
          onclone: (clonedDoc) => {
            // Ensure list styles are applied in the cloned document
            const clonedLists = clonedDoc.querySelectorAll('ul, ol');
            clonedLists.forEach(list => {
              (list as HTMLElement).style.listStyleType = list.tagName === 'UL' ? 'disc' : 'decimal';
              (list as HTMLElement).style.paddingLeft = '1.5em';
              (list as HTMLElement).style.marginLeft = '0';
            });
            
            const clonedListItems = clonedDoc.querySelectorAll('li');
            clonedListItems.forEach(item => {
              (item as HTMLElement).style.display = 'list-item';
              (item as HTMLElement).style.listStyleType = 'inherit';
              (item as HTMLElement).style.listStylePosition = 'outside';
            });
          }
        });
        
        document.body.removeChild(firstPageContainer);
        
        const firstPageImgData = firstPageCanvas.toDataURL('image/png');
        const imgWidth = contentWidth;
        const imgHeight = contentHeight;
        
        pdf.addImage(firstPageImgData, 'PNG', marginInMM, marginInMM, imgWidth, imgHeight);
        
        // Add second page
        if (secondPageElement.textContent?.trim()) {
          pdf.addPage();
          
          const secondPageContainer = document.createElement('div');
          secondPageContainer.style.position = 'absolute';
          secondPageContainer.style.left = '-9999px';
          secondPageContainer.style.top = '0';
          secondPageContainer.style.width = '6.5in';
          secondPageContainer.style.height = '9in';
          secondPageContainer.style.background = 'white';
          secondPageContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
          secondPageContainer.style.fontSize = '12pt';
          secondPageContainer.style.lineHeight = '1.4';
          secondPageContainer.style.color = '#000';
          secondPageContainer.style.overflow = 'hidden';
          
          const clonedSecondPage = secondPageElement.cloneNode(true) as HTMLElement;
          clonedSecondPage.style.width = '100%';
          clonedSecondPage.style.height = '100%';
          clonedSecondPage.style.overflow = 'hidden';
          secondPageContainer.appendChild(clonedSecondPage);
          document.body.appendChild(secondPageContainer);
          
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const secondPageCanvas = await html2canvas(secondPageContainer, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: Math.round(6.5 * 96),
            height: Math.round(9 * 96),
            logging: false,
            onclone: (clonedDoc) => {
              // Ensure list styles are applied in the cloned document
              const clonedLists = clonedDoc.querySelectorAll('ul, ol');
              clonedLists.forEach(list => {
                (list as HTMLElement).style.listStyleType = list.tagName === 'UL' ? 'disc' : 'decimal';
                (list as HTMLElement).style.paddingLeft = '1.5em';
                (list as HTMLElement).style.marginLeft = '0';
              });
              
              const clonedListItems = clonedDoc.querySelectorAll('li');
              clonedListItems.forEach(item => {
                (item as HTMLElement).style.display = 'list-item';
                (item as HTMLElement).style.listStyleType = 'inherit';
                (item as HTMLElement).style.listStylePosition = 'outside';
              });
            }
          });
          
          document.body.removeChild(secondPageContainer);
          
          const secondPageImgData = secondPageCanvas.toDataURL('image/png');
          pdf.addImage(secondPageImgData, 'PNG', marginInMM, marginInMM, imgWidth, imgHeight);
        }
        
        pdf.save(filename);
        return;
      }
    }
    
    // Standard single page or multi-page handling
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    // Wait for layout to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create canvas from the clean HTML element
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: Math.round(6.5 * 96), // 6.5 inches (8.5 - 2 inch margins)
      height: tempContainer.scrollHeight,
      logging: false,
      onclone: (clonedDoc) => {
        // Ensure list styles are applied in the cloned document
        const clonedLists = clonedDoc.querySelectorAll('ul, ol');
        clonedLists.forEach(list => {
          (list as HTMLElement).style.listStyleType = list.tagName === 'UL' ? 'disc' : 'decimal';
          (list as HTMLElement).style.paddingLeft = '1.5em';
          (list as HTMLElement).style.marginLeft = '0';
        });
        
        const clonedListItems = clonedDoc.querySelectorAll('li');
        clonedListItems.forEach(item => {
          (item as HTMLElement).style.display = 'list-item';
          (item as HTMLElement).style.listStyleType = 'inherit';
          (item as HTMLElement).style.listStylePosition = 'outside';
        });
      }
    });

    // Clean up temporary element
    document.body.removeChild(tempContainer);

    const imgData = canvas.toDataURL('image/png');
    
    // Use standard 1 inch margins
    const marginInMM = 25.4; // 1 inch in mm
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const contentWidth = pageWidth - (2 * marginInMM);
    const contentHeight = pageHeight - (2 * marginInMM);

    // Calculate image dimensions maintaining aspect ratio
    const imgAspectRatio = canvas.width / canvas.height;
    
    // Scale to fit page width
    const imgWidth = contentWidth;
    const imgHeight = contentWidth / imgAspectRatio;
    
    // Position image at top-left of content area
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
      position = -contentHeight; // Move up by one page height
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
