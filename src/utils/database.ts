import { neon } from "@neondatabase/serverless";
// Import local projects data as fallback
import localProjectsData from "../data/projects.json";

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

// Project interface based on actual database structure
export interface Project {
  id: number;
  name: string;
  description: string;
  link: string;
  technologies: string;
  dateadded: string;
  image_url?: string;
  github_url?: string;
}

// Interface for local projects.json structure
interface LocalProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  liveUrl: string;
  codeUrl?: string;
}

// Transform local project data to match database Project interface
function transformLocalProject(
  localProject: LocalProject,
  index: number,
): Project {
  return {
    id: index + 1, // Convert string id to number
    name: localProject.title, // title -> name
    description: localProject.description,
    link: localProject.liveUrl, // liveUrl -> link
    technologies: localProject.tech.join(", "), // array -> comma-separated string
    dateadded: new Date().toISOString(), // Add current date as placeholder
    image_url: localProject.image,
    github_url: localProject.codeUrl,
  };
}

// Fetch all projects from the database
export async function fetchProjects(): Promise<Project[]> {
  try {
    const projects = await sql`
      SELECT id, name, description, link, technologies, dateadded, image_url, github_url
      FROM projects
      ORDER BY dateadded DESC
    `;
    return projects as Project[];
  } catch (error) {
    console.warn(
      "Database connection failed, using local fallback data:",
      error,
    );

    // Fallback to local data
    try {
      const transformedProjects = localProjectsData.map((project, index) =>
        transformLocalProject(project as LocalProject, index),
      );
      return transformedProjects;
    } catch (localError) {
      console.error("Failed to load local projects:", localError);
      return [];
    }
  }
}

// Fetch a single project by ID
export async function fetchProjectById(id: number): Promise<Project | null> {
  try {
    const projects = await sql`
      SELECT id, name, description, link, technologies, dateadded, image_url, github_url
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
