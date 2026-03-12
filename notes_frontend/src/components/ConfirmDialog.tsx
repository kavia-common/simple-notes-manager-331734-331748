import React from "react";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  tone?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog(props: Props) {
  const { open, title, description, confirmText, cancelText, tone = "default", onCancel, onConfirm } =
    props;

  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="Confirmation dialog">
      <div className="modal modalSmall">
        <div className="modalHeader">
          <div>
            <h2 className="modalTitle">{title}</h2>
            <p className="modalSubtitle">{description}</p>
          </div>
        </div>

        <div className="modalFooter">
          <button className="button buttonGhost" type="button" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`button ${tone === "danger" ? "buttonDanger" : "buttonPrimary"}`}
            type="button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
