export type LeeruitkomstId = "LU1" | "LU2" | "LU3" | "LU4" | "LU5";

export type StoryType = "US" | "RS" | "LS"; // User Story, Research Story, Learning Story

export interface EvidenceLink {
  label: string;
  url: string;
  type: "github" | "demo" | "onedrive" | "youtube" | "doc" | "other";
}

export interface Leeruitkomst {
  id: LeeruitkomstId;
  code: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  minEvaluations: number;
  status: "In ontwikkeling" | "Aangetoond" | "Gepland";
}

export interface SprintDeliverable {
  id: string;
  title: string;
  description: string;
  leeruitkomsten: LeeruitkomstId[];
  links: EvidenceLink[];
}

export interface Sprint {
  number: number;
  title: string;
  period: string;
  status: "Afgerond" | "In uitvoering" | "Gepland";
  goal?: string;
  deliverables: SprintDeliverable[];
  reflection?: string;
}

export interface Story {
  id: string;
  sprint: number;
  type: StoryType;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  status: "Done" | "In Progress" | "To Do";
  acceptanceCriteria?: string[];
  leeruitkomsten?: LeeruitkomstId[];
  updatedAt?: string;
}

export interface LogEntry {
  id: string;
  date: string;
  sprint: number;
  title: string;
  description: string;
  leeruitkomsten: LeeruitkomstId[];
  links?: EvidenceLink[];
}

export interface MinorData {
  meta: {
    title: string;
    subtitle: string;
    institution: string;
    program: string;
    student: string;
    academicYear: string;
    contextDoc: string;
    description: string;
  };
  leeruitkomsten: Leeruitkomst[];
  sprints: Sprint[];
  userStories: Story[];
  logEntries: LogEntry[];
}

export const minorData: MinorData = {
  meta: {
    title: "Minor: Future-proof met AI!",
    subtitle: "Portfolio & Integraal Logboek",
    institution: "Hogeschool Utrecht",
    program: "HBO-ICT",
    student: "Daan Hessen",
    academicYear: "2026 – 2027",
    contextDoc: "Future-proof met AI! v2.0 (Canvas)",
    description:
      "Portfolio voor de Minor Future-proof met AI aan de Hogeschool Utrecht. Hier verzamel ik alle bewijzen, sprintopdrachten en uitwerkingen om de vijf centrale leeruitkomsten aan te tonen.",
  },

  leeruitkomsten: [
    {
      id: "LU1",
      code: "LU 1",
      title: "AI-impact op de toekomstige beroepspraktijk analyseren en evalueren",
      shortDescription:
        "Onderzoek naar de impact van AI in het toekomstig beroep en benodigde vaardigheden.",
      fullDescription:
        "Je kunt zelfstandig onderzoek doen naar de impact van AI in jouw toekomstig beroep en vaststellen welke nieuwe AI en digitale vaardigheden daarvoor nodig zijn.",
      minEvaluations: 2,
      status: "In ontwikkeling",
    },
    {
      id: "LU2",
      code: "LU 2",
      title: "Praktijkgerichte AI oplossing ontwerpen, realiseren en presenteren",
      shortDescription:
        "Ontwerpen, bouwen en presenteren van een transformerende AI-oplossing.",
      fullDescription:
        "Je kunt zelfstandig een AI oplossing ontwerpen, realiseren en presenteren die een specifieke beroepspraktijk radicaal transformeert (verandert).",
      minEvaluations: 4,
      status: "In ontwikkeling",
    },
    {
      id: "LU3",
      code: "LU 3",
      title: "Ethiek en verantwoordelijk AI-gebruik beoordelen",
      shortDescription:
        "Ethische vraagstukken identificeren en aanbevelingen doen voor verantwoord AI-gebruik.",
      fullDescription:
        "Je kunt zelfstandig de ethische vraagstukken en uitdagingen van AI in je vakgebied identificeren en aanbevelingen formuleren voor verantwoord AI-gebruik, rekening houdend met privacy, bias en transparantie.",
      minEvaluations: 2,
      status: "In ontwikkeling",
    },
    {
      id: "LU4",
      code: "LU 4",
      title: "AI Tools en technieken gebruiken",
      shortDescription:
        "Verschillende AI-tools en platforms toepassen op specifieke vaktaken.",
      fullDescription:
        "Je kunt zelfstandig verschillende AI-tools en platforms toepassen (zoals AI machine learning technieken, chatbots, agents, prompts, vibe-coding, workflow tools zoals N8N/Make) en deze gebruiken om specifieke taken binnen je vakgebied op te lossen.",
      minEvaluations: 4,
      status: "In ontwikkeling",
    },
    {
      id: "LU5",
      code: "LU 5",
      title: "Zelfstandig en zelfsturend werken",
      shortDescription:
        "Eigen leerroute bepalen, voortgang monitoren en kritisch reflecteren op leerproces.",
      fullDescription:
        "Je kunt een eigen leerroute vaststellen en uitvoeren waarbij je zelfstandig je leervragen stelt, relevante bronnen en tools selecteert, je eigen voortgang monitort en kritisch reflecteert op je leerproces en persoonlijke ontwikkeling in het AI-landschap.",
      minEvaluations: 6,
      status: "In ontwikkeling",
    },
  ],

  sprints: [
    {
      number: 1,
      title: "Kickoff & Portfolio Opzet",
      period: "Sprint 1 · Weken 1 – 2",
      status: "In uitvoering",
      goal: "Inrichten van het portfolio en verkenning van AI vibe-coding conform de minor-eisen.",
      deliverables: [
        {
          id: "DELIV-1-1",
          title: "Portfolio subpagina (/minor) op daanhessen.nl",
          description:
            "Onderdeel van mijn bestaande portfolio, ingericht voor het aantonen van de 5 leeruitkomsten. Gerealiseerd met behulp van AI vibe-coding.",
          leeruitkomsten: ["LU4", "LU5"],
          links: [
            {
              label: "GitHub repository",
              url: "https://github.com/DaanHessen/project_p",
              type: "github",
            },
            {
              label: "Live pagina",
              url: "https://daanhessen.nl/minor",
              type: "demo",
            },
            {
              label: "Dagboekje",
              url: "https://futureproof-met-ai.vercel.app/",
              type: "demo",
            },
          ],
        },
      ],
    },
    {
      number: 2,
      title: "Sprint 2",
      period: "Sprint 2 · Weken 3 – 4",
      status: "Gepland",
      deliverables: [],
    },
    {
      number: 3,
      title: "Sprint 3",
      period: "Sprint 3 · Weken 5 – 6",
      status: "Gepland",
      deliverables: [],
    },
    {
      number: 4,
      title: "Sprint 4",
      period: "Sprint 4 · Weken 7 – 8",
      status: "Gepland",
      deliverables: [],
    },
    {
      number: 5,
      title: "Sprint 5",
      period: "Sprint 5 · Weken 9 – 10",
      status: "Gepland",
      deliverables: [],
    },
    {
      number: 6,
      title: "Sprint 6",
      period: "Sprint 6 · Weken 11 – 12",
      status: "Gepland",
      deliverables: [],
    },
    {
      number: 7,
      title: "Sprint 7",
      period: "Sprint 7 · Weken 13 – 14",
      status: "Gepland",
      deliverables: [],
    },
    {
      number: 8,
      title: "Sprint 8",
      period: "Sprint 8 · Weken 15 – 16",
      status: "Gepland",
      deliverables: [],
    },
  ],

  userStories: [
    {
      id: "US-01",
      sprint: 1,
      type: "US",
      title: "Portfolio website bouwen met AI (vibe-coding)",
      asA: "student Minor Future-proof met AI",
      iWant:
        "een overzichtelijke portfolio-pagina toevoegen aan mijn bestaande site (daanhessen.nl/minor)",
      soThat:
        "ik tijdens de minor al mijn bewijzen en sprintopdrachten transparant kan aantonen voor de 5 leeruitkomsten.",
      status: "Done",
      acceptanceCriteria: [
        "Portfolio subpagina live op daanhessen.nl/minor",
        "5 officiële HU leeruitkomsten gedefinieerd conform v2.0",
        "Sprint 1 kickoff deliverable gekoppeld",
      ],
      leeruitkomsten: ["LU4", "LU5"],
      updatedAt: "2026-09-08",
    },
    {
      id: "US-02",
      sprint: 1,
      type: "US",
      title: "Interactieve GitHub Planner & beveiligd logboek realiseren",
      asA: "student en beoordelaar",
      iWant:
        "een GitHub Projects Kanban-board, datatabel en chronologisch logboek kunnen raadplegen",
      soThat:
        "de voortgang per sprint en leeruitkomst interactief inzichtelijk is en uitsluitend door mij cryptografisch kan worden bewerkt.",
      status: "Done",
      acceptanceCriteria: [
        "Kanban bord (To Do, In Progress, Done) met filters op sprint en LU",
        "Tabel- en logboekweergave met live search",
        "Cryptografisch beveiligde edit-modus via GitHub API & Tailscale detectie",
      ],
      leeruitkomsten: ["LU2", "LU4", "LU5"],
      updatedAt: "2026-09-08",
    },
  ],
  logEntries: [
    {
      id: "LOG-01",
      date: "2026-09-07",
      sprint: 1,
      title: "Kickoff Minor Future-proof met AI & portfolio architectuur",
      description:
        "Start van de minor aan Hogeschool Utrecht. De officiële Canvas documentatie (Future-proof met AI! v2.0) doorgenomen. Besloten het portfolio als subpagina (/minor) te integreren binnen mijn bestaande React/Vite portfolio met behulp van AI vibe-coding en agentic workflows.",
      leeruitkomsten: ["LU4", "LU5"],
      links: [
        {
          label: "Dagboekje",
          url: "https://futureproof-met-ai.vercel.app/",
          type: "demo",
        },
        {
          label: "Canvas HU",
          url: "https://canvas.hu.nl",
          type: "doc",
        },
      ],
    },
    {
      id: "LOG-02",
      date: "2026-09-08",
      sprint: 1,
      title: "Ontwikkeling interactieve GitHub Planner & auth integratie",
      description:
        "Ontwerp en implementatie van een interactief GitHub Projects-achtig planningssysteem voor user stories en het logboek. Voorzien van Kanban-kolommen, filter-toolbar, datatabel en cryptografische authenticatie via de GitHub API zodat de live site op Vercel uitsluitend door Daan Hessen kan worden gemuteerd.",
      leeruitkomsten: ["LU2", "LU4", "LU5"],
      links: [
        {
          label: "GitHub Repository",
          url: "https://github.com/DaanHessen/project_p",
          type: "github",
        },
        {
          label: "Live /minor",
          url: "https://daanhessen.nl/minor",
          type: "demo",
        },
      ],
    },
  ],
};
