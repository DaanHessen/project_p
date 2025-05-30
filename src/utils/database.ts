import { neon } from "@neondatabase/serverless";

// Database connection
const sql = neon(
  "postgres://neondb_owner:npg_qXvF9DJkE8jS@ep-royal-meadow-abrmk6ta-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require",
);

// Interface for database column information
interface ColumnInfo {
  column_name: string;
  data_type: string;
}

// Function to check table structure
export async function getTableStructure(): Promise<ColumnInfo[]> {
  try {
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'projects'
      ORDER BY ordinal_position;
    `;
    return columns as ColumnInfo[];
  } catch (error) {
    console.error("Error getting table structure:", error);
    return [];
  }
}

// Project interface - will be updated based on actual database structure
export interface Project {
  id: number;
  name: string;
  description: string;
  link: string;
  technologies: string;
  status: string;
  addedAt?: string; // Making this optional until we confirm the actual column name
}

// Fetch all projects from the database
export async function fetchProjects(): Promise<Project[]> {
  try {
    // First, let's try to get the table structure to see available columns
    const structure = await getTableStructure();
    console.log("Table structure:", structure);

    const projects = await sql`
      SELECT id, name, description, link, technologies, status
      FROM projects
      ORDER BY id DESC
    `;
    return projects as Project[];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// Fetch a single project by ID
export async function fetchProjectById(id: number): Promise<Project | null> {
  try {
    const projects = await sql`
      SELECT id, name, description, link, technologies, status
      FROM projects
      WHERE id = ${id}
      LIMIT 1
    `;
    return projects.length > 0 ? (projects[0] as Project) : null;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}
