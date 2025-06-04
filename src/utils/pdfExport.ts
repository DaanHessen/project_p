/**
 * Modern PDF Export Utility using Browser Print API
 * This provides better formatting and reliability than html2canvas + jsPDF
 */

import jsPDF from "jspdf";
import { toPng } from "html-to-image";

export const exportCVToPDF = async (setLoading?: (loading: boolean) => void): Promise<void> => {
  if (setLoading) setLoading(true);
  
  try {
    // Get the CV elements
    const cvSidebar = document.querySelector('.cv-sidebar') as HTMLElement;
    const cvMainContent = document.querySelector('.cv-main-content') as HTMLElement;
    
    if (!cvSidebar || !cvMainContent) {
      throw new Error('CV content not found. Please ensure you are on the CV page.');
    }

    // Create a temporary container for PDF generation
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = `
      position: fixed;
      top: -10000px;
      left: -10000px;
      width: 210mm;
      min-height: 297mm;
      background: white;
      color: #333;
      font-family: "Lora", "Space Grotesk", -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      z-index: -1;
      display: flex;
    `;

    // Clone and style sidebar
    const sidebarClone = cvSidebar.cloneNode(true) as HTMLElement;
    sidebarClone.style.cssText = `
      width: 35%;
      background: #f8f9fa;
      padding: 1.5rem;
      color: #333;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    `;

    // Clone and style main content
    const mainContentClone = cvMainContent.cloneNode(true) as HTMLElement;
    mainContentClone.style.cssText = `
      flex: 1;
      background: white;
      padding: 1.5rem 2rem;
      color: #333;
    `;

    // Clean up cloned content
    const cleanElement = (element: HTMLElement) => {
      // Remove interactive elements
      const buttonsToRemove = element.querySelectorAll('button, .download-btn, .scroll-to-top-button');
      buttonsToRemove.forEach(btn => btn.remove());
      
             // Fix colors for PDF
       const allElements = element.querySelectorAll('*');
              allElements.forEach((el) => {
         const htmlEl = el as HTMLElement;
         const computed = getComputedStyle(htmlEl);
         
         // Set text colors
         if (computed.color.includes('var(--text-primary)') || computed.color.includes('rgb(245, 247, 250)')) {
           htmlEl.style.color = '#333 !important';
         }
         if (computed.color.includes('var(--text-secondary)') || computed.color.includes('rgb(208, 214, 225)')) {
           htmlEl.style.color = '#666 !important';
         }
         if (computed.color.includes('var(--accent-primary)') || computed.color.includes('rgb(59, 130, 246)')) {
           htmlEl.style.color = '#3b82f6 !important';
         }
         
         // Fix backgrounds
         if (htmlEl.classList.contains('profile-initials') || htmlEl.classList.contains('logo-initials')) {
           htmlEl.style.background = '#3b82f6 !important';
           htmlEl.style.color = 'white !important';
         }
         
         // Fix section headers
         if (htmlEl.tagName === 'H2' && htmlEl.textContent) {
           htmlEl.style.color = '#333 !important';
           htmlEl.style.borderBottom = '2px solid #3b82f6 !important';
         }
         
         // Fix job titles and other accented elements
         if (htmlEl.classList.contains('job-title') || htmlEl.classList.contains('degree-title') || htmlEl.classList.contains('section-title')) {
           htmlEl.style.color = '#3b82f6 !important';
         }
         
         // Fix year badges
         if (htmlEl.classList.contains('experience-years') || htmlEl.classList.contains('education-years')) {
           htmlEl.style.background = '#3b82f6 !important';
           htmlEl.style.color = 'white !important';
         }
       });
    };

    cleanElement(sidebarClone);
    cleanElement(mainContentClone);

    tempContainer.appendChild(sidebarClone);
    tempContainer.appendChild(mainContentClone);
    document.body.appendChild(tempContainer);

    // Wait for fonts and images to load
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate PNG from the temp container
    const dataUrl = await toPng(tempContainer, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: 'white',
      width: tempContainer.offsetWidth,
      height: Math.max(tempContainer.offsetHeight, 1123), // A4 height at 96 DPI
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = 297; // A4 height in mm

    // Add image to PDF
    pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);

    // Generate filename with current date
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `Daan_Hessen_CV_${timestamp}.pdf`;

    // Download the PDF
    pdf.save(filename);

    // Clean up
    document.body.removeChild(tempContainer);

    // Show success message
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      z-index: 10000;
      font-family: "Space Grotesk", sans-serif;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    toast.textContent = `✅ CV downloaded as ${filename}`;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);

  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Show error message
    const errorToast = document.createElement('div');
    errorToast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      z-index: 10000;
      font-family: "Space Grotesk", sans-serif;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    errorToast.textContent = '❌ Failed to generate PDF. Please try again.';
    document.body.appendChild(errorToast);

    setTimeout(() => {
      if (document.body.contains(errorToast)) {
        document.body.removeChild(errorToast);
      }
    }, 5000);
    
  } finally {
    if (setLoading) setLoading(false);
  }
};


