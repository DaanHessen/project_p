import { fetchProjects } from "./src/utils/database.js";

async function testDatabase() {
  try {
    console.log("Testing database connection...");
    const projects = await fetchProjects();
    console.log("✅ Database connection successful!");
    console.log("📊 Found", projects.length, "projects");
    if (projects.length > 0) {
      console.log("📝 Sample project:", projects[0].name);
      console.log("🔗 Sample link:", projects[0].link);
      console.log("🏷️ Sample technologies:", projects[0].technologies);
    }
  } catch (error) {
    console.log("❌ Database connection failed:", error.message);
  }
}

testDatabase();
