/**
 * Modern PDF Export Utility using Browser Print API
 * This provides better formatting and reliability than html2canvas + jsPDF
 */

export const exportCVToPDF = async (): Promise<void> => {
  try {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }

    // Get the CV content
    const cvSidebar = document.querySelector('.cv-sidebar');
    const cvMainContent = document.querySelector('.cv-main-content');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    if (!cvSidebar || !cvMainContent) {
      throw new Error('CV content not found');
    }

    // Clone the content
    const sidebarClone = cvSidebar.cloneNode(true) as HTMLElement;
    const mainContentClone = cvMainContent.cloneNode(true) as HTMLElement;

    // Remove interactive elements from clones
    const removeElements = (container: HTMLElement, selectors: string[]) => {
      selectors.forEach(selector => {
        const elements = container.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
    };

    removeElements(sidebarClone, ['.scroll-to-top-button', 'button', '.download-btn']);
    removeElements(mainContentClone, ['.scroll-to-top-button', 'button', '.download-btn']);

    // Generate the HTML for the print window
    const printHTML = `
<!DOCTYPE html>
<html lang="en" data-theme="${currentTheme}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daan Hessen - CV</title>
    <style>
        ${getComputedStylesAsString()}
        
        /* PDF-specific styles */
        @page {
            margin: 0;
            size: A4;
        }
        
        @media print {
            body {
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
                font-size: 14px !important;
            }
            
            .cv-pdf-container {
                display: flex !important;
                width: 100% !important;
                min-height: 100vh !important;
                background: white !important;
                color: #333 !important;
                page-break-inside: avoid;
            }
            
            .cv-sidebar-pdf {
                width: 35% !important;
                background: #f8f9fa !important;
                padding: 1.5rem !important;
                color: #333 !important;
                page-break-inside: avoid;
            }
            
            .cv-main-pdf {
                flex: 1 !important;
                padding: 1.5rem 2rem !important;
                background: white !important;
                color: #333 !important;
            }
            
            .profile-initials {
                background: #3b82f6 !important;
                color: white !important;
            }
            
            .contact-icon {
                color: #3b82f6 !important;
            }
            
            .cv-section h2 {
                color: #333 !important;
                border-bottom: 2px solid #3b82f6 !important;
            }
            
            .job-title, .degree-title {
                color: #3b82f6 !important;
            }
            
            .experience-years, .education-years {
                background: #3b82f6 !important;
                color: white !important;
            }
            
            .skill-category h4 {
                color: #3b82f6 !important;
            }
            
            /* Ensure proper text colors for PDF */
            * {
                color: #333 !important;
            }
            
            h1, h2, h3, h4, h5, h6 {
                color: #333 !important;
            }
            
            .section-title {
                color: #3b82f6 !important;
            }
        }
        
        /* Screen styles for preview */
        @media screen {
            body {
                margin: 0;
                padding: 20px;
                font-family: "Lora", "Space Grotesk", -apple-system, BlinkMacSystemFont, sans-serif;
                line-height: 1.6;
                background: #f5f5f5;
            }
            
            .cv-pdf-container {
                max-width: 210mm;
                margin: 0 auto;
                background: white;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                display: flex;
                min-height: 297mm;
            }
            
            .cv-sidebar-pdf {
                width: 35%;
                background: #f8f9fa;
                padding: 1.5rem;
            }
            
            .cv-main-pdf {
                flex: 1;
                padding: 1.5rem 2rem;
            }
            
            .print-button {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #3b82f6;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                z-index: 1000;
            }
            
            .print-button:hover {
                background: #2563eb;
            }
        }
    </style>
</head>
<body>
    <div class="cv-pdf-container">
        <div class="cv-sidebar-pdf">
            ${sidebarClone.innerHTML}
        </div>
        <div class="cv-main-pdf">
            ${mainContentClone.innerHTML}
        </div>
    </div>
    
    <button class="print-button" onclick="window.print()">Print / Save as PDF</button>
    
    <script>
        // Auto-print when page loads
        window.onload = function() {
            // Small delay to ensure styles are loaded
            setTimeout(() => {
                window.print();
            }, 500);
        };
        
        // Close window after printing
        window.onafterprint = function() {
            setTimeout(() => {
                window.close();
            }, 1000);
        };
    </script>
</body>
</html>`;

    // Write the HTML to the new window
    printWindow.document.write(printHTML);
    printWindow.document.close();

  } catch (error) {
    console.error("Error generating PDF:", error);
    
    // Fallback: Use browser's print functionality on current page
    if (confirm("PDF generation failed. Would you like to use the browser's print function instead?")) {
      window.print();
    }
  }
};

/**
 * Extract computed styles from the current page for PDF generation
 */
function getComputedStylesAsString(): string {
  const styles: string[] = [];
  
  // Get all stylesheets
  for (let i = 0; i < document.styleSheets.length; i++) {
    try {
      const styleSheet = document.styleSheets[i] as CSSStyleSheet;
      if (styleSheet.cssRules) {
        for (let j = 0; j < styleSheet.cssRules.length; j++) {
          styles.push(styleSheet.cssRules[j].cssText);
        }
      }
    } catch (e) {
      // Cross-origin stylesheets may throw errors
      console.warn('Could not access stylesheet:', e);
    }
  }
  
  return styles.join('\n');
}
