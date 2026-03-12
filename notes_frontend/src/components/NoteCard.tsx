import React, { useMemo } from "react";
import type { Note } from "../types/note";

type Props = {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function NoteCard({ note, onEdit, onDelete }: Props) {
  const preview = useMemo(() => {
    const txt = note.content.trim();
    if (!txt) return "—";
    return txt.length > 140 ? `${txt.slice(0, 140)}…` : txt;
  }, [note.content]);

  return (
    <article className="card" aria-label={`Note: ${note.title || "Untitled"}`}>
      <div className="cardHeader">
        <h3 className="cardTitle">{note.title || "Untitled"}</h3>
        <div className="cardActions">
          <button className="iconButton" type="button" onClick={onEdit} aria-label="Edit note">
            ✎
          </button>
          <button
            className="iconButton danger"
            type="button"
            onClick={onDelete}
            aria-label="Delete note"
          >
            🗑
          </button>
        </div>
      </div>

      <p className="cardPreview">{preview}</p>

      {note.tags.length > 0 ? (
        <div className="tagRow" aria-label="Tags">
          {note.tags.slice(0, 4).map((t) => (
            <span className="tag" key={t}>
              #{t}
            </span>
          ))}
          {note.tags.length > 4 ? <span className="tag tagMore">+{note.tags.length - 4}</span> : null}
        </div>
      ) : null}

      <div className="cardMeta">
        <span title={`Updated: ${formatDate(note.updatedAt)}`}>Updated {formatDate(note.updatedAt)}</span>
      </div>
    </article>
  );
}
