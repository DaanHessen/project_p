import {
  fetchCVProfile,
  fetchCVExperience,
  fetchCVEducation,
  fetchCVSkills,
  type CVProfile,
  type CVExperience,
  type CVEducation,
  type CVSkill,
} from "./database";

export interface CVBackupData {
  profile: CVProfile | null;
  experience: CVExperience[];
  education: CVEducation[];
  skills: CVSkill[];
  exportDate: string;
  version: string;
}

// Default fallback data
const fallbackCVData: CVBackupData = {
  profile: {
    id: 1,
    Name: "DAAN HESSEN",
    Title: "SOFTWARE DEVELOPER",
    Email: "daan2002@gmail.com",
    Phone: "+31 647 072 045",
    Location: "Hilversum, Netherlands",
    Website: "daanhessen.nl",
    LinkedIn: "linkedin.com/in/daanhessen",
    Summary:
      "Passionate HBO-ICT student specializing in Software Development with hands-on experience in modern programming languages and web technologies. Currently in my second year at University of Applied Sciences Utrecht, combining academic knowledge with practical application. Strong background in hospitality with international work experience, bringing excellent communication skills and cultural awareness to technical projects.",
  },
  experience: [
    {
      id: 1,
      JobTitle: "BARTENDER",
      Company: "Brasserie Monsees",
      Location: "Hilversum",
      StartYear: "2022",
      EndYear: "2024",
      Description:
        "Provided exceptional customer service in an upscale dining environment. Managed high-volume service periods while maintaining quality standards. Collaborated with kitchen and service teams to ensure seamless operations.",
      Highlights:
        "Handled customer relations and complaint resolution|Managed inventory and point-of-sale systems|Trained new staff members on service protocols",
      IsCurrent: false,
    },
    {
      id: 2,
      JobTitle: "INTERNATIONAL BARTENDER",
      Company: "Ambrosius Stube",
      Location: "Lech, Austria",
      StartYear: "2022",
      EndYear: "2022",
      Description:
        "Seasonal position in alpine resort setting, serving international clientele. Developed cultural sensitivity and multilingual communication skills.",
      Highlights:
        "Served diverse international customers|Adapted to high-pressure seasonal environment|Enhanced German language proficiency",
      IsCurrent: false,
    },
    {
      id: 3,
      JobTitle: "SERVER & BARTENDER",
      Company: "Oh Lobo",
      Location: "Hilversum",
      StartYear: "2019",
      EndYear: "2020",
      Description:
        "Entry-level position developing foundational hospitality skills and customer service excellence in fast-paced environment.",
      Highlights: "",
      IsCurrent: false,
    },
  ],
  education: [
    {
      id: 1,
      Degree: "HBO-ICT SOFTWARE DEVELOPMENT",
      Institution: "University of Applied Sciences Utrecht",
      StartYear: "2023",
      EndYear: "Present",
      Description:
        "Currently in second year of Bachelor's program focusing on software development, programming methodologies, and modern software architecture. Hands-on experience with various programming languages and development frameworks.",
      Highlights:
        "Object-Oriented Programming|Web Development|Database Design|Software Architecture",
      IsCurrent: true,
    },
    {
      id: 2,
      Degree: "HBO CREATIVE BUSINESS",
      Institution: "University of Applied Sciences Amsterdam",
      StartYear: "2020",
      EndYear: "2022",
      Description:
        "Initial studies in business and creative industries before transitioning to technical focus. Developed foundational business acumen and project management skills.",
      Highlights: "",
      IsCurrent: false,
    },
  ],
  skills: [
    {
      id: 1,
      Category: "Programming Languages",
      Skills: "Java|JavaScript|TypeScript|Python",
    },
    {
      id: 2,
      Category: "Web Technologies",
      Skills: "React|HTML/CSS|Node.js|REST APIs",
    },
    {
      id: 3,
      Category: "Languages",
      Skills: "Dutch (Native)|English (Fluent)|German (Intermediate)",
    },
  ],
  exportDate: "2024-01-01",
  version: "1.0",
};

// Export CV data to JSON
export const exportCVToJSON = async (): Promise<CVBackupData> => {
  try {
    console.log("📄 Exporting CV data to JSON...");

    const [profile, experience, education, skills] = await Promise.all([
      fetchCVProfile(),
      fetchCVExperience(),
      fetchCVEducation(),
      fetchCVSkills(),
    ]);

    const backupData: CVBackupData = {
      profile,
      experience,
      education,
      skills,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    // Save to localStorage as backup
    localStorage.setItem("cv-backup-data", JSON.stringify(backupData));

    console.log("✅ CV data exported successfully");
    return backupData;
  } catch (error) {
    console.error("❌ Error exporting CV data:", error);
    return fallbackCVData;
  }
};

// Load CV data with fallback system
export const loadCVDataWithFallback = async (): Promise<CVBackupData> => {
  try {
    console.log("🔄 Loading CV data from database...");

    // Try to load from database first
    const [profile, experience, education, skills] = await Promise.all([
      fetchCVProfile(),
      fetchCVExperience(),
      fetchCVEducation(),
      fetchCVSkills(),
    ]);

    // Check if we got valid data
    if (
      profile ||
      experience.length > 0 ||
      education.length > 0 ||
      skills.length > 0
    ) {
      const data: CVBackupData = {
        profile,
        experience,
        education,
        skills,
        exportDate: new Date().toISOString(),
        version: "1.0",
      };

      // Update backup in localStorage
      localStorage.setItem("cv-backup-data", JSON.stringify(data));
      console.log("✅ CV data loaded from database");
      return data;
    } else {
      throw new Error("No data returned from database");
    }
  } catch (error) {
    console.warn("⚠️ Database unavailable, trying backup sources...", error);

    // Try localStorage backup first
    try {
      const backupData = localStorage.getItem("cv-backup-data");
      if (backupData) {
        const parsedData = JSON.parse(backupData) as CVBackupData;
        console.log("✅ CV data loaded from localStorage backup");
        return parsedData;
      }
    } catch (backupError) {
      console.warn("⚠️ localStorage backup failed:", backupError);
    }

    // Fall back to hardcoded data
    console.log("📋 Using fallback CV data");
    return fallbackCVData;
  }
};

// Download CV data as JSON file
export const downloadCVBackup = async (): Promise<void> => {
  try {
    const data = await exportCVToJSON();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cv-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log("✅ CV backup file downloaded");
  } catch (error) {
    console.error("❌ Error downloading CV backup:", error);
  }
};

// Check for data changes and auto-backup
export const scheduleAutoBackup = (): void => {
  // Check if we should create a backup (once per day)
  const lastBackup = localStorage.getItem("cv-last-backup");
  const now = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  if (!lastBackup || lastBackup !== now) {
    exportCVToJSON().then(() => {
      localStorage.setItem("cv-last-backup", now);
      console.log("📅 Auto-backup completed for", now);
    });
  }
};
