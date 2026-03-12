import React, { useMemo, useState } from "react";
import { NotesHeader } from "./components/NotesHeader";
import { NotesList } from "./components/NotesList";
import { NoteEditorModal } from "./components/NoteEditorModal";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { FloatingActionButton } from "./components/FloatingActionButton";
import { useNotes } from "./hooks/useNotes";
import type { Note, NoteDraft } from "./types/note";
import { containsQuery, normalizeTag } from "./utils/noteUtils";

function createEmptyDraft(): NoteDraft {
  return { title: "", content: "", tags: [] };
}

// PUBLIC_INTERFACE
export default function App() {
  /** Notes application root: manages UI state and connects components to note storage. */
  const { notes, createNote, updateNote, deleteNote, clearAllNotes } = useNotes();

  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editorDraft, setEditorDraft] = useState<NoteDraft>(createEmptyDraft());

  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; note?: Note }>(
    { open: false }
  );

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const n of notes) for (const t of n.tags) set.add(t);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const q = query.trim();
    return notes.filter((n) => {
      if (activeTag && !n.tags.includes(activeTag)) return false;
      if (!q) return true;
      return containsQuery(n, q);
    });
  }, [notes, query, activeTag]);

  const openCreate = () => {
    setEditingNoteId(null);
    setEditorDraft(createEmptyDraft());
    setIsEditorOpen(true);
  };

  const openEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditorDraft({ title: note.title, content: note.content, tags: note.tags });
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
  };

  const handleSaveDraft = () => {
    const title = editorDraft.title.trim();
    const content = editorDraft.content.trim();
    const tags = editorDraft.tags.map(normalizeTag).filter(Boolean);

    if (!title && !content) return;

    if (editingNoteId) {
      updateNote(editingNoteId, { title, content, tags });
    } else {
      createNote({ title, content, tags });
    }
    closeEditor();
  };

  const requestDelete = (note: Note) => setConfirmDelete({ open: true, note });

  const confirmDeleteNow = () => {
    if (confirmDelete.note) deleteNote(confirmDelete.note.id);
    setConfirmDelete({ open: false });
  };

  return (
    <div className="appShell">
      <NotesHeader
        query={query}
        onQueryChange={setQuery}
        tags={allTags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        onClearAll={clearAllNotes}
      />

      <main className="container">
        <NotesList
          notes={filteredNotes}
          emptyState={{
            title: notes.length === 0 ? "No notes yet" : "No matching notes",
            description:
              notes.length === 0
                ? "Create your first note using the + button."
                : "Try a different search or clear the tag filter."
          }}
          onEdit={openEdit}
          onDelete={requestDelete}
        />
      </main>

      <FloatingActionButton onClick={openCreate} ariaLabel="Create note" />

      <NoteEditorModal
        open={isEditorOpen}
        mode={editingNoteId ? "edit" : "create"}
        draft={editorDraft}
        onDraftChange={setEditorDraft}
        onClose={closeEditor}
        onSave={handleSaveDraft}
      />

      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete note?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        tone="danger"
        onCancel={() => setConfirmDelete({ open: false })}
        onConfirm={confirmDeleteNow}
      />
    </div>
  );
}
