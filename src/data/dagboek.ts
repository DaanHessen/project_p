/**
 * Dagboekje Data & Supabase Client Layer
 * Handles Supabase REST synchronization, local caching, streaks, and daily quotes.
 */

export interface DagboekEntry {
  id?: number;
  user_email?: string;
  date: string; // YYYY-MM-DD
  mood: number; // 0-5
  yesterday_done: string;
  yesterday_learned: string;
  today_planned: string;
  updated_at?: string;
}

export interface Quote {
  spreuk: string;
  auteur: string;
  thema: string;
}

export const SUPABASE_URL = "https://peeduaywnjygplzxltzf.supabase.co";
export const SUPABASE_ANON_KEY =
  "sb_publishable_weJ_CCPc8r7-8Vu7IFP0nQ_JDBH-K7Q";
export const STORAGE_KEY = "fp_dagboek_entries_v1";
export const DEFAULT_EMAIL = "daan@student.hu.nl";

export const QUOTES: Quote[] = [
  {
    spreuk:
      "AI neemt jouw werk niet over, maar degene die AI goed weet te gebruiken wel.",
    auteur: "Gert van Hardeveld",
    thema: "Futureproof",
  },
  {
    spreuk: "Eenvoud is de ultieme vorm van perfectie.",
    auteur: "Leonardo da Vinci",
    thema: "Focus",
  },
  {
    spreuk:
      "We kunnen slechts een korte afstand vooruitzien, maar we zien genoeg dat gedaan moet worden.",
    auteur: "Alan Turing",
    thema: "Innovatie",
  },
  {
    spreuk:
      "Niet wat er gebeurt bepaalt je dag, maar hoe je ervoor kiest erop te reageren.",
    auteur: "Epictetus",
    thema: "Veerkracht",
  },
  {
    spreuk:
      "De beste manier om de toekomst te voorspellen is om haar zelf te ontwerpen.",
    auteur: "Alan Kay",
    thema: "Creatie",
  },
  {
    spreuk:
      "Blijf nieuwsgierig naar nieuwe ideeën, blijf moedig genoeg om te proberen.",
    auteur: "Steve Jobs",
    thema: "Groei",
  },
  {
    spreuk:
      "Technologie is op haar mooist wanneer zij menselijke intelligentie versterkt in plaats van vervangt.",
    auteur: "Ada Lovelace",
    thema: "Mens & AI",
  },
  {
    spreuk:
      "Rust in je hoofd brengt helderheid in je keuzes en richting in je werk.",
    auteur: "Marcus Aurelius",
    thema: "Rust",
  },
  {
    spreuk:
      "Begin met wat nodig is, doe dan wat mogelijk is, en je bereikt wat eerst onbereikbaar leek.",
    auteur: "Franciscus van Assisi",
    thema: "Actie",
  },
  {
    spreuk:
      "Een dag met bewuste reflectie geeft richting aan alle dagen die volgen.",
    auteur: "Socrates",
    thema: "Reflectie",
  },
  {
    spreuk:
      "Wie durft te experimenteren en fouten omarmt als feedback, leert het snelst.",
    auteur: "Grace Hopper",
    thema: "Leren",
  },
  {
    spreuk:
      "Vibe coding is het orchestreren van intelligentie met een heldere visie en smaak.",
    auteur: "AI Wijsheid",
    thema: "Vibe Coding",
  },
  {
    spreuk:
      "Kleine dagelijkse stappen leveren op termijn buitengewone resultaten op.",
    auteur: "James Clear",
    thema: "Consistentie",
  },
];

export const MOOD_LABELS: Record<number, string> = {
  0: "nog niet beoordeeld",
  1: "moeizaam",
  2: "matig",
  3: "neutraal",
  4: "goed",
  5: "fantastisch",
};

/**
 * Returns a quote for the given date, or a specific index offset if provided.
 */
export function getDailyQuote(dateStr: string, indexOffset = 0): Quote {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const baseIndex = Math.abs(hash) % QUOTES.length;
  const index = (baseIndex + indexOffset) % QUOTES.length;
  return QUOTES[(index + QUOTES.length) % QUOTES.length];
}

/**
 * Get all cached entries from localStorage.
 */
export function getAllLocalEntries(): Record<string, DagboekEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Get an entry for a specific date (YYYY-MM-DD).
 */
export function getLocalEntry(dateStr: string): DagboekEntry {
  const all = getAllLocalEntries();
  if (all[dateStr]) return all[dateStr];
  return {
    date: dateStr,
    mood: 0,
    yesterday_done: "",
    yesterday_learned: "",
    today_planned: "",
  };
}

/**
 * Save entry to local storage.
 */
export function saveLocalEntry(entry: DagboekEntry): void {
  if (typeof window === "undefined") return;
  try {
    const all = getAllLocalEntries();
    all[entry.date] = {
      ...entry,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

/**
 * Fetch all entries directly from Supabase REST API and update localStorage cache.
 */
export async function fetchEntriesFromSupabase(): Promise<DagboekEntry[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/entries?select=*&order=date.desc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Supabase query returned status ${res.status}`);
    }

    const data: DagboekEntry[] = await res.json();
    if (Array.isArray(data)) {
      const local = getAllLocalEntries();
      data.forEach((item) => {
        local[item.date] = {
          id: item.id,
          user_email: item.user_email,
          date: item.date,
          mood: Number(item.mood) || 0,
          yesterday_done: item.yesterday_done || "",
          yesterday_learned: item.yesterday_learned || "",
          today_planned: item.today_planned || "",
          updated_at: item.updated_at,
        };
      });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
        } catch {
          // ignore
        }
      }
      return data;
    }
    return [];
  } catch (err) {
    console.warn("Supabase fetch fallback to local entries:", err);
    return Object.values(getAllLocalEntries());
  }
}

/**
 * Upsert an entry to Supabase REST API and save to localStorage.
 */
export async function saveEntryToSupabase(
  entry: DagboekEntry
): Promise<boolean> {
  saveLocalEntry(entry);

  try {
    const payload = {
      user_email: entry.user_email || DEFAULT_EMAIL,
      date: entry.date,
      mood: Number(entry.mood) || 0,
      yesterday_done: entry.yesterday_done || "",
      yesterday_learned: entry.yesterday_learned || "",
      today_planned: entry.today_planned || "",
      updated_at: new Date().toISOString(),
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/entries`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify([payload]),
    });

    return res.ok;
  } catch (err) {
    console.warn("Supabase upsert failed, stored in localStorage:", err);
    return false;
  }
}

/**
 * Check if a date has any meaningful content.
 */
export function hasEntryContent(entry: DagboekEntry | undefined): boolean {
  if (!entry) return false;
  return (
    entry.mood > 0 ||
    Boolean(entry.yesterday_done && entry.yesterday_done.trim()) ||
    Boolean(entry.yesterday_learned && entry.yesterday_learned.trim()) ||
    Boolean(entry.today_planned && entry.today_planned.trim())
  );
}

/**
 * Calculate consecutive daily streak.
 */
export function calculateStreak(entries: Record<string, DagboekEntry>): number {
  let streak = 0;
  const checkDate = new Date();

  while (true) {
    const str = checkDate.toISOString().split("T")[0];
    const entry = entries[str];
    if (hasEntryContent(entry)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      if (streak === 0) {
        // If today is empty yet, check if yesterday was filled
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = checkDate.toISOString().split("T")[0];
        if (hasEntryContent(entries[yesterdayStr])) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
      }
      break;
    }
  }

  return streak;
}

/**
 * Format a YYYY-MM-DD date into long Dutch format (e.g. "dinsdag 8 september 2026").
 */
export function formatDutchDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + "T12:00:00");
    return new Intl.DateTimeFormat("nl-NL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Format a YYYY-MM-DD date into short Dutch format (e.g. "8 sep").
 */
export function formatShortDutchDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + "T12:00:00");
    return new Intl.DateTimeFormat("nl-NL", {
      day: "numeric",
      month: "short",
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Format weekday name (e.g. "vandaag", "gisteren", "dinsdag").
 */
export function formatDayRelative(dateStr: string): string {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const dayBefore = new Date(Date.now() - 2 * 86400000)
    .toISOString()
    .split("T")[0];

  if (dateStr === today) return "vandaag";
  if (dateStr === yesterday) return "gisteren";
  if (dateStr === dayBefore) return "eergisteren";

  try {
    const date = new Date(dateStr + "T12:00:00");
    return new Intl.DateTimeFormat("nl-NL", { weekday: "long" }).format(date);
  } catch {
    return dateStr;
  }
}
