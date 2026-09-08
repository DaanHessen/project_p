import { useCallback, useEffect, useMemo, useState } from "react";
import BackButton from "../components/BackButton";
import SEOHead from "../components/SEOHead";
import {
  calculateStreak,
  fetchEntriesFromSupabase,
  formatDutchDate,
  formatDayRelative,
  getAllLocalEntries,
  getDailyQuote,
  getLocalEntry,
  MOOD_LABELS,
  saveEntryToSupabase,
  type DagboekEntry,
} from "../data/dagboek";
import "./DagboekPage.css";

interface DagboekPageProps {
  onNavigateBack: () => void;
}

const STORAGE_UNLOCKED_KEY = "daan_planner_unlocked";
const ENV_PASSWORD = (import.meta.env.VITE_PLANNER_PASSWORD || "").trim();

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function DagboekPage({ onNavigateBack }: DagboekPageProps) {
  const todayStr = useMemo(() => getTodayString(), []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [allEntries, setAllEntries] = useState<Record<string, DagboekEntry>>(() =>
    getAllLocalEntries()
  );
  const [drafts, setDrafts] = useState<Record<string, DagboekEntry>>({});
  const [quoteOffset, setQuoteOffset] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("gesynchroniseerd");

  // Auth / Password Unlock State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_UNLOCKED_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Sync entries from Supabase on mount
  useEffect(() => {
    let mounted = true;
    fetchEntriesFromSupabase().then(() => {
      if (mounted) {
        setAllEntries(getAllLocalEntries());
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const currentEntry = useMemo((): DagboekEntry => {
    return (
      drafts[selectedDate] ??
      allEntries[selectedDate] ??
      getLocalEntry(selectedDate)
    );
  }, [drafts, allEntries, selectedDate]);

  // Streak calculation
  const streak = useMemo(() => calculateStreak(allEntries), [allEntries]);

  // Daily quote
  const quote = useMemo(
    () => getDailyQuote(selectedDate, quoteOffset),
    [selectedDate, quoteOffset]
  );

  const handleNextQuote = () => {
    setQuoteOffset((prev) => prev + 1);
  };

  // Field change handler
  const handleFieldChange = (
    field: keyof DagboekEntry,
    value: string | number
  ) => {
    if (!isUnlocked) return;
    setDrafts((prev) => ({
      ...prev,
      [selectedDate]: {
        ...currentEntry,
        [field]: value,
      },
    }));
    setSaveStatus("wijzigingen nog niet opgeslagen");
  };

  // Save handler
  const handleSave = useCallback(async () => {
    if (!isUnlocked) return;
    setIsSaving(true);
    setSaveStatus("opslaan in supabase...");

    const success = await saveEntryToSupabase(currentEntry);
    setAllEntries((prev) => ({
      ...prev,
      [currentEntry.date]: currentEntry,
    }));
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[currentEntry.date];
      return next;
    });
    setIsSaving(false);
    setSaveStatus(
      success ? "gesynchroniseerd met supabase" : "lokaal opgeslagen (offline)"
    );
  }, [currentEntry, isUnlocked]);

  // Auth unlock submit
  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ENV_PASSWORD) {
      setPasswordError("VITE_PLANNER_PASSWORD niet geconfigureerd.");
      return;
    }
    if (passwordInput.trim().toLowerCase() === ENV_PASSWORD.toLowerCase()) {
      setIsUnlocked(true);
      try {
        localStorage.setItem(STORAGE_UNLOCKED_KEY, "true");
      } catch {
        // ignore
      }
      setShowPasswordModal(false);
      setPasswordInput("");
      setPasswordError(null);
    } else {
      setPasswordError("Onjuist wachtwoord. Probeer opnieuw.");
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    try {
      localStorage.removeItem(STORAGE_UNLOCKED_KEY);
    } catch {
      // ignore
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const dates = Object.keys(allEntries).sort().reverse();
    if (dates.length === 0) {
      alert("Geen dagboek entries gevonden om te exporteren.");
      return;
    }
    const headers = [
      "Datum",
      "Mood (1-5)",
      "Mood Label",
      "Wat gisteren gedaan",
      "Wat gisteren geleerd",
      "Wat vandaag gepland",
    ];
    const rows = dates.map((d) => {
      const e = allEntries[d];
      const m = e.mood || 0;
      const done = (e.yesterday_done || "").replace(/"/g, '""');
      const learned = (e.yesterday_learned || "").replace(/"/g, '""');
      const planned = (e.today_planned || "").replace(/"/g, '""');
      return [
        d,
        m,
        MOOD_LABELS[m] || "",
        `"${done}"`,
        `"${learned}"`,
        `"${planned}"`,
      ].join(";");
    });
    const csv = "\uFEFF" + [headers.join(";"), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dagboek-daan-hessen-${todayStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SEOHead
        title="Daan Hessen · Digitaal Dagboek"
        description="Dagelijks reflectie- en doelstellingsdagboek voor de Minor: Future-proof met AI!"
        canonical="https://daanhessen.nl/minor/dagboek"
        noindex
      />

      <BackButton
        onNavigateHome={onNavigateBack}
        label="minor"
        rightAction={
          <div>
            {isUnlocked ? (
              <button
                type="button"
                className="dagboek__btn"
                onClick={handleLock}
                title="Klik om te vergrendelen"
              >
                [ontgrendeld] vergrendel
              </button>
            ) : (
              <button
                type="button"
                className="dagboek__btn"
                onClick={() => setShowPasswordModal(true)}
              >
                ontgrendelen
              </button>
            )}
          </div>
        }
      />

      <main className="dagboek">
        <header className="dagboek__identity">
          <div>
            <h1 className="dagboek__title">digitaal dagboek</h1>
            <p className="dagboek__subtitle">
              minor: future-proof met ai · dagelijkse reflectie & doelen
            </p>
          </div>

          <dl className="dagboek__meta-details">
            <div className="dagboek__meta-row">
              <dt className="dagboek__meta-label">streak</dt>
              <dd className="dagboek__meta-value dagboek__streak-pill">
                🔥 {streak} {streak === 1 ? "dag" : "dagen"}
              </dd>
            </div>
            <div className="dagboek__meta-row">
              <dt className="dagboek__meta-label">geregistreerd</dt>
              <dd className="dagboek__meta-value">
                {Object.keys(allEntries).length} dagen
              </dd>
            </div>
            <div className="dagboek__meta-row">
              <dt className="dagboek__meta-label">dataopslag</dt>
              <dd className="dagboek__meta-value">Supabase REST</dd>
            </div>
            <div className="dagboek__meta-row">
              <dt className="dagboek__meta-label">modus</dt>
              <dd
                className="dagboek__meta-value"
                style={{ color: isUnlocked ? "var(--accent)" : "var(--fg-faint)" }}
              >
                {isUnlocked ? "bewerken" : "alleen-lezen"}
              </dd>
            </div>
          </dl>

          <div className="dagboek__quote-section">
            <p className="dagboek__quote-text">“{quote.spreuk}”</p>
            <div className="dagboek__quote-meta">
              <span>
                — {quote.auteur} · {quote.thema.toLowerCase()}
              </span>
              <button
                type="button"
                className="dagboek__quote-btn"
                onClick={handleNextQuote}
              >
                nieuwe spreuk ↻
              </button>
            </div>
          </div>

          <div>
            <button
              type="button"
              className="dagboek__btn"
              onClick={handleExportCsv}
              style={{ width: "100%" }}
            >
              exporteer data (.csv) →
            </button>
          </div>
        </header>

        <section className="dagboek__body">
          {/* Date Selector Navigation */}
          <div className="dagboek__date-bar">
            <div className="dagboek__date-display">
              <h2 className="dagboek__date-heading">
                {formatDutchDate(selectedDate)}
              </h2>
              <span className="dagboek__date-sub">
                {formatDayRelative(selectedDate)}
              </span>
            </div>

            <div className="dagboek__date-controls">
              <button
                type="button"
                className="dagboek__btn"
                onClick={() => setSelectedDate(shiftDate(selectedDate, -1))}
                aria-label="Vorige dag"
              >
                ← gisteren
              </button>
              {selectedDate !== todayStr && (
                <button
                  type="button"
                  className="dagboek__btn"
                  onClick={() => setSelectedDate(todayStr)}
                >
                  vandaag
                </button>
              )}
              <button
                type="button"
                className="dagboek__btn"
                onClick={() => setSelectedDate(shiftDate(selectedDate, 1))}
                aria-label="Volgende dag"
              >
                morgen →
              </button>
              <input
                type="date"
                className="dagboek__date-input"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value);
                }}
                aria-label="Kies datum"
              />
            </div>
          </div>

          {/* Mood Rating Bar */}
          <div className="dagboek__mood-bar">
            <span className="dagboek__mood-title">gemoedstoestand:</span>
            <div
              className="dagboek__mood-stars"
              role="group"
              aria-label="Gemoedstoestand beoordeling"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={!isUnlocked}
                  className={`dagboek__star-btn ${
                    currentEntry.mood >= star ? "dagboek__star-btn--active" : ""
                  }`}
                  onClick={() => handleFieldChange("mood", star)}
                  title={`${star} ster - ${MOOD_LABELS[star]}`}
                >
                  ★
                </button>
              ))}
            </div>
            <span className="dagboek__mood-label">
              {MOOD_LABELS[currentEntry.mood] || "nog niet beoordeeld"}
            </span>
          </div>

          {/* 3 Reflection Prompts: Editorial Reader vs Active Editor */}
          {!isUnlocked ? (
            <div className="dagboek__reader">
              <article className="dagboek__reader-entry">
                <header className="dagboek__reader-header">
                  <span className="dagboek__reader-step">01</span>
                  <h3 className="dagboek__reader-title">
                    Wat heb ik gisteren gedaan?
                  </h3>
                  <span className="dagboek__reader-hint">
                    activiteiten & resultaten
                  </span>
                </header>
                <div className="dagboek__reader-body">
                  {currentEntry.yesterday_done ? (
                    <p className="dagboek__reader-text">
                      {currentEntry.yesterday_done}
                    </p>
                  ) : (
                    <p className="dagboek__reader-empty">
                      Geen notitie ingevoerd voor deze dag.
                    </p>
                  )}
                </div>
              </article>

              <article className="dagboek__reader-entry">
                <header className="dagboek__reader-header">
                  <span className="dagboek__reader-step">02</span>
                  <h3 className="dagboek__reader-title">
                    Wat heb ik van gisteren geleerd?
                  </h3>
                  <span className="dagboek__reader-hint">
                    inzichten & reflectie
                  </span>
                </header>
                <div className="dagboek__reader-body">
                  {currentEntry.yesterday_learned ? (
                    <p className="dagboek__reader-text">
                      {currentEntry.yesterday_learned}
                    </p>
                  ) : (
                    <p className="dagboek__reader-empty">
                      Geen notitie ingevoerd voor deze dag.
                    </p>
                  )}
                </div>
              </article>

              <article className="dagboek__reader-entry">
                <header className="dagboek__reader-header">
                  <span className="dagboek__reader-step">03</span>
                  <h3 className="dagboek__reader-title">
                    Wat ga ik vandaag doen?
                  </h3>
                  <span className="dagboek__reader-hint">
                    doelen & intenties
                  </span>
                </header>
                <div className="dagboek__reader-body">
                  {currentEntry.today_planned ? (
                    <p className="dagboek__reader-text">
                      {currentEntry.today_planned}
                    </p>
                  ) : (
                    <p className="dagboek__reader-empty">
                      Geen notitie ingevoerd voor deze dag.
                    </p>
                  )}
                </div>
              </article>
            </div>
          ) : (
            <div className="dagboek__editor">
              <div className="dagboek__editor-field">
                <label htmlFor="yesterday_done" className="dagboek__editor-label">
                  <span>1. Wat heb ik gisteren gedaan?</span>
                  <span className="dagboek__editor-hint">
                    activiteiten & resultaten
                  </span>
                </label>
                <textarea
                  id="yesterday_done"
                  className="dagboek__textarea"
                  value={currentEntry.yesterday_done}
                  onChange={(e) =>
                    handleFieldChange("yesterday_done", e.target.value)
                  }
                  placeholder="Beschrijf de taken, code, onderzoeken of colleges..."
                  rows={4}
                />
              </div>

              <div className="dagboek__editor-field">
                <label
                  htmlFor="yesterday_learned"
                  className="dagboek__editor-label"
                >
                  <span>2. Wat heb ik van gisteren geleerd?</span>
                  <span className="dagboek__editor-hint">
                    inzichten & reflectie
                  </span>
                </label>
                <textarea
                  id="yesterday_learned"
                  className="dagboek__textarea"
                  value={currentEntry.yesterday_learned}
                  onChange={(e) =>
                    handleFieldChange("yesterday_learned", e.target.value)
                  }
                  placeholder="Welke inzichten, feedback of technische kennis deed je op..."
                  rows={4}
                />
              </div>

              <div className="dagboek__editor-field">
                <label htmlFor="today_planned" className="dagboek__editor-label">
                  <span>3. Wat ga ik vandaag doen?</span>
                  <span className="dagboek__editor-hint">doelen & intenties</span>
                </label>
                <textarea
                  id="today_planned"
                  className="dagboek__textarea"
                  value={currentEntry.today_planned}
                  onChange={(e) =>
                    handleFieldChange("today_planned", e.target.value)
                  }
                  placeholder="Wat zijn je prioriteiten en geplande deliverables..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Footer Status Bar */}
          <div className="dagboek__footer-bar">
            <div className="dagboek__status-row">
              <span
                className="dagboek__status-dot"
                data-saving={isSaving}
              />
              <span>{saveStatus}</span>
            </div>

            {isUnlocked && (
              <button
                type="button"
                className="dagboek__btn dagboek__btn--primary"
                disabled={isSaving}
                onClick={handleSave}
              >
                {isSaving ? "opslaan..." : "opslaan in supabase"}
              </button>
            )}
          </div>
        </section>
      </main>

      {/* Password Unlock Modal */}
      {showPasswordModal && (
        <div
          className="dagboek-modal-overlay"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="dagboek-modal"
            role="dialog"
            aria-labelledby="unlock-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="unlock-modal-title" className="dagboek-modal__title">
              ontgrendel digitaal dagboek bewerken
            </h2>
            <p className="dagboek-modal__text">
              Voer je wachtwoord in om notities en gemoedstoestanden direct bij te
              werken en op te slaan in Supabase.
            </p>
            <form onSubmit={handleUnlockSubmit}>
              <input
                type="password"
                autoFocus
                className="dagboek-modal__input"
                placeholder="Wachtwoord..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              {passwordError && (
                <p className="dagboek-modal__error">{passwordError}</p>
              )}
              <div className="dagboek-modal__buttons">
                <button
                  type="button"
                  className="dagboek__btn"
                  onClick={() => setShowPasswordModal(false)}
                >
                  annuleren
                </button>
                <button
                  type="submit"
                  className="dagboek__btn dagboek__btn--primary"
                >
                  ontgrendelen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
