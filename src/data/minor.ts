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
  goal: string;
  focus: string;
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
      "Portfolio voor de Minor Future-proof met AI aan de Hogeschool Utrecht. Hier verzamel ik alle bewijzen, sprintopdrachten en uitwerkingen om de drie leeruitkomsten aan te tonen. Grote bestanden, logs en demo-opnames zijn gekoppeld via OneDrive en YouTube.",
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
      status: "Afgerond",
      goal: "Inrichten van de AI-ontwikkelomgeving, verkennen van vibe-coding en het realiseren van de portfolio-omgeving conform de richtlijnen van de minor.",
      focus: "Opstart, Integraal logboek & Portfolio realisatie",
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
              url: "https://github.com/DaanHessen/daanhessen-nl",
              type: "github",
            },
            {
              label: "OneDrive bewijzenmap",
              url: "https://onedrive.live.com",
              type: "onedrive",
            },
            {
              label: "YouTube demo",
              url: "https://youtube.com",
              type: "youtube",
            },
          ],
        },
        {
          id: "DELIV-1-2",
          title: "Integraal logboek & sprintplanning",
          description:
            "Initiële product backlog en user stories voor het aantonen van wat er gemaakt, onderzocht en geleerd wordt (afgeleid van 'Future-proof met AI! v2.0.pdf').",
          leeruitkomsten: ["LU1"],
          links: [
            {
              label: "OneDrive logboek",
              url: "https://onedrive.live.com",
              type: "onedrive",
            },
          ],
        },
      ],
      reflection:
        "Tijdens deze eerste sprint lag de focus op het direct praktisch toepassen van vibe-coding om de portfolio-infrastructuur op te zetten. Grote bestanden en video's staan op OneDrive en YouTube zodat de static deployment snel en overzichtelijk blijft.",
    },
    {
      number: 2,
      title: "Beroepspraktijkverkenning & AI-Tooling",
      period: "Sprint 2 · Weken 3 – 4",
      status: "In uitvoering",
      goal: "Onderzoek naar de verschuiving in het softwarevak door AI en experimenteren met geavanceerde LLM-workflows en agents.",
      focus: "Onderzoek beroepspraktijk (LU1) & Experimentatie",
      deliverables: [
        {
          id: "DELIV-2-1",
          title: "Onderzoeksverslag: AI-impact op software engineering",
          description:
            "Analyse van hoe code-assistenten, agentic IDE's en vibe-coding het dagelijkse ontwikkelproces veranderen en welke vaardigheden nu primair worden.",
          leeruitkomsten: ["LU1", "LU3"],
          links: [
            {
              label: "OneDrive verslag (PDF)",
              url: "https://onedrive.live.com",
              type: "onedrive",
            },
            {
              label: "YouTube toelichting",
              url: "https://youtube.com",
              type: "youtube",
            },
          ],
        },
        {
          id: "DELIV-2-2",
          title: "Tooling benchmark & verkenning",
          description:
            "Vergelijkend onderzoek tussen verschillende AI-architecturen en agentic frameworks ter voorbereiding op het praktijkproject.",
          leeruitkomsten: ["LU1", "LU2"],
          links: [
            {
              label: "GitHub benchmark scripts",
              url: "https://github.com/DaanHessen",
              type: "github",
            },
            {
              label: "OneDrive testdata & logs",
              url: "https://onedrive.live.com",
              type: "onedrive",
            },
          ],
        },
      ],
      reflection:
        "Het vergelijken van puur prompt-gebaseerde assistenten met autonome agentic workflows gaf duidelijke kaders voor de architectuur van de te bouwen AI-oplossing.",
    },
    {
      number: 3,
      title: "Concept & Prototype (Vibe-coding)",
      period: "Sprint 3 · Weken 5 – 6",
      status: "Gepland",
      goal: "Definiëren van het kernprobleem voor de praktijk, ontwerpen van de systeemarchitectuur en bouwen van een eerste Proof-of-Concept via vibe-coding.",
      focus: "Praktijkoplossing ontwerp & MVP (LU2)",
      deliverables: [
        {
          id: "DELIV-3-1",
          title: "Technisch ontwerp & systeemarchitectuur",
          description:
            "Specificatie van de AI-pipeline: datastromen, modelselectie, context retrieval en interface.",
          leeruitkomsten: ["LU2"],
          links: [
            {
              label: "OneDrive architectuurdocument",
              url: "https://onedrive.live.com",
              type: "onedrive",
            },
          ],
        },
        {
          id: "DELIV-3-2",
          title: "Proof of Concept / Prototype",
          description:
            "Functionele MVP van de AI-oplossing, gerealiseerd met AI-assisted coding.",
          leeruitkomsten: ["LU2"],
          links: [
            {
              label: "GitHub repository",
              url: "https://github.com/DaanHessen",
              type: "github",
            },
            {
              label: "YouTube walkthrough",
              url: "https://youtube.com",
              type: "youtube",
            },
          ],
        },
      ],
    },
    {
      number: 4,
      title: "Realisatie & Ethische Toetsing",
      period: "Sprint 4 · Weken 7 – 8",
      status: "Gepland",
      goal: "Doorontwikkeling naar een volwaardige praktijkoplossing, gebruikerstesten met stakeholders en grondige ethische risicoanalyse.",
      focus: "Verfijning, Testen & Ethiek (LU2 & LU3)",
      deliverables: [
        {
          id: "DELIV-4-1",
          title: "AI-oplossing & testresultaten",
          description:
            "Gevalideerde applicatie met foutafhandeling, fallback mechanismen en geoptimaliseerde latency.",
          leeruitkomsten: ["LU2"],
          links: [
            {
              label: "Live demo",
              url: "https://daanhessen.nl",
              type: "demo",
            },
            {
              label: "OneDrive testverslag",
              url: "https://onedrive.live.com",
              type: "onedrive",
            },
          ],
        },
        {
          id: "DELIV-4-2",
          title: "Ethische & verantwoorde AI analyse (LU3)",
          description:
            "Rapportage over data-privacy, bias-detectie, intellectueel eigendom en naleving van de EU AI Act binnen het project.",
          leeruitkomsten: ["LU3"],
          links: [
            {
              label: "OneDrive ethisch assessment",
              url: "https://onedrive.live.com",
              type: "onedrive",
            },
          ],
        },
      ],
    },
    {
      number: 5,
      title: "Eindverantwoording & Presentatie",
      period: "Sprint 5 · Weken 9 – 10",
      status: "Gepland",
      goal: "Definitieve bundeling van alle bewijsstukken voor de 3 leeruitkomsten, eindpresentatie voor docenten en leerteam, en zelfevaluatie.",
      focus: "Eindbeoordeling & Presentatie (LU1, LU2, LU3)",
      deliverables: [
        {
          id: "DELIV-5-1",
          title: "Eindverantwoording leeruitkomsten",
          description:
            "Overzichtsdocument waarin per leeruitkomst exact wordt verwezen naar de geproduceerde bewijzen.",
          leeruitkomsten: ["LU1", "LU2", "LU3"],
          links: [
            {
              label: "OneDrive verantwoordingsdossier",
              url: "https://onedrive.live.com",
              type: "onedrive",
            },
            {
              label: "YouTube eindpresentatie",
              url: "https://youtube.com",
              type: "youtube",
            },
          ],
        },
      ],
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
        "Externe links naar OneDrive en YouTube voor grote bestanden en video's.",
        "Direct herkenbare broncode zonder overbodige dependencies.",
      ],
    },
    {
      id: "US-02",
      sprint: 1,
      title: "Integraal logboek en sprintplanning bijhouden",
      asA: "student",
      iWant:
        "mijn sprintactiviteiten en user stories vastleggen in een integraal logboek",
      soThat:
        "mijn voortgang tijdens de leerteamsessies en assessments direct inzichtelijk is.",
      status: "Done",
      acceptanceCriteria: [
        "Gebaseerd op het Canvas document Future-proof met AI! v2.0.",
        "Traceerbare status per sprint en activiteit.",
      ],
    },
    {
      id: "US-03",
      sprint: 2,
      title: "Onderzoek naar AI-impact op de softwarepraktijk (LU1)",
      asA: "student developer",
      iWant:
        "onderzoeken hoe AI tooling de rol van de softwareontwikkelaar verandert",
      soThat:
        "ik kan aantonen welke competenties van belang worden voor mijn vakgebied.",
      status: "In Progress",
      acceptanceCriteria: [
        "Kwalitatieve analyse van de verschuiving naar vibe-coding en architectuur.",
        "Vastgelegd in een beknopt verslag op OneDrive.",
      ],
    },
    {
      id: "US-04",
      sprint: 3,
      title: "Praktijkgerichte AI-oplossing bouwen (LU2)",
      asA: "developer",
      iWant:
        "een werkend AI-prototype ontwikkelen voor een concreet praktijkprobleem",
      soThat:
        "ik kan aantonen dat ik zelfstandig een AI-oplossing kan realiseren en valideren.",
      status: "To Do",
      acceptanceCriteria: [
        "Werkend prototype met openbare repository op GitHub.",
        "Korte demonstratievideo op YouTube.",
      ],
    },
    {
      id: "US-05",
      sprint: 4,
      title: "Ethische beoordeling van de AI-oplossing (LU3)",
      asA: "ontwikkelaar",
      iWant: "de ethische en juridische aspecten van mijn toepassing toetsen",
      soThat:
        "ik aantoont dat de oplossing verantwoord en betrouwbaar kan worden ingezet.",
      status: "To Do",
      acceptanceCriteria: [
        "Risicoanalyse op het gebied van privacy (AVG), bias en betrouwbaarheid.",
      ],
    },
  ],
};
