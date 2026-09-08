export type LeeruitkomstId = "LU1" | "LU2" | "LU3";

export type LinkType =
  | "onedrive"
  | "youtube"
  | "github"
  | "doc"
  | "demo"
  | "canvas"
  | "other";

export interface EvidenceLink {
  label: string;
  url: string;
  type: LinkType;
  description?: string;
}

export interface Leeruitkomst {
  id: LeeruitkomstId;
  code: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  criteria: string[];
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
  focus?: string;
  deliverables: SprintDeliverable[];
  reflection?: string;
}

export interface UserStory {
  id: string;
  sprint: number;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  status: "Done" | "In Progress" | "To Do";
  acceptanceCriteria: string[];
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
  userStories: UserStory[];
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
      "Portfolio voor de Minor Future-proof met AI aan de Hogeschool Utrecht. Hier verzamel ik alle bewijzen, sprintopdrachten en uitwerkingen om de drie leeruitkomsten aan te tonen.",
  },

  leeruitkomsten: [
    {
      id: "LU1",
      code: "LU 1",
      title: "AI-impact op de beroepspraktijk analyseren en evalueren",
      shortDescription:
        "Onderzoek naar de verandering van software engineering door AI.",
      fullDescription:
        "Zelfstandig onderzoeken hoe AI-tooling (LLM's, code-assistenten, agentic workflows) de dagelijkse praktijk van softwareontwikkeling transformeert, en vaststellen welke nieuwe vaardigheden daarvoor vereist zijn.",
      criteria: [
        "Analyse van verschuivingen in software engineering (syntaxis schrijven vs. prompten, architectuur en code review).",
        "Nulmeting en doorlopende reflectie op de eigen professionele AI-vaardigheden.",
      ],
      status: "In ontwikkeling",
    },
    {
      id: "LU2",
      code: "LU 2",
      title: "Praktijkgerichte AI-oplossing ontwerpen, realiseren en presenteren",
      shortDescription:
        "Zelfstandig bouwen via vibe-coding en opleveren van een AI-oplossing.",
      fullDescription:
        "Een concrete AI-oplossing ontwerpen, bouwen en presenteren die een relevant praktijkvraagstuk oplost, met behulp van vibe-coding, agents of workflow-automatisering.",
      criteria: [
        "Werkend prototype of applicatie met traceerbare Git-commits en documentatie.",
        "Aantoonbare validatie via live demo en screencast.",
      ],
      status: "In ontwikkeling",
    },
    {
      id: "LU3",
      code: "LU 3",
      title: "Ethiek en verantwoordelijk AI-gebruik beoordelen",
      shortDescription:
        "Kritische beoordeling van privacy, bias, betrouwbaarheid en regelgeving.",
      fullDescription:
        "Kritisch beoordelen van ethische en juridische aspecten rondom AI in professionele context, zoals privacy (AVG), bias, hallucinatierisico's en human-in-the-loop controle.",
      criteria: [
        "Risico-analyse van het AI-model, privacy en gegevensbescherming.",
        "Verantwoording van betrouwbaarheid, transparantie en menselijke controle.",
      ],
      status: "In ontwikkeling",
    },
  ],

  sprints: [
    {
      number: 1,
      title: "Kickoff & Portfolio Opzet",
      period: "Sprint 1 · Weken 1 – 2",
      status: "In uitvoering",
      goal: "Inrichten van het portfolio conform de eisen van de minor.",
      deliverables: [
        {
          id: "DELIV-1-1",
          title: "Portfolio subpagina (/minor) op daanhessen.nl",
          description:
            "Onderdeel van mijn bestaande portfolio, ingericht voor het aantonen van de 3 leeruitkomsten. Gebouwd met AI-ondersteuning (vibe-coding).",
          leeruitkomsten: ["LU1", "LU2"],
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
  ],

  userStories: [
    {
      id: "US-01",
      sprint: 1,
      title: "Portfolio website bouwen met AI (vibe-coding)",
      asA: "student Minor Future-proof met AI",
      iWant:
        "een overzichtelijke portfolio-pagina toevoegen aan mijn bestaande site (daanhessen.nl/minor)",
      soThat:
        "ik tijdens de minor al mijn bewijzen en sprintopdrachten transparant kan aantonen.",
      status: "Done",
      acceptanceCriteria: [
        "Gehost op daanhessen.nl/minor via Vercel.",
        "Sluit aan bij de esthetiek van de rest van de site (JetBrains Mono, dark theme, ASCII achtergrond).",
        "Geen overbodige persoonlijke info of foto's, puur gefocust op de academische eisen van de minor.",
        "Duidelijke structuur voor de 3 leeruitkomsten.",
        "Direct herkenbare broncode zonder overbodige dependencies.",
      ],
    },
  ],
};
