import React, { useEffect, useMemo, useRef, useState } from "react";
import type { NoteDraft } from "../types/note";
import { normalizeTag } from "../utils/noteUtils";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  draft: NoteDraft;
  onDraftChange: (draft: NoteDraft) => void;
  onClose: () => void;
  onSave: () => void;
};

function tagsToInput(tags: string[]): string {
  return tags.join(", ");
}

function inputToTags(value: string): string[] {
  return value
    .split(",")
    .map((t) => normalizeTag(t))
    .filter(Boolean);
}

export function NoteEditorModal(props: Props) {
  const { open, mode, draft, onDraftChange, onClose, onSave } = props;

  const [tagsInput, setTagsInput] = useState(tagsToInput(draft.tags));
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // keep tags field in sync when switching notes
    setTagsInput(tagsToInput(draft.tags));
  }, [draft.tags, open]);

  useEffect(() => {
    if (open) {
      // Focus title field for faster entry
      setTimeout(() => titleRef.current?.focus(), 0);
    }
  }, [open]);

  const canSave = useMemo(() => {
    return Boolean(draft.title.trim() || draft.content.trim());
  }, [draft.title, draft.content]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") {
        if (canSave) onSave();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, onSave, canSave]);

  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="Note editor">
      <div className="modal">
        <div className="modalHeader">
          <div>
            <h2 className="modalTitle">{mode === "create" ? "New note" : "Edit note"}</h2>
            <p className="modalSubtitle">Tip: Ctrl/⌘ + Enter to save</p>
          </div>

          <button className="iconButton" type="button" onClick={onClose} aria-label="Close editor">
            ✕
          </button>
        </div>

        <div className="modalBody">
          <label className="field">
            <span className="fieldLabel">Title</span>
            <input
              ref={titleRef}
              className="input"
              value={draft.title}
              onChange={(e) => onDraftChange({ ...draft, title: e.target.value })}
              placeholder="Untitled"
              maxLength={80}
            />
          </label>

          <label className="field">
            <span className="fieldLabel">Content</span>
            <textarea
              className="textarea"
              value={draft.content}
              onChange={(e) => onDraftChange({ ...draft, content: e.target.value })}
              placeholder="Write something..."
              rows={10}
            />
          </label>

          <label className="field">
            <span className="fieldLabel">Tags</span>
            <input
              className="input"
              value={tagsInput}
              onChange={(e) => {
                const value = e.target.value;
                setTagsInput(value);
                onDraftChange({ ...draft, tags: inputToTags(value) });
              }}
              placeholder="e.g. work, personal, ideas"
            />
            <span className="fieldHint">Comma-separated, stored in lowercase.</span>
          </label>
        </div>

        <div className="modalFooter">
          <button className="button buttonGhost" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="button buttonPrimary" type="button" onClick={onSave} disabled={!canSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
