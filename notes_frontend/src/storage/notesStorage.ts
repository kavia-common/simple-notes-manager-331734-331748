import type { Note } from "../types/note";

const STORAGE_KEY = "simple-notes-manager:v1:notes";

type StoredPayload = {
  version: 1;
  notes: Note[];
};

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function loadNotesFromStorage(): Note[] {
  /** Load notes from localStorage; returns [] if missing/corrupt. */
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  const payload = safeJsonParse<StoredPayload>(raw);
  if (!payload || payload.version !== 1 || !Array.isArray(payload.notes)) return [];

  // Basic normalization to avoid runtime errors.
  return payload.notes
    .filter((n) => n && typeof n.id === "string")
    .map((n) => ({
      id: String(n.id),
      title: typeof n.title === "string" ? n.title : "",
      content: typeof n.content === "string" ? n.content : "",
      tags: Array.isArray(n.tags) ? n.tags.filter((t) => typeof t === "string") : [],
      createdAt: typeof n.createdAt === "number" ? n.createdAt : Date.now(),
      updatedAt: typeof n.updatedAt === "number" ? n.updatedAt : Date.now()
    }));
}

// PUBLIC_INTERFACE
export function saveNotesToStorage(notes: Note[]): void {
  /** Persist notes to localStorage. */
  if (typeof window === "undefined") return;
  const payload: StoredPayload = { version: 1, notes };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

// PUBLIC_INTERFACE
export function clearNotesStorage(): void {
  /** Remove notes from localStorage. */
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
