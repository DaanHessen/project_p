import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  EvidenceLink,
  LeeruitkomstId,
  LogEntry,
  MinorData,
  Story,
  StoryType,
} from "../data/minor";
import "./MinorPlanner.css";

interface MinorPlannerProps {
  data: MinorData;
}

const LOCAL_STORAGE_PAT_KEY = "daan_minor_gh_pat";
const LOCAL_STORAGE_AUTH_KEY = "daan_minor_auth_mode";
const LOCAL_STORAGE_STORIES_KEY = "daan_minor_stories_draft";
const LOCAL_STORAGE_LOGS_KEY = "daan_minor_logs_draft";

const GITHUB_REPO_OWNER = "DaanHessen";
const GITHUB_REPO_NAME = "project_p";
const GITHUB_FILE_PATH = "src/data/minor.ts";

const ALL_LUS: LeeruitkomstId[] = ["LU1", "LU2", "LU3", "LU4", "LU5"];

export default function MinorPlanner({ data }: MinorPlannerProps) {
  // ---------------------------------------------------------------------------
  // Data State & Drafts
  // ---------------------------------------------------------------------------
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_STORIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore parse error
    }
    return data.userStories;
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore parse error
    }
    return data.logEntries;
  });

  // Track if current state differs from initial static bundle
  const isDirty = useMemo(() => {
    return (
      JSON.stringify(stories) !== JSON.stringify(data.userStories) ||
      JSON.stringify(logs) !== JSON.stringify(data.logEntries)
    );
  }, [stories, logs, data.userStories, data.logEntries]);

  // Persist drafts to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_STORIES_KEY, JSON.stringify(stories));
      localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(logs));
    } catch {
      // ignore storage quota error
    }
  }, [stories, logs]);

  // Check Tailscale / localhost environment
  const isTailscaleOrLocal = useMemo(() => {
    if (typeof window === "undefined") return false;
    const h = window.location.hostname;
    return (
      h === "localhost" ||
      h === "127.0.0.1" ||
      h.startsWith("100.") ||
      h.endsWith(".ts.net")
    );
  }, []);

  const [githubPat, setGithubPat] = useState<string>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_PAT_KEY) || "";
    } catch {
      return "";
    }
  });

  const [authMethod, setAuthMethod] = useState<"pat" | "tailscale" | null>(() => {
    try {
      const savedPat = localStorage.getItem(LOCAL_STORAGE_PAT_KEY);
      if (savedPat) return "pat";
      const savedMode = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
      if (savedMode === "tailscale" && typeof window !== "undefined") {
        const h = window.location.hostname;
        if (
          h === "localhost" ||
          h === "127.0.0.1" ||
          h.startsWith("100.") ||
          h.endsWith(".ts.net")
        ) {
          return "tailscale";
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      const savedPat = localStorage.getItem(LOCAL_STORAGE_PAT_KEY);
      if (savedPat) return true;
      const savedMode = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
      if (savedMode === "tailscale" && typeof window !== "undefined") {
        const h = window.location.hostname;
        if (
          h === "localhost" ||
          h === "127.0.0.1" ||
          h.startsWith("100.") ||
          h.endsWith(".ts.net")
        ) {
          return true;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInputPat, setAuthInputPat] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Unlock with GitHub PAT
  const handleVerifyPat = useCallback(
    async (tokenToVerify: string) => {
      const cleanToken = tokenToVerify.trim();
      if (!cleanToken) {
        setAuthError("Vul een geldig GitHub Personal Access Token in.");
        return;
      }

      setAuthLoading(true);
      setAuthError(null);
      setAuthSuccess(null);

      try {
        // 1. Verify user identity
        const userRes = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (!userRes.ok) {
          throw new Error("Ongeldig token of GitHub API onbereikbaar.");
        }

        const userData = await userRes.json();
        const username = userData.login;

        // 2. Verify repository push permissions on project_p
        const repoRes = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`,
          {
            headers: {
              Authorization: `Bearer ${cleanToken}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!repoRes.ok) {
          throw new Error(
            `Geen toegang tot repository ${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}.`
          );
        }

        const repoData = await repoRes.json();
        if (!repoData.permissions || !repoData.permissions.push) {
          throw new Error(
            `Gebruiker ${username} heeft geen schrijfrechten op deze repository.`
          );
        }

        // Token validated successfully!
        localStorage.setItem(LOCAL_STORAGE_PAT_KEY, cleanToken);
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, "pat");
        setGithubPat(cleanToken);
        setAuthMethod("pat");
        setIsUnlocked(true);
        setAuthSuccess(
          `Geverifieerd als ${username} met schrijfrechten op ${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}!`
        );

        setTimeout(() => {
          setShowAuthModal(false);
          setAuthSuccess(null);
        }, 1200);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Authenticatie mislukt.";
        setAuthError(msg);
      } finally {
        setAuthLoading(false);
      }
    },
    []
  );

  // Unlock with Local / Tailscale environment
  const handleUnlockLocal = () => {
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, "tailscale");
    setAuthMethod("tailscale");
    setIsUnlocked(true);
    setShowAuthModal(false);
  };

  // Lock / Logout
  const handleLock = () => {
    localStorage.removeItem(LOCAL_STORAGE_PAT_KEY);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    setGithubPat("");
    setAuthMethod(null);
    setIsUnlocked(false);
  };

  // ---------------------------------------------------------------------------
  // Sync to GitHub (Automatic commit to trigger Vercel deployment)
  // ---------------------------------------------------------------------------
  const handleSyncToGitHub = async () => {
    if (!githubPat) {
      setShowAuthModal(true);
      return;
    }

    setSyncLoading(true);
    setSyncMessage({ type: "info", text: "Verbinden met GitHub API..." });

    try {
      // 1. Fetch current file to get SHA & full content
      const getRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${GITHUB_FILE_PATH}`,
        {
          headers: {
            Authorization: `Bearer ${githubPat}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!getRes.ok) {
        throw new Error(
          `Kon ${GITHUB_FILE_PATH} niet ophalen van GitHub (HTTP ${getRes.status}).`
        );
      }

      const fileData = await getRes.json();
      const currentSha = fileData.sha;
      const currentRaw = decodeURIComponent(escape(atob(fileData.content)));

      // 2. Replace userStories and logEntries cleanly in the source file
      const userStoriesJson = JSON.stringify(stories, null, 2)
        .split("\n")
        .map((line, idx) => (idx === 0 ? line : `  ${line}`))
        .join("\n");

      const logEntriesJson = JSON.stringify(logs, null, 2)
        .split("\n")
        .map((line, idx) => (idx === 0 ? line : `  ${line}`))
        .join("\n");

      // Robust regex substitution to keep all types, meta, leeruitkomsten & sprints intact
      let updatedContent = currentRaw.replace(
        /userStories:\s*\[[\s\S]*?\],\s*logEntries:/m,
        `userStories: ${userStoriesJson},\n  logEntries:`
      );

      updatedContent = updatedContent.replace(
        /logEntries:\s*\[[\s\S]*?\],?\s*};?\s*$/m,
        `logEntries: ${logEntriesJson},\n};`
      );

      // Base64 encode for GitHub API (UTF-8 safe)
      const encodedContent = btoa(unescape(encodeURIComponent(updatedContent)));

      // 3. Commit to GitHub main branch
      const putRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${GITHUB_FILE_PATH}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubPat}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: `chore(minor): update user stories & logboek via planner [${new Date().toISOString()}]`,
            content: encodedContent,
            sha: currentSha,
            branch: "main",
          }),
        }
      );

      if (!putRes.ok) {
        const errorData = await putRes.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Commit mislukt (HTTP ${putRes.status}).`
        );
      }

      setSyncMessage({
        type: "success",
        text: "Succesvol gecommit naar GitHub main! Vercel bouwt en publiceert de update automatisch.",
      });

      // Clear local storage draft
      localStorage.removeItem(LOCAL_STORAGE_STORIES_KEY);
      localStorage.removeItem(LOCAL_STORAGE_LOGS_KEY);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Synchronisatie mislukt.";
      setSyncMessage({ type: "error", text: msg });
    } finally {
      setSyncLoading(false);
    }
  };

  // Fallback: Export / Download updated data as JSON / TS
  const handleExportData = () => {
    const payload = JSON.stringify({ userStories: stories, logEntries: logs }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `minor-data-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Revert draft changes
  const handleResetDraft = () => {
    if (confirm("Weet je zeker dat je alle niet-gesynchroniseerde wijzigingen wilt wissen?")) {
      localStorage.removeItem(LOCAL_STORAGE_STORIES_KEY);
      localStorage.removeItem(LOCAL_STORAGE_LOGS_KEY);
      setStories(data.userStories);
      setLogs(data.logEntries);
    }
  };

  // ---------------------------------------------------------------------------
  // View, Filter & Search State
  // ---------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<"board" | "table" | "logboek">("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSprint, setSelectedSprint] = useState<number | "all">("all");
  const [selectedLU, setSelectedLU] = useState<LeeruitkomstId | "all">("all");
  const [selectedType, setSelectedType] = useState<StoryType | "all">("all");

  // Filtering Stories
  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      // Sprint filter
      if (selectedSprint !== "all" && story.sprint !== selectedSprint) {
        return false;
      }
      // Type filter
      if (selectedType !== "all" && story.type !== selectedType) {
        return false;
      }
      // LU filter
      if (selectedLU !== "all") {
        if (!story.leeruitkomsten || !story.leeruitkomsten.includes(selectedLU)) {
          return false;
        }
      }
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = story.id.toLowerCase().includes(q);
        const matchesTitle = story.title.toLowerCase().includes(q);
        const matchesAs = story.asA.toLowerCase().includes(q);
        const matchesWant = story.iWant.toLowerCase().includes(q);
        const matchesSo = story.soThat.toLowerCase().includes(q);
        const matchesCriteria = story.acceptanceCriteria?.some((c) =>
          c.toLowerCase().includes(q)
        );
        if (!matchesId && !matchesTitle && !matchesAs && !matchesWant && !matchesSo && !matchesCriteria) {
          return false;
        }
      }
      return true;
    });
  }, [stories, selectedSprint, selectedType, selectedLU, searchQuery]);

  // Filtering Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((entry) => {
      // Sprint filter
      if (selectedSprint !== "all" && entry.sprint !== selectedSprint) {
        return false;
      }
      // LU filter
      if (selectedLU !== "all") {
        if (!entry.leeruitkomsten || !entry.leeruitkomsten.includes(selectedLU)) {
          return false;
        }
      }
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = entry.id.toLowerCase().includes(q);
        const matchesTitle = entry.title.toLowerCase().includes(q);
        const matchesDesc = entry.description.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [logs, selectedSprint, selectedLU, searchQuery]);

  // Board columns
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

  // ---------------------------------------------------------------------------
  // Story & Log Management (Modals)
  // ---------------------------------------------------------------------------
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [isNewStory, setIsNewStory] = useState(false);

  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
  const [isNewLog, setIsNewLog] = useState(false);

  // Move story between columns
  const handleMoveStory = (storyId: string, direction: "next" | "prev") => {
    if (!isUnlocked) return;
    setStories((prev) =>
      prev.map((s) => {
        if (s.id !== storyId) return s;
        let newStatus = s.status;
        if (direction === "next") {
          if (s.status === "To Do") newStatus = "In Progress";
          else if (s.status === "In Progress") newStatus = "Done";
        } else {
          if (s.status === "Done") newStatus = "In Progress";
          else if (s.status === "In Progress") newStatus = "To Do";
        }
        return { ...s, status: newStatus, updatedAt: new Date().toISOString().slice(0, 10) };
      })
    );
  };

  const handleOpenNewStory = () => {
    const nextNum = stories.length + 1;
    const nextId = `US-${String(nextNum).padStart(2, "0")}`;
    setEditingStory({
      id: nextId,
      sprint: typeof selectedSprint === "number" ? selectedSprint : 1,
      type: "US",
      title: "",
      asA: "student Minor Future-proof met AI",
      iWant: "",
      soThat: "",
      status: "To Do",
      acceptanceCriteria: [],
      leeruitkomsten: [],
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    setIsNewStory(true);
  };

  const handleOpenEditStory = (story: Story) => {
    setEditingStory({ ...story });
    setIsNewStory(false);
  };

  const handleSaveStory = (storyToSave: Story) => {
    if (isNewStory) {
      setStories((prev) => [...prev, storyToSave]);
    } else {
      setStories((prev) =>
        prev.map((s) => (s.id === storyToSave.id ? storyToSave : s))
      );
    }
    setEditingStory(null);
  };

  const handleDeleteStory = (storyId: string) => {
    if (confirm(`Weet je zeker dat je user story ${storyId} wilt verwijderen?`)) {
      setStories((prev) => prev.filter((s) => s.id !== storyId));
      if (editingStory?.id === storyId) setEditingStory(null);
    }
  };

  const handleOpenNewLog = () => {
    const nextNum = logs.length + 1;
    const nextId = `LOG-${String(nextNum).padStart(2, "0")}`;
    setEditingLog({
      id: nextId,
      date: new Date().toISOString().slice(0, 10),
      sprint: typeof selectedSprint === "number" ? selectedSprint : 1,
      title: "",
      description: "",
      leeruitkomsten: [],
      links: [],
    });
    setIsNewLog(true);
  };

  const handleOpenEditLog = (entry: LogEntry) => {
    setEditingLog({ ...entry });
    setIsNewLog(false);
  };

  const handleSaveLog = (logToSave: LogEntry) => {
    if (isNewLog) {
      setLogs((prev) => [logToSave, ...prev]);
    } else {
      setLogs((prev) =>
        prev.map((l) => (l.id === logToSave.id ? logToSave : l))
      );
    }
    setEditingLog(null);
  };

  const handleDeleteLog = (logId: string) => {
    if (confirm(`Weet je zeker dat je logboek item ${logId} wilt verwijderen?`)) {
      setLogs((prev) => prev.filter((l) => l.id !== logId));
      if (editingLog?.id === logId) setEditingLog(null);
    }
  };

  return (
    <div className="planner">
      {/* Header & Status Bar */}
      <div className="planner__header">
        <div className="planner__header-top">
          {/* View Mode Tabs */}
          <div className="planner__view-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "board"}
              className={`planner__tab ${activeTab === "board" ? "planner__tab--active" : ""}`}
              onClick={() => setActiveTab("board")}
            >
              <span>▦ Board</span>
              <span className="planner__tab-badge">{stories.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "table"}
              className={`planner__tab ${activeTab === "table" ? "planner__tab--active" : ""}`}
              onClick={() => setActiveTab("table")}
            >
              <span>☰ Tabel</span>
              <span className="planner__tab-badge">{stories.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "logboek"}
              className={`planner__tab ${activeTab === "logboek" ? "planner__tab--active" : ""}`}
              onClick={() => setActiveTab("logboek")}
            >
              <span>◷ Logboek</span>
              <span className="planner__tab-badge">{logs.length}</span>
            </button>
          </div>

          {/* Security & Action Controls */}
          <div className="planner__auth-bar">
            {isUnlocked ? (
              <>
                <div className="planner__badge planner__badge--unlocked">
                  <span className="planner__dot" />
                  <span>
                    Bewerker: Daan Hessen (
                    {authMethod === "pat" ? "GitHub PAT" : "Tailscale/Local"})
                  </span>
                </div>

                <button
                  type="button"
                  className="planner__btn planner__btn--primary"
                  onClick={activeTab === "logboek" ? handleOpenNewLog : handleOpenNewStory}
                >
                  + {activeTab === "logboek" ? "Nieuwe Log" : "Nieuwe Story"}
                </button>

                {authMethod === "pat" && (
                  <button
                    type="button"
                    className="planner__btn planner__btn--sync"
                    onClick={handleSyncToGitHub}
                    disabled={syncLoading}
                    title="Commit wijzigingen direct naar GitHub main (Vercel deploy)"
                  >
                    {syncLoading ? "Syncen..." : "↑ Sync naar GitHub"}
                  </button>
                )}

                <button
                  type="button"
                  className="planner__btn"
                  onClick={handleExportData}
                  title="Download JSON backup"
                >
                  ↓ Backup
                </button>

                <button
                  type="button"
                  className="planner__btn planner__btn--danger"
                  onClick={handleLock}
                  title="Vergrendel bewerkmodus"
                >
                  Vergrendel
                </button>
              </>
            ) : (
              <>
                <div className="planner__badge">
                  <span className="planner__dot" />
                  <span>🔒 Alleen-lezen (Openbaar)</span>
                </div>
                <button
                  type="button"
                  className="planner__btn planner__btn--primary"
                  onClick={() => setShowAuthModal(true)}
                >
                  Ontgrendel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="planner__toolbar">
          <div className="planner__search-wrap">
            <span className="planner__search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="text"
              className="planner__search"
              placeholder={
                activeTab === "logboek"
                  ? "Zoek in logboek op titel of beschrijving..."
                  : "Zoek stories op ID, titel of inhoud..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="planner__select"
            value={selectedSprint}
            onChange={(e) =>
              setSelectedSprint(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
          >
            <option value="all">Alle Sprints</option>
            {data.sprints.map((s) => (
              <option key={s.number} value={s.number}>
                Sprint {s.number} ({s.status})
              </option>
            ))}
          </select>

          <select
            className="planner__select"
            value={selectedLU}
            onChange={(e) =>
              setSelectedLU(
                e.target.value === "all" ? "all" : (e.target.value as LeeruitkomstId)
              )
            }
          >
            <option value="all">Alle Leeruitkomsten</option>
            {data.leeruitkomsten.map((lu) => (
              <option key={lu.id} value={lu.id}>
                {lu.code}: {lu.title.slice(0, 30)}...
              </option>
            ))}
          </select>

          {activeTab !== "logboek" && (
            <select
              className="planner__select"
              value={selectedType}
              onChange={(e) =>
                setSelectedType(
                  e.target.value === "all" ? "all" : (e.target.value as StoryType)
                )
              }
            >
              <option value="all">Alle Types</option>
              <option value="US">US (User Story)</option>
              <option value="RS">RS (Research Story)</option>
              <option value="LS">LS (Learning Story)</option>
            </select>
          )}
        </div>

        {/* Unsaved Changes / Sync notification */}
        {isDirty && isUnlocked && (
          <div className="planner__unsaved-alert">
            <span>● Je hebt niet-gesynchroniseerde wijzigingen in je concept.</span>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              {authMethod === "pat" && (
                <button
                  type="button"
                  className="planner__btn planner__btn--sync"
                  onClick={handleSyncToGitHub}
                  disabled={syncLoading}
                >
                  {syncLoading ? "Bezig..." : "Nu syncen naar GitHub"}
                </button>
              )}
              <button
                type="button"
                className="planner__btn"
                onClick={handleResetDraft}
              >
                Herstel origineel
              </button>
            </div>
          </div>
        )}

        {syncMessage && (
          <div
            className={`planner__auth-alert planner__auth-alert--${syncMessage.type}`}
          >
            {syncMessage.text}
          </div>
        )}
      </div>

      {/* =====================================================================
          View 1: Kanban Board
          ===================================================================== */}
      {activeTab === "board" && (
        <div className="planner__board">
          {/* Column 1: To Do */}
          <div className="planner__column">
            <div className="planner__column-header">
              <span className="planner__column-title">
                <span className="planner__col-indicator planner__col-indicator--todo" />
                <span>To Do</span>
              </span>
              <span className="planner__column-count">{todoStories.length}</span>
            </div>
            <div className="planner__cards">
              {todoStories.length === 0 ? (
                <div className="planner__empty">Geen items in To Do</div>
              ) : (
                todoStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    isUnlocked={isUnlocked}
                    onMoveRight={() => handleMoveStory(story.id, "next")}
                    onEdit={() => handleOpenEditStory(story)}
                    onDelete={() => handleDeleteStory(story.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="planner__column">
            <div className="planner__column-header">
              <span className="planner__column-title">
                <span className="planner__col-indicator planner__col-indicator--progress" />
                <span>In uitvoering</span>
              </span>
              <span className="planner__column-count">{inProgressStories.length}</span>
            </div>
            <div className="planner__cards">
              {inProgressStories.length === 0 ? (
                <div className="planner__empty">Geen items in uitvoering</div>
              ) : (
                inProgressStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    isUnlocked={isUnlocked}
                    onMoveLeft={() => handleMoveStory(story.id, "prev")}
                    onMoveRight={() => handleMoveStory(story.id, "next")}
                    onEdit={() => handleOpenEditStory(story)}
                    onDelete={() => handleDeleteStory(story.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Column 3: Done */}
          <div className="planner__column">
            <div className="planner__column-header">
              <span className="planner__column-title">
                <span className="planner__col-indicator planner__col-indicator--done" />
                <span>Afgerond</span>
              </span>
              <span className="planner__column-count">{doneStories.length}</span>
            </div>
            <div className="planner__cards">
              {doneStories.length === 0 ? (
                <div className="planner__empty">Geen afgeronde items</div>
              ) : (
                doneStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    isUnlocked={isUnlocked}
                    onMoveLeft={() => handleMoveStory(story.id, "prev")}
                    onEdit={() => handleOpenEditStory(story)}
                    onDelete={() => handleDeleteStory(story.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          View 2: Table View
          ===================================================================== */}
      {activeTab === "table" && (
        <div className="planner__table-wrap">
          <table className="planner__table">
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
                  <td colSpan={isUnlocked ? 7 : 6} className="planner__empty">
                    Geen stories gevonden voor de gekozen filters.
                  </td>
                </tr>
              ) : (
                filteredStories.map((story) => (
                  <tr key={story.id}>
                    <td>
                      <span className="planner__card-id">{story.id}</span>
                    </td>
                    <td>
                      <span
                        className={`planner__pill planner__pill--${story.type.toLowerCase()}`}
                      >
                        {story.type}
                      </span>
                    </td>
                    <td>
                      <span className="planner__pill">Sprint {story.sprint}</span>
                    </td>
                    <td>
                      <div>
                        <strong style={{ color: "var(--fg)" }}>{story.title}</strong>
                        <div
                          style={{
                            fontSize: "0.6875rem",
                            color: "var(--fg-faint)",
                            marginTop: "2px",
                          }}
                        >
                          Als {story.asA}, wil ik {story.iWant}...
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="planner__card-tags">
                        {story.leeruitkomsten?.map((lu) => (
                          <span key={lu} className="planner__lu-tag">
                            {lu}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`planner__status-pill planner__status-pill--${
                          story.status === "Done"
                            ? "done"
                            : story.status === "In Progress"
                            ? "progress"
                            : "todo"
                        }`}
                      >
                        {story.status}
                      </span>
                    </td>
                    {isUnlocked && (
                      <td>
                        <div className="planner__card-btn-group">
                          <button
                            type="button"
                            className="planner__icon-btn"
                            onClick={() => handleOpenEditStory(story)}
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className="planner__icon-btn"
                            onClick={() => handleDeleteStory(story.id)}
                          >
                            ✕
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

      {/* =====================================================================
          View 3: Logboek View
          ===================================================================== */}
      {activeTab === "logboek" && (
        <div className="planner__logboek">
          <div className="planner__logboek-line" />
          {filteredLogs.length === 0 ? (
            <div className="planner__empty">Geen logboek-items gevonden.</div>
          ) : (
            filteredLogs.map((entry) => (
              <div key={entry.id} className="planner__log-item">
                <div className="planner__log-node" />
                <div className="planner__log-card">
                  <div className="planner__log-header">
                    <div className="planner__log-meta">
                      <span className="planner__card-id">{entry.id}</span>
                      <span className="planner__pill">Sprint {entry.sprint}</span>
                      <span className="planner__log-date">{entry.date}</span>
                    </div>
                    {isUnlocked && (
                      <div className="planner__card-btn-group">
                        <button
                          type="button"
                          className="planner__icon-btn"
                          onClick={() => handleOpenEditLog(entry)}
                        >
                          ✎ Bewerk
                        </button>
                        <button
                          type="button"
                          className="planner__icon-btn"
                          onClick={() => handleDeleteLog(entry.id)}
                        >
                          ✕ Verwijder
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 className="planner__log-title">{entry.title}</h3>
                  <p className="planner__log-desc">{entry.description}</p>

                  <div className="planner__card-tags">
                    {entry.leeruitkomsten?.map((lu) => (
                      <span key={lu} className="planner__lu-tag">
                        {lu}
                      </span>
                    ))}
                  </div>

                  {entry.links && entry.links.length > 0 && (
                    <div className="planner__log-links">
                      {entry.links.map((link) => (
                        <a
                          key={link.url + link.label}
                          className="planner__log-link"
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
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* =====================================================================
          Modal: Edit / New Story
          ===================================================================== */}
      {editingStory && (
        <StoryEditModal
          story={editingStory}
          isNew={isNewStory}
          onSave={handleSaveStory}
          onClose={() => setEditingStory(null)}
        />
      )}

      {/* =====================================================================
          Modal: Edit / New Log Entry
          ===================================================================== */}
      {editingLog && (
        <LogEditModal
          entry={editingLog}
          isNew={isNewLog}
          onSave={handleSaveLog}
          onClose={() => setEditingLog(null)}
        />
      )}

      {/* =====================================================================
          Modal: Security & Authentication
          ===================================================================== */}
      {showAuthModal && (
        <div className="planner__modal-backdrop" onClick={() => setShowAuthModal(false)}>
          <div className="planner__modal" onClick={(e) => e.stopPropagation()}>
            <div className="planner__modal-header">
              <h3 className="planner__modal-title">🔐 Beveiligde Bewerkmodus</h3>
              <button
                type="button"
                className="planner__modal-close"
                onClick={() => setShowAuthModal(false)}
              >
                ×
              </button>
            </div>

            <p className="planner__auth-hint">
              Omdat <code>daanhessen.nl/minor</code> openbaar gehost wordt via Vercel,
              kunnen uitsluitend geautoriseerde commits van <strong>Daan Hessen</strong> de
              productiecode en het portfolio muteren.
            </p>

            {/* Option A: Tailscale / Localhost check */}
            {isTailscaleOrLocal && (
              <div className="planner__auth-alert planner__auth-alert--info">
                <strong>✓ Tailscale / Lokaal netwerk gedetecteerd</strong>
                <p style={{ marginTop: "4px" }}>
                  Je bent verbonden via Tailscale of localhost. Je kunt direct lokaal bewerken.
                </p>
                <button
                  type="button"
                  className="planner__btn planner__btn--primary"
                  style={{ marginTop: "8px" }}
                  onClick={handleUnlockLocal}
                >
                  Lokaal bewerken activeren
                </button>
              </div>
            )}

            {/* Option B: GitHub Personal Access Token */}
            <div className="planner__form-field">
              <label className="planner__label">
                GitHub Personal Access Token (PAT)
              </label>
              <input
                type="password"
                className="planner__input"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={authInputPat}
                onChange={(e) => setAuthInputPat(e.target.value)}
              />
              <span className="planner__auth-hint" style={{ marginTop: "4px" }}>
                Token vereist <code>contents:write</code> rechten op{" "}
                <code>{GITHUB_REPO_OWNER}/{GITHUB_REPO_NAME}</code>.
              </span>
            </div>

            {authError && (
              <div className="planner__auth-alert planner__auth-alert--error">
                {authError}
              </div>
            )}

            {authSuccess && (
              <div className="planner__auth-alert planner__auth-alert--success">
                {authSuccess}
              </div>
            )}

            <div className="planner__modal-footer">
              <button
                type="button"
                className="planner__btn"
                onClick={() => setShowAuthModal(false)}
              >
                Annuleren
              </button>
              <button
                type="button"
                className="planner__btn planner__btn--primary"
                onClick={() => handleVerifyPat(authInputPat)}
                disabled={authLoading || !authInputPat.trim()}
              >
                {authLoading ? "Verifiëren..." : "Valideer & Ontgrendel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Subcomponent: StoryCard (Kanban Item)
// -----------------------------------------------------------------------------
interface StoryCardProps {
  story: Story;
  isUnlocked: boolean;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function StoryCard({
  story,
  isUnlocked,
  onMoveLeft,
  onMoveRight,
  onEdit,
  onDelete,
}: StoryCardProps) {
  return (
    <div className="planner__card">
      <div className="planner__card-header">
        <span className="planner__card-id">{story.id}</span>
        <div className="planner__card-meta">
          <span
            className={`planner__pill planner__pill--${story.type.toLowerCase()}`}
          >
            {story.type}
          </span>
          <span className="planner__pill">Sprint {story.sprint}</span>
        </div>
      </div>

      <h4 className="planner__card-title">{story.title}</h4>

      <div className="planner__card-body">
        <div>
          <span className="planner__clause-tag">Als</span>
          {story.asA},
        </div>
        <div>
          <span className="planner__clause-tag">wil ik</span>
          {story.iWant},
        </div>
        <div>
          <span className="planner__clause-tag">zodat</span>
          {story.soThat}.
        </div>
      </div>

      {story.leeruitkomsten && story.leeruitkomsten.length > 0 && (
        <div className="planner__card-tags">
          {story.leeruitkomsten.map((lu) => (
            <span key={lu} className="planner__lu-tag">
              {lu}
            </span>
          ))}
        </div>
      )}

      {story.acceptanceCriteria && story.acceptanceCriteria.length > 0 && (
        <div className="planner__criteria-count">
          <span>✓ {story.acceptanceCriteria.length} acceptatiecriteria</span>
        </div>
      )}

      {isUnlocked && (
        <div className="planner__card-actions">
          <div className="planner__card-btn-group">
            {onMoveLeft && (
              <button
                type="button"
                className="planner__card-move-btn"
                onClick={onMoveLeft}
                title="Verplaats naar links"
              >
                ←
              </button>
            )}
            {onMoveRight && (
              <button
                type="button"
                className="planner__card-move-btn"
                onClick={onMoveRight}
                title="Verplaats naar rechts"
              >
                →
              </button>
            )}
          </div>
          <div className="planner__card-btn-group">
            <button
              type="button"
              className="planner__icon-btn"
              onClick={onEdit}
              title="Bewerk story"
            >
              ✎
            </button>
            <button
              type="button"
              className="planner__icon-btn"
              onClick={onDelete}
              title="Verwijder story"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Subcomponent: StoryEditModal
// -----------------------------------------------------------------------------
interface StoryEditModalProps {
  story: Story;
  isNew: boolean;
  onSave: (story: Story) => void;
  onClose: () => void;
}

function StoryEditModal({ story, isNew, onSave, onClose }: StoryEditModalProps) {
  const [form, setForm] = useState<Story>({ ...story });
  const [criteriaText, setCriteriaText] = useState(
    (story.acceptanceCriteria || []).join("\n")
  );

  const handleToggleLU = (lu: LeeruitkomstId) => {
    setForm((prev) => {
      const current = prev.leeruitkomsten || [];
      const updated = current.includes(lu)
        ? current.filter((item) => item !== lu)
        : [...current, lu];
      return { ...prev, leeruitkomsten: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const criteriaArray = criteriaText
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);

    onSave({
      ...form,
      acceptanceCriteria: criteriaArray,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="planner__modal-backdrop" onClick={onClose}>
      <div className="planner__modal" onClick={(e) => e.stopPropagation()}>
        <div className="planner__modal-header">
          <h3 className="planner__modal-title">
            {isNew ? "+ Nieuwe Story Aanmaken" : `✎ Story ${form.id} Bewerken`}
          </h3>
          <button type="button" className="planner__modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="planner__form" onSubmit={handleSubmit}>
          <div className="planner__form-row planner__form-row--3">
            <div className="planner__form-field">
              <label className="planner__label">Story ID</label>
              <input
                type="text"
                className="planner__input"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                required
              />
            </div>
            <div className="planner__form-field">
              <label className="planner__label">Type</label>
              <select
                className="planner__select"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as StoryType })
                }
              >
                <option value="US">US (User Story)</option>
                <option value="RS">RS (Research Story)</option>
                <option value="LS">LS (Learning Story)</option>
              </select>
            </div>
            <div className="planner__form-field">
              <label className="planner__label">Sprint</label>
              <input
                type="number"
                min={1}
                max={8}
                className="planner__input"
                value={form.sprint}
                onChange={(e) =>
                  setForm({ ...form, sprint: Number(e.target.value) })
                }
                required
              />
            </div>
          </div>

          <div className="planner__form-field">
            <label className="planner__label">Titel</label>
            <input
              type="text"
              className="planner__input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="planner__form-row planner__form-row--3">
            <div className="planner__form-field">
              <label className="planner__label">Als (rol)</label>
              <input
                type="text"
                className="planner__input"
                value={form.asA}
                onChange={(e) => setForm({ ...form, asA: e.target.value })}
                required
              />
            </div>
            <div className="planner__form-field">
              <label className="planner__label">Wil ik (doel)</label>
              <input
                type="text"
                className="planner__input"
                value={form.iWant}
                onChange={(e) => setForm({ ...form, iWant: e.target.value })}
                required
              />
            </div>
            <div className="planner__form-field">
              <label className="planner__label">Zodat (waarde)</label>
              <input
                type="text"
                className="planner__input"
                value={form.soThat}
                onChange={(e) => setForm({ ...form, soThat: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="planner__form-row planner__form-row--2">
            <div className="planner__form-field">
              <label className="planner__label">Status</label>
              <select
                className="planner__select"
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as "To Do" | "In Progress" | "Done",
                  })
                }
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="planner__form-field">
              <label className="planner__label">Leeruitkomsten</label>
              <div className="planner__checkbox-group">
                {ALL_LUS.map((lu) => (
                  <label key={lu} className="planner__checkbox-label">
                    <input
                      type="checkbox"
                      checked={(form.leeruitkomsten || []).includes(lu)}
                      onChange={() => handleToggleLU(lu)}
                    />
                    <span>{lu}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="planner__form-field">
            <label className="planner__label">
              Acceptatiecriteria (1 per regel)
            </label>
            <textarea
              className="planner__textarea"
              placeholder="Bijv: Portfolio subpagina live op daanhessen.nl/minor"
              value={criteriaText}
              onChange={(e) => setCriteriaText(e.target.value)}
            />
          </div>

          <div className="planner__modal-footer">
            <button type="button" className="planner__btn" onClick={onClose}>
              Annuleren
            </button>
            <button type="submit" className="planner__btn planner__btn--primary">
              {isNew ? "Aanmaken" : "Opslaan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Subcomponent: LogEditModal
// -----------------------------------------------------------------------------
interface LogEditModalProps {
  entry: LogEntry;
  isNew: boolean;
  onSave: (entry: LogEntry) => void;
  onClose: () => void;
}

function LogEditModal({ entry, isNew, onSave, onClose }: LogEditModalProps) {
  const [form, setForm] = useState<LogEntry>({ ...entry });
  const [linksText, setLinksText] = useState(
    (entry.links || []).map((l) => `${l.label} | ${l.url} | ${l.type}`).join("\n")
  );

  const handleToggleLU = (lu: LeeruitkomstId) => {
    setForm((prev) => {
      const current = prev.leeruitkomsten || [];
      const updated = current.includes(lu)
        ? current.filter((item) => item !== lu)
        : [...current, lu];
      return { ...prev, leeruitkomsten: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const linksArray: EvidenceLink[] = linksText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split("|").map((p) => p.trim());
        const label = parts[0] || "Link";
        const url = parts[1] || parts[0];
        const type = (parts[2] as EvidenceLink["type"]) || "other";
        return { label, url, type };
      });

    onSave({
      ...form,
      links: linksArray,
    });
  };

  return (
    <div className="planner__modal-backdrop" onClick={onClose}>
      <div className="planner__modal" onClick={(e) => e.stopPropagation()}>
        <div className="planner__modal-header">
          <h3 className="planner__modal-title">
            {isNew ? "+ Nieuw Logboek Item" : `✎ Log ${form.id} Bewerken`}
          </h3>
          <button type="button" className="planner__modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="planner__form" onSubmit={handleSubmit}>
          <div className="planner__form-row planner__form-row--3">
            <div className="planner__form-field">
              <label className="planner__label">Log ID</label>
              <input
                type="text"
                className="planner__input"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                required
              />
            </div>
            <div className="planner__form-field">
              <label className="planner__label">Datum (YYYY-MM-DD)</label>
              <input
                type="date"
                className="planner__input"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div className="planner__form-field">
              <label className="planner__label">Sprint</label>
              <input
                type="number"
                min={1}
                max={8}
                className="planner__input"
                value={form.sprint}
                onChange={(e) =>
                  setForm({ ...form, sprint: Number(e.target.value) })
                }
                required
              />
            </div>
          </div>

          <div className="planner__form-field">
            <label className="planner__label">Titel</label>
            <input
              type="text"
              className="planner__input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="planner__form-field">
            <label className="planner__label">Beschrijving / Reflectie</label>
            <textarea
              className="planner__textarea"
              style={{ minHeight: "7rem" }}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="planner__form-field">
            <label className="planner__label">Leeruitkomsten</label>
            <div className="planner__checkbox-group">
              {ALL_LUS.map((lu) => (
                <label key={lu} className="planner__checkbox-label">
                  <input
                    type="checkbox"
                    checked={(form.leeruitkomsten || []).includes(lu)}
                    onChange={() => handleToggleLU(lu)}
                  />
                  <span>{lu}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="planner__form-field">
            <label className="planner__label">
              Bewijs Links (Formaat: Label | URL | type)
            </label>
            <textarea
              className="planner__textarea"
              placeholder="Bijv: GitHub Repo | https://github.com/... | github"
              value={linksText}
              onChange={(e) => setLinksText(e.target.value)}
            />
          </div>

          <div className="planner__modal-footer">
            <button type="button" className="planner__btn" onClick={onClose}>
              Annuleren
            </button>
            <button type="submit" className="planner__btn planner__btn--primary">
              {isNew ? "Toevoegen" : "Opslaan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
