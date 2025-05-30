import { neon } from "@neondatabase/serverless";

// Database connection
const sql = neon(
  "postgres://neondb_owner:npg_qXvF9DJkE8jS@ep-royal-meadow-abrmk6ta-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require",
);

// Project interface based on the actual database table structure
export interface Project {
  id: number;
  name: string;
  description: string;
  link: string;
  technologies: string;
  addedat: string;
}

// Fetch all projects from the database
export async function fetchProjects(): Promise<Project[]> {
  try {
    const projects = await sql`
      SELECT id, name, description, link, technologies, addedat
      FROM projects
      ORDER BY addedat DESC
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
      SELECT id, name, description, link, technologies, addedat
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
