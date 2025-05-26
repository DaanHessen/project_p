import figlet from "figlet";

// Pre-generated ASCII art for common cases to ensure they work
const preGeneratedAscii = {
  PROJECTS: `██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗███████╗
██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝
██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   ███████╗
██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   ╚════██║
██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ███████║
╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝`,

  BASE: `██████╗  █████╗ ███████╗███████╗
██╔══██╗██╔══██╗██╔════╝██╔════╝
██████╔╝███████║███████╗█████╗  
██╔══██╗██╔══██║╚════██║██╔══╝  
██████╔╝██║  ██║███████║███████╗
╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝`,

  PORTFOLIO: `██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ 
██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝`,
};

/**
 * Convert text to ANSI Shadow font ASCII art
 * @param text - The text to convert
 * @returns Promise that resolves to the ASCII art string
 */
export const textToAnsiShadow = (text: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if we have a pre-generated version
    const upperText = text.toUpperCase();
    if (preGeneratedAscii[upperText as keyof typeof preGeneratedAscii]) {
      resolve(preGeneratedAscii[upperText as keyof typeof preGeneratedAscii]);
      return;
    }

    figlet.text(text, { font: "ANSI Shadow" }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result || "");
    });
  });
};

/**
 * Convert text to ANSI Shadow font ASCII art synchronously
 * @param text - The text to convert
 * @returns The ASCII art string
 */
export const textToAnsiShadowSync = (text: string): string => {
  // Check if we have a pre-generated version first
  const upperText = text.toUpperCase();
  if (preGeneratedAscii[upperText as keyof typeof preGeneratedAscii]) {
    return preGeneratedAscii[upperText as keyof typeof preGeneratedAscii];
  }

  try {
    const result = figlet.textSync(text, { font: "ANSI Shadow" });
    return result;
  } catch (error) {
    console.error("Error converting text to ANSI Shadow:", error);
    return text; // Fallback to original text
  }
};

/**
 * Create ASCII art for project card titles based on project ID
 * @param projectId - The project ID to convert
 * @returns The ASCII art string
 */
export const createProjectCardTitle = (projectId: string): string => {
  // Handle special cases for better display
  let displayText: string;

  switch (projectId.toLowerCase()) {
    case "basebymonsees":
      // Shorter version for better fitting
      displayText = "BASE";
      break;
    case "portfolio":
      displayText = "PORTFOLIO";
      break;
    default:
      // General processing for other project IDs
      displayText = projectId
        .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capitals
        .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
        .toUpperCase(); // Convert to uppercase for better ASCII art
  }

  // If the text is too long, try to abbreviate or split it
  if (displayText.length > 15) {
    // For very long names, try to use just the first significant word
    const words = displayText.split(" ");
    if (words.length > 1 && words[0].length >= 4) {
      displayText = words[0];
    }
  }

  return textToAnsiShadowSync(displayText);
};

/**
 * Create ASCII art for the main "PROJECTS" title
 * @returns The ASCII art string for "PROJECTS"
 */
export const createProjectsTitle = (): string => {
  return textToAnsiShadowSync("PROJECTS");
};
