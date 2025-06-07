
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (element: HTMLElement, filename: string = 'resume.pdf') => {
  try {
    // Create canvas from the HTML element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      height: element.scrollHeight,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Use a more reasonable margin for A4 resumes
    const marginInMM = 10; // 10mm margins (~0.4 inch, professional and space-efficient)
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const contentWidth = pageWidth - (2 * marginInMM); // 190mm content width
    const contentHeight = pageHeight - (2 * marginInMM); // 277mm content height
    
    // Calculate image dimensions maintaining aspect ratio
    const imgAspectRatio = canvas.width / canvas.height;
    const contentAspectRatio = contentWidth / contentHeight;

    
    let imgWidth, imgHeight;
    if (imgAspectRatio > contentAspectRatio) {
      // Image is wider relative to content area
      imgWidth = contentWidth;
      imgHeight = contentWidth / imgAspectRatio;
    } else {
      // Image is taller relative to content area
      imgHeight = contentHeight;
      imgWidth = contentHeight * imgAspectRatio;
    }
    
    // Center the image in the content area
    const xOffset = marginInMM + (contentWidth - imgWidth) / 2;
    const yOffset = marginInMM + (contentHeight - imgHeight) / 2;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let heightLeft = imgHeight;
    let position = yOffset;

    // Add first page
    pdf.addImage(imgData, 'PNG', xOffset, position, imgWidth, imgHeight);
    heightLeft -= contentHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = marginInMM - (imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', xOffset, position, imgWidth, imgHeight);
      heightLeft -= contentHeight;
    }

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
