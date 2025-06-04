import { neon } from "@neondatabase/serverless";

// Database connection with proper error handling
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

console.log("🔧 Environment check:", {
  hasViteEnv: !!import.meta.env.VITE_DATABASE_URL,
  envMode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
});

if (!databaseUrl) {
  const errorMsg =
    "❌ VITE_DATABASE_URL environment variable is not set. Please configure it in Vercel project settings.";
  console.error(errorMsg);
  throw new Error(errorMsg);
}

console.log(
  "✅ Database URL configured for environment:",
  import.meta.env.MODE,
);

const sql = neon(databaseUrl);

export interface Project {
  id: number;
  Name: string;
  Description: string;
  OneLiner: string;
  Link: string;
  Technologies: string;
  Status: string;
  AddedAt: string;
}

export interface CVProfile {
  id: number;
  Name: string;
  Title: string;
  Email: string;
  Phone: string;
  Location: string;
  Website: string;
  LinkedIn: string;
  Summary: string;
}

export interface CVExperience {
  id: number;
  JobTitle: string;
  Company: string;
  Location: string;
  StartYear: string;
  EndYear: string;
  Description: string;
  Highlights: string;
  IsCurrent: boolean;
}

export interface CVEducation {
  id: number;
  Degree: string;
  Institution: string;
  StartYear: string;
  EndYear: string;
  Description: string;
  Highlights: string;
  IsCurrent: boolean;
}

export interface CVSkill {
  id: number;
  Category: string;
  Skills: string;
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    console.log("🔍 Fetching projects from database...");

    const result = await sql`
      SELECT id, "Name", "Description", "OneLiner", "Link", "Technologies", "Status", "AddedAt" 
      FROM "Projects" 
      ORDER BY id DESC
    `;

    console.log("✅ Projects fetched successfully:", result.length, "projects");
    return result as Project[];
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    return [];
  }
}

export async function getProjectById(id: number): Promise<Project | null> {
  try {
    const result = await sql`
      SELECT id, "Name", "Description", "OneLiner", "Link", "Technologies", "Status", "AddedAt" 
      FROM "Projects" 
      WHERE id = ${id}
    `;

    return (result[0] as Project) || null;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return null;
  }
}

// CV Database Functions
export async function initializeCVTables(): Promise<void> {
  try {
    console.log("🔧 Initializing CV tables...");

    // Create CVProfile table
    await sql`
      CREATE TABLE IF NOT EXISTS "CVProfile" (
        id SERIAL PRIMARY KEY,
        "Name" VARCHAR(255) NOT NULL,
        "Title" VARCHAR(255) NOT NULL,
        "Email" VARCHAR(255) NOT NULL,
        "Phone" VARCHAR(50),
        "Location" VARCHAR(255),
        "Website" VARCHAR(255),
        "LinkedIn" VARCHAR(255),
        "Summary" TEXT
      )
    `;

    // Create CVExperience table
    await sql`
      CREATE TABLE IF NOT EXISTS "CVExperience" (
        id SERIAL PRIMARY KEY,
        "JobTitle" VARCHAR(255) NOT NULL,
        "Company" VARCHAR(255) NOT NULL,
        "Location" VARCHAR(255),
        "StartYear" VARCHAR(10) NOT NULL,
        "EndYear" VARCHAR(10),
        "Description" TEXT,
        "Highlights" TEXT,
        "IsCurrent" BOOLEAN DEFAULT false,
        "SortOrder" INTEGER DEFAULT 0
      )
    `;

    // Create CVEducation table
    await sql`
      CREATE TABLE IF NOT EXISTS "CVEducation" (
        id SERIAL PRIMARY KEY,
        "Degree" VARCHAR(255) NOT NULL,
        "Institution" VARCHAR(255) NOT NULL,
        "StartYear" VARCHAR(10) NOT NULL,
        "EndYear" VARCHAR(10),
        "Description" TEXT,
        "Highlights" TEXT,
        "IsCurrent" BOOLEAN DEFAULT false,
        "SortOrder" INTEGER DEFAULT 0
      )
    `;

    // Create CVSkills table
    await sql`
      CREATE TABLE IF NOT EXISTS "CVSkills" (
        id SERIAL PRIMARY KEY,
        "Category" VARCHAR(255) NOT NULL,
        "Skills" TEXT NOT NULL,
        "SortOrder" INTEGER DEFAULT 0
      )
    `;

    console.log("✅ CV tables initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing CV tables:", error);
  }
}

export async function fetchCVProfile(): Promise<CVProfile | null> {
  try {
    const result = await sql`
      SELECT id, "Name", "Title", "Email", "Phone", "Location", "Website", "LinkedIn", "Summary"
      FROM "CVProfile" 
      ORDER BY id DESC 
      LIMIT 1
    `;
    return (result[0] as CVProfile) || null;
  } catch (error) {
    console.error("❌ Error fetching CV profile:", error);
    return null;
  }
}

export async function fetchCVExperience(): Promise<CVExperience[]> {
  try {
    const result = await sql`
      SELECT id, "JobTitle", "Company", "Location", "StartYear", "EndYear", "Description", "Highlights", "IsCurrent"
      FROM "CVExperience" 
      ORDER BY "SortOrder" ASC, id ASC
    `;
    return result as CVExperience[];
  } catch (error) {
    console.error("❌ Error fetching CV experience:", error);
    return [];
  }
}

export async function fetchCVEducation(): Promise<CVEducation[]> {
  try {
    const result = await sql`
      SELECT id, "Degree", "Institution", "StartYear", "EndYear", "Description", "Highlights", "IsCurrent"
      FROM "CVEducation" 
      ORDER BY "SortOrder" ASC, id ASC
    `;
    return result as CVEducation[];
  } catch (error) {
    console.error("❌ Error fetching CV education:", error);
    return [];
  }
}

export async function fetchCVSkills(): Promise<CVSkill[]> {
  try {
    const result = await sql`
      SELECT id, "Category", "Skills"
      FROM "CVSkills" 
      ORDER BY "SortOrder" ASC, id ASC
    `;
    return result as CVSkill[];
  } catch (error) {
    console.error("❌ Error fetching CV skills:", error);
    return [];
  }
}
