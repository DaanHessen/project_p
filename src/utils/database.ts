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
      SELECT id, "Name", "Description", "Link", "Technologies", "Status", "AddedAt" 
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
      SELECT id, "Name", "Description", "Link", "Technologies", "Status", "AddedAt" 
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

export async function insertInitialCVData(): Promise<void> {
  try {
    console.log("🔧 Inserting initial CV data...");

    // Insert profile data
    await sql`
      INSERT INTO "CVProfile" ("Name", "Title", "Email", "Phone", "Location", "Website", "LinkedIn", "Summary")
      VALUES (
        'DAAN HESSEN',
        'SOFTWARE DEVELOPER',
        'daan2002@gmail.com',
        '+31 647 072 045',
        'Hilversum, Netherlands',
        'daanhessen.nl',
        'linkedin.com/in/daanhessen',
        'Passionate HBO-ICT student specializing in Software Development with hands-on experience in modern programming languages and web technologies. Currently in my second year at University of Applied Sciences Utrecht, combining academic knowledge with practical application. Strong background in hospitality with international work experience, bringing excellent communication skills and cultural awareness to technical projects.'
      )
      ON CONFLICT DO NOTHING
    `;

    // Insert experience data
    await sql`
      INSERT INTO "CVExperience" ("JobTitle", "Company", "Location", "StartYear", "EndYear", "Description", "Highlights", "IsCurrent", "SortOrder")
      VALUES 
      (
        'BARTENDER',
        'Brasserie Monsees',
        'Hilversum',
        '2022',
        '2024',
        'Provided exceptional customer service in an upscale dining environment. Managed high-volume service periods while maintaining quality standards. Collaborated with kitchen and service teams to ensure seamless operations.',
        'Handled customer relations and complaint resolution|Managed inventory and point-of-sale systems|Trained new staff members on service protocols',
        false,
        1
      ),
      (
        'INTERNATIONAL BARTENDER',
        'Ambrosius Stube',
        'Lech, Austria',
        '2022',
        '2022',
        'Seasonal position in alpine resort setting, serving international clientele. Developed cultural sensitivity and multilingual communication skills.',
        'Served diverse international customers|Adapted to high-pressure seasonal environment|Enhanced German language proficiency',
        false,
        2
      ),
      (
        'SERVER & BARTENDER',
        'Oh Lobo',
        'Hilversum',
        '2019',
        '2020',
        'Entry-level position developing foundational hospitality skills and customer service excellence in fast-paced environment.',
        '',
        false,
        3
      )
      ON CONFLICT DO NOTHING
    `;

    // Insert education data
    await sql`
      INSERT INTO "CVEducation" ("Degree", "Institution", "StartYear", "EndYear", "Description", "Highlights", "IsCurrent", "SortOrder")
      VALUES 
      (
        'HBO-ICT SOFTWARE DEVELOPMENT',
        'University of Applied Sciences Utrecht',
        '2023',
        'Present',
        'Currently in second year of Bachelor''s program focusing on software development, programming methodologies, and modern software architecture. Hands-on experience with various programming languages and development frameworks.',
        'Object-Oriented Programming|Web Development|Database Design|Software Architecture',
        true,
        1
      ),
      (
        'HBO CREATIVE BUSINESS',
        'University of Applied Sciences Amsterdam',
        '2020',
        '2022',
        'Initial studies in business and creative industries before transitioning to technical focus. Developed foundational business acumen and project management skills.',
        '',
        false,
        2
      )
      ON CONFLICT DO NOTHING
    `;

    // Insert skills data
    await sql`
      INSERT INTO "CVSkills" ("Category", "Skills", "SortOrder")
      VALUES 
      ('Programming Languages', 'Java|JavaScript|TypeScript|Python', 1),
      ('Web Technologies', 'React|HTML/CSS|Node.js|REST APIs', 2),
      ('Languages', 'Dutch (Native)|English (Fluent)|German (Intermediate)', 3)
      ON CONFLICT DO NOTHING
    `;

    console.log("✅ Initial CV data inserted successfully");
  } catch (error) {
    console.error("❌ Error inserting initial CV data:", error);
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
