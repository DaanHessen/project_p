#!/usr/bin/env node

/**
 * sync-technologies.mjs
 *
 * Discovers languages from Daan's public GitHub repositories and merges them
 * with the offline/hand-curated technologies in src/data/resume.json.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESUME_JSON_PATH = path.resolve(__dirname, '../src/data/resume.json');
const GITHUB_USER = 'DaanHessen';
const REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`;

// Non-language build artifacts or metadata to filter out
const EXCLUDED_LANGUAGES = new Set([
  'Batchfile',
  'Dockerfile',
  'Makefile',
  'FreeMarker',
  'Gherkin',
]);

// Normalize language names to human-standard capitalization
const LANGUAGE_NAME_MAP = {
  'c#': 'C#',
  'csharp': 'C#',
  'golang': 'Go',
  'go': 'Go',
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'python': 'Python',
  'rust': 'Rust',
  'java': 'Java',
  'lua': 'Lua',
  'plpgsql': 'SQL',
  'sql': 'SQL',
  'html': 'HTML',
  'css': 'CSS',
  'shell': 'Shell',
};

function normalizeLang(lang) {
  const lower = lang.toLowerCase();
  return LANGUAGE_NAME_MAP[lower] || lang;
}

async function fetchGitHubLanguages() {
  console.log(`Fetching repositories for ${GITHUB_USER}...`);
  const res = await fetch(REPOS_URL, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'DaanHessen-Portfolio-Sync',
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub API returned ${res.status}: ${res.statusText}`);
  }

  const repos = await res.json();
  const ownedRepos = repos.filter((r) => !r.fork);
  console.log(`Found ${ownedRepos.length} non-fork public repositories.`);

  const discoveredLanguages = new Set();
  const repoTooling = new Set();

  for (const repo of ownedRepos) {
    if (repo.language && !EXCLUDED_LANGUAGES.has(repo.language)) {
      discoveredLanguages.add(normalizeLang(repo.language));
    }

    // Check specific tools based on repo names
    const nameLower = repo.name.toLowerCase();
    if (nameLower.includes('neovim') || nameLower.includes('nvim')) {
      repoTooling.add('Neovim');
    }
  }

  return {
    languages: Array.from(discoveredLanguages),
    tooling: Array.from(repoTooling),
  };
}

async function main() {
  const resume = JSON.parse(fs.readFileSync(RESUME_JSON_PATH, 'utf8'));

  const { languages: ghLanguages, tooling: ghTooling } = await fetchGitHubLanguages();
  console.log('Languages discovered from GitHub:', ghLanguages);

  // Group 1: Programming Languages
  let langGroup = resume.skills.find(
    (g) => g.group.toLowerCase().includes('programming') || g.group.toLowerCase().includes('language')
  );

  if (!langGroup) {
    langGroup = { group: 'Languages', items: [] };
    resume.skills.unshift(langGroup);
  } else {
    langGroup.group = 'Languages';
  }

  const existingLangs = new Set(langGroup.items.map((i) => i.toLowerCase()));
  const addedLangs = [];

  for (const lang of ghLanguages) {
    if (!existingLangs.has(lang.toLowerCase())) {
      langGroup.items.push(lang);
      existingLangs.add(lang.toLowerCase());
      addedLangs.push(lang);
    }
  }

  // Group 3: Tooling
  let toolingGroup = resume.skills.find(
    (g) => g.group.toLowerCase().includes('backend') || g.group.toLowerCase().includes('tool')
  );
  if (toolingGroup) {
    const existingTools = new Set(toolingGroup.items.map((i) => i.toLowerCase()));
    for (const tool of ghTooling) {
      if (!existingTools.has(tool.toLowerCase())) {
        toolingGroup.items.push(tool);
        existingTools.add(tool.toLowerCase());
      }
    }
  }

  fs.writeFileSync(RESUME_JSON_PATH, JSON.stringify(resume, null, 2) + '\n');
  console.log(`Updated ${RESUME_JSON_PATH}`);
  if (addedLangs.length > 0) {
    console.log('Added languages:', addedLangs.join(', '));
  } else {
    console.log('All GitHub languages are already in resume.json.');
  }
}

main().catch((err) => {
  console.error('Failed to sync technologies:', err);
  process.exit(1);
});
