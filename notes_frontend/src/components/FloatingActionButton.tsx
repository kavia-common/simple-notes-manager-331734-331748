import React from "react";

type Props = {
  onClick: () => void;
  ariaLabel: string;
};

export function FloatingActionButton({ onClick, ariaLabel }: Props) {
  return (
    <button className="fab" type="button" onClick={onClick} aria-label={ariaLabel} title={ariaLabel}>
      +
    </button>
  );
}
