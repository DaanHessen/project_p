import { useMemo, useState } from "react";
import {
  minorData,
  type LeeruitkomstId,
  type LogEntry,
  type Story,
  type StoryType,
} from "../data/minor";
import SEOHead from "../components/SEOHead";
import "./PlannerPage.css";

interface PlannerPageProps {
  onNavigateBack: () => void;
}

const STORAGE_UNLOCKED_KEY = "daan_planner_unlocked";
const STORAGE_STORIES_KEY = "daan_minor_stories_draft";
const STORAGE_LOGS_KEY = "daan_minor_logs_draft";

// Accepted passwords
const ACCEPTED_PASSWORDS = [
  "futureproof",
  "daan",
  "daan2026",
  "project_p",
  import.meta.env.VITE_PLANNER_PASSWORD,
].filter(Boolean) as string[];

const ALL_LUS: LeeruitkomstId[] = ["LU1", "LU2", "LU3", "LU4", "LU5"];

export default function PlannerPage({ onNavigateBack }: PlannerPageProps) {
  // Data state
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STORIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return minorData.userStories;
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return minorData.logEntries;
  });

  const saveStories = (newStories: Story[]) => {
    setStories(newStories);
    try {
      localStorage.setItem(STORAGE_STORIES_KEY, JSON.stringify(newStories));
    } catch {
      // ignore
    }
  };

  const saveLogs = (newLogs: LogEntry[]) => {
    setLogs(newLogs);
    try {
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(newLogs));
    } catch {
      // ignore
    }
  };

  // Auth / Password Unlock State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_UNLOCKED_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [showPasswordModal, setShowPasswordModal] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.location.search.includes("auth=1");
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passwordInput.trim().toLowerCase();
    const custom = (localStorage.getItem("daan_planner_pwd") || "").trim().toLowerCase();

    if (ACCEPTED_PASSWORDS.map((p) => p.toLowerCase()).includes(clean) || (custom && clean === custom)) {
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

  // View & Filter State
  const [activeTab, setActiveTab] = useState<"board" | "table" | "logbook">("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSprint, setSelectedSprint] = useState<number | "all">("all");

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      if (selectedSprint !== "all" && story.sprint !== selectedSprint) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = story.id.toLowerCase().includes(q);
        const matchesTitle = story.title.toLowerCase().includes(q);
        const matchesAs = story.asA.toLowerCase().includes(q);
        const matchesWant = story.iWant.toLowerCase().includes(q);
        const matchesSo = story.soThat.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesAs && !matchesWant && !matchesSo) {
          return false;
        }
      }
      return true;
    });
  }, [stories, selectedSprint, searchQuery]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedSprint !== "all" && log.sprint !== selectedSprint) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = log.id.toLowerCase().includes(q);
        const matchesTitle = log.title.toLowerCase().includes(q);
        const matchesDesc = log.description.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [logs, selectedSprint, searchQuery]);

  const todoStories = useMemo(
    () => filteredStories.filter((s) => s.status === "To Do"),
    [filteredStories]
  );
  const inProgressStories = useMemo(
    () => filteredStories.filter((s) => s.status === "In Progress"),
    [filteredStories]
  );
  const doneStories = useMemo(
    () => filteredStories.filter((s) => s.status === "Done"),
    [filteredStories]
  );

  // Edit / Add Story Modal
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [isNewStory, setIsNewStory] = useState(false);

  // Edit / Add Log Modal
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
  const [isNewLog, setIsNewLog] = useState(false);

  const handleMoveStory = (storyId: string, direction: "prev" | "next") => {
    if (!isUnlocked) return;
    const updated = stories.map((s) => {
      if (s.id !== storyId) return s;
      let newStatus = s.status;
      if (direction === "next") {
        if (s.status === "To Do") newStatus = "In Progress";
        else if (s.status === "In Progress") newStatus = "Done";
      } else {
        if (s.status === "Done") newStatus = "In Progress";
        else if (s.status === "In Progress") newStatus = "To Do";
      }
      return { ...s, status: newStatus };
    });
    saveStories(updated);
  };

  const handleOpenNewStory = () => {
    const nextNum = stories.length + 1;
    setEditingStory({
      id: `US-${String(nextNum).padStart(2, "0")}`,
      sprint: typeof selectedSprint === "number" ? selectedSprint : 1,
      type: "US",
      title: "",
      asA: "student Minor Future-proof met AI",
      iWant: "",
      soThat: "",
      status: "To Do",
      acceptanceCriteria: [],
      leeruitkomsten: [],
    });
    setIsNewStory(true);
  };

  const handleSaveStory = (storyToSave: Story) => {
    if (isNewStory) {
      saveStories([...stories, storyToSave]);
    } else {
      saveStories(stories.map((s) => (s.id === storyToSave.id ? storyToSave : s)));
    }
    setEditingStory(null);
  };

  const handleDeleteStory = (storyId: string) => {
    if (confirm(`Verwijder story ${storyId}?`)) {
      saveStories(stories.filter((s) => s.id !== storyId));
    }
  };

  const handleOpenNewLog = () => {
    const nextNum = logs.length + 1;
    setEditingLog({
      id: `LOG-${String(nextNum).padStart(2, "0")}`,
      date: new Date().toISOString().slice(0, 10),
      sprint: typeof selectedSprint === "number" ? selectedSprint : 1,
      title: "",
      description: "",
      leeruitkomsten: [],
      links: [],
    });
    setIsNewLog(true);
  };

  const handleSaveLog = (logToSave: LogEntry) => {
    if (isNewLog) {
      saveLogs([logToSave, ...logs]);
    } else {
      saveLogs(logs.map((l) => (l.id === logToSave.id ? logToSave : l)));
    }
    setEditingLog(null);
  };

  const handleDeleteLog = (logId: string) => {
    if (confirm(`Verwijder logboek item ${logId}?`)) {
      saveLogs(logs.filter((l) => l.id !== logId));
    }
  };

  return (
    <>
      <SEOHead
        title="Daan Hessen · Minor: Future-proof met AI! · Planner"
        description="Standalone full-viewport planner en integraal logboek voor de minor."
        canonical="https://daanhessen.nl/minor/logboek"
        noindex
      />

      <div className="planner-page">
        <div className="planner-page__scrim" aria-hidden="true" />

        {/* Topbar */}
        <header className="planner-page__topbar">
          <div className="planner-page__nav-left">
            <button
              type="button"
              className="planner-page__back-btn"
              onClick={onNavigateBack}
            >
              ← /minor
            </button>
            <div className="planner-page__breadcrumbs">
              <span>minor</span>
              <span>/</span>
              <span className="planner-page__title">planner & logboek</span>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <div className="planner-page__tabs">
            <button
              type="button"
              className={`planner-page__tab ${
                activeTab === "board" ? "planner-page__tab--active" : ""
              }`}
              onClick={() => setActiveTab("board")}
            >
              [board: {stories.length}]
            </button>
            <button
              type="button"
              className={`planner-page__tab ${
                activeTab === "table" ? "planner-page__tab--active" : ""
              }`}
              onClick={() => setActiveTab("table")}
            >
              [table: {stories.length}]
            </button>
            <button
              type="button"
              className={`planner-page__tab ${
                activeTab === "logbook" ? "planner-page__tab--active" : ""
              }`}
              onClick={() => setActiveTab("logbook")}
            >
              [logbook: {logs.length}]
            </button>
          </div>

          {/* Controls & Password Unlock */}
          <div className="planner-page__nav-right">
            <input
              type="text"
              className="planner-page__search"
              placeholder="filter items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="planner-page__select"
              value={selectedSprint}
              onChange={(e) =>
                setSelectedSprint(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                )
              }
            >
              <option value="all">all sprints</option>
              {minorData.sprints.map((s) => (
                <option key={s.number} value={s.number}>
                  sprint {s.number}
                </option>
              ))}
            </select>

            {isUnlocked ? (
              <>
                <button
                  type="button"
                  className="planner-page__btn planner-page__btn--primary"
                  onClick={activeTab === "logbook" ? handleOpenNewLog : handleOpenNewStory}
                >
                  + {activeTab === "logbook" ? "new log" : "new story"}
                </button>

                <button
                  type="button"
                  className="planner-page__btn planner-page__btn--unlocked"
                  onClick={handleLock}
                  title="Klik om te vergrendelen"
                >
                  [unlocked: lock]
                </button>
              </>
            ) : (
              <button
                type="button"
                className="planner-page__btn planner-page__btn--primary"
                onClick={() => {
                  setPasswordError(null);
                  setPasswordInput("");
                  setShowPasswordModal(true);
                }}
              >
                [unlock / edit]
              </button>
            )}
          </div>
        </header>

        {/* Full Viewport Body */}
        <main className="planner-page__content">
          {/* ==================== VIEW: KANBAN BOARD ==================== */}
          {activeTab === "board" && (
            <div className="planner-page__board">
              {/* Column 1: To Do */}
              <div className="planner-page__column">
                <div className="planner-page__column-header">
                  <div className="planner-page__column-title">
                    <span className="planner-page__dot" />
                    <span>To Do</span>
                  </div>
                  <span className="planner-page__column-count">{todoStories.length}</span>
                </div>
                <div className="planner-page__cards">
                  {todoStories.length === 0 ? (
                    <div className="planner-page__empty-col">geen items in to do</div>
                  ) : (
                    todoStories.map((story) => (
                      <BoardCard
                        key={story.id}
                        story={story}
                        isUnlocked={isUnlocked}
                        onMoveRight={() => handleMoveStory(story.id, "next")}
                        onEdit={() => {
                          setEditingStory({ ...story });
                          setIsNewStory(false);
                        }}
                        onDelete={() => handleDeleteStory(story.id)}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Column 2: In Progress */}
              <div className="planner-page__column">
                <div className="planner-page__column-header">
                  <div className="planner-page__column-title">
                    <span className="planner-page__dot planner-page__dot--progress" />
                    <span>In Progress</span>
                  </div>
                  <span className="planner-page__column-count">
                    {inProgressStories.length}
                  </span>
                </div>
                <div className="planner-page__cards">
                  {inProgressStories.length === 0 ? (
                    <div className="planner-page__empty-col">
                      geen items in uitvoering
                    </div>
                  ) : (
                    inProgressStories.map((story) => (
                      <BoardCard
                        key={story.id}
                        story={story}
                        isUnlocked={isUnlocked}
                        onMoveLeft={() => handleMoveStory(story.id, "prev")}
                        onMoveRight={() => handleMoveStory(story.id, "next")}
                        onEdit={() => {
                          setEditingStory({ ...story });
                          setIsNewStory(false);
                        }}
                        onDelete={() => handleDeleteStory(story.id)}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Column 3: Done */}
              <div className="planner-page__column">
                <div className="planner-page__column-header">
                  <div className="planner-page__column-title">
                    <span className="planner-page__dot planner-page__dot--done" />
                    <span>Done</span>
                  </div>
                  <span className="planner-page__column-count">{doneStories.length}</span>
                </div>
                <div className="planner-page__cards">
                  {doneStories.length === 0 ? (
                    <div className="planner-page__empty-col">geen afgeronde items</div>
                  ) : (
                    doneStories.map((story) => (
                      <BoardCard
                        key={story.id}
                        story={story}
                        isUnlocked={isUnlocked}
                        onMoveLeft={() => handleMoveStory(story.id, "prev")}
                        onEdit={() => {
                          setEditingStory({ ...story });
                          setIsNewStory(false);
                        }}
                        onDelete={() => handleDeleteStory(story.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW: TABLE ==================== */}
          {activeTab === "table" && (
            <div className="planner-page__table-wrap">
              <table className="planner-page__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Sprint</th>
                    <th>Titel & Formule</th>
                    <th>Leeruitkomsten</th>
                    <th>Status</th>
                    {isUnlocked && <th>Acties</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredStories.length === 0 ? (
                    <tr>
                      <td colSpan={isUnlocked ? 7 : 6} style={{ textAlign: "center", color: "var(--fg-faint)" }}>
                        geen items gevonden
                      </td>
                    </tr>
                  ) : (
                    filteredStories.map((story) => (
                      <tr key={story.id}>
                        <td>
                          <span className="planner-page__card-id">{story.id}</span>
                        </td>
                        <td>
                          <span className="planner-page__tag">{story.type}</span>
                        </td>
                        <td>
                          <span className="planner-page__tag">Sprint {story.sprint}</span>
                        </td>
                        <td>
                          <strong style={{ color: "var(--fg)" }}>{story.title}</strong>
                          <div style={{ fontSize: "0.75rem", color: "var(--fg-faint)", marginTop: "3px" }}>
                            Als {story.asA}, wil ik {story.iWant}, zodat {story.soThat}.
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                            {story.leeruitkomsten?.map((lu) => (
                              <span key={lu} className="planner-page__tag">
                                {lu}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className="planner-page__tag">{story.status}</span>
                        </td>
                        {isUnlocked && (
                          <td>
                            <div className="planner-page__card-btn-group">
                              <button
                                type="button"
                                className="planner-page__mini-btn"
                                onClick={() => {
                                  setEditingStory({ ...story });
                                  setIsNewStory(false);
                                }}
                              >
                                edit
                              </button>
                              <button
                                type="button"
                                className="planner-page__mini-btn"
                                onClick={() => handleDeleteStory(story.id)}
                              >
                                del
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ==================== VIEW: LOGBOOK ==================== */}
          {activeTab === "logbook" && (
            <div className="planner-page__logbook">
              {filteredLogs.length === 0 ? (
                <div className="planner-page__empty-col">geen logboek items</div>
              ) : (
                filteredLogs.map((log) => (
                  <article key={log.id} className="planner-page__log-entry">
                    <div className="planner-page__log-meta">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="planner-page__card-id">{log.id}</span>
                        <span className="planner-page__tag">sprint {log.sprint}</span>
                        <span style={{ color: "var(--fg-faint)" }}>{log.date}</span>
                      </div>
                      {isUnlocked && (
                        <div className="planner-page__card-btn-group">
                          <button
                            type="button"
                            className="planner-page__mini-btn"
                            onClick={() => {
                              setEditingLog({ ...log });
                              setIsNewLog(false);
                            }}
                          >
                            edit
                          </button>
                          <button
                            type="button"
                            className="planner-page__mini-btn"
                            onClick={() => handleDeleteLog(log.id)}
                          >
                            del
                          </button>
                        </div>
                      )}
                    </div>

                    <h3 className="planner-page__log-title">{log.title}</h3>
                    <p className="planner-page__log-desc">{log.description}</p>

                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {log.leeruitkomsten?.map((lu) => (
                        <span key={lu} className="planner-page__tag">
                          {lu}
                        </span>
                      ))}
                    </div>

                    {log.links && log.links.length > 0 && (
                      <div className="planner-page__log-links">
                        {log.links.map((link) => (
                          <a
                            key={link.url + link.label}
                            className="planner-page__log-link"
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>↗</span>
                            <span>{link.label}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          )}
        </main>

        {/* ==================== MODAL: PASSWORD UNLOCK ==================== */}
        {showPasswordModal && (
          <div className="planner-modal-backdrop" onClick={() => setShowPasswordModal(false)}>
            <div className="planner-modal" onClick={(e) => e.stopPropagation()}>
              <div className="planner-modal__header">
                <span className="planner-modal__title">Wachtwoord Vereist</span>
                <button
                  type="button"
                  className="planner-modal__close"
                  onClick={() => setShowPasswordModal(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUnlockSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p className="planner-modal__body">
                  Vul het beheerwachtwoord in om bewerkmodus te ontgrendelen:
                </p>

                <input
                  type="password"
                  className="planner-modal__input"
                  placeholder="wachtwoord..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                />

                {passwordError && (
                  <span className="planner-modal__error">{passwordError}</span>
                )}

                <div className="planner-modal__footer">
                  <button
                    type="button"
                    className="planner-page__btn"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    annuleren
                  </button>
                  <button
                    type="submit"
                    className="planner-page__btn planner-page__btn--primary"
                  >
                    ontgrendelen
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== MODAL: EDIT STORY ==================== */}
        {editingStory && (
          <div className="planner-modal-backdrop" onClick={() => setEditingStory(null)}>
            <div className="planner-modal" style={{ maxWidth: "34rem" }} onClick={(e) => e.stopPropagation()}>
              <div className="planner-modal__header">
                <span className="planner-modal__title">
                  {isNewStory ? "+ Nieuwe Story" : `✎ ${editingStory.id} Bewerken`}
                </span>
                <button
                  type="button"
                  className="planner-modal__close"
                  onClick={() => setEditingStory(null)}
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveStory(editingStory);
                }}
                style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                  <div>
                    <label style={{ fontSize: "0.6875rem", color: "var(--fg-faint)" }}>ID</label>
                    <input
                      type="text"
                      className="planner-modal__input"
                      value={editingStory.id}
                      onChange={(e) =>
                        setEditingStory({ ...editingStory, id: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.6875rem", color: "var(--fg-faint)" }}>Type</label>
                    <select
                      className="planner-page__select"
                      style={{ width: "100%", padding: "0.6rem" }}
                      value={editingStory.type}
                      onChange={(e) =>
                        setEditingStory({
                          ...editingStory,
                          type: e.target.value as StoryType,
                        })
                      }
                    >
                      <option value="US">US</option>
                      <option value="RS">RS</option>
                      <option value="LS">LS</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.6875rem", color: "var(--fg-faint)" }}>Sprint</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      className="planner-modal__input"
                      value={editingStory.sprint}
                      onChange={(e) =>
                        setEditingStory({
                          ...editingStory,
                          sprint: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.6875rem", color: "var(--fg-faint)" }}>Titel</label>
                  <input
                    type="text"
                    className="planner-modal__input"
                    value={editingStory.title}
                    onChange={(e) =>
                      setEditingStory({ ...editingStory, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  <div>
                    <label style={{ fontSize: "0.6875rem", color: "var(--fg-faint)" }}>Als</label>
                    <input
                      type="text"
                      className="planner-modal__input"
                      value={editingStory.asA}
                      onChange={(e) =>
                        setEditingStory({ ...editingStory, asA: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.6875rem", color: "var(--fg-faint)" }}>Status</label>
                    <select
                      className="planner-page__select"
                      style={{ width: "100%", padding: "0.6rem" }}
                      value={editingStory.status}
                      onChange={(e) =>
                        setEditingStory({
                          ...editingStory,
                          status: e.target.value as Story["status"],
                        })
                      }
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.6875rem", color: "var(--fg-faint)" }}>Wil ik</label>
                  <input
                    type="text"
                    className="planner-modal__input"
                    value={editingStory.iWant}
                    onChange={(e) =>
                      setEditingStory({ ...editingStory, iWant: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.6875rem", color: "var(--fg-faint)" }}>Zodat</label>
                  <input
                    type="text"
                    className="planner-modal__input"
                    value={editingStory.soThat}
                    onChange={(e) =>
                      setEditingStory({ ...editingStory, soThat: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.6875rem", color: "var(--fg-faint)" }}>Leeruitkomsten</label>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "4px" }}>
                    {ALL_LUS.map((lu) => {
                      const active = (editingStory.leeruitkomsten || []).includes(lu);
                      return (
                        <button
                          key={lu}
                          type="button"
                          className="planner-page__btn"
                          style={{
                            borderColor: active ? "var(--accent)" : "var(--rule)",
                            color: active ? "var(--accent)" : "var(--fg-muted)",
                          }}
                          onClick={() => {
                            const cur = editingStory.leeruitkomsten || [];
                            const next = active
                              ? cur.filter((x) => x !== lu)
                              : [...cur, lu];
                            setEditingStory({ ...editingStory, leeruitkomsten: next });
                          }}
                        >
                          {lu}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="planner-modal__footer">
                  <button
                    type="button"
                    className="planner-page__btn"
                    onClick={() => setEditingStory(null)}
                  >
                    annuleren
                  </button>
                  <button
                    type="submit"
                    className="planner-page__btn planner-page__btn--primary"
                  >
                    opslaan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== MODAL: EDIT LOG ==================== */}
        {editingLog && (
          <div className="planner-modal-backdrop" onClick={() => setEditingLog(null)}>
            <div className="planner-modal" style={{ maxWidth: "34rem" }} onClick={(e) => e.stopPropagation()}>
              <div className="planner-modal__header">
                <span className="planner-modal__title">
                  {isNewLog ? "+ Nieuw Logboek Item" : `✎ ${editingLog.id} Bewerken`}
                </span>
                <button
                  type="button"
                  className="planner-modal__close"
                  onClick={() => setEditingLog(null)}
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveLog(editingLog);
                }}
                style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                  <div>
                    <label style={{ fontSize: "0.6875rem", color: "var(--fg-faint)" }}>ID</label>
                    <input
                      type="text"
                      className="planner-modal__input"
                      value={editingLog.id}
                      onChange={(e) =>
                        setEditingLog({ ...editingLog, id: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.6875rem", color: "var(--fg-faint)" }}>Datum</label>
                    <input
                      type="date"
                      className="planner-modal__input"
                      value={editingLog.date}
                      onChange={(e) =>
                        setEditingLog({ ...editingLog, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.6875rem", color: "var(--fg-faint)" }}>Sprint</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      className="planner-modal__input"
                      value={editingLog.sprint}
                      onChange={(e) =>
                        setEditingLog({
                          ...editingLog,
                          sprint: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.6875rem", color: "var(--fg-faint)" }}>Titel</label>
                  <input
                    type="text"
                    className="planner-modal__input"
                    value={editingLog.title}
                    onChange={(e) =>
                      setEditingLog({ ...editingLog, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.6875rem", color: "var(--fg-faint)" }}>Beschrijving</label>
                  <textarea
                    className="planner-modal__input"
                    style={{ minHeight: "5rem" }}
                    value={editingLog.description}
                    onChange={(e) =>
                      setEditingLog({ ...editingLog, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="planner-modal__footer">
                  <button
                    type="button"
                    className="planner-page__btn"
                    onClick={() => setEditingLog(null)}
                  >
                    annuleren
                  </button>
                  <button
                    type="submit"
                    className="planner-page__btn planner-page__btn--primary"
                  >
                    opslaan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Standalone Kanban Card
// ---------------------------------------------------------------------------
function BoardCard({
  story,
  isUnlocked,
  onMoveLeft,
  onMoveRight,
  onEdit,
  onDelete,
}: {
  story: Story;
  isUnlocked: boolean;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="planner-page__card">
      <div className="planner-page__card-head">
        <span className="planner-page__card-id">{story.id}</span>
        <div className="planner-page__card-tags">
          <span className="planner-page__tag">{story.type}</span>
          <span>sprint {story.sprint}</span>
        </div>
      </div>

      <h4 className="planner-page__card-title">{story.title}</h4>

      <div className="planner-page__card-desc">
        <div>
          <span>als:</span> {story.asA}
        </div>
        <div>
          <span>wil ik:</span> {story.iWant}
        </div>
        <div>
          <span>zodat:</span> {story.soThat}
        </div>
      </div>

      {story.leeruitkomsten && story.leeruitkomsten.length > 0 && (
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "2px" }}>
          {story.leeruitkomsten.map((lu) => (
            <span key={lu} className="planner-page__tag">
              {lu}
            </span>
          ))}
        </div>
      )}

      {story.acceptanceCriteria && story.acceptanceCriteria.length > 0 && (
        <div className="planner-page__card-criteria">
          ✓ {story.acceptanceCriteria.length} acceptatiecriteria
        </div>
      )}

      {isUnlocked && (
        <div className="planner-page__card-actions">
          <div className="planner-page__card-btn-group">
            {onMoveLeft && (
              <button
                type="button"
                className="planner-page__mini-btn"
                onClick={onMoveLeft}
                title="verplaats links"
              >
                ←
              </button>
            )}
            {onMoveRight && (
              <button
                type="button"
                className="planner-page__mini-btn"
                onClick={onMoveRight}
                title="verplaats rechts"
              >
                →
              </button>
            )}
          </div>
          <div className="planner-page__card-btn-group">
            <button
              type="button"
              className="planner-page__mini-btn"
              onClick={onEdit}
            >
              edit
            </button>
            <button
              type="button"
              className="planner-page__mini-btn"
              onClick={onDelete}
            >
              del
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
