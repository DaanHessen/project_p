import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportCVToPDF = async (): Promise<void> => {
  try {
    // Get the CV content element
    const cvElement = document.querySelector(".cv-content") as HTMLElement;
    if (!cvElement) {
      throw new Error("CV content not found");
    }

    // Create a clone of the CV content for PDF generation
    const clonedElement = cvElement.cloneNode(true) as HTMLElement;

    // Create a temporary container for the PDF content
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "0";
    tempContainer.style.width = "210mm"; // A4 width
    tempContainer.style.minHeight = "297mm"; // A4 height
    tempContainer.style.backgroundColor = "white";
    tempContainer.style.padding = "20mm";
    tempContainer.style.fontFamily = '"Lora", serif';
    tempContainer.style.fontSize = "12px";
    tempContainer.style.lineHeight = "1.5";
    tempContainer.style.color = "#1e293b";

    // Override dark theme styles for PDF
    tempContainer.style.setProperty("--bg-primary", "#ffffff");
    tempContainer.style.setProperty("--bg-secondary", "#f8fafc");
    tempContainer.style.setProperty("--bg-tertiary", "#e2e8f0");
    tempContainer.style.setProperty("--text-primary", "#1e293b");
    tempContainer.style.setProperty("--text-secondary", "#475569");
    tempContainer.style.setProperty("--text-tertiary", "#64748b");
    tempContainer.style.setProperty("--accent-primary", "#3b82f6");

    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    // Wait for fonts to load
    await document.fonts.ready;

    // Configure html2canvas options
    const canvas = await html2canvas(tempContainer, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: tempContainer.offsetWidth,
      height: tempContainer.offsetHeight,
      onclone: (clonedDoc) => {
        // Ensure the cloned document has proper styling
        const clonedContainer = clonedDoc.querySelector("div") as HTMLElement;
        if (clonedContainer) {
          clonedContainer.style.backgroundColor = "white";
          clonedContainer.style.color = "#1e293b";

          // Override any dark theme styles in the cloned document
          const allElements = clonedContainer.querySelectorAll("*");
          allElements.forEach((el) => {
            const element = el as HTMLElement;
            if (
              element.style.color &&
              element.style.color.includes("var(--text")
            ) {
              element.style.color = "#1e293b";
            }
            if (
              element.style.backgroundColor &&
              element.style.backgroundColor.includes("var(--bg")
            ) {
              element.style.backgroundColor = "white";
            }
          });
        }
      },
    });

    // Clean up temporary container
    document.body.removeChild(tempContainer);

    // Create PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    const timestamp = new Date().toISOString().slice(0, 10);
    pdf.save(`Daan_Hessen_CV_${timestamp}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("There was an error generating the PDF. Please try again.");
  }
};
