import { useCallback, useEffect, useMemo, useState } from "react";
import type { Note, NoteDraft, NotePatch } from "../types/note";
import { clearNotesStorage, loadNotesFromStorage, saveNotesToStorage } from "../storage/notesStorage";
import { createId, normalizeTag } from "../utils/noteUtils";

// PUBLIC_INTERFACE
export function useNotes() {
  /** CRUD + persistence for notes stored in browser localStorage. */
  const [notes, setNotes] = useState<Note[]>(() => loadNotesFromStorage());

  useEffect(() => {
    saveNotesToStorage(notes);
  }, [notes]);

  const createNote = useCallback((draft: NoteDraft) => {
    const now = Date.now();
    const tags = draft.tags.map(normalizeTag).filter(Boolean);

    const note: Note = {
      id: createId(),
      title: draft.title.trim(),
      content: draft.content.trim(),
      tags,
      createdAt: now,
      updatedAt: now
    };

    setNotes((prev) => [note, ...prev]);
  }, []);

  const updateNote = useCallback((id: string, patch: NotePatch) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const next: Note = {
          ...n,
          ...patch,
          title: typeof patch.title === "string" ? patch.title : n.title,
          content: typeof patch.content === "string" ? patch.content : n.content,
          tags: Array.isArray(patch.tags) ? patch.tags : n.tags,
          updatedAt: Date.now()
        };
        return next;
      })
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotes = useCallback(() => {
    setNotes([]);
    clearNotesStorage();
  }, []);

  const notesCount = useMemo(() => notes.length, [notes]);

  return { notes, notesCount, createNote, updateNote, deleteNote, clearAllNotes };
}
