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
