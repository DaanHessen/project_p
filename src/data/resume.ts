import raw from "./resume.json";

export interface ExperienceEntry {
  company: string;
  location: string;
  duration: string;
  position: string;
  description: string;
}

export interface EducationEntry {
  institution: string;
  location: string;
  duration: string;
  degree: string;
  description: string;
}

export interface ProjectLink {
  type: string;
  text: string;
  url: string;
}

export interface ProjectEntry {
  name: string;
  description: string;
  links: ProjectLink[];
}

export interface LanguageEntry {
  name: string;
  level: number;
}

export interface Resume {
  personal: {
    position: string;
    about: string;
  };
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  languages: LanguageEntry[];
  projects: ProjectEntry[];
}

export const resume = raw as Resume;

/**
 * The JSON stores language ability as a percentage, which is a precision the
 * data does not have. Rendering it as a bar implies a measurement nobody took,
 * so it collapses to a word instead.
 */
export function proficiency(level: number): string {
  if (level >= 100) return "native";
  if (level >= 90) return "fluent";
  if (level >= 55) return "conversational";
  return "basic";
}
