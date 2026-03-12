import type { Note } from "../types/note";

// PUBLIC_INTERFACE
export function createId(): string {
  /** Create a reasonably unique id for local-only notes. */
  // crypto.randomUUID is widely supported; fallback keeps things working in older environments.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `note_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// PUBLIC_INTERFACE
export function normalizeTag(tag: string): string {
  /** Normalize a tag (trim, collapse spaces, lowercase). */
  return tag
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

// PUBLIC_INTERFACE
export function containsQuery(note: Note, query: string): boolean {
  /** True if query matches title/content/tags (case-insensitive). */
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = `${note.title}\n${note.content}\n${note.tags.join(" ")}`.toLowerCase();
  return haystack.includes(q);
}
