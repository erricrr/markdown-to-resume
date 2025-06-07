
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
    
    // Enhanced list styling for PDF with better bullet alignment and size
    const lists = clonedElement.querySelectorAll('ul, ol');
    lists.forEach(list => {
      const htmlList = list as HTMLElement;
      htmlList.style.listStyleType = list.tagName === 'UL' ? 'disc' : 'decimal';
      htmlList.style.paddingLeft = '20px';
      htmlList.style.marginLeft = '0';
      htmlList.style.marginBottom = '8px';
      htmlList.style.fontSize = '12pt';
    });
    
    const listItems = clonedElement.querySelectorAll('li');
    listItems.forEach(item => {
      const htmlItem = item as HTMLElement;
      htmlItem.style.display = 'list-item';
      htmlItem.style.listStyleType = 'inherit';
      htmlItem.style.listStylePosition = 'outside';
      htmlItem.style.marginBottom = '4px';
      htmlItem.style.paddingLeft = '4px';
      htmlItem.style.fontSize = '12pt';
      htmlItem.style.lineHeight = '1.4';
    });
    
    // Check if this is a two-page layout
    const isTwoPageLayout = clonedElement.querySelector('.resume-two-page');
    
    if (isTwoPageLayout) {
      // Handle two-page layout specially
      const firstPageElement = clonedElement.querySelector('.resume-page-first') as HTMLElement;
      const secondPageElement = clonedElement.querySelector('.resume-page-second') as HTMLElement;
      
      if (firstPageElement && secondPageElement) {
        // Apply enhanced list styling to both pages
        [firstPageElement, secondPageElement].forEach(pageElement => {
          const pageLists = pageElement.querySelectorAll('ul, ol');
          pageLists.forEach(list => {
            const htmlList = list as HTMLElement;
            htmlList.style.listStyleType = list.tagName === 'UL' ? 'disc' : 'decimal';
            htmlList.style.paddingLeft = '20px';
            htmlList.style.marginLeft = '0';
            htmlList.style.marginBottom = '8px';
            htmlList.style.fontSize = '12pt';
          });
          
          const pageListItems = pageElement.querySelectorAll('li');
          pageListItems.forEach(item => {
            const htmlItem = item as HTMLElement;
            htmlItem.style.display = 'list-item';
            htmlItem.style.listStyleType = 'inherit';
            htmlItem.style.listStylePosition = 'outside';
            htmlItem.style.marginBottom = '4px';
            htmlItem.style.paddingLeft = '4px';
            htmlItem.style.fontSize = '12pt';
            htmlItem.style.lineHeight = '1.4';
          });
        });
        
        // Create PDF with proper page breaks and margins
        const pdf = new jsPDF('p', 'mm', 'a4');
        const marginInMM = 25.4; // 1 inch in mm
        const pageWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const contentWidth = pageWidth - (2 * marginInMM);
        const contentHeight = pageHeight - (2 * marginInMM);
        
        // Render first page with proper content area
        const firstPageContainer = document.createElement('div');
        firstPageContainer.style.position = 'absolute';
        firstPageContainer.style.left = '-9999px';
        firstPageContainer.style.top = '0';
        firstPageContainer.style.width = `${contentWidth}mm`;
        firstPageContainer.style.height = `${contentHeight}mm`;
        firstPageContainer.style.background = 'white';
        firstPageContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        firstPageContainer.style.fontSize = '12pt';
        firstPageContainer.style.lineHeight = '1.4';
        firstPageContainer.style.color = '#000';
        firstPageContainer.style.overflow = 'hidden';
        firstPageContainer.style.padding = '0';
        firstPageContainer.style.margin = '0';
        
        const clonedFirstPage = firstPageElement.cloneNode(true) as HTMLElement;
        clonedFirstPage.style.width = '100%';
        clonedFirstPage.style.height = '100%';
        clonedFirstPage.style.overflow = 'hidden';
        clonedFirstPage.style.padding = '0';
        clonedFirstPage.style.margin = '0';
        firstPageContainer.appendChild(clonedFirstPage);
        document.body.appendChild(firstPageContainer);
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const firstPageCanvas = await html2canvas(firstPageContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: Math.round(contentWidth * 3.78), // Convert mm to pixels (96 DPI)
          height: Math.round(contentHeight * 3.78),
          logging: false,
          onclone: (clonedDoc) => {
            // Ensure enhanced list styles are applied in the cloned document
            const clonedLists = clonedDoc.querySelectorAll('ul, ol');
            clonedLists.forEach(list => {
              const htmlList = list as HTMLElement;
              htmlList.style.listStyleType = list.tagName === 'UL' ? 'disc' : 'decimal';
              htmlList.style.paddingLeft = '20px';
              htmlList.style.marginLeft = '0';
              htmlList.style.fontSize = '12pt';
            });
            
            const clonedListItems = clonedDoc.querySelectorAll('li');
            clonedListItems.forEach(item => {
              const htmlItem = item as HTMLElement;
              htmlItem.style.display = 'list-item';
              htmlItem.style.listStyleType = 'inherit';
              htmlItem.style.listStylePosition = 'outside';
              htmlItem.style.paddingLeft = '4px';
              htmlItem.style.fontSize = '12pt';
              htmlItem.style.lineHeight = '1.4';
            });
          }
        });
        
        document.body.removeChild(firstPageContainer);
        
        const firstPageImgData = firstPageCanvas.toDataURL('image/png');
        pdf.addImage(firstPageImgData, 'PNG', marginInMM, marginInMM, contentWidth, contentHeight);
        
        // Add second page with proper margins
        if (secondPageElement.textContent?.trim()) {
          pdf.addPage();
          
          const secondPageContainer = document.createElement('div');
          secondPageContainer.style.position = 'absolute';
          secondPageContainer.style.left = '-9999px';
          secondPageContainer.style.top = '0';
          secondPageContainer.style.width = `${contentWidth}mm`;
          secondPageContainer.style.height = `${contentHeight}mm`;
          secondPageContainer.style.background = 'white';
          secondPageContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
          secondPageContainer.style.fontSize = '12pt';
          secondPageContainer.style.lineHeight = '1.4';
          secondPageContainer.style.color = '#000';
          secondPageContainer.style.overflow = 'hidden';
          secondPageContainer.style.padding = '0';
          secondPageContainer.style.margin = '0';
          
          const clonedSecondPage = secondPageElement.cloneNode(true) as HTMLElement;
          clonedSecondPage.style.width = '100%';
          clonedSecondPage.style.height = '100%';
          clonedSecondPage.style.overflow = 'hidden';
          clonedSecondPage.style.padding = '0';
          clonedSecondPage.style.margin = '0';
          secondPageContainer.appendChild(clonedSecondPage);
          document.body.appendChild(secondPageContainer);
          
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const secondPageCanvas = await html2canvas(secondPageContainer, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: Math.round(contentWidth * 3.78),
            height: Math.round(contentHeight * 3.78),
            logging: false,
            onclone: (clonedDoc) => {
              // Ensure enhanced list styles are applied in the cloned document
              const clonedLists = clonedDoc.querySelectorAll('ul, ol');
              clonedLists.forEach(list => {
                const htmlList = list as HTMLElement;
                htmlList.style.listStyleType = list.tagName === 'UL' ? 'disc' : 'decimal';
                htmlList.style.paddingLeft = '20px';
                htmlList.style.marginLeft = '0';
                htmlList.style.fontSize = '12pt';
              });
              
              const clonedListItems = clonedDoc.querySelectorAll('li');
              clonedListItems.forEach(item => {
                const htmlItem = item as HTMLElement;
                htmlItem.style.display = 'list-item';
                htmlItem.style.listStyleType = 'inherit';
                htmlItem.style.listStylePosition = 'outside';
                htmlItem.style.paddingLeft = '4px';
                htmlItem.style.fontSize = '12pt';
                htmlItem.style.lineHeight = '1.4';
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
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    // Wait for layout to complete
    await new Promise(resolve => setTimeout(resolve, 200));

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
        // Ensure enhanced list styles are applied in the cloned document
        const clonedLists = clonedDoc.querySelectorAll('ul, ol');
        clonedLists.forEach(list => {
          const htmlList = list as HTMLElement;
          htmlList.style.listStyleType = list.tagName === 'UL' ? 'disc' : 'decimal';
          htmlList.style.paddingLeft = '20px';
          htmlList.style.marginLeft = '0';
          htmlList.style.fontSize = '12pt';
        });
        
        const clonedListItems = clonedDoc.querySelectorAll('li');
        clonedListItems.forEach(item => {
          const htmlItem = item as HTMLElement;
          htmlItem.style.display = 'list-item';
          htmlItem.style.listStyleType = 'inherit';
          htmlItem.style.listStylePosition = 'outside';
          htmlItem.style.paddingLeft = '4px';
          htmlItem.style.fontSize = '12pt';
          htmlItem.style.lineHeight = '1.4';
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
    
    // Position image at top-left of content area with proper margins
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
