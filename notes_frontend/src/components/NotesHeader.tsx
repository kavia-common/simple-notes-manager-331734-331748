import React from "react";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  onClearAll: () => void;
};

export function NotesHeader(props: Props) {
  const { query, onQueryChange, tags, activeTag, onTagChange, onClearAll } = props;

  return (
    <header className="header">
      <div className="container headerInner">
        <div className="brand">
          <div className="brandMark" aria-hidden="true" />
          <div className="brandText">
            <h1 className="title">Simple Notes</h1>
            <p className="subtitle">Fast, local, and private.</p>
          </div>
        </div>

        <div className="headerActions">
          <label className="search" aria-label="Search notes">
            <span className="searchIcon" aria-hidden="true">
              ⌕
            </span>
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search notes..."
              className="searchInput"
              type="search"
            />
          </label>

          <button className="button buttonGhost" type="button" onClick={onClearAll}>
            Clear all
          </button>
        </div>
      </div>

      <div className="container headerFilters" aria-label="Tag filters">
        <button
          type="button"
          className={`chip ${activeTag === null ? "chipActive" : ""}`}
          onClick={() => onTagChange(null)}
        >
          All
        </button>
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            className={`chip ${activeTag === t ? "chipActive" : ""}`}
            onClick={() => onTagChange(t)}
            title={`Filter by tag: ${t}`}
          >
            #{t}
          </button>
        ))}
      </div>
    </header>
  );
}
