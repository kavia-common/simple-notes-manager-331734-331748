import React from "react";
import type { Note } from "../types/note";
import { NoteCard } from "./NoteCard";

type EmptyState = {
  title: string;
  description: string;
};

type Props = {
  notes: Note[];
  emptyState: EmptyState;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
};

export function NotesList(props: Props) {
  const { notes, emptyState, onEdit, onDelete } = props;

  if (notes.length === 0) {
    return (
      <section className="empty">
        <h2 className="emptyTitle">{emptyState.title}</h2>
        <p className="emptyDescription">{emptyState.description}</p>
      </section>
    );
  }

  return (
    <section className="notesGrid" aria-label="Notes">
      {notes.map((n) => (
        <NoteCard key={n.id} note={n} onEdit={() => onEdit(n)} onDelete={() => onDelete(n)} />
      ))}
    </section>
  );
}
