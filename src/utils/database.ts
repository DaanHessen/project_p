import { neon } from '@neondatabase/serverless';

const sql = neon(import.meta.env.DATABASE_URL);

export interface Project {
  id: number;
  name: string;
  description: string;
  link: string;
  technologies: string;
  status: string;
  addedat: string;
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const result = await sql`
      SELECT id, name, description, link, technologies, status, addedat 
      FROM projects 
      ORDER BY addedat DESC
    `;
    return result as Project[];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProjectById(id: number): Promise<Project | null> {
  try {
    const result = await sql`
      SELECT id, name, description, link, technologies, status, addedat 
      FROM projects 
      WHERE id = ${id}
    `;
    return result[0] as Project || null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
} 