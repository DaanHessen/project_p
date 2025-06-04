/**
 * Robust PDF Export Utility for CV Page
 * Generates a professional PDF from the CV content
 */

import jsPDF from "jspdf";
import { toPng } from "html-to-image";

export const exportCVToPDF = async (
  setLoading?: (loading: boolean) => void,
): Promise<void> => {
  if (setLoading) setLoading(true);

  try {
    // Wait for page to be fully rendered
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get the CV elements with more specific selectors
    const cvContainer = document.querySelector(".cv-layout") as HTMLElement;

    if (!cvContainer) {
      throw new Error(
        "CV layout not found. Please ensure you are on the CV page.",
      );
    }

    console.log("CV container found:", cvContainer);

    // Create a temporary container for PDF generation with better styling
    const tempContainer = document.createElement("div");
    tempContainer.style.cssText = `
      position: fixed;
      top: -20000px;
      left: -20000px;
      width: 210mm;
      min-height: 297mm;
      background: white;
      color: #333;
      font-family: "Lora", "Space Grotesk", -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      z-index: -9999;
      display: flex;
      box-sizing: border-box;
      overflow: visible;
      transform: scale(1);
      transform-origin: top left;
    `;

    // Clone the entire CV layout
    const containerClone = cvContainer.cloneNode(true) as HTMLElement;

    // Apply comprehensive styling to the clone
    containerClone.style.cssText = `
      width: 100%;
      height: auto;
      min-height: 297mm;
      display: flex;
      background: white;
      color: #333;
      font-family: "Lora", "Space Grotesk", -apple-system, BlinkMacSystemFont, sans-serif;
      box-sizing: border-box;
      overflow: visible;
    `;

    // Clean up the cloned content for PDF
    const cleanElement = (element: HTMLElement) => {
      // Remove all interactive elements
      const interactiveElements = element.querySelectorAll(
        "button, .download-btn, .scroll-to-top-button, motion-div",
      );
      interactiveElements.forEach((el) => el.remove());

      // Remove any scroll disabled classes
      element.classList.remove("scroll-disabled");

      // Get all elements for styling
      const allElements = element.querySelectorAll(
        "*",
      ) as NodeListOf<HTMLElement>;

      allElements.forEach((el) => {
        // Remove any transform and animation properties
        el.style.transform = "none";
        el.style.animation = "none";
        el.style.transition = "none";

        // Fix all CSS custom properties to actual values
        const computedStyle = getComputedStyle(el);

        // Convert CSS variables to actual values
        if (computedStyle.color.includes("var(")) {
          if (computedStyle.color.includes("--text-primary")) {
            el.style.color = "#333";
          } else if (computedStyle.color.includes("--text-secondary")) {
            el.style.color = "#666";
          } else if (computedStyle.color.includes("--accent-primary")) {
            el.style.color = "#3b82f6";
          } else if (computedStyle.color.includes("--accent-green")) {
            el.style.color = "#10b981";
          }
        }

        if (computedStyle.backgroundColor.includes("var(")) {
          if (computedStyle.backgroundColor.includes("--bg-secondary")) {
            el.style.backgroundColor = "#f8f9fa";
          } else if (computedStyle.backgroundColor.includes("--bg-primary")) {
            el.style.backgroundColor = "white";
          }
        }

        // Apply specific fixes for different elements
        if (el.classList.contains("cv-sidebar")) {
          el.style.cssText += `
            width: 35% !important;
            background: #f8f9fa !important;
            padding: 1.5rem !important;
            color: #333 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 1.5rem !important;
            box-sizing: border-box !important;
          `;
        }

        if (el.classList.contains("cv-main-content")) {
          el.style.cssText += `
            flex: 1 !important;
            background: white !important;
            padding: 1.5rem 2rem !important;
            color: #333 !important;
            box-sizing: border-box !important;
            overflow: visible !important;
          `;
        }

        // Fix profile initials
        if (el.classList.contains("profile-initials")) {
          el.style.cssText += `
            background: #3b82f6 !important;
            color: white !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-weight: 700 !important;
          `;
        }

        // Fix section headings
        if (el.tagName === "H2" || el.classList.contains("section-heading")) {
          el.style.cssText += `
            color: #333 !important;
            border-bottom: 2px solid #3b82f6 !important;
            padding-bottom: 0.5rem !important;
            margin-bottom: 1rem !important;
            font-family: "Space Grotesk", sans-serif !important;
            font-weight: 700 !important;
          `;
        }

        // Fix job titles and degree titles
        if (
          el.classList.contains("job-title") ||
          el.classList.contains("degree-title")
        ) {
          el.style.cssText += `
            color: #3b82f6 !important;
            font-weight: 700 !important;
            font-family: "Space Grotesk", sans-serif !important;
          `;
        }

        // Fix year badges
        if (
          el.classList.contains("experience-years") ||
          el.classList.contains("education-years")
        ) {
          el.style.cssText += `
            background: #3b82f6 !important;
            color: white !important;
            border-radius: 4px !important;
            padding: 0.5rem !important;
            font-size: 0.875rem !important;
            font-weight: 600 !important;
            text-align: center !important;
          `;
        }

        // Fix contact icons
        if (el.classList.contains("contact-icon")) {
          el.style.cssText += `
            color: #3b82f6 !important;
            width: 1rem !important;
            height: 1rem !important;
          `;
        }

        // Fix section titles
        if (el.classList.contains("section-title")) {
          el.style.cssText += `
            color: #3b82f6 !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
            margin-bottom: 1rem !important;
          `;
        }

        // Remove any gradient backgrounds
        if (
          el.style.backgroundImage &&
          el.style.backgroundImage.includes("gradient")
        ) {
          el.style.backgroundImage = "none";
        }

        // Fix any webkit text properties
        el.style.webkitBackgroundClip = "unset";
        el.style.webkitTextFillColor = "unset";
        el.style.backgroundClip = "unset";
      });
    };

    // Clean the cloned content
    cleanElement(containerClone);

    // Add to temporary container
    tempContainer.appendChild(containerClone);
    document.body.appendChild(tempContainer);

    console.log("Temporary container created and added to DOM");

    // Wait for fonts and rendering
    await document.fonts.ready;
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Starting PNG generation...");

    // Generate PNG with high quality settings
    const dataUrl = await toPng(tempContainer, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: "white",
      width: tempContainer.offsetWidth,
      height: Math.max(tempContainer.offsetHeight, 1200),
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
      },
      filter: (node) => {
        // Filter out any unwanted elements
        if (node instanceof HTMLElement) {
          return (
            !node.classList.contains("download-btn") &&
            !node.classList.contains("scroll-to-top-button")
          );
        }
        return true;
      },
    });

    console.log("PNG generated, creating PDF...");

    // Verify we have actual image data
    if (!dataUrl || dataUrl === "data:," || dataUrl.length < 100) {
      throw new Error("Failed to generate image data from CV content");
    }

    // Create PDF with the image
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Calculate dimensions for A4
    const imgWidth = 210; // A4 width in mm
    const imgHeight = 297; // A4 height in mm

    // Add the image to PDF
    pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight);

    // Generate filename
    const now = new Date();
    const timestamp = now.toISOString().split("T")[0];
    const filename = `Daan_Hessen_CV_${timestamp}.pdf`;

    console.log("Saving PDF as:", filename);

    // Save the PDF
    pdf.save(filename);

    // Clean up
    document.body.removeChild(tempContainer);

    // Show success message
    showToast(`✅ CV downloaded as ${filename}`, "success");
  } catch (error) {
    console.error("PDF Export Error:", error);
    showToast("❌ Failed to generate PDF. Please try again.", "error");
  } finally {
    if (setLoading) setLoading(false);
  }
};

// Helper function to show toast messages
const showToast = (message: string, type: "success" | "error") => {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "success" ? "#10b981" : "#ef4444"};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    z-index: 10000;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 350px;
    word-wrap: break-word;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(
    () => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    },
    type === "success" ? 3000 : 5000,
  );
};
